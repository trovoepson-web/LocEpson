import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePmtPrice, runFinancialSimulation } from './financial.ts';
import { getStateTax } from '../data/brazilianStates.ts';
import { INITIAL_BLANK_COSTS, EPSON_SPREADSHEET_REFERENCE_COSTS } from '../data/printerModels.ts';

test('calculatePmtPrice calculates correct Price amortization installment', () => {
  // Principal = 10000, 1% a.m., 12 months
  // PMT = 10000 * (0.01 * 1.01^12) / (1.01^12 - 1) = ~888.49
  const pmt = calculatePmtPrice(10000, 0.01, 12);
  assert.ok(Math.abs(pmt - 888.49) < 0.1, `Expected ~888.49, got ${pmt}`);

  // Test zero principal
  assert.equal(calculatePmtPrice(0, 0.0099, 36), 0);
});

test('getStateTax returns correct tax rates for Santa Catarina and São Paulo', () => {
  const sc = getStateTax('SC');
  assert.equal(sc.uf, 'SC');
  assert.equal(sc.internalIcms, 0.17);
  assert.equal(sc.interstateFromRJ, 0.12);
  assert.equal(sc.difal, 0.05);

  const sp = getStateTax('SP');
  assert.equal(sp.uf, 'SP');
  assert.equal(sp.internalIcms, 0.18);
  assert.equal(sp.interstateFromRJ, 0.12);
  assert.equal(sp.difal, 0.06);

  const ba = getStateTax('BA'); // Nordeste
  assert.equal(ba.interstateFromRJ, 0.07);
});

test('runFinancialSimulation handles blank costs safely', () => {
  const simulation = runFinancialSimulation({
    modelId: 'F6470',
    costSettings: INITIAL_BLANK_COSTS.F6470,
    globalParams: {
      originState: 'RJ',
      defaultMarginPercent: 40,
      monthlyInterestRatePercent: 0.99,
      lessorTaxRegime: 'lucro_real'
    },
    clientScenario: {
      clientName: 'Cliente Teste',
      cnpj: '00.000.000/0001-00',
      contactPerson: 'Teste',
      email: '',
      phone: '',
      destinationUf: 'SC',
      clientTaxRegime: 'lucro_real',
      monthlyProductionM2: 1500,
      sellingPricePerM2: 25,
      inkAndPaperCostPerM2: 4.5,
      operationalCosts: 0,
      selectedTermMonths: 36
    }
  });

  assert.equal(simulation.hwNet, 0);
  assert.equal(simulation.totalFinancedBase, 0);
  assert.equal(simulation.selectedTerm.monthlyInstallment, 0);
  assert.equal(simulation.amortizationTable.length, 5);
});

test('runFinancialSimulation calculates correct F6470 spreadsheet scenario', () => {
  const simulation = runFinancialSimulation({
    modelId: 'F6470',
    costSettings: EPSON_SPREADSHEET_REFERENCE_COSTS.F6470,
    globalParams: {
      originState: 'RJ',
      defaultMarginPercent: 40,
      monthlyInterestRatePercent: 0.99,
      lessorTaxRegime: 'lucro_real'
    },
    clientScenario: {
      clientName: 'Confecção Estampa Brasil Ltda',
      cnpj: '12.345.678/0001-99',
      contactPerson: 'Carlos',
      email: 'carlos@teste.com',
      phone: '',
      destinationUf: 'SC',
      clientTaxRegime: 'lucro_real',
      monthlyProductionM2: 1500,
      sellingPricePerM2: 25,
      inkAndPaperCostPerM2: 4.5,
      operationalCosts: 13600,
      selectedTermMonths: 36
    }
  });

  assert.equal(simulation.hwNet, 32000);
  assert.equal(simulation.marginAmount, 32000 * 0.4); // 12800
  assert.equal(simulation.difalPercent, 5); // 5%
  assert.equal(simulation.difalAmount, 32000 * 0.05); // 1600

  // Total Financed Base should be positive and > 60k
  assert.ok(simulation.totalFinancedBase > 60000);

  // Amortization table must contain 12, 24, 36, 48, 60 months
  const months = simulation.amortizationTable.map(t => t.months);
  assert.deepEqual(months, [12, 24, 36, 48, 60]);

  // Installment decreases as term increases (progressive amortization)
  for (let i = 0; i < simulation.amortizationTable.length - 1; i++) {
    assert.ok(
      simulation.amortizationTable[i].monthlyInstallment > simulation.amortizationTable[i + 1].monthlyInstallment,
      'Installment should decrease as term increases'
    );
  }

  // Lucro real tax deduction should be positive
  assert.ok(simulation.selectedTerm.lucroRealTaxSavingsMonthly > 0);
});
