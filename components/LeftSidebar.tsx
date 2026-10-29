'use client';

import React from 'react';
import {
  Calculator,
  SlidersHorizontal,
  Sparkles,
  Scale,
  Printer,
  ChevronRight,
  FileText,
  Users,
  UserCheck,
  UserPlus,
  RotateCcw,
  X,
  Layers,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PrinterModelId, AllModelsCostSettings, SimulationResult, LeadRecord } from '@/lib/types';
import { PRINTER_MODELS } from '@/lib/data/printerModels';

interface LeftSidebarProps {
  activeTab: 'simulator' | 'admin' | 'proposal' | 'comparative' | 'catalog' | 'crm';
  setActiveTab: (tab: 'simulator' | 'admin' | 'proposal' | 'comparative' | 'catalog' | 'crm') => void;
  selectedModelId: PrinterModelId;
  setSelectedModelId: (modelId: PrinterModelId) => void;
  costSettings: AllModelsCostSettings;
  simulation: SimulationResult;
  hasProposal: boolean;
  currentLead?: LeadRecord | null;
  onOpenLeadModal: () => void;
  onOpenPrintView: () => void;
  onResetClientScenario: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function LeftSidebar({
  activeTab,
  setActiveTab,
  selectedModelId,
  setSelectedModelId,
  costSettings,
  simulation,
  hasProposal,
  currentLead,
  onOpenLeadModal,
  onOpenPrintView,
  onResetClientScenario,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: LeftSidebarProps) {
  const models: PrinterModelId[] = ['F6470', 'F9570', 'F20070'];
  const configuredModelsCount = models.filter(
    (m) => costSettings[m].hwNet !== null && (costSettings[m].hwNet ?? 0) > 0
  ).length;

  const currentModel = PRINTER_MODELS[selectedModelId];
  const currentCost = costSettings[selectedModelId];
  const isCurrentModelConfigured = currentCost.hwNet !== null && (currentCost.hwNet ?? 0) > 0;

  const menuItems = [
    {
      id: 'simulator' as const,
      label: 'Simulador Comercial',
      badge: 'Principal',
      badgeColor: 'bg-blue-100 text-[#003399]',
      desc: 'Cálculo de parcelas & amortização',
      icon: Calculator,
    },
    {
      id: 'crm' as const,
      label: 'CRM & Oportunidades',
      badge: 'Banco de Dados',
      badgeColor: 'bg-purple-100 text-purple-800',
      desc: 'Leads, clientes e histórico',
      icon: Users,
    },
    {
      id: 'admin' as const,
      label: 'Painel de Custos',
      badge: configuredModelsCount === 3 ? '3/3 OK' : `${configuredModelsCount}/3 Config`,
      badgeColor:
        configuredModelsCount === 3
          ? 'bg-emerald-100 text-emerald-800'
          : configuredModelsCount > 0
          ? 'bg-amber-100 text-amber-800'
          : 'bg-rose-100 text-rose-800',
      desc: 'Entrada manual HW Net & taxas',
      icon: SlidersHorizontal,
    },
    {
      id: 'proposal' as const,
      label: 'Proposta com IA',
      badge: hasProposal ? 'Pronta' : 'Gemini 2.5',
      badgeColor: hasProposal ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800',
      desc: 'Pitch, WhatsApp e proposta formal',
      icon: Sparkles,
    },
    {
      id: 'comparative' as const,
      label: 'Locação x Compra',
      badge: 'OPEX',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      desc: 'Vantagens fiscais & cabeça inclusa',
      icon: Scale,
    },
    {
      id: 'catalog' as const,
      label: 'Linha de Produtos',
      badge: 'Catálogo',
      badgeColor: 'bg-slate-100 text-slate-700',
      desc: 'UV, Têxtil, DTF, DTG e Signage',
      icon: Printer,
    },
  ];

  const handleNavClick = (tabId: any) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop Mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Menu Lateral Esquerdo (Left Sidebar) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 lg:w-80 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Cabeçalho da Barra Lateral */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#003399] text-white font-black tracking-widest text-lg px-2.5 py-1 rounded shadow-xs flex items-center gap-1.5">
              <span>EPSON</span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 tracking-wide flex items-center gap-1.5">
                <span>LOCAÇÃO TÊXTIL</span>
                <span className="text-[9px] uppercase font-bold text-blue-700 bg-blue-100 px-1 py-0.2 rounded">
                  Pro
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Simulador & Propostas SureColor®
              </p>
            </div>
          </div>

          {/* Botão Fechar no Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Rolagem Interna */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Status do Cliente / Lead Identificado */}
          <div className="p-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900">
                Cliente Atual
              </span>
              {currentLead ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Identificado
                </span>
              ) : (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> Não identificado
                </span>
              )}
            </div>

            {currentLead ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentLead.name}
                </p>
                {currentLead.company && (
                  <p className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    {currentLead.company}
                  </p>
                )}
                <div className="pt-2 flex items-center justify-between text-[10px] text-blue-700 font-medium">
                  <span>{currentLead.phone}</span>
                  <button
                    onClick={onOpenLeadModal}
                    className="hover:underline font-bold text-blue-800"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-600">
                  Identifique o cliente para personalizar a proposta e salvar oportunidades no CRM.
                </p>
                <button
                  onClick={onOpenLeadModal}
                  className="w-full py-1.5 px-2.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Identificar Cliente</span>
                </button>
              </div>
            )}
          </div>

          {/* Navegação Principal */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
              Navegação
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group relative border ${
                      isActive
                        ? 'bg-blue-50/90 border-blue-200 text-[#003399] shadow-xs font-semibold'
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 transition ${
                        isActive
                          ? 'bg-[#003399] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#003399]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold leading-none ${isActive ? 'text-[#003399]' : 'text-slate-900'}`}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              item.badgeColor || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        {item.desc}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition self-center ${
                        isActive ? 'text-[#003399] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Seletor Rápido de Modelo Têxtil */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
              <span>Modelo em Foco</span>
              <span className="text-blue-700 font-bold">{selectedModelId}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {models.map((id) => {
                const isSelected = selectedModelId === id;
                const cost = costSettings[id];
                const filled = cost.hwNet !== null && (cost.hwNet ?? 0) > 0;

                return (
                  <button
                    key={id}
                    onClick={() => setSelectedModelId(id)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#003399] border-[#003399] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{id}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        filled
                          ? isSelected
                            ? 'bg-emerald-300'
                            : 'bg-emerald-500'
                          : isSelected
                          ? 'bg-amber-300'
                          : 'bg-amber-500'
                      }`}
                      title={filled ? 'Custo HW Net preenchido' : 'Custo em branco'}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumo Financeiro da Parcela Ativa */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Parcela ({simulation.selectedTerm.months}x)
              </span>
              <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                Tabela Price
              </span>
            </div>

            <div>
              <div className="text-lg font-black text-[#003399]">
                R${' '}
                {simulation.selectedTerm.monthlyInstallment.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="text-xs font-normal text-slate-500"> /mês</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Custo locação:{' '}
                <strong className="text-slate-700">
                  R$ {simulation.selectedTerm.costPerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/m²
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] flex items-center justify-between text-slate-600">
              <span>Base Financiada:</span>
              <span className="font-bold text-slate-900">
                R$ {simulation.totalFinancedBase.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé da Barra Lateral */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-2">
          <button
            onClick={onOpenPrintView}
            className="w-full py-2.5 px-3 text-xs font-bold rounded-lg bg-[#003399] text-white hover:bg-blue-800 transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Visualizar Proposta PDF</span>
          </button>

          <button
            onClick={onResetClientScenario}
            className="w-full py-1.5 px-3 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition flex items-center justify-center gap-1.5"
            title="Limpar formulário e redefinir cenário"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Redefinir Dados</span>
          </button>

          <div className="text-[10px] text-center text-slate-400 pt-1">
            Epson Specialist Partner • Sublimação
          </div>
        </div>
      </aside>
    </>
  );
}
