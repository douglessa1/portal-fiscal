/**
 * CST Database - Códigos de Situação Tributária
 * ICMS, PIS e COFINS
 */

// CST ICMS (A + B)
export const CST_ICMS_ORIGEM = {
    '0': 'Nacional (exceto códigos 3, 4, 5 e 8)',
    '1': 'Estrangeira - Importação direta',
    '2': 'Estrangeira - Adquirida no mercado interno',
    '3': 'Nacional - Conteúdo importação > 40% e <= 70%',
    '4': 'Nacional - Processos básicos (PPB)',
    '5': 'Nacional - Conteúdo importação <= 40%',
    '6': 'Estrangeira - Importação direta, sem similar nacional (CAMEX)',
    '7': 'Estrangeira - Mercado interno, sem similar nacional (CAMEX)',
    '8': 'Nacional - Conteúdo importação > 70%'
};

export const CST_ICMS_TRIBUTACAO = {
    '00': { descricao: 'Tributada integralmente', cor: 'blue' },
    '10': { descricao: 'Tributada com ST', cor: 'purple' },
    '20': { descricao: 'Com redução de base de cálculo', cor: 'green' },
    '30': { descricao: 'Isenta/não tributada com ST', cor: 'purple' },
    '40': { descricao: 'Isenta', cor: 'emerald' },
    '41': { descricao: 'Não tributada', cor: 'emerald' },
    '50': { descricao: 'Suspensão', cor: 'amber' },
    '51': { descricao: 'Diferimento', cor: 'amber' },
    '60': { descricao: 'ICMS cobrado anteriormente por ST', cor: 'purple' },
    '70': { descricao: 'Redução BC com ST', cor: 'purple' },
    '90': { descricao: 'Outros', cor: 'slate' }
};

// CSOSN - Simples Nacional
export const CSOSN = {
    '101': { descricao: 'Tributada com permissão de crédito', cor: 'blue' },
    '102': { descricao: 'Tributada sem permissão de crédito', cor: 'blue' },
    '103': { descricao: 'Isenção do ICMS para faixa de receita bruta', cor: 'emerald' },
    '201': { descricao: 'Tributada com ST e crédito', cor: 'purple' },
    '202': { descricao: 'Tributada com ST, sem crédito', cor: 'purple' },
    '203': { descricao: 'Isenção com ST', cor: 'purple' },
    '300': { descricao: 'Imune', cor: 'emerald' },
    '400': { descricao: 'Não tributada', cor: 'emerald' },
    '500': { descricao: 'ICMS cobrado anteriormente por ST ou antecipação', cor: 'purple' },
    '900': { descricao: 'Outros', cor: 'slate' }
};

// CST PIS/COFINS - Saída
export const CST_PIS_SAIDA = {
    '01': { descricao: 'Operação Tributável - Alíquota Básica', cor: 'blue' },
    '02': { descricao: 'Operação Tributável - Alíquota Diferenciada', cor: 'blue' },
    '03': { descricao: 'Operação Tributável - Alíquota por Unidade', cor: 'blue' },
    '04': { descricao: 'Operação Tributável - Monofásica (Revenda a Zero)', cor: 'green' },
    '05': { descricao: 'Operação Tributável - Substituição Tributária', cor: 'purple' },
    '06': { descricao: 'Operação Tributável - Alíquota Zero', cor: 'green' },
    '07': { descricao: 'Operação Isenta', cor: 'emerald' },
    '08': { descricao: 'Operação sem Incidência', cor: 'emerald' },
    '09': { descricao: 'Operação com Suspensão', cor: 'amber' },
    '49': { descricao: 'Outras Operações de Saída', cor: 'slate' }
};

