/**
 * Reforma Tributária Tags - Tags obrigatórias para classificação de posts
 * EC 132/2023 + LC 214/2025
 */

export const REFORMA_TAGS = [
    {
        id: 'regra_atual',
        label: 'Regra Atual',
        shortLabel: 'Atual',
        description: 'Regra vigente antes da Reforma Tributária',
        icon: '🔵',
        color: '#3b82f6',
        bgColor: 'bg-blue-500',
        textColor: 'text-white'
    },
    {
        id: 'impactada_reforma',
        label: 'Impactada pela Reforma',
        shortLabel: 'Impactada',
        description: 'Regra será alterada ou revogada pela Reforma',
        icon: '🟠',
        color: '#f97316',
        bgColor: 'bg-orange-500',
        textColor: 'text-white'
    },
    {
        id: 'regra_nova',
        label: 'Regra Nova (IBS/CBS)',
        shortLabel: 'IBS/CBS',
        description: 'Regra do novo sistema tributário',
        icon: '🟢',
        color: '#22c55e',
        bgColor: 'bg-green-500',
        textColor: 'text-white'
    },
    {
        id: 'transicao',
        label: 'Período de Transição',
        shortLabel: 'Transição',
        description: 'Regras aplicáveis durante 2026-2032',
        icon: '⚠️',
        color: '#eab308',
        bgColor: 'bg-yellow-500',
        textColor: 'text-black'
    }
];

/**
 * Timeline da Reforma Tributária
 */
export const REFORMA_TIMELINE = [
    { year: 2024, event: 'Regulamentação (LC 214)', status: 'em_vigor' },
    { year: 2025, event: 'Preparação do sistema', status: 'em_vigor' },
    { year: 2026, event: 'Início da CBS (0,9%)', status: 'futuro' },
    { year: 2027, event: 'IBS teste (0,1%)', status: 'futuro' },
    { year: 2028, event: 'Transição ICMS/ISS inicia', status: 'futuro' },
    { year: 2029, event: 'Redução ICMS/ISS 10%', status: 'futuro' },
    { year: 2030, event: 'Redução ICMS/ISS 20%', status: 'futuro' },
    { year: 2031, event: 'Redução ICMS/ISS 30%', status: 'futuro' },
    { year: 2032, event: 'Redução ICMS/ISS 40%', status: 'futuro' },
    { year: 2033, event: 'Extinção ICMS/ISS', status: 'futuro' }
];

/**
 * Normas base da Reforma
 */
export const NORMAS_REFORMA = [
    { sigla: 'EC 132/2023', nome: 'Emenda Constitucional da Reforma Tributária' },
    { sigla: 'LC 214/2025', nome: 'Lei Complementar de Regulamentação (proposta)' },
    { sigla: 'PLP 68/2024', nome: 'Projeto de Lei Complementar - IBS/CBS' },
    { sigla: 'PLP 108/2024', nome: 'Projeto de Lei Complementar - Comitê Gestor' }
];

/**
 * Componente de Tag visual
 */
export function getReformaTagStyles(tagId) {
    const tag = REFORMA_TAGS.find(t => t.id === tagId);
    if (!tag) return null;

    return {
        backgroundColor: tag.color,
        color: tag.textColor === 'text-black' ? '#000' : '#fff',
        label: tag.label,
        icon: tag.icon
    };
}

export default REFORMA_TAGS;
