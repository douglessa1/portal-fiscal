/**
 * Módulo de Validação de NFe
 * Validações de conformidade de XML NFe
 */

import { parseStringPromise } from 'xml2js';

/**
 * Validar XML NFe completo
 * 
 * @param {string} xmlString - Conteúdo do XML
 * @returns {Object} Resultado da validação com score e lista de erros
 */
export async function validarNFe(xmlString) {
    const resultados = {
        valido: true,
        score: 100,
        erros: [],
        avisos: [],
        informacoes: []
    };

    try {
        // 1. Validar estrutura XML
        const estruturaValida = await validarEstrutura(xmlString);
        if (!estruturaValida.valido) {
            resultados.erros.push(...estruturaValida.erros);
            resultados.score -= 30;
        }

        // 2. Parse do XML
        const xmlObj = await parseStringPromise(xmlString, { explicitArray: true });

        // 3. Validar campos obrigatórios
        const camposValidos = validarCamposObrigatorios(xmlObj);
        if (!camposValidos.valido) {
            resultados.erros.push(...camposValidos.erros);
            resultados.avisos.push(...camposValidos.avisos);
            resultados.score -= camposValidos.penalidade || 20;
        }

        // 4. Validar chave de acesso
        const chaveValida = validarChaveAcesso(xmlObj);
        if (!chaveValida.valido) {
            resultados.erros.push(...chaveValida.erros);
            resultados.score -= 15;
        }

        // 5. Validar totalizadores
        const totaisValidos = validarTotalizadores(xmlObj);
        if (!totaisValidos.valido) {
            resultados.avisos.push(...totaisValidos.avisos);
            resultados.score -= 10;
        }

        // 6. Validar datas
        const datasValidas = validarDatas(xmlObj);
        if (!datasValidas.valido) {
            resultados.avisos.push(...datasValidas.avisos);
            resultados.score -= 5;
        }

    } catch (error) {
        resultados.erros.push({
            tipo: 'ERRO_CRITICO',
            mensagem: 'Erro ao processar XML: ' + error.message,
            solucao: 'Verifique se o arquivo é um XML válido de NFe'
        });
        resultados.score = 0;
        resultados.valido = false;
    }

    // Score mínimo é 0
    resultados.score = Math.max(0, resultados.score);
    resultados.valido = resultados.score >= 70;

    return resultados;
}

/**
 * Validar estrutura básica do XML
 */
async function validarEstrutura(xmlString) {
    const resultado = { valido: true, erros: [] };

    // Verificar se é XML válido
    if (!xmlString || typeof xmlString !== 'string') {
        resultado.valido = false;
        resultado.erros.push({
            tipo: 'ESTRUTURA',
            mensagem: 'Conteúdo inválido ou vazio',
            solucao: 'Envie um arquivo XML válido'
        });
        return resultado;
    }

    // Verificar tags principais
    const tagsObrigatorias = ['nfeProc', 'NFe', 'infNFe'];
    const temTag = tagsObrigatorias.some(tag => xmlString.includes(`<${tag}`));

    if (!temTag) {
        resultado.valido = false;
        resultado.erros.push({
            tipo: 'ESTRUTURA',
            mensagem: 'XML não aparenta ser uma NFe válida',
            solucao: 'Verifique se o arquivo é realmente um XML de NFe'
        });
    }

    return resultado;
}

/**
 * Validar campos obrigatórios
 */
function validarCamposObrigatorios(xmlObj) {
    const resultado = { valido: true, erros: [], avisos: [], penalidade: 0 };

    try {
        const infNFe = xmlObj?.nfeProc?.NFe?.[0]?.infNFe?.[0] ||
            xmlObj?.NFe?.[0]?.infNFe?.[0] ||
            xmlObj?.infNFe?.[0];

        if (!infNFe) {
            resultado.valido = false;
            resultado.erros.push({
                tipo: 'CAMPO_OBRIGATORIO',
                mensagem: 'Nó infNFe não encontrado',
                solucao: 'XML parece estar corrompido ou incompleto'
            });
            resultado.penalidade = 50;
            return resultado;
        }

        // Validar emitente
        if (!infNFe.emit?.[0]?.CNPJ?.[0]) {
            resultado.avisos.push({
                tipo: 'CAMPO_OBRIGATORIO',
                mensagem: 'CNPJ do emitente não encontrado',
                solucao: 'Verifique o nó emit/CNPJ'
            });
            resultado.penalidade += 5;
        }

        // Validar destinatário
        if (!infNFe.dest?.[0]) {
            resultado.avisos.push({
                tipo: 'CAMPO_OBRIGATORIO',
                mensagem: 'Destinatário não encontrado',
                solucao: 'Verifique o nó dest'
            });
            resultado.penalidade += 5;
        }

        // Validar total
        if (!infNFe.total?.[0]?.ICMSTot?.[0]?.vNF?.[0]) {
            resultado.erros.push({
                tipo: 'CAMPO_OBRIGATORIO',
                mensagem: 'Valor total da nota não encontrado',
                solucao: 'Verifique o nó total/ICMSTot/vNF'
            });
            resultado.penalidade += 10;
            resultado.valido = false;
        }

    } catch (error) {
        resultado.valido = false;
        resultado.erros.push({
            tipo: 'ERRO_VALIDACAO',
            mensagem: 'Erro ao validar campos: ' + error.message
        });
    }

    return resultado;
}

