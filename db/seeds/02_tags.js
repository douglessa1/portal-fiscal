/**
 * Seed initial tags for the community
 */
exports.seed = async function (knex) {
    // Delete existing tags first
    await knex('tags').del();

    // Insert predefined tags
    await knex('tags').insert([
        { name: 'ICMS', slug: 'icms', color: '#3b82f6', description: 'Imposto sobre Circulação de Mercadorias e Serviços' },
        { name: 'ISS', slug: 'iss', color: '#8b5cf6', description: 'Imposto Sobre Serviços' },
        { name: 'SPED', slug: 'sped', color: '#f59e0b', description: 'Sistema Público de Escrituração Digital' },
        { name: 'DIFAL', slug: 'difal', color: '#ef4444', description: 'Diferencial de Alíquota' },
        { name: 'Simples Nacional', slug: 'simples-nacional', color: '#10b981', description: 'Regime tributário simplificado' },
        { name: 'NFe', slug: 'nfe', color: '#06b6d4', description: 'Nota Fiscal Eletrônica' },
        { name: 'Reforma Tributária', slug: 'reforma-tributaria', color: '#ec4899', description: 'Nova reforma tributária brasileira' },
        { name: 'IR/CSLL', slug: 'ir-csll', color: '#f97316', description: 'Imposto de Renda e Contribuição Social' },
        { name: 'PIS/COFINS', slug: 'pis-cofins', color: '#14b8a6', description: 'Contribuições sociais' },
        { name: 'ST', slug: 'st', color: '#a855f7', description: 'Substituição Tributária' },
        { name: 'Bloco K', slug: 'bloco-k', color: '#84cc16', description: 'Bloco K do SPED Fiscal' },
        { name: 'Certificado Digital', slug: 'certificado-digital', color: '#6366f1', description: 'Certificação digital e assinatura' },
        { name: 'EFD', slug: 'efd', color: '#f43f5e', description: 'Escrituração Fiscal Digital' },
        { name: 'Contabilidade', slug: 'contabilidade', color: '#0ea5e9', description: 'Questões contábeis gerais' }
    ]);

    console.log('✅ Tags seeded successfully');
};
