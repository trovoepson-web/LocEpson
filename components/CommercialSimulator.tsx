'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  PrinterModelId,
  AllModelsCostSettings,
  GlobalFinancialParams,
  ClientScenario,
  SimulationResult
} from '@/lib/types';
import { PRINTER_MODELS, EPSON_SPREADSHEET_REFERENCE_COSTS } from '@/lib/data/printerModels';
import { BRAZILIAN_STATES, getStateTax } from '@/lib/data/brazilianStates';
import {
  CATALOG_PRODUCTS,
  CATALOG_CATEGORIES,
  CatalogProduct
} from '@/lib/data/epsonFullCatalog';
import {
  Calculator,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck2,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
  BookmarkCheck,
  Check,
  UserCheck,
  Share2,
  HelpCircle,
  Info,
  ExternalLink,
  Eye,
  Globe,
  Smartphone,
  Laptop,
  Copy,
  Printer,
  X,
  Gauge,
  Factory,
  Shirt,
  Film,
  Maximize2
} from 'lucide-react';
import { createOpportunity } from '@/lib/crmService';

interface CommercialSimulatorProps {
  selectedModelId: PrinterModelId;
  setSelectedModelId: (modelId: PrinterModelId) => void;
  costSettings: AllModelsCostSettings;
  setCostSettings: React.Dispatch<React.SetStateAction<AllModelsCostSettings>>;
  globalParams: GlobalFinancialParams;
  clientScenario: ClientScenario;
  setClientScenario: React.Dispatch<React.SetStateAction<ClientScenario>>;
  simulation: SimulationResult;
  onGoToProposal: () => void;
  onGoToAdmin: () => void;
  onOpenLeadModal?: () => void;
  onGoToCrm?: () => void;
  onGoToCatalog?: () => void;
}

