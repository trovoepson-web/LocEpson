import { BrazilianStateTax } from '../types';

// Origem do faturamento: Rio de Janeiro (RJ)
// Regra geral de alíquota interestadual saindo do RJ:
// - Para estados das regiões Sul e Sudeste (exceto Espírito Santo): 12% (SP, MG, PR, SC, RS)
// - Para estados das regiões Norte, Nordeste, Centro-Oeste e o estado do Espírito Santo (ES): 7%
// - Para operações internas no RJ: Não há DIFAL (alíquota interna 20%)

export const BRAZILIAN_STATES: BrazilianStateTax[] = [
  { uf: 'AC', name: 'Acre', region: 'Norte', internalIcms: 0.19, interstateFromRJ: 0.07, difal: 0.12 },
  { uf: 'AL', name: 'Alagoas', region: 'Nordeste', internalIcms: 0.19, interstateFromRJ: 0.07, difal: 0.12 },
  { uf: 'AM', name: 'Amazonas', region: 'Norte', internalIcms: 0.20, interstateFromRJ: 0.07, difal: 0.13 },
  { uf: 'AP', name: 'Amapá', region: 'Norte', internalIcms: 0.18, interstateFromRJ: 0.07, difal: 0.11 },
  { uf: 'BA', name: 'Bahia', region: 'Nordeste', internalIcms: 0.205, interstateFromRJ: 0.07, difal: 0.135 },
  { uf: 'CE', name: 'Ceará', region: 'Nordeste', internalIcms: 0.20, interstateFromRJ: 0.07, difal: 0.13 },
  { uf: 'DF', name: 'Distrito Federal', region: 'Centro-Oeste', internalIcms: 0.20, interstateFromRJ: 0.07, difal: 0.13 },
  { uf: 'ES', name: 'Espírito Santo', region: 'Sudeste', internalIcms: 0.17, interstateFromRJ: 0.07, difal: 0.10 },
  { uf: 'GO', name: 'Goiás', region: 'Centro-Oeste', internalIcms: 0.19, interstateFromRJ: 0.07, difal: 0.12 },
  { uf: 'MA', name: 'Maranhão', region: 'Nordeste', internalIcms: 0.22, interstateFromRJ: 0.07, difal: 0.15 },
  { uf: 'MG', name: 'Minas Gerais', region: 'Sudeste', internalIcms: 0.18, interstateFromRJ: 0.12, difal: 0.06 },
  { uf: 'MS', name: 'Mato Grosso do Sul', region: 'Centro-Oeste', internalIcms: 0.17, interstateFromRJ: 0.07, difal: 0.10 },
  { uf: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste', internalIcms: 0.17, interstateFromRJ: 0.07, difal: 0.10 },
  { uf: 'PA', name: 'Pará', region: 'Norte', internalIcms: 0.19, interstateFromRJ: 0.07, difal: 0.12 },
  { uf: 'PB', name: 'Paraíba', region: 'Nordeste', internalIcms: 0.20, interstateFromRJ: 0.07, difal: 0.13 },
  { uf: 'PE', name: 'Pernambuco', region: 'Nordeste', internalIcms: 0.205, interstateFromRJ: 0.07, difal: 0.135 },
  { uf: 'PI', name: 'Piauí', region: 'Nordeste', internalIcms: 0.21, interstateFromRJ: 0.07, difal: 0.14 },
  { uf: 'PR', name: 'Paraná', region: 'Sul', internalIcms: 0.195, interstateFromRJ: 0.12, difal: 0.075 },
  { uf: 'RJ', name: 'Rio de Janeiro', region: 'Sudeste', internalIcms: 0.20, interstateFromRJ: 0.20, difal: 0.00 },
  { uf: 'RN', name: 'Rio Grande do Norte', region: 'Nordeste', internalIcms: 0.18, interstateFromRJ: 0.07, difal: 0.11 },
  { uf: 'RO', name: 'Rondônia', region: 'Norte', internalIcms: 0.195, interstateFromRJ: 0.07, difal: 0.125 },
  { uf: 'RR', name: 'Roraima', region: 'Norte', internalIcms: 0.20, interstateFromRJ: 0.07, difal: 0.13 },
  { uf: 'RS', name: 'Rio Grande do Sul', region: 'Sul', internalIcms: 0.17, interstateFromRJ: 0.12, difal: 0.05 },
  { uf: 'SC', name: 'Santa Catarina', region: 'Sul', internalIcms: 0.17, interstateFromRJ: 0.12, difal: 0.05 },
  { uf: 'SE', name: 'Sergipe', region: 'Nordeste', internalIcms: 0.19, interstateFromRJ: 0.07, difal: 0.12 },
  { uf: 'SP', name: 'São Paulo', region: 'Sudeste', internalIcms: 0.18, interstateFromRJ: 0.12, difal: 0.06 },
  { uf: 'TO', name: 'Tocantins', region: 'Norte', internalIcms: 0.20, interstateFromRJ: 0.07, difal: 0.13 },
];

export function getStateTax(uf: string): BrazilianStateTax {
  const found = BRAZILIAN_STATES.find(s => s.uf.toUpperCase() === uf.toUpperCase());
  if (found) return found;
  // Fallback padrão SC
  return BRAZILIAN_STATES.find(s => s.uf === 'SC')!;
}
