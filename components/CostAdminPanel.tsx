'use client';

import React, { useState } from 'react';
import {
  PrinterModelId,
  AllModelsCostSettings,
  GlobalFinancialParams,
  ModelCostSettings
} from '@/lib/types';
import { PRINTER_MODELS, EPSON_SPREADSHEET_REFERENCE_COSTS, INITIAL_BLANK_COSTS } from '@/lib/data/printerModels';
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Save,
  Building,
  Percent,
  Layers,
  ArrowRight,
  Printer
} from 'lucide-react';

interface CostAdminPanelProps {
  costSettings: AllModelsCostSettings;
  setCostSettings: React.Dispatch<React.SetStateAction<AllModelsCostSettings>>;
  globalParams: GlobalFinancialParams;
  setGlobalParams: React.Dispatch<React.SetStateAction<GlobalFinancialParams>>;
  onSelectModelAndSimulate: (modelId: PrinterModelId) => void;
}

export default function CostAdminPanel({
  costSettings,
  setCostSettings,
  globalParams,
  setGlobalParams,
  onSelectModelAndSimulate,
}: CostAdminPanelProps) {
  const [localSettings, setLocalSettings] = useState<AllModelsCostSettings>(costSettings);
  const [localParams, setLocalParams] = useState<GlobalFinancialParams>(globalParams);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const models: PrinterModelId[] = ['F6470', 'F9570', 'F20070'];

  const handleCostChange = (
    modelId: PrinterModelId,
    field: keyof ModelCostSettings,
    value: string
  ) => {
    const numValue = value === '' ? null : Math.max(0, parseFloat(value) || 0);
    setLocalSettings((prev) => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        [field]: numValue,
      },
    }));
  };

  const handleSave = () => {
    setCostSettings(localSettings);
    setGlobalParams(localParams);
    try {
      localStorage.setItem('epson_cost_settings', JSON.stringify(localSettings));
      localStorage.setItem('epson_global_params', JSON.stringify(localParams));
    } catch (e) {
      console.warn('Não foi possível salvar no localStorage', e);
    }
    setSavedNotification('Configurações e custos manuais salvos com sucesso!');
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleResetToBlank = () => {
    setLocalSettings(INITIAL_BLANK_COSTS);
    setCostSettings(INITIAL_BLANK_COSTS);
    try {
      localStorage.removeItem('epson_cost_settings');
    } catch (e) {}
    setSavedNotification('Todos os custos foram redefinidos para em branco.');
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleLoadSpreadsheetReferences = () => {
    setLocalSettings(EPSON_SPREADSHEET_REFERENCE_COSTS);
    setCostSettings(EPSON_SPREADSHEET_REFERENCE_COSTS);
    try {
      localStorage.setItem('epson_cost_settings', JSON.stringify(EPSON_SPREADSHEET_REFERENCE_COSTS));
    } catch (e) {}
    setSavedNotification('Valores de referência da planilha carregados! Salve para fixá-los.');
    setTimeout(() => setSavedNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header do Painel */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#003399] mb-1">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Painel Administrativo da Locadora</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Entrada Manual de Custos & Parâmetros Financeiros
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
              Custos em branco por padrão para inclusão manual pelo operador. Todos os modelos reunidos em um único quadrante compacto.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSpreadsheetReferences}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-[#003399] border border-blue-200 transition flex items-center gap-1.5 shadow-xs"
              title="Carrega os valores de referência da planilha Epson"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Carregar Ref. Planilha</span>
            </button>

            <button
              type="button"
              onClick={handleResetToBlank}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition flex items-center gap-1.5"
              title="Redefine todos os campos para em branco"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Limpar (Em Branco)</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg bg-[#003399] hover:bg-blue-800 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Custos</span>
            </button>
          </div>
        </div>

        {savedNotification && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedNotification}</span>
          </div>
        )}
      </div>

      {/* Regras de Negócio e Parâmetros Fixos (Compacto) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Percent className="w-4 h-4 text-[#003399]" />
          <span>Parâmetros Globais de Amortização da Planilha</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5 flex items-center justify-between">
              <span>Origem Faturamento</span>
              <span className="text-[9px] text-[#003399] font-bold bg-blue-100 px-1 py-0.2 rounded">Fixo</span>
            </label>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#003399]" />
              <span>Rio de Janeiro (RJ)</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">DIFAL Interestadual</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
              Margem sobre HW Net (%)
            </label>
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={localParams.defaultMarginPercent}
                onChange={(e) =>
                  setLocalParams((prev) => ({
                    ...prev,
                    defaultMarginPercent: Math.max(0, parseFloat(e.target.value) || 0),
                  }))
                }
                className="w-full text-sm font-black text-slate-900 focus:outline-none"
              />
              <span className="text-xs font-bold text-slate-400">%</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Padrão da Planilha: 40%</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
              Taxa de Juros Mensal (%)
            </label>
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1">
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={localParams.monthlyInterestRatePercent}
                onChange={(e) =>
                  setLocalParams((prev) => ({
                    ...prev,
                    monthlyInterestRatePercent: Math.max(0, parseFloat(e.target.value) || 0),
                  }))
                }
                className="w-full text-sm font-black text-slate-900 focus:outline-none"
              />
              <span className="text-xs font-bold text-slate-400">% a.m.</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Tabela Price: 0,99%</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
              Regime Tributário Locadora
            </label>
            <select
              value={localParams.lessorTaxRegime}
              onChange={(e) =>
                setLocalParams((prev) => ({
                  ...prev,
                  lessorTaxRegime: e.target.value as any,
                }))
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="lucro_real">Lucro Real</option>
              <option value="lucro_presumido">Lucro Presumido</option>
              <option value="simples_nacional">Simples Nacional</option>
            </select>
            <span className="text-[10px] text-slate-400 block mt-0.5">Ajuste tributário federal</span>
          </div>
        </div>
      </div>

      {/* QUADRANTE ÚNICO: Todos os Modelos no Mesmo Quadrante */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Cabeçalho do Quadrante Único */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#003399] text-white">
                <Layers className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-slate-900">
                Matriz de Custos por Modelo (SureColor F6470, F9570 e F20070)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Todos os modelos centralizados no mesmo quadrante. Digite os valores diretamente nas colunas abaixo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              3 Modelos Têxteis Epson
            </span>
          </div>
        </div>

        {/* Tabela Matriz Compacta Unificada */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-56">Modelo & Categoria</th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span>HW Net (Custo Base)</span>
                    <span className="text-rose-600">*</span>
                  </div>
                </th>
                <th className="py-3 px-3">Street Price (Mercado)</th>
                <th className="py-3 px-3">1 Cabeça Avulsa</th>
                <th className="py-3 px-3">Custos Operacionais</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {models.map((modelId) => {
                const info = PRINTER_MODELS[modelId];
                const costs = localSettings[modelId];
                const refCosts = EPSON_SPREADSHEET_REFERENCE_COSTS[modelId];
                const isFilled = costs.hwNet !== null && costs.hwNet > 0;

                return (
                  <tr
                    key={modelId}
                    className={`transition-colors ${
                      isFilled ? 'hover:bg-slate-50/80' : 'bg-amber-50/20 hover:bg-amber-50/40'
                    }`}
                  >
                    {/* Coluna 1: Identificação do Modelo */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-slate-900">{info.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {info.widthInches}&quot;
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {info.category} • {info.printheadsCount} cabeça(s)
                        </p>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] text-slate-400">
                            Ref: R$ {refCosts.hwNet?.toLocaleString('pt-BR')}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalSettings((prev) => ({
                                ...prev,
                                [modelId]: { ...refCosts },
                              }));
                            }}
                            className="text-[10px] font-bold text-[#003399] hover:underline"
                            title="Preenche esta linha com os valores de referência da planilha"
                          >
                            Copiar Ref.
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Coluna 2: HW Net (Custo Base) */}
                    <td className="py-3.5 px-3">
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">R$</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          placeholder="0,00"
                          value={costs.hwNet ?? ''}
                          onChange={(e) => handleCostChange(modelId, 'hwNet', e.target.value)}
                          className={`w-full pl-8 pr-2 py-1.5 bg-white border rounded-lg text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 ${
                            costs.hwNet === null || costs.hwNet === 0
                              ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/30'
                              : 'border-slate-300'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Coluna 3: Street Price */}
                    <td className="py-3.5 px-3">
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">R$</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          placeholder="0,00"
                          value={costs.streetPrice ?? ''}
                          onChange={(e) => handleCostChange(modelId, 'streetPrice', e.target.value)}
                          className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                    </td>

                    {/* Coluna 4: Custo 1 Cabeça Avulsa */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="relative w-32">
                          <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">R$</span>
                          <input
                            type="number"
                            min="0"
                            step="100"
                            placeholder="0,00"
                            value={costs.printheadCost ?? ''}
                            onChange={(e) => handleCostChange(modelId, 'printheadCost', e.target.value)}
                            className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                          />
                        </div>
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 inline-block">
                          Inclusa na Locação
                        </span>
                      </div>
                    </td>

                    {/* Coluna 5: Custos Operacionais Padrão */}
                    <td className="py-3.5 px-3">
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">R$</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          placeholder="0,00"
                          value={costs.defaultOperationalCost ?? ''}
                          onChange={(e) => handleCostChange(modelId, 'defaultOperationalCost', e.target.value)}
                          className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                    </td>

                    {/* Coluna 6: Status */}
                    <td className="py-3.5 px-3 text-center">
                      {isFilled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Preenchido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Em Branco
                        </span>
                      )}
                    </td>

                    {/* Coluna 7: Ação Rápida */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            handleCostChange(modelId, 'hwNet', '');
                            handleCostChange(modelId, 'streetPrice', '');
                            handleCostChange(modelId, 'printheadCost', '');
                            handleCostChange(modelId, 'defaultOperationalCost', '');
                          }}
                          className="text-[11px] text-slate-400 hover:text-rose-600 px-1 py-1"
                          title="Limpar linha"
                        >
                          Limpar
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleSave();
                            onSelectModelAndSimulate(modelId);
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#003399] hover:bg-blue-800 text-white flex items-center gap-1 shadow-xs transition"
                          title={`Simular com ${modelId}`}
                        >
                          <span>Simular</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Rodapé do Quadrante com Salvar Rápido */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Dica: Ao preencher os valores de HW Net, clique em <strong>Salvar Custos</strong> para gravá-los no sistema.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#003399] hover:bg-blue-800 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Todas as Linhas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
