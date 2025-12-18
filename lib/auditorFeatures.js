/**
 * AUDITOR Features - Funcionalidades exclusivas para plano AUDITOR
 * - Geração de PDF com fundamentação legal
 * - Assinatura digital de parecer
 * - Export para uso em auditorias
 */

import { jsPDF } from 'jspdf';
import { POST_TYPES, TRIBUTOS, REGIMES, TIPOS_OPERACAO } from './community/postTypes';
import { REFORMA_TAGS, NORMAS_REFORMA } from './community/reformaTags';

/**
 * Gera PDF de um parecer técnico com fundamentação legal
 */
export async function generateParecerPDF(post, user, options = {}) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    const postType = POST_TYPES[post.post_type];
    const reformaTag = REFORMA_TAGS.find(t => t.id === post.reforma_tag);

    // === CABEÇALHO ===
    doc.setFillColor(17, 24, 39); // bg-gray-900
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PARECER TÉCNICO', pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Portal Fiscal PRO - Auditor', pageWidth / 2, 28, { align: 'center' });

    // Número do parecer (hash único)
    const hash = generateParecerHash(post, user);
    doc.setFontSize(8);
    doc.text(`Nº ${hash}`, pageWidth / 2, 38, { align: 'center' });

    y = 55;

    // === CLASSIFICAÇÃO ===
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CLASSIFICAÇÃO:', margin, y);

    doc.setFont('helvetica', 'normal');
    if (postType) {
        doc.text(`${postType.icon} ${postType.label}`, margin + 40, y);
    }
    if (reformaTag) {
        doc.text(`| ${reformaTag.icon} ${reformaTag.label}`, margin + 100, y);
    }
    y += 10;

    // === DADOS DO PARECER ===
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Grid de informações estruturadas
    const gridData = [];

    if (post.tributo) {
        const tributoLabel = TRIBUTOS.find(t => t.value === post.tributo)?.label || post.tributo;
        gridData.push(['Tributo', tributoLabel.toUpperCase()]);
    }
    if (post.regime) {
        const regimeLabel = REGIMES.find(r => r.value === post.regime)?.label || post.regime;
        gridData.push(['Regime', regimeLabel]);
    }
    if (post.uf_origem) {
        gridData.push(['UF Origem', post.uf_origem]);
    }
    if (post.uf_destino) {
        gridData.push(['UF Destino', post.uf_destino]);
    }
    if (post.tipo_operacao) {
        const opLabel = TIPOS_OPERACAO.find(o => o.value === post.tipo_operacao)?.label || post.tipo_operacao;
        gridData.push(['Operação', opLabel]);
    }

    // Renderizar grid 2 colunas
    doc.setFontSize(8);
    const colWidth = contentWidth / 2;
    for (let i = 0; i < gridData.length; i += 2) {
        const x1 = margin;
        const x2 = margin + colWidth;

        if (gridData[i]) {
            doc.setFont('helvetica', 'bold');
            doc.text(`${gridData[i][0]}:`, x1, y);
            doc.setFont('helvetica', 'normal');
            doc.text(gridData[i][1], x1 + 25, y);
        }
        if (gridData[i + 1]) {
            doc.setFont('helvetica', 'bold');
            doc.text(`${gridData[i + 1][0]}:`, x2, y);
            doc.setFont('helvetica', 'normal');
            doc.text(gridData[i + 1][1], x2 + 25, y);
        }
        y += 6;
    }

    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // === BASE LEGAL ===
    if (post.base_legal) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('FUNDAMENTAÇÃO LEGAL', margin, y);
        y += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const baseLegalLines = doc.splitTextToSize(post.base_legal, contentWidth);
        doc.text(baseLegalLines, margin, y);
        y += baseLegalLines.length * 5 + 8;
    }

    // === TÍTULO E CONTEÚDO ===
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('OBJETO DO PARECER', margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const titleLines = doc.splitTextToSize(post.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 6 + 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISE', margin, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const contentLines = doc.splitTextToSize(post.content, contentWidth);

    // Verificar se precisa de nova página
    for (let i = 0; i < contentLines.length; i++) {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.text(contentLines[i], margin, y);
        y += 5;
    }

    y += 10;

    // === REFORMA TRIBUTÁRIA (se aplicável) ===
    if (reformaTag) {
        if (y > 240) {
            doc.addPage();
            y = 20;
        }

        doc.setFillColor(253, 230, 138); // amber-100
        doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(146, 64, 14); // amber-800
        doc.text('⚠️ IMPACTO DA REFORMA TRIBUTÁRIA (EC 132/2023)', margin + 5, y + 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`Classificação: ${reformaTag.label}`, margin + 5, y + 16);
        doc.text(`Este parecer considera as regras vigentes e possíveis alterações da Reforma.`, margin + 5, y + 23);

        doc.setTextColor(0, 0, 0);
        y += 40;
    }

    // === ASSINATURA ===
    if (y > 230) {
        doc.addPage();
        y = 20;
    }

    y = Math.max(y, 250);

    doc.line(margin, y, margin + 80, y);
    y += 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name || 'Auditor', margin, y);
    y += 5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Auditor - Portal Fiscal PRO`, margin, y);
    y += 4;
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, y);

    // === RODAPÉ ===
    doc.setFontSize(7);
    doc.setTextColor(128, 128, 128);
    doc.text(
        `Documento gerado em ${new Date().toLocaleString('pt-BR')} | Hash: ${hash}`,
        pageWidth / 2,
        285,
        { align: 'center' }
    );
    doc.text(
        'Este parecer é de responsabilidade do autor e não substitui consultoria especializada.',
        pageWidth / 2,
        290,
        { align: 'center' }
    );

    return doc;
}

/**
 * Gera hash único para o parecer
 */
function generateParecerHash(post, user) {
    const data = `${post.id}-${user.id}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return `PT-${Math.abs(hash).toString(36).toUpperCase().padStart(8, '0')}`;
}

/**
 * Marca resposta como "Entendimento Técnico" (exclusivo AUDITOR)
 */
export function createTechnicalOpinion(response, user) {
    return {
        ...response,
        is_technical_opinion: true,
        opinion_author: user.name,
        opinion_date: new Date().toISOString(),
        opinion_hash: generateParecerHash({ id: response.id }, user),
        certified: true
    };
}

/**
 * Exporta post para formato de auditoria
 */
export function exportForAudit(post, responses = []) {
    const postType = POST_TYPES[post.post_type];
    const reformaTag = REFORMA_TAGS.find(t => t.id === post.reforma_tag);

    return {
        metadata: {
            export_date: new Date().toISOString(),
            format: 'audit_v1',
            platform: 'Portal Fiscal PRO'
        },
        case: {
            id: post.id,
            title: post.title,
            type: postType?.label || 'Não classificado',
            reforma_status: reformaTag?.label || 'Não classificado',
            created_at: post.created_at
        },
        fiscal_context: {
            tributo: post.tributo,
            regime: post.regime,
            uf_origem: post.uf_origem,
            uf_destino: post.uf_destino,
            operacao: post.tipo_operacao,
            base_legal: post.base_legal
        },
        content: {
            question: post.content,
            structured_data: post.structured_data
        },
        responses: responses.map(r => ({
            id: r.id,
            content: r.content,
            author: r.author_name,
            is_technical_opinion: r.is_technical_opinion || false,
            created_at: r.created_at
        }))
    };
}

export default {
    generateParecerPDF,
    createTechnicalOpinion,
    exportForAudit
};