/**
 * Validar chave de acesso
 */
function validarChaveAcesso(xmlObj) {
    const resultado = { valido: true, erros: [] };

    try {
        const infNFe = xmlObj?.nfeProc?.NFe?.[0]?.infNFe?.[0] || xmlObj?.NFe?.[0]?.infNFe?.[0];
        const chave = infNFe?.['$']?.Id?.replace(/^NFe/i, '');

        if (!chave) {
            resultado.valido = false;
            resultado.erros.push({
                tipo: 'CHAVE_ACESSO',
                mensagem: 'Chave de acesso não encontrada',
                solucao: 'Verifique o atributo Id do nó infNFe'
            });
            return resultado;
        }

        // Validar formato (44 dígitos)
        if (chave.length !== 44) {
            resultado.valido = false;
            resultado.erros.push({
                tipo: 'CHAVE_ACESSO',
                mensagem: `Chave de acesso inválida (${chave.length} dígitos, esperado 44)`,
                solucao: 'A chave deve ter exatamente 44 dígitos numéricos'
            });
        }

        // Validar se é numérico
        if (!/^\d+$/.test(chave)) {
            resultado.valido = false;
            resultado.erros.push({
                tipo: 'CHAVE_ACESSO',
                mensagem: 'Chave de acesso contém caracteres não numéricos',
                solucao: 'A chave deve conter apenas números'
            });
        }

    } catch (error) {
        resultado.valido = false;
        resultado.erros.push({
            tipo: 'ERRO_VALIDACAO',
            mensagem: 'Erro ao validar chave: ' + error.message
        });
    }

    return resultado;
}

/**
 * Validar totalizadores
 */
function validarTotalizadores(xmlObj) {
    const resultado = { valido: true, avisos: [] };

    try {
        const infNFe = xmlObj?.nfeProc?.NFe?.[0]?.infNFe?.[0] || xmlObj?.NFe?.[0]?.infNFe?.[0];
        const total = infNFe?.total?.[0]?.ICMSTot?.[0];

        if (!total) {
            return resultado;
        }

        const vNF = parseFloat(total.vNF?.[0] || 0);
        const vProd = parseFloat(total.vProd?.[0] || 0);
        const vDesc = parseFloat(total.vDesc?.[0] || 0);
        const vOutro = parseFloat(total.vOutro?.[0] || 0);
        const vFrete = parseFloat(total.vFrete?.[0] || 0);
        const vSeg = parseFloat(total.vSeg?.[0] || 0);
        const vIPI = parseFloat(total.vIPI?.[0] || 0);

        // Calcular total esperado
        const totalEsperado = vProd - vDesc + vOutro + vFrete + vSeg + vIPI;
        const diferenca = Math.abs(vNF - totalEsperado);

        if (diferenca > 0.02) {
            resultado.avisos.push({
                tipo: 'TOTALIZAÇÃO',
                mensagem: `Possível divergência nos totalizadores (diferença: R$ ${diferenca.toFixed(2)})`,
                solucao: 'Verifique se os valores dos totalizadores estão corretos'
            });
        }

    } catch (error) {
        // Não é crítico
    }

    return resultado;
}

/**
 * Validar datas
 */
function validarDatas(xmlObj) {
    const resultado = { valido: true, avisos: [] };

    try {
        const infNFe = xmlObj?.nfeProc?.NFe?.[0]?.infNFe?.[0] || xmlObj?.NFe?.[0]?.infNFe?.[0];
        const dhEmi = infNFe?.ide?.[0]?.dhEmi?.[0];

        if (dhEmi) {
            const dataEmissao = new Date(dhEmi);
            const hoje = new Date();

            // Verificar se a data de emissão é futura
            if (dataEmissao > hoje) {
                resultado.avisos.push({
                    tipo: 'DATA',
                    mensagem: 'Data de emissão está no futuro',
                    solucao: 'Verifique a data de emissão da nota'
                });
            }

            // Verificar se a nota é muito antiga (mais de 5 anos)
            const cincoAnosAtras = new Date();
            cincoAnosAtras.setFullYear(cincoAnosAtras.getFullYear() - 5);

            if (dataEmissao < cincoAnosAtras) {
                resultado.avisos.push({
                    tipo: 'DATA',
                    mensagem: 'Nota fiscal com mais de 5 anos',
                    solucao: 'Verifique se a data está correta'
                });
            }
        }

    } catch (error) {
        // Não é crítico
    }

    return resultado;
}

/**
 * Calcular score de conformidade
 */
export function calcularScore(resultados) {
    return Math.max(0, Math.min(100, resultados.score));
}
