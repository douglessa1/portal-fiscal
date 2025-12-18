/**
 * Split Payment Engine with Hash and Memory
 * Simulador do novo sistema de pagamento dividido
 */

export function generateSplitPaymentHash(inputs) {
    const { valorOperacao, aliqIBS, aliqCBS } = inputs;

    const inputString = [
        parseFloat(valorOperacao || 0).toFixed(2),
        parseFloat(aliqIBS || 0).toFixed(2),
        parseFloat(aliqCBS || 0).toFixed(2)
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
    return `SPLIT-${hash.padStart(12, '0')}`;
}

// Alíquotas do Split Payment (após transição completa)
export const ALIQUOTAS_SPLIT = {
    CBS: 8.8,
    IBS_ESTADUAL: 11.4,
    IBS_MUNICIPAL: 6.3,
    IBS_TOTAL: 17.7,
    TOTAL: 26.5
};

export function calculateSplitPaymentWithMemory(inputs) {
    const valorOperacao = parseFloat(inputs.valorOperacao) || 0;
    const aliqCBS = parseFloat(inputs.aliqCBS) || ALIQUOTAS_SPLIT.CBS;
    const aliqIBS = parseFloat(inputs.aliqIBS) || ALIQUOTAS_SPLIT.IBS_TOTAL;

    const steps = [];

    // Step 1: Valor da Operação
    steps.push({
        step: 1,
        description: 'Valor da Operação',
        formula: 'Valor total da NF-e',
        result: `R$ ${valorOperacao.toFixed(2)}`
    });

    // Step 2: CBS (Federal)
    const valorCBS = valorOperacao * (aliqCBS / 100);
    steps.push({
        step: 2,
        description: 'CBS - Recolhido automaticamente',
        formula: `R$ ${valorOperacao.toFixed(2)} × ${aliqCBS}%`,
        result: `R$ ${valorCBS.toFixed(2)}`
    });

    // Step 3: IBS (Estadual + Municipal)
    const valorIBS = valorOperacao * (aliqIBS / 100);
    steps.push({
        step: 3,
        description: 'IBS - Recolhido automaticamente',
        formula: `R$ ${valorOperacao.toFixed(2)} × ${aliqIBS}%`,
        result: `R$ ${valorIBS.toFixed(2)}`
    });

    // Step 4: Total do Split
    const totalSplit = valorCBS + valorIBS;
    steps.push({
        step: 4,
        description: 'Total Split Payment',
        formula: `R$ ${valorCBS.toFixed(2)} + R$ ${valorIBS.toFixed(2)}`,
        result: `R$ ${totalSplit.toFixed(2)}`
    });

    // Step 5: Valor Líquido Recebido
    const valorLiquido = valorOperacao - totalSplit;
    steps.push({
        step: 5,
        description: 'Valor Recebido pelo Fornecedor',
        formula: `R$ ${valorOperacao.toFixed(2)} - R$ ${totalSplit.toFixed(2)}`,
        result: `R$ ${valorLiquido.toFixed(2)}`
    });

    return {
        inputs: { ...inputs, aliqCBS, aliqIBS },
        resultado: {
            valorOperacao,
            valorCBS,
            valorIBS,
            totalSplit,
            valorLiquido,
            percentualRetido: ((totalSplit / valorOperacao) * 100).toFixed(2)
        },
        memory: steps,
        hash: generateSplitPaymentHash(inputs),
        timestamp: new Date().toISOString(),
        baseLegal: 'EC 132/2023 • LC (pendente) • Vigência: 2026+'
    };
}

export function compareFluxoCaixa(inputs) {
    const valorOperacao = parseFloat(inputs.valorOperacao) || 0;

    // Sistema atual (sem split)
    const sistemaAtual = {
        recebido: valorOperacao,
        tributosDevidos: valorOperacao * 0.2755, // ICMS 18% + PIS/COFINS 9.25% simplificado
        caixa: valorOperacao,
        observacao: 'Tributos pagos posteriormente via guias'
    };

    // Com Split Payment
    const splitResult = calculateSplitPaymentWithMemory(inputs);
    const comSplit = {
        recebido: splitResult.resultado.valorLiquido,
        tributosDevidos: 0,
        caixa: splitResult.resultado.valorLiquido,
        observacao: 'Tributos retidos na fonte'
    };

    return {
        atual: sistemaAtual,
        split: comSplit,
        diferencaCaixa: comSplit.caixa - sistemaAtual.caixa,
        impactoFinanceiro: (((comSplit.caixa - sistemaAtual.caixa) / sistemaAtual.caixa) * 100).toFixed(2)
    };
}
