/**
 * Retenções na Fonte Engine with Hash and Memory of Calculation
 * IRRF, CSLL, PIS, COFINS, ISS, INSS com memória auditável
 */

export function generateRetencoesHash(inputs) {
    const { valor, tipoServico, tipoTomador } = inputs;

    const inputString = [
        parseFloat(valor || 0).toFixed(2),
        tipoServico || 'geral',
        tipoTomador || 'pj'
    ].join('|');

    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < inputString.length; i++) {
        const ch = inputString.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const hash = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
    return `RETENC-${hash.padStart(12, '0')}`;
}

// Alíquotas de retenção
export const ALIQUOTAS_RETENCAO = {
    irrf: { aliq: 1.5, minimo: 10.00, descricao: 'IRRF' },
    csll: { aliq: 1.0, minimo: 0, descricao: 'CSLL' },
    pis: { aliq: 0.65, minimo: 0, descricao: 'PIS' },
    cofins: { aliq: 3.0, minimo: 0, descricao: 'COFINS' },
    inss: { aliq: 11.0, teto: 908.85, descricao: 'INSS (11%)' },
    iss: { aliqMin: 2.0, aliqMax: 5.0, descricao: 'ISS' }
};

// Tipos de serviço e suas retenções aplicáveis
export const TIPOS_SERVICO = {
    consultoria: { irrf: true, csll: true, pis: true, cofins: true, inss: false, iss: true, issAliq: 5.0 },
    desenvolvimentoSoftware: { irrf: true, csll: true, pis: true, cofins: true, inss: false, iss: true, issAliq: 2.0 },
    limpeza: { irrf: true, csll: true, pis: true, cofins: true, inss: true, iss: true, issAliq: 5.0 },
    vigilancia: { irrf: true, csll: true, pis: true, cofins: true, inss: true, iss: true, issAliq: 5.0 },
    construcao: { irrf: true, csll: true, pis: true, cofins: true, inss: true, iss: true, issAliq: 3.0 },
    transporte: { irrf: true, csll: false, pis: false, cofins: false, inss: false, iss: false },
    geral: { irrf: true, csll: true, pis: true, cofins: true, inss: false, iss: true, issAliq: 5.0 }
};

export function calculateRetencoesWithMemory(inputs) {
    const valor = parseFloat(inputs.valor) || 0;
    const tipoServico = inputs.tipoServico || 'geral';
    const tipoTomador = inputs.tipoTomador || 'pj';
    const issAliq = parseFloat(inputs.issAliq) || TIPOS_SERVICO[tipoServico]?.issAliq || 5.0;

    const config = TIPOS_SERVICO[tipoServico] || TIPOS_SERVICO.geral;
    const steps = [];
    const retencoes = {};
    let totalRetencoes = 0;
    let stepNum = 1;

    // IRRF
    if (config.irrf && tipoTomador === 'pj') {
        const irrfBruto = valor * (ALIQUOTAS_RETENCAO.irrf.aliq / 100);
        const irrf = irrfBruto >= ALIQUOTAS_RETENCAO.irrf.minimo ? irrfBruto : 0;
        retencoes.irrf = irrf;
        totalRetencoes += irrf;
        steps.push({
            step: stepNum++,
            description: 'IRRF (1,5%)',
            formula: irrf > 0 ? `R$ ${valor.toFixed(2)} × 1,5%` : `Dispensado (< R$ 10,00)`,
            result: `R$ ${irrf.toFixed(2)}`
        });
    }

    // CSLL + PIS + COFINS (4,65%)
    if (config.csll && config.pis && config.cofins && tipoTomador === 'pj') {
        const csll = valor * (ALIQUOTAS_RETENCAO.csll.aliq / 100);
        const pis = valor * (ALIQUOTAS_RETENCAO.pis.aliq / 100);
        const cofins = valor * (ALIQUOTAS_RETENCAO.cofins.aliq / 100);
        const totalCSPCF = csll + pis + cofins;

        retencoes.csll = csll;
        retencoes.pis = pis;
        retencoes.cofins = cofins;
        totalRetencoes += totalCSPCF;

        steps.push({
            step: stepNum++,
            description: 'CSLL (1%) + PIS (0,65%) + COFINS (3%)',
            formula: `R$ ${valor.toFixed(2)} × 4,65%`,
            result: `R$ ${totalCSPCF.toFixed(2)}`
        });
    }

    // INSS
    if (config.inss) {
        const inssBruto = valor * (ALIQUOTAS_RETENCAO.inss.aliq / 100);
        const inss = Math.min(inssBruto, ALIQUOTAS_RETENCAO.inss.teto);
        retencoes.inss = inss;
        totalRetencoes += inss;
        steps.push({
            step: stepNum++,
            description: 'INSS (11%)',
            formula: inssBruto > ALIQUOTAS_RETENCAO.inss.teto
                ? `Limitado ao teto R$ ${ALIQUOTAS_RETENCAO.inss.teto.toFixed(2)}`
                : `R$ ${valor.toFixed(2)} × 11%`,
            result: `R$ ${inss.toFixed(2)}`
        });
    }

    // ISS
    if (config.iss) {
        const iss = valor * (issAliq / 100);
        retencoes.iss = iss;
        totalRetencoes += iss;
        steps.push({
            step: stepNum++,
            description: `ISS (${issAliq}%)`,
            formula: `R$ ${valor.toFixed(2)} × ${issAliq}%`,
            result: `R$ ${iss.toFixed(2)}`
        });
    }

    // Total
    const valorLiquido = valor - totalRetencoes;
    steps.push({
        step: stepNum,
        description: 'Total de Retenções',
        formula: Object.values(retencoes).map(v => `R$ ${v.toFixed(2)}`).join(' + '),
        result: `R$ ${totalRetencoes.toFixed(2)}`
    });

    return {
        inputs: { ...inputs, issAliq },
        resultado: {
            ...retencoes,
            totalRetencoes,
            valorBruto: valor,
            valorLiquido,
            percentualRetido: ((totalRetencoes / valor) * 100).toFixed(2)
        },
        memory: steps,
        hash: generateRetencoesHash(inputs),
        timestamp: new Date().toISOString(),
        baseLegal: 'IN RFB 1.234/2012 • Lei 10.833/2003'
    };
}
