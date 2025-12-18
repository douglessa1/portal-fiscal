/**
 * XML Parser for NF-e
 * Parses NF-e XML and extracts all relevant data
 */

export function parseNFeXML(xmlString) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'text/xml');

        // Check for parse errors
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
            throw new Error('XML inválido');
        }

        // Find the NFe node (handle namespace)
        const nfe = doc.querySelector('NFe, nfeProc NFe');
        if (!nfe) throw new Error('Não foi possível encontrar a tag NFe');

        const infNFe = nfe.querySelector('infNFe');
        if (!infNFe) throw new Error('Não foi possível encontrar infNFe');

        const getText = (parent, selector) => {
            const el = parent.querySelector(selector);
            return el ? el.textContent : '';
        };

        // IDE - Identificação da NF-e
        const ide = infNFe.querySelector('ide');
        const identificacao = {
            cUF: getText(ide, 'cUF'),
            cNF: getText(ide, 'cNF'),
            natOp: getText(ide, 'natOp'),
            mod: getText(ide, 'mod'),
            serie: getText(ide, 'serie'),
            nNF: getText(ide, 'nNF'),
            dhEmi: getText(ide, 'dhEmi'),
            dhSaiEnt: getText(ide, 'dhSaiEnt'),
            tpNF: getText(ide, 'tpNF'), // 0=entrada, 1=saída
            idDest: getText(ide, 'idDest'),
            cMunFG: getText(ide, 'cMunFG'),
            tpImp: getText(ide, 'tpImp'),
            tpEmis: getText(ide, 'tpEmis'),
            cDV: getText(ide, 'cDV'),
            tpAmb: getText(ide, 'tpAmb'), // 1=produção, 2=homologação
            finNFe: getText(ide, 'finNFe'),
            indFinal: getText(ide, 'indFinal'),
            indPres: getText(ide, 'indPres')
        };

        // Emitente
        const emit = infNFe.querySelector('emit');
        const emitente = {
            CNPJ: getText(emit, 'CNPJ'),
            CPF: getText(emit, 'CPF'),
            xNome: getText(emit, 'xNome'),
            xFant: getText(emit, 'xFant'),
            IE: getText(emit, 'IE'),
            IEST: getText(emit, 'IEST'),
            IM: getText(emit, 'IM'),
            CNAE: getText(emit, 'CNAE'),
            CRT: getText(emit, 'CRT'),
            enderEmit: {
                xLgr: getText(emit, 'enderEmit xLgr'),
                nro: getText(emit, 'enderEmit nro'),
                xCpl: getText(emit, 'enderEmit xCpl'),
                xBairro: getText(emit, 'enderEmit xBairro'),
                cMun: getText(emit, 'enderEmit cMun'),
                xMun: getText(emit, 'enderEmit xMun'),
                UF: getText(emit, 'enderEmit UF'),
                CEP: getText(emit, 'enderEmit CEP'),
                cPais: getText(emit, 'enderEmit cPais'),
                xPais: getText(emit, 'enderEmit xPais'),
                fone: getText(emit, 'enderEmit fone')
            }
        };

        // Destinatário
        const dest = infNFe.querySelector('dest');
        const destinatario = dest ? {
            CNPJ: getText(dest, 'CNPJ'),
            CPF: getText(dest, 'CPF'),
            xNome: getText(dest, 'xNome'),
            indIEDest: getText(dest, 'indIEDest'),
            IE: getText(dest, 'IE'),
            ISUF: getText(dest, 'ISUF'),
            IM: getText(dest, 'IM'),
            email: getText(dest, 'email'),
            enderDest: {
                xLgr: getText(dest, 'enderDest xLgr'),
                nro: getText(dest, 'enderDest nro'),
                xCpl: getText(dest, 'enderDest xCpl'),
                xBairro: getText(dest, 'enderDest xBairro'),
                cMun: getText(dest, 'enderDest cMun'),
                xMun: getText(dest, 'enderDest xMun'),
                UF: getText(dest, 'enderDest UF'),
                CEP: getText(dest, 'enderDest CEP'),
                cPais: getText(dest, 'enderDest cPais'),
                xPais: getText(dest, 'enderDest xPais'),
                fone: getText(dest, 'enderDest fone')
            }
        } : null;

        // Produtos
        const detElements = infNFe.querySelectorAll('det');
        const produtos = Array.from(detElements).map(det => {
            const prod = det.querySelector('prod');
            const imposto = det.querySelector('imposto');
            return {
                nItem: det.getAttribute('nItem'),
                cProd: getText(prod, 'cProd'),
                cEAN: getText(prod, 'cEAN'),
                xProd: getText(prod, 'xProd'),
                NCM: getText(prod, 'NCM'),
                CEST: getText(prod, 'CEST'),
                CFOP: getText(prod, 'CFOP'),
                uCom: getText(prod, 'uCom'),
                qCom: parseFloat(getText(prod, 'qCom')) || 0,
                vUnCom: parseFloat(getText(prod, 'vUnCom')) || 0,
                vProd: parseFloat(getText(prod, 'vProd')) || 0,
                cEANTrib: getText(prod, 'cEANTrib'),
                uTrib: getText(prod, 'uTrib'),
                qTrib: parseFloat(getText(prod, 'qTrib')) || 0,
                vUnTrib: parseFloat(getText(prod, 'vUnTrib')) || 0,
                vFrete: parseFloat(getText(prod, 'vFrete')) || 0,
                vSeg: parseFloat(getText(prod, 'vSeg')) || 0,
                vDesc: parseFloat(getText(prod, 'vDesc')) || 0,
                vOutro: parseFloat(getText(prod, 'vOutro')) || 0,
                indTot: getText(prod, 'indTot'),
                // Impostos
                icms: {
                    orig: getText(imposto, 'ICMS orig') || getText(imposto, 'ICMSSN orig'),
                    CST: getText(imposto, 'ICMS CST') || getText(imposto, 'ICMSSN CSOSN'),
                    vBC: parseFloat(getText(imposto, 'ICMS vBC')) || 0,
                    pICMS: parseFloat(getText(imposto, 'ICMS pICMS')) || 0,
                    vICMS: parseFloat(getText(imposto, 'ICMS vICMS')) || 0
                },
                ipi: {
                    CST: getText(imposto, 'IPI CST'),
                    vBC: parseFloat(getText(imposto, 'IPI vBC')) || 0,
                    pIPI: parseFloat(getText(imposto, 'IPI pIPI')) || 0,
                    vIPI: parseFloat(getText(imposto, 'IPI vIPI')) || 0
                },
                pis: {
                    CST: getText(imposto, 'PIS CST'),
                    vBC: parseFloat(getText(imposto, 'PIS vBC')) || 0,
                    pPIS: parseFloat(getText(imposto, 'PIS pPIS')) || 0,
                    vPIS: parseFloat(getText(imposto, 'PIS vPIS')) || 0
                },
                cofins: {
                    CST: getText(imposto, 'COFINS CST'),
                    vBC: parseFloat(getText(imposto, 'COFINS vBC')) || 0,
                    pCOFINS: parseFloat(getText(imposto, 'COFINS pCOFINS')) || 0,
                    vCOFINS: parseFloat(getText(imposto, 'COFINS vCOFINS')) || 0
                }
            };
        });

        // Totais
        const total = infNFe.querySelector('total ICMSTot');
        const totais = {
            vBC: parseFloat(getText(total, 'vBC')) || 0,
            vICMS: parseFloat(getText(total, 'vICMS')) || 0,
            vICMSDeson: parseFloat(getText(total, 'vICMSDeson')) || 0,
            vFCP: parseFloat(getText(total, 'vFCP')) || 0,
            vBCST: parseFloat(getText(total, 'vBCST')) || 0,
            vST: parseFloat(getText(total, 'vST')) || 0,
            vFCPST: parseFloat(getText(total, 'vFCPST')) || 0,
            vFCPSTRet: parseFloat(getText(total, 'vFCPSTRet')) || 0,
            vProd: parseFloat(getText(total, 'vProd')) || 0,
            vFrete: parseFloat(getText(total, 'vFrete')) || 0,
            vSeg: parseFloat(getText(total, 'vSeg')) || 0,
            vDesc: parseFloat(getText(total, 'vDesc')) || 0,
            vII: parseFloat(getText(total, 'vII')) || 0,
            vIPI: parseFloat(getText(total, 'vIPI')) || 0,
            vIPIDevol: parseFloat(getText(total, 'vIPIDevol')) || 0,
            vPIS: parseFloat(getText(total, 'vPIS')) || 0,
            vCOFINS: parseFloat(getText(total, 'vCOFINS')) || 0,
            vOutro: parseFloat(getText(total, 'vOutro')) || 0,
            vNF: parseFloat(getText(total, 'vNF')) || 0
        };

        // Transporte
        const transp = infNFe.querySelector('transp');
        const transporte = transp ? {
            modFrete: getText(transp, 'modFrete'),
            transporta: {
                CNPJ: getText(transp, 'transporta CNPJ'),
                CPF: getText(transp, 'transporta CPF'),
                xNome: getText(transp, 'transporta xNome'),
                IE: getText(transp, 'transporta IE'),
                xEnder: getText(transp, 'transporta xEnder'),
                xMun: getText(transp, 'transporta xMun'),
                UF: getText(transp, 'transporta UF')
            },
            veicTransp: {
                placa: getText(transp, 'veicTransp placa'),
                UF: getText(transp, 'veicTransp UF'),
                RNTC: getText(transp, 'veicTransp RNTC')
            },
            vol: {
                qVol: getText(transp, 'vol qVol'),
                esp: getText(transp, 'vol esp'),
                marca: getText(transp, 'vol marca'),
                nVol: getText(transp, 'vol nVol'),
                pesoL: parseFloat(getText(transp, 'vol pesoL')) || 0,
                pesoB: parseFloat(getText(transp, 'vol pesoB')) || 0
            }
        } : null;

        // Cobrança
        const cobr = infNFe.querySelector('cobr');
        const cobranca = cobr ? {
            fat: {
                nFat: getText(cobr, 'fat nFat'),
                vOrig: parseFloat(getText(cobr, 'fat vOrig')) || 0,
                vDesc: parseFloat(getText(cobr, 'fat vDesc')) || 0,
                vLiq: parseFloat(getText(cobr, 'fat vLiq')) || 0
            },
            dup: Array.from(cobr.querySelectorAll('dup')).map(dup => ({
                nDup: getText(dup, 'nDup'),
                dVenc: getText(dup, 'dVenc'),
                vDup: parseFloat(getText(dup, 'vDup')) || 0
            }))
        } : null;

        // Pagamento
        const pag = infNFe.querySelector('pag');
        const pagamento = pag ? {
            detPag: Array.from(pag.querySelectorAll('detPag')).map(det => ({
                indPag: getText(det, 'indPag'),
                tPag: getText(det, 'tPag'),
                vPag: parseFloat(getText(det, 'vPag')) || 0
            })),
            vTroco: parseFloat(getText(pag, 'vTroco')) || 0
        } : null;

        // Informações adicionais
        const infAdic = infNFe.querySelector('infAdic');
        const informacoesAdicionais = infAdic ? {
            infAdFisco: getText(infAdic, 'infAdFisco'),
            infCpl: getText(infAdic, 'infCpl')
        } : null;

        // Chave de acesso
        const chaveAcesso = infNFe.getAttribute('Id')?.replace('NFe', '') || '';

        // Protocolo de autorização
        const protNFe = doc.querySelector('protNFe infProt');
        const protocolo = protNFe ? {
            tpAmb: getText(protNFe, 'tpAmb'),
            verAplic: getText(protNFe, 'verAplic'),
            chNFe: getText(protNFe, 'chNFe'),
            dhRecbto: getText(protNFe, 'dhRecbto'),
            nProt: getText(protNFe, 'nProt'),
            digVal: getText(protNFe, 'digVal'),
            cStat: getText(protNFe, 'cStat'),
            xMotivo: getText(protNFe, 'xMotivo')
        } : null;

        return {
            chaveAcesso,
            identificacao,
            emitente,
            destinatario,
            produtos,
            totais,
            transporte,
            cobranca,
            pagamento,
            informacoesAdicionais,
            protocolo,
            isValid: true
        };
    } catch (error) {
        return {
            isValid: false,
            error: error.message
        };
    }
}

