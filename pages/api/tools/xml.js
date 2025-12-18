import formidable from 'formidable';
import { parseNFe } from '../../../lib/xmlParser';
import fs from 'fs';

// Desabilitar o body parser padrão do Next.js
export const config = {
    api: {
        bodyParser: false
    }
};

/**
 * API Route: Processar upload de XML
 * POST /api/tools/xml
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable({
            maxFileSize: 10 * 1024 * 1024, // 10MB
            filter: ({ mimetype, originalFilename }) => {
                // Aceitar XML
                return (
                    mimetype === 'text/xml' ||
                    mimetype === 'application/xml' ||
                    originalFilename?.endsWith('.xml')
                );
            }
        });

        const [fields, files] = await form.parse(req);

        if (!files.xml || files.xml.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo XML enviado' });
        }

        const xmlFile = files.xml[0];

        // Ler conteúdo do arquivo
        const xmlContent = fs.readFileSync(xmlFile.filepath, 'utf-8');

        // Processar XML
        const parsedData = await parseNFe(xmlContent);

        // Limpar arquivo temporário
        fs.unlinkSync(xmlFile.filepath);

        return res.status(200).json({
            success: true,
            filename: xmlFile.originalFilename,
            ...parsedData
        });

    } catch (error) {
        console.error('Error processing XML:', error);

        if (error.message === 'infNFe not found') {
            return res.status(400).json({
                error: 'XML inválido ou não é uma NFe'
            });
        }

        return res.status(500).json({
            error: 'Erro ao processar XML',
            details: error.message
        });
    }
}
