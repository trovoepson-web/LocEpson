'use client';

import React, { useState } from 'react';
import {
  SimulationResult,
  ClientScenario,
  GeneratedProposal
} from '@/lib/types';
import {
  Sparkles,
  MessageSquare,
  Mail,
  FileText,
  Copy,
  Check,
  Printer,
  Scale,
  Zap,
  ShieldCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AiProposalGeneratorProps {
  simulation: SimulationResult;
  clientScenario: ClientScenario;
  proposal: GeneratedProposal | null;
  setProposal: (prop: GeneratedProposal | null) => void;
  onOpenPrintView: () => void;
}

export default function AiProposalGenerator({
  simulation,
  clientScenario,
  proposal,
  setProposal,
  onOpenPrintView,
}: AiProposalGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'pitch' | 'operation' | 'clauses' | 'whatsapp' | 'email'>('summary');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerateProposal = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/proposal/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientInfo: clientScenario,
          simulation,
          customInstructions,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao gerar proposta comercial com IA.');
      }

      setProposal(data.proposal);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Falha na comunicação com o assistente comercial Epson.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal Claro */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>Inteligência Artificial Comercial Epson • Gemini 3.8 Flash</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Gerador Inteligente de Propostas & Pitch de Vendas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Transforme os números de amortização da {simulation.modelInfo.name} em propostas de alto impacto para a confecção {clientScenario.clientName || 'Cliente'}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleGenerateProposal}
              disabled={loading}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#003399] hover:bg-blue-800 text-white shadow-xs transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Elaborando Proposta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{proposal ? 'Regenerar com IA' : 'Gerar Proposta com IA'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenPrintView}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#003399]" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Instruções Adicionais para IA */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>Diretrizes e Ajustes Comerciais para a IA (Opcional):</span>
            <span className="text-[10px] text-slate-400 font-normal">Personalize para a realidade do cliente</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Cliente tem receio de custo de manutenção; focar na garantia total de cabeça e suporte rápido..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={handleGenerateProposal}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition shrink-0"
            >
              Atualizar
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Conteúdo Gerado ou Painel de Visualização */}
      {proposal ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          {/* Navegação entre seções da Proposta */}
          <div className="border-b border-slate-200 bg-slate-50/80 p-2 sm:px-4 flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-[#003399] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resumo Executivo</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'pitch'
                  ? 'bg-[#003399] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Pitch OPEX vs CAPEX</span>
            </button>

            <button
              onClick={() => setActiveTab('operation')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'operation'
                  ? 'bg-[#003399] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Análise Operacional</span>
            </button>

            <button
              onClick={() => setActiveTab('clauses')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'clauses'
                  ? 'bg-[#003399] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Garantia & Cabeça</span>
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mensagem WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'email'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-mail Executivo</span>
            </button>
          </div>

          {/* Conteúdo da Aba */}
          <div className="p-6">
            {activeTab === 'summary' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#003399]" />
                    <span>Resumo Executivo para a Tomada de Decisão</span>
                  </h3>
                  <button
                    onClick={() => handleCopyText(proposal.executiveSummary, 'summary')}
                    className="flex items-center gap-1.5 text-xs text-slate-700 hover:bg-slate-100 bg-white px-3 py-1.5 rounded-lg border border-slate-300 transition"
                  >
                    {copiedField === 'summary' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {proposal.executiveSummary}
                </div>
              </div>
            )}

            {activeTab === 'pitch' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#003399]" />
                    <span>Argumentação Estratégica: OPEX vs CAPEX</span>
                  </h3>
                  <button
                    onClick={() => handleCopyText(proposal.capexVsOpexStrategicPitch, 'pitch')}
                    className="flex items-center gap-1.5 text-xs text-slate-700 hover:bg-slate-100 bg-white px-3 py-1.5 rounded-lg border border-slate-300 transition"
                  >
                    {copiedField === 'pitch' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Pitch</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {proposal.capexVsOpexStrategicPitch}
                </div>
              </div>
            )}

            {activeTab === 'operation' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#003399]" />
                    <span>Análise Operacional da Estamparia & Capacidade Produtiva</span>
                  </h3>
                  <button
                    onClick={() => handleCopyText(proposal.operationalImpactAnalysis, 'operation')}
                    className="flex items-center gap-1.5 text-xs text-slate-700 hover:bg-slate-100 bg-white px-3 py-1.5 rounded-lg border border-slate-300 transition"
                  >
                    {copiedField === 'operation' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Análise</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {proposal.operationalImpactAnalysis}
                </div>
              </div>
            )}

            {activeTab === 'clauses' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#003399]" />
                    <span>Cláusulas Comerciais, Garantia & SLA de Cabeças de Impressão</span>
                  </h3>
                  <button
                    onClick={() => handleCopyText(proposal.warrantyAndSlaClauses, 'clauses')}
                    className="flex items-center gap-1.5 text-xs text-slate-700 hover:bg-slate-100 bg-white px-3 py-1.5 rounded-lg border border-slate-300 transition"
                  >
                    {copiedField === 'clauses' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Cláusulas</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {proposal.warrantyAndSlaClauses}
                </div>
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-emerald-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Pitch Pronto para WhatsApp (1 Clique para Copiar)</span>
                  </h3>
                  <button
                    onClick={() => handleCopyText(proposal.whatsAppPitch, 'whatsapp')}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg transition shadow-xs"
                  >
                    {copiedField === 'whatsapp' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar para WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-slate-900 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {proposal.whatsAppPitch}
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-indigo-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-700" />
                    <span>E-mail Formal Executivo Pronto para Envio</span>
                  </h3>
                  <button
                    onClick={() => handleCopyText(proposal.executiveEmail, 'email')}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 px-3.5 py-1.5 rounded-lg transition shadow-xs"
                  >
                    {copiedField === 'email' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>E-mail Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar E-mail Formal</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5 bg-indigo-50/40 border border-indigo-200 rounded-xl text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {proposal.executiveEmail}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#003399] flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 text-amber-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Nenhuma Proposta Gerada Ainda para esta Simulação
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Clique no botão abaixo para que o assistente comercial Epson elabore a proposta completa para a {simulation.modelInfo.name}.
          </p>
          <button
            type="button"
            onClick={handleGenerateProposal}
            disabled={loading}
            className="px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#003399] hover:bg-blue-800 text-white shadow-xs transition inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando Proposta...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Gerar Proposta Agora com IA</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
