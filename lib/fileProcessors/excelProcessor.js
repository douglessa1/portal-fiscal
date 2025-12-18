/**
 * Processador de Arquivos Excel
 * Processa RLT e outros arquivos Excel
 */

import * as XLSX from 'xlsx';

/**
 * Processar arquivo Excel RLT (Relatório de Faturamento)
 * @param {File} file - Arquivo Excel
 * @returns {Promise<Object>} Dados extraídos
 */
export async function processarRLT(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assumir que dados estão na primeira planilha
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Converter para JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Extrair dados (formato pode variar por prefeitura)
                const dadosExtraidos = extrairDadosRLT(jsonData);

                resolve(dadosExtraidos);
            } catch (error) {
                reject(new Error(`Erro ao processar Excel: ${error.message}`));
            }
        };

        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Extrair dados do RLT (adaptar conforme layout)
 */
function extrairDadosRLT(jsonData) {
    // Exemplo de extração - ADAPTAR conforme layout real
    const dados = {
        competencia: null,
        receitaMes: 0,
        receita12Meses: 0,
        discriminacao: {
            comercio: 0,
            industria: 0,
            servicos: 0
        },
        deducoes: 0
    };

    // Tentar encontrar dados por padrões comuns
    for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];

        // Procurar competência
        if (row[0] && String(row[0]).toLowerCase().includes('competência')) {
            dados.competencia = row[1];
        }

        // Procurar receita do mês
        if (row[0] && String(row[0]).toLowerCase().includes('receita') &&
            String(row[0]).toLowerCase().includes('mês')) {
            dados.receitaMes = parseFloat(String(row[1]).replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        }

        // Procurar receita 12 meses
        if (row[0] && String(row[0]).toLowerCase().includes('12') &&
            String(row[0]).toLowerCase().includes('meses')) {
            dados.receita12Meses = parseFloat(String(row[1]).replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        }
    }

    return dados;
}

/**
 * Processar PGDAS-D (declaração anterior)
 */
export async function processarPGDAS(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Extrair dados relevantes
                const dadosExtraidos = {
                    competencia: jsonData[0]?.competencia || null,
                    receitaBrutaAcumulada: jsonData[0]?.receitaBrutaAcumulada || 0,
                    anexo: jsonData[0]?.anexo || null,
                    valorDevido: jsonData[0]?.valorDevido || 0
                };

                resolve(dadosExtraidos);
            } catch (error) {
                reject(new Error(`Erro ao processar PGDAS: ${error.message}`));
            }
        };

        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Validar formato de arquivo RLT
 */
export function validarFormatoRLT(file) {
    const extensoesValidas = ['.xlsx', '.xls'];
    const extensao = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!extensoesValidas.includes(extensao)) {
        return { valido: false, erro: 'Formato inválido. Use .xlsx ou .xls' };
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
        return { valido: false, erro: 'Arquivo muito grande. Máximo 10MB' };
    }

    return { valido: true };
}
