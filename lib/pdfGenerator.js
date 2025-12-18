/**
 * PDF Generator - Generates professional PDFs for calculations
 * Uses jspdf for PDF generation and html2canvas for capturing HTML
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF from HTML element
 */
export async function generatePDFFromElement(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    const {
        filename = 'documento.pdf',
        title = 'Documento',
        orientation = 'portrait',
        format = 'a4',
        margin = 10
    } = options;

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation,
            unit: 'mm',
            format
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = margin;

        // First page
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);

        // Additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight + margin;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - margin * 2);
        }

        pdf.save(filename);
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

/**
 * Generate calculation PDF with memory and hash
 */
export async function generateCalculationPDF(data, options = {}) {
    const {
        title = 'Cálculo Fiscal',
        subtitle = '',
        hash = '',
        timestamp = new Date().toISOString(),
        inputs = [],
        memory = [],
        result = {},
        comparison = null,
        filename = 'calculo.pdf'
    } = data;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let y = margin;

    // Helper functions
    const addText = (text, x, size = 10, style = 'normal') => {
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.text(text, x, y);
    };

    const addLine = () => {
        pdf.setDrawColor(200);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 3;
    };

    // Header
    pdf.setFillColor(99, 102, 241); // Primary color
    pdf.rect(0, 0, pageWidth, 35, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Portal Fiscal', margin, 15);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(title, margin, 25);

    if (subtitle) {
        pdf.setFontSize(10);
        pdf.text(subtitle, margin, 32);
    }

    y = 45;
    pdf.setTextColor(0, 0, 0);

    // Hash and timestamp
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(`Hash: ${hash}`, margin, y);
    pdf.text(`Gerado em: ${new Date(timestamp).toLocaleString('pt-BR')}`, pageWidth - margin - 60, y);
    y += 10;
    pdf.setTextColor(0);

    // Inputs Section
    if (inputs.length > 0) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Dados de Entrada', margin, y);
        y += 8;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');

        inputs.forEach(input => {
            pdf.text(`${input.label}:`, margin, y);
            pdf.setFont('helvetica', 'bold');
            pdf.text(String(input.value), margin + 60, y);
            pdf.setFont('helvetica', 'normal');
            y += 6;
        });
        y += 5;
    }

    // Memory of Calculation
    if (memory.length > 0) {
        addLine();
        y += 5;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Memória de Cálculo', margin, y);
        y += 10;

        pdf.setFontSize(9);
        memory.forEach((step, index) => {
            // Step number
            pdf.setFillColor(99, 102, 241);
            pdf.circle(margin + 3, y - 2, 3, 'F');
            pdf.setTextColor(255);
            pdf.setFontSize(7);
            pdf.text(String(index + 1), margin + 2, y - 1);
            pdf.setTextColor(0);
            pdf.setFontSize(9);

            // Step content
            pdf.setFont('helvetica', 'bold');
            pdf.text(step.label, margin + 10, y);
            y += 5;

            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100);
            pdf.text(step.formula, margin + 10, y);
            y += 5;

            pdf.setTextColor(0);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`= ${step.result}`, margin + 10, y);
            pdf.setFont('helvetica', 'normal');
            y += 8;

            // Check page break
            if (y > 270) {
                pdf.addPage();
                y = margin;
            }
        });
    }

    // Result Section
    if (result.value !== undefined) {
        y += 5;
        addLine();
        y += 5;

        pdf.setFillColor(34, 197, 94); // Green
        pdf.roundedRect(margin, y, pageWidth - margin * 2, 25, 3, 3, 'F');

        pdf.setTextColor(255);
        pdf.setFontSize(10);
        pdf.text(result.label || 'Resultado', margin + 5, y + 8);

        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(result.value), margin + 5, y + 20);

        y += 35;
        pdf.setTextColor(0);
        pdf.setFont('helvetica', 'normal');
    }

    // Comparison Section
    if (comparison) {
        addLine();
        y += 5;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Comparativo', margin, y);
        y += 10;

        const colWidth = (pageWidth - margin * 2) / 2 - 5;

        // Left column
        pdf.setFillColor(240, 240, 255);
        pdf.roundedRect(margin, y, colWidth, 40, 2, 2, 'F');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(comparison.left.label, margin + 5, y + 10);
        pdf.setFontSize(14);
        pdf.text(String(comparison.left.value), margin + 5, y + 25);

        // Right column
        pdf.setFillColor(240, 255, 240);
        pdf.roundedRect(margin + colWidth + 10, y, colWidth, 40, 2, 2, 'F');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(comparison.right.label, margin + colWidth + 15, y + 10);
        pdf.setFontSize(14);
        pdf.text(String(comparison.right.value), margin + colWidth + 15, y + 25);

        y += 50;
    }

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - 10;
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text('Portal Fiscal - Documento gerado automaticamente', margin, footerY);
    pdf.text(`Página 1`, pageWidth - margin - 15, footerY);

    // Legal note
    pdf.setFontSize(7);
    pdf.text('Este documento é meramente informativo e não substitui orientação profissional.', margin, footerY + 4);

    pdf.save(filename);
    return true;
}

/**
 * Generate DANFE PDF
 */
export async function generateDANFEPdf(nfeData, options = {}) {
    const { filename = `DANFE_${nfeData?.identificacao?.nNF || 'documento'}.pdf` } = options;

    // Use html2canvas approach for DANFE since it's complex
    return generatePDFFromElement('danfe-content', {
        filename,
        title: 'DANFE',
        orientation: 'portrait'
    });
}

/**
 * Format currency for PDF
 */
export function formatCurrencyPDF(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}

/**
 * Format percentage for PDF
 */
export function formatPercentPDF(value) {
    return `${(value || 0).toFixed(2)}%`;
}
