'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  CATALOG_CATEGORIES,
  CATALOG_PRODUCTS,
  CatalogCategoryId,
  CatalogProduct,
} from '@/lib/data/epsonFullCatalog';
import { PrinterModelId, AllModelsCostSettings } from '@/lib/types';
import {
  Search,
  ArrowRight,
  Check,
  ExternalLink,
  Layers,
  Gauge,
  Printer,
  Maximize2,
  Factory,
  Shirt,
  Film,
  Sparkles,
  Info,
  X,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface PrinterCatalogProps {
  onSelectModelAndSimulate: (modelId: PrinterModelId) => void;
  costSettings: AllModelsCostSettings;
}

export default function PrinterCatalog({
  onSelectModelAndSimulate,
  costSettings,
}: PrinterCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState<CatalogProduct | null>(null);

  // Mapeamento de ícones das categorias
  const renderCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Maximize2':
        return <Maximize2 className={className} />;
      case 'Factory':
        return <Factory className={className} />;
      case 'Shirt':
        return <Shirt className={className} />;
      case 'Film':
        return <Film className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      default:
        return <Printer className={className} />;
    }
  };

  // Cores de destaque para cada categoria
  const getCategoryTheme = (catId: string) => {
    switch (catId) {
      case 'rigidas_uv':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          indicator: 'bg-purple-600',
          accent: 'text-purple-700',
        };
      case 'industrial_sublimacao':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          indicator: 'bg-indigo-600',
          accent: 'text-indigo-700',
        };
      case 'sublimacao_textil':
        return {
          badge: 'bg-blue-50 text-[#003399] border-blue-200',
          indicator: 'bg-[#003399]',
          accent: 'text-[#003399]',
        };
      case 'dtf':
        return {
          badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          indicator: 'bg-cyan-600',
          accent: 'text-cyan-800',
        };
      case 'dtg':
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          indicator: 'bg-emerald-600',
          accent: 'text-emerald-800',
        };
      case 'signage':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          indicator: 'bg-amber-600',
          accent: 'text-amber-800',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          indicator: 'bg-slate-600',
          accent: 'text-slate-800',
        };
    }
  };

  // Filtragem dos produtos por categoria e busca
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();
      return (
        product.name.toLowerCase().includes(query) ||
        product.code.toLowerCase().includes(query) ||
        product.line.toLowerCase().includes(query) ||
        product.application.toLowerCase().includes(query) ||
        product.technology.toLowerCase().includes(query) ||
        product.categoryLabel.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho Superior da Linha de Produtos */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Portfólio Oficial Epson Brasil
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Catálogo de Equipamentos Profissionais & Industriais
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Linha Completa de Produtos Epson
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Equipamentos de alta tecnologia para aplicações rígidas (UV), sublimação têxtil, DTF, DTG, comunicação visual e estamparia industrial contínua.
            </p>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por modelo, tecnologia ou aplicação..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Abas de Navegação por Categoria */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CATALOG_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? CATALOG_PRODUCTS.length
                  : CATALOG_PRODUCTS.filter((p) => p.categoryId === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#003399] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {renderCategoryIcon(cat.iconName, 'w-3.5 h-3.5')}
                  <span>{cat.shortTitle}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected
                        ? 'bg-blue-900/60 text-blue-100'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Banner de descrição da categoria ativa */}
          {selectedCategory !== 'all' && (
            <div className="mt-3.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100/80 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#003399] shrink-0" />
                <span className="text-slate-700 font-medium">
                  {
                    CATALOG_CATEGORIES.find((c) => c.id === selectedCategory)
                      ?.description
                  }
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] font-bold text-[#003399] hover:underline whitespace-nowrap"
              >
                Ver Todas as Linhas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Produtos */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Nenhum equipamento encontrado
          </h3>
          <p className="text-xs text-slate-500">
            Não encontramos resultados para a busca &quot;{searchQuery}&quot;. Tente outro termo ou limpe os filtros.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs font-bold text-[#003399] hover:underline"
          >
            Limpar Filtros e Mostrar Todos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const theme = getCategoryTheme(product.categoryId);
            const isRentalAvailable = product.canSimulateRental && product.rentalModelId;
            const rentalCost = isRentalAvailable
              ? costSettings[product.rentalModelId!]
              : null;
            const hasConfiguredCost =
              rentalCost?.hwNet !== null && (rentalCost?.hwNet ?? 0) > 0;

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Imagem do Produto com Foto Oficial da Epson */}
                  <div className="relative h-56 bg-gradient-to-b from-slate-100/70 via-slate-50/50 to-white p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                    {/* Badge da Categoria */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs uppercase tracking-wider ${theme.badge}`}
                      >
                        {product.code}
                      </span>
                    </div>

                    {/* Tag de Locação Disponível */}
                    {isRentalAvailable && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Simulação Disponível</span>
                        </span>
                      </div>
                    )}

                    {/* Imagem do Produto */}
                    <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-2"
                        referrerPolicy="no-referrer"
                        priority={product.id === 'f6470' || product.id === 'f9570'}
                      />
                    </div>
                  </div>

                  {/* Informações Principais */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        {product.line}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#003399] transition">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                        {product.application}
                      </p>
                    </div>

                    {/* Grid com Especificações Técnicas Resumidas */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                          Largura / Mesa
                        </span>
                        <span className="font-bold text-slate-800 text-[11px] block truncate">
                          {product.printWidth}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                          Velocidade
                        </span>
                        <span className="font-bold text-slate-800 text-[11px] block truncate">
                          {product.speed}
                        </span>
                      </div>
                    </div>

                    {/* Tecnologia de Tinta e Cabeça */}
                    <div className="space-y-1.5 text-xs bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/60">
                      <div className="flex items-start gap-1.5">
                        <span className="text-[10px] font-bold text-[#003399] uppercase shrink-0 mt-0.5">
                          Tinta:
                        </span>
                        <span className="text-[11px] text-slate-700 leading-snug font-medium line-clamp-1">
                          {product.inkType}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0 mt-0.5">
                          Cabeça:
                        </span>
                        <span className="text-[11px] text-slate-600 leading-snug line-clamp-1">
                          {product.technology}
                        </span>
                      </div>
                    </div>

                    {/* Lista com os 3 Principais Recursos */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Destaques Operacionais
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {product.keyFeatures.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-tight line-clamp-1">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Preço de Referência para os modelos do simulador */}
                    {isRentalAvailable && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">HW Net Atual:</span>
                        {hasConfiguredCost ? (
                          <span className="font-bold text-emerald-700">
                            R$ {rentalCost?.hwNet?.toLocaleString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold text-[11px]">
                            Em branco no painel
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões de Ação do Card */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-2">
                  {isRentalAvailable ? (
                    <button
                      type="button"
                      onClick={() => onSelectModelAndSimulate(product.rentalModelId!)}
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#003399] hover:bg-blue-800 text-white shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Simular Locação {product.code}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveModalProduct(product)}
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Ver Ficha Técnica Completa</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}

                  <div className="flex items-center justify-between text-[11px] px-1">
                    <button
                      type="button"
                      onClick={() => setActiveModalProduct(product)}
                      className="text-[#003399] hover:underline font-semibold"
                    >
                      Especificações detalhadas
                    </button>
                    {product.officialUrl && (
                      <a
                        href={product.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-600 flex items-center gap-1"
                      >
                        <span>Epson.com.br</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal com a Ficha Técnica Completa */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header do Modal */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60 sticky top-0 z-10 backdrop-blur-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#003399] border border-blue-200 uppercase">
                    {activeModalProduct.categoryLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {activeModalProduct.code}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {activeModalProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Foto Principal em Destaque */}
              <div className="relative h-64 bg-slate-50 rounded-xl p-4 flex items-center justify-center border border-slate-100">
                <Image
                  src={activeModalProduct.imageUrl}
                  alt={activeModalProduct.name}
                  fill
                  sizes="600px"
                  className="object-contain p-4"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Aplicação Principal */}
              <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#003399]">
                  Aplicações e Mercados Atendidos
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeModalProduct.application}
                </p>
              </div>

              {/* Tabela de Especificações */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Especificações Técnicas Oficiais
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Formato / Área de Trabalho
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeModalProduct.printWidth}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Velocidade de Operação
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeModalProduct.speed}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Tecnologia de Cabeça
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeModalProduct.technology}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Sistema de Tintas
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeModalProduct.inkType}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Resolução Máxima
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeModalProduct.resolution}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista Completa de Diferenciais */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Diferenciais de Engenharia Epson
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {activeModalProduct.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              {activeModalProduct.officialUrl && (
                <a
                  href={activeModalProduct.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#003399] font-bold flex items-center gap-1.5 hover:underline"
                >
                  <span>Página Oficial Epson Brasil</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                  Fechar
                </button>

                {activeModalProduct.canSimulateRental && activeModalProduct.rentalModelId && (
                  <button
                    type="button"
                    onClick={() => {
                      const modelId = activeModalProduct.rentalModelId!;
                      setActiveModalProduct(null);
                      onSelectModelAndSimulate(modelId);
                    }}
                    className="px-4 py-2 text-xs font-bold bg-[#003399] hover:bg-blue-800 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <span>Simular Locação {activeModalProduct.code}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
