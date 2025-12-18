export const dynamic = 'force-dynamic';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { usePlan } from '../../components/Permissions/PlanProvider';
import { BADGES, calculateUserStats, getUnlockedBadges, getLockedBadges, getBadgeProgress } from '../../lib/gamification';
import { Trophy, Star, Lock, TrendingUp, Award, Zap, Clock, Users } from 'lucide-react';

export default function BadgesPage() {
    const { data: session } = useSession();
    const { isPro, isAuditor } = usePlan();
    const [stats, setStats] = useState(null);
    const [unlockedBadges, setUnlockedBadges] = useState([]);
    const [lockedBadges, setLockedBadges] = useState([]);

    useEffect(() => {
        const userStats = calculateUserStats();
        // Add plan info to stats
        userStats.isPro = isPro;
        userStats.isAuditor = isAuditor;

        setStats(userStats);
        setUnlockedBadges(getUnlockedBadges(userStats));
        setLockedBadges(getLockedBadges(userStats));
    }, [isPro, isAuditor]);

    const categories = [
        { id: 'activity', name: 'Atividade', icon: TrendingUp },
        { id: 'variety', name: 'Variedade', icon: Zap },
        { id: 'time', name: 'Tempo', icon: Clock },
        { id: 'streak', name: 'Consecutivos', icon: Award },
        { id: 'special', name: 'Especiais', icon: Star },
        { id: 'community', name: 'Comunidade', icon: Users }
    ];

    const getBadgesByCategory = (category, badges) => {
        return badges.filter(b => b.category === category);
    };

    return (
        <DashboardLayout title="Conquistas" type="user">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-amber-500/10 rounded-2xl">
                        <Trophy className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Conquistas</h1>
                        <p className="text-muted-foreground">
                            {unlockedBadges.length} de {Object.keys(BADGES).length} conquistas desbloqueadas
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                {stats && (
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-card border border-border rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-foreground">{stats.totalCalculations}</div>
                            <div className="text-xs text-muted-foreground">Cálculos</div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-foreground">{stats.toolsUsed}</div>
                            <div className="text-xs text-muted-foreground">Ferramentas</div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-foreground">{stats.streak}</div>
                            <div className="text-xs text-muted-foreground">Dias seguidos</div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-amber-500">{unlockedBadges.length}</div>
                            <div className="text-xs text-muted-foreground">Conquistas</div>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="bg-card border border-border rounded-xl p-4 mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Progresso Geral</span>
                        <span className="text-sm text-muted-foreground">
                            {Math.round((unlockedBadges.length / Object.keys(BADGES).length) * 100)}%
                        </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                            style={{ width: `${(unlockedBadges.length / Object.keys(BADGES).length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Badges by Category */}
                <div className="space-y-8">
                    {categories.map(category => {
                        const unlocked = getBadgesByCategory(category.id, unlockedBadges);
                        const locked = getBadgesByCategory(category.id, lockedBadges);
                        const Icon = category.icon;

                        if (unlocked.length === 0 && locked.length === 0) return null;

                        return (
                            <div key={category.id}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-foreground">{category.name}</h2>
                                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                        {unlocked.length}/{unlocked.length + locked.length}
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    {/* Unlocked badges */}
                                    {unlocked.map(badge => (
                                        <div key={badge.id}
                                            className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
                                            <div className="text-4xl mb-2">{badge.icon}</div>
                                            <div className="font-medium text-foreground mb-1">{badge.name}</div>
                                            <div className="text-xs text-muted-foreground">{badge.description}</div>
                                            <div className="mt-2 text-xs text-green-600 font-medium">✓ Desbloqueado</div>
                                        </div>
                                    ))}

                                    {/* Locked badges */}
                                    {locked.map(badge => {
                                        const progress = getBadgeProgress(badge, stats || {});

                                        return (
                                            <div key={badge.id}
                                                className="bg-card border border-border rounded-xl p-4 text-center opacity-60 hover:opacity-80 transition-opacity">
                                                <div className="text-4xl mb-2 grayscale">
                                                    <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
                                                </div>
                                                <div className="font-medium text-foreground mb-1">{badge.name}</div>
                                                <div className="text-xs text-muted-foreground">{badge.description}</div>
                                                {progress && (
                                                    <div className="mt-2">
                                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary rounded-full"
                                                                style={{ width: `${Math.min((progress.current / progress.target) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {progress.current}/{progress.target}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
}