export default function CommercialSimulator({
  selectedModelId,
  setSelectedModelId,
  costSettings,
  setCostSettings,
  globalParams,
  clientScenario,
  setClientScenario,
  simulation,
  onGoToProposal,
  onGoToAdmin,
  onOpenLeadModal,
  onGoToCrm,
  onGoToCatalog,
}: CommercialSimulatorProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [quickHwNetInput, setQuickHwNetInput] = useState('');
  const [isSavingOpp, setIsSavingOpp] = useState(false);
  const [oppSavedSuccess, setOppSavedSuccess] = useState(false);

  // Modais de apoio para fácil acesso na primeira página
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedCatalogModalProduct, setSelectedCatalogModalProduct] = useState<CatalogProduct | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const models: PrinterModelId[] = ['F6470', 'F9570', 'F20070'];
  const currentCosts = costSettings[selectedModelId];
  const isCostBlank = currentCosts.hwNet === null || (currentCosts.hwNet ?? 0) <= 0;

  const handleClientChange = (field: keyof ClientScenario, value: any) => {
    setClientScenario((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuickSaveCost = () => {
    const val = parseFloat(quickHwNetInput);
    if (!isNaN(val) && val > 0) {
      setCostSettings((prev) => {
        const next = {
          ...prev,
          [selectedModelId]: {
            ...prev[selectedModelId],
            hwNet: val,
          },
        };
        try {
          localStorage.setItem('epson_cost_settings', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      setQuickHwNetInput('');
    }
  };

  const handleSaveOpportunity = async () => {
    setIsSavingOpp(true);
    try {
      await createOpportunity({
        clientName: clientScenario.clientName || 'Cliente em Simulação',
        clientEmail: clientScenario.email || 'contato@cliente.com.br',
        clientPhone: clientScenario.phone,
        clientCompany: clientScenario.clientName,
        destinationUf: clientScenario.destinationUf,
        printerModel: selectedModelId,
        termMonths: simulation.selectedTerm.months,
        monthlyInstallment: simulation.selectedTerm.monthlyInstallment,
        financedBase: simulation.totalFinancedBase,
        hwNet: simulation.hwNet,
        marginPercent: simulation.marginPercent,
        difalPercent: simulation.difalPercent,
        monthlyProductionM2: clientScenario.monthlyProductionM2,
        notes: `Simulação registrada: ${simulation.selectedTerm.months}x de R$ ${simulation.selectedTerm.monthlyInstallment.toFixed(2)} (${clientScenario.destinationUf})`,
      });
      setOppSavedSuccess(true);
      setTimeout(() => setOppSavedSuccess(false), 5000);
    } catch (e) {
      console.error('Erro ao salvar oportunidade:', e);
    } finally {
      setIsSavingOpp(false);
    }
  };

  const handleCopySystemLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const selectedStateTax = getStateTax(clientScenario.destinationUf);

  // Mapeamento de produtos das outras linhas para atalho rápido
  const quickCategories = [
    {
      id: 'rigidas_uv',
      label: 'FlatBed UV Rígidas',
      modelsText: 'V4000 e V7000',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      previewId: 'v4000',
    },
    {
      id: 'industrial_sublimacao',
      label: 'Industrial Monna Lisa',
      modelsText: 'ML 18000',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      previewId: 'ml18000',
    },
    {
      id: 'dtf',
      label: 'DTF Personalizado',
      modelsText: 'G6070 e G9070',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      previewId: 'g6070',
    },
    {
      id: 'dtg',
      label: 'DTG Camisetas',
      modelsText: 'F2270 e F3070',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      previewId: 'f2270',
    },
    {
      id: 'signage',
      label: 'Comunicação SIGNAGE',
      modelsText: 'S7170, S8170 e S9170',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      previewId: 's7170',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Barra de Boas-Vindas e Acesso Rápido */}
      <div className="bg-gradient-to-r from-[#003399]/90 to-blue-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
              Portal Oficial de Locação Comercial
            </span>
            <span className="text-xs text-blue-200">
              Origem RJ • Faturamento Seguro
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Simulador de Locação Epson SureColor®
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Selecione uma impressora abaixo para ver a ficha técnica imediata ou simular parcelas de 12x a 60x com impostos (DIFAL), custos operacionais e margem de 40%.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsHelpModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs transition flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-cyan-300" />
            <span>Como Abrir / Acessar</span>
          </button>

          {onGoToCatalog && (
            <button
              type="button"
              onClick={onGoToCatalog}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white text-[#003399] hover:bg-blue-50 shadow-xs transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Ver Todas as Linhas Epson</span>
            </button>
          )}
        </div>
      </div>

      {/* Vitrine Visual & Ficha Rápida dos Modelos Epson SureColor */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#003399]" />
              <span>Modelos Epson SureColor de Sublimação Têxtil</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clique para selecionar e simular, ou abra a <strong>Ficha Técnica</strong> para detalhes de velocidade, cabeças e tintas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cabeça de Impressão Inclusa na Locação</span>
            </span>
            <button
              type="button"
              onClick={onGoToAdmin}
              className="text-xs text-[#003399] hover:underline font-semibold"
            >
              Custos Base (Admin) &rarr;
            </button>
          </div>
        </div>

        {/* Grid de Cards com Imagem e Especificações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((id) => {
            const model = PRINTER_MODELS[id];
            const isSelected = selectedModelId === id;
            const modelCost = costSettings[id];
            const catalogItem = CATALOG_PRODUCTS.find((p) => p.code === id || p.rentalModelId === id);
            const refCost = EPSON_SPREADSHEET_REFERENCE_COSTS[id];
            const hasCost = modelCost.hwNet !== null && (modelCost.hwNet ?? 0) > 0;

            return (
              <div
                key={id}
                className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Cabeçalho do Card */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Linha superior: Categoria e Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#003399] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {model.category}
                      </span>
                      {isSelected ? (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-300">
                          <Check className="w-3 h-3 text-blue-700" />
                          <span>Selecionado</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">
                          Clique p/ simular
                        </span>
                      )}
                    </div>

                    {/* Foto Oficial do Equipamento */}
                    <div className="relative w-full h-36 bg-slate-50 rounded-xl mb-3 overflow-hidden border border-slate-100 flex items-center justify-center p-2 group">
                      {catalogItem?.imageUrl ? (
                        <Image
                          src={catalogItem.imageUrl}
                          alt={model.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          unoptimized
                        />
                      ) : (
                        <Printer className="w-12 h-12 text-slate-300" />
                      )}
                      <div className="absolute bottom-2 right-2">
                        <span className="text-[9px] font-extrabold uppercase bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                          {model.widthInches}&quot; ({model.widthCm} cm)
                        </span>
                      </div>
                    </div>

                    {/* Título e Subtítulo */}
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      {model.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mb-3">
                      {model.targetMarket}
                    </p>

                    {/* Ficha Rápida com Especificações Chave */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-blue-600" />
                          <span>Velocidade:</span>
                        </span>
                        <span className="font-bold text-slate-800">
                          ~{model.productionSpeedM2H} m²/h real
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cabeças Inclusas:</span>
                        </span>
                        <span className="font-bold text-emerald-700">
                          {model.printheadsCount}x (R$ {refCost.printheadCost?.toLocaleString('pt-BR')})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Street Price (Ref):</span>
                        <span className="font-bold text-slate-700">
                          R$ {refCost.streetPrice?.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">HW Net (Custo Base):</span>
                        {hasCost ? (
                          <span className="font-black text-[#003399]">
                            R$ {modelCost.hwNet?.toLocaleString('pt-BR')}
                          </span>
                        ) : (
                          <span className="font-bold text-amber-600 bg-amber-50 px-1.5 rounded">
                            Em branco
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações do Card */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedModelId(id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#003399] text-white shadow-xs'
                          : 'bg-blue-50 text-[#003399] hover:bg-blue-100'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Modelo Ativo</span>
                        </>
                      ) : (
                        <span>Simular com {id}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (catalogItem) setSelectedCatalogModalProduct(catalogItem);
                      }}
                      className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1"
                      title="Abrir Ficha Técnica Completa"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Ficha</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Faixa de Atalho Rápido para Todas as Outras Linhas Epson */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-slate-800">
              Outras Linhas de Produtos Epson:
            </span>
            <span className="text-xs text-slate-500 hidden lg:inline">
              (Clique para consultar ficha técnica instantânea)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {quickCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  const prod = CATALOG_PRODUCTS.find((p) => p.id === cat.previewId) || CATALOG_PRODUCTS.find((p) => p.categoryId === cat.id);
                  if (prod) {
                    setSelectedCatalogModalProduct(prod);
                  } else if (onGoToCatalog) {
                    onGoToCatalog();
                  }
                }}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition hover:opacity-90 ${cat.badgeColor} flex items-center gap-1.5`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-normal">({cat.modelsText})</span>
              </button>
            ))}

            {onGoToCatalog && (
              <button
                type="button"
                onClick={onGoToCatalog}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alerta Claro quando Custo está em Branco */}
      {isCostBlank && (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-4 text-amber-900 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  Custo Base (HW Net) em branco para a {simulation.modelInfo.name}
                </h4>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  Conforme configurado, os custos iniciam em branco para preenchimento manual pelo operador.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  placeholder="Ex: 32000"
                  value={quickHwNetInput}
                  onChange={(e) => setQuickHwNetInput(e.target.value)}
                  className="w-32 pl-8 pr-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={handleQuickSaveCost}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition"
              >
                Aplicar
              </button>
              <button
                type="button"
                onClick={onGoToAdmin}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition"
              >
                Painel Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Principal: Parâmetros e Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Formulários Claros (5 colunas) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Cliente & Destino */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003399] flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>1. Cliente & Tributação Estadual</span>
              </h3>
              {onOpenLeadModal && (
                <button
                  type="button"
                  onClick={onOpenLeadModal}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Identificar</span>
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Razão Social / Nome Fantasia
              </label>
              <input
                type="text"
                placeholder="Ex: Confecção Estampa Brasil Ltda"
                value={clientScenario.clientName}
                onChange={(e) => handleClientChange('clientName', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CNPJ
                </label>
                <input
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={clientScenario.cnpj}
                  onChange={(e) => handleClientChange('cnpj', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contato / Cargo
                </label>
                <input
                  type="text"
                  placeholder="Nome do diretor"
                  value={clientScenario.contactPerson}
                  onChange={(e) => handleClientChange('contactPerson', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail do Cliente
                </label>
                <input
                  type="email"
                  placeholder="cliente@empresa.com.br"
                  value={clientScenario.email}
                  onChange={(e) => handleClientChange('email', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="(47) 99876-5432"
                  value={clientScenario.phone}
                  onChange={(e) => handleClientChange('phone', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Estado de Destino e DIFAL */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Estado de Destino (UF)
                </label>
                <span className="text-[10px] text-[#003399] font-bold">
                  Origem: RJ
                </span>
              </div>

              <select
                value={clientScenario.destinationUf}
                onChange={(e) => handleClientChange('destinationUf', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {BRAZILIAN_STATES.map((st) => (
                  <option key={st.uf} value={st.uf}>
                    {st.uf} - {st.name} ({st.region}) | ICMS: {(st.internalIcms * 100).toFixed(1)}%
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-500 block">ICMS Destino:</span>
                  <span className="font-bold text-slate-800">
                    {(selectedStateTax.internalIcms * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Interestadual:</span>
                  <span className="font-bold text-slate-800">
                    {(selectedStateTax.interstateFromRJ * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">DIFAL Calculado:</span>
                  <span className="font-black text-blue-700">
                    +{(selectedStateTax.difal * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Regime do Cliente */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Regime Tributário do Cliente</span>
                {clientScenario.clientTaxRegime === 'lucro_real' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    Benefício Fiscal 43,25% Ativo
                  </span>
                )}
              </label>
              <select
                value={clientScenario.clientTaxRegime}
                onChange={(e) => handleClientChange('clientTaxRegime', e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="lucro_real">Lucro Real (Deduz 34% IRPJ/CSLL + 9,25% PIS/COFINS)</option>
                <option value="lucro_presumido">Lucro Presumido</option>
                <option value="simples_nacional">Simples Nacional</option>
              </select>
            </div>
          </div>

          {/* Card 2: Prazo e Parâmetros */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#003399] flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4" />
              <span>2. Prazo do Contrato & Parâmetros</span>
            </h3>

            {/* Seletor de Prazo */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Prazo Principal do Contrato
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[12, 24, 36, 48, 60].map((months) => {
                  const isSelected = clientScenario.selectedTermMonths === months;
                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={() => handleClientChange('selectedTermMonths', months)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#003399] border-[#003399] text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {months}m
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Margem e Juros */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Margem Desejada (%)
                </label>
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={clientScenario.customMarginPercent ?? globalParams.defaultMarginPercent}
                    onChange={(e) =>
                      handleClientChange(
                        'customMarginPercent',
                        Math.max(0, parseFloat(e.target.value) || 0)
                      )
                    }
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taxa Juros a.m. (%)
                </label>
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={clientScenario.customInterestRatePercent ?? globalParams.monthlyInterestRatePercent}
                    onChange={(e) =>
                      handleClientChange(
                        'customInterestRatePercent',
                        Math.max(0, parseFloat(e.target.value) || 0)
                      )
                    }
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-bold">%</span>
                </div>
              </div>
            </div>

            {/* Custos Operacionais */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custos Operacionais Globais (Frete / Instalação / RIP)
              </label>
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  step="100"
                  min="0"
                  placeholder="0,00"
                  value={
                    clientScenario.operationalCosts ||
                    (currentCosts.defaultOperationalCost ?? '')
                  }
                  onChange={(e) =>
                    handleClientChange('operationalCosts', Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Cenário de Produção */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#003399] flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>3. Cenário de Produção da Estamparia</span>
            </h3>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Produção Mensal Estimada:</span>
                <span className="font-black text-[#003399] text-sm">
                  {clientScenario.monthlyProductionM2.toLocaleString('pt-BR')} m²/mês
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="15000"
                step="100"
                value={clientScenario.monthlyProductionM2}
                onChange={(e) => handleClientChange('monthlyProductionM2', parseInt(e.target.value))}
                className="w-full accent-[#003399] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>200 m²</span>
                <span>1.500 m²</span>
                <span>5.000 m²</span>
                <span>15.000 m²</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preço Venda (R$/m²)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={clientScenario.sellingPricePerM2}
                    onChange={(e) =>
                      handleClientChange('sellingPricePerM2', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custo Insumos (R$/m²)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={clientScenario.inkAndPaperCostPerM2}
                    onChange={(e) =>
                      handleClientChange('inkAndPaperCostPerM2', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Resultados Financeiros e Tabela (7 colunas) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card Parcela Mensal (Destaque Azul Epson) */}
            <div className="bg-gradient-to-br from-[#003399] via-blue-900 to-indigo-900 rounded-2xl p-5 text-white shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Parcela Mensal ({simulation.selectedTerm.months}x)
                </span>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                  Price 0,99% a.m.
                </span>
              </div>

              <div className="text-3xl font-black mt-2">
                R$ {simulation.selectedTerm.monthlyInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs font-normal text-blue-200"> /mês</span>
              </div>

              {clientScenario.clientTaxRegime === 'lucro_real' ? (
                <div className="mt-2.5 text-xs text-emerald-300 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    Líquido Lucro Real: R${' '}
                    {simulation.selectedTerm.effectiveNetInstallment.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    /mês (-43,25%)
                  </span>
                </div>
              ) : (
                <p className="mt-2.5 text-xs text-blue-200">
                  Despesa 100% OPEX dedutível do resultado
                </p>
              )}
            </div>

            {/* Card Base Financiada Total (Branco com Detalhamento) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Base Financiada Total
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="text-[11px] font-bold text-[#003399] hover:underline"
                  >
                    {showBreakdown ? 'Ocultar' : 'Ver Composição'}
                  </button>
                </div>

                <div className="text-2xl font-black text-slate-900 mt-2">
                  R$ {simulation.totalFinancedBase.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  HW Net + Margem ({simulation.marginPercent}%) + DIFAL ({simulation.difalPercent.toFixed(1)}%) + Custos
                </p>
              </div>

              {showBreakdown && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600 animate-fade-in">
                  <div className="flex justify-between">
                    <span>HW Net (Custo Base):</span>
                    <span className="font-semibold">R$ {simulation.hwNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margem ({simulation.marginPercent}%):</span>
                    <span className="font-semibold">R$ {simulation.marginAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custos Operacionais:</span>
                    <span className="font-semibold">R$ {simulation.operationalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DIFAL {simulation.originUf} &rarr; {simulation.destinationUf} ({simulation.difalPercent.toFixed(1)}%):</span>
                    <span className="font-semibold">R$ {simulation.difalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cards Secundários Claros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Impacto da Parcela / m²
              </span>
              <div className="text-lg font-black text-[#003399] mt-0.5">
                R$ {simulation.selectedTerm.costPerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs font-normal text-slate-400"> /m²</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {(simulation.productionMetrics.rentalShareOfRevenuePercent).toFixed(1)}% da receita bruta
              </span>
            </div>

            <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Lucro Operacional Líquido
              </span>
              <div className="text-lg font-black text-emerald-700 mt-0.5">
                R$ {simulation.productionMetrics.monthlyNetOperatingProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs font-normal text-slate-400"> /mês</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Após insumos e locação
              </span>
            </div>

            <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Ponto de Equilíbrio
              </span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {Math.ceil(simulation.productionMetrics.breakEvenM2).toLocaleString('pt-BR')}
                <span className="text-xs font-normal text-slate-400"> m²/mês</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Paga 100% da parcela
              </span>
            </div>
          </div>

          {/* Tabela de Amortização Progressiva Clara */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#003399]" />
                  <span>Tabela de Amortização Progressiva (Tabela Price)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Origem RJ • Juros 0,99% a.m. • Amortização em 12, 24, 36, 48 e 60 meses
                </p>
              </div>

              <span className="text-[11px] font-bold text-[#003399] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Amortização Oficial
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Prazo</th>
                    <th className="py-3 px-4">Parcela Mensal</th>
                    <th className="py-3 px-4">Custo por m²</th>
                    <th className="py-3 px-4">Total Contrato</th>
                    {clientScenario.clientTaxRegime === 'lucro_real' && (
                      <th className="py-3 px-4 text-emerald-800">Líquido Lucro Real</th>
                    )}
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {simulation.amortizationTable.map((item) => {
                    const isCurrent = item.months === simulation.selectedTerm.months;

                    return (
                      <tr
                        key={item.months}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-blue-50/90 font-bold text-slate-900 border-l-4 border-l-[#003399]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm">{item.months} meses</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-[#003399] text-white font-bold px-1.5 py-0.2 rounded">
                                Selecionado
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-black text-slate-900 text-sm">
                          R$ {item.monthlyInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        <td className="py-3 px-4 text-slate-700">
                          R$ {item.costPerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/m²
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          R$ {item.totalContractCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {clientScenario.clientTaxRegime === 'lucro_real' && (
                          <td className="py-3 px-4 font-bold text-emerald-700">
                            R$ {item.effectiveNetInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        )}

                        <td className="py-3 px-4 text-right">
                          {isCurrent ? (
                            <span className="text-xs text-[#003399] font-bold flex items-center justify-end gap-1">
                              <FileCheck2 className="w-3.5 h-3.5" /> Ativo
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleClientChange('selectedTermMonths', item.months)}
                              className="text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 transition"
                            >
                              Selecionar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Banner Chamada Proposta com IA */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#003399] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Pronto para gerar a proposta comercial formal?
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Elabore o pitch com IA, envie por WhatsApp ou gere o PDF timbrado oficial da Epson.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveOpportunity}
                disabled={isSavingOpp || oppSavedSuccess}
                className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition flex items-center gap-2 whitespace-nowrap ${
                  oppSavedSuccess
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
                }`}
                title="Salvar esta simulação no Banco de Dados para o Admin"
              >
                {oppSavedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Salvo no CRM!</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-blue-600" />
                    <span>{isSavingOpp ? 'Salvando...' : 'Salvar no CRM'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onGoToProposal}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#003399] hover:bg-blue-800 text-white shadow-xs transition flex items-center gap-2 whitespace-nowrap"
              >
                <span>Gerar Proposta com IA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Ficha Técnica Completa do Produto Epson */}
      {selectedCatalogModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Cabeçalho do Modal */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#003399] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {selectedCatalogModalProduct.categoryLabel}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Ficha Técnica Oficial Epson
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCatalogModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo da Ficha Técnica */}
            <div className="p-6 space-y-5">
              {/* Foto e Título Principal */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="relative w-44 h-32 shrink-0 bg-white rounded-xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center">
                  {selectedCatalogModalProduct.imageUrl ? (
                    <Image
                      src={selectedCatalogModalProduct.imageUrl}
                      alt={selectedCatalogModalProduct.name}
                      fill
                      className="object-contain p-2"
                      referrerPolicy="no-referrer"
                      unoptimized
                    />
                  ) : (
                    <Printer className="w-12 h-12 text-slate-300" />
                  )}
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-[#003399]">
                    {selectedCatalogModalProduct.line}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedCatalogModalProduct.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedCatalogModalProduct.application}
                  </p>
                </div>
              </div>

              {/* Especificações Técnicas em Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    Largura / Área Útil
                  </span>
                  <p className="text-sm font-black text-slate-900">
                    {selectedCatalogModalProduct.printWidth}
                  </p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Velocidade de Impressão
                  </span>
                  <p className="text-sm font-black text-slate-900">
                    {selectedCatalogModalProduct.speed}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Tecnologia de Cabeça
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {selectedCatalogModalProduct.technology}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Sistema de Tinta & Resolução
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {selectedCatalogModalProduct.inkType} • {selectedCatalogModalProduct.resolution}
                  </p>
                </div>
              </div>

              {/* Recursos Principais */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Diferenciais e Recursos de Alta Produtividade</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedCatalogModalProduct.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Destaque Comercial de Locação Epson */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#003399]" />
                  <span>Vantagens Exclusivas da Locação Epson:</span>
                </div>
                <p className="text-blue-800/90 text-[11px] leading-relaxed">
                  ✓ Cabeça de impressão inclusa durante todo o contrato (sem desembolso avulso).<br />
                  ✓ Software RIP Epson Edge Print genuíno incluso.<br />
                  ✓ 100% OPEX com dedução integral de IRPJ/CSLL para empresas no Lucro Real.<br />
                  ✓ Zero Capex: Preserva o capital de giro para compra de tecidos e insumos.
                </p>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {selectedCatalogModalProduct.officialUrl && (
                <a
                  href={selectedCatalogModalProduct.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#003399] hover:underline flex items-center gap-1"
                >
                  <span>Ver no site epson.com.br</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCatalogModalProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition"
                >
                  Fechar
                </button>

                {selectedCatalogModalProduct.rentalModelId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCatalogModalProduct.rentalModelId) {
                        setSelectedModelId(selectedCatalogModalProduct.rentalModelId);
                        setSelectedCatalogModalProduct(null);
                      }
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2 text-xs font-bold bg-[#003399] hover:bg-blue-800 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>Simular com {selectedCatalogModalProduct.rentalModelId}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Como Abrir e Acessar o Sistema (Fácil Acesso) */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Topo */}
            <div className="bg-[#003399] text-white p-6 rounded-t-3xl flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Guia Rápido de Acesso
                </span>
                <h3 className="text-xl font-black mt-2">
                  Como Abrir e Usar o Sistema Epson?
                </h3>
                <p className="text-xs text-blue-100 mt-1">
                  Acesso 100% online em qualquer navegador, computador, tablet ou smartphone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Passos e Link */}
            <div className="p-6 space-y-5">
              {/* Link de Acesso com 1-Click Copy */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#003399]" />
                  <span>Link Direto do Sistema Web:</span>
                </span>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.origin : 'https://epson-locacao.com'}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopySystemLink}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#003399] text-white hover:bg-blue-800 transition flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Basta abrir este link no Google Chrome, Microsoft Edge, Safari ou Firefox. Nenhuma instalação é necessária.
                </p>
              </div>

              {/* 3 Passos Simples para Usar */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  3 Passos para Realizar Simulações:
                </h4>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#003399] text-white text-xs font-black flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Escolha a Impressora Epson e o Estado de Destino
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Selecione entre SureColor F6470 (44&quot;), F9570 (64&quot;) ou F20070 (76&quot;). O sistema calcula o DIFAL estadual automático a partir da origem RJ.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#003399] text-white text-xs font-black flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Defina o Prazo de Contrato (12x a 60x)
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Prazos maiores amortizam a parcela mensal pela Tabela Price (0,99% a.m.), reduzindo o custo por metro quadrado estampado.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#003399] text-white text-xs font-black flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Gere a Proposta Comercial Formal
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Clique em &quot;Gerar Proposta com IA&quot; para um pitch persuasivo gerado pelo Gemini 2.5 Flash ou imprima o PDF timbrado para o cliente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações de Dispositivos */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  <span>Computador / Notebook</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Celular / WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="px-5 py-2 text-xs font-bold bg-[#003399] text-white rounded-xl hover:bg-blue-800 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

