/**
 * Módulo de Geração de DANFE
 * Gera Documento Auxiliar da Nota Fiscal Eletrônica em PDF
 */

import { parseStringPromise } from 'xml2js';

/**
 * Extrair dados essenciais da NFe do XML
 */
export async function extrairDadosNFe(xmlString) {
    try {
        const xmlObj = await parseStringPromise(xmlString, { explicitArray: true });

        // Navegar pela estrutura do XML
        const nfeProc = xmlObj.nfeProc || xmlObj;
        const nfe = nfeProc.NFe?.[0] || xmlObj.NFe?.[0];
        const infNFe = nfe?.infNFe?.[0];

        if (!infNFe) {
            throw new Error('Estrutura de NFe inválida');
        }

        // Chave de acesso
        const chave = infNFe.$?.Id?.replace(/^NFe/i, '') || '';

        // Identificação
        const ide = infNFe.ide?.[0] || {};

        // Emitente
        const emit = infNFe.emit?.[0] || {};
        const emitEnder = emit.enderEmit?.[0] || {};

        // Destinatário
        const dest = infNFe.dest?.[0] || {};
        const destEnder = dest.enderDest?.[0] || {};

        // Produtos
        const produtos = (infNFe.det || []).map(det => {
            const prod = det.prod?.[0] || {};
            const imposto = det.imposto?.[0] || {};
            const icms = imposto.ICMS?.[0] || {};

            return {
                codigo: prod.cProd?.[0] || '',
                descricao: prod.xProd?.[0] || '',
                ncm: prod.NCM?.[0] || '',
                cfop: prod.CFOP?.[0] || '',
                unidade: prod.uCom?.[0] || '',
                quantidade: parseFloat(prod.qCom?.[0] || 0),
                valorUnitario: parseFloat(prod.vUnCom?.[0] || 0),
                valorTotal: parseFloat(prod.vProd?.[0] || 0),
                icms: Object.values(icms)[0]?.[0] || {}
            };
        });

        // Totais
        const total = infNFe.total?.[0]?.ICMSTot?.[0] || {};

        return {
            chave,
            numero: ide.nNF?.[0] || '',
            serie: ide.serie?.[0] || '',
            dataEmissao: ide.dhEmi?.[0] || ide.dEmi?.[0] || '',
            naturezaOperacao: ide.natOp?.[0] || '',

            emitente: {
                cnpj: emit.CNPJ?.[0] || '',
                nome: emit.xNome?.[0] || emit.xFant?.[0] || '',
                fantasia: emit.xFant?.[0] || '',
                endereco: `${emitEnder.xLgr?.[0] || ''}, ${emitEnder.nro?.[0] || ''}`,
                bairro: emitEnder.xBairro?.[0] || '',
                cidade: emitEnder.xMun?.[0] || '',
                uf: emitEnder.UF?.[0] || '',
                cep: emitEnder.CEP?.[0] || '',
                telefone: emit.enderEmit?.[0]?.fone?.[0] || ''
            },

            destinatario: {
                cpfCnpj: dest.CNPJ?.[0] || dest.CPF?.[0] || '',
                nome: dest.xNome?.[0] || '',
                endereco: `${destEnder.xLgr?.[0] || ''}, ${destEnder.nro?.[0] || ''}`,
                bairro: destEnder.xBairro?.[0] || '',
                cidade: destEnder.xMun?.[0] || '',
                uf: destEnder.UF?.[0] || '',
                cep: destEnder.CEP?.[0] || ''
            },

            produtos,

            totais: {
                baseICMS: parseFloat(total.vBC?.[0] || 0),
                valorICMS: parseFloat(total.vICMS?.[0] || 0),
                baseICMSST: parseFloat(total.vBCST?.[0] || 0),
                valorICMSST: parseFloat(total.vST?.[0] || 0),
                valorProdutos: parseFloat(total.vProd?.[0] || 0),
                valorFrete: parseFloat(total.vFrete?.[0] || 0),
                valorSeguro: parseFloat(total.vSeg?.[0] || 0),
                valorDesconto: parseFloat(total.vDesc?.[0] || 0),
                valorIPI: parseFloat(total.vIPI?.[0] || 0),
                valorTotal: parseFloat(total.vNF?.[0] || 0),
                // Reforma Tributária
                valorIBS: parseFloat(total.vIBS?.[0] || 0),
                valorCBS: parseFloat(total.vCBS?.[0] || 0),
                valorIS: parseFloat(total.vIS?.[0] || 0)
            }
        };
    } catch (error) {
        throw new Error(`Erro ao extrair dados da NFe: ${error.message}`);
    }
}

/**
 * Formatar chave de acesso (44 dígitos em blocos de 4)
 */
export function formatarChaveAcesso(chave) {
    if (!chave || chave.length !== 44) return chave;
    return chave.match(/.{1,4}/g)?.join(' ') || chave;
}

/**
 * Formatar CNPJ/CPF
 */
export function formatarCpfCnpj(valor) {
    if (!valor) return '';
    const numeros = valor.replace(/\D/g, '');

    if (numeros.length === 11) {
        // CPF: 000.000.000-00
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numeros.length === 14) {
        // CNPJ: 00.000.000/0000-00
        return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return valor;
}

/**
 * Formatar CEP
 */
export function formatarCEP(cep) {
    if (!cep) return '';
    const numeros = cep.replace(/\D/g, '');
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formatar data
 */
export function formatarData(dataISO) {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
}

/**
 * Gerar DANFE em PDF (será implementado com jsPDF)
 * Por enquanto retorna dados estruturados
 */
export async function gerarDANFE(xmlString) {
    const dados = await extrairDadosNFe(xmlString);

    // Esta função será expandida quando jsPDF estiver instalado
    return {
        success: true,
        dados,
        message: 'Dados extraídos com sucesso. PDF será gerado após instalação do jsPDF.'
    };
}

/**
 * Gerar múltiplos DANFEs (lote)
 */
export async function gerarDANFELote(xmlArray) {
    const resultados = [];

    for (let i = 0; i < xmlArray.length; i++) {
        try {
            const resultado = await gerarDANFE(xmlArray[i]);
            resultados.push({
                index: i,
                success: true,
                ...resultado
            });
        } catch (error) {
            resultados.push({
                index: i,
                success: false,
                error: error.message
            });
        }
    }

    return resultados;
}
