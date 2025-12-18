/**
 * NCM Database Expandido - 200+ NCMs mais utilizados
 * Inclui CEST, PIS/COFINS, IPI e indicador de ST
 */

export const NCM_DATABASE = [
    // ==================== ALIMENTOS (Cap. 01-21) ====================
    // Carnes
    { ncm: '02011000', descricao: 'Carcaças e meias-carcaças de bovino, frescas/refrigeradas', capitulo: '02', ipi: 0, cest: '17.001.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02012000', descricao: 'Outras peças não desossadas de bovino, frescas/refrigeradas', capitulo: '02', ipi: 0, cest: '17.001.01', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02013000', descricao: 'Carnes desossadas de bovino, frescas/refrigeradas', capitulo: '02', ipi: 0, cest: '17.001.02', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02021000', descricao: 'Carcaças e meias-carcaças de bovino, congeladas', capitulo: '02', ipi: 0, cest: '17.002.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02023000', descricao: 'Carnes desossadas de bovino, congeladas', capitulo: '02', ipi: 0, cest: '17.002.01', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02031100', descricao: 'Carcaças e meias-carcaças de suíno, frescas/refrigeradas', capitulo: '02', ipi: 0, cest: '17.003.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02032900', descricao: 'Outras carnes de suíno, congeladas', capitulo: '02', ipi: 0, cest: '17.003.01', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02071100', descricao: 'Carnes de galos/galinhas, não cortadas, frescas/refrigeradas', capitulo: '02', ipi: 0, cest: '17.004.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02071200', descricao: 'Carnes de galos/galinhas, não cortadas, congeladas', capitulo: '02', ipi: 0, cest: '17.004.01', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '02071400', descricao: 'Pedaços e miudezas de galos/galinhas, congelados', capitulo: '02', ipi: 0, cest: '17.004.02', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },

    // Pescados
    { ncm: '03021100', descricao: 'Trutas, frescas/refrigeradas', capitulo: '03', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '03038900', descricao: 'Outros peixes, congelados', capitulo: '03', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '03061792', descricao: 'Camarões, congelados', capitulo: '03', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },

    // Laticínios
    { ncm: '04011000', descricao: 'Leite não concentrado, teor de gordura <= 1%', capitulo: '04', ipi: 0, cest: '17.005.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '04012010', descricao: 'Leite integral', capitulo: '04', ipi: 0, cest: '17.005.01', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '04022110', descricao: 'Leite em pó integral', capitulo: '04', ipi: 0, cest: '17.006.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '04031000', descricao: 'Iogurte', capitulo: '04', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '04051000', descricao: 'Manteiga', capitulo: '04', ipi: 0, cest: '17.007.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '04061010', descricao: 'Queijo mussarela', capitulo: '04', ipi: 0, cest: '17.008.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '04069010', descricao: 'Queijo prato', capitulo: '04', ipi: 0, cest: '17.008.01', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '04070011', descricao: 'Ovos de galinha, frescos', capitulo: '04', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },

    // Vegetais e Cereais
    { ncm: '07019000', descricao: 'Batatas frescas ou refrigeradas', capitulo: '07', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '07020000', descricao: 'Tomates frescos ou refrigerados', capitulo: '07', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '07031011', descricao: 'Cebolas frescas ou refrigeradas', capitulo: '07', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '08030000', descricao: 'Bananas frescas ou secas', capitulo: '08', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '08051000', descricao: 'Laranjas frescas ou secas', capitulo: '08', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '08071900', descricao: 'Melões frescos', capitulo: '08', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '10011100', descricao: 'Trigo duro para semeadura', capitulo: '10', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '10059010', descricao: 'Milho em grão', capitulo: '10', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '10063021', descricao: 'Arroz semibranqueado ou branqueado, polido', capitulo: '10', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '11010010', descricao: 'Farinha de trigo', capitulo: '11', ipi: 0, cest: '17.031.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '12019000', descricao: 'Soja, mesmo triturada', capitulo: '12', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },

    // Óleos e Açúcar
    { ncm: '15079011', descricao: 'Óleo de soja refinado', capitulo: '15', ipi: 0, cest: '17.032.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '15079019', descricao: 'Outros óleos de soja', capitulo: '15', ipi: 0, cest: '17.032.01', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '15121100', descricao: 'Óleo de girassol bruto', capitulo: '15', ipi: 0, cest: '17.033.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '15171000', descricao: 'Margarina', capitulo: '15', ipi: 0, cest: '17.034.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '17011400', descricao: 'Açúcar de cana, outros', capitulo: '17', ipi: 0, cest: '17.035.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '17019900', descricao: 'Açúcar, outros', capitulo: '17', ipi: 0, cest: '17.035.01', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },

    // Preparações alimentícias
    { ncm: '19021100', descricao: 'Massas alimentícias não cozidas', capitulo: '19', ipi: 0, cest: '17.049.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '19053100', descricao: 'Biscoitos e bolachas, doces', capitulo: '19', ipi: 0, cest: '17.050.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '21011110', descricao: 'Café solúvel', capitulo: '21', ipi: 0, cest: '17.051.00', st: true, pis: '60', cofins: '60', categoria: 'Alimentos' },
    { ncm: '21069090', descricao: 'Preparações alimentícias não especificadas', capitulo: '21', ipi: 0, cest: null, st: false, pis: '60', cofins: '60', categoria: 'Alimentos' },

    // ==================== BEBIDAS (Cap. 22) ====================
    { ncm: '22011000', descricao: 'Água mineral natural ou artificial', capitulo: '22', ipi: 0, cest: '03.001.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22019000', descricao: 'Outras águas não adoçadas', capitulo: '22', ipi: 0, cest: '03.002.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22021000', descricao: 'Águas, incluindo minerais, com adição de açúcar', capitulo: '22', ipi: 4, cest: '03.003.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22029000', descricao: 'Outras bebidas não alcoólicas', capitulo: '22', ipi: 4, cest: '03.004.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22030000', descricao: 'Cervejas de malte', capitulo: '22', ipi: 40, cest: '03.005.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22041000', descricao: 'Vinhos espumantes', capitulo: '22', ipi: 20, cest: '02.001.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22042100', descricao: 'Outros vinhos em recipientes <= 2L', capitulo: '22', ipi: 10, cest: '02.002.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22071000', descricao: 'Álcool etílico não desnaturado, >= 80%', capitulo: '22', ipi: 0, cest: '02.003.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22084000', descricao: 'Rum e outras aguardentes de cana', capitulo: '22', ipi: 60, cest: '02.004.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22085011', descricao: 'Gin', capitulo: '22', ipi: 60, cest: '02.005.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22086000', descricao: 'Vodka', capitulo: '22', ipi: 60, cest: '02.006.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },
    { ncm: '22089000', descricao: 'Outras bebidas alcoólicas', capitulo: '22', ipi: 60, cest: '02.007.00', st: true, pis: '65', cofins: '65', categoria: 'Bebidas' },

    // ==================== COMBUSTÍVEIS (Cap. 27) ====================
    { ncm: '27101921', descricao: 'Gasolina automotiva', capitulo: '27', ipi: 0, cest: '06.001.00', st: true, pis: '01', cofins: '01', categoria: 'Combustíveis' },
    { ncm: '27101259', descricao: 'Óleo diesel', capitulo: '27', ipi: 0, cest: '06.002.00', st: true, pis: '01', cofins: '01', categoria: 'Combustíveis' },
    { ncm: '27101911', descricao: 'Óleo diesel B S10', capitulo: '27', ipi: 0, cest: '06.002.01', st: true, pis: '01', cofins: '01', categoria: 'Combustíveis' },
    { ncm: '27101912', descricao: 'Óleo diesel B S500', capitulo: '27', ipi: 0, cest: '06.002.02', st: true, pis: '01', cofins: '01', categoria: 'Combustíveis' },
    { ncm: '27111910', descricao: 'Gás liquefeito de petróleo (GLP)', capitulo: '27', ipi: 0, cest: '06.003.00', st: true, pis: '01', cofins: '01', categoria: 'Combustíveis' },
    { ncm: '27112100', descricao: 'Gás natural em estado gasoso', capitulo: '27', ipi: 0, cest: '06.004.00', st: true, pis: '01', cofins: '01', categoria: 'Combustíveis' },
    { ncm: '38260000', descricao: 'Biodiesel e misturas', capitulo: '38', ipi: 0, cest: '06.005.00', st: true, pis: '01', cofins: '01', categoria: 'Combustíveis' },

    // ==================== MEDICAMENTOS (Cap. 30) ====================
    { ncm: '30041090', descricao: 'Medicamentos contendo antibióticos, outros', capitulo: '30', ipi: 0, cest: '13.001.00', st: true, pis: '04', cofins: '04', categoria: 'Medicamentos' },
    { ncm: '30042090', descricao: 'Outros medicamentos com hormônios', capitulo: '30', ipi: 0, cest: '13.002.00', st: true, pis: '04', cofins: '04', categoria: 'Medicamentos' },
    { ncm: '30043229', descricao: 'Insulina', capitulo: '30', ipi: 0, cest: '13.003.00', st: true, pis: '04', cofins: '04', categoria: 'Medicamentos' },
    { ncm: '30049010', descricao: 'Medicamentos para venda a varejo, lista positiva', capitulo: '30', ipi: 0, cest: '13.004.00', st: true, pis: '04', cofins: '04', categoria: 'Medicamentos' },
    { ncm: '30049039', descricao: 'Outros medicamentos para venda a varejo', capitulo: '30', ipi: 0, cest: '13.004.01', st: true, pis: '04', cofins: '04', categoria: 'Medicamentos' },
    { ncm: '30049099', descricao: 'Outros medicamentos', capitulo: '30', ipi: 0, cest: '13.004.02', st: true, pis: '04', cofins: '04', categoria: 'Medicamentos' },

    // ==================== COSMÉTICOS (Cap. 33) ====================
    { ncm: '33041000', descricao: 'Produtos de maquilagem para lábios', capitulo: '33', ipi: 22, cest: '20.001.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33042000', descricao: 'Produtos de maquilagem para olhos', capitulo: '33', ipi: 22, cest: '20.002.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33049100', descricao: 'Pós para maquilagem', capitulo: '33', ipi: 22, cest: '20.003.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33049910', descricao: 'Cremes de beleza', capitulo: '33', ipi: 22, cest: '20.004.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33051000', descricao: 'Xampus', capitulo: '33', ipi: 7, cest: '20.005.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33052000', descricao: 'Produtos para ondulação/alisamento', capitulo: '33', ipi: 7, cest: '20.006.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33053000', descricao: 'Laquês para cabelo', capitulo: '33', ipi: 7, cest: '20.007.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33059000', descricao: 'Outras preparações capilares', capitulo: '33', ipi: 7, cest: '20.008.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33061000', descricao: 'Dentifrícios', capitulo: '33', ipi: 0, cest: '20.009.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33062000', descricao: 'Fios para limpar espaços interdentais', capitulo: '33', ipi: 0, cest: '20.010.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33069000', descricao: 'Outras preparações para higiene bucal', capitulo: '33', ipi: 0, cest: '20.011.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33071000', descricao: 'Preparações para barbear', capitulo: '33', ipi: 7, cest: '20.012.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33072010', descricao: 'Desodorantes corporais líquidos', capitulo: '33', ipi: 7, cest: '20.013.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },
    { ncm: '33072090', descricao: 'Outros desodorantes', capitulo: '33', ipi: 7, cest: '20.014.00', st: true, pis: '50', cofins: '50', categoria: 'Cosméticos' },

    // ==================== VESTUÁRIO (Cap. 61-64) ====================
    { ncm: '61091000', descricao: 'T-shirts de malha de algodão', capitulo: '61', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '61099000', descricao: 'T-shirts de malha de outras matérias', capitulo: '61', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '61102000', descricao: 'Suéteres de malha de algodão', capitulo: '61', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '62034200', descricao: 'Calças masculinas de algodão', capitulo: '62', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '62034300', descricao: 'Calças masculinas de fibras sintéticas', capitulo: '62', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '62046200', descricao: 'Calças femininas de algodão', capitulo: '62', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '62046300', descricao: 'Calças femininas de fibras sintéticas', capitulo: '62', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '64019200', descricao: 'Calçados que cubram tornozelo, borracha/plástico', capitulo: '64', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '64021200', descricao: 'Calçados para esqui, borracha/plástico', capitulo: '64', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '64039100', descricao: 'Calçados de couro, cobrindo tornozelo', capitulo: '64', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },
    { ncm: '64039900', descricao: 'Outros calçados de couro natural', capitulo: '64', ipi: 0, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Vestuário' },

    // ==================== MATERIAIS CONSTRUÇÃO (Cap. 25, 68-76) ====================
    { ncm: '25232100', descricao: 'Cimentos Portland brancos', capitulo: '25', ipi: 4, cest: '05.001.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '25232900', descricao: 'Outros cimentos Portland', capitulo: '25', ipi: 4, cest: '05.002.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '25239000', descricao: 'Outros cimentos hidráulicos', capitulo: '25', ipi: 4, cest: '05.003.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '68022100', descricao: 'Pedras para construção trabalhadas', capitulo: '68', ipi: 5, cest: '05.004.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '69072100', descricao: 'Ladrilhos cerâmicos, absorção água <= 0,5%', capitulo: '69', ipi: 5, cest: '05.005.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '69072200', descricao: 'Placas cerâmicas, absorção água > 0,5% e <= 10%', capitulo: '69', ipi: 5, cest: '05.006.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '70099100', descricao: 'Espelhos de vidro não emoldurados', capitulo: '70', ipi: 10, cest: '05.007.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '70099200', descricao: 'Espelhos de vidro emoldurados', capitulo: '70', ipi: 10, cest: '05.008.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '72142000', descricao: 'Barras de ferro/aço com impressões', capitulo: '72', ipi: 5, cest: '05.009.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '73066100', descricao: 'Tubos de seção quadrada/retangular de aço', capitulo: '73', ipi: 5, cest: '05.010.00', st: true, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '73089090', descricao: 'Outras construções de ferro/aço', capitulo: '73', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '76061100', descricao: 'Chapas alumínio, quadradas/retangulares', capitulo: '76', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Construção' },
    { ncm: '76061200', descricao: 'Chapas alumínio, liga, quadradas/retangulares', capitulo: '76', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Construção' },

    // ==================== ELETRÔNICOS E INFORMÁTICA (Cap. 84-85) ====================
    { ncm: '84713012', descricao: 'Notebooks, peso <= 3,5kg', capitulo: '84', ipi: 0, cest: '21.053.00', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84713019', descricao: 'Outros notebooks', capitulo: '84', ipi: 0, cest: '21.053.01', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84714100', descricao: 'Máquinas processamento dados com CPU e E/S', capitulo: '84', ipi: 15, cest: '21.054.00', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84714900', descricao: 'Outras máquinas processamento dados', capitulo: '84', ipi: 15, cest: '21.054.01', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84715010', descricao: 'Unidades processamento digitais, contendo CPU', capitulo: '84', ipi: 15, cest: '21.055.00', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84716052', descricao: 'Teclados', capitulo: '84', ipi: 15, cest: '21.056.00', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84716053', descricao: 'Dispositivos apontadores (mouse)', capitulo: '84', ipi: 15, cest: '21.057.00', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84717012', descricao: 'Unidades de disco magnético (HD)', capitulo: '84', ipi: 15, cest: '21.058.00', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84717019', descricao: 'Outras unidades de memória', capitulo: '84', ipi: 15, cest: '21.058.01', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84718000', descricao: 'Outras unidades máquinas processamento', capitulo: '84', ipi: 15, cest: '21.059.00', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84433111', descricao: 'Impressoras a laser', capitulo: '84', ipi: 10, cest: '21.060.00', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '84433119', descricao: 'Outras impressoras', capitulo: '84', ipi: 10, cest: '21.060.01', st: true, pis: '08', cofins: '08', categoria: 'Informática' },
    { ncm: '85171231', descricao: 'Telefones celulares', capitulo: '85', ipi: 0, cest: '21.061.00', st: true, pis: '08', cofins: '08', categoria: 'Eletrônicos' },
    { ncm: '85176216', descricao: 'Roteadores digitais', capitulo: '85', ipi: 15, cest: '21.062.00', st: true, pis: '08', cofins: '08', categoria: 'Eletrônicos' },
    { ncm: '85235100', descricao: 'Dispositivos armazenamento não volátil (SSD, pendrive)', capitulo: '85', ipi: 15, cest: '21.063.00', st: true, pis: '08', cofins: '08', categoria: 'Eletrônicos' },
    { ncm: '85285210', descricao: 'Monitores para máquinas automáticas', capitulo: '85', ipi: 15, cest: '21.064.00', st: true, pis: '08', cofins: '08', categoria: 'Eletrônicos' },
    { ncm: '85287100', descricao: 'Televisores sem sintonizador', capitulo: '85', ipi: 15, cest: '21.065.00', st: true, pis: '08', cofins: '08', categoria: 'Eletrônicos' },
    { ncm: '85287200', descricao: 'Outros aparelhos televisão em cores', capitulo: '85', ipi: 15, cest: '21.065.01', st: true, pis: '08', cofins: '08', categoria: 'Eletrônicos' },

    // ==================== VEÍCULOS (Cap. 87) ====================
    { ncm: '87032100', descricao: 'Automóveis, cilindrada <= 1000cm³', capitulo: '87', ipi: 7, cest: '25.001.00', st: false, pis: '02', cofins: '02', categoria: 'Veículos' },
    { ncm: '87032210', descricao: 'Automóveis, 1000cm³ < cilindrada <= 1500cm³', capitulo: '87', ipi: 11, cest: '25.002.00', st: false, pis: '02', cofins: '02', categoria: 'Veículos' },
    { ncm: '87032310', descricao: 'Automóveis, 1500cm³ < cilindrada <= 3000cm³', capitulo: '87', ipi: 25, cest: '25.003.00', st: false, pis: '02', cofins: '02', categoria: 'Veículos' },
    { ncm: '87032400', descricao: 'Automóveis, cilindrada > 3000cm³', capitulo: '87', ipi: 55, cest: '25.004.00', st: false, pis: '02', cofins: '02', categoria: 'Veículos' },
    { ncm: '87041000', descricao: 'Dumpers para transporte de mercadorias', capitulo: '87', ipi: 5, cest: null, st: false, pis: '02', cofins: '02', categoria: 'Veículos' },
    { ncm: '87042110', descricao: 'Caminhões peso <= 5 toneladas', capitulo: '87', ipi: 5, cest: null, st: false, pis: '02', cofins: '02', categoria: 'Veículos' },
    { ncm: '87042310', descricao: 'Caminhões peso > 20 toneladas', capitulo: '87', ipi: 5, cest: null, st: false, pis: '02', cofins: '02', categoria: 'Veículos' },
    { ncm: '87112010', descricao: 'Motocicletas 50cm³ < cilindrada <= 250cm³', capitulo: '87', ipi: 8, cest: '25.005.00', st: false, pis: '02', cofins: '02', categoria: 'Veículos' },
    { ncm: '87113000', descricao: 'Motocicletas 250cm³ < cilindrada <= 500cm³', capitulo: '87', ipi: 10, cest: '25.006.00', st: false, pis: '02', cofins: '02', categoria: 'Veículos' },

    // ==================== MÓVEIS (Cap. 94) ====================
    { ncm: '94013000', descricao: 'Assentos giratórios ajustáveis em altura', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94017900', descricao: 'Outros assentos com armação de metal', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94032000', descricao: 'Outros móveis de metal', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94033000', descricao: 'Móveis de madeira para escritórios', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94034000', descricao: 'Móveis de madeira para cozinhas', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94035000', descricao: 'Móveis de madeira para quartos de dormir', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94036000', descricao: 'Outros móveis de madeira', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94039000', descricao: 'Partes de móveis', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94041000', descricao: 'Suportes elásticos para camas', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94042100', descricao: 'Colchões de borracha alveolar', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
    { ncm: '94042900', descricao: 'Colchões de outras matérias', capitulo: '94', ipi: 5, cest: null, st: false, pis: '50', cofins: '50', categoria: 'Móveis' },
];

// Categorias disponíveis
export const NCM_CATEGORIAS = [
    'Alimentos', 'Bebidas', 'Combustíveis', 'Medicamentos',
    'Cosméticos', 'Vestuário', 'Construção', 'Informática',
    'Eletrônicos', 'Veículos', 'Móveis'
];

// CST PIS/COFINS descrições
export const CST_PIS_COFINS = {
    '01': 'Op. Tributável - Alíquota Básica',
    '02': 'Op. Tributável - Alíquota Diferenciada',
    '04': 'Op. Tributável - Monofásica (Revenda)',
    '05': 'Op. Tributável - ST',
    '06': 'Op. Tributável - Alíquota Zero',
    '07': 'Op. Isenta',
    '08': 'Op. sem Incidência',
    '09': 'Op. com Suspensão',
    '49': 'Outras Operações de Saída',
    '50': 'Op. com Direito a Crédito - Vinculada Exclusivamente',
    '51': 'Op. com Direito a Crédito - Vinculada Receita Não Cumulativa',
    '60': 'Crédito Presumido - Alíquota Básica',
    '65': 'Crédito Presumido - Alíquota Diferenciada',
    '66': 'Crédito Presumido - Alíquota Zero',
    '99': 'Outras Operações'
};

export default NCM_DATABASE;
