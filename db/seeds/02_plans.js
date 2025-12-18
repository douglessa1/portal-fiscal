exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('plans').del();

    // Inserts seed entries
    await knex('plans').insert([
        {
            name: 'Gratuito',
            slug: 'free',
            price: 0.00,
            interval: 'monthly',
            features: JSON.stringify([
                'Acesso básico às ferramentas',
                '3 cálculos por dia',
                'Comunidade (Leitura)',
                'Anúncios na plataforma'
            ]),
            active: true
        },
        {
            name: 'Profissional',
            slug: 'pro',
            price: 29.90,
            interval: 'monthly',
            features: JSON.stringify([
                'Cálculos ilimitados',
                'Importação de XML em lote',
                'Sem anúncios',
                'Prioridade no suporte',
                'Acesso total à Comunidade'
            ]),
            active: true
        },
        {
            name: 'Empresarial',
            slug: 'enterprise',
            price: 99.90,
            interval: 'monthly',
            features: JSON.stringify([
                'Tudo do PRO',
                'API de integração',
                'Múltiplos usuários (até 5)',
                'Consultoria mensal'
            ]),
            active: true
        }
    ]);
};
