import Header from '../../components/Header'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function SimplesAdvanced() {
    const [rbt12, setRbt12] = useState('');
    const [receitaServ, setReceitaServ] = useState('');
    const [receitaTotal, setReceitaTotal] = useState('');
    const [issPct, setIssPct] = useState('');
    const [res, setRes] = useState(null);

    async function calcular() {
        const body = { rbt12: Number(rbt12), receita_servicos: Number(receitaServ), receita_total: Number(receitaTotal), iss_porcent: issPct ? Number(issPct) : null };
        const r = await fetch('/api/simples/advanced', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
        const j = await r.json(); setRes(j);
    }

    return (
        <div>
            <Header />
            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-xl font-bold text-purple-700">Simples Avançado & Comparativo</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <input placeholder="RBT12 (ex: 360000)" value={rbt12} onChange={e => setRbt12(e.target.value)} className="p-2 border rounded" />
                    <input placeholder="Receita serviços (ano)" value={receitaServ} onChange={e => setReceitaServ(e.target.value)} className="p-2 border rounded" />
                    <input placeholder="Receita total (ano)" value={receitaTotal} onChange={e => setReceitaTotal(e.target.value)} className="p-2 border rounded" />
                    <input placeholder="Alíquota ISS média (%)" value={issPct} onChange={e => setIssPct(e.target.value)} className="p-2 border rounded" />
                </div>
                <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={calcular}>Calcular</button>
                </div>

                {res && (
                    <div className="mt-6 p-4 bg-white rounded shadow-sm">
                        <h3 className="font-semibold">Resultado</h3>
                        <pre className="text-sm">{JSON.stringify(res, null, 2)}</pre>

                        <div className="mt-4">
                            <h4 className="font-semibold">Gráfico (Alíquotas)</h4>
                            <Line data={{ labels: ['Simples', 'Presumido'], datasets: [{ label: 'Alíquota efetiva (%)', data: [res.comparativo.simples.aliquotaEfetivaPct || 0, res.comparativo.presumido.efetivaPresumidaPct || 0], fill: false, borderColor: '#7c3aed' }] }} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
