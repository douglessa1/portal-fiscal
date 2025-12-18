/**
 * Base de Dados de CFOPs
 * Código Fiscal de Operações e Prestações
 */

export const cfops = [
    // ENTRADAS - Grupo 1
    {
        codigo: '1101',
        descricao: 'Compra para industrialização',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado',
        observacao: 'Classificam-se neste código as compras de mercadorias a serem utilizadas em processo de industrialização.'
    },
    {
        codigo: '1102',
        descricao: 'Compra para comercialização',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado',
        observacao: 'Classificam-se neste código as compras de mercadorias a serem comercializadas.'
    },
    {
        codigo: '1111',
        descricao: 'Compra para industrialização de mercadoria recebida anteriormente em consignação industrial',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '1113',
        descricao: 'Compra para comercialização, de mercadoria recebida anteriormente em consignação mercantil',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '1116',
        descricao: 'Compra para industrialização originada de encomenda para recebimento futuro',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '1117',
        descricao: 'Compra para comercialização originada de encomenda para recebimento futuro',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '1118',
        descricao: 'Compra de mercadoria para comercialização pelo adquirente originário, entregue pelo vendedor remetente ao destinatário, em venda à ordem',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '1120',
        descricao: 'Compra para industrialização, em venda à ordem, já recebida do vendedor remetente',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado'
    },

    // ENTRADAS INTERESTADUAIS - Grupo 2
    {
        codigo: '2101',
        descricao: 'Compra para industrialização',
        natureza: 'ENTRADA',
        aplicacao: 'Fora do Estado',
        observacao: 'Classificam-se neste código as compras de mercadorias a serem utilizadas em processo de industrialização, de outros Estados.'
    },
    {
        codigo: '2102',
        descricao: 'Compra para comercialização',
        natureza: 'ENTRADA',
        aplicacao: 'Fora do Estado',
        observacao: 'Classificam-se neste código as compras de mercadorias a serem comercializadas, de outros Estados.'
    },
    {
        codigo: '2111',
        descricao: 'Compra para industrialização de mercadoria recebida anteriormente em consignação industrial',
        natureza: 'ENTRADA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '2113',
        descricao: 'Compra para comercialização, de mercadoria recebida anteriormente em consignação mercantil',
        natureza: 'ENTRADA',
        aplicacao: 'Fora do Estado'
    },

    // SAÍDAS - Grupo 5
    {
        codigo: '5101',
        descricao: 'Venda de produção do estabelecimento',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado',
        observacao: 'Classificam-se neste código as vendas de produtos industrializados no estabelecimento.'
    },
    {
        codigo: '5102',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado',
        observacao: 'Classificam-se neste código as vendas de mercadorias adquiridas ou recebidas de terceiros para industrialização ou comercialização.'
    },
    {
        codigo: '5103',
        descricao: 'Venda de produção do estabelecimento, efetuada fora do estabelecimento',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '5104',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros, efetuada fora do estabelecimento',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '5109',
        descricao: 'Venda de produção do estabelecimento, destinada à Zona Franca de Manaus ou Áreas de Livre Comércio',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '5110',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros, destinada à Zona Franca de Manaus ou Áreas de Livre Comércio',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '5116',
        descricao: 'Venda de produção do estabelecimento originada de encomenda para entrega futura',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '5117',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros originada de encomenda para entrega futura',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },

    // SAÍDAS INTERESTADUAIS - Grupo 6
    {
        codigo: '6101',
        descricao: 'Venda de produção do estabelecimento',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado',
        observacao: 'Classificam-se neste código as vendas de produtos industrializados no estabelecimento para outros Estados.'
    },
    {
        codigo: '6102',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado',
        observacao: 'Classificam-se neste código as vendas de mercadorias adquiridas ou recebidas de terceiros para outros Estados.'
    },
    {
        codigo: '6103',
        descricao: 'Venda de produção do estabelecimento, efetuada fora do estabelecimento',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '6104',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros, efetuada fora do estabelecimento',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '6107',
        descricao: 'Venda de produção do estabelecimento, destinada a não contribuinte',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '6108',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros, destinada a não contribuinte',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '6109',
        descricao: 'Venda de produção do estabelecimento, destinada à Zona Franca de Manaus ou Áreas de Livre Comércio',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '6110',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros, destinada à Zona Franca de Manaus ou Áreas de Livre Comércio',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },

    // DEVOLUÇÕES E RETORNOS
    {
        codigo: '1201',
        descricao: 'Devolução de venda de produção do estabelecimento',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '1202',
        descricao: 'Devolução de venda de mercadoria adquirida ou recebida de terceiros',
        natureza: 'ENTRADA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '2201',
        descricao: 'Devolução de venda de produção do estabelecimento',
        natureza: 'ENTRADA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '2202',
        descricao: 'Devolução de venda de mercadoria adquirida ou recebida de terceiros',
        natureza: 'ENTRADA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '5201',
        descricao: 'Devolução de compra para industrialização',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '5202',
        descricao: 'Devolução de compra para comercialização',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '6201',
        descricao: 'Devolução de compra para industrialização',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '6202',
        descricao: 'Devolução de compra para comercialização',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },

    // TRANSFERÊNCIAS
    {
        codigo: '5151',
        descricao: 'Transferência de produção do estabelecimento',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '5152',
        descricao: 'Transferência de mercadoria adquirida ou recebida de terceiros',
        natureza: 'SAÍDA',
        aplicacao: 'Dentro do Estado'
    },
    {
        codigo: '6151',
        descricao: 'Transferência de produção do estabelecimento',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    },
    {
        codigo: '6152',
        descricao: 'Transferência de mercadoria adquirida ou recebida de terceiros',
        natureza: 'SAÍDA',
        aplicacao: 'Fora do Estado'
    }
];

/**
 * Buscar CFOP por código
 */
export function buscarCFOPPorCodigo(codigo) {
    return cfops.find(cfop => cfop.codigo === codigo);
}

/**
 * Buscar CFOPs por descrição (busca parcial)
 */
export function buscarCFOPPorDescricao(termo) {
    const termoLower = termo.toLowerCase();
    return cfops.filter(cfop =>
        cfop.descricao.toLowerCase().includes(termoLower)
    );
}

/**
 * Filtrar CFOPs por natureza
 */
export function filtrarPorNatureza(natureza) {
    return cfops.filter(cfop => cfop.natureza === natureza);
}

/**
 * Filtrar CFOPs por aplicação
 */
export function filtrarPorAplicacao(aplicacao) {
    return cfops.filter(cfop => cfop.aplicacao === aplicacao);
}

/**
 * Obter todos os CFOPs
 */
export function obterTodosCFOPs() {
    return cfops;
}
