/**
 * Módulo Simples Nacional Profissional - CORRIGIDO
 * Dados validados conforme LC 123/2006 e Resolução CGSN
 * Atualizado em: 2024
 */

/**
 * Tabelas do Simples Nacional - TODOS OS 5 ANEXOS
 * Fonte: Lei Complementar 123/2006 (atualizada)
 */
const TABELAS_SIMPLES = {
    'I': [ // Comércio
        { faixa: 1, ate: 180000, aliquota: 4.00, deducao: 0 },
        { faixa: 2, ate: 360000, aliquota: 7.30, deducao: 5940 },
        { faixa: 3, ate: 720000, aliquota: 9.50, deducao: 13860 },
        { faixa: 4, ate: 1800000, aliquota: 10.70, deducao: 22500 },
        { faixa: 5, ate: 3600000, aliquota: 14.30, deducao: 87300 },
        { faixa: 6, ate: 4800000, aliquota: 19.00, deducao: 378000 }
    ],
    'II': [ // Indústria
        { faixa: 1, ate: 180000, aliquota: 4.50, deducao: 0 },
        { faixa: 2, ate: 360000, aliquota: 7.80, deducao: 5940 },
        { faixa: 3, ate: 720000, aliquota: 10.00, deducao: 13860 },
        { faixa: 4, ate: 1800000, aliquota: 11.20, deducao: 22500 },
        { faixa: 5, ate: 3600000, aliquota: 14.70, deducao: 85500 },
        { faixa: 6, ate: 4800000, aliquota: 30.00, deducao: 720000 }
    ],
    'III': [ // Serviços (com Fator R >= 28%)
        { faixa: 1, ate: 180000, aliquota: 6.00, deducao: 0 },
        { faixa: 2, ate: 360000, aliquota: 11.20, deducao: 9360 },
        { faixa: 3, ate: 720000, aliquota: 13.50, deducao: 17640 },
        { faixa: 4, ate: 1800000, aliquota: 16.00, deducao: 35640 },
        { faixa: 5, ate: 3600000, aliquota: 21.00, deducao: 125640 },
        { faixa: 6, ate: 4800000, aliquota: 33.00, deducao: 648000 }
    ],
    'IV': [ // Serviços específicos (limpeza, vigilância, obras, advocacia)
        { faixa: 1, ate: 180000, aliquota: 4.50, deducao: 0 },
        { faixa: 2, ate: 360000, aliquota: 9.00, deducao: 8100 },
        { faixa: 3, ate: 720000, aliquota: 10.20, deducao: 12420 },
        { faixa: 4, ate: 1800000, aliquota: 14.00, deducao: 39780 },
        { faixa: 5, ate: 3600000, aliquota: 22.00, deducao: 183780 },
        { faixa: 6, ate: 4800000, aliquota: 33.00, deducao: 828000 }
    ],
    'V': [ // Serviços (com Fator R < 28%)
        { faixa: 1, ate: 180000, aliquota: 15.50, deducao: 0 },
        { faixa: 2, ate: 360000, aliquota: 18.00, deducao: 4500 },
        { faixa: 3, ate: 720000, aliquota: 19.50, deducao: 9900 },
        { faixa: 4, ate: 1800000, aliquota: 20.50, deducao: 17100 },
        { faixa: 5, ate: 3600000, aliquota: 23.00, deducao: 62100 },
        { faixa: 6, ate: 4800000, aliquota: 30.50, deducao: 540000 }
    ]
};

/**
 * Distribuição de tributos por anexo (%)
 * Fonte: Resolução CGSN
 */
const DISTRIBUICAO_TRIBUTOS = {
    'I': {
        IRPJ: 5.50,
        CSLL: 3.50,
        COFINS: 12.74,
        PIS: 2.76,
        CPP: 41.50,
        ICMS: 34.00
    },
    'II': {
        IRPJ: 5.50,
        CSLL: 3.50,
        COFINS: 11.51,
        PIS: 2.49,
        CPP: 37.50,
        ICMS: 32.00,
        IPI: 7.50
    },
    'III': {
        IRPJ: 4.00,
        CSLL: 3.50,
        COFINS: 12.82,
        PIS: 2.78,
        CPP: 43.40,
        ISS: 33.50
    },
    'IV': {
        IRPJ: 18.80,
        CSLL: 15.20,
        COFINS: 17.67,
        PIS: 3.83,
        ISS: 44.50
        // CPP não incluída - recolher separadamente
    },
    'V': {
        IRPJ: 25.00,
        CSLL: 15.00,
        COFINS: 14.10,
        PIS: 3.05,
        ISS: 40.00,
        CPP: 2.85
    }
};

/**
 * Calcular Fator R
 * Fator R = Folha de Pagamento (12 meses) / Receita Bruta (12 meses)
 */
