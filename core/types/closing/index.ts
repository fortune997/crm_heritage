// core/types/closing/type.ts

// ============================================================
// VALEURS AUTORISÉES
// ============================================================

export const CLOSING_STAGES = [
    "nouveau",
    "a_contacter",
    "contacte",
    "interesse",
    "negociation",
    "documents_attendus",
    "reservation_attendue",
    "paiement_initial",
    "a_relancer",
    "gagne",
    "perdu",
] as const;

export type ClosingStage = (typeof CLOSING_STAGES)[number];

export const CLOSING_PRIORITIES = [
    "basse",
    "normale",
    "haute",
    "urgente",
] as const;

export type ClosingPriority =
    (typeof CLOSING_PRIORITIES)[number];

export const CLOSING_ACTIVITY_TYPES = [
    "appel",
    "whatsapp",
    "email",
    "rendez_vous",
    "note",
    "document",
    "proposition",
    "relance",
] as const;

export type ClosingActivityType =
    (typeof CLOSING_ACTIVITY_TYPES)[number];

export const CLOSING_ACTIVITY_STATUSES = [
    "planifiee",
    "terminee",
    "annulee",
] as const;

export type ClosingActivityStatus =
    (typeof CLOSING_ACTIVITY_STATUSES)[number];

export type ClosingPeriod =
    | "today"
    | "yesterday"
    | "week"
    | "month"
    | "custom";


// ============================================================
// RELATIONS SIMPLIFIÉES
// ============================================================

export interface ClosingProspect {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    status: string | null;
    created_at: string | null;
}

export interface ClosingProfile {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
    email: string | null;
}

export interface ClosingSite {
    id: string;
    nom_titre: string;
    ville: string | null;
    quartier: string | null;
}

export interface ClosingVisit {
    id: string;

    prospect_id: string;
    commercial_id: string | null;
    site_id: string | null;

    visit_date: string;
    status: string;
    venue_rdv: boolean;

    interest_level: string | null;
    notes: string | null;
    report: string | null;

    created_at: string | null;

    site: ClosingSite | null;
}


// ============================================================
// DOSSIER CLOSING
// ============================================================

export interface ClosingCase {
    id: string;

    prospect_id: string;
    visit_id: string;

    source_commercial_id: string | null;
    assigned_closer_id: string | null;

    stage: ClosingStage;
    priority: ClosingPriority;

    estimated_amount: number | null;

    objections: string | null;
    closing_notes: string | null;

    last_contact_at: string | null;
    next_follow_up_at: string | null;

    outcome: string | null;
    loss_reason: string | null;

    won_at: string | null;
    lost_at: string | null;

    created_by: string | null;
    created_at: string;
    updated_at: string;

    prospect: ClosingProspect;
    visit: ClosingVisit;

    source_commercial: ClosingProfile | null;
    assigned_closer: ClosingProfile | null;
}


// ============================================================
// RÉSULTAT BRUT RETOURNÉ PAR SUPABASE
// ============================================================

/*
 * Selon les relations détectées par Supabase,
 * une relation peut parfois être retournée sous forme
 * d’objet ou de tableau.
 *
 * Le service Closing normalisera ensuite ces relations.
 */

export type SupabaseRelation<T> =
    | T
    | T[]
    | null;

export interface ClosingVisitDatabaseResult
    extends Omit<ClosingVisit, "site"> {
    site: SupabaseRelation<ClosingSite>;
}

export interface ClosingCaseDatabaseResult
    extends Omit<
        ClosingCase,
        | "prospect"
        | "visit"
        | "source_commercial"
        | "assigned_closer"
    > {
    prospect: SupabaseRelation<ClosingProspect>;

    visit: SupabaseRelation<ClosingVisitDatabaseResult>;

    source_commercial: SupabaseRelation<ClosingProfile>;

    assigned_closer: SupabaseRelation<ClosingProfile>;
}


// ============================================================
// DONNÉES POUR LA CRÉATION
// ============================================================

export interface CreateClosingCaseInput {
    prospect_id: string;
    visit_id: string;

    source_commercial_id?: string | null;
    assigned_closer_id?: string | null;

    stage?: ClosingStage;
    priority?: ClosingPriority;

    estimated_amount?: number | null;

    objections?: string | null;
    closing_notes?: string | null;

    next_follow_up_at?: string | null;
}


// ============================================================
// DONNÉES POUR LA MODIFICATION
// ============================================================

export interface UpdateClosingCaseInput {
    stage?: ClosingStage;
    priority?: ClosingPriority;

    assigned_closer_id?: string | null;

    estimated_amount?: number | null;

    objections?: string | null;
    closing_notes?: string | null;

    last_contact_at?: string | null;
    next_follow_up_at?: string | null;

    outcome?: string | null;
    loss_reason?: string | null;
}

