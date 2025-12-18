import { calcularDIFAL } from '../../../lib/fiscal';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { valor, aliqInter, aliqInterna, aliqFCP, ufDestino, metodologia } = req.body;

        // Validações básicas
        if (!valor || !aliqInter || !aliqInterna) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        // Determinar metodologia
        let metodo = metodologia;
        if (metodologia === 'auto') {
            metodo = ufDestino === 'ES' ? 'base_unica' : 'base_dupla';
        }

        // Calcular usando o módulo fiscal.js
        const resultado = calcularDIFAL({
            valor: parseFloat(valor),
            aliqInterestadual: parseFloat(aliqInter),
            aliqInterna: parseFloat(aliqInterna),
            aliqFCP: parseFloat(aliqFCP || 0),
            metodologia: metodo,
            ufDestino: ufDestino || 'SP'
        });

        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao calcular DIFAL:', error);
        return res.status(500).json({
            error: 'Erro ao calcular DIFAL',
            details: error.message
        });
    }
}
