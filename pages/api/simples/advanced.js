// pages/api/simples/advanced.js
const db = require('../../../lib/db');

// Função util: determinar faixa do Simples (exemplo simplificado)
const faixas = [
    { limite: 180000, aliquota: 4, deducao: 0 },
    { limite: 360000, aliquota: 7.3, deducao: 5940 },
    { limite: 720000, aliquota: 9.5, deducao: 13860 },
    { limite: 1800000, aliquota: 10.7, deducao: 22500 },
    { limite: 3600000, aliquota: 14.3, deducao: 87300 },
    { limite: 4800000, aliquota: 19, deducao: 378000 }
];

// Faixa para fator R (exemplo: se receita de serviços / receita total)
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { rbt12, receita_servicos = 0, receita_total = null, iss_porcent = null, userId = null } = req.body;
    const RBT = Number(rbt12) || 0;
    if (RBT <= 0) return res.status(400).json({ error: 'rbt12 required' });

    const faixa = faixas.find(f => RBT <= f.limite) || faixas[faixas.length - 1];
    const aliquotaNominal = faixa.aliquota;
    const deducao = faixa.deducao;
    const efetiva = ((RBT * (aliquotaNominal / 100) - deducao) / RBT) * 100;

    // Fator R
    let fatorR = null;
    if (receita_total && receita_total > 0) {
        fatorR = Number(((receita_servicos / receita_total) * 100).toFixed(4));
    }

    // Comparativo Simples x Presumido (estimativa básica)
    // Simplificação: para presumido tomamos % de presunção sobre receita e aplicamos alíquota média
    // Exemplo para comércio/serviço: presunção 8% vendas mercadorias / 32% serviços (user should pass type ideally)
    const presuncoes = { comercio: 8, industria: 8, servicos: 32 };
    const presuncoesAliq = { impostos: 11 };
    const presumidoEstimation = (() => {
        // vamos estimar um imposto anual aproximado
        const receita = RBT;
        const presPerc = presuncoes['servicos'] / 100; // simplificação: usar serviços
        const basePres = receita * presPerc;
        const impostoPresumido = basePres * (presuncoesAliq.impostos / 100);
        // converter para % efetiva sobre receita
        return { impostoPresumido, efetivaPresumidaPct: (impostoPresumido / receita) * 100 };
    })();

    // ISS efetivo por município (se passar aliquota base do ISS)
    let issEfetivo = null;
    if (iss_porcent !== null) {
        // ISS efetivo = (ISS / receita de serviços) * 100
        // assumimos receita de serviços = receita_servicos (param)
        const issPct = Number(iss_porcent);
        if (receita_servicos > 0) {
            // valor de iss anual estimado
            const issValor = (receita_servicos * issPct / 100);
            issEfetivo = { issValor, issPct, issEfetivaSobreTotalPct: Number(((issValor / RBT) * 100).toFixed(4)) };
        }
    }

    // Monta comparativo
    const comparativo = {
        simples: { aliquotaNominal, deducao, aliquotaEfetivaPct: Number(efetiva.toFixed(4)) },
        presumido: { ...presumidoEstimation }
    };

    // Persistir no banco (se houver DATABASE_URL) - usa lib/db.js
    try {
        const insertQ = `INSERT INTO simples_history (user_id, rbt12, aliquota_nominal, deducao, aliquota_efetiva, fator_r, comparativo, iss_efetivo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
        await db.query(insertQ, [userId, RBT, aliquotaNominal, deducao, efetiva, fatorR, JSON.stringify(comparativo), issEfetivo ? JSON.stringify(issEfetivo) : null]);
    } catch (err) { console.warn('DB save failed (DB disabled or query error):', err.message); }

    // Checar alertas: se aliquota efetiva subir de faixa - exemplo simples: se efetiva > X
    const alerts = [];
    if (efetiva > 10) { alerts.push({ type: 'ALERTA_ALIQUOTA_ALTA', message: 'Alíquota efetiva maior que 10%' }); }
    if (fatorR !== null && fatorR > 0 && fatorR < 0.2) { alerts.push({ type: 'ALERTA_FATOR_R_BAIXO', message: 'Fator R abaixo de 20% — atenção' }); }

    // Persistir alertas - usa lib/db.js
    try {
        if (alerts.length) {
            for (const a of alerts) {
                await db.query('INSERT INTO fiscal_alerts (user_id, type, payload) VALUES ($1,$2,$3)', [userId, a.type, JSON.stringify(a)]);
            }
        }
    } catch (e) { console.warn('save alerts failed (DB disabled):', e.message); }

    return res.json({ comparativo, fatorR, issEfetivo, alerts });
}
