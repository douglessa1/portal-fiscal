/**
 * API: Validador de NFe
 * Recebe XML e retorna validação completa
 */

import { validarNFe } from '../../../lib/nfeValidator';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { xml } = req.body;

        if (!xml) {
            return res.status(400).json({ error: 'XML não fornecido' });
        }

        // Validar tamanho (max 10MB)
        if (xml.length > 10 * 1024 * 1024) {
            return res.status(400).json({ error: 'XML muito grande. Máximo: 10MB' });
        }

        // Executar validação
        const resultado = await validarNFe(xml);

        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro na validação:', error);
        return res.status(500).json({
            error: 'Erro ao processar validação',
            details: error.message
        });
    }
}
