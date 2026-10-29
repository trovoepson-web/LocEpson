'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  FileSpreadsheet,
  Search,
  Filter,
  ArrowUpRight,
  MessageCircle,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  MapPin,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  LogIn,
  LogOut,
} from 'lucide-react';
import { LeadRecord, OpportunityRecord, OpportunityStatus, PrinterModelId } from '@/lib/types';
import {
  subscribeToOpportunities,
  subscribeToLeads,
  updateOpportunity,
  deleteOpportunity,
  getLocalOpportunities,
  getLocalLeads,
} from '@/lib/crmService';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface AdminCrmDashboardProps {
  onLoadOpportunityToSimulator: (opp: OpportunityRecord) => void;
}

export default function AdminCrmDashboard({ onLoadOpportunityToSimulator }: AdminCrmDashboardProps) {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'opportunities' | 'leads'>('opportunities');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Monitor Firebase Auth state with safe error catcher
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);
        },
        (err) => {
          console.warn('Aviso de status de autenticação:', err);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Aviso de monitoramento de autenticação:', e);
    }
  }, []);

  // Listen to Firestore real-time updates directly on mount with local storage synchronization
  useEffect(() => {
    // Initial local records load
    const localOpps = getLocalOpportunities();
    const localLeads = getLocalLeads();
    setTimeout(() => {
      setOpportunities(localOpps);
      setLeads(localLeads);
    }, 0);

    const unsubOpps = subscribeToOpportunities(
      (data) => {
        const map = new Map<string, OpportunityRecord>();
        data.forEach((o) => map.set(o.id, o));
        localOpps.forEach((o) => {
          if (!map.has(o.id)) map.set(o.id, o);
        });
        const merged = Array.from(map.values());
        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOpportunities(merged);
      },
      (err) => {
        console.warn('Oportunidades via Firestore:', err);
      }
    );

    const unsubLeads = subscribeToLeads(
      (data) => {
        const map = new Map<string, LeadRecord>();
        data.forEach((l) => map.set(l.id, l));
        localLeads.forEach((l) => {
          if (!map.has(l.id)) map.set(l.id, l);
        });
        setLeads(Array.from(map.values()));
      },
      (err) => {
        console.warn('Leads via Firestore:', err);
      }
    );

    return () => {
      unsubOpps();
      unsubLeads();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Erro no login Google:', err);
      setAuthError('Falha ao autenticar com Google.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  };

  const handleStatusChange = async (oppId: string, newStatus: OpportunityStatus) => {
    try {
      await updateOpportunity(oppId, { status: newStatus });
      setOpportunities((prev) =>
        prev.map((o) => (o.id === oppId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o))
      );
    } catch (e) {
      console.error('Erro ao atualizar status', e);
    }
  };

  const handleDeleteOpp = async (oppId: string) => {
    if (confirm('Deseja realmente excluir esta oportunidade?')) {
      try {
        await deleteOpportunity(oppId);
        setOpportunities((prev) => prev.filter((o) => o.id !== oppId));
      } catch (e) {
        console.error('Erro ao excluir oportunidade', e);
      }
    }
  };

  // KPIs
  const totalFinancedPipeline = opportunities.reduce((acc, curr) => acc + (curr.financedBase || 0), 0);
  const avgMonthlyInstallment =
    opportunities.length > 0
      ? opportunities.reduce((acc, curr) => acc + (curr.monthlyInstallment || 0), 0) / opportunities.length
      : 0;

  // Filtered list
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.clientPhone && opp.clientPhone.includes(searchTerm)) ||
      (opp.clientCompany && opp.clientCompany.toLowerCase().includes(searchTerm.toLowerCase())) ||
      opp.printerModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
    const matchesModel = modelFilter === 'all' || opp.printerModel.includes(modelFilter);

    return matchesSearch && matchesStatus && matchesModel;
  });

  const filteredLeads = leads.filter((lead) => {
    return (
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getStatusBadge = (status: OpportunityStatus) => {
    switch (status) {
      case 'nova':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">Nova</span>;
      case 'em_negociacao':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Em Negociação</span>;
      case 'proposta_enviada':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">Proposta Enviada</span>;
      case 'ganha':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Ganha (Fechada)</span>;
      case 'perdida':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Perdida</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">Nova</span>;
    }
  };

  const getCleanPhone = (phone?: string) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Status de Autenticação */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-600 rounded text-white">
                Admin CRM Epson
              </span>
              <span className="flex items-center gap-1 text-xs text-blue-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Banco de Dados Firestore Conectado
              </span>
            </div>
            <h1 className="text-2xl font-bold">Oportunidades & Gestão de Clientes</h1>
            <p className="text-xs text-slate-300 mt-1">
              Acompanhamento em tempo real de simulações, leads qualificados e pipeline de locação têxtil.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-slate-200">{currentUser.email}</span>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-slate-400 hover:text-white transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login Administrador
              </button>
            )}
          </div>
        </div>
      </div>

      {authError && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
          {authError}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Oportunidades</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{opportunities.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Simulações registradas no banco</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pipeline Financiado</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalFinancedPipeline)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Base financiada total acumulada</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Média Mensalidade</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-indigo-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(avgMonthlyInstallment)}
            <span className="text-xs font-normal text-slate-500">/mês</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ticket médio das parcelas</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clientes & Leads</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{leads.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Cadastros únicos identificados</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('opportunities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'opportunities'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Oportunidades de Locação ({opportunities.length})
            </button>
            <button
              onClick={() => setActiveSubTab('leads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'leads'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Clientes Cadastrados ({leads.length})
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            Sincronização em tempo real ativa
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por cliente, e-mail, telefone..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {activeSubTab === 'opportunities' && (
            <>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                >
                  <option value="all">Todos os Status</option>
                  <option value="nova">Nova</option>
                  <option value="em_negociacao">Em Negociação</option>
                  <option value="proposta_enviada">Proposta Enviada</option>
                  <option value="ganha">Ganha (Fechada)</option>
                  <option value="perdida">Perdida</option>
                </select>
              </div>

              <div>
                <select
                  value={modelFilter}
                  onChange={(e) => setModelFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                >
                  <option value="all">Todos os Modelos</option>
                  <option value="F6470">SureColor F6470 (44&quot;)</option>
                  <option value="F9570">SureColor F9570 (64&quot;)</option>
                  <option value="F20070">SureColor F20070 (Industrial)</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabela de Oportunidades */}
      {activeSubTab === 'opportunities' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Nenhuma oportunidade encontrada</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                À medida que os clientes acessarem a tela inicial ou simularem propostas, as oportunidades serão listadas aqui instantaneamente.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="p-3">Data</th>
                    <th className="p-3">Cliente / Empresa</th>
                    <th className="p-3">Modelo</th>
                    <th className="p-3">Prazo</th>
                    <th className="p-3">Parcela Mensal</th>
                    <th className="p-3">Base Financiada</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOpportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {opp.createdAt ? new Date(opp.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{opp.clientName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          {opp.clientCompany && (
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Building className="w-3 h-3 text-slate-400" />
                              {opp.clientCompany}
                            </span>
                          )}
                          {opp.destinationUf && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                              {opp.destinationUf}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{opp.clientEmail}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {opp.printerModel}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-semibold whitespace-nowrap">
                        {opp.termMonths} meses
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-sm">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opp.monthlyInstallment)}
                        </div>
                        <div className="text-[10px] text-slate-400">/mês (0.99% a.m.)</div>
                      </td>
                      <td className="p-3 whitespace-nowrap text-slate-600 font-medium">
                        {opp.financedBase
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(opp.financedBase)
                          : '-'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {getStatusBadge(opp.status)}
                          <select
                            value={opp.status}
                            onChange={(e) => handleStatusChange(opp.id, e.target.value as OpportunityStatus)}
                            className="text-[10px] bg-transparent border border-slate-200 rounded px-1 py-0.5 text-slate-600 hover:border-slate-400 focus:outline-none"
                            title="Alterar status"
                          >
                            <option value="nova">Nova</option>
                            <option value="em_negociacao">Em Negociação</option>
                            <option value="proposta_enviada">Proposta Enviada</option>
                            <option value="ganha">Ganha</option>
                            <option value="perdida">Perdida</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {opp.clientPhone && (
                            <a
                              href={`https://wa.me/55${getCleanPhone(opp.clientPhone)}?text=Ol%C3%A1%20${encodeURIComponent(opp.clientName)},%20sou%20da%20equipe%20Epson%20SureColor.%20Vi%20sua%20simula%C3%A7%C3%A3o%20para%20o%20modelo%20${opp.printerModel}%20em%20${opp.termMonths}%20meses.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                              title="Chamar no WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <a
                            href={`mailto:${opp.clientEmail}?subject=Simulação%20Locação%20Epson%20${opp.printerModel}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            title="Enviar E-mail"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => onLoadOpportunityToSimulator(opp)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors text-[11px]"
                            title="Carregar esta simulação"
                          >
                            <span>Carregar</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteOpp(opp.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir Oportunidade"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tabela de Leads Cadastrados */}
      {activeSubTab === 'leads' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Nenhum cliente cadastrado</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Os clientes identificados no onboarding da página inicial serão armazenados aqui para consulta comercial.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="p-3">Data Cadastro</th>
                    <th className="p-3">Nome Completo</th>
                    <th className="p-3">E-mail</th>
                    <th className="p-3">Telefone / WhatsApp</th>
                    <th className="p-3">Empresa</th>
                    <th className="p-3">Estado (UF)</th>
                    <th className="p-3 text-right">Contato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{lead.name}</td>
                      <td className="p-3 text-slate-600">{lead.email}</td>
                      <td className="p-3 font-medium text-slate-800 whitespace-nowrap">{lead.phone}</td>
                      <td className="p-3 text-slate-600">{lead.company || '-'}</td>
                      <td className="p-3">
                        {lead.state ? (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                            {lead.state}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {lead.phone && (
                            <a
                              href={`https://wa.me/55${getCleanPhone(lead.phone)}?text=Ol%C3%A1%20${encodeURIComponent(lead.name)},%20sou%20da%20equipe%20comercial%20Epson%20SureColor.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            title="E-mail"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
