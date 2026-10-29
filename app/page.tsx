'use client';

import React, { useState, useEffect, useMemo } from 'react';
import TopHeader from '@/components/TopHeader';
import LeftSidebar from '@/components/LeftSidebar';
import CommercialSimulator from '@/components/CommercialSimulator';
import CostAdminPanel from '@/components/CostAdminPanel';
import ComparativeAnalysis from '@/components/ComparativeAnalysis';
import AiProposalGenerator from '@/components/AiProposalGenerator';
import PrintableProposal from '@/components/PrintableProposal';
import PrinterCatalog from '@/components/PrinterCatalog';
import AdminCrmDashboard from '@/components/AdminCrmDashboard';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import {
  PrinterModelId,
  AllModelsCostSettings,
  GlobalFinancialParams,
  ClientScenario,
  GeneratedProposal,
  LeadRecord,
  OpportunityRecord,
} from '@/lib/types';
import { INITIAL_BLANK_COSTS } from '@/lib/data/printerModels';
import { runFinancialSimulation } from '@/lib/calculations/financial';
import { testConnection } from '@/lib/firebase';

const DEFAULT_GLOBAL_PARAMS: GlobalFinancialParams = {
  originState: 'RJ',
  defaultMarginPercent: 40,
  monthlyInterestRatePercent: 0.99,
  lessorTaxRegime: 'lucro_real',
};

