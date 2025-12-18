/**
 * API: Gerador de DANFE
 * Gera PDF do DANFE a partir de XML NFe
 */

import { extrairDadosNFe, formatarChaveAcesso, formatarCpfCnpj, formatarCEP, formatarData } from '../../../lib/danfeGenerator';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { xml } = req.body;

        if (!xml) {
            return res.status(400).json({ error: 'XML não fornecido' });
        }

        // Extrair dados da NFe
        const nfe = await extrairDadosNFe(xml);

        // Importar jsPDF de forma segura para Node.js
        const jsPDF = (await import('jspdf')).jsPDF;
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Adicionar plugin autoTable
        doc.autoTable = autoTable.bind(doc);

        let y = 10;

        // === CABEÇALHO ===
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('DANFE', 105, y, { align: 'center' });
        y += 6;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text('Documento Auxiliar da Nota Fiscal Eletrônica', 105, y, { align: 'center' });
        y += 10;

        // === DADOS DO EMITENTE ===
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('EMITENTE', 10, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`Razão Social: ${nfe.emitente.nome}`, 10, y);
        y += 4;
        doc.text(`CNPJ: ${formatarCpfCnpj(nfe.emitente.cnpj)}`, 10, y);
        y += 4;
        doc.text(`Endereço: ${nfe.emitente.endereco}, ${nfe.emitente.bairro}`, 10, y);
        y += 4;
        doc.text(`${nfe.emitente.cidade} - ${nfe.emitente.uf}  CEP: ${formatarCEP(nfe.emitente.cep)}`, 10, y);
        y += 8;

        // === DADOS DA NFE ===
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('DADOS DA NFe', 10, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`Número: ${nfe.numero}`, 10, y);
        doc.text(`Série: ${nfe.serie}`, 60, y);
        doc.text(`Data Emissão: ${formatarData(nfe.dataEmissao)}`, 100, y);
        y += 4;
        doc.text(`Natureza da Operação: ${nfe.naturezaOperacao}`, 10, y);
        y += 8;

        // === DESTINATÁRIO ===
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('DESTINATÁRIO', 10, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`Nome/Razão Social: ${nfe.destinatario.nome}`, 10, y);
        y += 4;
        doc.text(`CPF/CNPJ: ${formatarCpfCnpj(nfe.destinatario.cpfCnpj)}`, 10, y);
        y += 4;
        doc.text(`Endereço: ${nfe.destinatario.endereco}, ${nfe.destinatario.bairro}`, 10, y);
        y += 4;
        doc.text(`${nfe.destinatario.cidade} - ${nfe.destinatario.uf}  CEP: ${formatarCEP(nfe.destinatario.cep)}`, 10, y);
        y += 8;

        // === PRODUTOS (Tabela) ===
        const produtosData = nfe.produtos.map(p => [
            p.codigo,
            p.descricao.substring(0, 40), // Limitar descrição
            p.ncm,
            p.quantidade.toFixed(2),
            p.valorUnitario.toFixed(2),
            p.valorTotal.toFixed(2)
        ]);

        autoTable(doc, {
            startY: y,
            head: [['Código', 'Descrição', 'NCM', 'Qtd', 'Valor Unit.', 'Total']],
            body: produtosData,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [124, 58, 237], textColor: 255 },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 70 },
                2: { cellWidth: 20 },
                3: { cellWidth: 15 },
                4: { cellWidth: 25 },
                5: { cellWidth: 25 }
            }
        });

        y = doc.lastAutoTable.finalY + 10;

        // === TOTALIZADORES ===
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('CÁLCULO DO IMPOSTO', 10, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`Base de Cálculo ICMS: R$ ${nfe.totais.baseICMS.toFixed(2)}`, 10, y);
        y += 4;
        doc.text(`Valor ICMS: R$ ${nfe.totais.valorICMS.toFixed(2)}`, 10, y);
        y += 4;
        doc.text(`Valor IPI: R$ ${nfe.totais.valorIPI.toFixed(2)}`, 10, y);
        y += 4;

        // Reforma Tributária (Se houver valor)
        if (nfe.totais.valorIBS > 0 || nfe.totais.valorCBS > 0) {
            doc.text(`Valor IBS: R$ ${nfe.totais.valorIBS.toFixed(2)}`, 80, y - 8);
            doc.text(`Valor CBS: R$ ${nfe.totais.valorCBS.toFixed(2)}`, 80, y - 4);
            doc.text(`Valor IS: R$ ${nfe.totais.valorIS.toFixed(2)}`, 80, y);
        }

        y += 8;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`VALOR TOTAL DA NOTA: R$ ${nfe.totais.valorTotal.toFixed(2)}`, 10, y);
        y += 10;

        // === CHAVE DE ACESSO ===
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('CHAVE DE ACESSO', 10, y);
        y += 5;

        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(formatarChaveAcesso(nfe.chave), 10, y);
        y += 8;

        // === RODAPÉ ===
        doc.setFontSize(7);
        doc.setTextColor(128);
        doc.text('Documento gerado pelo Portal Fiscal - portalfiscal.com.br', 105, 285, { align: 'center' });

        // Gerar PDF como buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

        // Retornar PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=DANFE_${nfe.numero}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Erro ao gerar DANFE:', error);
        console.error('Stack:', error.stack);
        return res.status(500).json({
            error: 'Erro ao gerar DANFE',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Configuração para permitir body maior (XMLs podem ser grandes)
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};
