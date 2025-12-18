/**
 * Simples Nacional Engine with Hash and Memory of Calculation
 * Cálculo por anexo com memória auditável
 */

export function generateSimplesHash(inputs) {
    const { rbt12, receita, anexo, fatorR } = inputs;

    const inputString = [
        parseFloat(rbt12 || 0).toFixed(2),
        parseFloat(receita || 0).toFixed(2),
        anexo || 'I',
        parseFloat(fatorR || 0).toFixed(4)
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
    return `SIMPLES-${hash.padStart(12, '0')}`;
}

// Tabelas do Simples Nacional (LC 123/2006 - valores simplificados)
export const ANEXOS = {
    I: {
        nome: 'Anexo I - Comércio', faixas: [
            { ate: 180000, aliq: 4.00, deducao: 0 },
            { ate: 360000, aliq: 7.30, deducao: 5940 },
            { ate: 720000, aliq: 9.50, deducao: 13860 },
            { ate: 1800000, aliq: 10.70, deducao: 22500 },
            { ate: 3600000, aliq: 14.30, deducao: 87300 },
            { ate: 4800000, aliq: 19.00, deducao: 378000 }
        ]
    },
    II: {
        nome: 'Anexo II - Indústria', faixas: [
            { ate: 180000, aliq: 4.50, deducao: 0 },
            { ate: 360000, aliq: 7.80, deducao: 5940 },
            { ate: 720000, aliq: 10.00, deducao: 13860 },
            { ate: 1800000, aliq: 11.20, deducao: 22500 },
            { ate: 3600000, aliq: 14.70, deducao: 85500 },
            { ate: 4800000, aliq: 30.00, deducao: 720000 }
        ]
    },
    III: {
        nome: 'Anexo III - Serviços', faixas: [
            { ate: 180000, aliq: 6.00, deducao: 0 },
            { ate: 360000, aliq: 11.20, deducao: 9360 },
            { ate: 720000, aliq: 13.50, deducao: 17640 },
            { ate: 1800000, aliq: 16.00, deducao: 35640 },
            { ate: 3600000, aliq: 21.00, deducao: 125640 },
            { ate: 4800000, aliq: 33.00, deducao: 648000 }
        ]
    },
    IV: {
        nome: 'Anexo IV - Serviços', faixas: [
            { ate: 180000, aliq: 4.50, deducao: 0 },
            { ate: 360000, aliq: 9.00, deducao: 8100 },
            { ate: 720000, aliq: 10.20, deducao: 12420 },
            { ate: 1800000, aliq: 14.00, deducao: 39780 },
            { ate: 3600000, aliq: 22.00, deducao: 183780 },
            { ate: 4800000, aliq: 33.00, deducao: 828000 }
        ]
    },
    V: {
        nome: 'Anexo V - Serviços (Fator R)', faixas: [
            { ate: 180000, aliq: 15.50, deducao: 0 },
            { ate: 360000, aliq: 18.00, deducao: 4500 },
            { ate: 720000, aliq: 19.50, deducao: 9900 },
            { ate: 1800000, aliq: 20.50, deducao: 17100 },
            { ate: 3600000, aliq: 23.00, deducao: 62100 },
            { ate: 4800000, aliq: 30.50, deducao: 540000 }
        ]
    }
};

function getFaixa(rbt12, anexo) {
    const faixas = ANEXOS[anexo]?.faixas || ANEXOS.I.faixas;
    return faixas.find(f => rbt12 <= f.ate) || faixas[faixas.length - 1];
}

export function calculateSimplesWithMemory(inputs) {
    const rbt12 = parseFloat(inputs.rbt12) || 0;
    const receita = parseFloat(inputs.receita) || 0;
    const anexo = inputs.anexo || 'I';
    const fatorR = parseFloat(inputs.fatorR) || 0;

    const steps = [];

    // Step 1: Identificar anexo e faixa
    let anexoUsado = anexo;
    if (anexo === 'V' && fatorR >= 0.28) {
        anexoUsado = 'III'; // Fator R >= 28% migra para Anexo III
    }

    const faixa = getFaixa(rbt12, anexoUsado);
    steps.push({
        step: 1,
        description: 'Identificação do Anexo e Faixa',
        formula: `RBT12: R$ ${rbt12.toFixed(2)} → ${ANEXOS[anexoUsado].nome}`,
        result: `Faixa até R$ ${faixa.ate.toLocaleString('pt-BR')}`
    });

    // Step 2: Alíquota nominal
    steps.push({
        step: 2,
        description: 'Alíquota Nominal',
        formula: `Tabela ${anexoUsado}`,
        result: `${faixa.aliq}%`
    });

    // Step 3: Cálculo da alíquota efetiva
    const aliqEfetiva = ((rbt12 * (faixa.aliq / 100)) - faixa.deducao) / rbt12 * 100;
    steps.push({
        step: 3,
        description: 'Alíquota Efetiva',
        formula: `(R$ ${rbt12.toFixed(2)} × ${faixa.aliq}% - R$ ${faixa.deducao.toFixed(2)}) ÷ R$ ${rbt12.toFixed(2)}`,
        result: `${aliqEfetiva.toFixed(4)}%`
    });

    // Step 4: Valor do DAS
    const valorDAS = receita * (aliqEfetiva / 100);
    steps.push({
        step: 4,
        description: 'Valor do DAS',
        formula: `R$ ${receita.toFixed(2)} × ${aliqEfetiva.toFixed(4)}%`,
        result: `R$ ${valorDAS.toFixed(2)}`
    });

    return {
        inputs: { ...inputs, anexoUsado },
        resultado: {
            anexo: anexoUsado,
            anexoNome: ANEXOS[anexoUsado].nome,
            faixa,
            aliqNominal: faixa.aliq,
            deducao: faixa.deducao,
            aliqEfetiva,
            valorDAS: Math.max(0, valorDAS)
        },
        memory: steps,
        hash: generateSimplesHash(inputs),
        timestamp: new Date().toISOString(),
        baseLegal: 'LC 123/2006 • LC 155/2016'
    };
}

export function compareAnexos(inputs) {
    const resultados = {};
    ['I', 'II', 'III', 'IV', 'V'].forEach(anexo => {
        resultados[anexo] = calculateSimplesWithMemory({ ...inputs, anexo });
    });

    const menor = Object.entries(resultados)
        .sort((a, b) => a[1].resultado.valorDAS - b[1].resultado.valorDAS)[0];

    return {
        resultados,
        melhorOpcao: menor[0],
        menorValor: menor[1].resultado.valorDAS
    };
}
