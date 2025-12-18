/**
 * Exportadores de Relatórios
 * PDF e Excel
 */

/**
 * Exportar para PDF (usando jsPDF)
 */
export async function exportarPDF(dados, tipo = 'simples_nacional') {
    try {
        const { jsPDF } = await import('jspdf');
        await import('jspdf-autotable');

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Cabeçalho
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Portal Fiscal', pageWidth / 2, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');

        if (tipo === 'simples_nacional') {
            doc.text('Relatório de Apuração - Simples Nacional', pageWidth / 2, 25, { align: 'center' });

            // Dados principais
            let y = 35;
            doc.setFontSize(10);
            doc.text(`Competência: ${dados.competencia || new Date().toISOString().substring(0, 7)}`, 15, y);
            y += 7;
            doc.text(`Anexo: ${dados.anexo} - ${dados.descricaoAnexo || ''}`, 15, y);
            y += 7;
            doc.text(`Receita Mês: R$ ${dados.receitaMes?.toFixed(2) || '0.00'}`, 15, y);
            y += 7;
            doc.text(`Receita 12 Meses: R$ ${dados.receitaBruta12Meses?.toFixed(2) || '0.00'}`, 15, y);
            y += 7;
            doc.text(`Faixa: ${dados.faixa}ª`, 15, y);
            y += 7;
            doc.text(`Alíquota Efetiva: ${dados.aliquotaEfetiva?.toFixed(4)}%`, 15, y);
            y += 10;

            // Valor devido
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Valor Devido (DAS): R$ ${dados.valorDevido?.toFixed(2) || '0.00'}`, 15, y);
            y += 15;

            // Tabela de tributos
            if (dados.tributos) {
                doc.setFontSize(12);
                doc.text('Distribuição por Tributo:', 15, y);
                y += 5;

                const tributosData = Object.entries(dados.tributos).map(([tributo, valor]) => [
                    tributo,
                    `R$ ${valor.toFixed(2)}`
                ]);

                doc.autoTable({
                    startY: y,
                    head: [['Tributo', 'Valor']],
                    body: tributosData,
                    theme: 'grid',
                    headStyles: { fillColor: [124, 58, 237] }
                });
            }

        } else if (tipo === 'difal') {
            doc.text('Relatório DIFAL', pageWidth / 2, 25, { align: 'center' });

            let y = 35;
            doc.setFontSize(10);
            doc.text(`UF Origem: ${dados.ufOrigem}`, 15, y);
            y += 7;
            doc.text(`UF Destino: ${dados.ufDestino}`, 15, y);
            y += 7;
            doc.text(`Valor Operação: R$ ${dados.valorOperacao?.toFixed(2)}`, 15, y);
            y += 7;
            doc.text(`Metodologia: ${dados.metodologia === 'base_dupla' ? 'Base Dupla' : 'Base Única'}`, 15, y);
            y += 10;

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`DIFAL Total: R$ ${dados.totalDifal?.toFixed(2)}`, 15, y);
        }

        // Rodapé
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.text(
                `Gerado em ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Download
        const filename = `${tipo}_${new Date().getTime()}.pdf`;
        doc.save(filename);

        return { sucesso: true, filename };
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Exportar para Excel (usando xlsx)
 */
export async function exportarExcel(dados, tipo = 'simples_nacional') {
    try {
        const XLSX = await import('xlsx');

        const workbook = XLSX.utils.book_new();

        if (tipo === 'simples_nacional') {
            // Planilha de Resumo
            const resumoData = [
                ['Relatório de Apuração - Simples Nacional'],
                [],
                ['Competência', dados.competencia || new Date().toISOString().substring(0, 7)],
                ['Anexo', dados.anexo],
                ['Faixa', `${dados.faixa}ª`],
                ['Receita do Mês', dados.receitaMes],
                ['Receita 12 Meses', dados.receitaBruta12Meses],
                ['Alíquota Nominal', `${dados.aliquotaNominal}%`],
                ['Alíquota Efetiva', `${dados.aliquotaEfetiva}%`],
                ['Valor Devido (DAS)', dados.valorDevido],
                [],
                ['Distribuição por Tributo'],
                ['Tributo', 'Valor']
            ];

            if (dados.tributos) {
                Object.entries(dados.tributos).forEach(([tributo, valor]) => {
                    resumoData.push([tributo, valor]);
                });
            }

            const ws = XLSX.utils.aoa_to_sheet(resumoData);
            XLSX.utils.book_append_sheet(workbook, ws, 'Apuração');

        } else if (tipo === 'difal') {
            const difalData = [
                ['Relatório DIFAL'],
                [],
                ['UF Origem', dados.ufOrigem],
                ['UF Destino', dados.ufDestino],
                ['Valor Operação', dados.valorOperacao],
                ['Metodologia', dados.metodologia === 'base_dupla' ? 'Base Dupla' : 'Base Única'],
                ['ICMS Origem', dados.icmsOrigem],
                ['ICMS Destino', dados.icmsDestino],
                ['DIFAL', dados.difal],
                ['FCP', dados.fcp],
                ['Total', dados.totalDifal]
            ];

            const ws = XLSX.utils.aoa_to_sheet(difalData);
            XLSX.utils.book_append_sheet(workbook, ws, 'DIFAL');
        }

        // Download
        const filename = `${tipo}_${new Date().getTime()}.xlsx`;
        XLSX.writeFile(workbook, filename);

        return { sucesso: true, filename };
    } catch (error) {
        console.error('Erro ao gerar Excel:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Exportar para CSV
 */
export function exportarCSV(dados, tipo = 'simples_nacional') {
    try {
        let csv = '';

        if (tipo === 'simples_nacional') {
            csv = 'Campo,Valor\n';
            csv += `Competência,${dados.competencia || new Date().toISOString().substring(0, 7)}\n`;
            csv += `Anexo,${dados.anexo}\n`;
            csv += `Faixa,${dados.faixa}\n`;
            csv += `Receita Mês,${dados.receitaMes}\n`;
            csv += `Receita 12 Meses,${dados.receitaBruta12Meses}\n`;
            csv += `Alíquota Efetiva,${dados.aliquotaEfetiva}%\n`;
            csv += `Valor Devido,${dados.valorDevido}\n`;
            csv += '\nTributo,Valor\n';

            if (dados.tributos) {
                Object.entries(dados.tributos).forEach(([tributo, valor]) => {
                    csv += `${tributo},${valor}\n`;
                });
            }
        }

        // Download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${tipo}_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao gerar CSV:', error);
        return { sucesso: false, erro: error.message };
    }
}
