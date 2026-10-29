'use client';

import React from 'react';
import {
  Printer,
  SlidersHorizontal,
  Calculator,
  Sparkles,
  Scale,
  RotateCcw,
  PrinterCheck,
  Building2,
  FileText
} from 'lucide-react';
import { PrinterModelId, AllModelsCostSettings } from '@/lib/types';

interface NavbarProps {
  activeTab: 'simulator' | 'admin' | 'proposal' | 'comparative' | 'catalog';
  setActiveTab: (tab: 'simulator' | 'admin' | 'proposal' | 'comparative' | 'catalog') => void;
  costSettings: AllModelsCostSettings;
  onResetClientScenario: () => void;
  onOpenPrintView: () => void;
  hasProposal: boolean;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  costSettings,
  onResetClientScenario,
  onOpenPrintView,
  hasProposal,
}: NavbarProps) {
  // Contar quantos modelos estão com custo preenchido
  const models: PrinterModelId[] = ['F6470', 'F9570', 'F20070'];
  const configuredModelsCount = models.filter(
    (m) => costSettings[m].hwNet !== null && (costSettings[m].hwNet ?? 0) > 0
  ).length;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Barra superior de identificação Epson */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-black tracking-wider text-xl px-3 py-1.5 rounded-lg shadow-md border border-blue-400/30 flex items-center gap-1.5">
              <span>EPSON</span>
              <span className="text-[10px] uppercase font-semibold tracking-normal text-blue-200 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-400/20">
                Têxtil
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5">
                  SureColor® Locação & Simulador
                </h1>
                <span className="hidden md:inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  F6470 • F9570 • F20070
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Origem RJ • Amortização Price • Vantagem OPEX • Propostas com IA
              </p>
            </div>
          </div>

          {/* Status e Ações Rápidas */}
          <div className="flex items-center gap-2">
            {/* Status do Painel de Custos */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                configuredModelsCount === 3
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : configuredModelsCount > 0
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 animate-pulse'
              }`}
              title="Clique para gerenciar custos manuais no Painel Administrativo"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="font-semibold">
                Custos:{' '}
                {configuredModelsCount === 3
                  ? '3/3 Preenchidos'
                  : configuredModelsCount > 0
                  ? `${configuredModelsCount}/3 Configurados`
                  : 'Em Branco (Pendente)'}
              </span>
            </button>

            {/* Botão Imprimir / Exportar Proposta */}
            <button
              onClick={onOpenPrintView}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
              title="Visualizar Proposta Oficial para Impressão / PDF"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Proposta Impressa / PDF</span>
            </button>

            {/* Reset Rápido de Cenário */}
            <button
              onClick={onResetClientScenario}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
              title="Redefinir dados do cliente"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Abas Principais de Navegação */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 pt-2 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Simulador Comercial</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Painel de Custos (Admin)</span>
            {configuredModelsCount < 3 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('proposal')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'proposal'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Proposta com IA & Pitch</span>
            {hasProposal && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                Gerada
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('comparative')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'comparative'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Locação x Compra (OPEX)</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Modelos SureColor</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
