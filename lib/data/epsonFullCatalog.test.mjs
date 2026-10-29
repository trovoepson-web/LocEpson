import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from './epsonFullCatalog.ts';

test('CATALOG_CATEGORIES includes all required Epson application lines', () => {
  const categoryIds = CATALOG_CATEGORIES.map((c) => c.id);
  assert.ok(categoryIds.includes('rigidas_uv'), 'Must include Aplicações rígidas UV');
  assert.ok(categoryIds.includes('industrial_sublimacao'), 'Must include Industrial de sublimação');
  assert.ok(categoryIds.includes('sublimacao_textil'), 'Must include Sublimação Têxtil');
  assert.ok(categoryIds.includes('dtf'), 'Must include DTF personalizado');
  assert.ok(categoryIds.includes('dtg'), 'Must include DTG');
  assert.ok(categoryIds.includes('signage'), 'Must include Comunicação visual SIGNAGE');
});

test('CATALOG_PRODUCTS contains all models requested by user', () => {
  const codes = CATALOG_PRODUCTS.map((p) => p.code);
  const requiredCodes = [
    'V4000', 'V7000',
    'ML 18000',
    'F6470', 'F9570', 'F20070',
    'G6070', 'G9070',
    'F2270', 'F3070',
    'S7170', 'S8170', 'S9170'
  ];

  for (const code of requiredCodes) {
    assert.ok(codes.includes(code), `Catalog must include model code: ${code}`);
  }
});

test('Every catalog product has official Epson image URL and technical details', () => {
  for (const product of CATALOG_PRODUCTS) {
    assert.ok(product.imageUrl.startsWith('https://mediaserver.goepson.com/'), `${product.code} must have official mediaserver URL`);
    assert.ok(product.printWidth.length > 0, `${product.code} must have print width`);
    assert.ok(product.technology.length > 0, `${product.code} must have head technology`);
    assert.ok(product.inkType.length > 0, `${product.code} must have ink technology`);
    assert.ok(product.keyFeatures.length >= 3, `${product.code} must have key features`);
  }
});
