import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { LeadRecord, OpportunityRecord, OpportunityStatus } from './types';

const LEADS_COLLECTION = 'leads';
const OPPS_COLLECTION = 'opportunities';
const LOCAL_LEADS_KEY = 'epson_local_leads';
const LOCAL_OPPS_KEY = 'epson_local_opportunities';

// Helper to generate sanitized ID
function sanitizeId(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 100);
}

/**
 * Local cache helpers for instant access
 */
export function getLocalLeads(): LeadRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalLead(lead: LeadRecord) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalLeads().filter((l) => l.email !== lead.email);
    current.unshift(lead);
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(current));
  } catch (e) {}
}

export function getLocalOpportunities(): OpportunityRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_OPPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalOpportunity(opp: OpportunityRecord) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalOpportunities().filter((o) => o.id !== opp.id);
    current.unshift(opp);
    localStorage.setItem(LOCAL_OPPS_KEY, JSON.stringify(current));
  } catch (e) {}
}

export function updateLocalOpportunity(oppId: string, updates: { status?: OpportunityStatus; notes?: string }) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalOpportunities().map((o) => {
      if (o.id === oppId) {
        return {
          ...o,
          status: updates.status || o.status,
          notes: updates.notes !== undefined ? updates.notes : o.notes,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
    localStorage.setItem(LOCAL_OPPS_KEY, JSON.stringify(current));
  } catch (e) {}
}

export function deleteLocalOpportunity(oppId: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalOpportunities().filter((o) => o.id !== oppId);
    localStorage.setItem(LOCAL_OPPS_KEY, JSON.stringify(current));
  } catch (e) {}
}

/**
 * Register or update a visitor/client lead
 */
export async function registerLead(data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  state?: string;
}): Promise<LeadRecord> {
  const leadId = sanitizeId(data.email) || `lead_${Date.now()}`;
  const nowIso = new Date().toISOString();

  const payload: Record<string, any> = {
    name: data.name.trim().slice(0, 150),
    email: data.email.trim().toLowerCase().slice(0, 150),
    phone: data.phone.trim().slice(0, 50),
    createdAt: nowIso,
    lastActivityAt: nowIso,
  };

  if (data.company?.trim()) {
    payload.company = data.company.trim().slice(0, 150);
  }
  if (data.state?.trim()) {
    payload.state = data.state.trim().slice(0, 10);
  }

  const record: LeadRecord = {
    id: leadId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    company: payload.company,
    state: payload.state,
    createdAt: payload.createdAt,
    lastActivityAt: payload.lastActivityAt,
  };

  saveLocalLead(record);

  try {
    const leadRef = doc(db, LEADS_COLLECTION, leadId);
    await setDoc(leadRef, payload, { merge: true });
    return record;
  } catch (err) {
    console.warn('Sincronização remota do Lead pendente (registro salvo localmente com sucesso):', err);
    return record;
  }
}

/**
 * Create a commercial simulation opportunity
 */
