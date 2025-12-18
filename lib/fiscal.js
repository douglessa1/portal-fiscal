/**
 * Módulo de Cálculos Fiscais Centralizados
 * Funções reutilizáveis para cálculos tributários
 */

/**
 * Calcular DIFAL (Diferencial de Alíquotas)
 * Suporta Base Dupla (padrão) e Base Única (ES)
 * 
 * @param {Object} params
 * @param {number} params.valor - Valor da operação
 * @param {number} params.aliqInterestadual - Alíquota interestadual (%)
 * @param {number} params.aliqInterna - Alíquota interna do destino (%)
 * @param {number} params.aliqFCP - Alíquota FCP (%)
 * @param {string} params.metodologia - 'base_dupla' ou 'base_unica'
 * @param {string} params.ufDestino - UF de destino (ex: 'SP', 'ES')
 * @returns {Object} Resultado com todos os valores calculados
 */
export function calcularDIFAL(params) {
    const {
        valor,
        aliqInterestadual,
        aliqInterna,
        aliqFCP = 0,
        metodologia,
        ufDestino
    } = params;

    // Converter strings para números e percentuais para decimais
    const v = parseFloat(String(valor).replace(',', '.'));
    const inter = parseFloat(String(aliqInterestadual).replace(',', '.')) / 100;
    const interna = parseFloat(String(aliqInterna).replace(',', '.')) / 100;
    const fcp = parseFloat(String(aliqFCP).replace(',', '.')) / 100;

    // Validações
    if (isNaN(v) || isNaN(inter) || isNaN(interna) || isNaN(fcp)) {
        throw new Error('Valores inválidos para cálculo');
    }

    // Determinar metodologia automaticamente se não especificada
    const metodo = metodologia || (ufDestino === 'ES' ? 'base_unica' : 'base_dupla');

    let resultado;

    if (metodo === 'base_unica') {
        // BASE ÚNICA (Espírito Santo)
        // Fórmula simplificada: DIFAL = Valor * (Aliq Interna - Aliq Interestadual) / 100
        const difal = v * (interna - inter);
        const fcpValor = v * fcp;

        resultado = {
            metodologia: 'base_unica',
            ufDestino,
            valorOperacao: v,
            aliquotaInterestadual: inter * 100,
            aliquotaInterna: interna * 100,
            aliquotaFCP: fcp * 100,
            baseCalculo: v,
            icmsOrigem: v * inter,
            icmsDestino: v * interna,
            difal: difal,
            fcp: fcpValor,
            totalDifal: difal + fcpValor
        };
    } else {
        // BASE DUPLA (demais Estados)
        // Metodologia correta conforme LC 190/2022:
        // 1. ICMS Interestadual = Valor × Aliq Inter
        // 2. Valor Líquido = Valor - ICMS Inter
        // 3. Base Majorada = Valor Líquido / (1 - Aliq Interna)  ← SEM FCP aqui
        // 4. ICMS Interno = Base Majorada × Aliq Interna
        // 5. FCP = Base Majorada × Aliq FCP (se houver)
        // 6. DIFAL = ICMS Interno - ICMS Interestadual

        const icmsInter = v * inter;
        const valorLiquido = v - icmsInter;

        // Base majorada "por dentro" - usa APENAS alíquota interna
        const baseMajorada = valorLiquido / (1 - interna);

        const icmsInterno = baseMajorada * interna;
        const fcpValor = baseMajorada * fcp;
        const difal = icmsInterno - icmsInter;

        resultado = {
            metodologia: 'base_dupla',
            ufDestino,
            valorOperacao: v,
            aliquotaInterestadual: inter * 100,
            aliquotaInterna: interna * 100,
            aliquotaFCP: fcp * 100,
            icmsOrigem: icmsInter,
            valorLiquido: valorLiquido,
            baseMajorada: baseMajorada,
            icmsDestino: icmsInterno,
            fcp: fcpValor,
            difal: difal,
            totalDifal: difal + fcpValor
        };
    }

    // Arredondar para 2 casas decimais
    Object.keys(resultado).forEach(key => {
        if (typeof resultado[key] === 'number') {
            resultado[key] = Math.round(resultado[key] * 100) / 100;
        }
    });

    return resultado;
}

/**
 * Calcular Retenções na Fonte
 * 
 * @param {Object} params
 * @param {number} params.valorServico - Valor do serviço
 * @param {string} params.tipoServico - Código LC 116
 * @param {string} params.cpfCnpjPrestador - CPF/CNPJ do prestador
 * @returns {Object} Retenções calculadas
 */
