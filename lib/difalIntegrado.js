/**
 * Módulo DIFAL Integrado com NFe
 * Extração automática de dados do XML para cálculo
 */

import { parseStringPromise } from 'xml2js';
import { calcularDIFAL } from './fiscal';

/**
 * Extrair dados relevantes para DIFAL do XML da NFe
 */
export async function extrairDadosDIFAL(xmlString) {
    try {
        const xmlObj = await parseStringPromise(xmlString);

        // Navegar na estrutura do XML
        const nfe = xmlObj.nfeProc?.NFe?.[0] || xmlObj.NFe?.[0];
        if (!nfe) {
            throw new Error('XML não é uma NFe válida');
        }

        const infNFe = nfe.infNFe?.[0];
        if (!infNFe) {
            throw new Error('Estrutura NFe inválida');
        }

        // Dados do emitente
        const emit = infNFe.emit?.[0];
        const ufOrigem = emit?.enderEmit?.[0]?.UF?.[0];

        // Dados do destinatário
        const dest = infNFe.dest?.[0];
        const ufDestino = dest?.enderDest?.[0]?.UF?.[0];

        // Totais
        const total = infNFe.total?.[0]?.ICMSTot?.[0];
        const valorNF = parseFloat(total?.vNF?.[0] || 0);
        const valorProdutos = parseFloat(total?.vProd?.[0] || 0);

        // Extrair itens
        const itens = await extractItemsFromXML(infNFe);

        // ICMS
        const icms = infNFe.det?.[0]?.imposto?.[0]?.ICMS?.[0];
        const icmsData = icms ? Object.values(icms)[0] : null;

        // Tentar extrair alíquotas
        const aliqICMS = icmsData?.pICMS?.[0] ? parseFloat(icmsData.pICMS[0]) : null;

        // Chave de acesso
        const chaveAcesso = infNFe.$.Id?.replace('NFe', '');

        return {
            sucesso: true,
            chaveAcesso,
            ufOrigem,
            ufDestino,
            valorOperacao: valorNF,
            valorProdutos,
            aliqICMS,
            itens, // Lista de itens para seleção
            emitente: {
                cnpj: emit?.CNPJ?.[0] || emit?.CPF?.[0],
                nome: emit?.xNome?.[0],
                uf: ufOrigem
            },
            destinatario: {
                cnpj: dest?.CNPJ?.[0] || dest?.CPF?.[0],
                nome: dest?.xNome?.[0],
                uf: ufDestino
            }
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: `Erro ao processar XML: ${error.message}`
        };
    }
}

/**
 * Extrair itens individuais do XML
 */
async function extractItemsFromXML(infNFe) {
    const itens = [];
    const detalhes = infNFe.det || [];

    detalhes.forEach((det, index) => {
        const prod = det.prod?.[0];
        const imposto = det.imposto?.[0];
        const icms = imposto?.ICMS?.[0];
        const icmsData = icms ? Object.values(icms)[0] : null;

        itens.push({
            numero: index + 1,
            codigo: prod?.cProd?.[0] || '',
            descricao: prod?.xProd?.[0] || '',
            ncm: prod?.NCM?.[0] || '',
            cfop: prod?.CFOP?.[0] || '',
            quantidade: parseFloat(prod?.qCom?.[0] || 0),
            valorUnitario: parseFloat(prod?.vUnCom?.[0] || 0),
            valorTotal: parseFloat(prod?.vProd?.[0] || 0),
            aliqICMS: icmsData?.pICMS?.[0] ? parseFloat(icmsData.pICMS[0]) : 0,
            // Identificar se é uso/consumo ou ativo
            finalidade: identificarFinalidade(prod?.CFOP?.[0])
        });
    });

    return itens;
}

/**
 * Identificar finalidade do item baseado no CFOP
 */
function identificarFinalidade(cfop) {
    if (!cfop) return 'revenda';

    const cfopNum = parseInt(cfop);

    // CFOPs de uso/consumo: x556, x407
    if ([1556, 2556, 3556, 1407, 2407, 3407].includes(cfopNum)) {
        return 'uso_consumo';
    }

    // CFOPs de ativo imobilizado: x551, x406
    if ([1551, 2551, 3551, 1406, 2406, 3406].includes(cfopNum)) {
        return 'ativo_imobilizado';
    }

    return 'revenda';
}

/**
 * Processar múltiplos XMLs em lote
 */
export async function processarLoteXML(xmlArray) {
    const resultados = [];

    for (const xml of xmlArray) {
        try {
            const dados = await extrairDadosDIFAL(xml);

            if (dados.sucesso) {
                // Calcular DIFAL automaticamente se possível
                if (dados.ufOrigem && dados.ufDestino && dados.valorOperacao) {
                    // Aqui você pode adicionar lógica para determinar alíquotas automaticamente
                    // por enquanto, apenas extraímos os dados
                    resultados.push({
                        ...dados,
                        status: 'processado'
                    });
                } else {
                    resultados.push({
                        ...dados,
                        status: 'dados_incompletos',
                        aviso: 'Alguns dados não foram encontrados no XML'
                    });
                }
            } else {
                resultados.push({
                    status: 'erro',
                    erro: dados.erro
                });
            }
        } catch (error) {
            resultados.push({
                status: 'erro',
                erro: error.message
            });
        }
    }

    return {
        total: xmlArray.length,
        processados: resultados.filter(r => r.status === 'processado').length,
        erros: resultados.filter(r => r.status === 'erro').length,
        resultados
    };
}

/**
 * Gerar dados para GNRE
 */
export function gerarDadosGNRE(calculoDIFAL, dadosNFe) {
    return {
        codigoReceita: '10008-7', // DIFAL - Consumidor Final
        ufFavorecida: dadosNFe.ufDestino,
        documentoOrigem: dadosNFe.chaveAcesso,
        valorPrincipal: calculoDIFAL.difal,
        valorTotal: calculoDIFAL.totalDifal,
        dataVencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 dias
        contribuinte: {
            cnpj: dadosNFe.emitente.cnpj,
            nome: dadosNFe.emitente.nome,
            uf: dadosNFe.emitente.uf
        },
        destinatario: {
            cnpj: dadosNFe.destinatario.cnpj,
            nome: dadosNFe.destinatario.nome,
            uf: dadosNFe.destinatario.uf
        }
    };
}

/**
 * Formatar dados para relatório consolidado
 */
export function gerarRelatorioConsolidado(calculos) {
    const totalDifal = calculos.reduce((sum, calc) => sum + (calc.difal || 0), 0);
    const totalFCP = calculos.reduce((sum, calc) => sum + (calc.fcp || 0), 0);
    const totalGeral = totalDifal + totalFCP;

    // Agrupar por UF destino
    const porUF = {};
    calculos.forEach(calc => {
        const uf = calc.ufDestino;
        if (!porUF[uf]) {
            porUF[uf] = {
                quantidade: 0,
                valorOperacoes: 0,
                difal: 0,
                fcp: 0,
                total: 0
            };
        }
        porUF[uf].quantidade++;
        porUF[uf].valorOperacoes += calc.valorOperacao || 0;
        porUF[uf].difal += calc.difal || 0;
        porUF[uf].fcp += calc.fcp || 0;
        porUF[uf].total += (calc.difal || 0) + (calc.fcp || 0);
    });

    return {
        periodo: new Date().toISOString().substring(0, 7),
        totalOperacoes: calculos.length,
        totalDifal,
        totalFCP,
        totalGeral,
        porUF,
        geradoEm: new Date().toISOString()
    };
}
