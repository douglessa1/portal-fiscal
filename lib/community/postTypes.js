/**
 * Post Types - Definição dos 4 tipos de post com campos obrigatórios
 * Cada tipo tem viés legal e compatibilidade com Reforma Tributária
 */

export const UF_LIST = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
];

export const TRIBUTOS = [
    { value: 'icms', label: 'ICMS' },
    { value: 'iss', label: 'ISS' },
    { value: 'pis', label: 'PIS' },
    { value: 'cofins', label: 'COFINS' },
    { value: 'ipi', label: 'IPI' },
    { value: 'irpj', label: 'IRPJ' },
    { value: 'csll', label: 'CSLL' },
    { value: 'ibs', label: 'IBS (Reforma)' },
    { value: 'cbs', label: 'CBS (Reforma)' },
    { value: 'is', label: 'IS (Reforma)' },
    { value: 'outro', label: 'Outro' }
];

export const REGIMES = [
    { value: 'mei', label: 'MEI' },
    { value: 'simples', label: 'Simples Nacional' },
    { value: 'presumido', label: 'Lucro Presumido' },
    { value: 'real', label: 'Lucro Real' },
    { value: 'imune', label: 'Imune/Isento' }
];

export const TIPOS_OPERACAO = [
    { value: 'venda', label: 'Venda' },
    { value: 'transferencia', label: 'Transferência' },
    { value: 'servico', label: 'Prestação de Serviço' },
    { value: 'industrializacao', label: 'Industrialização por Encomenda' },
    { value: 'devolucao', label: 'Devolução' },
    { value: 'remessa', label: 'Remessa (Consignação, Demo, etc)' },
    { value: 'importacao', label: 'Importação' },
    { value: 'exportacao', label: 'Exportação' }
];

export const SISTEMAS_SEFAZ = [
    { value: 'sefaz_estadual', label: 'SEFAZ Estadual' },
    { value: 'sefaz_nacional', label: 'SEFAZ Nacional' },
    { value: 'prefeitura', label: 'Prefeitura / NFS-e' },
    { value: 'receita_federal', label: 'Receita Federal (e-CAC)' },
    { value: 'sped', label: 'Sistema SPED' },
    { value: 'outro', label: 'Outro' }
];

export const DOCUMENTOS_FISCAIS = [
    { value: 'nfe', label: 'NF-e (modelo 55)' },
    { value: 'nfce', label: 'NFC-e (modelo 65)' },
    { value: 'cte', label: 'CT-e' },
    { value: 'mdfe', label: 'MDF-e' },
    { value: 'nfse', label: 'NFS-e' },
    { value: 'cfe', label: 'CF-e SAT' },
    { value: 'efd_icms', label: 'EFD ICMS/IPI' },
    { value: 'efd_contrib', label: 'EFD Contribuições' },
    { value: 'ecf', label: 'ECF' }
];

export const TIPOS_NORMA = [
    { value: 'lei_complementar', label: 'Lei Complementar' },
    { value: 'lei_ordinaria', label: 'Lei Ordinária' },
    { value: 'decreto', label: 'Decreto' },
    { value: 'convenio_icms', label: 'Convênio ICMS' },
    { value: 'ajuste_sinief', label: 'Ajuste SINIEF' },
    { value: 'protocolo_icms', label: 'Protocolo ICMS' },
    { value: 'instrucao_normativa', label: 'Instrução Normativa' },
    { value: 'solucao_consulta', label: 'Solução de Consulta' },
    { value: 'nota_tecnica', label: 'Nota Técnica' },
    { value: 'portaria', label: 'Portaria' }
];

// ============================================
// DEFINIÇÃO DOS 4 TIPOS DE POST
// ============================================

