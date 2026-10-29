import test from 'node:test';
import assert from 'node:assert';

test('Lead data conforms to bounds and formatting', () => {
  const sampleLead = {
    name: 'Carlos Eduardo Mendes',
    email: 'carlos@estampabrasil.com.br',
    phone: '(47) 99876-5432',
    company: 'Estampa Brasil Ltda',
    state: 'SC',
  };

  assert.ok(sampleLead.name.length > 0 && sampleLead.name.length <= 150);
  assert.ok(sampleLead.email.includes('@') && sampleLead.email.length <= 150);
  assert.ok(sampleLead.phone.length >= 8 && sampleLead.phone.length <= 50);
  assert.strictEqual(sampleLead.state.length, 2);
});

test('Opportunity calculation fields conform to required schema', () => {
  const sampleOpp = {
    clientName: 'Confecção Estampa Brasil',
    clientEmail: 'carlos@estampabrasil.com.br',
    printerModel: 'F6470',
    termMonths: 36,
    monthlyInstallment: 1779.86,
    financedBase: 50400,
    hwNet: 32000,
    status: 'nova',
  };

  assert.ok(sampleOpp.termMonths >= 12 && sampleOpp.termMonths <= 60);
  assert.ok(sampleOpp.monthlyInstallment > 0);
  assert.ok(sampleOpp.financedBase > sampleOpp.hwNet);
  assert.ok(['nova', 'em_negociacao', 'proposta_enviada', 'ganha', 'perdida'].includes(sampleOpp.status));
});
