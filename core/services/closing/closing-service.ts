// core/services/closing/closing.service.ts

import supabase from "@/core/lib/supabase";

import {
    AssignClosingCaseInput,
    ClosingCase,
    ClosingCaseDatabaseResult,
    ClosingStats,
    ClosingVisit,
    ClosingVisitDatabaseResult,
    CreateClosingCaseInput,
    SupabaseRelation,
    UpdateClosingCasePayload,
    UpdateClosingStageInput,
} from "@/core/types/closing";


// ============================================================
// REQUÊTE COMMUNE
// ============================================================

const CLOSING_CASE_SELECT = `
    id,
    prospect_id,
    visit_id,
    source_commercial_id,
    assigned_closer_id,
    stage,
    estimated_amount,
    objections,
    closing_notes,
    last_contact_at,
    next_follow_up_at,
    outcome,
    loss_reason,
    won_at,
    lost_at,
    created_by,
    created_at,
    updated_at,

    prospect:prospects!closing_cases_prospect_id_fkey (
        id,
        full_name,
        phone,
        
        status,
        created_at
    ),

    visit:visits!closing_cases_visit_id_fkey (
        *,
        site:sites!visits_site_id_fkey (
            id,
            nom_titre,
            ville,
            quartier
        )
    ),

    source_commercial:profiles!closing_cases_source_commercial_id_fkey (
        id,
        full_name,
        avatar_url,
        phone
    ),

    assigned_closer:profiles!closing_cases_assigned_closer_id_fkey (
        id,
        full_name,
        avatar_url,
        phone
    )
`;


// ============================================================
// NORMALISATION DES RELATIONS SUPABASE
// ============================================================

function normalizeRelation<T>(
    relation: SupabaseRelation<T>
): T | null {
    if (!relation) {
        return null;
    }

    if (Array.isArray(relation)) {
        return relation[0] ?? null;
    }

    return relation;
}

function normalizeVisit(
    visit: ClosingVisitDatabaseResult
): ClosingVisit {
    return {
        id: visit.id,

        prospect_id: visit.prospect_id,
        commercial_id: visit.commercial_id ?? null,
        site_id: visit.site_id ?? null,

        visit_date: visit.visit_date,
        status: visit.status,
        venue_rdv: visit.venue_rdv ?? false,

        interest_level: visit.interest_level ?? null,
        notes: visit.notes ?? null,
        report: visit.report ?? null,

        created_at: visit.created_at ?? null,

        site: normalizeRelation(visit.site),
    };
}

function normalizeClosingCase(
    row: ClosingCaseDatabaseResult
): ClosingCase {
    const prospect = normalizeRelation(row.prospect);
    const visit = normalizeRelation(row.visit);

    if (!prospect) {
        throw new Error(
            `Le prospect du dossier closing ${row.id} est introuvable.`
        );
    }

    if (!visit) {
        throw new Error(
            `La visite du dossier closing ${row.id} est introuvable.`
        );
    }

    return {
        id: row.id,

        prospect_id: row.prospect_id,
        visit_id: row.visit_id,

        source_commercial_id:
            row.source_commercial_id ?? null,

        assigned_closer_id:
            row.assigned_closer_id ?? null,

        stage: row.stage,
        priority: row.priority,

        estimated_amount:
            row.estimated_amount === null
                ? null
                : Number(row.estimated_amount),

        objections: row.objections ?? null,
        closing_notes: row.closing_notes ?? null,

        last_contact_at: row.last_contact_at ?? null,
        next_follow_up_at: row.next_follow_up_at ?? null,

        outcome: row.outcome ?? null,
        loss_reason: row.loss_reason ?? null,

        won_at: row.won_at ?? null,
        lost_at: row.lost_at ?? null,

        created_by: row.created_by ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at,

        prospect,

        visit: normalizeVisit(visit),

        source_commercial: normalizeRelation(
            row.source_commercial
        ),

        assigned_closer: normalizeRelation(
            row.assigned_closer
        ),
    };
}


// ============================================================
// RÉCUPÉRER TOUS LES DOSSIERS
// ============================================================

export async function fetchClosingCases(): Promise<
    ClosingCase[]
> {
    const { data, error } = await supabase
        .from("closing_cases")
        .select(CLOSING_CASE_SELECT)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw new Error(
            `Erreur lors de la récupération des dossiers closing : ${error.message}`
        );
    }

    const rows =
        (data ?? []) as unknown as ClosingCaseDatabaseResult[];

    return rows.map(normalizeClosingCase);
}


// ============================================================
// RÉCUPÉRER UN DOSSIER
// ============================================================

