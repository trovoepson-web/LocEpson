'use client';

import React from 'react';
import {
  FileText,
  RotateCcw,
  SlidersHorizontal,
  Menu,
  X,
  Printer,
  Users,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { PrinterModelId, AllModelsCostSettings, LeadRecord } from '@/lib/types';
import { PRINTER_MODELS } from '@/lib/data/printerModels';

interface TopHeaderProps {
  selectedModelId: PrinterModelId;
  costSettings: AllModelsCostSettings;
  currentLead?: LeadRecord | null;
  onOpenLeadModal: () => void;
  onGoToCrm: () => void;
  onResetClientScenario: () => void;
  onOpenPrintView: () => void;
  onGoToAdmin: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function TopHeader({
  selectedModelId,
  costSettings,
  currentLead,
  onOpenLeadModal,
  onGoToCrm,
  onResetClientScenario,
  onOpenPrintView,
  onGoToAdmin,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: TopHeaderProps) {
  const models: PrinterModelId[] = ['F6470', 'F9570', 'F20070'];
  const configuredModelsCount = models.filter(
    (m) => costSettings[m].hwNet !== null && (costSettings[m].hwNet ?? 0) > 0
  ).length;

  const currentModel = PRINTER_MODELS[selectedModelId];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Lado Esquerdo: Botão Menu Mobile + Logo e Identificação */}
          <div className="flex items-center gap-3">
            {/* Botão Menu Lateral Mobile (à esquerda) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition flex items-center justify-center"
              aria-label="Abrir Menu Lateral"
              title="Abrir Menu de Navegação"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-blue-900" /> : <Menu className="w-5 h-5 text-blue-900" />}
            </button>

            {/* Identificação Epson */}
            <div className="flex items-center gap-2.5">
              {/* Logo Epson apenas no mobile (pois no desktop a barra lateral esquerda já exibe a marca) */}
              <div className="lg:hidden bg-[#003399] text-white font-black tracking-widest text-base px-2.5 py-1 rounded shadow-xs flex items-center gap-1.5">
                <span>EPSON</span>
                <span className="text-[9px] uppercase font-bold text-blue-200 bg-blue-900/60 px-1 py-0.2 rounded hidden sm:inline">
                  Têxtil
                </span>
              </div>

              <div className="lg:border-0 border-l border-slate-200 lg:pl-0 pl-2.5 sm:pl-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-xs sm:text-base font-bold text-slate-900">
                    SureColor® Locação & Simulador
                  </h1>
                  <span className="inline-flex items-center text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-[#003399] border border-blue-200">
                    {currentModel.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Simulador de Amortização Price • Faturamento RJ • Benefício OPEX
                </p>
              </div>
            </div>
          </div>

          {/* Lado Direito: Ações Rápidas */}
          <div className="flex items-center gap-2">
            {/* Status do Cliente Identificado */}
            {currentLead ? (
              <button
                onClick={onOpenLeadModal}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold transition"
                title="Clique para editar dados de identificação do cliente"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline truncate max-w-[130px]">{currentLead.name}</span>
                <span className="text-[10px] text-blue-600 font-normal hidden xl:inline">({currentLead.phone})</span>
              </button>
            ) : (
              <button
                onClick={onOpenLeadModal}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-xs transition"
                title="Cadastrar dados do cliente para simulação"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Identificar Cliente</span>
              </button>
            )}

            {/* Acesso rápido ao CRM */}
            <button
              onClick={onGoToCrm}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition"
              title="Acessar CRM e Banco de Oportunidades"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden md:inline">CRM & Leads</span>
            </button>

            {/* Status do Painel de Custos */}
            <button
              onClick={onGoToAdmin}
              className={`flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border font-semibold transition ${
                configuredModelsCount === 3
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : configuredModelsCount > 0
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 animate-pulse'
              }`}
              title="Clique para gerenciar custos manuais no Painel Administrativo"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                Custos:{' '}
                {configuredModelsCount === 3
                  ? '3/3 OK'
                  : configuredModelsCount > 0
                  ? `${configuredModelsCount}/3 Config`
                  : 'Em Branco'}
              </span>
              <span className="sm:hidden">
                {configuredModelsCount}/3
              </span>
            </button>

            {/* Botão Imprimir / Exportar Proposta */}
            <button
              onClick={onOpenPrintView}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold bg-[#003399] text-white hover:bg-blue-800 shadow-xs transition"
              title="Visualizar Proposta Oficial para Impressão / PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Proposta PDF</span>
            </button>

            {/* Redefinir Cenário */}
            <button
              onClick={onResetClientScenario}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
              title="Redefinir dados do cliente"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
