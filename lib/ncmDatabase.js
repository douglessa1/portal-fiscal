/**
 * Base de Dados de NCMs com Informações Fiscais Completas
 * Dados validados de fontes oficiais
 */

/**
 * Estrutura de dados por NCM
 * Fonte: TIPI, Resolução CAMEX, Convênios ICMS
 */
export const NCM_DATABASE = {
    '84714100': {
        codigo: '84714100',
        descricao: 'Máquinas automáticas para processamento de dados que contêm, no mesmo corpo, pelo menos uma unidade central de processamento e, mesmo combinadas, uma unidade de entrada e uma unidade de saída',
        unidade: 'UN',

        // Tributação Federal
        ipi: {
            aliquota: 0,
            observacao: 'Isento conforme TIPI'
        },

        pis_cofins: {
            regime: 'não-cumulativo',
            pis: 1.65,
            cofins: 7.6,
            credito: true,
            observacao: 'Alíquotas padrão regime não-cumulativo'
        },

        ii: {
            aliquota: 16,
            observacao: 'Imposto de Importação'
        },

        // Tributação Estadual (ICMS) - Exemplos principais
        icms: {
            'SP': { aliq_interna: 12, reducao: 0, st: false, mva: 0, observacao: 'Resolução SF 4/1998' },
            'RJ': { aliq_interna: 18, reducao: 0, st: false, mva: 0 },
            'MG': { aliq_interna: 18, reducao: 0, st: false, mva: 0 },
            'RS': { aliq_interna: 17, reducao: 0, st: false, mva: 0 },
            'PR': { aliq_interna: 18, reducao: 0, st: false, mva: 0 },
            'SC': { aliq_interna: 17, reducao: 0, st: false, mva: 0 },
            'BA': { aliq_interna: 18, reducao: 0, st: false, mva: 0 },
            'PE': { aliq_interna: 18, reducao: 0, st: false, mva: 0 },
            'CE': { aliq_interna: 18, reducao: 0, st: false, mva: 0 },
            'GO': { aliq_interna: 17, reducao: 0, st: false, mva: 0 }
        },

        // CEST
        cest: '21.029.00',
        cest_descricao: 'Outras máquinas automáticas para processamento de dados',

        // Benefícios Fiscais
        beneficios: [
            {
                tipo: 'Ex-tarifário',
                descricao: 'Possível redução de II mediante Ex-tarifário',
                vigencia: 'Consultar Resolução CAMEX'
            }
        ],

        // Restrições
        restricoes: {
            importacao: ['Licença de Importação (LI) quando aplicável'],
            comercializacao: []
        }
    },

    '22011000': {
        codigo: '22011000',
        descricao: 'Águas minerais e águas gaseificadas',
        unidade: 'L',

        ipi: { aliquota: 0, observacao: 'Isento' },

        pis_cofins: {
            regime: 'monofásico',
            pis: 0,
            cofins: 0,
            observacao: 'Tributação monofásica na indústria/importação'
        },

        ii: { aliquota: 20 },

        icms: {
            'SP': { aliq_interna: 18, reducao: 0, st: true, mva: 50.0 },
            'RJ': { aliq_interna: 18, reducao: 0, st: true, mva: 45.0 },
            'MG': { aliq_interna: 18, reducao: 0, st: true, mva: 48.0 }
        },

        cest: '01.001.00',
        cest_descricao: 'Água mineral, gasosa ou não, ou potável, naturais, em embalagem de vidro',

        beneficios: [],
        restricoes: {
            importacao: [],
            comercializacao: ['Registro ANVISA']
        }
    },

    '27101219': {
        codigo: '27101219',
        descricao: 'Óleo diesel B (com teor de enxofre entre 10 mg/kg e 500 mg/kg)',
        unidade: 'L',

        ipi: { aliquota: 0, observacao: 'Isento' },

        pis_cofins: {
            regime: 'monofásico',
            pis: 0,
            cofins: 0,
            observacao: 'Tributação concentrada'
        },

        ii: { aliquota: 0 },

        icms: {
            'SP': { aliq_interna: 12, reducao: 0, st: false, mva: 0, observacao: 'Convênio ICMS 110/2007' },
            'RJ': { aliq_interna: 12, reducao: 0, st: false, mva: 0 },
            'MG': { aliq_interna: 15, reducao: 0, st: false, mva: 0 }
        },

        cest: '06.001.00',
        cest_descricao: 'Óleo diesel',

        beneficios: [],
        restricoes: {
            importacao: ['Autorização ANP'],
            comercializacao: ['Registro ANP']
        }
    }
};

