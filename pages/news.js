import Link from 'next/link'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Footer from '../components/Footer'

export default function News() {
    const news = [
        {
            title: 'Reforma Tributária: Entenda o impacto no DIFAL',
            date: '15 de dezembro de 2024',
            category: 'Reforma',
            excerpt: 'A reforma tributária traz mudanças significativas no regime de DIFAL. Entenda como isso afeta sua empresa.',
        },
        {
            title: 'Atualizações em NCM: Saiba o que mudou',
            date: '10 de dezembro de 2024',
            category: 'Guia',
            excerpt: 'Novas regras de classificação fiscal afetam importadores e exportadores. Confira as principais mudanças.',
        },
        {
            title: 'Como usar o Leitor de NF-e XML',
            date: '5 de dezembro de 2024',
            category: 'Ferramenta',
            excerpt: 'Passo a passo para importar e analisar informações de notas fiscais eletrônicas em nosso portal.',
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="container-wide py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Notícias Fiscais</h1>
                    <p className="text-slate-600 mt-2">Mantenha-se atualizado sobre as principais mudanças na legislação tributária e fiscal.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {news.map((article, i) => (
                            <article key={i} className="p-6 bg-white rounded-lg shadow-card-lg hover:shadow-lg transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <Badge>{article.category}</Badge>
                                        <h2 className="text-xl font-semibold text-slate-900 mt-3">{article.title}</h2>
                                        <p className="text-sm text-slate-500 mt-1">{article.date}</p>
                                        <p className="text-slate-700 mt-3">{article.excerpt}</p>
                                        <div className="mt-4"><a href="#" className="text-primary font-medium">Leia mais →</a></div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <aside className="space-y-6">
                        <div className="p-4 bg-white rounded-lg shadow-card-lg">
                            <h3 className="font-semibold text-slate-900">Categorias</h3>
                            <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-primary">Reforma Tributária</a></li>
                                <li><a href="#" className="hover:text-primary">ICMS / DIFAL</a></li>
                                <li><a href="#" className="hover:text-primary">Guias Práticas</a></li>
                                <li><a href="#" className="hover:text-primary">Ferramentas</a></li>
                            </ul>
                        </div>

                        <div className="p-4 bg-white rounded-lg shadow-card-lg">
                            <h3 className="font-semibold text-slate-900">Inscreva-se</h3>
                            <p className="text-sm text-slate-600 mt-2">Receba as novidades por e-mail.</p>
                            <div className="mt-3">
                                <Link href="/subscribe" legacyBehavior>
                                    <a className="inline-block bg-primary text-white px-4 py-2 rounded text-sm">Inscrever</a>
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    )
}