const DEFAULT_CLIENT_SCENARIO: ClientScenario = {
  clientName: 'Confecção Estampa Brasil Ltda',
  cnpj: '12.345.678/0001-99',
  contactPerson: 'Carlos Eduardo Mendes',
  email: 'carlos@estampabrasil.com.br',
  phone: '(47) 99876-5432',
  destinationUf: 'SC',
  clientTaxRegime: 'lucro_real',
  monthlyProductionM2: 1500,
  sellingPricePerM2: 25.0,
  inkAndPaperCostPerM2: 4.5,
  operationalCosts: 0,
  selectedTermMonths: 36,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'admin' | 'proposal' | 'comparative' | 'catalog' | 'crm'>('simulator');
  const [selectedModelId, setSelectedModelId] = useState<PrinterModelId>('F6470');
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lead / Identificação do Usuário
  const [currentLead, setCurrentLead] = useState<LeadRecord | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Custos iniciam em branco conforme solicitado pelo usuário
  const [costSettings, setCostSettings] = useState<AllModelsCostSettings>(INITIAL_BLANK_COSTS);
  const [globalParams, setGlobalParams] = useState<GlobalFinancialParams>(DEFAULT_GLOBAL_PARAMS);
  const [clientScenario, setClientScenario] = useState<ClientScenario>(DEFAULT_CLIENT_SCENARIO);
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);

  // Inicializar teste de conexão Firestore e carregar cache local
  useEffect(() => {
    testConnection();

    try {
      const savedCosts = localStorage.getItem('epson_cost_settings');
      const savedParams = localStorage.getItem('epson_global_params');
      const savedLead = localStorage.getItem('epson_current_lead');

      if (savedLead) {
        try {
          const parsedLead = JSON.parse(savedLead) as LeadRecord;
          setTimeout(() => {
            setCurrentLead(parsedLead);
            setClientScenario((prev) => ({
              ...prev,
              clientName: parsedLead.company ? `${parsedLead.name} (${parsedLead.company})` : parsedLead.name,
              contactPerson: parsedLead.name,
              email: parsedLead.email,
              phone: parsedLead.phone,
              destinationUf: parsedLead.state || prev.destinationUf,
            }));
          }, 0);
        } catch (e) {}
      } else {
        // Se ainda não se identificou, abre o modal de onboarding para captação do Lead
        const timer = setTimeout(() => {
          setIsLeadModalOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }

      if (savedCosts || savedParams) {
        setTimeout(() => {
          if (savedCosts) {
            setCostSettings(JSON.parse(savedCosts));
          }
          if (savedParams) {
            setGlobalParams(JSON.parse(savedParams));
          }
        }, 0);
      }
    } catch (e) {
      console.warn('Erro ao carregar do localStorage', e);
    }
  }, []);

  // Simulação matemática em tempo real
  const simulation = useMemo(() => {
    return runFinancialSimulation({
      modelId: selectedModelId,
      costSettings: costSettings[selectedModelId],
      globalParams,
      clientScenario,
    });
  }, [selectedModelId, costSettings, globalParams, clientScenario]);

  const handleResetScenario = () => {
    setClientScenario(DEFAULT_CLIENT_SCENARIO);
    setProposal(null);
  };

  const handleSelectModelAndSimulate = (modelId: PrinterModelId) => {
    setSelectedModelId(modelId);
    setActiveTab('simulator');
  };

  const handleLeadCaptured = (lead: LeadRecord) => {
    setCurrentLead(lead);
    setClientScenario((prev) => ({
      ...prev,
      clientName: lead.company ? `${lead.name} (${lead.company})` : lead.name,
      contactPerson: lead.name,
      email: lead.email,
      phone: lead.phone,
      destinationUf: lead.state || prev.destinationUf,
    }));
  };

  const handleLoadOpportunityToSimulator = (opp: OpportunityRecord) => {
    if (opp.printerModel === 'F6470' || opp.printerModel === 'F9570' || opp.printerModel === 'F20070') {
      setSelectedModelId(opp.printerModel as PrinterModelId);
    }
    setClientScenario((prev) => ({
      ...prev,
      clientName: opp.clientCompany ? `${opp.clientName} (${opp.clientCompany})` : opp.clientName,
      contactPerson: opp.clientName,
      email: opp.clientEmail,
      phone: opp.clientPhone || prev.phone,
      destinationUf: opp.destinationUf || prev.destinationUf,
      selectedTermMonths: (opp.termMonths as any) || prev.selectedTermMonths,
      monthlyProductionM2: opp.monthlyProductionM2 || prev.monthlyProductionM2,
    }));
    setActiveTab('simulator');
  };

  // Se o modo de visualização de impressão estiver aberto
  if (isPrintViewOpen) {
    return (
      <PrintableProposal
        simulation={simulation}
        clientScenario={clientScenario}
        proposal={proposal}
        onBack={() => setIsPrintViewOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Menu Lateral do Lado Esquerdo */}
      <LeftSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModelId={selectedModelId}
        setSelectedModelId={setSelectedModelId}
        costSettings={costSettings}
        simulation={simulation}
        hasProposal={Boolean(proposal)}
        currentLead={currentLead}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
        onOpenPrintView={() => setIsPrintViewOpen(true)}
        onResetClientScenario={handleResetScenario}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Área de Conteúdo Principal (à direita da barra lateral no desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-80 transition-all">
        {/* Barra Superior */}
        <TopHeader
          selectedModelId={selectedModelId}
          costSettings={costSettings}
          currentLead={currentLead}
          onOpenLeadModal={() => setIsLeadModalOpen(true)}
          onGoToCrm={() => setActiveTab('crm')}
          onResetClientScenario={handleResetScenario}
          onOpenPrintView={() => setIsPrintViewOpen(true)}
          onGoToAdmin={() => setActiveTab('admin')}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Área Principal de Trabalho (Ampla, Limpa e Despoluída) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'simulator' && (
            <CommercialSimulator
              selectedModelId={selectedModelId}
              setSelectedModelId={setSelectedModelId}
              costSettings={costSettings}
              setCostSettings={setCostSettings}
              globalParams={globalParams}
              clientScenario={clientScenario}
              setClientScenario={setClientScenario}
              simulation={simulation}
              onGoToProposal={() => setActiveTab('proposal')}
              onGoToAdmin={() => setActiveTab('admin')}
              onOpenLeadModal={() => setIsLeadModalOpen(true)}
              onGoToCrm={() => setActiveTab('crm')}
              onGoToCatalog={() => setActiveTab('catalog')}
            />
          )}

          {activeTab === 'crm' && (
            <AdminCrmDashboard
              onLoadOpportunityToSimulator={handleLoadOpportunityToSimulator}
            />
          )}

          {activeTab === 'admin' && (
            <CostAdminPanel
              costSettings={costSettings}
              setCostSettings={setCostSettings}
              globalParams={globalParams}
              setGlobalParams={setGlobalParams}
              onSelectModelAndSimulate={handleSelectModelAndSimulate}
            />
          )}

          {activeTab === 'proposal' && (
            <AiProposalGenerator
              simulation={simulation}
              clientScenario={clientScenario}
              proposal={proposal}
              setProposal={setProposal}
              onOpenPrintView={() => setIsPrintViewOpen(true)}
            />
          )}

          {activeTab === 'comparative' && (
            <ComparativeAnalysis
              simulation={simulation}
              clientScenario={clientScenario}
              onGoToProposal={() => setActiveTab('proposal')}
              onOpenPrintView={() => setIsPrintViewOpen(true)}
            />
          )}

          {activeTab === 'catalog' && (
            <PrinterCatalog
              onSelectModelAndSimulate={handleSelectModelAndSimulate}
              costSettings={costSettings}
            />
          )}
        </main>

        {/* Rodapé Corporativo Discreto */}
        <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 mt-auto">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">EPSON SureColor® Sublimação</span>
              <span>•</span>
              <span>Modelos F6470, F9570 e F20070</span>
            </div>
            <div>
              <span>Divisão de Impressão Industrial & Comercial • Faturamento RJ • Base de Dados Segura</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal de Identificação e Cadastro do Lead / Cliente */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onLeadCaptured={handleLeadCaptured}
        currentLead={currentLead}
      />
    </div>
  );
}
