import { Award } from 'lucide-react';

/**
 * UserBadge - Badge de usuário (conquista)
 * 
 * @param {Object} props
 * @param {Object} props.badge - { icon, name, color, description? }
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.showTooltip - Mostrar tooltip ao hover
 */
export default function UserBadge({ badge, size = 'sm', showTooltip = true }) {
    const { icon = '🏆', name, color = '#fbbf24', description } = badge;

    const sizeClasses = {
        sm: 'w-5 h-5 text-xs',
        md: 'w-7 h-7 text-sm',
        lg: 'w-10 h-10 text-base'
    };

    return (
        <div className="relative inline-block group">
            <div
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110`}
                style={{
                    backgroundColor: `${color}20`,
                    borderColor: color
                }}
                title={showTooltip ? name : undefined}
            >
                <span className="leading-none">{icon}</span>
            </div>

            {showTooltip && description && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    <div className="font-bold">{name}</div>
                    <div className="text-muted-foreground mt-0.5">{description}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                        <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45"></div>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * BadgeList - Lista de badges do usuário
 */
export function BadgeList({ badges, maxBadges = 3 }) {
    const displayBadges = badges.slice(0, maxBadges);
    const remaining = badges.length - maxBadges;

    return (
        <div className="flex items-center gap-1">
            {displayBadges.map((badge, index) => (
                <UserBadge key={index} badge={badge} size="sm" />
            ))}
            {remaining > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                    +{remaining}
                </span>
            )}
        </div>
    );
}
