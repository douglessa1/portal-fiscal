/**
 * Excel/CSV Exporter
 * Exports data to Excel and CSV formats
 */

import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 */
export function exportToExcel(data, options = {}) {
    const {
        filename = 'dados.xlsx',
        sheetName = 'Dados',
        headers = null
    } = options;

    try {
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();

        let ws;
        if (Array.isArray(data) && data.length > 0) {
            if (headers) {
                // Add headers manually
                const wsData = [headers, ...data.map(row =>
                    headers.map(h => row[h.key] ?? row[h] ?? '')
                )];
                ws = XLSX.utils.aoa_to_sheet(wsData);
            } else {
                // Auto-detect from object keys
                ws = XLSX.utils.json_to_sheet(data);
            }
        } else {
            ws = XLSX.utils.aoa_to_sheet([['Sem dados']]);
        }

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate and download
        XLSX.writeFile(wb, filename);
        return true;
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        throw error;
    }
}

/**
 * Export data to CSV file
 */
export function exportToCSV(data, options = {}) {
    const {
        filename = 'dados.csv',
        separator = ';',
        headers = null
    } = options;

    try {
        let csvContent = '';

        if (Array.isArray(data) && data.length > 0) {
            // Get headers
            const keys = headers || Object.keys(data[0]);
            csvContent += keys.join(separator) + '\n';

            // Add rows
            data.forEach(row => {
                const values = keys.map(key => {
                    const value = row[key] ?? '';
                    // Escape values with separator or quotes
                    if (String(value).includes(separator) || String(value).includes('"')) {
                        return `"${String(value).replace(/"/g, '""')}"`;
                    }
                    return value;
                });
                csvContent += values.join(separator) + '\n';
            });
        }

        // Create and download file
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);

        return true;
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        throw error;
    }
}

/**
 * Export calculation history to Excel
 */
export function exportHistoryToExcel(history, toolName = 'Cálculos') {
    const formattedData = history.map(item => ({
        'Data': new Date(item.timestamp).toLocaleString('pt-BR'),
        'Hash': item.hash,
        'Valor': item.result?.value || item.total || '',
        'Tipo': item.type || toolName
    }));

    return exportToExcel(formattedData, {
        filename: `historico_${toolName.toLowerCase().replace(/\s/g, '_')}_${Date.now()}.xlsx`,
        sheetName: 'Histórico'
    });
}

/**
 * Export MEI receitas to Excel
 */
export function exportReceitasToExcel(receitas, ano) {
    const formattedData = receitas.map(r => ({
        'Data': new Date(r.data).toLocaleDateString('pt-BR'),
        'Descrição': r.descricao || '-',
        'Valor': r.valor,
        'Mês': new Date(r.data).toLocaleDateString('pt-BR', { month: 'long' })
    }));

    return exportToExcel(formattedData, {
        filename: `receitas_mei_${ano}.xlsx`,
        sheetName: `Receitas ${ano}`
    });
}

/**
 * Export BI Fiscal data to Excel
 */
export function exportBIFiscalToExcel(data) {
    // Summary sheet
    const summary = [{
        'Métrica': 'Receita Bruta',
        'Valor': data.resumo?.receitaBruta || 0
    }, {
        'Métrica': 'Tributos Devidos',
        'Valor': data.resumo?.tributosDevidos || 0
    }, {
        'Métrica': 'Carga Tributária (%)',
        'Valor': data.resumo?.cargaTributaria || 0
    }];

    // Tax breakdown
    const porTributo = (data.porTributo || []).map(t => ({
        'Tributo': t.nome,
        'Valor': t.valor,
        'Percentual (%)': t.pct
    }));

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws1, 'Resumo');

    const ws2 = XLSX.utils.json_to_sheet(porTributo);
    XLSX.utils.book_append_sheet(wb, ws2, 'Por Tributo');

    XLSX.writeFile(wb, `bi_fiscal_${Date.now()}.xlsx`);
    return true;
}
