import Header from '../../components/Header'
import { useState } from 'react'

export default function Difal() {
    const [valor, setValor] = useState('');
    const [aliqInter, setAliqInter] = useState('');
    const [aliqInterna, setAliqInterna] = useState('');
    const [aliqFCP, setAliqFCP] = useState('0');
    const [result, setResult] = useState(null);

    function parseCurrencyInput(str) {
        if (!str) return NaN; str = String(str).trim(); if (str.indexOf(',') > -1 && str.indexOf('.') > -1) { str = str.replace(/\./g, '').replace(',', '.'); } else str = str.replace(',', '.'); str = str.replace(/[^\d.\-]/g, ''); return parseFloat(str);
    }
    function fmtMoney(v) { if (isNaN(v)) return '-'; return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

    function calcular() {
        const v = parseCurrencyInput(valor);
        const inter = parseFloat(aliqInter) / 100; const interna = parseFloat(aliqInterna) / 100; const fcp = parseFloat(aliqFCP) / 100;
        if (isNaN(v) || isNaN(inter) || isNaN(interna) || isNaN(fcp)) return alert('Preencha todos os campos');
        const aliqEf = interna + fcp; const icmsInter = v * inter; const valorLiquido = v - icmsInter; const baseAju = valorLiquido / (1 - aliqEf); const icmsInt = baseAju * interna; const valorF = baseAju * fcp; const difal = icmsInt + valorF - icmsInter;
        setResult({ baseAju, icmsInt, valorF, icmsInter, difal });
    }

    return (
        <div>
            <Header />
            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-xl font-bold text-purple-700">Calculadora DIFAL (Base Dupla ES)</h1>
                <p className="text-sm text-gray-600">Importe XML ou preencha manualmente.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-semibold">Valor (R$)</label>
                        <input value={valor} onChange={e => setValor(e.target.value)} className="w-full p-2 rounded border" placeholder="Ex: 1200,50" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Alíquota interestadual (%)</label>
                        <input value={aliqInter} onChange={e => setAliqInter(e.target.value)} className="w-full p-2 rounded border" placeholder="Ex: 12" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Alíquota interna (%)</label>
                        <input value={aliqInterna} onChange={e => setAliqInterna(e.target.value)} className="w-full p-2 rounded border" placeholder="Ex: 17" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Alíquota FCP (%)</label>
                        <input value={aliqFCP} onChange={e => setAliqFCP(e.target.value)} className="w-full p-2 rounded border" />
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button onClick={calcular} className="px-4 py-2 bg-purple-600 text-white rounded">Calcular</button>
                    <label className="px-4 py-2 bg-gray-100 rounded cursor-pointer">
                        <input type="file" accept="text/xml" onChange={async e => {
                            const f = e.target.files[0]; if (!f) return; const txt = await f.text();
                            // enviar para api
                            const fd = new FormData(); fd.append('file', f);
                            const r = await fetch('/api/xml/upload', { method: 'POST', body: fd }); const j = await r.json(); if (j.summary) { setResult({ fromXml: true, summary: j.summary }); }
                        }} style={{ display: 'none' }} /> Importar XML
                    </label>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-white rounded shadow-sm">
                        {result.fromXml ? (
                            <div>
                                <h3 className="font-semibold">Resumo (XML)</h3>
                                <pre className="text-sm text-gray-700">{JSON.stringify(result.summary, null, 2)}</pre>
                            </div>
                        ) : (
                            <div>
                                <div><strong>Base Ajustada:</strong> {fmtMoney(result.baseAju)}</div>
                                <div><strong>ICMS Destino:</strong> {fmtMoney(result.icmsInt)}</div>
                                <div><strong>FCP:</strong> {fmtMoney(result.valorF)}</div>
                                <div><strong>ICMS Origem:</strong> {fmtMoney(result.icmsInter)}</div>
                                <div className="mt-2 font-bold">DIFAL total: {fmtMoney(result.difal)}</div>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    )
}
