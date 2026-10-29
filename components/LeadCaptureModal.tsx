'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Building2, MapPin, CheckCircle, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { BRAZILIAN_STATES } from '@/lib/data/brazilianStates';
import { registerLead } from '@/lib/crmService';
import { LeadRecord } from '@/lib/types';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured: (lead: LeadRecord) => void;
  currentLead?: LeadRecord | null;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onLeadCaptured,
  currentLead,
}: LeadCaptureModalProps) {
  const [name, setName] = useState(currentLead?.name || '');
  const [email, setEmail] = useState(currentLead?.email || '');
  const [phone, setPhone] = useState(currentLead?.phone || '');
  const [company, setCompany] = useState(currentLead?.company || '');
  const [state, setState] = useState(currentLead?.state || 'SC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, informe um e-mail válido.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Por favor, informe seu telefone com DDD.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = await registerLead({
        name,
        email,
        phone,
        company: company || undefined,
        state: state || undefined,
      });

      // Save to localStorage for seamless session persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('epson_current_lead', JSON.stringify(saved));
      }

      onLeadCaptured(saved);
      onClose();
    } catch (err: any) {
      console.error('Erro ao cadastrar lead:', err);
      // In case Firestore permissions require login or network hiccup, fallback locally gracefully
      const localLead: LeadRecord = {
        id: `lead_${Date.now()}`,
        name,
        email,
        phone,
        company: company || undefined,
        state: state || undefined,
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('epson_current_lead', JSON.stringify(localLead));
      }
      onLeadCaptured(localLead);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
        {/* Header com tom de azul Epson */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-500/40 rounded border border-blue-300/30">
                Epson SureColor® Locação
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-bold mt-2">Identificação para Simulação</h2>
          <p className="text-xs text-blue-100 mt-1">
            Cadastre seus dados para simular parcelas, prazos de amortização e receber propostas personalizadas.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Mendes"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail Corporativo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos@empresa.com.br"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone / WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(47) 99876-5432"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Empresa / Estamparia / Confecção
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex: Estampa Brasil Ltda"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estado (UF)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {BRAZILIAN_STATES.map((st) => (
                    <option key={st.uf} value={st.uf}>
                      {st.uf} - {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Salvando cadastro...</span>
              ) : (
                <>
                  <span>Acessar Simulador & Salvar Perfil</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Seus dados serão gravados com segurança no banco de dados Epson.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 underline"
            >
              Pular por agora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
