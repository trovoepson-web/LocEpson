'use client';

import React from 'react';
import { SimulationResult, ClientScenario, GeneratedProposal } from '@/lib/types';
import { Printer, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PrintableProposalProps {
  simulation: SimulationResult;
  clientScenario: ClientScenario;
  proposal: GeneratedProposal | null;
  onBack: () => void;
}

export default function PrintableProposal({
  simulation,
  clientScenario,
  proposal,
  onBack,
}: PrintableProposalProps) {
  const { modelInfo, selectedTerm, totalFinancedBase, competitiveAdvantages, amortizationTable } = simulation;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const [proposalId] = React.useState(
    () => proposal?.id || `EPSON-LOC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  );

  const [today] = React.useState(() => {
    const d = new Date();
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  });

  return (
    <div className="bg-slate-950 min-h-screen py-8 text-slate-900 print:bg-white print:py-0 print:text-black">
      {/* Barra de Ações Superior (Oculta na impressão) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Sistema</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Folha Oficial de Proposta (Formato A4 Estilizado) */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-12 print:p-0 print:shadow-none print:rounded-none border border-slate-200 print:border-none">
        {/* Cabeçalho Epson Oficial */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-blue-900 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-blue-900 tracking-wider">EPSON</span>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Sublimação Têxtil
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-1">
              Epson do Brasil • Divisão de Impressão Industrial & Comercial
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600">
            <div className="font-bold text-slate-900 text-sm">{proposalId}</div>
            <div>Data de Emissão: {today}</div>
            <div className="text-blue-700 font-semibold">Validade da Proposta: 15 dias corridos</div>
          </div>
        </div>

        {/* Título Principal */}
        <div className="mt-6 text-center">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
            Proposta Comercial de Locação Operacional (OPEX)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ecossistema Completo de Impressão Sublimática: Equipamento + Cabeça de Impressão Inclusa + Software RIP + Suporte Oficial
          </p>
        </div>

        {/* Bloco: Dados Cadastrais das Partes */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <h3 className="font-bold text-blue-900 uppercase text-[11px] mb-1">
              Cliente / Locatário
            </h3>
            <div className="font-bold text-slate-800 text-sm">
              {clientScenario.clientName || 'Confecção Cliente'}
            </div>
            <div className="text-slate-600">CNPJ: {clientScenario.cnpj || 'Sob consulta'}</div>
            <div className="text-slate-600">Responsável: {clientScenario.contactPerson || 'Diretoria'}</div>
            <div className="text-slate-600">Estado de Destino: {clientScenario.destinationUf} (DIFAL {simulation.difalPercent.toFixed(1)}%)</div>
            <div className="text-slate-600">Regime Tributário: {clientScenario.clientTaxRegime.toUpperCase()}</div>
          </div>

          <div>
            <h3 className="font-bold text-blue-900 uppercase text-[11px] mb-1">
              Locadora / Faturamento
            </h3>
            <div className="font-bold text-slate-800">Epson Specialist Partner</div>
            <div className="text-slate-600">Origem do Faturamento: Rio de Janeiro (RJ)</div>
            <div className="text-slate-600">Taxa de Juros Aplicada: {simulation.monthlyInterestRate}% a.m. (Tabela Price)</div>
            <div className="text-slate-600">Software Incluso: Epson Edge Print Genuíno (Adobe PS3)</div>
            <div className="text-emerald-700 font-bold">Garantia: Cabeça de Impressão 100% Inclusa</div>
          </div>
        </div>

        {/* Bloco: Equipamento Selecionado */}
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase text-blue-900 tracking-wider mb-2 border-b border-slate-200 pb-1">
            1. Equipamento Contratado & Especificações Técnicas
          </h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50">
                  <td className="py-2 px-3 font-bold text-slate-700 w-1/3">Modelo</td>
                  <td className="py-2 px-3 font-black text-slate-900">{modelInfo.fullName}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-slate-700">Largura de Impressão</td>
                  <td className="py-2 px-3">{modelInfo.widthInches}&quot; ({modelInfo.widthCm} cm de boca)</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-2 px-3 font-bold text-slate-700">Tecnologia de Cabeça</td>
                  <td className="py-2 px-3">{modelInfo.headsDescription} ({modelInfo.printheadsCount} cabeça(s))</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-slate-700">Velocidade Nominal / Real</td>
                  <td className="py-2 px-3">{modelInfo.speedDescription}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-2 px-3 font-bold text-slate-700">Tecnologia de Tinta</td>
                  <td className="py-2 px-3">{modelInfo.inkTechnology} ({modelInfo.defaultColors})</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-slate-700">Software RIP Homologado</td>
                  <td className="py-2 px-3 font-semibold text-blue-900">Epson Edge Print Original Incluso (Zero Custo Extra)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bloco: Condições Financeiras & Amortização */}
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase text-blue-900 tracking-wider mb-2 border-b border-slate-200 pb-1">
            2. Condições Comerciais & Tabela de Amortização Progressiva
          </h2>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Prazo</th>
                  <th className="py-2.5 px-3">Parcela Mensal (Price)</th>
                  <th className="py-2.5 px-3">Custo por m²</th>
                  <th className="py-2.5 px-3">Total do Contrato</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {amortizationTable.map((item) => {
                  const isCurrent = item.months === selectedTerm.months;
                  return (
                    <tr
                      key={item.months}
                      className={isCurrent ? 'bg-blue-50 font-bold text-blue-950' : 'text-slate-700'}
                    >
                      <td className="py-2 px-3 font-bold">{item.months} meses</td>
                      <td className="py-2 px-3 font-black text-slate-900">
                        R$ {item.monthlyInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /mês
                      </td>
                      <td className="py-2 px-3">
                        R$ {item.costPerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/m²
                      </td>
                      <td className="py-2 px-3">
                        R$ {item.totalContractCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-3">
                        {isCurrent ? (
                          <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                            Prazo Escolhido
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Alternativa</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
            <span>
              <strong>Base Financiada Global:</strong> R$ {totalFinancedBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Equipamento com margem + DIFAL + Custos Operacionais).
            </span>
            <span>
              <strong>Taxa:</strong> 0,99% a.m.
            </span>
          </div>
        </div>

        {/* Bloco: Análise de Produção & Viabilidade */}
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase text-blue-900 tracking-wider mb-2 border-b border-slate-200 pb-1">
            3. Viabilidade Econômica na Confecção do Cliente
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-slate-500 block text-[10px] font-semibold">Produção Estimada</span>
              <span className="font-bold text-slate-900 text-sm">
                {simulation.productionMetrics.monthlyProductionM2.toLocaleString('pt-BR')} m²/mês
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-slate-500 block text-[10px] font-semibold">Preço Cobrado</span>
              <span className="font-bold text-slate-900 text-sm">
                R$ {simulation.productionMetrics.sellingPricePerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/m²
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-slate-500 block text-[10px] font-semibold">Impacto da Locação</span>
              <span className="font-bold text-blue-700 text-sm">
                R$ {selectedTerm.costPerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/m²
              </span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-emerald-700 block text-[10px] font-semibold">Lucro Líquido Estimado</span>
              <span className="font-black text-emerald-800 text-sm">
                R$ {simulation.productionMetrics.monthlyNetOperatingProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
              </span>
            </div>
          </div>
        </div>

        {/* Bloco: Vantagens Competitivas & Cláusulas Chave */}
        <div className="mt-6 space-y-2 text-xs">
          <h2 className="text-xs font-bold uppercase text-blue-900 tracking-wider mb-2 border-b border-slate-200 pb-1">
            4. Diferenciais Exclusivos do Contrato de Locação Epson
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Zero CAPEX (Preservação do Caixa):</strong>
                <span className="text-slate-600">
                  O cliente não imobiliza R$ {(competitiveAdvantages.streetPrice || 50000).toLocaleString('pt-BR')} do seu capital de giro.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Cabeça de Impressão 100% Inclusa:</strong>
                <span className="text-slate-600">
                  Reposição garantida sem custo adicional durante toda a vigência do contrato.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Software RIP Epson Edge Print:</strong>
                <span className="text-slate-600">
                  Licença original inclusa com suporte a perfis de cor ICC e motor Adobe PS3.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Dedução Tributária (OPEX):</strong>
                <span className="text-slate-600">
                  Despesa operacional dedutível integralmente na apuração de IRPJ, CSLL e PIS/COFINS.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Parecer do Especialista com IA (Se disponível) */}
        {proposal?.executiveSummary && (
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
            <h3 className="font-bold text-blue-900 uppercase text-[11px] mb-1">
              5. Parecer Consultivo Comercial
            </h3>
            <p className="leading-relaxed whitespace-pre-line">{proposal.executiveSummary}</p>
          </div>
        )}

        {/* Bloco de Assinaturas */}
        <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
              Epson do Brasil / Especialista Comercial
            </div>
            <span className="text-slate-500">Divisão de Impressão Têxtil SureColor</span>
          </div>

          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
              {clientScenario.clientName || 'Aceite do Locatário'}
            </div>
            <span className="text-slate-500">Representante Legal / De Acordo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
