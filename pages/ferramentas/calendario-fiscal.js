export const dynamic = 'force-dynamic';
import ToolLayout from '../../components/Layout/ToolLayout';
import { useState } from 'react';
import { Calendar, Bell, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Obrigações fiscais por regime
const OBRIGACOES = {
    todos: [
        { nome: 'DCTF', dia: 15, descricao: 'Declaração de Débitos e Créditos Tributários Federais', tipo: 'federal' },
        { nome: 'EFD ICMS/IPI', dia: 25, descricao: 'Escrituração Fiscal Digital', tipo: 'estadual' },
        { nome: 'GIA', dia: 15, descricao: 'Guia de Informação e Apuração do ICMS', tipo: 'estadual' }
    ],
    simples: [
        { nome: 'DAS', dia: 20, descricao: 'Documento de Arrecadação do Simples Nacional', tipo: 'simples' },
        { nome: 'DEFIS', dia: 31, mes: 3, descricao: 'Declaração de Informações Socioeconômicas e Fiscais', tipo: 'simples', anual: true },
        { nome: 'PGDAS-D', dia: 20, descricao: 'Programa Gerador do DAS Declaratório', tipo: 'simples' }
    ],
    mei: [
        { nome: 'DAS-MEI', dia: 20, descricao: 'Documento de Arrecadação Simplificada do MEI', tipo: 'mei' },
        { nome: 'DASN-SIMEI', dia: 31, mes: 5, descricao: 'Declaração Anual Simplificada', tipo: 'mei', anual: true }
    ],
    lucroReal: [
        { nome: 'ECF', dia: 31, mes: 7, descricao: 'Escrituração Contábil Fiscal', tipo: 'federal', anual: true },
        { nome: 'ECD', dia: 31, mes: 5, descricao: 'Escrituração Contábil Digital', tipo: 'federal', anual: true },
        { nome: 'IRPJ/CSLL', dia: 30, descricao: 'Apuração Trimestral', tipo: 'federal', trimestral: true },
        { nome: 'PIS/COFINS', dia: 25, descricao: 'Contribuições sobre o Faturamento', tipo: 'federal' },
        { nome: 'DARF IRRF', dia: 20, descricao: 'Imposto de Renda Retido na Fonte', tipo: 'federal' },
        { nome: 'SPED Contribuições', dia: 15, descricao: 'EFD Contribuições', tipo: 'federal' }
    ],
    lucroPresumido: [
        { nome: 'IRPJ/CSLL', dia: 30, descricao: 'Apuração Trimestral', tipo: 'federal', trimestral: true },
        { nome: 'PIS/COFINS Cumulativo', dia: 25, descricao: 'Contribuições Cumulativas', tipo: 'federal' },
        { nome: 'DARF IRRF', dia: 20, descricao: 'Imposto de Renda Retido na Fonte', tipo: 'federal' },
        { nome: 'ECF', dia: 31, mes: 7, descricao: 'Escrituração Contábil Fiscal', tipo: 'federal', anual: true }
    ]
};

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarioFiscalPage() {
    const [regime, setRegime] = useState('simples');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Get obligations for current regime
    const getObligations = () => {
        const base = [...OBRIGACOES.todos];
        const specific = OBRIGACOES[regime] || [];
        return [...base, ...specific];
    };

    // Get obligations for a specific day
    const getObligationsForDay = (day) => {
        const obligations = getObligations();
        return obligations.filter(ob => {
            if (ob.anual && ob.mes !== month + 1) return false;
            if (ob.trimestral && ![2, 5, 8, 11].includes(month)) return false;
            return ob.dia === day;
        });
    };

    // Check if day has obligations
    const dayHasObligations = (day) => getObligationsForDay(day).length > 0;

    // Check if day is past
    const isPast = (day) => {
        const today = new Date();
        const checkDate = new Date(year, month, day);
        return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    // Check if day is today
    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    // Navigate months
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Generate calendar days
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    // Upcoming obligations (next 30 days)
    const getUpcomingObligations = () => {
        const upcoming = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() + i);
            const day = checkDate.getDate();
            const m = checkDate.getMonth();

            const obligations = getObligations().filter(ob => {
                if (ob.anual && ob.mes !== m + 1) return false;
                if (ob.trimestral && ![2, 5, 8, 11].includes(m)) return false;
                return ob.dia === day;
            });

            obligations.forEach(ob => {
                upcoming.push({
                    ...ob,
                    date: new Date(checkDate),
                    daysUntil: i
                });
            });
        }

        return upcoming;
    };

    const upcomingObligations = getUpcomingObligations();

    return (
        <ToolLayout title="Calendário Fiscal" description="Acompanhe suas obrigações fiscais">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-foreground">Calendário Fiscal</h1>
                        <p className="text-sm text-muted-foreground">Obrigações fiscais por regime tributário</p>
                    </div>
                    <select value={regime} onChange={(e) => setRegime(e.target.value)}
                        className="h-9 px-3 text-sm rounded-lg border border-input bg-background">
                        <option value="mei">MEI</option>
                        <option value="simples">Simples Nacional</option>
                        <option value="lucroPresumido">Lucro Presumido</option>
                        <option value="lucroReal">Lucro Real</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        {/* Calendar */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-lg">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h2 className="text-lg font-semibold text-foreground">
                                    {MESES[month]} {year}
                                </h2>
                                <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Days of week */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {DIAS_SEMANA.map(dia => (
                                    <div key={dia} className="text-center text-xs font-medium text-muted-foreground py-2">
                                        {dia}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((day, idx) => (
                                    <div key={idx} className={`aspect-square p-1 ${day ? 'cursor-pointer' : ''}`}
                                        onClick={() => day && setSelectedDate({ day, month, year })}>
                                        {day && (
                                            <div className={`h-full rounded-lg flex flex-col items-center justify-center relative transition-colors ${isToday(day) ? 'bg-primary text-primary-foreground' :
                                                    isPast(day) ? 'text-muted-foreground' :
                                                        dayHasObligations(day) ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200' :
                                                            'hover:bg-muted'
                                                }`}>
                                                <span className="text-sm font-medium">{day}</span>
                                                {dayHasObligations(day) && (
                                                    <div className="flex gap-0.5 mt-0.5">
                                                        {getObligationsForDay(day).slice(0, 3).map((_, i) => (
                                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? 'bg-white' : 'bg-amber-500'}`} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Selected day obligations */}
                        {selectedDate && (
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">
                                    Obrigações em {selectedDate.day}/{selectedDate.month + 1}/{selectedDate.year}
                                </h3>
                                {getObligationsForDay(selectedDate.day).length > 0 ? (
                                    <div className="space-y-2">
                                        {getObligationsForDay(selectedDate.day).map((ob, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <div className={`w-2 h-2 rounded-full ${ob.tipo === 'federal' ? 'bg-blue-500' :
                                                        ob.tipo === 'estadual' ? 'bg-green-500' :
                                                            ob.tipo === 'simples' ? 'bg-orange-500' :
                                                                'bg-purple-500'
                                                    }`} />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-foreground">{ob.nome}</div>
                                                    <div className="text-xs text-muted-foreground">{ob.descricao}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Nenhuma obrigação nesta data</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Upcoming */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Bell className="w-4 h-4" /> Próximas Obrigações
                            </h3>
                            <div className="space-y-2 max-h-[400px] overflow-auto">
                                {upcomingObligations.slice(0, 10).map((ob, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg border ${ob.daysUntil <= 3 ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                                            ob.daysUntil <= 7 ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800' :
                                                'border-border bg-muted/30'
                                        }`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-foreground">{ob.nome}</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${ob.daysUntil === 0 ? 'bg-red-600 text-white' :
                                                    ob.daysUntil <= 3 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                                                        'bg-muted text-muted-foreground'
                                                }`}>
                                                {ob.daysUntil === 0 ? 'Hoje' : ob.daysUntil === 1 ? 'Amanhã' : `${ob.daysUntil} dias`}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {ob.date.toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                ))}
                                {upcomingObligations.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Nenhuma obrigação próxima
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
                            <h4 className="font-semibold mb-2">📋 Legenda</h4>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Federal</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Estadual</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /> Simples Nacional</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> MEI</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