export function formatCNPJ(cnpj) {
    if (!cnpj) return '';
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function formatCPF(cpf) {
    if (!cpf) return '';
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function formatCEP(cep) {
    if (!cep) return '';
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

export function formatChaveAcesso(chave) {
    if (!chave) return '';
    return chave.replace(/(.{4})/g, '$1 ').trim();
}

export function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch {
        return dateString;
    }
}

export function formatDateTime(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    } catch {
        return dateString;
    }
}

export function getModalidadeFrete(mod) {
    const modalidades = {
        '0': 'Emitente',
        '1': 'Destinatário',
        '2': 'Terceiros',
        '3': 'Próprio Remetente',
        '4': 'Próprio Destinatário',
        '9': 'Sem Frete'
    };
    return modalidades[mod] || mod;
}

export function getFormaPagamento(tPag) {
    const formas = {
        '01': 'Dinheiro',
        '02': 'Cheque',
        '03': 'Cartão de Crédito',
        '04': 'Cartão de Débito',
        '05': 'Crédito Loja',
        '10': 'Vale Alimentação',
        '11': 'Vale Refeição',
        '12': 'Vale Presente',
        '13': 'Vale Combustível',
        '14': 'Duplicata Mercantil',
        '15': 'Boleto Bancário',
        '16': 'Depósito',
        '17': 'PIX',
        '18': 'Transferência',
        '19': 'Cashback',
        '90': 'Sem Pagamento',
        '99': 'Outros'
    };
    return formas[tPag] || tPag;
}
