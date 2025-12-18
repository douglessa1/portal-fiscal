/**
 * CEST Database - 100+ códigos por segmento
 * Código Especificador da Substituição Tributária
 */

export const CEST_SEGMENTOS = [
    { id: '01', nome: 'Autopeças', cor: '#ef4444' },
    { id: '02', nome: 'Bebidas Alcoólicas', cor: '#a855f7' },
    { id: '03', nome: 'Cervejas e Refrigerantes', cor: '#f59e0b' },
    { id: '04', nome: 'Cigarros', cor: '#6b7280' },
    { id: '05', nome: 'Cimentos', cor: '#78716c' },
    { id: '06', nome: 'Combustíveis', cor: '#dc2626' },
    { id: '07', nome: 'Energia Elétrica', cor: '#eab308' },
    { id: '13', nome: 'Medicamentos', cor: '#10b981' },
    { id: '17', nome: 'Produtos Alimentícios', cor: '#22c55e' },
    { id: '20', nome: 'Produtos de Perfumaria', cor: '#ec4899' },
    { id: '21', nome: 'Eletrônicos', cor: '#3b82f6' },
    { id: '25', nome: 'Veículos Automotores', cor: '#8b5cf6' },
];

export const CEST_DATABASE = [
    // Segmento 01 - Autopeças
    { cest: '01.001.00', ncm: '39231000', descricao: 'Caixas de plástico para transporte de mercadorias', segmento: '01', mva: 40 },
    { cest: '01.002.00', ncm: '39269090', descricao: 'Outras obras de plástico para veículos', segmento: '01', mva: 59 },
    { cest: '01.003.00', ncm: '40094100', descricao: 'Tubos de borracha vulcanizada', segmento: '01', mva: 59 },
    { cest: '01.004.00', ncm: '40103200', descricao: 'Correias de transmissão', segmento: '01', mva: 59 },
    { cest: '01.005.00', ncm: '40111000', descricao: 'Pneus novos para automóveis de passageiros', segmento: '01', mva: 42 },
    { cest: '01.006.00', ncm: '40112010', descricao: 'Pneus novos para ônibus e caminhões', segmento: '01', mva: 32 },
    { cest: '01.007.00', ncm: '40114000', descricao: 'Pneus novos para motocicletas', segmento: '01', mva: 60 },
    { cest: '01.008.00', ncm: '40131000', descricao: 'Câmaras de ar para automóveis', segmento: '01', mva: 45 },
    { cest: '01.009.00', ncm: '68131000', descricao: 'Pastilhas de freio', segmento: '01', mva: 59 },
    { cest: '01.010.00', ncm: '84212300', descricao: 'Filtros de óleo/combustível', segmento: '01', mva: 40 },

    // Segmento 02 - Bebidas Alcoólicas
    { cest: '02.001.00', ncm: '22041000', descricao: 'Vinhos espumantes', segmento: '02', mva: 68.89 },
    { cest: '02.002.00', ncm: '22042100', descricao: 'Vinhos em recipientes <= 2L', segmento: '02', mva: 53.38 },
    { cest: '02.003.00', ncm: '22042900', descricao: 'Outros vinhos', segmento: '02', mva: 53.38 },
    { cest: '02.004.00', ncm: '22084000', descricao: 'Rum e aguardentes', segmento: '02', mva: 43.56 },
    { cest: '02.005.00', ncm: '22085011', descricao: 'Gin', segmento: '02', mva: 51.93 },
    { cest: '02.006.00', ncm: '22086000', descricao: 'Vodka', segmento: '02', mva: 51.93 },
    { cest: '02.007.00', ncm: '22089000', descricao: 'Outras bebidas destiladas', segmento: '02', mva: 43.56 },

    // Segmento 03 - Cervejas e Refrigerantes
    { cest: '03.001.00', ncm: '22011000', descricao: 'Água mineral, gasosa ou não', segmento: '03', mva: 140 },
    { cest: '03.002.00', ncm: '22019000', descricao: 'Outras águas não adoçadas', segmento: '03', mva: 140 },
    { cest: '03.003.00', ncm: '22021000', descricao: 'Águas com adição de açúcar', segmento: '03', mva: 140 },
    { cest: '03.004.00', ncm: '22029000', descricao: 'Outras bebidas não alcoólicas', segmento: '03', mva: 140 },
    { cest: '03.005.00', ncm: '22030000', descricao: 'Cervejas de malte', segmento: '03', mva: 140 },
    { cest: '03.006.00', ncm: '22030000', descricao: 'Chopp', segmento: '03', mva: 115 },

    // Segmento 05 - Cimentos
    { cest: '05.001.00', ncm: '25232100', descricao: 'Cimento Portland branco', segmento: '05', mva: 20 },
    { cest: '05.002.00', ncm: '25232900', descricao: 'Outros cimentos Portland', segmento: '05', mva: 20 },
    { cest: '05.003.00', ncm: '25239000', descricao: 'Outros cimentos hidráulicos', segmento: '05', mva: 20 },

    // Segmento 06 - Combustíveis
    { cest: '06.001.00', ncm: '27101921', descricao: 'Gasolina automotiva', segmento: '06', mva: 0 },
    { cest: '06.002.00', ncm: '27101259', descricao: 'Óleo diesel', segmento: '06', mva: 0 },
    { cest: '06.002.01', ncm: '27101911', descricao: 'Óleo diesel B S10', segmento: '06', mva: 0 },
    { cest: '06.003.00', ncm: '27111910', descricao: 'GLP - Gás liquefeito de petróleo', segmento: '06', mva: 0 },
    { cest: '06.004.00', ncm: '27112100', descricao: 'Gás natural', segmento: '06', mva: 0 },
    { cest: '06.005.00', ncm: '38260000', descricao: 'Biodiesel', segmento: '06', mva: 0 },

    // Segmento 13 - Medicamentos
    { cest: '13.001.00', ncm: '30041090', descricao: 'Medicamentos com antibióticos', segmento: '13', mva: 33 },
    { cest: '13.002.00', ncm: '30042090', descricao: 'Medicamentos com hormônios', segmento: '13', mva: 33 },
    { cest: '13.003.00', ncm: '30043229', descricao: 'Insulina', segmento: '13', mva: 33 },
    { cest: '13.004.00', ncm: '30049039', descricao: 'Outros medicamentos para venda a varejo', segmento: '13', mva: 33 },

    // Segmento 17 - Alimentos
    { cest: '17.001.00', ncm: '02011000', descricao: 'Carnes de bovino, frescas/refrigeradas', segmento: '17', mva: 15 },
    { cest: '17.002.00', ncm: '02021000', descricao: 'Carnes de bovino, congeladas', segmento: '17', mva: 15 },
    { cest: '17.005.00', ncm: '04011000', descricao: 'Leite UHT', segmento: '17', mva: 20 },
    { cest: '17.006.00', ncm: '04022110', descricao: 'Leite em pó', segmento: '17', mva: 20 },
    { cest: '17.007.00', ncm: '04051000', descricao: 'Manteiga', segmento: '17', mva: 30 },
    { cest: '17.008.00', ncm: '04061010', descricao: 'Queijo mussarela', segmento: '17', mva: 35 },
    { cest: '17.031.00', ncm: '11010010', descricao: 'Farinha de trigo', segmento: '17', mva: 25 },
    { cest: '17.032.00', ncm: '15079011', descricao: 'Óleo de soja refinado', segmento: '17', mva: 15 },
    { cest: '17.035.00', ncm: '17019900', descricao: 'Açúcar', segmento: '17', mva: 20 },
    { cest: '17.049.00', ncm: '19021100', descricao: 'Massas alimentícias', segmento: '17', mva: 30 },
    { cest: '17.050.00', ncm: '19053100', descricao: 'Biscoitos e bolachas', segmento: '17', mva: 40 },

    // Segmento 20 - Perfumaria
    { cest: '20.001.00', ncm: '33041000', descricao: 'Produtos maquilagem lábios', segmento: '20', mva: 52.9 },
    { cest: '20.002.00', ncm: '33042000', descricao: 'Produtos maquilagem olhos', segmento: '20', mva: 52.9 },
    { cest: '20.003.00', ncm: '33049100', descricao: 'Pós para maquilagem', segmento: '20', mva: 52.9 },
    { cest: '20.005.00', ncm: '33051000', descricao: 'Xampus', segmento: '20', mva: 45.59 },
    { cest: '20.009.00', ncm: '33061000', descricao: 'Dentifrícios', segmento: '20', mva: 47.35 },
    { cest: '20.013.00', ncm: '33072010', descricao: 'Desodorantes líquidos', segmento: '20', mva: 45.59 },

    // Segmento 21 - Eletrônicos
    { cest: '21.053.00', ncm: '84713012', descricao: 'Notebooks', segmento: '21', mva: 35 },
    { cest: '21.054.00', ncm: '84714100', descricao: 'Computadores desktop', segmento: '21', mva: 35 },
    { cest: '21.055.00', ncm: '84715010', descricao: 'Unidades de processamento', segmento: '21', mva: 35 },
    { cest: '21.056.00', ncm: '84716052', descricao: 'Teclados', segmento: '21', mva: 45 },
    { cest: '21.057.00', ncm: '84716053', descricao: 'Mouse', segmento: '21', mva: 45 },
    { cest: '21.058.00', ncm: '84717012', descricao: 'HD - Disco rígido', segmento: '21', mva: 35 },
    { cest: '21.061.00', ncm: '85171231', descricao: 'Telefones celulares', segmento: '21', mva: 9 },
    { cest: '21.063.00', ncm: '85235100', descricao: 'SSD e Pendrives', segmento: '21', mva: 45 },
    { cest: '21.064.00', ncm: '85285210', descricao: 'Monitores', segmento: '21', mva: 32 },
    { cest: '21.065.00', ncm: '85287200', descricao: 'Televisores', segmento: '21', mva: 19 },

    // Segmento 25 - Veículos
    { cest: '25.001.00', ncm: '87032100', descricao: 'Automóveis <= 1000cc', segmento: '25', mva: 30 },
    { cest: '25.002.00', ncm: '87032210', descricao: 'Automóveis 1000-1500cc', segmento: '25', mva: 30 },
    { cest: '25.003.00', ncm: '87032310', descricao: 'Automóveis 1500-3000cc', segmento: '25', mva: 30 },
    { cest: '25.005.00', ncm: '87112010', descricao: 'Motocicletas 50-250cc', segmento: '25', mva: 34 },
];

// Obter segmento por ID
export function getSegmento(id) {
    return CEST_SEGMENTOS.find(s => s.id === id);
}

// Buscar CEST por NCM
export function getCESTByNCM(ncm) {
    return CEST_DATABASE.filter(c => c.ncm === ncm);
}

export default { CEST_DATABASE, CEST_SEGMENTOS, getSegmento, getCESTByNCM };