export async function fetchClosingCaseById(
    closingCaseId: string
): Promise<ClosingCase> {
    const { data, error } = await supabase
        .from("closing_cases")
        .select(CLOSING_CASE_SELECT)
        .eq("id", closingCaseId)
        .maybeSingle();

    if (error) {
        throw new Error(
            `Erreur lors de la récupération du dossier closing : ${error.message}`
        );
    }

    if (!data) {
        throw new Error(
            "Le dossier closing demandé est introuvable."
        );
    }

    return normalizeClosingCase(
        data as unknown as ClosingCaseDatabaseResult
    );
}


// ============================================================
// CRÉER MANUELLEMENT UN DOSSIER
// ============================================================

export async function createClosingCase(
    input: CreateClosingCaseInput
): Promise<ClosingCase> {
    const payload = {
        prospect_id: input.prospect_id,
        visit_id: input.visit_id,

        source_commercial_id:
            input.source_commercial_id ?? null,

        assigned_closer_id:
            input.assigned_closer_id ?? null,

        stage: input.stage ?? "nouveau",
        priority: input.priority ?? "normale",

        estimated_amount:
            input.estimated_amount ?? null,

        objections: input.objections ?? null,
        closing_notes: input.closing_notes ?? null,

        next_follow_up_at:
            input.next_follow_up_at ?? null,
    };

    const { data, error } = await supabase
        .from("closing_cases")
        .insert(payload)
        .select(CLOSING_CASE_SELECT)
        .single();

    if (error) {
        if (error.code === "23505") {
            throw new Error(
                "Un dossier closing existe déjà pour cette visite."
            );
        }

        throw new Error(
            `Erreur lors de la création du dossier closing : ${error.message}`
        );
    }

    return normalizeClosingCase(
        data as unknown as ClosingCaseDatabaseResult
    );
}


// ============================================================
// MODIFIER UN DOSSIER
// ============================================================

export async function updateClosingCase({
    id,
    values,
}: UpdateClosingCasePayload): Promise<ClosingCase> {
    const { data, error } = await supabase
        .from("closing_cases")
        .update(values)
        .eq("id", id)
        .select(CLOSING_CASE_SELECT)
        .single();

    if (error) {
        throw new Error(
            `Erreur lors de la modification du dossier closing : ${error.message}`
        );
    }

    return normalizeClosingCase(
        data as unknown as ClosingCaseDatabaseResult
    );
}


// ============================================================
// AFFECTER UN RESPONSABLE CLOSING
// ============================================================

export async function assignClosingCase({
    closingCaseId,
    closerId,
}: AssignClosingCaseInput): Promise<ClosingCase> {
    const { data, error } = await supabase
        .from("closing_cases")
        .update({
            assigned_closer_id: closerId,
        })
        .eq("id", closingCaseId)
        .select(CLOSING_CASE_SELECT)
        .single();

    if (error) {
        throw new Error(
            `Erreur lors de l’affectation du dossier : ${error.message}`
        );
    }

    return normalizeClosingCase(
        data as unknown as ClosingCaseDatabaseResult
    );
}


// ============================================================
// MODIFIER L’ÉTAPE DU CLOSING
// ============================================================

export async function updateClosingStage({
    closingCaseId,
    stage,
    outcome,
    lossReason,
    nextFollowUpAt,
}: UpdateClosingStageInput): Promise<ClosingCase> {
    if (stage === "perdu" && !lossReason?.trim()) {
        throw new Error(
            "La raison de la perte est obligatoire."
        );
    }

    if (
        stage === "a_relancer" &&
        !nextFollowUpAt
    ) {
        throw new Error(
            "La date de la prochaine relance est obligatoire."
        );
    }

    const payload = {
        stage,
        outcome: outcome?.trim() || null,

        loss_reason:
            stage === "perdu"
                ? lossReason?.trim() || null
                : null,

        next_follow_up_at:
            stage === "a_relancer"
                ? nextFollowUpAt ?? null
                : nextFollowUpAt,
    };

    const { data, error } = await supabase
        .from("closing_cases")
        .update(payload)
        .eq("id", closingCaseId)
        .select(CLOSING_CASE_SELECT)
        .single();

    if (error) {
        throw new Error(
            `Erreur lors du changement d’étape : ${error.message}`
        );
    }

    return normalizeClosingCase(
        data as unknown as ClosingCaseDatabaseResult
    );
}


// ============================================================
// ENREGISTRER UN CONTACT AVEC LE PROSPECT
// ============================================================

