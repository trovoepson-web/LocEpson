import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { Type } from '@google/genai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientInfo, simulation, customInstructions } = body;

    if (!simulation || !clientInfo) {
      return NextResponse.json(
        { error: 'Dados de simulação e cliente são obrigatórios.' },
        { status: 400 }
      );
    }

    const systemInstruction = `
Você é o Assistente Comercial Especialista da Epson para o ecossistema de locação de impressoras de sublimação têxtil (modelos SureColor F6470, F9570 e F20070).
Seu objetivo é gerar propostas comerciais impecáveis, persuasivas e com rigor financeiro e tributário para confecções, indústrias têxteis e birôs de estamparia no Brasil.

REGRAS DE NEGÓCIO E PILARES COMERCIAIS:
1. Origem de Faturamento: Rio de Janeiro (RJ).
2. Taxa de Juros Padrão: 0.99% ao mês.
3. Amortização Progressiva: Prazos maiores (12, 24, 36, 48 e 60 meses) reduzem a parcela mensal, viabilizando o payback e reduzindo o custo por metro quadrado (R$/m²).
4. Vantagens Competitivas Chave (Locação OPEX x Compra CAPEX):
   - Zero Capex: Preserva o capital de giro para compra de tecidos, insumos e expansão.
   - Cabeça de Impressão Inclusa: Elimina o maior risco e custo oculto da sublimação (trocas de cabeças avulsas que custam milhares de reais, além do CoverPlus, já inclusos no contrato).
   - Software RIP Genuíno Incluso: Epson Edge Print com motor Adobe PostScript 3 (economia de licenças avulsas caras).
   - Tratamento Fiscal Vantajoso: Locação é despesa operacional integral (OPEX), permitindo abatimento de até 34% de IRPJ/CSLL para empresas no Lucro Real + créditos de PIS/COFINS (9,25%).
   - Obsolescência Zero e Suporte Oficial: Equipamento novo com suporte direto da rede autorizada Epson.

Gere uma proposta comercial detalhada, com tom profissional, executivo e consultivo, totalmente em português do Brasil (pt-BR).
`;

    const prompt = `
DADOS DA SIMULAÇÃO:
- Equipamento: ${simulation.modelInfo.name} (${simulation.modelInfo.fullName})
- Categoria / Aplicação: ${simulation.modelInfo.category} - ${simulation.modelInfo.targetMarket}
- Largura de Impressão: ${simulation.modelInfo.widthInches}" (${simulation.modelInfo.widthCm} cm)
- Tecnologia de Cabeça: ${simulation.modelInfo.headsDescription} (${simulation.modelInfo.printheadsCount} cabeça(s))
- Custo Base HW Net inserido: R$ ${simulation.hwNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Margem Aplicada: ${simulation.marginPercent}% (R$ ${simulation.marginAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
- Custos Operacionais: R$ ${simulation.operationalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Origem / Destino: ${simulation.originUf} -> ${simulation.destinationUf} (DIFAL: ${simulation.difalPercent.toFixed(1)}% = R$ ${simulation.difalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
- Base Financiada Total: R$ ${simulation.totalFinancedBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Prazo Selecionado: ${simulation.selectedTerm.months} meses
- Parcela Mensal: R$ ${simulation.selectedTerm.monthlyInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês
- Custo por m² na parcela: R$ ${simulation.selectedTerm.costPerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/m²

DADOS DO CLIENTE & CENÁRIO DE PRODUÇÃO:
- Razão Social / Nome: ${clientInfo.clientName || 'Cliente Confecção'}
- CNPJ: ${clientInfo.cnpj || 'Sob consulta'}
- Contato: ${clientInfo.contactPerson || 'Diretoria'}
- Estado Destino: ${clientInfo.destinationUf}
- Regime Tributário do Cliente: ${clientInfo.clientTaxRegime}
- Produção Mensal Estimada: ${simulation.productionMetrics.monthlyProductionM2.toLocaleString('pt-BR')} m²/mês
- Preço de Venda Praticado: R$ ${simulation.productionMetrics.sellingPricePerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/m²
- Faturamento Bruto Estimado: R$ ${simulation.productionMetrics.monthlyGrossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
- Lucro Operacional Líquido Estimado: R$ ${simulation.productionMetrics.monthlyNetOperatingProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
- Ponto de Equilíbrio: ${Math.ceil(simulation.productionMetrics.breakEvenM2)} m²/mês

VANTAGENS COMPETITIVAS & ECONOMIA:
- Capex Preservado (Street Price): R$ ${simulation.competitiveAdvantages.streetPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Custo de Cabeça Avulsa Evitado: R$ ${simulation.competitiveAdvantages.printheadCostEach.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} cada
- Economia Estimada em Cabeças e Manutenção: R$ ${simulation.competitiveAdvantages.printheadTotalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- RIP Epson Edge Print Incluso: Economia de R$ 9.500,00

INSTRUÇÕES ADICIONAIS DO OPERADOR:
${customInstructions || 'Nenhuma instrução adicional informada. Focar na melhor proposta custo-benefício.'}

Gere o JSON com os seguintes campos:
1. executiveSummary: Resumo executivo de impacto destacando a oportunidade e o modelo SureColor.
2. operationalImpactAnalysis: Análise operacional da capacidade de produção da máquina, resolução, velocidade e ganho de qualidade para a estamparia do cliente.
3. capexVsOpexStrategicPitch: Argumentação financeira profunda comparando compra com financiamento bancário vs. locação operacional Epson (focando em fluxo de caixa, cabeça inclusa e incentivos fiscais).
4. financialScheduleDetails: Detalhamento dos prazos (12 a 60 meses) e recomendação estratégica do prazo de ${simulation.selectedTerm.months} meses.
5. warrantyAndSlaClauses: Cláusulas comerciais padrão, garantia total, inclusão de cabeças, SLA de atendimento e software original Epson Edge Print.
6. whatsAppPitch: Mensagem curta, profissional e direta para envio no WhatsApp do tomador de decisão com os números principais e call to action.
7. executiveEmail: E-mail formal pronto para envio em tom de diretoria comercial Epson.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Baixa temperatura para manter consistência e precisão
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: 'Resumo executivo de impacto da proposta',
            },
            operationalImpactAnalysis: {
              type: Type.STRING,
              description: 'Análise operacional e produtiva do equipamento na confecção',
            },
            capexVsOpexStrategicPitch: {
              type: Type.STRING,
              description: 'Argumentação estratégica OPEX vs CAPEX com números reais',
            },
            financialScheduleDetails: {
              type: Type.STRING,
              description: 'Detalhamento do cronograma financeiro e amortização',
            },
            warrantyAndSlaClauses: {
              type: Type.STRING,
              description: 'Cláusulas de garantia, SLA, cabeças de impressão inclusas e suporte',
            },
            whatsAppPitch: {
              type: Type.STRING,
              description: 'Pitch direto para WhatsApp com números e CTA',
            },
            executiveEmail: {
              type: Type.STRING,
              description: 'E-mail executivo completo formal',
            },
          },
          required: [
            'executiveSummary',
            'operationalImpactAnalysis',
            'capexVsOpexStrategicPitch',
            'financialScheduleDetails',
            'warrantyAndSlaClauses',
            'whatsAppPitch',
            'executiveEmail',
          ],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return NextResponse.json({
      success: true,
      proposal: {
        id: `PROP-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        clientName: clientInfo.clientName || 'Cliente Confecção',
        cnpj: clientInfo.cnpj || 'Não informado',
        modelName: simulation.modelInfo.name,
        termMonths: simulation.selectedTerm.months,
        monthlyInstallment: simulation.selectedTerm.monthlyInstallment,
        totalFinancedBase: simulation.totalFinancedBase,
        ...parsed,
      },
    });
  } catch (err: any) {
    console.error('Erro ao gerar proposta com Gemini:', err);
    return NextResponse.json(
      { error: err?.message || 'Falha ao gerar proposta comercial com IA.' },
      { status: 500 }
    );
  }
}
