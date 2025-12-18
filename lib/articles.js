/**
 * Mock de artigos do blog
 * Em produção, seria substituído por queries ao banco de dados
 */
export const mockArticles = [
    {
        id: '1',
        slug: 'introducao-difal-2023',
        titulo: 'DIFAL 2023: Entenda as Novas Regras',
        resumo: 'Guia completo sobre o diferencial de alíquotas de ICMS e as mudanças implementadas em 2023.',
        conteudo: `
# DIFAL 2023: Entenda as Novas Regras

O Diferencial de Alíquotas (DIFAL) é um dos temas mais importantes para empresas que realizam vendas interestaduais. Com as mudanças implementadas em 2023, é fundamental estar atualizado.

## O que é DIFAL?

O DIFAL é a diferença entre a alíquota interna do estado de destino e a alíquota interestadual aplicada na operação. Esse valor deve ser recolhido para garantir que o estado de destino receba o ICMS correspondente.

## Principais Mudanças em 2023

1. **Partilha do DIFAL**: A divisão entre origem e destino foi atualizada
2. **Responsabilidade**: Mudanças na responsabilidade de recolhimento
3. **Fundo de Combate à Pobreza (FCP)**: Novos estados aderiram ao FCP

## Como Calcular

Nossa calculadora DIFAL automatiza todo o processo, mas é importante entender a fórmula:

\`\`\`
Base de Cálculo Ajustada = (Valor - ICMS Interestadual) / (1 - Alíquota Efetiva)
DIFAL = (Base Ajustada × Alíquota Interna) - ICMS Interestadual
\`\`\`

## Dicas Práticas

- Mantenha-se atualizado sobre as alíquotas de cada estado
- Utilize ferramentas automatizadas para evitar erros
- Consulte sempre a legislação específica do seu estado

Utilize nossa [Calculadora DIFAL](/ferramentas/difal) para facilitar seus cálculos!
    `,
        categoria: 'ICMS',
        autor: 'Equipe Portal Fiscal',
        imagem_url: null,
        publicado: true,
        created_at: '2023-11-01T10:00:00Z',
        updated_at: '2023-11-01T10:00:00Z'
    },
    {
        id: '2',
        slug: 'guia-completo-sped-fiscal',
        titulo: 'SPED Fiscal: Guia Completo para Iniciantes',
        resumo: 'Tudo o que você precisa saber sobre o Sistema Público de Escrituração Digital.',
        conteudo: `
# SPED Fiscal: Guia Completo para Iniciantes

O SPED Fiscal é uma obrigação acessória que faz parte do Sistema Público de Escrituração Digital. Entenda como funciona.

## O que é SPED Fiscal?

O SPED Fiscal (EFD ICMS/IPI) é uma obrigação tributária acessória que substitui a escrituração em papel dos livros fiscais. Através dele, as empresas informam ao Fisco todas as operações de ICMS e IPI.

## Quem Está Obrigado?

- Empresas do Regime Normal de apuração
- Contribuintes do ICMS e/ou IPI
- Empresas com operações interestaduais

## Principais Registros

### Registro 0000 - Abertura do Arquivo
Contém informações cadastrais e o período de apuração.

### Registro C100 - Notas Fiscais
Registra todas as notas fiscais emitidas e recebidas.

### Registro E100 - Apuração do ICMS
Demonstra a apuração mensal do ICMS.

## Prazos de Entrega

O SPED Fiscal deve ser transmitido até o 15º dia do mês subsequente ao período de apuração. Fique atento aos prazos do seu estado!

## Ferramentas Úteis

- Validador PVA (Programa Validador e Assinador)
- Nosso Visualizador de XML
- Sistemas de gestão integrados (ERP)

## Erros Comuns

1. Informações cadastrais incorretas
2. Divergências entre XML e registro
3. Falta de registros obrigatórios
4. Erros na apuração de impostos

Mantenha sua empresa em conformidade e evite multas!
    `,
        categoria: 'SPED',
        autor: 'Dr. Carlos Silva',
        imagem_url: null,
        publicado: true,
        created_at: '2023-10-28T14:30:00Z',
        updated_at: '2023-10-28T14:30:00Z'
    },
    {
        id: '3',
        slug: 'simples-nacional-mudancas-2024',
        titulo: 'Simples Nacional: Prepare-se para 2024',
        resumo: 'As principais mudanças no regime tributário simplificado que entram em vigor no próximo ano.',
        conteudo: `
# Simples Nacional: Prepare-se para 2024

O Simples Nacional é o regime tributário simplificado para micro e pequenas empresas. Veja o que muda em 2024.

## Novos Limites de Faturamento

Para 2024, os limites de faturamento foram atualizados:

- **Microempresa (ME)**: até R$ 360.000,00
- **Empresa de Pequeno Porte (EPP)**: de R$ 360.000,01 a R$ 4.800.000,00

## Anexos do Simples

O Simples Nacional é dividido em anexos conforme a atividade:

### Anexo I - Comércio
Alíquotas de 4% a 19%, dependendo da receita bruta.

### Anexo II - Indústria
Para empresas que fabricam produtos, com alíquotas de 4,5% a 30%.

### Anexo III - Serviços
Atividades de serviços com retenção na fonte, de 6% a 33%.

### Anexo IV - Serviços
Outros serviços não inclusos no Anexo III.

### Anexo V - Serviços Específicos
Serviços com maior carga tributária, de 15,5% a 30,5%.

## Fator R

O Fator R é a relação entre a folha de salários e a receita bruta. Empresas com Fator R ≥ 28% podem se enquadrar no Anexo III em vez do V, reduzindo a carga tributária.

## Dicas para 2024

1. Revise seu enquadramento
2. Calcule o Fator R mensalmente
3. Planeje investimentos para otimização tributária
4. Mantenha a folha de pagamento organizada

## Ferramentas Úteis

Use nossa calculadora para simular diferentes cenários e encontrar a melhor estratégia tributária para sua empresa!

---

**Atenção**: Este conteúdo é informativo. Para decisões específicas, consulte um contador.
    `,
        categoria: 'Simples Nacional',
        autor: 'Mariana Costa',
        imagem_url: null,
        publicado: true,
        created_at: '2023-12-05T09:00:00Z',
        updated_at: '2023-12-05T09:00:00Z'
    }
];

/**
 * Buscar todos os artigos
 */
export function getAllArticles() {
    return mockArticles.filter(a => a.publicado);
}

/**
 * Buscar artigo por slug
 */
export function getArticleBySlug(slug) {
    return mockArticles.find(a => a.slug === slug && a.publicado);
}

/**
 * Buscar artigos por categoria
 */
export function getArticlesByCategory(categoria) {
    return mockArticles.filter(a => a.categoria === categoria && a.publicado);
}

/**
 * Obter categorias únicas
 */
export function getCategories() {
    const categories = [...new Set(mockArticles.map(a => a.categoria))];
    return categories;
}
