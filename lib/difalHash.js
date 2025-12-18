/**
 * DIFAL Hash Generator
 * Creates deterministic hash for calculation verification
 */

export function generateDIFALHash(inputs) {
    const { valor, ufOrigem, ufDestino, aliqInter, aliqInterna, aliqFCP, metodologia } = inputs;

    // Create deterministic string from inputs
    const inputString = [
        parseFloat(valor || 0).toFixed(2),
        (ufOrigem || '').toUpperCase(),
        (ufDestino || '').toUpperCase(),
        parseFloat(aliqInter || 0).toFixed(2),
        parseFloat(aliqInterna || 0).toFixed(2),
        parseFloat(aliqFCP || 0).toFixed(2),
        metodologia || 'auto'
    ].join('|');

    // Simple hash function (cyrb53)
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < inputString.length; i++) {
        const ch = inputString.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const hash = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
    return `DIFAL-${hash.padStart(12, '0')}`;
}

/**
 * Calculate DIFAL with memory of calculation
 */
export function calculateDIFALWithMemory(inputs) {
    const valor = parseFloat(inputs.valor) || 0;
    const aliqInter = parseFloat(inputs.aliqInter) || 0;
    const aliqInterna = parseFloat(inputs.aliqInterna) || 0;
    const aliqFCP = parseFloat(inputs.aliqFCP) || 0;
    const metodologia = inputs.metodologia || 'base_dupla';

    const steps = [];
    let resultado = {};

    if (metodologia === 'base_unica') {
        // Base Única (Espírito Santo)
        const difalAliq = aliqInterna - aliqInter;
        const difal = valor * (difalAliq / 100);
        const fcp = valor * (aliqFCP / 100);

        steps.push({
            step: 1,
            description: 'Alíquota Diferencial',
            formula: `${aliqInterna}% - ${aliqInter}%`,
            result: `${difalAliq.toFixed(2)}%`
        });
        steps.push({
            step: 2,
            description: 'DIFAL (Base Única)',
            formula: `R$ ${valor.toFixed(2)} × ${difalAliq.toFixed(2)}%`,
            result: `R$ ${difal.toFixed(2)}`
        });
        if (aliqFCP > 0) {
            steps.push({
                step: 3,
                description: 'FCP',
                formula: `R$ ${valor.toFixed(2)} × ${aliqFCP}%`,
                result: `R$ ${fcp.toFixed(2)}`
            });
        }

        resultado = {
            metodologia: 'base_unica',
            baseCalculo: valor,
            difalAliquota: difalAliq,
            difal,
            fcp,
            totalDifal: difal + fcp,
            icmsOrigem: valor * (aliqInter / 100),
            icmsDestino: valor * (aliqInterna / 100)
        };
    } else {
        // Base Dupla (Padrão LC 190/2022)
        const baseMajorada = valor / (1 - aliqInterna / 100);
        const icmsDestino = baseMajorada * (aliqInterna / 100);
        const icmsOrigem = valor * (aliqInter / 100);
        const difal = icmsDestino - icmsOrigem;
        const fcp = baseMajorada * (aliqFCP / 100);

        steps.push({
            step: 1,
            description: 'Base Majorada (por dentro)',
            formula: `R$ ${valor.toFixed(2)} ÷ (1 - ${aliqInterna}%)`,
            result: `R$ ${baseMajorada.toFixed(2)}`
        });
        steps.push({
            step: 2,
            description: 'ICMS Destino',
            formula: `R$ ${baseMajorada.toFixed(2)} × ${aliqInterna}%`,
            result: `R$ ${icmsDestino.toFixed(2)}`
        });
        steps.push({
            step: 3,
            description: 'ICMS Origem (crédito)',
            formula: `R$ ${valor.toFixed(2)} × ${aliqInter}%`,
            result: `R$ ${icmsOrigem.toFixed(2)}`
        });
        steps.push({
            step: 4,
            description: 'DIFAL',
            formula: `R$ ${icmsDestino.toFixed(2)} - R$ ${icmsOrigem.toFixed(2)}`,
            result: `R$ ${difal.toFixed(2)}`
        });
        if (aliqFCP > 0) {
            steps.push({
                step: 5,
                description: 'FCP',
                formula: `R$ ${baseMajorada.toFixed(2)} × ${aliqFCP}%`,
                result: `R$ ${fcp.toFixed(2)}`
            });
        }

        resultado = {
            metodologia: 'base_dupla',
            baseCalculo: valor,
            baseMajorada,
            difalAliquota: aliqInterna - aliqInter,
            icmsDestino,
            icmsOrigem,
            difal,
            fcp,
            totalDifal: difal + fcp
        };
    }

    const hash = generateDIFALHash(inputs);

    return {
        inputs,
        resultado,
        memory: steps,
        hash,
        timestamp: new Date().toISOString()
    };
}

/**
 * Compare Base Única vs Base Dupla
 */
export function compareDIFALMethods(inputs) {
    const baseUnica = calculateDIFALWithMemory({ ...inputs, metodologia: 'base_unica' });
    const baseDupla = calculateDIFALWithMemory({ ...inputs, metodologia: 'base_dupla' });

    const diferenca = baseDupla.resultado.totalDifal - baseUnica.resultado.totalDifal;

    return {
        baseUnica,
        baseDupla,
        diferenca,
        diferencaPercentual: ((diferenca / baseUnica.resultado.totalDifal) * 100).toFixed(2)
    };
}
