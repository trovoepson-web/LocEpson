import { PrinterModelId, PrinterModelInfo, ModelCostSettings } from '../types';

export const PRINTER_MODELS: Record<PrinterModelId, PrinterModelInfo> = {
  F6470: {
    id: 'F6470',
    name: 'SureColor F6470',
    fullName: 'Epson SureColor F6470 (44" - Sublimação Têxtil)',
    category: 'Entrada / Média Produção',
    widthInches: 44,
    widthCm: 111.8,
    headsDescription: 'Cabeça de impressão PrecisionCore® MicroTFP® de 1,33"',
    printheadsCount: 1,
    resolution: 'Até 1200 x 600 dpi',
    speedDescription: 'Até 76 m²/h em modo rascunho (produção real de ~30 a 45 m²/h)',
    maxSpeedM2H: 76,
    productionSpeedM2H: 35,
    targetMarket: 'Confecções, vestuário esportivo, moda praia, brindes personalizados, estamparia sob demanda',
    inkTechnology: 'Epson UltraChrome® DS com tinta preta de alta densidade (HDK)',
    defaultColors: 'CMYK (Bolsas de tinta de 1,6L)',
    keyFeatures: [
      'Cabeça PrecisionCore MicroTFP com tecnologia de verificação de injetores (NVT)',
      'Bolsas de tinta de alta capacidade (1,6 Litro por cor) com troca limpa',
      'Painel touchscreen colorido intuitivo de 4,3"',
      'Software RIP Epson Edge Print genuíno incluso com motor Adobe PS3',
      'Cortador automático embutido e rolo de alimentação de precisão',
      'Garantia CoverPlus e suporte técnico oficial Epson'
    ],
    dimensionsWeight: '1.608 mm x 916 mm x 1.128 mm | Peso: 82 kg'
  },
  F9570: {
    id: 'F9570',
    name: 'SureColor F9570',
    fullName: 'Epson SureColor F9570 (64" - Alta Produtividade)',
    category: 'Alta Produção Industrial Leve',
    widthInches: 64,
    widthCm: 162.6,
    headsDescription: 'Dupla cabeça PrecisionCore® MicroTFP® de 1,33" (substituível pelo usuário)',
    printheadsCount: 2,
    resolution: 'Até 1200 x 600 dpi',
    speedDescription: 'Até 149 m²/h (produção real contínua de ~60 a 90 m²/h)',
    maxSpeedM2H: 149,
    productionSpeedM2H: 75,
    targetMarket: 'Grandes confecções, moda em escala, estamparia contínua, uniformes e artigos têxteis esportivos',
    inkTechnology: 'Epson UltraChrome® DS com pretos profundos e alta solidez à lavagem',
    defaultColors: 'CMYK com sistema de suprimento duplo de até 3 Litros por cor',
    keyFeatures: [
      'Design compacto e otimizado com altura reduzida para ambientes de produção',
      'Dupla cabeça PrecisionCore com cabeças substituíveis pelo operador para mínimo downtime',
      'Sistema de alimentação de mídia de alta precisão com controle de tensão ativo',
      'Secador integrado de alta eficiência para enrolamento imediato',
      'Epson Cloud Solution PORT para monitoramento remoto de frota em tempo real',
      'Software RIP Epson Edge Print genuíno incluso'
    ],
    dimensionsWeight: '2.620 mm x 934 mm x 1.332 mm | Peso: 290 kg'
  },
  F20070: {
    id: 'F20070',
    name: 'SureColor F20070',
    fullName: 'Epson SureColor F20070 (76" - Sublimação Industrial Contínua)',
    category: 'Industrial / Altíssima Produção',
    widthInches: 76,
    widthCm: 193.0,
    headsDescription: '4 Cabeças PrecisionCore® MicroTFP® industriais de alta durabilidade',
    printheadsCount: 4,
    resolution: 'Até 1200 x 1200 dpi',
    speedDescription: 'Até 255 m²/h (produção industrial contínua de ~180 a 220 m²/h)',
    maxSpeedM2H: 255,
    productionSpeedM2H: 200,
    targetMarket: 'Indústrias têxteis de grande porte, birôs de estamparia industrial, tecelagens e fast-fashion',
    inkTechnology: 'Epson UltraChrome® DS6 com tanques de suprimento contínuo de alta capacidade',
    defaultColors: 'CMYK / CMYK+Flúor em tanques de 10 Litros',
    keyFeatures: [
      'Quatro cabeças industriais PrecisionCore com sistema de troca a quente (Hot Swap)',
      'Capacidade de bobinas industriais de até 300 kg para turnos ininterruptos de 24/7',
      'Sistema avançado de circulação de tinta com desgaseificação a vácuo',
      'Sistema duplo de secagem com túnel térmico de alta velocidade',
      'Automação avançada com sensores ópticos de desvio e calibração contínua',
      'Epson Edge Print Industrial & compatibilidade com ERP têxtil'
    ],
    dimensionsWeight: '3.700 mm x 1.400 mm x 1.850 mm | Peso: 1.250 kg'
  }
};

// Conforme solicitado pelo usuário:
// "Os valores de custo precisam estar em branco para a inclusao da informação manual pelo operador no painel administrativo."
// O estado inicial padrão dos custos é totalmente em branco (null).
export const INITIAL_BLANK_COSTS: Record<PrinterModelId, ModelCostSettings> = {
  F6470: {
    hwNet: null,
    streetPrice: null,
    printheadCost: null,
    defaultOperationalCost: null
  },
  F9570: {
    hwNet: null,
    streetPrice: null,
    printheadCost: null,
    defaultOperationalCost: null
  },
  F20070: {
    hwNet: null,
    streetPrice: null,
    printheadCost: null,
    defaultOperationalCost: null
  }
};

// Valores de referência histórica da Planilha Epson (disponíveis para o operador consultar ou carregar via 1 clique caso deseje):
export const EPSON_SPREADSHEET_REFERENCE_COSTS: Record<PrinterModelId, ModelCostSettings> = {
  F6470: {
    hwNet: 32000,
    streetPrice: 49900,
    printheadCost: 8500,
    defaultOperationalCost: 13600
  },
  F9570: {
    hwNet: 125000,
    streetPrice: 185000,
    printheadCost: 16500,
    defaultOperationalCost: 28500
  },
  F20070: {
    hwNet: 310000,
    streetPrice: 455000,
    printheadCost: 38000,
    defaultOperationalCost: 65000
  }
};
