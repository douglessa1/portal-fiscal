/**
 * SPED Parser - Parses SPED EFD ICMS/IPI files
 * Validates structure and extracts key data
 */

// Registro definitions
const REGISTROS = {
    '0000': { nome: 'Abertura', obrigatorio: true, campos: ['REG', 'COD_VER', 'COD_FIN', 'DT_INI', 'DT_FIN', 'NOME', 'CNPJ', 'UF', 'IE', 'COD_MUN', 'IM', 'SUFRAMA', 'IND_PERFIL', 'IND_ATIV'] },
    '0001': { nome: 'Abertura Bloco 0', obrigatorio: true },
    '0100': { nome: 'Dados do Contabilista', obrigatorio: true },
    '0150': { nome: 'Tabela de Cadastro do Participante', obrigatorio: false },
    '0190': { nome: 'Identificação das Unidades de Medida', obrigatorio: false },
    '0200': { nome: 'Tabela de Identificação do Item', obrigatorio: false },
    '0990': { nome: 'Encerramento Bloco 0', obrigatorio: true },
    'C001': { nome: 'Abertura Bloco C', obrigatorio: true },
    'C100': { nome: 'Documento Fiscal', obrigatorio: false },
    'C170': { nome: 'Itens do Documento', obrigatorio: false },
    'C190': { nome: 'Registro Analítico do Documento', obrigatorio: false },
    'C990': { nome: 'Encerramento Bloco C', obrigatorio: true },
    'D001': { nome: 'Abertura Bloco D', obrigatorio: true },
    'D990': { nome: 'Encerramento Bloco D', obrigatorio: true },
    'E001': { nome: 'Abertura Bloco E', obrigatorio: true },
    'E100': { nome: 'Período da Apuração do ICMS', obrigatorio: false },
    'E110': { nome: 'Apuração do ICMS', obrigatorio: false },
    'E990': { nome: 'Encerramento Bloco E', obrigatorio: true },
    'G001': { nome: 'Abertura Bloco G', obrigatorio: true },
    'G990': { nome: 'Encerramento Bloco G', obrigatorio: true },
    'H001': { nome: 'Abertura Bloco H', obrigatorio: true },
    'H990': { nome: 'Encerramento Bloco H', obrigatorio: true },
    'K001': { nome: 'Abertura Bloco K', obrigatorio: true },
    'K990': { nome: 'Encerramento Bloco K', obrigatorio: true },
    '1001': { nome: 'Abertura Bloco 1', obrigatorio: true },
    '1990': { nome: 'Encerramento Bloco 1', obrigatorio: true },
    '9001': { nome: 'Abertura Bloco 9', obrigatorio: true },
    '9900': { nome: 'Registros do Arquivo', obrigatorio: true },
    '9990': { nome: 'Encerramento Bloco 9', obrigatorio: true },
    '9999': { nome: 'Encerramento do Arquivo', obrigatorio: true }
};

/**
 * Parse SPED file content
 */