// CST PIS/COFINS - Entrada (Crédito)
export const CST_PIS_ENTRADA = {
    '50': { descricao: 'Crédito - Vinculado Exclusivamente a Receita Tributada', cor: 'blue' },
    '51': { descricao: 'Crédito - Vinculado a Receita Não Cumulativa e Cumulativa', cor: 'blue' },
    '52': { descricao: 'Crédito - Vinculado Exclusivamente a Receita Não Tributada', cor: 'green' },
    '53': { descricao: 'Crédito - Vinculado a Receita Tributada e Não Tributada', cor: 'blue' },
    '54': { descricao: 'Crédito - Vinculado a Receita Tributada (Merc. Interno)', cor: 'blue' },
    '55': { descricao: 'Crédito - Vinculado a Receita Não Tributada (Merc. Interno)', cor: 'green' },
    '56': { descricao: 'Crédito - Vinculado a Receita Tributada e Exterior', cor: 'blue' },
    '60': { descricao: 'Crédito Presumido - Alíquota Básica', cor: 'teal' },
    '61': { descricao: 'Crédito Presumido - Alíquota Diferenciada', cor: 'teal' },
    '62': { descricao: 'Crédito Presumido - Alíquota por Unidade', cor: 'teal' },
    '63': { descricao: 'Crédito Presumido - Alíquota por Unidade', cor: 'teal' },
    '64': { descricao: 'Crédito Presumido - Agroindústria', cor: 'teal' },
    '65': { descricao: 'Crédito Presumido - Produtos Passagem', cor: 'teal' },
    '66': { descricao: 'Crédito Presumido - Alíquota Zero', cor: 'green' },
    '67': { descricao: 'Crédito Presumido - Aquisição de Prod. Rurais', cor: 'teal' },
    '70': { descricao: 'Sem Direito a Crédito - Compra p/ Revenda', cor: 'slate' },
    '71': { descricao: 'Sem Direito a Crédito - Compra p/ Industrialização', cor: 'slate' },
    '72': { descricao: 'Sem Direito a Crédito - Despesas e Custos', cor: 'slate' },
    '73': { descricao: 'Sem Direito a Crédito - Bens Ativo Imobilizado', cor: 'slate' },
    '74': { descricao: 'Sem Direito a Crédito - Aluguéis', cor: 'slate' },
    '75': { descricao: 'Sem Direito a Crédito - Arrendamento', cor: 'slate' },
    '98': { descricao: 'Sem Direito a Crédito - Outras Operações', cor: 'slate' },
    '99': { descricao: 'Outras Operações de Entrada', cor: 'slate' }
};

