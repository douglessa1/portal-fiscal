import Header from '../../components/Header'
import { useEffect, useState } from 'react'

export default function Simulations() {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        fetch('/api/simples/history').then(r => r.json()).then(j => setRows(j.rows || []))
    }, [])
    return (
        <div>
            <Header />
            <main className="max-w-5xl mx-auto p-6">
                <h1 className="text-xl font-bold">Histórico de Simulações</h1>
                <table className="w-full mt-4 border-collapse">
                    <thead><tr className="text-left"><th>Data</th><th>RBT12</th><th>Aliq Efetiva</th><th>Fator R</th></tr></thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id}><td>{new Date(r.data_calculo).toLocaleString()}</td><td>{r.rbt12}</td><td>{r.aliquota_efetiva}</td><td>{r.fator_r}</td></tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    )
}
