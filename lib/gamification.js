/**
 * Gamification System - Badges and achievements for Portal Fiscal
 */

// Badge definitions
export const BADGES = {
    // Activity badges
    first_calculation: {
        id: 'first_calculation',
        name: 'Primeiro Cálculo',
        description: 'Realizou seu primeiro cálculo no Portal',
        icon: '🎯',
        category: 'activity',
        condition: (stats) => stats.totalCalculations >= 1
    },
    calculator_10: {
        id: 'calculator_10',
        name: 'Calculador',
        description: 'Realizou 10 cálculos',
        icon: '🧮',
        category: 'activity',
        condition: (stats) => stats.totalCalculations >= 10
    },
    calculator_50: {
        id: 'calculator_50',
        name: 'Especialista',
        description: 'Realizou 50 cálculos',
        icon: '📊',
        category: 'activity',
        condition: (stats) => stats.totalCalculations >= 50
    },
    calculator_100: {
        id: 'calculator_100',
        name: 'Mestre Fiscal',
        description: 'Realizou 100 cálculos',
        icon: '🏆',
        category: 'activity',
        condition: (stats) => stats.totalCalculations >= 100
    },

    // Tool variety badges
    explorer: {
        id: 'explorer',
        name: 'Explorador',
        description: 'Usou 5 ferramentas diferentes',
        icon: '🔍',
        category: 'variety',
        condition: (stats) => stats.toolsUsed >= 5
    },
    all_rounder: {
        id: 'all_rounder',
        name: 'Completo',
        description: 'Usou 10 ferramentas diferentes',
        icon: '💎',
        category: 'variety',
        condition: (stats) => stats.toolsUsed >= 10
    },

    // Time-based badges
    early_bird: {
        id: 'early_bird',
        name: 'Madrugador',
        description: 'Fez um cálculo antes das 7h',
        icon: '🌅',
        category: 'time',
        condition: (stats) => stats.earlyBirdCalculation
    },
    night_owl: {
        id: 'night_owl',
        name: 'Coruja',
        description: 'Fez um cálculo depois das 22h',
        icon: '🦉',
        category: 'time',
        condition: (stats) => stats.nightOwlCalculation
    },
    weekend_warrior: {
        id: 'weekend_warrior',
        name: 'Guerreiro de Fim de Semana',
        description: 'Trabalhou no sábado ou domingo',
        icon: '⚔️',
        category: 'time',
        condition: (stats) => stats.weekendCalculation
    },

    // Streak badges
    streak_7: {
        id: 'streak_7',
        name: 'Consistente',
        description: 'Usou o Portal 7 dias seguidos',
        icon: '🔥',
        category: 'streak',
        condition: (stats) => stats.streak >= 7
    },
    streak_30: {
        id: 'streak_30',
        name: 'Dedicado',
        description: 'Usou o Portal 30 dias seguidos',
        icon: '🌟',
        category: 'streak',
        condition: (stats) => stats.streak >= 30
    },

    // Special badges
    member_since: {
        id: 'member_since',
        name: 'Membro Fundador',
        description: 'Cadastrou-se no Portal Fiscal',
        icon: '📜',
        category: 'special',
        condition: () => true // Always unlocked
    },
    pro_member: {
        id: 'pro_member',
        name: 'Membro PRO',
        description: 'Assinou o plano PRO',
        icon: '⭐',
        category: 'special',
        condition: (stats) => stats.isPro
    },
    auditor_member: {
        id: 'auditor_member',
        name: 'Auditor Certificado',
        description: 'Assinou o plano AUDITOR',
        icon: '🛡️',
        category: 'special',
        condition: (stats) => stats.isAuditor
    },

    // Community badges
    first_post: {
        id: 'first_post',
        name: 'Participativo',
        description: 'Fez sua primeira publicação na comunidade',
        icon: '💬',
        category: 'community',
        condition: (stats) => stats.communityPosts >= 1
    },
    helpful: {
        id: 'helpful',
        name: 'Prestativo',
        description: 'Recebeu 10 curtidas em publicações',
        icon: '❤️',
        category: 'community',
        condition: (stats) => stats.likesReceived >= 10
    }
};

/**
 * Calculate user stats from localStorage
 */
export function calculateUserStats() {
    const tools = ['difal', 'icms-st', 'pis-cofins', 'simples', 'retencoes', 'ibs-cbs', 'mei-das', 'split-payment', 'transicao'];
    let totalCalculations = 0;
    let toolsUsed = 0;
    let earlyBirdCalculation = false;
    let nightOwlCalculation = false;
    let weekendCalculation = false;
    const usageDates = new Set();

    tools.forEach(tool => {
        const history = JSON.parse(localStorage.getItem(`${tool}_history`) || '[]');
        if (history.length > 0) {
            toolsUsed++;
            totalCalculations += history.length;

            history.forEach(item => {
                const date = new Date(item.timestamp);
                usageDates.add(date.toDateString());

                const hour = date.getHours();
                if (hour < 7) earlyBirdCalculation = true;
                if (hour >= 22) nightOwlCalculation = true;
                if (date.getDay() === 0 || date.getDay() === 6) weekendCalculation = true;
            });
        }
    });

    // Calculate streak
    const sortedDates = Array.from(usageDates).map(d => new Date(d)).sort((a, b) => b - a);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
        const checkDate = new Date(sortedDates[i]);
        checkDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((currentDate - checkDate) / (1000 * 60 * 60 * 24));

        if (diffDays === streak) {
            streak++;
        } else if (diffDays > streak) {
            break;
        }
    }

    return {
        totalCalculations,
        toolsUsed,
        earlyBirdCalculation,
        nightOwlCalculation,
        weekendCalculation,
        streak,
        isPro: false, // Set from plan context
        isAuditor: false,
        communityPosts: 0,
        likesReceived: 0
    };
}

/**
 * Get unlocked badges for user
 */
export function getUnlockedBadges(stats) {
    return Object.values(BADGES).filter(badge => badge.condition(stats));
}

/**
 * Get locked badges for user
 */
export function getLockedBadges(stats) {
    return Object.values(BADGES).filter(badge => !badge.condition(stats));
}

/**
 * Get badge progress
 */
export function getBadgeProgress(badge, stats) {
    switch (badge.id) {
        case 'calculator_10': return { current: stats.totalCalculations, target: 10 };
        case 'calculator_50': return { current: stats.totalCalculations, target: 50 };
        case 'calculator_100': return { current: stats.totalCalculations, target: 100 };
        case 'explorer': return { current: stats.toolsUsed, target: 5 };
        case 'all_rounder': return { current: stats.toolsUsed, target: 10 };
        case 'streak_7': return { current: stats.streak, target: 7 };
        case 'streak_30': return { current: stats.streak, target: 30 };
        default: return null;
    }
}

/**
 * Save unlocked badge notification
 */
export function notifyBadgeUnlocked(badge) {
    const notifications = JSON.parse(localStorage.getItem('badge_notifications') || '[]');
    if (!notifications.includes(badge.id)) {
        notifications.push(badge.id);
        localStorage.setItem('badge_notifications', JSON.stringify(notifications));
        return true; // New badge
    }
    return false; // Already notified
}
