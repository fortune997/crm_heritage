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

const CLOSING_CASE_SELECT = `
    id, prospect_id, visit_id, source_commercial_id, assigned_closer_id, stage, priority,
    estimated_amount, objections, closing_notes, last_contact_at, next_follow_up_at,
    outcome, loss_reason, won_at, lost_at, created_by, created_at, updated_at,
    prospect:prospects!closing_cases_prospect_id_fkey (id, full_name, phone, status, created_at),
    visit:visits!closing_cases_visit_id_fkey (*, site:sites!visits_site_id_fkey (id, nom_titre, ville, quartier)),
    source_commercial:profiles!closing_cases_source_commercial_id_fkey (id, full_name, avatar_url, phone),
    assigned_closer:profiles!closing_cases_assigned_closer_id_fkey (id, full_name, avatar_url, phone)
`;

function normalizeRelation<T>(relation: SupabaseRelation<T>): T | null {
    if (!relation) return null;
    if (Array.isArray(relation)) return relation[0]?? null;
    return relation;
}
function normalizeVisit(visit: ClosingVisitDatabaseResult): ClosingVisit {
    return {
        id: visit.id, prospect_id: visit.prospect_id, commercial_id: visit.commercial_id?? null,
        site_id: visit.site_id?? null, visit_date: visit.visit_date, status: visit.status,
        venue_rdv: visit.venue_rdv?? false, interest_level: visit.interest_level?? null,
        notes: visit.notes?? null, report: visit.report?? null, created_at: visit.created_at?? null,
        site: normalizeRelation(visit.site),
    };
}
function normalizeClosingCase(row: ClosingCaseDatabaseResult): ClosingCase {
    const prospect = normalizeRelation(row.prospect);
    const visit = normalizeRelation(row.visit);
    if (!prospect) throw new Error(`Le prospect du dossier closing ${row.id} est introuvable.`);
    if (!visit) throw new Error(`La visite du dossier closing ${row.id} est introuvable.`);
    return {
        id: row.id, prospect_id: row.prospect_id, visit_id: row.visit_id,
        source_commercial_id: row.source_commercial_id?? null, assigned_closer_id: row.assigned_closer_id?? null,
        stage: row.stage, priority: row.priority,
        estimated_amount: row.estimated_amount === null? null : Number(row.estimated_amount),
        objections: row.objections?? null, closing_notes: row.closing_notes?? null,
        last_contact_at: row.last_contact_at?? null, next_follow_up_at: row.next_follow_up_at?? null,
        outcome: row.outcome?? null, loss_reason: row.loss_reason?? null,
        won_at: row.won_at?? null, lost_at: row.lost_at?? null,
        created_by: row.created_by?? null, created_at: row.created_at, updated_at: row.updated_at,
        prospect, visit: normalizeVisit(visit),
        source_commercial: normalizeRelation(row.source_commercial),
        assigned_closer: normalizeRelation(row.assigned_closer),
    };
}
export async function fetchClosingCases(): Promise<ClosingCase[]> {
    const { data, error } = await supabase.from("closing_cases").select(CLOSING_CASE_SELECT).order("created_at", { ascending: false });
    if (error) throw new Error(`Erreur: ${error.message}`);
    return (data as any as ClosingCaseDatabaseResult[]).map(normalizeClosingCase);
}
export async function fetchClosingCaseById(id: string): Promise<ClosingCase> {
    const { data, error } = await supabase.from("closing_cases").select(CLOSING_CASE_SELECT).eq("id", id).maybeSingle();
    if (error ||!data) throw new Error("Dossier introuvable");
    return normalizeClosingCase(data as any);
}
export async function createClosingCase(input: CreateClosingCaseInput): Promise<ClosingCase> {
    const { data, error } = await supabase.from("closing_cases").insert(input as any).select(CLOSING_CASE_SELECT).single();
    if (error) throw new Error(error.message);
    return normalizeClosingCase(data as any);
}
export async function updateClosingCase({ id, values }: UpdateClosingCasePayload): Promise<ClosingCase> {
    const { data, error } = await supabase.from("closing_cases").update(values).eq("id", id).select(CLOSING_CASE_SELECT).single();
    if (error) throw new Error(error.message);
    return normalizeClosingCase(data as any);
}
export async function deleteClosingCase(id: string): Promise<void> {
    const { error } = await supabase.from("closing_cases").delete().eq("id", id);
    if (error) throw new Error(error.message);
}
export function calculateClosingStats(closingCases: ClosingCase[]): ClosingStats {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const active = closingCases.filter(c =>!["gagne","perdu"].includes(c.stage));
    const won = closingCases.filter(c => c.stage === "gagne");
    const lost = closingCases.filter(c => c.stage === "perdu");
    return {
        totalCases: closingCases.length,
        newCases: closingCases.filter(c => c.stage === "nouveau").length,
        toContact: closingCases.filter(c => c.stage === "a_contacter").length,
        contacted: closingCases.filter(c => c.stage === "contacte").length,
        interested: closingCases.filter(c => c.stage === "interesse").length,
        negotiating: closingCases.filter(c => c.stage === "negociation").length,
        followUpsToday: active.filter(c => c.next_follow_up_at && new Date(c.next_follow_up_at) >= start && new Date(c.next_follow_up_at) <= end).length,
        overdueFollowUps: active.filter(c => c.next_follow_up_at && new Date(c.next_follow_up_at) < start).length,
        wonCases: won.length, lostCases: lost.length,
        conversionRate: won.length+lost.length>0? Math.round((won.length/(won.length+lost.length))*1000)/10 : 0,
        estimatedPipelineAmount: active.reduce((s,c)=>s+(c.estimated_amount??0),0),
        convertedAmount: won.reduce((s,c)=>s+(c.estimated_amount??0),0),
    };
}
// CETTE FONCTION RÈGLE LE BUG DU SITE
export async function updateClosingFull(payload: {
  prospect_id: string; visit_id: string; closing_id: string; full_name: string;
  visit_date: string; site_id: string | null; stage: string;
  next_follow_up_at: string | null; assigned_closer_id: string | null;
}) {
  await supabase.from("prospects").update({ full_name: payload.full_name }).eq("id", payload.prospect_id);
  await supabase.from("visits").update({ visit_date: payload.visit_date || null, site_id: payload.site_id }).eq("id", payload.visit_id);
  await supabase.from("closing_cases").update({ stage: payload.stage as any, next_follow_up_at: payload.next_follow_up_at, assigned_closer_id: payload.assigned_closer_id }).eq("id", payload.closing_id);
  return true;
}