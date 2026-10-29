export type CatalogCategoryId =
  | 'all'
  | 'rigidas_uv'
  | 'industrial_sublimacao'
  | 'sublimacao_textil'
  | 'dtf'
  | 'dtg'
  | 'signage';

export interface CatalogCategory {
  id: CatalogCategoryId;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  iconName: string;
}

export interface CatalogProduct {
  id: string;
  code: string;
  name: string;
  line: string;
  categoryId: Exclude<CatalogCategoryId, 'all'>;
  categoryLabel: string;
  application: string;
  printWidth: string;
  technology: string;
  inkType: string;
  resolution: string;
  speed: string;
  keyFeatures: string[];
  imageUrl: string;
  officialUrl?: string;
  canSimulateRental?: boolean;
  rentalModelId?: 'F6470' | 'F9570' | 'F20070';
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: 'all',
    title: 'Todos os Equipamentos',
    shortTitle: 'Todos',
    badge: 'Portfólio Completo',
    description: 'Linha completa de impressoras profissionais e industriais Epson para os mercados gráfico, têxtil e promocional.',
    iconName: 'LayoutGrid',
  },
  {
    id: 'rigidas_uv',
    title: 'Aplicações Rígidas (FlatBed UV)',
    shortTitle: 'FlatBed UV Rígidas',
    badge: 'Mesa Plana UV',
    description: 'Impressão direta com cura UV LED sobre placas rígidas de até 70 mm ou 100 mm (acrílico, MDF, vidro, alumínio, PVC e papelão estruturado).',
    iconName: 'Maximize2',
  },
  {
    id: 'industrial_sublimacao',
    title: 'Industrial de Sublimação',
    shortTitle: 'Industrial Têxtil',
    badge: 'Monna Lisa Industrial',
    description: 'Plataforma industrial Monna Lisa com tecnologia PrecisionCore para estamparias e tecelagens de altíssima tiragem contínua.',
    iconName: 'Factory',
  },
  {
    id: 'sublimacao_textil',
    title: 'Sublimação Têxtil (Moda, Decoração e Esportivo)',
    shortTitle: 'Sublimação Têxtil',
    badge: 'SureColor Têxtil',
    description: 'Série SureColor F com tintas UltraChrome DS para estamparia por transferência em poliéster, vestuário esportivo e home decor.',
    iconName: 'Shirt',
  },
  {
    id: 'dtf',
    title: 'DTF Personalizado (Direct-to-Film)',
    shortTitle: 'DTF Film',
    badge: 'Direct-to-Film Genuíno',
    description: 'Tecnologia direta no filme para estampagem em tecidos variados (algodão, poliéster, brim, couro e mistos) com tinta branca recirculante.',
    iconName: 'Film',
  },
  {
    id: 'dtg',
    title: 'DTG (Direct-to-Garment)',
    shortTitle: 'DTG Camisetas',
    badge: 'Impressão Direta no Vestuário',
    description: 'Impressão direta em camisetas e artigos prontos de algodão e misturas com secagem rápida e toque suave de alta durabilidade.',
    iconName: 'Sparkles',
  },
  {
    id: 'signage',
    title: 'Comunicação Visual SIGNAGE',
    shortTitle: 'Signage & Banners',
    badge: 'Comunicação Visual',
    description: 'Impressoras solvente e resina para sinalização comercial externa, banners, envelopamento automotivo, adesivos e displays para PDV.',
    iconName: 'Layers',
  },
];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  // 1. Aplicações Rígidas (FlatBed UV)
  {
    id: 'v4000',
    code: 'V4000',
    name: 'Epson SureColor V4000',
    line: 'FlatBed UV Compacta',
    categoryId: 'rigidas_uv',
    categoryLabel: 'Aplicações Rígidas (FlatBed UV)',
    application: 'Brindes promocionais, troféus, painéis em acrílico, placas de sinalização e protótipos de embalagem',
    printWidth: 'Mesa plana de 61 x 91 cm (Espessura de até 70 mm)',
    technology: 'Cabeça de impressão PrecisionCore® MicroTFP® com cura UV LED a frio',
    inkType: 'Epson UltraChrome® UV (CMYK + Branco de alta densidade + Verniz brilhante/fosco)',
    resolution: 'Até 1200 x 1200 dpi com pontos variáveis',
    speed: 'Produção rápida sob demanda com cura instantânea',
    keyFeatures: [
      'Mesa de vácuo integrada com zonas independentes para fixação perfeita da placa',
      'Tinta branca com recirculação contínua que evita decantação de pigmento',
      'Verniz selecionável para efeitos texturizados, relevo táctil e acabamentos especiais',
      'Sensor automático de altura da mídia que evita colisões da cabeça',
      'Software Epson Edge Print e drivers de cor para alta saturação'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=c60419b05f9faf0060bf8d97da097f26383cc939&vid=c60419b05f9faf0060bf8d97da097f26383cc939&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=V4000_Front_v1',
    officialUrl: 'https://epson.com.br/search/?text=V4000'
  },
  {
    id: 'v7000',
    code: 'V7000',
    name: 'Epson SureColor V7000',
    line: 'FlatBed UV Industrial de Grande Formato',
    categoryId: 'rigidas_uv',
    categoryLabel: 'Aplicações Rígidas (FlatBed UV)',
    application: 'Sinalização rígida de alta escala, chapas de ACM, acrílico, MDF, vidros arquitetônicos, metal e displays para PDV',
    printWidth: 'Área de impressão industrial de 1,25 m x 2,50 m (Espessura de até 80 mm)',
    technology: '8 Cabeças PrecisionCore® industriais com 10 canais de cor e cura UV LED',
    inkType: 'UltraChrome® UV de 10 cores: C, M, Y, K, Lc, Lm, Cinza, Vermelho + Branco + Verniz',
    resolution: 'Até 1440 x 720 dpi para detalhes ultra nítidos e tons de pele contínuos',
    speed: 'Até 43 m²/h em modo alta produção com excelente cobertura',
    keyFeatures: [
      'Gama cromática expandida inédita com tintas Vermelha e Cinza de alta precisão',
      'Mesa de vácuo multi-zona de 4 seções com pinos de registro para alinhamento rápido',
      'Ionizador embutido para eliminação de eletricidade estática sobre plásticos e acrílicos',
      'Sensores de segurança contra colisão 360° em toda a extensão do carro',
      'Impressão simultânea de branco e verniz sem perda de ciclo de produção'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=704ee2a04e9e3d91d74b4dbd185bcb44ac08f984&vid=704ee2a04e9e3d91d74b4dbd185bcb44ac08f984&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=SC-V7000_01-headon_690x460',
    officialUrl: 'https://epson.com.br/search/?text=V7000'
  },

  // 2. Aplicações Industrial de Sublimação
  {
    id: 'ml18000',
    code: 'ML 18000',
    name: 'Epson Monna Lisa ML-18000 / Série ML',
    line: 'Industrial Têxtil Direta & Sublimática',
    categoryId: 'industrial_sublimacao',
    categoryLabel: 'Aplicações Industrial de Sublimação',
    application: 'Grandes indústrias têxteis, tecelagens, moda de alta costura, estamparia direta em algodão, seda, poliéster e fibras nobres',
    printWidth: 'Largura útil de 180 cm (1,80 metro)',
    technology: 'Arrasto por tapete adesivo contínuo e cabeças PrecisionCore industriais de longa vida',
    inkType: 'Tintas Genesta® de alta solidez (Sublimáticas, Reativas, Ácidas, Dispersas e Pigmento)',
    resolution: 'Até 1200 dpi de nível fotográfico industrial',
    speed: 'De 290 m²/h a mais de 400 m²/h contínuos em operação 24/7',
    keyFeatures: [
      'Sistema de tapete industrial com lavagem e secagem contínua automática',
      'Arquitetura mecânica reforçada para turnos ininterruptos de produção industrial',
      'Tecnologia de compensação de gotas e alinhamento milimétrico em alta velocidade',
      'Sistema exclusivo de desaeração e filtração a vácuo para tintas têxteis',
      'Software de controle industrial e compatibilidade direta com fluxos ERP de fábrica'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=fd1dcec1649d68439015d065173908752a9d8c99&vid=fd1dcec1649d68439015d065173908752a9d8c99&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=ML-8000_01-headon_690x460',
    officialUrl: 'https://epson.com.br/search/?text=Monna+Lisa'
  },

  // 3. Sublimação Têxtil (Moda, Decoração e Esportivo) - Modelos com simulação de locação integrada
  {
    id: 'f6470',
    code: 'F6470',
    name: 'Epson SureColor F6470',
    line: 'Sublimação Têxtil 44"',
    categoryId: 'sublimacao_textil',
    categoryLabel: 'Sublimação Têxtil (Moda, Decoração e Esportivo)',
    application: 'Confecções, vestuário esportivo, moda praia, abadás, decoração de interiores e brindes personalizados',
    printWidth: '44 polegadas (111,8 cm)',
    technology: '1 Cabeça de impressão PrecisionCore® MicroTFP® de 1,33"',
    inkType: 'Epson UltraChrome® DS com tinta preta de alta densidade (HDK) em bolsas de 1,6L',
    resolution: 'Até 1200 x 600 dpi',
    speed: 'Até 76 m²/h (produção real estável de ~35 a 45 m²/h)',
    keyFeatures: [
      'Bolsas de tinta de 1,6 Litro de troca rápida que reduzem o custo de suprimento',
      'Tecnologia de Verificação de Injetores (NVT) automática que previne falhas no tecido',
      'Painel touchscreen frontal de 4,3" com menus em português',
      'Software RIP Epson Edge Print genuíno incluso sem custo de licença adicional',
      'Substituição de cabeça inclusa no modelo de locação operacional'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=1bea37bd45b231821571a3d2b8a61a3f23e68376&vid=1bea37bd45b231821571a3d2b8a61a3f23e68376&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=SC-F6470_headon-output_690x460',
    canSimulateRental: true,
    rentalModelId: 'F6470',
    officialUrl: 'https://epson.com.br/search/?text=F6470'
  },
  {
    id: 'f9570',
    code: 'F9570',
    name: 'Epson SureColor F9570',
    line: 'Sublimação Têxtil de Alta Produtividade 64"',
    categoryId: 'sublimacao_textil',
    categoryLabel: 'Sublimação Têxtil (Moda, Decoração e Esportivo)',
    application: 'Grandes confecções, moda em escala, estamparia contínua, uniformes e tecidos técnicos esportivos',
    printWidth: '64 polegadas (162,6 cm)',
    technology: 'Dupla cabeça PrecisionCore® MicroTFP® de 1,33" substituível pelo usuário',
    inkType: 'Epson UltraChrome® DS com sistema duplo de suprimento (pacotes de até 3L)',
    resolution: 'Até 1200 x 600 dpi',
    speed: 'Até 149 m²/h (produção contínua de ~75 a 90 m²/h)',
    keyFeatures: [
      'Dupla cabeça MicroTFP substituível pelo operador para mínimo tempo de máquina parada',
      'Chassi rebaixado de baixo perfil para fácil alimentação e monitoramento ergonômico',
      'Secador integrado de alta eficiência para enrolamento rebobinado imediato',
      'Controle dinâmico de tração do rolo com compensação de peso de mídia',
      'Integração com Epson Cloud Solution PORT para monitoramento remoto de produtividade'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=89b148c8ae3a7e875bb755eb52486ed3eefc8a62&vid=89b148c8ae3a7e875bb755eb52486ed3eefc8a62&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=surecolor-F9570_hero-headon-roll-output_690x460%402x',
    canSimulateRental: true,
    rentalModelId: 'F9570',
    officialUrl: 'https://epson.com.br/search/?text=F9570'
  },
  {
    id: 'f20070',
    code: 'F20070',
    name: 'Epson SureColor F20070',
    line: 'Sublimação Industrial Contínua 76"',
    categoryId: 'sublimacao_textil',
    categoryLabel: 'Sublimação Têxtil (Moda, Decoração e Esportivo)',
    application: 'Indústrias têxteis de grande porte, birôs industriais de alta tiragem, tecelagens e fast-fashion 24/7',
    printWidth: '76 polegadas (193,0 cm)',
    technology: '4 Cabeças PrecisionCore® MicroTFP® industriais com sistema hot-swap',
    inkType: 'Epson UltraChrome® DS6 em tanques industriais de suprimento contínuo de 10L',
    resolution: 'Até 1200 x 1200 dpi',
    speed: 'Até 255 m²/h (produção industrial contínua de ~200 m²/h)',
    keyFeatures: [
      'Alimentador reforçado para bobinas gigantes de até 300 kg para turnos ininterruptos',
      '4 cabeças industriais PrecisionCore com alinhamento óptico em tempo real',
      'Sistema de circulação de tinta com desgaseificação contínua a vácuo',
      'Túnel de secagem duplo de alta velocidade com controle preciso de calor',
      'Substituição de suprimentos a quente sem interromper o trabalho de impressão'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=02ff77a2f066c3df067e8b0f831ad6e41fb55c00&vid=02ff77a2f066c3df067e8b0f831ad6e41fb55c00&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=SC-F20070_StdReel_Latin-America_NoMedia_Product_01A',
    canSimulateRental: true,
    rentalModelId: 'F20070',
    officialUrl: 'https://epson.com.br/search/?text=F20070'
  },

  // 4. DTF Personalizado (Direct-to-Film)
  {
    id: 'g6070',
    code: 'G6070',
    name: 'Epson SureColor G6070',
    line: 'Direct-to-Film (DTF) Industrial de 24"',
    categoryId: 'dtf',
    categoryLabel: 'DTF Personalizado (Direct-to-Film)',
    application: 'Estampagem sob demanda em camisetas, moletons, jeans, bonés, tecidos sintéticos e mistos sem necessidade de pré-tratamento',
    printWidth: '24 polegadas (61 cm)',
    technology: 'Cabeça PrecisionCore® MicroTFP® desenvolvida especificamente para tintas de transferência em filme PET',
    inkType: 'Epson UltraChrome® DF com tinta branca recirculante de altíssima opacidade',
    resolution: 'Até 1200 x 1200 dpi com detalhes finos e texto legível em micro-escala',
    speed: 'Produção contínua em bobina com enrolamento automático sincronizado',
    keyFeatures: [
      'Sistema de recirculação de tinta branca contínua que elimina entupimentos no filme',
      'Zero pré-tratamento de tecido: adere perfeitamente a 100% algodão, poliéster, elastano e couro',
      'Toque super macio e elasticidade superior resistente a mais de 50 lavagens industriais',
      'Fluxo de trabalho integrado com o RIP Epson Edge Print com gerenciamento de camadas de branco',
      'Qualidade e confiabilidade genuína Epson contra soluções adaptadas de mercado'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=7c852dddd329d3e49f713f07f91a9e4f706304af&vid=7c852dddd329d3e49f713f07f91a9e4f706304af&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=surecolor-G6070_hero_headon-printed-film_690x460%402x',
    officialUrl: 'https://epson.com.br/search/?text=G6070'
  },
  {
    id: 'g9070',
    code: 'G9070',
    name: 'Epson SureColor G9070',
    line: 'Direct-to-Film (DTF) de Alta Capacidade',
    categoryId: 'dtf',
    categoryLabel: 'DTF Personalizado (Direct-to-Film)',
    application: 'Birôs de personalização de vestuário de alta escala, grandes marcas de moda jovem e uniformes corporativos',
    printWidth: 'Formato expandido para alimentação em rolos contínuos',
    technology: 'Dupla cabeça PrecisionCore® MicroTFP® com sistema de vácuo ativo',
    inkType: 'Epson UltraChrome® DF em bolsas de alta capacidade com trocas simplificadas',
    resolution: 'Até 1200 x 1200 dpi',
    speed: 'Alta produtividade em metros lineares por hora para produção em lote',
    keyFeatures: [
      'Desenvolvida 100% de fábrica pela Epson para o padrão profissional de Direct-to-Film',
      'Dupla cabeça de impressão para impressão concomitante de CMYK e camada de fundo branco',
      'Tração de precisão para filme PET de espessuras variadas sem deformação térmica',
      'Compatível com fornos de polimerização e shakers de pó termofusível do mercado',
      'Suporte técnico e garantia nacional Epson'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=0693db98e0b8dd0e523557644dfb6ad8a7549cd3&vid=0693db98e0b8dd0e523557644dfb6ad8a7549cd3&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=SCG9070_Product_03',
    officialUrl: 'https://epson.com.br/search/?text=G9070'
  },

  // 5. DTG (Direct-to-Garment)
  {
    id: 'f2270',
    code: 'F2270',
    name: 'Epson SureColor F2270',
    line: 'Impressora Híbrida DTG e DTFilm',
    categoryId: 'dtg',
    categoryLabel: 'DTG (Direct-to-Garment)',
    application: 'Camisetas personalizadas de algodão, sacolas ecobags, polos, almofadas e estampas híbridas em filme DTF',
    printWidth: 'Área de impressão padrão de até 40,6 x 50,8 cm (com pratos opcionais variados)',
    technology: 'Cabeça PrecisionCore® MicroTFP® de última geração com detecção automática de altura',
    inkType: 'Epson UltraChrome® DG2 (CMYK + Branco) com fórmula otimizada de dispersão',
    resolution: 'Até 1200 x 1200 dpi',
    speed: 'Imprime uma camiseta clara em cerca de 25 segundos e escura com fundo branco em ~50s',
    keyFeatures: [
      'Capacidade híbrida nativa: imprime direto na camiseta (DTG) ou no filme de transferência (DTF)',
      'Ajuste de altura automático por sensor óptico que acomoda tecidos de até 25 mm de espessura',
      'Tinta branca com sistema avançado de circulação para evitar entupimentos e purgas excessivas',
      'Software Epson Garment Creator 2 intuitivo incluso para computadores Mac e Windows',
      'Design compacto de carregamento rápido sem parafusos'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=5e8c4b2fa198a2a66d43265ea7c43917ced42a77&vid=5e8c4b2fa198a2a66d43265ea7c43917ced42a77&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=surecolor-F2270_headon-tee-white_690x460',
    officialUrl: 'https://epson.com.br/search/?text=F2270'
  },
  {
    id: 'f3070',
    code: 'F3070',
    name: 'Epson SureColor F3070',
    line: 'DTG Industrial de Altíssima Produção',
    categoryId: 'dtg',
    categoryLabel: 'DTG (Direct-to-Garment)',
    application: 'Fábricas de camisetas, marcas de moda sob demanda (Print-on-Demand), birôs com volume diário superior a 500 peças',
    printWidth: 'Área de até 40,6 x 50,8 cm com troca rápida de múltiplos tamanhos de prato',
    technology: 'Dupla cabeça de impressão PrecisionCore® MicroTFP® de 2,6 polegadas',
    inkType: 'Epson UltraChrome® DG em bolsas de tinta a granel de 1,5 Litro por canal',
    resolution: 'Até 1200 x 1200 dpi',
    speed: 'Camiseta escura completa com camada dupla de branco em apenas ~28 a 35 segundos',
    keyFeatures: [
      'Dupla cabeça PrecisionCore de 2,6" que imprime branco e CMYK em uma única passada de alta velocidade',
      'Primeiro sistema industrial de tintas a granel da categoria com custo por estampa ultracompetitivo',
      'Ajuste de altura do prato totalmente automático e contínuo por sensores milimétricos',
      'Construção robusta para três turnos diários contínuos com baixíssima manutenção do operador',
      'Painel de toque touchscreen de 4,3" e integração com Epson Cloud Solution PORT'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=610512eecffb7671d82f69b203c3343e8af0aa2e&vid=610512eecffb7671d82f69b203c3343e8af0aa2e&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=SC-F3070_headon_690x460',
    officialUrl: 'https://epson.com.br/search/?text=F3070'
  },

  // 6. Comunicação Visual SIGNAGE
  {
    id: 's7170',
    code: 'S7170',
    name: 'Epson SureColor S7170',
    line: 'Signage & Banners de Alta Precisão 64"',
    categoryId: 'signage',
    categoryLabel: 'Comunicação visual SIGNAGE',
    application: 'Banners vinílicos, lonas, envelopamento de veículos, adesivos promocionais, cartazes e decoração comercial',
    printWidth: '64 polegadas (162,6 cm)',
    technology: 'Cabeça PrecisionCore® MicroTFP® com controle de ponto ultra preciso',
    inkType: 'Epson UltraChrome® GS3 solvente de baixo odor com secagem acelerada',
    resolution: 'Até 1440 x 1440 dpi',
    speed: 'Até 58 m²/h em modo rascunho (produção comercial de ~20 a 30 m²/h)',
    keyFeatures: [
      'Tinta eco-solvente com certificação GreenGuard Gold para uso em ambientes internos sem exaustor dedicado',
      'Secador integrado multizona que permite enrolamento e acabamento rápido da lona',
      'Mecanismo de bobinamento de alta precisão com controle motorizado de tensão',
      'Software RIP Epson Edge Print incluso com perfis calibrados para dezenas de mídias de mercado',
      'Excelente resistência contra intempéries e raios UV por até 3 anos sem laminação'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=88c708622b48faf5d2e047d6c660c401e88b6d89&vid=e2d8a6c995371c57050ad196a81d647dffaec8b6&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=surecolor-S7170_hero_headon-output_690x460%402x',
    officialUrl: 'https://epson.com.br/search/?text=S7170'
  },
  {
    id: 's8170',
    code: 'S8170',
    name: 'Epson SureColor S8170',
    line: 'Signage Premium 64" com Gama Cromática Expandida',
    categoryId: 'signage',
    categoryLabel: 'Comunicação visual SIGNAGE',
    application: 'Sinalização de alto padrão, vitrines de luxo, rótulos e etiquetas, acabamentos com tinta branca ou metálica e reprodução Pantone® de até 98,2%',
    printWidth: '64 polegadas (162,6 cm)',
    technology: 'Dupla cabeça PrecisionCore® MicroTFP® com alinhamento micron-level',
    inkType: 'Epson UltraChrome® GS3 com opção de Vermelho, Branco ou Prata metálica',
    resolution: 'Até 1440 x 1440 dpi',
    speed: 'Até 95 m²/h (produção de alta qualidade de ~35 a 50 m²/h)',
    keyFeatures: [
      'Gama cromática líder do setor com 98,2% de cobertura de cores Pantone Solid Coated',
      'Opção de tinta branca de alta densidade para impressão em vinis transparentes ou pretos',
      'Tinta Prata metálica exclusiva para efeitos de dourado, bronze e cromado brilhante',
      'Duas cabeças de impressão configuradas em tandem para cobertura perfeita em alta velocidade',
      'Compatível com os mais rigorosos padrões da indústria de comunicação visual'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=a309a72103b5a0972f14706e819b6316764812ce&vid=a309a72103b5a0972f14706e819b6316764812ce&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=surecolor-S8170PE_hero-headon-output_690x460%402x',
    officialUrl: 'https://epson.com.br/search/?text=S8170'
  },
  {
    id: 's9170',
    code: 'S9170',
    name: 'Epson SureColor S9170',
    line: 'Signage Top de Linha 64" com Cabeças Substituíveis',
    categoryId: 'signage',
    categoryLabel: 'Comunicação visual SIGNAGE',
    application: 'Grandes birôs de impressão digital, fábricas de sinalização, campanhas nacionais de publicidade externa e envelopamento profissional',
    printWidth: '64 polegadas (162,6 cm)',
    technology: 'Nova geração PrecisionCore® MicroTFP® substituível pelo usuário com sistema NVT',
    inkType: 'Conjunto UltraChrome® GS3 de 10 cores incluindo Verde e Laranja para gama ultra ampla',
    resolution: 'Até 1440 x 1440 dpi',
    speed: 'Alta produtividade comercial contínua com máxima saturação',
    keyFeatures: [
      'Cabeças de impressão substituíveis pelo próprio operador para máxima produtividade e zero espera técnica',
      'Cores especiais Verde e Laranja para reprodução impecável de logotipos corporativos e marcas famosas',
      'Novo design mecânico com chassi ultrarrígido e sistema de sucção estático de poeira',
      'Epson Cloud Solution PORT completo para relatórios de custos de tinta por metro quadrado',
      'Suporte a mídias pesadas de até 45 kg com tração motorizada servo-assistida'
    ],
    imageUrl: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=a98ad72d88019707cca3910a702f42e4558f1e6e&vid=a98ad72d88019707cca3910a702f42e4558f1e6e&prid=original&clid=SAPDAM&prclid=productpictures&assetDescr=surecolor-S9170_hero_headon-output_690x460%402x',
    officialUrl: 'https://epson.com.br/search/?text=S9170'
  }
];