export function parseSpedFile(content) {
    const lines = content.split('\n').filter(l => l.trim());
    const result = {
        isValid: true,
        empresa: null,
        periodo: null,
        registros: {},
        documentos: [],
        totais: {
            linhas: lines.length,
            documentos: 0,
            itens: 0,
            valorTotal: 0,
            icmsTotal: 0
        },
        erros: [],
        avisos: []
    };

    // Parse each line
    lines.forEach((line, index) => {
        try {
            const campos = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
            const reg = campos[0];

            if (!result.registros[reg]) {
                result.registros[reg] = { count: 0, linhas: [] };
            }
            result.registros[reg].count++;
            result.registros[reg].linhas.push(index + 1);

            // Parse specific registers
            switch (reg) {
                case '0000':
                    result.empresa = {
                        nome: campos[5],
                        cnpj: campos[6],
                        uf: campos[7],
                        ie: campos[8],
                        municipio: campos[9]
                    };
                    result.periodo = {
                        inicio: campos[3],
                        fim: campos[4],
                        finalidade: campos[2]
                    };
                    break;

                case 'C100':
                    const doc = {
                        tipo: campos[1],
                        emitente: campos[2] === '0' ? 'Própria' : 'Terceiros',
                        participante: campos[3],
                        modelo: campos[4],
                        serie: campos[6],
                        numero: campos[7],
                        dataEmissao: campos[9],
                        valorTotal: parseFloat(campos[11]) || 0,
                        baseICMS: parseFloat(campos[14]) || 0,
                        valorICMS: parseFloat(campos[15]) || 0
                    };
                    result.documentos.push(doc);
                    result.totais.documentos++;
                    result.totais.valorTotal += doc.valorTotal;
                    result.totais.icmsTotal += doc.valorICMS;
                    break;

                case 'C170':
                    result.totais.itens++;
                    break;

                case 'E110':
                    result.apuracao = {
                        valorSaidasComDebito: parseFloat(campos[2]) || 0,
                        valorAjusteDebito: parseFloat(campos[3]) || 0,
                        totalDebitos: parseFloat(campos[4]) || 0,
                        valorEntradasComCredito: parseFloat(campos[6]) || 0,
                        valorAjusteCredito: parseFloat(campos[7]) || 0,
                        totalCreditos: parseFloat(campos[8]) || 0,
                        saldoCredorAnterior: parseFloat(campos[9]) || 0,
                        saldoApurado: parseFloat(campos[10]) || 0,
                        totalDeducoes: parseFloat(campos[11]) || 0,
                        icmsRecolher: parseFloat(campos[12]) || 0,
                        saldoCredorTransportar: parseFloat(campos[13]) || 0
                    };
                    break;
            }
        } catch (err) {
            result.erros.push({
                linha: index + 1,
                mensagem: `Erro ao processar linha: ${err.message}`,
                conteudo: line.substring(0, 50)
            });
        }
    });

    // Validate required registers
    Object.entries(REGISTROS).forEach(([reg, info]) => {
        if (info.obrigatorio && !result.registros[reg]) {
            result.erros.push({
                tipo: 'registro_faltando',
                registro: reg,
                mensagem: `Registro obrigatório ${reg} (${info.nome}) não encontrado`
            });
            result.isValid = false;
        }
    });

    // Validate opening/closing blocks
    const blocos = ['0', 'C', 'D', 'E', 'G', 'H', 'K', '1', '9'];
    blocos.forEach(bloco => {
        const abertura = bloco === '0' ? '0001' : bloco === '1' ? '1001' : bloco === '9' ? '9001' : `${bloco}001`;
        const encerramento = bloco === '0' ? '0990' : bloco === '1' ? '1990' : bloco === '9' ? '9990' : `${bloco}990`;

        if (result.registros[abertura] && !result.registros[encerramento]) {
            result.avisos.push({
                tipo: 'bloco_nao_fechado',
                bloco,
                mensagem: `Bloco ${bloco} aberto mas não encerrado`
            });
        }
    });

    // Validate 0000 and 9999
    if (!result.registros['0000']) {
        result.erros.push({ tipo: 'critico', mensagem: 'Registro 0000 (Abertura) não encontrado' });
        result.isValid = false;
    }
    if (!result.registros['9999']) {
        result.erros.push({ tipo: 'critico', mensagem: 'Registro 9999 (Encerramento) não encontrado' });
        result.isValid = false;
    }

    return result;
}

/**
 * Generate validation report
 */
export function generateValidationReport(parseResult) {
    const { empresa, periodo, totais, registros, erros, avisos, apuracao } = parseResult;

    return {
        resumo: {
            status: parseResult.isValid ? 'VÁLIDO' : 'INVÁLIDO',
            empresa: empresa?.nome || 'Não identificado',
            cnpj: empresa?.cnpj || 'Não identificado',
            periodo: periodo ? `${periodo.inicio} a ${periodo.fim}` : 'Não identificado',
            totalLinhas: totais.linhas,
            totalDocumentos: totais.documentos,
            totalItens: totais.itens,
            valorTotal: totais.valorTotal,
            icmsTotal: totais.icmsTotal
        },
        apuracao: apuracao || null,
        registros: Object.entries(registros).map(([reg, data]) => ({
            registro: reg,
            nome: REGISTROS[reg]?.nome || 'Desconhecido',
            quantidade: data.count,
            obrigatorio: REGISTROS[reg]?.obrigatorio || false
        })).sort((a, b) => a.registro.localeCompare(b.registro)),
        erros,
        avisos,
        totalErros: erros.length,
        totalAvisos: avisos.length
    };
}

/**
 * Format CNPJ
 */
export function formatCNPJ(cnpj) {
    if (!cnpj) return '';
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Format date from SPED format (ddmmyyyy)
 */
export function formatSpedDate(date) {
    if (!date || date.length !== 8) return date;
    return `${date.substring(0, 2)}/${date.substring(2, 4)}/${date.substring(4, 8)}`;
}
