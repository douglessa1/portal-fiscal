import Link from 'next/link'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Footer from '../components/Footer'

export default function Tools() {
    const tools = [
        {
            name: 'DIFAL (Calculadora)',
            href: '/tools/difal',
            desc: 'Calcule base dupla e DIFAL em operações interestaduais',
            icon: '📊',
        },
        {
            name: 'ICMS-ST',
            href: '/tools/icms-st',
            desc: 'Simulador de Substituição Tributária',
            icon: '🔢',
        },
        {
            name: 'Leitor de NF-e XML',
            href: '/xml',
            desc: 'Importe e analise informações de notas fiscais eletrônicas',
            icon: '📄',
        },
        {
            name: 'Simples Nacional Avançado',
            href: '/tools/simples-advanced',
            desc: 'Cálculos avançados para regime de Simples Nacional',
            icon: '⚙️',
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="container-wide py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Ferramentas Fiscais</h1>
                    <p className="text-slate-600 mt-2">Calculadoras e simuladores para facilitar sua rotina fiscal e contábil.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {tools.map((tool, i) => (
                        <Link key={i} href={tool.href} legacyBehavior>
                            <a className="block group">
                                <Card>
                                    <div className="text-3xl mb-3">{tool.icon}</div>
                                    <h2 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition">{tool.name}</h2>
                                    <p className="text-slate-600 mt-2 text-sm">{tool.desc}</p>
                                    <div className="mt-4 text-primary font-medium">Abrir →</div>
                                </Card>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}
