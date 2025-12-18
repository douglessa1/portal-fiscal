import Header from '../../components/Header'
import { useState } from 'react'

export default function IcmsSt() {
    const [valor, setValor] = useState('')
    const [aliqST, setAliqST] = useState('')
    const [mvaSt, setMvaSt] = useState('')
    const [result, setResult] = useState(null)

    function parseCurrencyInput(str) {
        if (!str) return NaN
        str = String(str).trim()
        if (str.indexOf(',') > -1 && str.indexOf('.') > -1) {
            str = str.replace(/\./g, '').replace(',', '.')
        } else {
            str = str.replace(',', '.')
        }
        str = str.replace(/[^\d.\-]/g, '')
        return parseFloat(str)
    }

    function fmtMoney(v) {
        if (isNaN(v)) return '-'
        return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    const calcular = () => {
        const v = parseCurrencyInput(valor)
        const aliq = parseFloat(aliqST) / 100
        const mva = parseFloat(mvaSt) / 100

        if (isNaN(v) || isNaN(aliq) || isNaN(mva)) return alert('Preencha todos os campos')

        const baseAjustada = v * (1 + mva)
        const icmsST = baseAjustada * aliq
        const totalComICMS = v + icmsST

        setResult({ baseAjustada, icmsST, totalComICMS })
    }

    return (
        <div>
            <Header />
            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-purple-700 mb-4">Calculadora ICMS-ST</h1>
                <p className="text-gray-600 mb-6">Calcule a Substituição Tributária com base na MVA (Margem de Valor Agregado).</p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Valor da Nota (R$)</label>
                        <input
                            type="text"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Ex: 1.000,00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Alíquota ICMS-ST (%)</label>
                        <input
                            type="number"
                            value={aliqST}
                            onChange={(e) => setAliqST(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Ex: 18"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">MVA ST (%)</label>
                        <input
                            type="number"
                            value={mvaSt}
                            onChange={(e) => setMvaSt(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Ex: 40"
                        />
                    </div>
                </div>

                <button onClick={calcular} className="px-6 py-2 bg-purple-600 text-white rounded font-semibold">
                    Calcular
                </button>

                {result && (
                    <div className="mt-6 p-4 bg-white rounded shadow-sm">
                        <h2 className="font-bold text-purple-700 mb-4">Resultado</h2>
                        <div className="space-y-2">
                            <div><strong>Base Ajustada:</strong> {fmtMoney(result.baseAjustada)}</div>
                            <div><strong>ICMS-ST:</strong> {fmtMoney(result.icmsST)}</div>
                            <div className="font-bold text-lg">Total: {fmtMoney(result.totalComICMS)}</div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
