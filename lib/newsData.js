
export const CATEGORIAS = [
    { id: 'todas', nome: 'Todas', cor: '#6b7280' },
    { id: 'icms', nome: 'ICMS', cor: '#3b82f6' },
    { id: 'federal', nome: 'Federal', cor: '#f59e0b' },
    { id: 'reforma', nome: 'Reforma Tributária', cor: '#8b5cf6' },
    { id: 'jurisprudencia', nome: 'Jurisprudência', cor: '#10b981' },
    { id: 'alertas', nome: 'Alertas Urgentes', cor: '#ef4444' },
];

export const MOCK_NEWS = [
    {
        id: 1,
        slug: 'reforma-tributaria-ibs-cbs-2026',
        titulo: 'Reforma Tributária: IBS e CBS entram em vigor em 2026',
        resumo: 'Entenda as mudanças que a Reforma Tributária trará para empresas. O novo sistema dual de IBS e CBS substitui 5 tributos atuais.',
        autor: 'Dr. Ricardo Mendes',
        created_at: '2024-12-17',
        categoria: 'reforma',
        visualizacoes: 15420,
        comentarios: 234,
        tempo_leitura: 8,
        destaque: true,
        imagem_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
        conteudo: `
            <h2>O Novo Sistema Tributário Nacional</h2>
            <p>A aprovação da Emenda Constitucional 132/2023 marcou o início de uma nova era para o sistema tributário brasileiro. A principal mudança é a unificação de cinco tributos sobre o consumo (PIS, COFINS, IPI, ICMS e ISS) em um modelo de IVA Dual, composto pela Contribuição sobre Bens e Serviços (CBS) e pelo Imposto sobre Bens e Serviços (IBS).</p>
            
            <h3>O que são IBS e CBS?</h3>
            <p>A <strong>CBS</strong> (competência federal) substituirá o PIS, a COFINS e o IPI. Já o <strong>IBS</strong> (competência compartilhada entre estados e municípios) substituirá o ICMS e o ISS. A ideia é simplificar a apuração, eliminar a cumulatividade plena e garantir transparência na carga tributária.</p>

            <h3>Cronograma de Implementação</h3>
            <ul>
                <li><strong>2026:</strong> Início da fase de testes com alíquota de 0,9% para a CBS e 0,1% para o IBS, compensáveis com PIS/COFINS.</li>
                <li><strong>2027:</strong> Extinção do PIS e da COFINS e implementação plena da CBS. Redução a zero das alíquotas de IPI (exceto para produtos da Zona Franca de Manaus).</li>
                <li><strong>2029 a 2032:</strong> Redução gradual das alíquotas de ICMS e ISS, proporcionalmente ao aumento da alíquota do IBS.</li>
                <li><strong>2033:</strong> Vigência integral do novo sistema e extinção definitiva do antigo regime.</li>
            </ul>

            <h3>Impactos para as Empresas</h3>
            <p>As empresas precisarão adaptar seus sistemas de ERP e contabilidade para lidar com o split payment e as novas regras de crédito, que prometem ser mais amplas (crédito financeiro) do que no modelo atual (crédito físico).</p>
        `
    },
    {
        id: 2,
        slug: 'difal-2025-novas-aliquotas',
        titulo: 'DIFAL 2025: Estados divulgam novas alíquotas',
        resumo: 'Confira a tabela completa de alíquotas de DIFAL por estado e as mudanças que entram em vigor em janeiro.',
        autor: 'Ana Paula Silva',
        created_at: '2024-12-16',
        categoria: 'icms',
        visualizacoes: 12350,
        comentarios: 156,
        tempo_leitura: 5,
        destaque: true,
        imagem_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=1000',
        conteudo: `
            <h2>Atualização das Alíquotas Internas de ICMS</h2>
            <p>Diversos estados anunciaram o aumento de suas alíquotas modais de ICMS para 2024 e 2025, visando proteger a arrecadação futura no cenário da Reforma Tributária. Isso impacta diretamente o cálculo do Diferencial de Alíquotas (DIFAL) nas operações interestaduais para consumidor final.</p>

            <h3>Estados com Aumento Confirmado</h3>
            <ul>
                <li><strong>Ceará:</strong> Aumento de 18% para 20%.</li>
                <li><strong>Pernambuco:</strong> Aumento de 18% para 20,5%.</li>
                <li><strong>Distrito Federal:</strong> Aumento para 20%.</li>
                <li><strong>Rio de Janeiro:</strong> Manutenção da alíquota de 20% (com FCP incluso em alguns casos chega a 22%).</li>
            </ul>

            <h3>Como Calcular o Novo DIFAL</h3>
            <p>O cálculo continua seguindo a fórmula: <code>(Base Única * Alíquota Interna Destino) - (Base Única * Alíquota Interestadual)</code>. No entanto, o aumento da alíquota interna amplia o "gap" a ser recolhido para o estado de destino.</p>
            
            <p>Utilize nossa <a href="/ferramentas/difal" class="text-primary font-bold hover:underline">Calculadora DIFAL</a> atualizada para simular os novos cenários.</p>
        `
    },
    {
        id: 3,
        slug: 'pis-cofins-creditos-2025',
        titulo: 'PIS/COFINS: Como recuperar créditos tributários',
        resumo: 'Descubra os créditos que sua empresa pode estar deixando de aproveitar e aprenda como recuperá-los.',
        autor: 'Dr. Marcos Almeida',
        created_at: '2024-12-15',
        categoria: 'federal',
        visualizacoes: 9870,
        comentarios: 112,
        tempo_leitura: 10,
        destaque: false,
        imagem_url: null,
        conteudo: `
            <h2>Oportunidades de Crédito de PIS/COFINS</h2>
            <p>No regime não-cumulativo, o PIS e a COFINS permitem o aproveitamento de créditos sobre diversos insumos. No entanto, o conceito de "insumo" foi ampliado pelo STJ em 2018, permitindo novas oportunidades de recuperação.</p>

            <h3>O Que Pode Gerar Crédito?</h3>
            <ul>
                <li>Insumos essenciais e relevantes para a atividade produtiva.</li>
                <li>Energia elétrica consumida nos estabelecimentos.</li>
                <li>Aluguéis de prédios, máquinas e equipamentos.</li>
                <li>Armazenagem de mercadoria e frete na operação de venda.</li>
            </ul>

            <h3>Exclusão do ICMS da Base de Cálculo</h3>
            <p>A "Tese do Século" (exclusão do ICMS da base de cálculo do PIS/COFINS) continua gerando dúvidas operacionais. É fundamental ajustar a parametrização do sistema emissor para não pagar tributo a maior.</p>
        `
    }
];