export function calcularFatorR(folhaPagamento12Meses, receitaBruta12Meses) {
    if (!receitaBruta12Meses || receitaBruta12Meses === 0) {
        return 0;
    }

    const fatorR = (folhaPagamento12Meses / receitaBruta12Meses) * 100;

    return {
        fatorR: parseFloat(fatorR.toFixed(4)),
        anexoSugerido: fatorR >= 28 ? 'III' : 'V',
        folhaPagamento: folhaPagamento12Meses,
        receitaBruta: receitaBruta12Meses,
        percentual: fatorR
    };
}

/**
 * Determinar anexo automaticamente
 */
export function determinarAnexo(params) {
    const {
        tipoAtividade,
        folhaPagamento12Meses,
        receitaBruta12Meses
    } = params;

    // Anexo I - Comércio
    if (tipoAtividade === 'comercio') {
        return { anexo: 'I', motivo: 'Atividade de comércio' };
    }

    // Anexo II - Indústria
    if (tipoAtividade === 'industria') {
        return { anexo: 'II', motivo: 'Atividade industrial' };
    }

    // Anexo IV - Serviços específicos
    const servicosAnexoIV = [
        'limpeza', 'vigilancia', 'obras', 'construcao', 'advocacia'
    ];
    if (servicosAnexoIV.includes(tipoAtividade)) {
        return {
            anexo: 'IV',
            motivo: 'Serviço específico do Anexo IV',
            observacao: 'CPP deve ser recolhida separadamente'
        };
    }

    // Anexo III ou V - Depende do Fator R
    if (tipoAtividade === 'servicos') {
        if (folhaPagamento12Meses !== undefined && receitaBruta12Meses) {
            const fatorR = calcularFatorR(folhaPagamento12Meses, receitaBruta12Meses);
            return {
                anexo: fatorR.anexoSugerido,
                motivo: `Fator R = ${fatorR.percentual.toFixed(2)}%`,
                fatorR: fatorR.fatorR
            };
        }
        return {
            anexo: 'V',
            motivo: 'Fator R não informado - assumindo Anexo V',
            observacao: 'Calcule o Fator R para verificar se pode usar Anexo III'
        };
    }

    return { anexo: 'I', motivo: 'Padrão' };
}

/**
 * Calcular apuração do Simples Nacional - VALIDADO
 */
export function calcularApuracao(params) {
    const {
        receitaBruta12Meses,
        receitaMes,
        anexo,
        deducoes = 0,
        folhaPagamento12Meses
    } = params;

    // Validações
    if (!receitaBruta12Meses || !receitaMes) {
        throw new Error('Receita bruta é obrigatória');
    }

    if (!anexo) {
        throw new Error('Anexo é obrigatório');
    }

    const receita12 = parseFloat(receitaBruta12Meses);
    const receitaMensal = parseFloat(receitaMes);

    // Verificar limite
    if (receita12 > 4800000) {
        return {
            erro: 'Receita ultrapassou o limite do Simples Nacional (R$ 4.800.000,00)',
            excedente: receita12 - 4800000,
            desenquadramento: true
        };
    }

    // Validar Fator R para Anexos III e V
    let fatorRInfo = null;
    if ((anexo === 'III' || anexo === 'V') && folhaPagamento12Meses !== undefined) {
        fatorRInfo = calcularFatorR(folhaPagamento12Meses, receita12);

        // Alertar se anexo não corresponde ao Fator R
        if (anexo === 'III' && fatorRInfo.fatorR < 28) {
            fatorRInfo.alerta = 'Fator R < 28%. Deveria usar Anexo V';
        }
        if (anexo === 'V' && fatorRInfo.fatorR >= 28) {
            fatorRInfo.alerta = 'Fator R >= 28%. Pode usar Anexo III (alíquotas menores)';
        }
    }

    // Encontrar faixa
    const tabela = TABELAS_SIMPLES[anexo];
    if (!tabela) {
        throw new Error(`Anexo ${anexo} inválido`);
    }

    const faixa = tabela.find(f => receita12 <= f.ate) || tabela[tabela.length - 1];

    // Calcular alíquota efetiva
    const aliquotaEfetiva = ((receita12 * faixa.aliquota / 100) - faixa.deducao) / receita12 * 100;

    // Calcular valor devido no mês
    const baseCalculo = receitaMensal - deducoes;
    const valorDevido = (baseCalculo * aliquotaEfetiva) / 100;

    // Distribuir por tributo
    const distribuicao = DISTRIBUICAO_TRIBUTOS[anexo];
    const tributos = {};

    Object.keys(distribuicao).forEach(tributo => {
        tributos[tributo] = (valorDevido * distribuicao[tributo]) / 100;
    });

    // Observação sobre CPP no Anexo IV
    let observacoes = [];
    if (anexo === 'IV') {
        observacoes.push('CPP não incluída no DAS. Recolher separadamente conforme legislação.');
    }

    return {
        sucesso: true,
        anexo,
        faixa: faixa.faixa,
        limiteFaixa: faixa.ate,
        aliquotaNominal: faixa.aliquota,
        aliquotaEfetiva: parseFloat(aliquotaEfetiva.toFixed(4)),
        deducao: faixa.deducao,
        baseCalculo,
        valorDevido: parseFloat(valorDevido.toFixed(2)),
        tributos,
        receitaBruta12Meses: receita12,
        receitaMes: receitaMensal,
        percentualUtilizado: ((receita12 / 4800000) * 100).toFixed(2),
        fatorR: fatorRInfo,
        observacoes
    };
}