export function calcularRetencoes(params) {
    const { valorServico, tipoServico, cpfCnpjPrestador } = params;

    const valor = parseFloat(String(valorServico).replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
        throw new Error('Valor do serviço inválido');
    }

    // Alíquotas padrão (%)
    const aliquotas = {
        pis: 0.65,
        cofins: 3.00,
        csll: 1.00,
        irrf: 1.50  // Simplificado - na prática depende da faixa
    };

    // Calcular retenções
    const retencoes = {
        valorServico: valor,
        tipoServico,
        pis: {
            aliquota: aliquotas.pis,
            valor: valor * (aliquotas.pis / 100),
            baseLegal: 'Lei 10.833/2003'
        },
        cofins: {
            aliquota: aliquotas.cofins,
            valor: valor * (aliquotas.cofins / 100),
            baseLegal: 'Lei 10.833/2003'
        },
        csll: {
            aliquota: aliquotas.csll,
            valor: valor * (aliquotas.csll / 100),
            baseLegal: 'Lei 10.833/2003'
        },
        irrf: {
            aliquota: aliquotas.irrf,
            valor: valor * (aliquotas.irrf / 100),
            baseLegal: 'IN RFB 1.234/2012'
        }
    };

    // Total retido
    retencoes.totalRetido =
        retencoes.pis.valor +
        retencoes.cofins.valor +
        retencoes.csll.valor +
        retencoes.irrf.valor;

    retencoes.valorLiquido = valor - retencoes.totalRetido;

    // Arredondar
    Object.keys(retencoes).forEach(key => {
        if (retencoes[key] && typeof retencoes[key] === 'object' && retencoes[key].valor) {
            retencoes[key].valor = Math.round(retencoes[key].valor * 100) / 100;
        }
    });

    retencoes.totalRetido = Math.round(retencoes.totalRetido * 100) / 100;
    retencoes.valorLiquido = Math.round(retencoes.valorLiquido * 100) / 100;

    return retencoes;
}

/**
 * Calcular ICMS-ST (Substituição Tributária)
 * @param {Object} params - Parâmetros do cálculo
 * @returns {Object} Resultado com todos os valores
 */
export function calcularST(params) {
    const {
        valorProduto,
        ipi = 0,
        frete = 0,
        seguro = 0,
        outrasDespesas = 0,
        desconto = 0,
        mva,
        aliqInterna,
        aliqInterestadual = 0
    } = params;

    // Converter para números
    const vProd = parseFloat(valorProduto);
    const vIPI = parseFloat(ipi);
    const vFrete = parseFloat(frete);
    const vSeguro = parseFloat(seguro);
    const vOutras = parseFloat(outrasDespesas);
    const vDesc = parseFloat(desconto);
    const percMVA = parseFloat(mva);
    const percAliqInt = parseFloat(aliqInterna);
    const percAliqInter = parseFloat(aliqInterestadual);

    // Validações
    if (isNaN(vProd) || vProd <= 0) {
        throw new Error('Valor do produto inválido');
    }
    if (isNaN(percMVA) || percMVA < 0) {
        throw new Error('MVA inválido');
    }
    if (isNaN(percAliqInt) || percAliqInt <= 0) {
        throw new Error('Alíquota interna inválida');
    }

    // 1. Base de cálculo da operação própria
    const baseCalculoOperacao = vProd + vIPI + vFrete + vSeguro + vOutras - vDesc;

    // 2. ICMS próprio (operação)
    const icmsProprio = (baseCalculoOperacao * percAliqInt) / 100;

    // 3. Base de cálculo ST = Base Operação × (1 + MVA/100)
    const baseCalculoST = baseCalculoOperacao * (1 + percMVA / 100);

    // 4. ICMS ST total = Base ST × Alíquota Interna
    const icmsSTTotal = (baseCalculoST * percAliqInt) / 100;

    // 5. ICMS ST a recolher = ICMS ST Total - ICMS Próprio
    const icmsST = icmsSTTotal - icmsProprio;

    // 6. Valor total com ST
    const valorTotalComST = baseCalculoOperacao + icmsST;

    return {
        // Valores base
        valorProduto: vProd,
        ipi: vIPI,
        frete: vFrete,
        seguro: vSeguro,
        outrasDespesas: vOutras,
        desconto: vDesc,

        // Parâmetros
        mva: percMVA,
        aliqInterna: percAliqInt,
        aliqInterestadual: percAliqInter,

        // Resultados
        baseCalculoOperacao: Math.round(baseCalculoOperacao * 100) / 100,
        icmsProprio: Math.round(icmsProprio * 100) / 100,
        baseCalculoST: Math.round(baseCalculoST * 100) / 100,
        icmsSTTotal: Math.round(icmsSTTotal * 100) / 100,
        icmsST: Math.round(icmsST * 100) / 100,
        valorTotalComST: Math.round(valorTotalComST * 100) / 100
    };
}

/**
 * Helper: Arredondar para 2 casas decimais
 */
export function arredondar(valor) {
    return Math.round(valor * 100) / 100;
}

/**
 * Helper: Formatar valor como moeda BRL
 */
export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}
