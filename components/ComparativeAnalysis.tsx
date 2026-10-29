'use client';

import React from 'react';
import { SimulationResult, ClientScenario } from '@/lib/types';
import {
  Scale,
  ShieldCheck,
  Zap,
  TrendingDown,
  Coins,
  CheckCircle2,
  ArrowRight,
  FileText
} from 'lucide-react';

interface ComparativeAnalysisProps {
  simulation: SimulationResult;
  clientScenario: ClientScenario;
  onGoToProposal: () => void;
  onOpenPrintView: () => void;
}

export default function ComparativeAnalysis({
  simulation,
  clientScenario,
  onGoToProposal,
  onOpenPrintView,
}: ComparativeAnalysisProps) {
  const { modelInfo, selectedTerm, competitiveAdvantages, hwNet } = simulation;

  const streetPrice = competitiveAdvantages.streetPrice > 0 
    ? competitiveAdvantages.streetPrice 
    : (hwNet * 1.55);

  const headCost = competitiveAdvantages.printheadCostEach > 0 
    ? competitiveAdvantages.printheadCostEach 
    : 8500;

  const headsCountSaved = competitiveAdvantages.printheadReplacementsEstimated;
  const headsTotalSaved = competitiveAdvantages.printheadTotalSavings;

  const bankMonthlyRate = 0.016;
  const n = selectedTerm.months;
  const bankFactor = Math.pow(1 + bankMonthlyRate, n);
  const bankPmt = streetPrice > 0 ? (streetPrice * (bankMonthlyRate * bankFactor)) / (bankFactor - 1) : 0;

  return (
    <div className="space-y-6">
      {/* Banner Principal Claro */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Matriz Estratégica: Locação (OPEX) vs. Compra / CDC (CAPEX)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Por que a Locação Epson é a Escolha Mais Inteligente para a Confecção?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Na sublimação têxtil, o maior risco financeiro reside nas trocas frequentes de cabeças de impressão, obsolescência e imobilização de capital de giro.
          </p>
        </div>
      </div>

      {/* Os 4 Pilares da Vantagem Competitiva */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003399] flex items-center justify-center mb-3">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">1. Zero CAPEX</h3>
          <p className="text-xs text-slate-600 mt-1">
            Preserva o capital de giro. Evita o desembolso inicial de{' '}
            <strong className="text-slate-900">R$ {streetPrice.toLocaleString('pt-BR')}</strong>, permitindo direcionar caixa para tecidos e produção.
          </p>
        </div>

        <div className="bg-white border-2 border-emerald-300 rounded-2xl p-5 shadow-xs bg-emerald-50/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">2. Cabeça Inclusa</h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              Sem Risco
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Na compra avulsa, 1 troca de cabeça custa <strong className="text-slate-900">R$ {headCost.toLocaleString('pt-BR')}</strong>. Na locação Epson, a reposição preventiva e corretiva está 100% coberta.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">3. Epson Edge Print</h3>
          <p className="text-xs text-slate-600 mt-1">
            Software RIP profissional com motor Adobe PostScript 3 genuíno incluso. Economia direta de licenças de terceiros (Wasatch/Neostampa de R$ 8k a R$ 15k).
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <TrendingDown className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">4. Tratamento Fiscal OPEX</h3>
          <p className="text-xs text-slate-600 mt-1">
            Despesa operacional líquida. Para clientes no Lucro Real, permite abatimento de 34% (IRPJ + CSLL) e 9,25% de crédito de PIS/COFINS (até 43,25% de redução).
          </p>
        </div>
      </div>

      {/* Tabela Comparativa */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Quadro Comparativo de Modalidades ({modelInfo.name} - {selectedTerm.months} meses)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Análise financeira e técnica considerando custos operacionais reais
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPrintView}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#003399]" />
              <span>Imprimir Quadro</span>
            </button>
            <button
              onClick={onGoToProposal}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#003399] hover:bg-blue-800 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Gerar Proposta IA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-600 font-bold">
                <th className="py-3 px-5 w-1/4">Critério Financeiro / Técnico</th>
                <th className="py-3 px-5 w-1/4 bg-blue-50 text-[#003399] font-black border-x border-blue-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                    <span>Locação Epson (Recomendado)</span>
                  </div>
                </th>
                <th className="py-3 px-5 w-1/4">Compra Direta à Vista</th>
                <th className="py-3 px-5 w-1/4">Financiamento Bancário (CDC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-5 font-bold text-slate-900">Desembolso Inicial (Capex)</td>
                <td className="py-3 px-5 font-black text-emerald-700 bg-blue-50/40 border-x border-blue-200">
                  R$ 0,00 (Zero Capex)
                </td>
                <td className="py-3 px-5 text-rose-700 font-semibold">
                  R$ {streetPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (100% à vista)
                </td>
                <td className="py-3 px-5 text-slate-600">
                  R$ {(streetPrice * 0.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (20% entrada)
                </td>
              </tr>

              <tr>
                <td className="py-3 px-5 font-bold text-slate-900">Parcela Mensal Estimada</td>
                <td className="py-3 px-5 font-black text-[#003399] bg-blue-50/40 border-x border-blue-200">
                  R$ {selectedTerm.monthlyInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês
                </td>
                <td className="py-3 px-5 text-slate-500">
                  R$ 0,00 (Pago antecipado)
                </td>
                <td className="py-3 px-5 font-semibold text-slate-800">
                  ~R$ {bankPmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês
                </td>
              </tr>

              <tr>
                <td className="py-3 px-5 font-bold text-slate-900">Reposição de Cabeça de Impressão</td>
                <td className="py-3 px-5 font-black text-emerald-700 bg-blue-50/40 border-x border-blue-200">
                  100% Inclusa no Contrato
                </td>
                <td className="py-3 px-5 text-rose-700">
                  R$ {headCost.toLocaleString('pt-BR')} por conta do cliente
                </td>
                <td className="py-3 px-5 text-rose-700">
                  R$ {headCost.toLocaleString('pt-BR')} por conta do cliente
                </td>
              </tr>

              <tr>
                <td className="py-3 px-5 font-bold text-slate-900">Software RIP Original</td>
                <td className="py-3 px-5 font-black text-emerald-700 bg-blue-50/40 border-x border-blue-200">
                  Epson Edge Print Incluso
                </td>
                <td className="py-3 px-5 text-slate-500">
                  Cobrado à parte (~R$ 9.500)
                </td>
                <td className="py-3 px-5 text-slate-500">
                  Cobrado à parte
                </td>
              </tr>

              <tr>
                <td className="py-3 px-5 font-bold text-slate-900">Benefício Tributário (Lucro Real)</td>
                <td className="py-3 px-5 font-black text-emerald-700 bg-blue-50/40 border-x border-blue-200">
                  Deduz até 43,25% (OPEX puro)
                </td>
                <td className="py-3 px-5 text-slate-500">
                  Depreciação contábil lenta
                </td>
                <td className="py-3 px-5 text-slate-500">
                  Apenas os juros são dedutíveis
                </td>
              </tr>

              <tr>
                <td className="py-3 px-5 font-bold text-slate-900">Obsolescência Tecnológica</td>
                <td className="py-3 px-5 font-black text-emerald-700 bg-blue-50/40 border-x border-blue-200">
                  Atualização para nova máquina
                </td>
                <td className="py-3 px-5 text-slate-500">
                  Equipamento antigo depreciado
                </td>
                <td className="py-3 px-5 text-slate-500">
                  Equipamento antigo depreciado
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Resumo Rodapé */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Economia Protegida com a Locação Epson
            </span>
            <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Mais de R$ {(headsTotalSaved + 9500 + (streetPrice * 0.15)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} em riscos e custos eliminados
            </h4>
            <p className="text-xs text-slate-600">
              Inclui {headsCountSaved} cabeças de impressão cobertas, software RIP original e taxa de juros competitiva de 0,99% a.m.
            </p>
          </div>

          <button
            onClick={onGoToProposal}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#003399] hover:bg-blue-800 text-white shadow-xs transition flex items-center gap-2 whitespace-nowrap"
          >
            <span>Incluir na Proposta Comercial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
