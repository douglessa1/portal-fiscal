import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { Code, Copy, CheckCircle, Key, Lock, Zap, Server, Shield, ArrowRight } from 'lucide-react';

const API_ENDPOINTS = [
    {
        method: 'POST',
        path: '/api/v1/difal',
        description: 'Calcula o DIFAL para operações interestaduais',
        auth: true,
        params: [
            { name: 'valor', type: 'number', required: true, description: 'Valor da operação' },
            { name: 'aliquota_origem', type: 'number', required: true, description: 'Alíquota interestadual (%)' },
            { name: 'aliquota_destino', type: 'number', required: true, description: 'Alíquota interna do destino (%)' },
            { name: 'fcp', type: 'number', required: false, description: 'Fundo de Combate à Pobreza (%)' }
        ],
        response: {
            difal: 120.00,
            base_calculo: 1000.00,
            aliquota_diferenca: 6.00,
            fcp_valor: 20.00,
            hash: 'DIFAL-ABC123'
        }
    },
    {
        method: 'POST',
        path: '/api/v1/icms-st',
        description: 'Calcula o ICMS Substituição Tributária',
        auth: true,
        params: [
            { name: 'valor_produto', type: 'number', required: true, description: 'Valor do produto' },
            { name: 'mva', type: 'number', required: true, description: 'Margem de Valor Agregado (%)' },
            { name: 'aliquota_interna', type: 'number', required: true, description: 'Alíquota interna (%)' },
            { name: 'aliquota_interestadual', type: 'number', required: false, description: 'Alíquota interestadual (%)' }
        ],
        response: {
            base_st: 1400.00,
            icms_proprio: 120.00,
            icms_st: 132.00,
            total: 1532.00,
            hash: 'ST-XYZ789'
        }
    },
    {
        method: 'POST',
        path: '/api/v1/simples',
        description: 'Calcula tributos do Simples Nacional',
        auth: true,
        params: [
            { name: 'receita_bruta_12m', type: 'number', required: true, description: 'Receita bruta 12 meses' },
            { name: 'receita_mes', type: 'number', required: true, description: 'Receita do mês' },
            { name: 'anexo', type: 'string', required: true, description: 'Anexo (I, II, III, IV, V)' }
        ],
        response: {
            aliquota_efetiva: 7.30,
            das_valor: 730.00,
            repartição: {
                irpj: 73.00,
                csll: 73.00,
                cofins: 117.53,
                pis: 25.55
            },
            hash: 'SIMPLES-DEF456'
        }
    },
    {
        method: 'GET',
        path: '/api/v1/cfop/:codigo',
        description: 'Consulta informações de um CFOP',
        auth: false,
        params: [
            { name: 'codigo', type: 'string', required: true, description: 'Código CFOP (4 dígitos)' }
        ],
        response: {
            codigo: '5102',
            descricao: 'Venda de mercadoria adquirida...',
            tipo: 'Saída',
            uf: 'Dentro do Estado',
            natureza: 'Venda'
        }
    },
    {
        method: 'GET',
        path: '/api/v1/ncm/:codigo',
        description: 'Consulta informações de um NCM',
        auth: false,
        params: [
            { name: 'codigo', type: 'string', required: true, description: 'Código NCM (8 dígitos)' }
        ],
        response: {
            ncm: '84713012',
            descricao: 'Máquinas automáticas para processamento de dados, portáteis',
            capitulo: '84',
            ipi: 0,
            tipi: 'II'
        }
    }
];