export interface UpdateClosingCasePayload {
    id: string;
    values: UpdateClosingCaseInput;
}


// ============================================================
// AFFECTATION D’UN CLOSER
// ============================================================

export interface AssignClosingCaseInput {
    closingCaseId: string;
    closerId: string | null;
}


// ============================================================
// CHANGEMENT D’ÉTAPE
// ============================================================

export interface UpdateClosingStageInput {
    closingCaseId: string;
    stage: ClosingStage;

    outcome?: string | null;
    lossReason?: string | null;

    nextFollowUpAt?: string | null;
}


// ============================================================
// RELANCES ET ACTIVITÉS
// ============================================================

export interface ClosingActivity {
    id: string;

    prospect_id: string;
    closing_case_id: string | null;

    type: ClosingActivityType;
    status: ClosingActivityStatus;

    title: string;
    description: string | null;
    result: string | null;

    scheduled_at: string | null;
    completed_at: string | null;

    created_by: string;
    created_at: string;
    updated_at: string | null;

    creator: ClosingProfile | null;
}

export interface CreateClosingActivityInput {
    prospect_id: string;
    closing_case_id: string;

    type: ClosingActivityType;
    status?: ClosingActivityStatus;

    title: string;
    description?: string | null;
    result?: string | null;

    scheduled_at?: string | null;
}


// ============================================================
// FILTRES DE LA PAGE
// ============================================================

export interface ClosingFilters {
    search: string;

    stage: ClosingStage | "all";
    priority: ClosingPriority | "all";

    commercialId: string | "all";
    closerId: string | "all";
    siteId: string | "all";

    period: ClosingPeriod;

    startDate: string | null;
    endDate: string | null;

    followUpStatus:
        | "all"
        | "today"
        | "upcoming"
        | "overdue"
        | "without_follow_up";
}

export const DEFAULT_CLOSING_FILTERS: ClosingFilters = {
    search: "",

    stage: "all",
    priority: "all",

    commercialId: "all",
    closerId: "all",
    siteId: "all",

    period: "month",

    startDate: null,
    endDate: null,

    followUpStatus: "all",
};


// ============================================================
// STATISTIQUES
// ============================================================

export interface ClosingStats {
    totalCases: number;
    newCases: number;

    toContact: number;
    contacted: number;
    interested: number;
    negotiating: number;

    followUpsToday: number;
    overdueFollowUps: number;

    wonCases: number;
    lostCases: number;

    conversionRate: number;

    estimatedPipelineAmount: number;
    convertedAmount: number;
}

export interface ClosingStageStats {
    stage: ClosingStage;
    total: number;
    estimatedAmount: number;
}

export interface CommercialClosingStats {
    commercialId: string;
    commercialName: string;

    totalVisits: number;
    totalClosingCases: number;

    wonCases: number;
    lostCases: number;
    pendingCases: number;

    conversionRate: number;
    convertedAmount: number;
}


// ============================================================
// OPTIONS POUR LES SELECT ET BADGES
// ============================================================

export interface ClosingStageOption {
    value: ClosingStage;
    label: string;
    description: string;
}

export interface ClosingPriorityOption {
    value: ClosingPriority;
    label: string;
}

export const CLOSING_STAGE_OPTIONS: ClosingStageOption[] = [
    {
        value: "nouveau",
        label: "Nouveau dossier",
        description: "Visite effectuée, dossier non traité",
    },
    {
        value: "a_contacter",
        label: "À contacter",
        description: "Le premier contact doit être réalisé",
    },
    {
        value: "contacte",
        label: "Contacté",
        description: "Le prospect a déjà été contacté",
    },
    {
        value: "interesse",
        label: "Intéressé",
        description: "Le prospect confirme son intérêt",
    },
    {
        value: "negociation",
        label: "En négociation",
        description: "Discussion sur l’offre ou le paiement",
    },
    {
        value: "documents_attendus",
        label: "Documents attendus",
        description: "Le prospect doit fournir des documents",
    },
    {
        value: "reservation_attendue",
        label: "Réservation attendue",
        description: "Le prospect doit effectuer sa réservation",
    },
    {
        value: "paiement_initial",
        label: "Paiement initial",
        description: "Un premier paiement a été reçu",
    },
    {
        value: "a_relancer",
        label: "À relancer",
        description: "Une nouvelle relance est nécessaire",
    },
    {
        value: "gagne",
        label: "Gagné",
        description: "Le prospect a été converti",
    },
    {
        value: "perdu",
        label: "Perdu",
        description: "Le prospect n’a pas été converti",
    },
];

export const CLOSING_PRIORITY_OPTIONS: ClosingPriorityOption[] = [
    {
        value: "basse",
        label: "Basse",
    },
    {
        value: "normale",
        label: "Normale",
    },
    {
        value: "haute",
        label: "Haute",
    },
    {
        value: "urgente",
        label: "Urgente",
    },
];