/**
 * Comparar com declaração anterior
 */
export function compararComAnterior(atual, anterior) {
    if (!anterior) {
        return { divergencias: [], alertas: [] };
    }

    const divergencias = [];
    const alertas = [];

    // Verificar consistência de receita acumulada
    const receitaEsperada = anterior.receitaBrutaAcumulada - anterior.receitaMesAnterior + atual.receitaMes;
    const diferenca = Math.abs(atual.receitaBruta12Meses - receitaEsperada);

    if (diferenca > 0.01) {
        divergencias.push({
            tipo: 'receita_acumulada',
            mensagem: `Receita acumulada divergente. Esperado: R$ ${receitaEsperada.toFixed(2)}, Informado: R$ ${atual.receitaBruta12Meses.toFixed(2)}`,
            diferenca
        });
    }

    // Verificar mudança de faixa
    if (atual.faixa !== anterior.faixa) {
        alertas.push({
            tipo: 'mudanca_faixa',
            mensagem: `Mudança de faixa: ${anterior.faixa} → ${atual.faixa}`,
            impacto: `Alíquota: ${anterior.aliquotaEfetiva}% → ${atual.aliquotaEfetiva}%`
        });
    }

    // Verificar crescimento anormal
    const crescimento = ((atual.receitaMes - anterior.receitaMesAnterior) / anterior.receitaMesAnterior) * 100;
    if (Math.abs(crescimento) > 50) {
        alertas.push({
            tipo: 'crescimento_anormal',
            mensagem: `Variação de ${crescimento.toFixed(2)}% em relação ao mês anterior`,
            valor: crescimento
        });
    }

    return { divergencias, alertas };
}

/**
 * Validar limites (estadual/municipal)
 */
export function validarLimites(receita12Meses, uf) {
    const sublimites = {
        'SP': 3600000,
        'RJ': 3600000,
        'MG': 3600000,
        'RS': 3600000,
        // Outros estados: 1800000
    };

    const sublimite = sublimites[uf] || 1800000;
    const percentual = (receita12Meses / sublimite) * 100;

    return {
        sublimite,
        receita: receita12Meses,
        percentualUtilizado: percentual.toFixed(2),
        dentroDoLimite: receita12Meses <= sublimite,
        excedente: receita12Meses > sublimite ? receita12Meses - sublimite : 0
    };
}

/**
 * Gerar relatório de apuração
 */
export function gerarRelatorio(apuracao) {
    const relatorio = {
        titulo: 'Relatório de Apuração - Simples Nacional',
        competencia: apuracao.competencia || new Date().toISOString().substring(0, 7),
        dados: apuracao,
        resumo: {
            receitaMes: apuracao.receitaMes,
            receita12Meses: apuracao.receitaBruta12Meses,
            anexo: apuracao.anexo,
            faixa: apuracao.faixa,
            aliquotaEfetiva: apuracao.aliquotaEfetiva,
            valorDevido: apuracao.valorDevido
        },
        tributos: apuracao.tributos,
        observacoes: apuracao.observacoes || [],
        geradoEm: new Date().toISOString()
    };

    return relatorio;
}

/**
 * Formatar para exportação
 */
export function formatarParaExportacao(apuracao, formato = 'json') {
    if (formato === 'json') {
        return JSON.stringify(apuracao, null, 2);
    }

    if (formato === 'csv') {
        let csv = 'Campo,Valor\n';
        csv += `Competência,${apuracao.competencia}\n`;
        csv += `Receita Mês,${apuracao.receitaMes}\n`;
        csv += `Receita 12 Meses,${apuracao.receitaBruta12Meses}\n`;
        csv += `Anexo,${apuracao.anexo}\n`;
        csv += `Faixa,${apuracao.faixa}\n`;
        csv += `Alíquota Efetiva,${apuracao.aliquotaEfetiva}%\n`;
        csv += `Valor Devido,${apuracao.valorDevido}\n`;

        // Adicionar tributos
        if (apuracao.tributos) {
            Object.keys(apuracao.tributos).forEach(tributo => {
                csv += `${tributo},${apuracao.tributos[tributo].toFixed(2)}\n`;
            });
        }

        return csv;
    }

    return apuracao;
}

/**
 * Obter descrição do anexo
 */
export function obterDescricaoAnexo(anexo) {
    const descricoes = {
        'I': 'Comércio',
        'II': 'Indústria',
        'III': 'Serviços (Fator R ≥ 28%)',
        'IV': 'Serviços específicos (limpeza, vigilância, obras, advocacia)',
        'V': 'Serviços (Fator R < 28%)'
    };

    return descricoes[anexo] || 'Desconhecido';
}