export async function createOpportunity(data: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  destinationUf?: string;
  printerModel: string;
  termMonths: number;
  monthlyInstallment: number;
  financedBase?: number;
  hwNet?: number;
  marginPercent?: number;
  difalPercent?: number;
  monthlyProductionM2?: number;
  notes?: string;
}): Promise<OpportunityRecord> {
  const oppId = `opp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  const payload: Record<string, any> = {
    clientName: data.clientName.trim().slice(0, 150),
    clientEmail: data.clientEmail.trim().toLowerCase().slice(0, 150),
    printerModel: data.printerModel.slice(0, 50),
    termMonths: Number(data.termMonths),
    monthlyInstallment: Math.round(Number(data.monthlyInstallment) * 100) / 100,
    status: 'nova' as OpportunityStatus,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  if (data.clientPhone?.trim()) payload.clientPhone = data.clientPhone.trim().slice(0, 50);
  if (data.clientCompany?.trim()) payload.clientCompany = data.clientCompany.trim().slice(0, 150);
  if (data.destinationUf?.trim()) payload.destinationUf = data.destinationUf.trim().slice(0, 10);
  if (data.financedBase !== undefined) payload.financedBase = Math.round(data.financedBase * 100) / 100;
  if (data.hwNet !== undefined) payload.hwNet = Math.round(data.hwNet * 100) / 100;
  if (data.marginPercent !== undefined) payload.marginPercent = Number(data.marginPercent);
  if (data.difalPercent !== undefined) payload.difalPercent = Number(data.difalPercent);
  if (data.monthlyProductionM2 !== undefined) payload.monthlyProductionM2 = Number(data.monthlyProductionM2);
  if (data.notes?.trim()) payload.notes = data.notes.trim().slice(0, 1000);

  const oppRecord: OpportunityRecord = {
    id: oppId,
    clientName: payload.clientName,
    clientEmail: payload.clientEmail,
    clientPhone: payload.clientPhone,
    clientCompany: payload.clientCompany,
    destinationUf: payload.destinationUf,
    printerModel: payload.printerModel,
    termMonths: payload.termMonths,
    monthlyInstallment: payload.monthlyInstallment,
    financedBase: payload.financedBase,
    hwNet: payload.hwNet,
    marginPercent: payload.marginPercent,
    difalPercent: payload.difalPercent,
    monthlyProductionM2: payload.monthlyProductionM2,
    status: 'nova',
    notes: payload.notes,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  saveLocalOpportunity(oppRecord);

  try {
    const oppRef = doc(db, OPPS_COLLECTION, oppId);
    await setDoc(oppRef, payload);
    return oppRecord;
  } catch (err) {
    console.warn('Sincronização remota da Oportunidade pendente (registro salvo localmente com sucesso):', err);
    return oppRecord;
  }
}

/**
 * Fetch all leads for Admin view
 */
export async function getLeads(): Promise<LeadRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, LEADS_COLLECTION));
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<LeadRecord, 'id'>),
    }));
  } catch (err) {
    console.warn('Carregando leads do cache local devido a indisponibilidade remota:', err);
    return getLocalLeads();
  }
}

/**
 * Real-time listener for Leads
 */
export function subscribeToLeads(
  onData: (leads: LeadRecord[]) => void,
  onError?: (err: any) => void
) {
  return onSnapshot(
    collection(db, LEADS_COLLECTION),
    (snapshot) => {
      const leads = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<LeadRecord, 'id'>),
      }));
      onData(leads);
    },
    (err) => {
      if (onError) onError(err);
      console.warn('Leads subscription warning (local cache active):', err);
    }
  );
}

/**
 * Real-time listener for Opportunities
 */
export function subscribeToOpportunities(
  onData: (opps: OpportunityRecord[]) => void,
  onError?: (err: any) => void
) {
  return onSnapshot(
    collection(db, OPPS_COLLECTION),
    (snapshot) => {
      const opps = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<OpportunityRecord, 'id'>),
      }));
      opps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(opps);
    },
    (err) => {
      if (onError) onError(err);
      console.warn('Opportunities subscription warning (local cache active):', err);
    }
  );
}

/**
 * Update opportunity status and notes
 */
export async function updateOpportunity(
  oppId: string,
  updates: { status?: OpportunityStatus; notes?: string }
): Promise<void> {
  updateLocalOpportunity(oppId, updates);

  const path = `${OPPS_COLLECTION}/${oppId}`;
  try {
    const oppRef = doc(db, OPPS_COLLECTION, oppId);
    const payload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (updates.status) payload.status = updates.status;
    if (updates.notes !== undefined) payload.notes = updates.notes.slice(0, 1000);

    await setDoc(oppRef, payload, { merge: true });
  } catch (err) {
    console.warn('Atualização remota da Oportunidade pendente (atualizada no cache local):', err);
  }
}

/**
 * Delete opportunity
 */
export async function deleteOpportunity(oppId: string): Promise<void> {
  deleteLocalOpportunity(oppId);

  const path = `${OPPS_COLLECTION}/${oppId}`;
  try {
    await deleteDoc(doc(db, OPPS_COLLECTION, oppId));
  } catch (err) {
    console.warn('Exclusão remota da Oportunidade pendente (removida do cache local):', err);
  }
}