// Mapeamento CFOP -> CST ICMS sugerido
export const CFOP_CST_MAPPING = {
    // Compra para industrialização/comercialização
    '1101': { icms: '00', icms_st: '10', csosn: '101', pis: '50' },
    '1102': { icms: '00', icms_st: '10', csosn: '102', pis: '50' },
    '2101': { icms: '00', icms_st: '10', csosn: '101', pis: '50' },
    '2102': { icms: '00', icms_st: '10', csosn: '102', pis: '50' },
    '3101': { icms: '00', csosn: '101', pis: '50' },
    '3102': { icms: '00', csosn: '102', pis: '50' },

    // Compra com ST
    '1403': { icms: '60', csosn: '500', pis: '70' },
    '2403': { icms: '60', csosn: '500', pis: '70' },

    // Devoluções entrada
    '1201': { icms: '00', csosn: '900', pis: '49' },
    '1202': { icms: '00', csosn: '900', pis: '49' },
    '2201': { icms: '00', csosn: '900', pis: '49' },
    '2202': { icms: '00', csosn: '900', pis: '49' },

    // Transferências entrada
    '1151': { icms: '00', csosn: '400', pis: '08' },
    '1152': { icms: '00', csosn: '400', pis: '08' },
    '2151': { icms: '00', csosn: '400', pis: '08' },
    '2152': { icms: '00', csosn: '400', pis: '08' },

    // Ativo e uso/consumo
    '1551': { icms: '00', csosn: '400', pis: '73' },
    '1556': { icms: '00', csosn: '400', pis: '72' },
    '2551': { icms: '00', csosn: '400', pis: '73' },
    '2556': { icms: '00', csosn: '400', pis: '72' },

    // Vendas
    '5101': { icms: '00', icms_st: '10', csosn: '101', pis: '01' },
    '5102': { icms: '00', icms_st: '10', csosn: '102', pis: '01' },
    '6101': { icms: '00', icms_st: '10', csosn: '101', pis: '01' },
    '6102': { icms: '00', icms_st: '10', csosn: '102', pis: '01' },
    '7101': { icms: '41', csosn: '300', pis: '08' },
    '7102': { icms: '41', csosn: '300', pis: '08' },

    // Venda com ST
    '5401': { icms: '10', csosn: '201', pis: '01' },
    '5403': { icms: '10', csosn: '202', pis: '01' },
    '5405': { icms: '60', csosn: '500', pis: '04' },
    '6401': { icms: '10', csosn: '201', pis: '01' },
    '6403': { icms: '10', csosn: '202', pis: '01' },

    // DIFAL
    '6107': { icms: '00', csosn: '102', pis: '01' },
    '6108': { icms: '00', csosn: '102', pis: '01' },

    // Devoluções saída
    '5201': { icms: '00', csosn: '900', pis: '49' },
    '5202': { icms: '00', csosn: '900', pis: '49' },
    '6201': { icms: '00', csosn: '900', pis: '49' },
    '6202': { icms: '00', csosn: '900', pis: '49' },

    // Transferências saída
    '5151': { icms: '00', csosn: '400', pis: '08' },
    '5152': { icms: '00', csosn: '400', pis: '08' },
    '6151': { icms: '00', csosn: '400', pis: '08' },
    '6152': { icms: '00', csosn: '400', pis: '08' },

    // Remessas
    '5901': { icms: '50', csosn: '400', pis: '08' },
    '5902': { icms: '50', csosn: '400', pis: '08' },
    '5904': { icms: '50', csosn: '400', pis: '08' },
    '5905': { icms: '50', csosn: '400', pis: '08' },
    '5910': { icms: '00', csosn: '102', pis: '49' },
    '5911': { icms: '00', csosn: '102', pis: '49' },
    '5912': { icms: '50', csosn: '400', pis: '08' },
    '5949': { icms: '90', csosn: '900', pis: '49' },
    '6901': { icms: '50', csosn: '400', pis: '08' },
    '6949': { icms: '90', csosn: '900', pis: '49' },
    '7949': { icms: '41', csosn: '300', pis: '08' },

    // Outros
    '1949': { icms: '90', csosn: '900', pis: '99' },
    '2949': { icms: '90', csosn: '900', pis: '99' },
    '3949': { icms: '90', csosn: '900', pis: '99' },
};

// Função para obter CST sugerido por CFOP
export function getCSTSuggestion(cfop) {
    const mapping = CFOP_CST_MAPPING[cfop];
    if (!mapping) return null;

    return {
        icms: {
            cst: mapping.icms,
            descricao: CST_ICMS_TRIBUTACAO[mapping.icms]?.descricao || 'N/A'
        },
        icms_st: mapping.icms_st ? {
            cst: mapping.icms_st,
            descricao: CST_ICMS_TRIBUTACAO[mapping.icms_st]?.descricao || 'N/A'
        } : null,
        csosn: {
            cst: mapping.csosn,
            descricao: CSOSN[mapping.csosn]?.descricao || 'N/A'
        },
        pis: {
            cst: mapping.pis,
            descricao: (CST_PIS_SAIDA[mapping.pis] || CST_PIS_ENTRADA[mapping.pis])?.descricao || 'N/A'
        }
    };
}

export default {
    CST_ICMS_ORIGEM,
    CST_ICMS_TRIBUTACAO,
    CSOSN,
    CST_PIS_SAIDA,
    CST_PIS_ENTRADA,
    CFOP_CST_MAPPING,
    getCSTSuggestion
};
