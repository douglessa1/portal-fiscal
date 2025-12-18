/**
 * MEI DAS Engine with Hash and Memory
 * Cálculo do DAS do Microempreendedor Individual
 */

export function generateMEIDASHash(inputs) {
    const { atividade, competencia } = inputs;

    const inputString = [
        atividade || 'comercio',
        competencia || new Date().toISOString().slice(0, 7)
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
    return `MEIDAS-${hash.padStart(12, '0')}`;
}

// Valores DAS MEI 2024 (baseado no salário mínimo R$ 1.412,00)
export const VALORES_DAS = {
    inss: 70.60, // 5% do salário mínimo
    icms: 1.00,  // Comércio/Indústria
    iss: 5.00    // Serviços
};

export const ATIVIDADES = {
    comercio: { nome: 'Comércio', inss: 70.60, icms: 1.00, iss: 0, total: 71.60 },
    industria: { nome: 'Indústria', inss: 70.60, icms: 1.00, iss: 0, total: 71.60 },
    servicos: { nome: 'Serviços', inss: 70.60, icms: 0, iss: 5.00, total: 75.60 },
    misto: { nome: 'Comércio + Serviços', inss: 70.60, icms: 1.00, iss: 5.00, total: 76.60 }
};

export function calculateMEIDASWithMemory(inputs) {
    const atividade = inputs.atividade || 'comercio';
    const competencia = inputs.competencia || new Date().toISOString().slice(0, 7);
    const config = ATIVIDADES[atividade] || ATIVIDADES.comercio;

    const steps = [];

    // Step 1: INSS
    steps.push({
        step: 1,
        description: 'INSS (5% do Salário Mínimo)',
        formula: `R$ 1.412,00 × 5%`,
        result: `R$ ${config.inss.toFixed(2)}`
    });

    // Step 2: ICMS (se aplicável)
    if (config.icms > 0) {
        steps.push({
            step: 2,
            description: 'ICMS (Comércio/Indústria)',
            formula: `Valor fixo`,
            result: `R$ ${config.icms.toFixed(2)}`
        });
    }

    // Step 3: ISS (se aplicável)
    if (config.iss > 0) {
        steps.push({
            step: config.icms > 0 ? 3 : 2,
            description: 'ISS (Serviços)',
            formula: `Valor fixo`,
            result: `R$ ${config.iss.toFixed(2)}`
        });
    }

    // Step Total
    steps.push({
        step: steps.length + 1,
        description: 'Total DAS MEI',
        formula: `INSS + ICMS + ISS`,
        result: `R$ ${config.total.toFixed(2)}`
    });

    return {
        inputs: { atividade, competencia },
        resultado: {
            atividade: config.nome,
            inss: config.inss,
            icms: config.icms,
            iss: config.iss,
            total: config.total,
            competencia,
            vencimento: getVencimentoDAS(competencia)
        },
        memory: steps,
        hash: generateMEIDASHash(inputs),
        timestamp: new Date().toISOString(),
        baseLegal: 'LC 123/2006 • Res. CGSN 140/2018'
    };
}

function getVencimentoDAS(competencia) {
    const [ano, mes] = competencia.split('-').map(Number);
    const proxMes = mes === 12 ? 1 : mes + 1;
    const proxAno = mes === 12 ? ano + 1 : ano;
    return `20/${proxMes.toString().padStart(2, '0')}/${proxAno}`;
}