export const POST_TYPES = {
    duvida_pratica: {
        id: 'duvida_pratica',
        label: 'Dúvida Prática',
        description: 'Questão operacional com enquadramento legal',
        icon: '❓',
        color: '#3b82f6',
        requiredPlan: 'free',
        guide: `Descreva o cenário da operação conforme a legislação vigente:

1. **Enquadramento atual**
   - Tributo envolvido
   - Regime tributário
   - UF de origem e destino
   - Tipo de operação

2. **Base legal conhecida** (se houver)
   - Artigo, decreto, convênio, ajuste SINIEF ou solução de consulta

3. **Dúvida objetiva**
   - Qual é o ponto de conflito, interpretação ou cálculo?`,
        fields: [
            { id: 'tributo', label: 'Tributo Envolvido', type: 'select', options: TRIBUTOS, required: true },
            { id: 'regime', label: 'Regime Tributário', type: 'select', options: REGIMES, required: true },
            { id: 'uf_origem', label: 'UF Origem', type: 'uf', required: true },
            { id: 'uf_destino', label: 'UF Destino', type: 'uf', required: false },
            { id: 'tipo_operacao', label: 'Tipo de Operação', type: 'select', options: TIPOS_OPERACAO, required: true },
            { id: 'base_legal', label: 'Base Legal Citada', type: 'text', placeholder: 'Ex: Art. 155, II CF; LC 87/96 Art. 12; Convênio ICMS 142/2018', required: false },
            { id: 'base_legal_desconhecida', label: 'Desconheço a base legal aplicável', type: 'checkbox', required: false },
            { id: 'content', label: 'Dúvida Objetiva', type: 'textarea', minLength: 300, placeholder: 'Descreva sua dúvida de forma clara, indicando o ponto de conflito ou interpretação...', required: true }
        ],
        validation: (data) => {
            if (!data.base_legal && !data.base_legal_desconhecida) {
                return 'Informe a base legal ou marque "Desconheço a base legal"';
            }
            if (data.content && data.content.length < 300) {
                return `Dúvida muito curta. Mínimo 300 caracteres (atual: ${data.content.length})`;
            }
            return null;
        }
    },

    discussao_tecnica: {
        id: 'discussao_tecnica',
        label: 'Discussão Técnica',
        description: 'Comparativo entre regra atual e Reforma Tributária',
        icon: '⚖️',
        color: '#8b5cf6',
        requiredPlan: 'pro',
        guide: `Esta discussão envolve interpretação técnica ou impacto normativo:

1. **Regra atual**
   - Tributo atual aplicado
   - Norma vigente

2. **Impacto da Reforma Tributária**
   - IBS / CBS / IS
   - Fase de transição (2026–2032)

3. **Ponto de debate**
   - Conflito interpretativo?
   - Risco fiscal?
   - Impacto financeiro?`,
        fields: [
            { id: 'tributo_atual', label: 'Tributo Atual', type: 'select', options: TRIBUTOS.filter(t => !['ibs', 'cbs', 'is'].includes(t.value)), required: true },
            { id: 'dispositivo_atual', label: 'Dispositivo Legal Atual', type: 'text', placeholder: 'Ex: LC 87/96, Lei 12.973/14, Decreto 9.580/18', required: true },
            {
                id: 'tributo_reforma', label: 'Tributo da Reforma Relacionado', type: 'multiselect', options: [
                    { value: 'ibs', label: 'IBS' },
                    { value: 'cbs', label: 'CBS' },
                    { value: 'is', label: 'IS (Imposto Seletivo)' }
                ], required: true
            },
            {
                id: 'fase_transicao', label: 'Fase de Transição Aplicável', type: 'select', options: [
                    { value: '2026', label: '2026 - Início CBS' },
                    { value: '2027', label: '2027 - Teste IBS' },
                    { value: '2028', label: '2028 - Transição ICMS/ISS' },
                    { value: '2029_2032', label: '2029-2032 - Redução gradual' },
                    { value: '2033', label: '2033 - Extinção ICMS/ISS' },
                    { value: 'indefinido', label: 'Indefinido / Em análise' }
                ], required: true
            },
            {
                id: 'tipo_debate', label: 'Tipo de Debate', type: 'multiselect', options: [
                    { value: 'conflito', label: 'Conflito Interpretativo' },
                    { value: 'risco', label: 'Risco Fiscal' },
                    { value: 'financeiro', label: 'Impacto Financeiro' },
                    { value: 'operacional', label: 'Impacto Operacional' }
                ], required: true
            },
            { id: 'content', label: 'Texto da Discussão', type: 'textarea', minLength: 400, placeholder: 'Desenvolva seu ponto de debate com fundamentação técnica...', required: true }
        ],
        validation: (data) => {
            if (data.content && data.content.length < 400) {
                return `Discussão muito curta. Mínimo 400 caracteres (atual: ${data.content.length})`;
            }
            return null;
        }
    },

    erro_sistema: {
        id: 'erro_sistema',
        label: 'Erro de Sistema / SEFAZ',
        description: 'Erro em ambiente fiscal eletrônico com compliance',
        icon: '🚨',
        color: '#ef4444',
        requiredPlan: 'free',
        guide: `Relate o erro ocorrido em ambiente fiscal eletrônico:

1. **Sistema**
   - SEFAZ Estadual / Nacional / Prefeitura
   - Ambiente: Produção / Homologação

2. **Documento fiscal**
   - NF-e / NFC-e / CT-e / NFS-e

3. **Código do erro**
   - Código e mensagem retornada

4. **Base normativa**
   - Ajuste SINIEF / Manual / Nota Técnica (se conhecida)`,
        fields: [
            { id: 'sistema', label: 'Sistema', type: 'select', options: SISTEMAS_SEFAZ, required: true },
            { id: 'uf', label: 'UF', type: 'uf', required: true },
            {
                id: 'ambiente', label: 'Ambiente', type: 'select', options: [
                    { value: 'producao', label: 'Produção' },
                    { value: 'homologacao', label: 'Homologação' }
                ], required: true
            },
            { id: 'documento', label: 'Documento Fiscal', type: 'select', options: DOCUMENTOS_FISCAIS, required: true },
            { id: 'codigo_erro', label: 'Código do Erro', type: 'text', placeholder: 'Ex: 539, 225, ERRO-00001', required: true },
            { id: 'mensagem_erro', label: 'Mensagem Retornada', type: 'text', placeholder: 'Cole a mensagem de erro aqui', required: true },
            { id: 'nota_tecnica', label: 'Nota Técnica / Manual Relacionado', type: 'text', placeholder: 'Ex: NT 2023.004, MOC 7.0', required: false },
            { id: 'content', label: 'Descrição Detalhada', type: 'textarea', minLength: 150, placeholder: 'Descreva o contexto do erro, o que estava tentando fazer e passos para reproduzir...', required: true }
        ],
        validation: (data) => {
            if (data.content && data.content.length < 150) {
                return `Descrição muito curta. Mínimo 150 caracteres (atual: ${data.content.length})`;
            }
            return null;
        }
    },

    interpretacao_legal: {
        id: 'interpretacao_legal',
        label: 'Interpretação Legal',
        description: 'Análise normativa com impacto da Reforma',
        icon: '📜',
        color: '#f59e0b',
        requiredPlan: 'pro',
        guide: `Esta publicação trata de interpretação normativa:

1. **Dispositivo legal**
   - Lei / Decreto / Convênio / Solução de Consulta

2. **Entendimento atual**
   - Como é aplicado hoje

3. **Possível impacto com a Reforma Tributária**
   - Manutenção?
   - Revogação?
   - Transição?`,
        fields: [
            { id: 'tipo_norma', label: 'Tipo de Norma', type: 'select', options: TIPOS_NORMA, required: true },
            { id: 'numero_norma', label: 'Número / Referência', type: 'text', placeholder: 'Ex: LC 87/1996, Convênio ICMS 142/2018', required: true },
            { id: 'artigo_especifico', label: 'Artigo / Cláusula Específica', type: 'text', placeholder: 'Ex: Art. 12, §2º / Cláusula 3ª', required: false },
            { id: 'entendimento_atual', label: 'Entendimento/Aplicação Atual', type: 'textarea', placeholder: 'Como essa norma é interpretada e aplicada hoje?', required: true },
            {
                id: 'impacto_reforma', label: 'Impactada pela Reforma?', type: 'select', options: [
                    { value: 'sim', label: 'Sim - Será alterada/revogada' },
                    { value: 'nao', label: 'Não - Mantida' },
                    { value: 'parcial', label: 'Parcialmente - Transição' },
                    { value: 'analise', label: 'Em análise' }
                ], required: true
            },
            { id: 'content', label: 'Texto Interpretativo', type: 'textarea', minLength: 500, placeholder: 'Desenvolva sua interpretação com fundamentação...', required: true }
        ],
        validation: (data) => {
            if (data.content && data.content.length < 500) {
                return `Interpretação muito curta. Mínimo 500 caracteres (atual: ${data.content.length})`;
            }
            return null;
        }
    }
};

/**
 * Verifica se usuário tem acesso a um tipo de post
 */
export function canAccessPostType(postType, userPlan) {
    const type = POST_TYPES[postType];
    if (!type) return false;

    if (type.requiredPlan === 'free') return true;
    if (type.requiredPlan === 'pro') return userPlan === 'pro' || userPlan === 'auditor';
    if (type.requiredPlan === 'auditor') return userPlan === 'auditor';

    return false;
}

/**
 * Valida dados de um post baseado no tipo
 */
export function validatePostData(postType, data) {
    const type = POST_TYPES[postType];
    if (!type) return 'Tipo de post inválido';

    // Validar campos obrigatórios
    for (const field of type.fields) {
        if (field.required && !data[field.id]) {
            return `Campo obrigatório: ${field.label}`;
        }
    }

    // Executar validação customizada
    if (type.validation) {
        const error = type.validation(data);
        if (error) return error;
    }

    return null;
}

export default POST_TYPES;