export default function APIDocsPage() {
    const [copied, setCopied] = useState('');
    const [activeEndpoint, setActiveEndpoint] = useState(API_ENDPOINTS[0]);

    const copyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopied(id);
        setTimeout(() => setCopied(''), 2000);
    };

    const curlExample = `curl -X POST https://portal-fiscal.com.br/api/v1/difal \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "valor": 1000,
    "aliquota_origem": 12,
    "aliquota_destino": 18,
    "fcp": 2
  }'`;

    const jsExample = `const response = await fetch('https://portal-fiscal.com.br/api/v1/difal', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    valor: 1000,
    aliquota_origem: 12,
    aliquota_destino: 18,
    fcp: 2
  })
});

const data = await response.json();
console.log(data.difal); // 80.00`;

    return (
        <>
            <Head>
                <title>API Pública - Portal Fiscal</title>
            </Head>

            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="pt-[70px]">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16">
                        <div className="max-w-6xl mx-auto px-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Code className="w-8 h-8" />
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">API v1</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">API Pública Portal Fiscal</h1>
                            <p className="text-xl text-white/80 max-w-2xl mb-8">
                                Integre cálculos fiscais em seus sistemas. REST API simples e documentada.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="/planos" className="h-11 px-6 bg-white text-indigo-700 font-medium rounded-lg flex items-center gap-2 hover:bg-white/90">
                                    <Key className="w-4 h-4" /> Obter API Key
                                </Link>
                                <a href="#endpoints" className="h-11 px-6 border border-white/30 rounded-lg flex items-center gap-2 hover:bg-white/10">
                                    Ver Documentação
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="max-w-6xl mx-auto px-6 py-12">
                        <div className="grid grid-cols-3 gap-6 mb-12">
                            <div className="p-6 bg-card border border-border rounded-xl">
                                <Zap className="w-8 h-8 text-amber-500 mb-3" />
                                <h3 className="font-semibold text-foreground mb-2">Alta Performance</h3>
                                <p className="text-sm text-muted-foreground">
                                    Latência média de 50ms. Infraestrutura escalável para milhões de requisições.
                                </p>
                            </div>
                            <div className="p-6 bg-card border border-border rounded-xl">
                                <Shield className="w-8 h-8 text-green-500 mb-3" />
                                <h3 className="font-semibold text-foreground mb-2">Seguro</h3>
                                <p className="text-sm text-muted-foreground">
                                    HTTPS obrigatório, autenticação via Bearer token, rate limiting configurável.
                                </p>
                            </div>
                            <div className="p-6 bg-card border border-border rounded-xl">
                                <Server className="w-8 h-8 text-blue-500 mb-3" />
                                <h3 className="font-semibold text-foreground mb-2">RESTful</h3>
                                <p className="text-sm text-muted-foreground">
                                    API REST padrão. Respostas em JSON. Compatível com qualquer linguagem.
                                </p>
                            </div>
                        </div>

                        {/* Quick Start */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Start</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">cURL</span>
                                        <button onClick={() => copyCode(curlExample, 'curl')}
                                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                            {copied === 'curl' ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                            {copied === 'curl' ? 'Copiado!' : 'Copiar'}
                                        </button>
                                    </div>
                                    <pre className="p-4 bg-gray-900 text-green-400 text-sm rounded-lg overflow-auto font-mono">
                                        {curlExample}
                                    </pre>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">JavaScript</span>
                                        <button onClick={() => copyCode(jsExample, 'js')}
                                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                            {copied === 'js' ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                            {copied === 'js' ? 'Copiado!' : 'Copiar'}
                                        </button>
                                    </div>
                                    <pre className="p-4 bg-gray-900 text-blue-400 text-sm rounded-lg overflow-auto font-mono">
                                        {jsExample}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Endpoints */}
                        <div id="endpoints">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Endpoints</h2>
                            <div className="grid grid-cols-3 gap-6">
                                {/* Endpoint List */}
                                <div className="space-y-2">
                                    {API_ENDPOINTS.map((endpoint, idx) => (
                                        <button key={idx} onClick={() => setActiveEndpoint(endpoint)}
                                            className={`w-full text-left p-3 rounded-lg border transition-colors ${activeEndpoint.path === endpoint.path
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${endpoint.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {endpoint.method}
                                                </span>
                                                {endpoint.auth && <Lock className="w-3 h-3 text-amber-500" />}
                                            </div>
                                            <div className="text-sm font-mono text-foreground">{endpoint.path}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Endpoint Details */}
                                <div className="col-span-2 bg-card border border-border rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`text-sm font-mono font-bold px-2 py-1 rounded ${activeEndpoint.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {activeEndpoint.method}
                                        </span>
                                        <code className="text-foreground font-mono">{activeEndpoint.path}</code>
                                        {activeEndpoint.auth && (
                                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> Requer Auth
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-muted-foreground mb-6">{activeEndpoint.description}</p>

                                    {/* Parameters */}
                                    <h4 className="font-semibold text-foreground mb-3">Parâmetros</h4>
                                    <table className="w-full text-sm mb-6">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left py-2 text-foreground">Nome</th>
                                                <th className="text-left py-2 text-foreground">Tipo</th>
                                                <th className="text-left py-2 text-foreground">Obrigatório</th>
                                                <th className="text-left py-2 text-foreground">Descrição</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeEndpoint.params.map((param, idx) => (
                                                <tr key={idx} className="border-b border-border/50">
                                                    <td className="py-2 font-mono text-primary">{param.name}</td>
                                                    <td className="py-2 text-muted-foreground">{param.type}</td>
                                                    <td className="py-2">
                                                        {param.required ? (
                                                            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Sim</span>
                                                        ) : (
                                                            <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">Não</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2 text-muted-foreground">{param.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Response */}
                                    <h4 className="font-semibold text-foreground mb-3">Resposta</h4>
                                    <pre className="p-4 bg-gray-900 text-gray-300 text-sm rounded-lg font-mono overflow-auto">
                                        {JSON.stringify(activeEndpoint.response, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white text-center">
                            <h2 className="text-2xl font-bold mb-4">Pronto para integrar?</h2>
                            <p className="text-white/80 mb-6">
                                Assine o plano PRO ou AUDITOR e receba sua API Key instantaneamente.
                            </p>
                            <Link href="/planos" className="inline-flex items-center gap-2 h-11 px-6 bg-white text-indigo-700 font-medium rounded-lg hover:bg-white/90">
                                Ver Planos <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
