export type PrinterModelId = 'F6470' | 'F9570' | 'F20070';

export interface PrinterModelInfo {
  id: PrinterModelId;
  name: string;
  fullName: string;
  category: string;
  widthInches: number;
  widthCm: number;
  headsDescription: string;
  printheadsCount: number;
  resolution: string;
  speedDescription: string;
  maxSpeedM2H: number;
  productionSpeedM2H: number;
  targetMarket: string;
  inkTechnology: string;
  defaultColors: string;
  keyFeatures: string[];
  dimensionsWeight: string;
}

export interface ModelCostSettings {
  hwNet: number | null; // Custo Base (HW Net) - Inicia em branco
  streetPrice: number | null; // Street Price de Referência de Mercado - Inicia em branco
  printheadCost: number | null; // Custo de 1 Cabeça de Impressão Avulsa - Inicia em branco
  defaultOperationalCost: number | null; // Custos Operacionais Globais padrão - Inicia em branco
}

export type AllModelsCostSettings = Record<PrinterModelId, ModelCostSettings>;

export interface GlobalFinancialParams {
  originState: 'RJ';
  defaultMarginPercent: number; // ex: 40 (%)
  monthlyInterestRatePercent: number; // ex: 0.99 (%)
  lessorTaxRegime: 'lucro_real' | 'lucro_presumido' | 'simples_nacional';
}

export interface BrazilianStateTax {
  uf: string;
  name: string;
  region: 'Sul' | 'Sudeste' | 'Centro-Oeste' | 'Nordeste' | 'Norte';
  internalIcms: number; // e.g. 0.17 para 17%
  interstateFromRJ: number; // 0.12 para Sul/Sudeste (exceto ES), 0.07 para Norte, Nordeste, Centro-Oeste e ES
  difal: number; // internalIcms - interstateFromRJ
}

export interface ClientScenario {
  clientName: string;
  cnpj: string;
  contactPerson: string;
  email: string;
  phone: string;
  destinationUf: string;
  clientTaxRegime: 'lucro_real' | 'lucro_presumido' | 'simples_nacional';
  monthlyProductionM2: number;
  sellingPricePerM2: number;
  inkAndPaperCostPerM2: number;
  operationalCosts: number;
  selectedTermMonths: 12 | 24 | 36 | 48 | 60;
  customMarginPercent?: number;
  customInterestRatePercent?: number;
}

export interface AmortizationPeriod {
  months: 12 | 24 | 36 | 48 | 60;
  monthlyInstallment: number;
  totalContractCost: number;
  costPerM2: number;
  lucroRealTaxSavingsMonthly: number;
  effectiveNetInstallment: number;
}

export interface SimulationResult {
  modelId: PrinterModelId;
  modelInfo: PrinterModelInfo;
  hwNet: number;
  marginPercent: number;
  marginAmount: number;
  operationalCosts: number;
  originUf: 'RJ';
  destinationUf: string;
  internalIcmsPercent: number;
  interstateIcmsPercent: number;
  difalPercent: number;
  difalAmount: number;
  taxRegimeAdjustmentPercent: number;
  taxRegimeAdjustmentAmount: number;
  totalFinancedBase: number;
  monthlyInterestRate: number;
  amortizationTable: AmortizationPeriod[];
  selectedTerm: AmortizationPeriod;
  productionMetrics: {
    monthlyProductionM2: number;
    sellingPricePerM2: number;
    monthlyGrossRevenue: number;
    inkAndPaperMonthlyCost: number;
    rentalInstallmentMonthly: number;
    monthlyNetOperatingProfit: number;
    rentalShareOfRevenuePercent: number;
    rentalCostPerM2: number;
    totalCostPerM2: number;
    breakEvenM2: number;
  };
  competitiveAdvantages: {
    streetPrice: number;
    capexSavedUpfront: number;
    printheadReplacementsEstimated: number;
    printheadCostEach: number;
    printheadTotalSavings: number;
    epsonEdgePrintLicenseSaved: number;
    estimatedCoverPlusSaved: number;
    lucroRealTaxDeductionTotal: number;
    totalFinancialAdvantage: number;
  };
}

export interface GeneratedProposal {
  id: string;
  createdAt: string;
  clientName: string;
  cnpj: string;
  modelName: string;
  termMonths: number;
  monthlyInstallment: number;
  totalFinancedBase: number;
  executiveSummary: string;
  operationalImpactAnalysis: string;
  capexVsOpexStrategicPitch: string;
  financialScheduleDetails: string;
  warrantyAndSlaClauses: string;
  whatsAppPitch: string;
  executiveEmail: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  state?: string;
  createdAt: string;
  lastActivityAt?: string;
}

export type OpportunityStatus = 'nova' | 'em_negociacao' | 'proposta_enviada' | 'ganha' | 'perdida';

export interface OpportunityRecord {
  id: string;
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
  status: OpportunityStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
