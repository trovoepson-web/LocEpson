'use client';

import React from 'react';
import {
  Calculator,
  SlidersHorizontal,
  Sparkles,
  Scale,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Users
} from 'lucide-react';
import { PrinterModelId, AllModelsCostSettings, SimulationResult } from '@/lib/types';
import { PRINTER_MODELS } from '@/lib/data/printerModels';

interface RightNavProps {
  activeTab: 'simulator' | 'admin' | 'proposal' | 'comparative' | 'catalog' | 'crm';
  setActiveTab: (tab: 'simulator' | 'admin' | 'proposal' | 'comparative' | 'catalog' | 'crm') => void;
  selectedModelId: PrinterModelId;
  setSelectedModelId: (modelId: PrinterModelId) => void;
  costSettings: AllModelsCostSettings;
  simulation: SimulationResult;
  hasProposal: boolean;
  onOpenPrintView: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function RightNav({
  activeTab,
  setActiveTab,
  selectedModelId,
  setSelectedModelId,
  costSettings,
  simulation,
  hasProposal,
  onOpenPrintView,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: RightNavProps) {
  const models: PrinterModelId[] = ['F6470', 'F9570', 'F20070'];
  const configuredModelsCount = models.filter(
    (m) => costSettings[m].hwNet !== null && (costSettings[m].hwNet ?? 0) > 0
  ).length;

  const currentModelCost = costSettings[selectedModelId];
  const hasCurrentCost = currentModelCost.hwNet !== null && currentModelCost.hwNet > 0;

  const menuItems = [
    {
      id: 'simulator' as const,
      label: 'Simulador Comercial',
      badge: 'Principal',
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
      badge: configuredModelsCount < 3 ? 'Atenção' : 'OK',
      badgeColor: configuredModelsCount < 3 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800',
      desc: 'Entrada manual de HW Net & taxas',
      icon: SlidersHorizontal,
    },
    {
      id: 'proposal' as const,
      label: 'Proposta com IA',
      badge: hasProposal ? 'Pronta' : 'Gemini',
      badgeColor: hasProposal ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800',
      desc: 'Pitch, WhatsApp e e-mail formal',
      icon: Sparkles,
    },
    {
      id: 'comparative' as const,
      label: 'Locação x Compra',
      badge: 'OPEX',
      desc: 'Vantagens fiscais & cabeça inclusa',
      icon: Scale,
    },
    {
      id: 'catalog' as const,
      label: 'Linha de Produtos',
      badge: 'Catálogo',
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
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Barra de Navegação Lateral Direita */}
      <aside
        className={`fixed lg:sticky top-16 right-0 z-40 w-72 lg:w-80 h-[calc(100vh-4rem)] bg-white border-l border-slate-200 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-6">
          {/* Título da Seção do Menu */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Menu de Operação
            </div>

            {/* Lista de Abas */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group relative border ${
                      isActive
                        ? 'bg-blue-50/80 border-blue-200 text-[#003399] shadow-xs'
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
                      className={`w-4 h-4 shrink-0 transition ${
                        isActive ? 'text-[#003399] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Troca Rápida de Modelo Têxtil */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Modelo em Simulação</span>
              <span className="text-blue-600 font-bold">{selectedModelId}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {models.map((id) => {
                const isSelected = selectedModelId === id;
                const cost = costSettings[id];
                const filled = cost.hwNet !== null && cost.hwNet > 0;

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
                        filled ? (isSelected ? 'bg-emerald-300' : 'bg-emerald-500') : (isSelected ? 'bg-amber-300' : 'bg-amber-500')
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Resumo do Contrato Ativo */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Resumo da Parcela ({simulation.selectedTerm.months}x)
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                Price
              </span>
            </div>

            <div>
              <div className="text-xl font-black text-[#003399]">
                R${' '}
                {simulation.selectedTerm.monthlyInstallment.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="text-xs font-normal text-slate-500"> /mês</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Impacto: R${' '}
                {simulation.selectedTerm.costPerM2.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                /m²
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 text-[11px] flex items-center justify-between">
              <span className="text-slate-500">Base Financiada:</span>
              <span className="font-bold text-slate-800">
                R$ {simulation.totalFinancedBase.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé do Menu Lateral */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/60 space-y-2">
          <button
            onClick={onOpenPrintView}
            className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#003399]" />
            <span>Visualizar Proposta Oficial</span>
          </button>

          <div className="text-[10px] text-center text-slate-400">
            Epson Specialist Partner • Sublimação
          </div>
        </div>
      </aside>
    </>
  );
}
