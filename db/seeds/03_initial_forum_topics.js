/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Check if admin exists to assign author
    const admin = await knex('users').where({ email: 'admin@portal.com' }).first();
    if (!admin) return;

    // Check if posts table is empty to avoid duplicates on re-seed
    const existingPosts = await knex('posts').count('id as count').first();
    if (existingPosts.count > 1) return; // Assume >1 means already seeded beyond welcome post

    const topics = [
        {
            title: 'Dúvida sobre base de cálculo dupla do DIFAL em operações interestaduais',
            category: 'ICMS',
            slug: 'duvida-base-calculo-dupla-difal',
            content: `Estou com um caso de venda de autopeças de SP para MG (consumidor final não contribuinte). 
A legislação de MG exige o cálculo "por dentro" para chegar à base do DIFAL. Alguém tem a memória de cálculo correta ou ferramenta para validar?
Os contadores do cliente estão divergindo sobre a fórmula correta (Convênio 93/2015 atualizado).`,
            author_id: admin.id,
            created_at: knex.fn.now()
        },
        {
            title: 'EFD Contribuições: Erro no Registro C170 após atualização do validador',
            category: 'SPED',
            slug: 'efd-contribuicoes-erro-c170',
            content: `Após atualizar o PVA para a versão 5.0.1, começaram a aparecer erros de validação no C170 referentes à alíquota de PIS/COFINS diferenciada.
Parece que o validador agora exige o vínculo exato com a tabela 4.3.13. Alguém mais passando por isso?`,
            author_id: admin.id,
            created_at: knex.fn.now()
        },
        {
            title: 'Sublimite de receita 2024 do Simples Nacional e o impacto no ISS',
            category: 'Simples Nacional',
            slug: 'sublimite-receita-2024-simples-iss',
            content: `Considerando o sublimite de R$ 3.6M, empresas que ultrapassarem esse teto em 2024 recolhem ICMS/ISS fora do DAS.
Minha dúvida é: o recolhimento retroage ao início do ano calendário se o estouro for menor que 20%?`,
            author_id: admin.id,
            created_at: knex.fn.now()
        },
        {
            title: 'Vale a pena investir em especialização de LLM Tributário agora?',
            category: 'Carreira',
            slug: 'vale-pena-llm-tributario',
            content: `Com a Reforma Tributária batendo na porta, estou pensando em iniciar um LLM. 
A dúvida é: espero a regulamentação das Leis Complementares da IBS/CBS ou o conceito geral já vale o investimento?`,
            author_id: admin.id,
            created_at: knex.fn.now()
        },
        {
            title: 'Crédito de ICMS na entrada de energia elétrica (Industrialização)',
            category: 'ICMS',
            slug: 'credito-icms-energia-eletrica',
            content: `Empresa do Lucro Real, indústria têxtil. O laudo técnico aponta 85% de uso na produção.
Posso creditar 85% direto ou preciso segregar por linha de produção na EFD? O estado é PR.`,
            author_id: admin.id,
            created_at: knex.fn.now()
        }
    ];

    await knex('posts').insert(topics);
};
