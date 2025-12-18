import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PLANS, hasFeatureAccess, getRequiredPlan, getPlanInfo } from '../../lib/permissions/featureFlags';

const PlanContext = createContext({
    plan: PLANS.FREE,
    isPro: false,
    isAuditor: false,
    hasAccess: () => false,
    planInfo: null
});

/**
 * Plan Provider - Wraps app to provide plan context
 */
export function PlanProvider({ children }) {
    const { data: session } = useSession();
    const [plan, setPlan] = useState(PLANS.FREE);

    useEffect(() => {
        // Admins get full access (AUDITOR plan)
        if (session?.user?.role === 'admin') {
            setPlan(PLANS.AUDITOR);
            return;
        }
        // Get plan from session or default to FREE
        const userPlan = session?.user?.plan || PLANS.FREE;
        setPlan(userPlan);
    }, [session]);

    const value = {
        plan,
        isPro: plan === PLANS.PRO || plan === PLANS.AUDITOR,
        isAuditor: plan === PLANS.AUDITOR,
        hasAccess: (featureId) => hasFeatureAccess(plan, featureId),
        planInfo: getPlanInfo(plan)
    };

    return (
        <PlanContext.Provider value={value}>
            {children}
        </PlanContext.Provider>
    );
}

/**
 * Hook to use plan context
 */
export function usePlan() {
    const context = useContext(PlanContext);
    if (!context) {
        throw new Error('usePlan must be used within a PlanProvider');
    }
    return context;
}

/**
 * Hook to check feature access
 */
export function useFeature(featureId) {
    const { plan, hasAccess } = usePlan();
    const hasFeature = hasAccess(featureId);
    const requiredPlan = getRequiredPlan(featureId);

    return {
        hasAccess: hasFeature,
        requiredPlan,
        isLocked: !hasFeature
    };
}

export { PLANS };
