/**
 * Seed initial badges for the community
 */
exports.seed = async function (knex) {
    // Delete existing badges first
    await knex('badges').del();

    // Insert predefined badges
    await knex('badges').insert([
        {
            name: 'Primeira Pergunta',
            description: 'Fez sua primeira pergunta na comunidade',
            icon: '🌱',
            color: '#10b981',
            requirement: 1
        },
        {
            name: 'Perguntador Ativo',
            description: 'Fez 10 perguntas',
            icon: '❓',
            color: '#3b82f6',
            requirement: 10
        },
        {
            name: 'Expert Respondedor',
            description: 'Teve 5 respostas aceitas como solução',
            icon: '✅',
            color: '#22c55e',
            requirement: 5
        },
        {
            name: 'Mestre ICMS',
            description: 'Especialista em questões de ICMS',
            icon: '🎓',
            color: '#8b5cf6',
            requirement: 20
        },
        {
            name: 'Guru SPED',
            description: 'Expert em SPED Fiscal',
            icon: '📊',
            color: '#f59e0b',
            requirement: 15
        },
        {
            name: 'Contribuidor Dedicado',
            description: 'Mais de 50 contribuições na comunidade',
            icon: '⭐',
            color: '#fbbf24',
            requirement: 50
        },
        {
            name: 'Voto Popular',
            description: 'Recebeu 100 upvotes',
            icon: '🔼',
            color: '#ef4444',
            requirement: 100
        },
        {
            name: 'Mentor',
            description: '20 respostas aceitas',
            icon: '🏆',
            color: '#dc2626',
            requirement: 20
        }
    ]);

    console.log('✅ Badges seeded successfully');
};
