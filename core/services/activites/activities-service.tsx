import { ActivitiesFormValues } from "@/lib/validations/schema";
import supabase from "../../lib/supabase";
import { TProspects } from "@/core/types/prospects";

export interface newActivityProps {
  userId: string;
  action: string;
  entiteId: number;
  description: string;
  plateforme: string;
}

type CreateActivityInput = ActivitiesFormValues & {
  created_by: string;

};

export type UpdateActivityInput = Partial<CreateActivityInput> & {
  id: string;
};

export const fetchAcitvities = async () => {
  const { data, error } = await supabase
    .from("prospect_activities")
    .select(`*, prospects(phone, full_name, canal_prospection, status, created_by), profiles(*) `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return data;
};

type TypeCommercial = "call_center" | "closing_visite";

export const fetchAcitvitiesProgramme = async (
  typeCommercial: string | null | undefined
) => {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Africa/Douala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const startOfDay = new Date(`${today}T00:00:00+01:00`);

  const startOfNextDay = new Date(startOfDay);
  startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

  let query = supabase
    .from("prospect_activities")
    .select(`
      *,
      prospects!inner(
        phone,
        full_name,
        canal_prospection,
        status,
        created_by,
        qualification
      ),
      profiles(*)
    `)
    .or(
      `and(prochain_relance.gte.${startOfDay.toISOString()},prochain_relance.lt.${startOfNextDay.toISOString()}),statut_activite.eq."A faire"`
    );

  if (typeCommercial === "call_center") {
    query = query.in("prospects.qualification", ["H1", "H2", "H3"]);
  } else if (typeCommercial === "closing_visite") {
    query = query.in("prospects.qualification", ["H4", "H5"]);
  }

  const { data, error } = await query
    .order("prochain_relance", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) throw new Error(error.message);

  return data ?? [];
};

export const newActivities = async (
  payload: CreateActivityInput
) => {
  const activitiesDATA = {
    prospect_id: payload.prospect_id,
    titre: payload.titre,
    description: payload.description,
    canal_relance: payload.canal_relance,
    statut_activite: payload.statut_activite,
    prochain_relance: payload.prochain_relance,
    created_by: payload.created_by,
  };

  const { data, error } = await supabase
    .from("prospect_activities")
    .insert(activitiesDATA)
    .select();

  if (error) {
    throw new Error(`Prospect : ${error.message}`);
  }

  // Conserver la qualification actuelle si aucune n'est fournie.
  if (payload.qualification != null) {
    const { error: errorProspect } = await supabase
      .from("prospects")
      .update({
        qualification: payload.qualification,
      })
      .eq("id", payload.prospect_id)
      .select("id")
      .single();

    if (errorProspect) {
      throw new Error(
        `L’activité a été créée, mais la qualification n’a pas pu être mise à jour : ${errorProspect.message}`
      );
    }
  }

  return data;
};


export type UpdateActivityStatusInput = {
  id: string;
  statut_activite: string;
  description: string;
};

export const updateActivityStatus = async ({
  id,
  statut_activite,
  description,
}: UpdateActivityStatusInput) => {
  if (!id?.trim()) {
    throw new Error("Identifiant de l’activité manquant.");
  }

  console.log('PAYLOAD SERVICE', {  id,
  statut_activite,
  description,})

  const { data, error } = await supabase
    .from("prospect_activities")
    .update({
      statut_activite,
      description,
      completed_at:
        statut_activite === "Terminée"
          ? new Date().toISOString()
          : null,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!data) {
    throw new Error(
      "Activité introuvable ou accès non autorisé."
    );
  }

  return data;
};;


export const updateActivity = async (
  payload: UpdateActivityInput
) => {
   console.log('PAYLOADpayload', payload)
  const { id, ...updates } = payload;


  const { data, error } = await supabase
    .from("prospect_activities")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message);
 console.log('res', data)
  return data;
};


export type FollowUpState =
    | "overdue"
    | "today"
    | "upcoming"
    | "completed"
    | "no_date";

export type ActivityFollowUp = {
    id: string;
    prospect_id: string;
    titre: string;
    description: string | null;
    statut_activite: string;
    priorite: string | null;
    prochain_relance: string | null;
    completed_at: string | null;
    created_at: string;
    created_by: string | null;

    prospect_name: string | null;
    prospect_phone: string | null;
    prospect_status: string | null;
    created_by_name: string | null;
    prospects?: TProspects;

    follow_up_state: FollowUpState;
};

export async function fetchActivityFollowUps() {
    const { data, error } = await supabase
        .from("activity_follow_up_view")
        .select("*")
        .neq("follow_up_state", "completed")
        .order("prochain_relance", {
            ascending: true,
            nullsFirst: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}

export const fetchAcitvitiesByID = async (id: string ) => {
  const { data, error } = await supabase
    .from("prospect_activities")
    .select(`*, prospects(phone, full_name, canal_prospection, status, created_by), profiles(*) `)
    .eq('prospect_id', id)
    .order("created_at", { ascending: false })
    

  if (error) throw new Error(error.message);
  return data;
};