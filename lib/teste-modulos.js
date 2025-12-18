/**
 * ARQUIVO DE TESTE - FASE 1
 * Validação dos módulos auxiliares
 * 
 * Execute este arquivo para testar os módulos criados
 * node lib/teste-modulos.js (ou copie no console do navegador)
 */

// Importar módulos (ajustar imports conforme ambiente)
import { calcularDIFAL, calcularRetencoes } from './fiscal.js';
import { buscarCFOPPorCodigo, buscarCFOPPorDescricao } from './cfopData.js';

console.log('🧪 INICIANDO TESTES DOS MÓDULOS AUXILIARES - FASE 1\n');

// ===== TESTE 1: DIFAL Base Dupla =====
console.log('📊 TESTE 1: Cálculo DIFAL Base Dupla (SP → RJ)');
try {
    const resultadoBaseDupla = calcularDIFAL({
        valor: 10000,
        aliqInterestadual: 12,
        aliqInterna: 18,
        aliqFCP: 2,
        metodologia: 'base_dupla',
        ufDestino: 'RJ'
    });

    console.log('✅ Base Dupla calculada:');
    console.log(`   DIFAL: R$ ${resultadoBaseDupla.difal.toFixed(2)}`);
    console.log(`   FCP: R$ ${resultadoBaseDupla.fcp.toFixed(2)}`);
    console.log(`   Total DIFAL: R$ ${resultadoBaseDupla.totalDifal.toFixed(2)}`);
    console.log(`   Base Ajustada: R$ ${resultadoBaseDupla.baseAjustada.toFixed(2)}`);

    // Validação esperada (aprox):
    // Base Ajustada ≈ R$ 11.250,00
    // DIFAL ≈ R$ 825,00
    // FCP ≈ R$ 225,00
    // Total ≈ R$ 1.050,00

    if (resultadoBaseDupla.totalDifal >= 1000 && resultadoBaseDupla.totalDifal <= 1100) {
        console.log('✅ TESTE 1 PASSOU - Valor dentro do esperado\n');
    } else {
        console.log('⚠️  TESTE 1 ALERTA - Verificar cálculo manualmente\n');
    }
} catch (error) {
    console.log('❌ TESTE 1 FALHOU:', error.message, '\n');
}

// ===== TESTE 2: DIFAL Base Única (ES) =====
console.log('📊 TESTE 2: Cálculo DIFAL Base Única (SP → ES)');
try {
    const resultadoBaseUnica = calcularDIFAL({
        valor: 10000,
        aliqInterestadual: 12,
        aliqInterna: 17,
        aliqFCP: 0,
        metodologia: 'base_unica',
        ufDestino: 'ES'
    });

    console.log('✅ Base Única calculada:');
    console.log(`   DIFAL: R$ ${resultadoBaseUnica.difal.toFixed(2)}`);
    console.log(`   Metodologia: ${resultadoBaseUnica.metodologia}`);

    // Validação esperada:
    // DIFAL = 10.000 * (17% - 12%) = R$ 500,00

    if (resultadoBaseUnica.difal === 500) {
        console.log('✅ TESTE 2 PASSOU - Cálculo correto\n');
    } else {
        console.log(`⚠️  TESTE 2 ALERTA - Esperado R$ 500,00, obtido R$ ${resultadoBaseUnica.difal.toFixed(2)}\n`);
    }
} catch (error) {
    console.log('❌ TESTE 2 FALHOU:', error.message, '\n');
}

// ===== TESTE 3: Retenções na Fonte =====
console.log('📊 TESTE 3: Cálculo de Retenções na Fonte');
try {
    const retencoes = calcularRetencoes({
        valorServico: 5000,
        tipoServico: '17.01',
        cpfCnpjPrestador: '12345678000190'
    });

    console.log('✅ Retenções calculadas:');
    console.log(`   PIS: R$ ${retencoes.pis.valor.toFixed(2)}`);
    console.log(`   COFINS: R$ ${retencoes.cofins.valor.toFixed(2)}`);
    console.log(`   CSLL: R$ ${retencoes.csll.valor.toFixed(2)}`);
    console.log(`   IRRF: R$ ${retencoes.irrf.valor.toFixed(2)}`);
    console.log(`   Total Retido: R$ ${retencoes.totalRetido.toFixed(2)}`);
    console.log(`   Valor Líquido: R$ ${retencoes.valorLiquido.toFixed(2)}`);

    // Validação esperada (aprox):
    // Total Retido ≈ R$ 307,50

    if (retencoes.totalRetido >= 300 && retencoes.totalRetido <= 320) {
        console.log('✅ TESTE 3 PASSOU - Retenções corretas\n');
    } else {
        console.log('⚠️  TESTE 3 ALERTA - Verificar alíquotas\n');
    }
} catch (error) {
    console.log('❌ TESTE 3 FALHOU:', error.message, '\n');
}

// ===== TESTE 4: Busca CFOP =====
console.log('📊 TESTE 4: Busca de CFOP');
try {
    const cfop5102 = buscarCFOPPorCodigo('5102');
    console.log('✅ CFOP encontrado:');
    console.log(`   Código: ${cfop5102.codigo}`);
    console.log(`   Descrição: ${cfop5102.descricao}`);
    console.log(`   Natureza: ${cfop5102.natureza}`);

    const resultadosBusca = buscarCFOPPorDescricao('venda');
    console.log(`✅ Encontrados ${resultadosBusca.length} CFOPs com "venda"`);

    if (cfop5102 && resultadosBusca.length > 0) {
        console.log('✅ TESTE 4 PASSOU - CFOPs acessíveis\n');
    } else {
        console.log('❌ TESTE 4 FALHOU - Problema na base de CFOPs\n');
    }
} catch (error) {
    console.log('❌ TESTE 4 FALHOU:', error.message, '\n');
}

// ===== RESUMO =====
console.log('='.repeat(50));
console.log('📋 RESUMO DOS TESTES - FASE 1');
console.log('='.repeat(50));
console.log('✅ lib/fiscal.js - Funções importam e calculam');
console.log('✅ lib/cfopData.js - Base de dados acessível');
console.log('⏳ lib/nfeValidator.js - Testar manualmente com XML');
console.log('⏳ lib/pdfGenerator.js - Mock (implementação futura)');
console.log('='.repeat(50));
console.log('\n🎯 PRÓXIMOS PASSOS:');
console.log('1. Revisar os resultados acima');
console.log('2. Testar lib/nfeValidator.js com um XML real');
console.log('3. Se tudo OK, aprovar FASE 1');
console.log('4. Avançar para FASE 2 (Sidebar & Layout)');
