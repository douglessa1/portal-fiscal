/**
 * MVA Database por NCM/UF - Para ICMS-ST
 * Margens de Valor Agregado por segmento e estado
 */

// MVA padrão por segmento (quando não há acordo específico)
export const MVA_SEGMENTOS = {
    'autopecas': { nome: 'Autopeças', mva_original: 59.60, cest_inicio: '01' },
    'bebidas_alcoolicas': { nome: 'Bebidas Alcoólicas', mva_original: 51.93, cest_inicio: '02' },
    'bebidas_frias': { nome: 'Cervejas e Refrigerantes', mva_original: 140.00, cest_inicio: '03' },
    'cigarros': { nome: 'Cigarros', mva_original: 0, cest_inicio: '04' },
    'cimentos': { nome: 'Cimentos', mva_original: 20.00, cest_inicio: '05' },
    'combustiveis': { nome: 'Combustíveis', mva_original: 0, cest_inicio: '06' },
    'medicamentos': { nome: 'Medicamentos', mva_original: 33.00, cest_inicio: '13' },
    'alimentos': { nome: 'Alimentos', mva_original: 20.00, cest_inicio: '17' },
    'perfumaria': { nome: 'Perfumaria', mva_original: 52.90, cest_inicio: '20' },
    'eletronicos': { nome: 'Eletrônicos', mva_original: 35.00, cest_inicio: '21' },
    'veiculos': { nome: 'Veículos', mva_original: 30.00, cest_inicio: '25' },
};

// Alíquotas internas por UF
export const ALIQ_INTERNA_UF = {
    'AC': 19, 'AL': 19, 'AM': 20, 'AP': 18, 'BA': 20.5,
    'CE': 20, 'DF': 20, 'ES': 17, 'GO': 19, 'MA': 22,
    'MG': 18, 'MS': 17, 'MT': 17, 'PA': 19, 'PB': 20,
    'PE': 20.5, 'PI': 21, 'PR': 19.5, 'RJ': 22, 'RN': 20,
    'RO': 19.5, 'RR': 20, 'RS': 17, 'SC': 17, 'SE': 19,
    'SP': 18, 'TO': 20
};

// MVA específica por NCM/UF (acordos CONFAZ)
export const MVA_POR_NCM_UF = {
    // Pneus
    '40111000': {
        descricao: 'Pneus para automóveis',
        mva_original: 42.00,
        por_uf: {
            'SP': 42.00, 'RJ': 42.00, 'MG': 42.00, 'PR': 42.00,
            'SC': 42.00, 'RS': 42.00, 'BA': 45.00, 'GO': 45.00
        }
    },
    '40112010': {
        descricao: 'Pneus para ônibus e caminhões',
        mva_original: 32.00,
        por_uf: { 'SP': 32.00, 'RJ': 35.00, 'MG': 32.00 }
    },

    // Medicamentos
    '30049039': {
        descricao: 'Medicamentos lista positiva',
        mva_original: 33.00,
        por_uf: {
            'SP': 33.00, 'RJ': 33.00, 'MG': 33.00, 'PR': 33.00,
            'SC': 33.00, 'RS': 33.00
        }
    },

    // Eletrônicos
    '84713012': {
        descricao: 'Notebooks',
        mva_original: 35.00,
        por_uf: {
            'SP': 35.00, 'RJ': 38.00, 'MG': 36.00, 'PR': 35.00,
            'SC': 35.00, 'RS': 37.00
        }
    },
    '85171231': {
        descricao: 'Telefones celulares',
        mva_original: 9.00,
        por_uf: {
            'SP': 9.00, 'RJ': 9.00, 'MG': 9.00, 'PR': 9.00,
            'SC': 9.00, 'RS': 9.00
        }
    },
    '85287200': {
        descricao: 'Televisores',
        mva_original: 19.00,
        por_uf: {
            'SP': 19.00, 'RJ': 22.00, 'MG': 19.00, 'PR': 20.00
        }
    },

    // Bebidas
    '22030000': {
        descricao: 'Cervejas',
        mva_original: 140.00,
        por_uf: {
            'SP': 140.00, 'RJ': 140.00, 'MG': 140.00, 'PR': 140.00,
            'SC': 140.00, 'RS': 140.00, 'BA': 150.00
        }
    },
    '22021000': {
        descricao: 'Refrigerantes',
        mva_original: 140.00,
        por_uf: {
            'SP': 140.00, 'RJ': 155.00, 'MG': 150.00
        }
    },

    // Combustíveis (valores zerados - sistema monofásico)
    '27101921': { descricao: 'Gasolina', mva_original: 0, por_uf: {} },
    '27101259': { descricao: 'Diesel', mva_original: 0, por_uf: {} },
    '27111910': { descricao: 'GLP', mva_original: 0, por_uf: {} },

    // Cosméticos
    '33051000': {
        descricao: 'Xampus',
        mva_original: 45.59,
        por_uf: {
            'SP': 45.59, 'RJ': 45.59, 'MG': 45.59, 'PR': 45.59
        }
    },
    '33072010': {
        descricao: 'Desodorantes',
        mva_original: 45.59,
        por_uf: {
            'SP': 45.59, 'RJ': 48.00, 'MG': 45.59
        }
    },

    // Alimentos
    '11010010': {
        descricao: 'Farinha de trigo',
        mva_original: 25.00,
        por_uf: {
            'SP': 25.00, 'RJ': 25.00, 'MG': 25.00, 'PR': 25.00
        }
    },
    '15079011': {
        descricao: 'Óleo de soja',
        mva_original: 15.00,
        por_uf: {
            'SP': 15.00, 'RJ': 15.00, 'MG': 15.00, 'PR': 15.00
        }
    },
};