/**
 * Buscar NCM por código
 */
export function buscarNCM(codigo) {
    const codigoLimpo = codigo.replace(/[^\d]/g, '');
    return NCM_DATABASE[codigoLimpo] || null;
}

/**
 * Buscar NCMs por descrição
 */
export function buscarPorDescricao(termo) {
    const termoLower = termo.toLowerCase();
    const resultados = [];

    Object.values(NCM_DATABASE).forEach(ncm => {
        if (ncm.descricao.toLowerCase().includes(termoLower)) {
            resultados.push(ncm);
        }
    });

    return resultados;
}

/**
 * Calcular carga tributária total
 */
export function calcularCargaTributaria(ncm, uf, valor, operacao = 'venda_interna') {
    const dados = buscarNCM(ncm);
    if (!dados) {
        throw new Error('NCM não encontrado');
    }

    const resultado = {
        ncm: dados.codigo,
        descricao: dados.descricao,
        valor,
        uf,
        operacao,
        tributos: {},
        total: 0
    };

    // IPI (se aplicável)
    if (dados.ipi.aliquota > 0) {
        resultado.tributos.IPI = (valor * dados.ipi.aliquota) / 100;
    }

    // PIS/COFINS
    if (dados.pis_cofins.regime !== 'monofásico') {
        resultado.tributos.PIS = (valor * dados.pis_cofins.pis) / 100;
        resultado.tributos.COFINS = (valor * dados.pis_cofins.cofins) / 100;
    }

    // ICMS
    const icmsUF = dados.icms[uf];
    if (icmsUF) {
        const baseICMS = valor * (1 - (icmsUF.reducao || 0) / 100);
        resultado.tributos.ICMS = (baseICMS * icmsUF.aliq_interna) / 100;

        // ICMS-ST se aplicável
        if (icmsUF.st && icmsUF.mva > 0) {
            const baseST = baseICMS * (1 + icmsUF.mva / 100);
            resultado.tributos['ICMS-ST'] = (baseST * icmsUF.aliq_interna) / 100 - resultado.tributos.ICMS;
        }
    }

    // Calcular total
    resultado.total = Object.values(resultado.tributos).reduce((sum, val) => sum + val, 0);
    resultado.percentualTotal = (resultado.total / valor) * 100;

    return resultado;
}

/**
 * Comparar carga tributária entre NCMs
 */
export function compararNCMs(ncm1, ncm2, uf, valor) {
    const carga1 = calcularCargaTributaria(ncm1, uf, valor);
    const carga2 = calcularCargaTributaria(ncm2, uf, valor);

    return {
        ncm1: carga1,
        ncm2: carga2,
        diferenca: carga1.total - carga2.total,
        percentualDiferenca: ((carga1.total - carga2.total) / carga1.total) * 100
    };
}

/**
 * Obter lista de todos os NCMs
 */
export function listarNCMs() {
    return Object.values(NCM_DATABASE);
}

/**
 * Validar código NCM
 */
export function validarNCM(codigo) {
    const codigoLimpo = codigo.replace(/[^\d]/g, '');

    if (codigoLimpo.length !== 8) {
        return { valido: false, erro: 'NCM deve ter 8 dígitos' };
    }

    return { valido: true };
}