export async function registerClosingContact(
    closingCaseId: string,
    nextFollowUpAt?: string | null
): Promise<ClosingCase> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("closing_cases")
        .update({
            stage: "contacte",
            last_contact_at: now,
            next_follow_up_at: nextFollowUpAt ?? null,
        })
        .eq("id", closingCaseId)
        .select(CLOSING_CASE_SELECT)
        .single();

    if (error) {
        throw new Error(
            `Erreur lors de l’enregistrement du contact : ${error.message}`
        );
    }

    return normalizeClosingCase(
        data as unknown as ClosingCaseDatabaseResult
    );
}


// ============================================================
// PRENDRE EN CHARGE UN DOSSIER
// ============================================================

export async function takeClosingCase(
    closingCaseId: string,
    closerId: string
): Promise<ClosingCase> {
    const { data, error } = await supabase
        .from("closing_cases")
        .update({
            assigned_closer_id: closerId,
            stage: "a_contacter",
        })
        .eq("id", closingCaseId)
        .is("assigned_closer_id", null)
        .select(CLOSING_CASE_SELECT)
        .maybeSingle();

    if (error) {
        throw new Error(
            `Erreur lors de la prise en charge du dossier : ${error.message}`
        );
    }

    if (!data) {
        throw new Error(
            "Ce dossier a déjà été pris en charge par un autre responsable."
        );
    }

    return normalizeClosingCase(
        data as unknown as ClosingCaseDatabaseResult
    );
}


// ============================================================
// SUPPRIMER UN DOSSIER
// ============================================================

export async function deleteClosingCase(
    closingCaseId: string
): Promise<void> {
    const { error } = await supabase
        .from("closing_cases")
        .delete()
        .eq("id", closingCaseId);

    if (error) {
        throw new Error(
            `Erreur lors de la suppression du dossier closing : ${error.message}`
        );
    }
}


// ============================================================
// CALCUL DES STATISTIQUES
// ============================================================

function getStartOfToday(): Date {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
}

function getEndOfToday(): Date {
    const date = new Date();

    date.setHours(23, 59, 59, 999);

    return date;
}

export function calculateClosingStats(
    closingCases: ClosingCase[]
): ClosingStats {
    const startOfToday = getStartOfToday();
    const endOfToday = getEndOfToday();

    const activeCases = closingCases.filter(
        (closingCase) =>
            !["gagne", "perdu"].includes(
                closingCase.stage
            )
    );

    const wonCases = closingCases.filter(
        (closingCase) =>
            closingCase.stage === "gagne"
    );

    const lostCases = closingCases.filter(
        (closingCase) =>
            closingCase.stage === "perdu"
    );

    const completedCases =
        wonCases.length + lostCases.length;

    const conversionRate =
        completedCases > 0
            ? (wonCases.length / completedCases) * 100
            : 0;

    const followUpsToday = activeCases.filter(
        (closingCase) => {
            if (!closingCase.next_follow_up_at) {
                return false;
            }

            const followUpDate = new Date(
                closingCase.next_follow_up_at
            );

            return (
                followUpDate >= startOfToday &&
                followUpDate <= endOfToday
            );
        }
    ).length;

    const overdueFollowUps = activeCases.filter(
        (closingCase) => {
            if (!closingCase.next_follow_up_at) {
                return false;
            }

            return (
                new Date(closingCase.next_follow_up_at) <
                startOfToday
            );
        }
    ).length;

    const estimatedPipelineAmount = activeCases.reduce(
        (total, closingCase) =>
            total +
            (closingCase.estimated_amount ?? 0),
        0
    );

    const convertedAmount = wonCases.reduce(
        (total, closingCase) =>
            total +
            (closingCase.estimated_amount ?? 0),
        0
    );

    return {
        totalCases: closingCases.length,

        newCases: closingCases.filter(
            (closingCase) =>
                closingCase.stage === "nouveau"
        ).length,

        toContact: closingCases.filter(
            (closingCase) =>
                closingCase.stage === "a_contacter"
        ).length,

        contacted: closingCases.filter(
            (closingCase) =>
                closingCase.stage === "contacte"
        ).length,

        interested: closingCases.filter(
            (closingCase) =>
                closingCase.stage === "interesse"
        ).length,

        negotiating: closingCases.filter(
            (closingCase) =>
                closingCase.stage === "negociation"
        ).length,

        followUpsToday,
        overdueFollowUps,

        wonCases: wonCases.length,
        lostCases: lostCases.length,

        conversionRate:
            Math.round(conversionRate * 10) / 10,

        estimatedPipelineAmount,
        convertedAmount,
    };
}