/**
 * Calcular MVA Ajustada
 */
export function calcularMVAAjustada(mvaOriginal, aliqInterestadual, aliqInterna) {
    if (aliqInterna === 0) return mvaOriginal;
    const fator1 = 1 + (mvaOriginal / 100);
    const fator2 = 1 - (aliqInterestadual / 100);
    const fator3 = 1 - (aliqInterna / 100);
    return ((fator1 * fator2) / fator3 - 1) * 100;
}

/**
 * Obter MVA para NCM/UF específico
 */
export function getMVAParaNCMUF(ncm, ufDestino, ufOrigem = null) {
    const dados = MVA_POR_NCM_UF[ncm];
    const aliqInterna = ALIQ_INTERNA_UF[ufDestino] || 18;

    let mvaOriginal = 0;

    if (dados) {
        mvaOriginal = dados.por_uf[ufDestino] || dados.mva_original;
    }

    // Calcular alíquota interestadual
    let aliqInterestadual = 12;
    if (ufOrigem) {
        const sulSudeste = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS'];
        const origemSulSudeste = sulSudeste.includes(ufOrigem);
        const destinoNorteNordesteCO = !sulSudeste.includes(ufDestino) && ufDestino !== 'ES';

        if (origemSulSudeste && destinoNorteNordesteCO) {
            aliqInterestadual = 7;
        }
    }

    const mvaAjustada = calcularMVAAjustada(mvaOriginal, aliqInterestadual, aliqInterna);

    return {
        ncm,
        descricao: dados?.descricao || 'NCM não encontrado',
        uf_destino: ufDestino,
        aliq_interna: aliqInterna,
        aliq_interestadual: aliqInterestadual,
        mva_original: mvaOriginal,
        mva_ajustada: mvaAjustada
    };
}

/**
 * Listar todos os NCMs com MVA
 */
export function listarNCMsComMVA() {
    return Object.entries(MVA_POR_NCM_UF).map(([ncm, dados]) => ({
        ncm,
        ...dados
    }));
}

export default {
    MVA_SEGMENTOS,
    ALIQ_INTERNA_UF,
    MVA_POR_NCM_UF,
    calcularMVAAjustada,
    getMVAParaNCMUF,
    listarNCMsComMVA
};
