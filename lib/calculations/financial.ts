import {
  PrinterModelId,
  ModelCostSettings,
  GlobalFinancialParams,
  ClientScenario,
  SimulationResult,
  AmortizationPeriod
} from '../types';
import { PRINTER_MODELS } from '../data/printerModels';
import { getStateTax } from '../data/brazilianStates';

/**
 * Calcula a parcela fixa mensal pelo sistema Price de Amortização
 * PMT = PV * [ i * (1 + i)^n ] / [ (1 + i)^n - 1 ]
 */
export function calculatePmtPrice(principal: number, monthlyRateDecimal: number, periods: number): number {
  if (principal <= 0) return 0;
  if (monthlyRateDecimal <= 0) return principal / periods;
  const factor = Math.pow(1 + monthlyRateDecimal, periods);
  return principal * (monthlyRateDecimal * factor) / (factor - 1);
}

export interface CalculationInput {
  modelId: PrinterModelId;
  costSettings: ModelCostSettings;
  globalParams: GlobalFinancialParams;
  clientScenario: ClientScenario;
}

export function runFinancialSimulation(input: CalculationInput): SimulationResult {
  const { modelId, costSettings, globalParams, clientScenario } = input;
  const modelInfo = PRINTER_MODELS[modelId];

  // Custos manuais inseridos pelo operador
  const hwNet = costSettings.hwNet ?? 0;
  const streetPrice = costSettings.streetPrice ?? 0;
  const printheadCost = costSettings.printheadCost ?? 0;
  const operationalCosts = clientScenario.operationalCosts > 0 
    ? clientScenario.operationalCosts 
    : (costSettings.defaultOperationalCost ?? 0);

  // Margem e Juros
  const marginPercent = clientScenario.customMarginPercent ?? globalParams.defaultMarginPercent;
  const monthlyInterestRatePercent = clientScenario.customInterestRatePercent ?? globalParams.monthlyInterestRatePercent;
  const monthlyRateDecimal = monthlyInterestRatePercent / 100;

  // Equipamento com margem sobre HW Net
  const marginAmount = hwNet * (marginPercent / 100);
  const equipmentWithMargin = hwNet + marginAmount;

  // Tributação Interestadual e DIFAL a partir do RJ
  const stateTax = getStateTax(clientScenario.destinationUf);
  const difalPercent = stateTax.difal; // ex: 0.05 para 5%
  // O DIFAL incide sobre a operação interestadual de aquisição do ativo
  const difalAmount = hwNet * difalPercent;

  // Ajuste Tributário da Locadora (com base no regime tributário)
  // Conforme Súmula Vinculante 31 STF, locação de bens móveis não incide ICMS nem ISS.
  // Incidem apenas tributos federais (PIS, COFINS, IRPJ, CSLL)
  let taxRegimeAdjustmentPercent = 0;
  if (globalParams.lessorTaxRegime === 'lucro_real') {
    // PIS/COFINS não-cumulativo (9,25%) ajustado pela depreciação do ativo
    taxRegimeAdjustmentPercent = 0.0565; // ~5,65% líquido ponderado
  } else if (globalParams.lessorTaxRegime === 'lucro_presumido') {
    // PIS (0.65%) + COFINS (3.0%) + Presunção IRPJ/CSLL (~2.28%) = ~5.93%
    taxRegimeAdjustmentPercent = 0.0593;
  } else {
    // Simples Nacional locação
    taxRegimeAdjustmentPercent = 0.0650;
  }
  const taxRegimeAdjustmentAmount = equipmentWithMargin * taxRegimeAdjustmentPercent;

  // Base Financiada Total
  const totalFinancedBase = equipmentWithMargin + operationalCosts + difalAmount + taxRegimeAdjustmentAmount;

  // Prazos disponíveis: 12, 24, 36, 48, 60 meses
  const terms: Array<12 | 24 | 36 | 48 | 60> = [12, 24, 36, 48, 60];
  const monthlyProduction = Math.max(1, clientScenario.monthlyProductionM2 || 1500);

  const amortizationTable: AmortizationPeriod[] = terms.map((months) => {
    const monthlyInstallment = calculatePmtPrice(totalFinancedBase, monthlyRateDecimal, months);
    const totalContractCost = monthlyInstallment * months;
    const costPerM2 = monthlyInstallment / monthlyProduction;

    // Benefício Fiscal Lucro Real para o Cliente (34% IRPJ/CSLL + 9.25% PIS/COFINS = ~43.25% de dedução)
    const isLucroReal = clientScenario.clientTaxRegime === 'lucro_real';
    const deductionRate = isLucroReal ? 0.34 + 0.0925 : 0;
    const lucroRealTaxSavingsMonthly = monthlyInstallment * deductionRate;
    const effectiveNetInstallment = monthlyInstallment - lucroRealTaxSavingsMonthly;

    return {
      months,
      monthlyInstallment,
      totalContractCost,
      costPerM2,
      lucroRealTaxSavingsMonthly,
      effectiveNetInstallment
    };
  });

  const selectedTerm = amortizationTable.find(t => t.months === clientScenario.selectedTermMonths) 
    || amortizationTable[2]; // fallback 36 meses

  // Métricas de Produção e Viabilidade do Cliente
  const sellingPrice = clientScenario.sellingPricePerM2 || 25;
  const inkPaperCost = clientScenario.inkAndPaperCostPerM2 || 4.5;
  const monthlyGrossRevenue = monthlyProduction * sellingPrice;
  const inkAndPaperMonthlyCost = monthlyProduction * inkPaperCost;
  const rentalInstallmentMonthly = selectedTerm.monthlyInstallment;
  const monthlyNetOperatingProfit = monthlyGrossRevenue - inkAndPaperMonthlyCost - rentalInstallmentMonthly;
  const rentalShareOfRevenuePercent = monthlyGrossRevenue > 0 ? (rentalInstallmentMonthly / monthlyGrossRevenue) * 100 : 0;
  const rentalCostPerM2 = selectedTerm.costPerM2;
  const totalCostPerM2 = inkPaperCost + rentalCostPerM2;
  const contributionMarginPerM2 = Math.max(0.01, sellingPrice - inkPaperCost);
  const breakEvenM2 = rentalInstallmentMonthly / contributionMarginPerM2;

  // Vantagens Competitivas (Locação vs. Compra)
  // Cabeças estimadas trocadas durante contrato (em média 1 troca preventiva a cada 18-24 meses)
  const estimatedHeadsReplaced = selectedTerm.months >= 48 ? 3 : (selectedTerm.months >= 24 ? 2 : 1);
  const printheadTotalSavings = estimatedHeadsReplaced * printheadCost;
  const epsonEdgePrintLicenseSaved = 9500; // Licença comercial RIP genuína
  const estimatedCoverPlusSaved = hwNet * 0.12 * (selectedTerm.months / 12); // Garantia estendida anual
  const capexSavedUpfront = streetPrice > 0 ? streetPrice : (hwNet * 1.55);

  const clientIsLucroReal = clientScenario.clientTaxRegime === 'lucro_real';
  const lucroRealTaxDeductionTotal = clientIsLucroReal 
    ? selectedTerm.totalContractCost * 0.4325 
    : 0;

  const totalFinancialAdvantage = printheadTotalSavings + epsonEdgePrintLicenseSaved + estimatedCoverPlusSaved + lucroRealTaxDeductionTotal;

  return {
    modelId,
    modelInfo,
    hwNet,
    marginPercent,
    marginAmount,
    operationalCosts,
    originUf: 'RJ',
    destinationUf: clientScenario.destinationUf,
    internalIcmsPercent: stateTax.internalIcms * 100,
    interstateIcmsPercent: stateTax.interstateFromRJ * 100,
    difalPercent: difalPercent * 100,
    difalAmount,
    taxRegimeAdjustmentPercent: taxRegimeAdjustmentPercent * 100,
    taxRegimeAdjustmentAmount,
    totalFinancedBase,
    monthlyInterestRate: monthlyInterestRatePercent,
    amortizationTable,
    selectedTerm,
    productionMetrics: {
      monthlyProductionM2: monthlyProduction,
      sellingPricePerM2: sellingPrice,
      monthlyGrossRevenue,
      inkAndPaperMonthlyCost,
      rentalInstallmentMonthly,
      monthlyNetOperatingProfit,
      rentalShareOfRevenuePercent,
      rentalCostPerM2,
      totalCostPerM2,
      breakEvenM2
    },
    competitiveAdvantages: {
      streetPrice,
      capexSavedUpfront,
      printheadReplacementsEstimated: estimatedHeadsReplaced,
      printheadCostEach: printheadCost,
      printheadTotalSavings,
      epsonEdgePrintLicenseSaved,
      estimatedCoverPlusSaved,
      lucroRealTaxDeductionTotal,
      totalFinancialAdvantage
    }
  };
}
