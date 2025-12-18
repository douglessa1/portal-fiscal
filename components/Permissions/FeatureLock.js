import { Lock, Crown, Shield } from 'lucide-react';
import { useFeature, usePlan, PLANS } from './PlanProvider';
import { getRequiredPlan, getPlanInfo } from '../../lib/permissions/featureFlags';

/**
 * FeatureLock - Wraps content and shows lock if user doesn't have access
 */
export function FeatureLock({ featureId, children, fallback = null, showUpgrade = true }) {
    const { hasAccess, requiredPlan, isLocked } = useFeature(featureId);

    if (!isLocked) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    if (!showUpgrade) {
        return null;
    }

    return <UpgradePrompt requiredPlan={requiredPlan} featureId={featureId} />;
}

/**
 * UpgradePrompt - Shows upgrade message for locked features
 */
export function UpgradePrompt({ requiredPlan, featureId, compact = false }) {
    const planInfo = getPlanInfo(requiredPlan);

    const icons = {
        [PLANS.PRO]: <Crown className="w-4 h-4 text-purple-500" />,
        [PLANS.AUDITOR]: <Shield className="w-4 h-4 text-amber-500" />
    };

    const colors = {
        [PLANS.PRO]: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
        [PLANS.AUDITOR]: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
    };

    const textColors = {
        [PLANS.PRO]: 'text-purple-700 dark:text-purple-300',
        [PLANS.AUDITOR]: 'text-amber-700 dark:text-amber-300'
    };

    if (compact) {
        return (
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border ${colors[requiredPlan]} ${textColors[requiredPlan]}`}>
                <Lock className="w-3 h-3" />
                <span className="text-xs font-medium">{planInfo.badge}</span>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-xl border ${colors[requiredPlan]}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${requiredPlan === PLANS.PRO ? 'bg-purple-100 dark:bg-purple-800/30' : 'bg-amber-100 dark:bg-amber-800/30'}`}>
                    {icons[requiredPlan]}
                </div>
                <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${textColors[requiredPlan]}`}>
                        Recurso {planInfo.badge}
                    </h4>
                    <p className={`text-xs ${textColors[requiredPlan]} opacity-80`}>
                        Disponível no plano {planInfo.name}
                    </p>
                </div>
                <button className={`h-8 px-3 text-xs font-semibold rounded-lg ${requiredPlan === PLANS.PRO
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}>
                    Upgrade
                </button>
            </div>
        </div>
    );
}

/**
 * PlanBadge - Shows badge for PRO/AUDITOR features in menus
 */
export function PlanBadge({ plan, size = 'sm' }) {
    if (plan === PLANS.FREE) return null;

    const sizes = {
        xs: 'text-[9px] px-1 py-0.5',
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-1'
    };

    const styles = {
        [PLANS.PRO]: 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border border-purple-300/50',
        [PLANS.AUDITOR]: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white border border-amber-300/50'
    };

    return (
        <span className={`${sizes[size]} ${styles[plan]} rounded font-bold uppercase tracking-wide shadow-sm`}>
            {plan === PLANS.PRO ? 'PRO' : 'AUDITOR'}
        </span>
    );
}

/**
 * LockIcon - Shows lock status for features
 */
export function LockIcon({ featureId, size = 'sm' }) {
    const { isLocked, requiredPlan } = useFeature(featureId);

    if (!isLocked) {
        return null;
    }

    const sizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const colors = {
        [PLANS.PRO]: 'text-purple-500',
        [PLANS.AUDITOR]: 'text-amber-500'
    };

    return (
        <Lock className={`${sizes[size]} ${colors[requiredPlan]}`} />
    );
}

/**
 * FeatureButton - Button that shows lock state
 */
export function FeatureButton({ featureId, children, onClick, className = '', ...props }) {
    const { hasAccess, requiredPlan, isLocked } = useFeature(featureId);

    if (isLocked) {
        return (
            <button
                className={`${className} opacity-60 cursor-not-allowed flex items-center gap-2`}
                title={`Disponível no plano ${getPlanInfo(requiredPlan).name}`}
                {...props}
            >
                {children}
                <LockIcon featureId={featureId} />
            </button>
        );
    }

    return (
        <button onClick={onClick} className={className} {...props}>
            {children}
        </button>
    );
}
