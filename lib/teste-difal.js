/**
 * Teste de Validação: Cálculo DIFAL Base Dupla
 * Validar se a fórmula está correta conforme LC 190/2022
 */

import { calcularDIFAL } from './fiscal.js';

console.log('='.repeat(60));
console.log('TESTE DE VALIDAÇÃO - DIFAL BASE DUPLA');
console.log('='.repeat(60));

// Exemplo fornecido pelo usuário:
// Valor: R$ 1.000,00
// Alíquota Interestadual: 12%
// Alíquota Interna: 17%
// FCP: 0%

console.log('\n📋 EXEMPLO 1: Conforme documentação do usuário');
console.log('-'.repeat(60));

const teste1 = calcularDIFAL({
    valor: 1000,
    aliqInterestadual: 12,
    aliqInterna: 17,
    aliqFCP: 0,
    metodologia: 'base_dupla',
    ufDestino: 'ES'
});

console.log('Entrada:');
console.log(`  Valor da Operação: R$ ${teste1.valorOperacao.toFixed(2)}`);
console.log(`  Alíquota Interestadual: ${teste1.aliquotaInterestadual}%`);
console.log(`  Alíquota Interna: ${teste1.aliquotaInterna}%`);

console.log('\nCálculo Passo a Passo:');
console.log(`  1. ICMS Interestadual = R$ 1.000,00 × 12% = R$ ${teste1.icmsOrigem.toFixed(2)}`);
console.log(`     ✅ Esperado: R$ 120,00`);

console.log(`  2. Valor Líquido = R$ 1.000,00 - R$ ${teste1.icmsOrigem.toFixed(2)} = R$ ${teste1.valorLiquido.toFixed(2)}`);
console.log(`     ✅ Esperado: R$ 880,00`);

console.log(`  3. Base Majorada = R$ ${teste1.valorLiquido.toFixed(2)} / (1 - 0,17) = R$ ${teste1.baseMajorada.toFixed(2)}`);
console.log(`     ✅ Esperado: R$ 1.060,24`);

console.log(`  4. ICMS Interno = R$ ${teste1.baseMajorada.toFixed(2)} × 17% = R$ ${teste1.icmsDestino.toFixed(2)}`);
console.log(`     ✅ Esperado: R$ 180,24`);

console.log(`  5. DIFAL = R$ ${teste1.icmsDestino.toFixed(2)} - R$ ${teste1.icmsOrigem.toFixed(2)} = R$ ${teste1.difal.toFixed(2)}`);
console.log(`     ✅ Esperado: R$ 60,24`);

console.log('\nResultado Final:');
console.log(`  DIFAL Devido: R$ ${teste1.difal.toFixed(2)}`);
console.log(`  Total com FCP: R$ ${teste1.totalDifal.toFixed(2)}`);

// Validação
const esperado = {
    icmsOrigem: 120.00,
    valorLiquido: 880.00,
    baseMajorada: 1060.24,
    icmsDestino: 180.24,
    difal: 60.24
};

let erros = 0;

Object.keys(esperado).forEach(key => {
    const calculado = teste1[key];
    const esperadoValor = esperado[key];
    const diferenca = Math.abs(calculado - esperadoValor);

    if (diferenca > 0.01) { // Tolerância de 1 centavo
        console.log(`\n❌ ERRO em ${key}: Esperado ${esperadoValor}, Calculado ${calculado}`);
        erros++;
    }
});

if (erros === 0) {
    console.log('\n✅ TODOS OS VALORES ESTÃO CORRETOS!');
} else {
    console.log(`\n❌ ${erros} ERRO(S) ENCONTRADO(S)`);
}

// Teste 2: Com FCP
console.log('\n' + '='.repeat(60));
console.log('📋 EXEMPLO 2: Com FCP de 2%');
console.log('-'.repeat(60));

const teste2 = calcularDIFAL({
    valor: 1000,
    aliqInterestadual: 12,
    aliqInterna: 17,
    aliqFCP: 2,
    metodologia: 'base_dupla',
    ufDestino: 'SP'
});

console.log('Entrada:');
console.log(`  Valor: R$ ${teste2.valorOperacao.toFixed(2)}`);
console.log(`  Alíquota Interestadual: ${teste2.aliquotaInterestadual}%`);
console.log(`  Alíquota Interna: ${teste2.aliquotaInterna}%`);
console.log(`  Alíquota FCP: ${teste2.aliquotaFCP}%`);

console.log('\nResultado:');
console.log(`  ICMS Origem: R$ ${teste2.icmsOrigem.toFixed(2)}`);
console.log(`  Valor Líquido: R$ ${teste2.valorLiquido.toFixed(2)}`);
console.log(`  Base Majorada: R$ ${teste2.baseMajorada.toFixed(2)}`);
console.log(`  ICMS Destino: R$ ${teste2.icmsDestino.toFixed(2)}`);
console.log(`  FCP: R$ ${teste2.fcp.toFixed(2)}`);
console.log(`  DIFAL: R$ ${teste2.difal.toFixed(2)}`);
console.log(`  Total (DIFAL + FCP): R$ ${teste2.totalDifal.toFixed(2)}`);

// Teste 3: Base Única (ES)
console.log('\n' + '='.repeat(60));
console.log('📋 EXEMPLO 3: Base Única (Espírito Santo)');
console.log('-'.repeat(60));

const teste3 = calcularDIFAL({
    valor: 1000,
    aliqInterestadual: 12,
    aliqInterna: 17,
    aliqFCP: 0,
    metodologia: 'base_unica',
    ufDestino: 'ES'
});

console.log('Entrada:');
console.log(`  Valor: R$ ${teste3.valorOperacao.toFixed(2)}`);
console.log(`  Metodologia: ${teste3.metodologia}`);

console.log('\nCálculo Simplificado (Base Única):');
console.log(`  DIFAL = R$ 1.000,00 × (17% - 12%) = R$ ${teste3.difal.toFixed(2)}`);
console.log(`  ✅ Esperado: R$ 50,00`);

console.log('\nResultado:');
console.log(`  DIFAL: R$ ${teste3.difal.toFixed(2)}`);

console.log('\n' + '='.repeat(60));
console.log('RESUMO COMPARATIVO');
console.log('='.repeat(60));
console.log(`Base Dupla (padrão):  R$ ${teste1.difal.toFixed(2)}`);
console.log(`Base Única (ES):      R$ ${teste3.difal.toFixed(2)}`);
console.log(`Diferença:            R$ ${(teste1.difal - teste3.difal).toFixed(2)}`);
console.log('='.repeat(60));
