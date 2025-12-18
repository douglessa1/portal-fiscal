/**
 * Feature Flags & Permissions Engine
 * Controls access to features based on user plan
 */

// Plan Tiers
export const PLANS = {
    FREE: 'free',
    PRO: 'pro',
    AUDITOR: 'auditor'
};

// Feature definitions with required plan
export const FEATURES = {
    // DIFAL
    difal_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    difal_compare: [PLANS.PRO, PLANS.AUDITOR],
    difal_memory: [PLANS.PRO, PLANS.AUDITOR],
    difal_history: [PLANS.PRO, PLANS.AUDITOR],
    difal_pdf: [PLANS.PRO, PLANS.AUDITOR],
    difal_signature: [PLANS.AUDITOR],
    difal_share: [PLANS.AUDITOR],

    // ICMS-ST
    icms_st_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    icms_st_memory: [PLANS.PRO, PLANS.AUDITOR],
    icms_st_history: [PLANS.PRO, PLANS.AUDITOR],
    icms_st_pdf: [PLANS.PRO, PLANS.AUDITOR],
    icms_st_signature: [PLANS.AUDITOR],

    // Simples Nacional
    simples_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    simples_memory: [PLANS.PRO, PLANS.AUDITOR],
    simples_history: [PLANS.PRO, PLANS.AUDITOR],

    // Retenções
    retencoes_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    retencoes_memory: [PLANS.PRO, PLANS.AUDITOR],
    retencoes_pdf: [PLANS.PRO, PLANS.AUDITOR],

    // Auditoria
    auditor_sped_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    auditor_sped_detailed: [PLANS.PRO, PLANS.AUDITOR],
    auditor_sped_signed: [PLANS.AUDITOR],

    validador_sped_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    validador_sped_detailed: [PLANS.PRO, PLANS.AUDITOR],

    monitor_nfe_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    monitor_nfe_alerts: [PLANS.PRO, PLANS.AUDITOR],
    monitor_nfe_reports: [PLANS.AUDITOR],

    // BI Fiscal
    bi_fiscal: [PLANS.PRO, PLANS.AUDITOR],
    bi_fiscal_export: [PLANS.AUDITOR],

    // NCM Finder
    ncm_finder_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    ncm_finder_unlimited: [PLANS.PRO, PLANS.AUDITOR],
    ncm_finder_report: [PLANS.AUDITOR],

    // Reforma Tributária
    reforma_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    reforma_scenarios: [PLANS.PRO, PLANS.AUDITOR],
    reforma_reports: [PLANS.AUDITOR],

    // MEI
    mei_basic: [PLANS.FREE, PLANS.PRO, PLANS.AUDITOR],
    mei_reports: [PLANS.PRO, PLANS.AUDITOR],
    mei_signed: [PLANS.AUDITOR],

    // General
    pdf_export: [PLANS.PRO, PLANS.AUDITOR],
    csv_export: [PLANS.PRO, PLANS.AUDITOR],
    digital_signature: [PLANS.AUDITOR],
    share_link: [PLANS.AUDITOR],
    audit_logs: [PLANS.AUDITOR]
};

/**
 * Check if user has access to a feature
 */
export function hasFeatureAccess(userPlan, featureId) {
    const allowedPlans = FEATURES[featureId];
    if (!allowedPlans) return false;
    return allowedPlans.includes(userPlan || PLANS.FREE);
}

/**
 * Get minimum required plan for a feature
 */
export function getRequiredPlan(featureId) {
    const plans = FEATURES[featureId];
    if (!plans) return null;
    if (plans.includes(PLANS.FREE)) return PLANS.FREE;
    if (plans.includes(PLANS.PRO)) return PLANS.PRO;
    return PLANS.AUDITOR;
}

/**
 * Get plan display info
 */
export function getPlanInfo(plan) {
    const info = {
        [PLANS.FREE]: {
            name: 'Gratuito',
            badge: null,
            color: 'gray'
        },
        [PLANS.PRO]: {
            name: 'PRO',
            badge: 'PRO',
            color: 'purple'
        },
        [PLANS.AUDITOR]: {
            name: 'Auditor',
            badge: 'AUDITOR',
            color: 'amber'
        }
    };
    return info[plan] || info[PLANS.FREE];
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(featureId) {
    const required = getRequiredPlan(featureId);
    if (required === PLANS.PRO) {
        return 'Disponível no Plano PRO';
    }
    if (required === PLANS.AUDITOR) {
        return 'Disponível no Plano Auditor';
    }
    return null;
}

/**
 * Feature categories for menu organization
 */
export const FEATURE_CATEGORIES = {
    basic: {
        label: 'Cálculos',
        features: ['difal_basic', 'icms_st_basic', 'simples_basic', 'retencoes_basic']
    },
    memory: {
        label: 'Memória Técnica',
        requiredPlan: PLANS.PRO,
        features: ['difal_memory', 'icms_st_memory', 'simples_memory']
    },
    export: {
        label: 'Exportações',
        requiredPlan: PLANS.PRO,
        features: ['pdf_export', 'csv_export']
    },
    audit: {
        label: 'Auditoria',
        requiredPlan: PLANS.AUDITOR,
        features: ['digital_signature', 'share_link', 'audit_logs']
    }
};
