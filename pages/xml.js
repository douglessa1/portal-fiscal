import Header from '../components/Header'
import { useState } from 'react'

export default function XmlReader() {
    const [xmlData, setXmlData] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await fetch('/api/xml/upload', { method: 'POST', body: formData })
            const data = await response.json()
            setXmlData(data)
        } catch (err) {
            console.error('Erro ao processar XML:', err)
            alert('Erro ao processar arquivo XML')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Header />
            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-primary mb-2">Leitor de NF-e XML</h1>
                <p className="text-muted-foreground mb-6">Importe sua nota fiscal eletrônica em formato XML e visualize informações estruturadas.</p>

                <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md border border-border">
                    <label className="block">
                        <span className="block text-sm font-semibold mb-3">Selecione um arquivo XML</span>
                        <input
                            type="file"
                            accept=".xml"
                            onChange={handleFileUpload}
                            disabled={loading}
                            className="block w-full p-3 border border-input bg-background text-foreground rounded cursor-pointer focus:ring-2 focus:ring-ring"
                        />
                    </label>
                </div>

                {loading && (
                    <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded">
                        Processando arquivo...
                    </div>
                )}

                {xmlData && !xmlData.error && (
                    <div className="mt-6 p-6 bg-card text-card-foreground rounded-lg shadow-md border border-border">
                        <h2 className="text-xl font-bold text-primary mb-4">Resultado</h2>
                        <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-96">
                            {JSON.stringify(xmlData, null, 2)}
                        </pre>
                    </div>
                )}

                {xmlData?.error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded">
                        Erro: {xmlData.error}
                    </div>
                )}
            </main>
        </div>
    )
}
