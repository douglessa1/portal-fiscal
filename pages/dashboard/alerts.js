export const dynamic = 'force-dynamic';
import Header from '../../components/Header'
import { useEffect, useState } from 'react'

export default function Alerts() {
    const [rows, setRows] = useState([]);
    useEffect(() => { fetch('/api/alerts/list').then(r => r.json()).then(j => setRows(j.rows || [])) }, [])
    return (
        <div>
            <Header />
            <main className="max-w-5xl mx-auto p-6">
                <h1 className="text-xl font-bold">Alertas Fiscais</h1>
                <ul className="mt-4 space-y-3">
                    {rows.map(a => (<li key={a.id} className="p-3 bg-card text-card-foreground rounded-lg shadow-sm border border-border"><strong>{a.type}</strong> — <pre>{JSON.stringify(a.payload)}</pre><div className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div></li>))}
                </ul>
            </main>
        </div>
    )
}
