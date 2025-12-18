import ToolLayout from '../../components/Layout/ToolLayout';
import { useState } from 'react';
import { Search, ArrowRight, Copy, Scale, Check } from 'lucide-react';
import { getCSTSuggestion, CST_ICMS_TRIBUTACAO, CSOSN } from '../../lib/data/cstDatabase';

// CFOP Database - principais códigos
const CFOP_DATABASE = [
    // Entradas - Dentro do Estado
    { codigo: '1101', descricao: 'Compra para industrialização', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Compra' },
    { codigo: '1102', descricao: 'Compra para comercialização', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Compra' },
    { codigo: '1111', descricao: 'Compra para industrialização de mercadoria em consignação', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Consignação' },
    { codigo: '1116', descricao: 'Compra para industrialização originada de encomenda para recebimento futuro', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Compra' },
    { codigo: '1117', descricao: 'Compra para comercialização originada de encomenda para recebimento futuro', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Compra' },
    { codigo: '1118', descricao: 'Compra de mercadoria para comercialização pelo adquirente originário, entregue pelo vendedor', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Triangular' },
    { codigo: '1120', descricao: 'Compra para industrialização em operação com mercadoria sujeita ao regime de ST', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'ST' },
    { codigo: '1121', descricao: 'Compra para comercialização em operação com mercadoria sujeita ao regime de ST', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'ST' },
    { codigo: '1124', descricao: 'Industrialização efetuada por outra empresa', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Industrialização' },
    { codigo: '1125', descricao: 'Industrialização efetuada por outra empresa quando a mercadoria não transitar', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Industrialização' },
    { codigo: '1126', descricao: 'Compra para utilização na prestação de serviço sujeita ao ICMS', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Serviço' },
    { codigo: '1128', descricao: 'Compra para utilização na prestação de serviço sujeita ao ISSQN', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Serviço' },
    { codigo: '1151', descricao: 'Transferência para industrialização', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Transferência' },
    { codigo: '1152', descricao: 'Transferência para comercialização', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Transferência' },
    { codigo: '1201', descricao: 'Devolução de venda de produção do estabelecimento', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Devolução' },
    { codigo: '1202', descricao: 'Devolução de venda de mercadoria adquirida ou recebida de terceiros', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Devolução' },
    { codigo: '1251', descricao: 'Compra de energia elétrica para distribuição ou comercialização', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Energia' },
    { codigo: '1252', descricao: 'Compra de energia elétrica por estabelecimento industrial', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Energia' },
    { codigo: '1253', descricao: 'Compra de energia elétrica por estabelecimento comercial', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Energia' },
    { codigo: '1401', descricao: 'Compra para industrialização ou produção rural em operação com mercadoria sujeita ao regime de ST', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'ST' },
    { codigo: '1403', descricao: 'Compra para comercialização em operação com mercadoria sujeita ao regime de ST', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'ST' },
    { codigo: '1551', descricao: 'Compra de bem para o ativo imobilizado', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Ativo' },
    { codigo: '1556', descricao: 'Compra de material para uso ou consumo', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Uso/Consumo' },
    { codigo: '1901', descricao: 'Entrada para industrialização por encomenda', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Industrialização' },
    { codigo: '1902', descricao: 'Retorno de mercadoria remetida para industrialização por encomenda', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1903', descricao: 'Entrada de mercadoria remetida para industrialização e não aplicada', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1904', descricao: 'Retorno de remessa para venda fora do estabelecimento', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1905', descricao: 'Entrada de mercadoria recebida para depósito em depósito fechado ou armazém geral', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Depósito' },
    { codigo: '1906', descricao: 'Retorno de mercadoria remetida para depósito fechado ou armazém geral', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1907', descricao: 'Retorno simbólico de mercadoria remetida para depósito fechado ou armazém geral', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1908', descricao: 'Entrada de bem por conta de contrato de comodato', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Comodato' },
    { codigo: '1909', descricao: 'Retorno de bem remetido por conta de contrato de comodato', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1910', descricao: 'Entrada de bonificação, doação ou brinde', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Bonificação' },
    { codigo: '1911', descricao: 'Entrada de amostra grátis', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Amostra' },
    { codigo: '1912', descricao: 'Entrada de mercadoria ou bem recebido para demonstração', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Demonstração' },
    { codigo: '1913', descricao: 'Retorno de mercadoria ou bem remetido para demonstração', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1914', descricao: 'Retorno de mercadoria ou bem remetido para exposição ou feira', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1915', descricao: 'Entrada de mercadoria ou bem recebido para conserto ou reparo', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Conserto' },
    { codigo: '1916', descricao: 'Retorno de mercadoria ou bem remetido para conserto ou reparo', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '1949', descricao: 'Outra entrada de mercadoria ou prestação de serviço não especificada', tipo: 'Entrada', uf: 'Dentro do Estado', natureza: 'Outros' },

    // Entradas - Fora do Estado
    { codigo: '2101', descricao: 'Compra para industrialização', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Compra' },
    { codigo: '2102', descricao: 'Compra para comercialização', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Compra' },
    { codigo: '2151', descricao: 'Transferência para industrialização', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Transferência' },
    { codigo: '2152', descricao: 'Transferência para comercialização', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Transferência' },
    { codigo: '2201', descricao: 'Devolução de venda de produção do estabelecimento', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Devolução' },
    { codigo: '2202', descricao: 'Devolução de venda de mercadoria adquirida ou recebida de terceiros', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Devolução' },
    { codigo: '2403', descricao: 'Compra para comercialização em operação com mercadoria sujeita ao regime de ST', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'ST' },
    { codigo: '2551', descricao: 'Compra de bem para o ativo imobilizado', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Ativo' },
    { codigo: '2556', descricao: 'Compra de material para uso ou consumo', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Uso/Consumo' },
    { codigo: '2949', descricao: 'Outra entrada de mercadoria ou prestação de serviço não especificada', tipo: 'Entrada', uf: 'Fora do Estado', natureza: 'Outros' },

    // Entradas - Exterior
    { codigo: '3101', descricao: 'Compra para industrialização', tipo: 'Entrada', uf: 'Exterior', natureza: 'Importação' },
    { codigo: '3102', descricao: 'Compra para comercialização', tipo: 'Entrada', uf: 'Exterior', natureza: 'Importação' },
    { codigo: '3551', descricao: 'Compra de bem para o ativo imobilizado', tipo: 'Entrada', uf: 'Exterior', natureza: 'Importação' },
    { codigo: '3949', descricao: 'Outra entrada de mercadoria ou prestação de serviço não especificada', tipo: 'Entrada', uf: 'Exterior', natureza: 'Importação' },

    // Saídas - Dentro do Estado
    { codigo: '5101', descricao: 'Venda de produção do estabelecimento', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Venda' },
    { codigo: '5102', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Venda' },
    { codigo: '5103', descricao: 'Venda de produção do estabelecimento efetuada fora do estabelecimento', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Venda' },
    { codigo: '5104', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros efetuada fora do estabelecimento', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Venda' },
    { codigo: '5105', descricao: 'Venda de produção do estabelecimento que não deva por ele transitar', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Triangular' },
    { codigo: '5106', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros que não deva por ele transitar', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Triangular' },
    { codigo: '5110', descricao: 'Venda de produção do estabelecimento, destinada à Zona Franca de Manaus ou Áreas de Livre Comércio', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'ZFM' },
    { codigo: '5111', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros, destinada à Zona Franca de Manaus ou Áreas de Livre Comércio', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'ZFM' },
    { codigo: '5116', descricao: 'Venda de produção do estabelecimento originada de encomenda para entrega futura', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Venda' },
    { codigo: '5117', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros originada de encomenda para entrega futura', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Venda' },
    { codigo: '5118', descricao: 'Venda de produção do estabelecimento entregue ao destinatário por conta e ordem do adquirente originário', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Triangular' },
    { codigo: '5119', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros entregue ao destinatário', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Triangular' },
    { codigo: '5120', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros entregue ao destinatário pelo vendedor remetente', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Triangular' },
    { codigo: '5122', descricao: 'Venda de produção do estabelecimento remetida para industrialização', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Industrialização' },
    { codigo: '5123', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros remetida para industrialização', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Industrialização' },
    { codigo: '5124', descricao: 'Industrialização efetuada para outra empresa', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Industrialização' },
    { codigo: '5125', descricao: 'Industrialização efetuada para outra empresa quando a mercadoria não transitar pelo estabelecimento', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Industrialização' },
    { codigo: '5151', descricao: 'Transferência de produção do estabelecimento', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Transferência' },
    { codigo: '5152', descricao: 'Transferência de mercadoria adquirida ou recebida de terceiros', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Transferência' },
    { codigo: '5201', descricao: 'Devolução de compra para industrialização', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Devolução' },
    { codigo: '5202', descricao: 'Devolução de compra para comercialização', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Devolução' },
    { codigo: '5401', descricao: 'Venda de produção do estabelecimento em operação com produto sujeito ao regime de ST', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'ST' },
    { codigo: '5403', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de ST', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'ST' },
    { codigo: '5405', descricao: 'Venda de mercadoria sujeita ao regime de ST, cujo imposto já foi retido anteriormente', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'ST' },
    { codigo: '5551', descricao: 'Venda de bem do ativo imobilizado', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Ativo' },
    { codigo: '5556', descricao: 'Devolução de compra de material de uso ou consumo', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Devolução' },
    { codigo: '5901', descricao: 'Remessa para industrialização por encomenda', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Industrialização' },
    { codigo: '5902', descricao: 'Retorno de mercadoria utilizada na industrialização por encomenda', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '5903', descricao: 'Retorno de mercadoria recebida para industrialização e não aplicada', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '5904', descricao: 'Remessa para venda fora do estabelecimento', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Venda' },
    { codigo: '5905', descricao: 'Remessa para depósito fechado ou armazém geral', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Depósito' },
    { codigo: '5906', descricao: 'Retorno de mercadoria depositada em depósito fechado ou armazém geral', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '5910', descricao: 'Remessa em bonificação, doação ou brinde', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Bonificação' },
    { codigo: '5911', descricao: 'Remessa de amostra grátis', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Amostra' },
    { codigo: '5912', descricao: 'Remessa de mercadoria ou bem para demonstração', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Demonstração' },
    { codigo: '5913', descricao: 'Retorno de mercadoria ou bem recebido para demonstração', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '5914', descricao: 'Remessa de mercadoria ou bem para exposição ou feira', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Exposição' },
    { codigo: '5915', descricao: 'Remessa de mercadoria ou bem para conserto ou reparo', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Conserto' },
    { codigo: '5916', descricao: 'Retorno de mercadoria ou bem recebido para conserto ou reparo', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Retorno' },
    { codigo: '5929', descricao: 'Lançamento efetuado em decorrência de emissão de documento fiscal', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Ajuste' },
    { codigo: '5949', descricao: 'Outra saída de mercadoria ou prestação de serviço não especificada', tipo: 'Saída', uf: 'Dentro do Estado', natureza: 'Outros' },

    // Saídas - Fora do Estado
    { codigo: '6101', descricao: 'Venda de produção do estabelecimento', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Venda' },
    { codigo: '6102', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Venda' },
    { codigo: '6107', descricao: 'Venda de produção do estabelecimento, destinada a não contribuinte', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'DIFAL' },
    { codigo: '6108', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros, destinada a não contribuinte', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'DIFAL' },
    { codigo: '6151', descricao: 'Transferência de produção do estabelecimento', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Transferência' },
    { codigo: '6152', descricao: 'Transferência de mercadoria adquirida ou recebida de terceiros', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Transferência' },
    { codigo: '6201', descricao: 'Devolução de compra para industrialização', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Devolução' },
    { codigo: '6202', descricao: 'Devolução de compra para comercialização', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Devolução' },
    { codigo: '6401', descricao: 'Venda de produção do estabelecimento em operação com produto sujeito ao regime de ST', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'ST' },
    { codigo: '6403', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de ST', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'ST' },
    { codigo: '6551', descricao: 'Venda de bem do ativo imobilizado', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Ativo' },
    { codigo: '6901', descricao: 'Remessa para industrialização por encomenda', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Industrialização' },
    { codigo: '6949', descricao: 'Outra saída de mercadoria ou prestação de serviço não especificada', tipo: 'Saída', uf: 'Fora do Estado', natureza: 'Outros' },

    // Saídas - Exterior
    { codigo: '7101', descricao: 'Venda de produção do estabelecimento', tipo: 'Saída', uf: 'Exterior', natureza: 'Exportação' },
    { codigo: '7102', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros', tipo: 'Saída', uf: 'Exterior', natureza: 'Exportação' },
    { codigo: '7949', descricao: 'Outra saída de mercadoria ou prestação de serviço não especificada', tipo: 'Saída', uf: 'Exterior', natureza: 'Exportação' },
];

export default function CFOPConsultaPage() {
    const [query, setQuery] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const [ufFilter, setUfFilter] = useState('');
    const [naturezaFilter, setNaturezaFilter] = useState('');
    const [selectedCFOP, setSelectedCFOP] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const cstSuggestion = selectedCFOP ? getCSTSuggestion(selectedCFOP.codigo) : null;

    const filteredCFOPs = CFOP_DATABASE.filter(cfop => {
        const matchQuery = !query || cfop.codigo.includes(query) || cfop.descricao.toLowerCase().includes(query.toLowerCase());
        const matchTipo = !tipoFilter || cfop.tipo === tipoFilter;
        const matchUF = !ufFilter || cfop.uf === ufFilter;
        const matchNatureza = !naturezaFilter || cfop.natureza === naturezaFilter;
        return matchQuery && matchTipo && matchUF && matchNatureza;
    });

    const naturezas = [...new Set(CFOP_DATABASE.map(c => c.natureza))].sort();

    return (
        <ToolLayout title="Consulta CFOP" description="Consulte códigos CFOP">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-500/10 rounded-xl">
                        <ArrowRight className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Consulta CFOP</h1>
                        <p className="text-sm text-muted-foreground">Código Fiscal de Operações e Prestações</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        {/* Filters */}
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="grid grid-cols-4 gap-3">
                                <div>
                                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Código ou descrição..."
                                        className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background" />
                                </div>
                                <div>
                                    <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}
                                        className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                        <option value="">Todos os tipos</option>
                                        <option value="Entrada">Entrada</option>
                                        <option value="Saída">Saída</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={ufFilter} onChange={(e) => setUfFilter(e.target.value)}
                                        className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                        <option value="">Todas as origens</option>
                                        <option value="Dentro do Estado">Dentro do Estado</option>
                                        <option value="Fora do Estado">Fora do Estado</option>
                                        <option value="Exterior">Exterior</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={naturezaFilter} onChange={(e) => setNaturezaFilter(e.target.value)}
                                        className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background">
                                        <option value="">Todas as naturezas</option>
                                        {naturezas.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="bg-muted px-4 py-2 border-b border-border">
                                <span className="text-sm font-semibold text-foreground">{filteredCFOPs.length} resultados</span>
                            </div>
                            <div className="max-h-[500px] overflow-auto divide-y divide-border/50">
                                {filteredCFOPs.map((cfop, idx) => (
                                    <button key={idx} onClick={() => setSelectedCFOP(cfop)}
                                        className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selectedCFOP?.codigo === cfop.codigo ? 'bg-primary/5 border-l-2 border-primary' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="font-mono text-lg font-bold text-primary">{cfop.codigo}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm text-foreground">{cfop.descricao}</div>
                                                <div className="flex gap-2 mt-1">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${cfop.tipo === 'Entrada' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                                        {cfop.tipo}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{cfop.uf}</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{cfop.natureza}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-4">
                        {selectedCFOP && (
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-mono text-2xl font-bold text-primary">{selectedCFOP.codigo}</span>
                                    <button onClick={() => navigator.clipboard.writeText(selectedCFOP.codigo)}
                                        className="h-8 px-2 text-xs rounded border border-input hover:bg-muted flex items-center gap-1">
                                        <Copy className="w-3 h-3" /> Copiar
                                    </button>
                                </div>
                                <p className="text-sm text-foreground mb-3">{selectedCFOP.descricao}</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span className="text-muted-foreground">Tipo</span>
                                        <span className="font-medium">{selectedCFOP.tipo}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span className="text-muted-foreground">Origem/Destino</span>
                                        <span className="font-medium">{selectedCFOP.uf}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span className="text-muted-foreground">Natureza</span>
                                        <span className="font-medium">{selectedCFOP.natureza}</span>
                                    </div>
                                </div>

                                {/* CST Sugerido */}
                                {cstSuggestion && (
                                    <div className="border-t border-border pt-4 mt-4">
                                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                                            <Scale className="w-3.5 h-3.5" />
                                            CST Sugerido
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-blue-700 dark:text-blue-300 font-medium">CST ICMS: {cstSuggestion.icms.cst}</span>
                                                </div>
                                                <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">{cstSuggestion.icms.descricao}</div>
                                            </div>
                                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-green-700 dark:text-green-300 font-medium">CSOSN: {cstSuggestion.csosn.cst}</span>
                                                </div>
                                                <div className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">{cstSuggestion.csosn.descricao}</div>
                                            </div>
                                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-purple-700 dark:text-purple-300 font-medium">PIS/COFINS: {cstSuggestion.pis.cst}</span>
                                                </div>
                                                <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5">{cstSuggestion.pis.descricao}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4 text-sm text-violet-800 dark:text-violet-200">
                            <h4 className="font-semibold mb-2">📋 CFOP</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• 1xxx - Entrada estado</li>
                                <li>• 2xxx - Entrada fora estado</li>
                                <li>• 3xxx - Entrada exterior</li>
                                <li>• 5xxx - Saída estado</li>
                                <li>• 6xxx - Saída fora estado</li>
                                <li>• 7xxx - Saída exterior</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
