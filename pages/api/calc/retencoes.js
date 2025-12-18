/**
 * API: Calculadora de Retenções na Fonte
 * Calcula IRRF, PIS, COFINS, CSLL
 */

import { calcularRetencoes } from '../../../lib/fiscal';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { valorServico, tipoServico, cpfCnpjPrestador } = req.body;

        // Validações
        if (!valorServico) {
            return res.status(400).json({ error: 'Valor do serviço é obrigatório' });
        }

        const valor = parseFloat(valorServico);

        if (isNaN(valor) || valor <= 0) {
            return res.status(400).json({ error: 'Valor do serviço inválido' });
        }

        // Calcular retenções usando módulo fiscal
        const resultado = calcularRetencoes({
            valorServico: valor,
            tipoServico: tipoServico || '17.01',
            cpfCnpjPrestador: cpfCnpjPrestador || ''
        });

        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro no cálculo de retenções:', error);
        return res.status(500).json({
            error: 'Erro ao calcular retenções',
            details: error.message
        });
    }
}
