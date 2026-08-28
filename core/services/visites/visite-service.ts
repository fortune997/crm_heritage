import { ScheduleVisitFormValues } from "@/core/lib/validations/visites";
import supabase from "@/core/lib/supabase";
import { InterestLevel } from "@/app/(root)/topographiques/rapport/page";
import { Visit } from "@/core/types/visites/type";

export const newVisite = async (formData: ScheduleVisitFormValues) => {
    const { data, error } = await supabase
        .from("visits")
        .insert(formData)
        .select()
        .single();


    if (error) {
        console.error("Erreur lors de la création du prospect :", error);
        throw error;
    }

    return data;

};

export const assignedTopographe = async (
    id: string,
    topo_name: string
) => {
    const { data, error } = await supabase
        .from("visits")
        .update({
            topographe: topo_name,
        })
        .eq("id", id)
        .select();

    if (error) {
        console.error(
            "Erreur lors de l'affectation du topographe :",
            error
        );
        throw error;
    }

    return data;
};


export const fetchAllVisiste = async (): Promise<Visit[]> => {
    const { data, error } = await supabase
        .from("visits")
        .select(`
      *,
      prospects(*),
      sites(*),
      
      profiles(*)
      
    `)

    if (error) {
        console.error("Erreur récupération visites :", error);
        throw error;
    }

    return data as Visit[];
};

export const fetchConfirmedVisits =
    async (): Promise<Visit[]> => {
        const { data, error } = await supabase
            .from("visits")
            .select(`
                *,
                prospects(*),
                sites(*),
                profiles(*)
            `)
            .eq("status", "confirmed")
            .order("visit_date", {
                ascending: true,
            });

        if (error) {
            console.error(
                "Erreur récupération visites confirmées :",
                error
            );

            throw error;
        }

        return (data ?? []) as Visit[];
    };

export const fetchCommercialVisiste = async (id: string): Promise<Visit[]> => {
    const { data, error } = await supabase
        .from("visits")
        .select(`
      *,
      prospects(*),
      sites(*),
      
      profiles(*)
      
    `)
        .eq('created_by', id)

    if (error) {
        console.error("Erreur récupération visites :", error);
        throw error;
    }

    return data as Visit[];
};



export interface UpdateVisitReport {
    site: string;
    interested_area: string | null;
    interest_level: string;
    desired_price: string | null;
    observation: string;
}

export const updateVisitReport = async (
    id: string,
    report: UpdateVisitReport
) => {
    const { data, error } = await supabase
        .from("visits")
        .update({
            site: report.site,
            interested_area: report.interested_area,
            interest_level: report.interest_level,
            desired_price: report.desired_price,
            observation: report.observation,
            report: "Complété",
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(
            "Erreur lors de la mise à jour du rapport de visite :",
            error
        );

        throw error;
    }

    return data;
};




export type UpdateVisitStatusPayload =
    | {
        visitId: string;
        status: "confirmed";
    }
    | {
        visitId: string;
        status: "postponed";
        newDate: string;
        cancelation_reason?: string;
    };

export async function updateVisitStatus(
    payload: UpdateVisitStatusPayload
) {


    if (payload.status === "confirmed") {
        const { data, error } = await supabase
            .from("visits")
            .update({
                status: "confirmed",
                confirmed_at: new Date().toISOString(),
            })
            .eq("id", payload.visitId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    // 1. Récupération de la date actuelle avant modification
    const { data: currentVisit, error: fetchError } =
        await supabase
            .from("visits")
            .select("id, visit_date")
            .eq("id", payload.visitId)
            .single();

    if (fetchError) {
        throw fetchError;
    }

    if (!currentVisit) {
        throw new Error("Visite introuvable");
    }

    // 2. Conservation de l'ancienne date puis modification
    const { data, error } = await supabase
        .from("visits")
        .update({
            previous_visit_date: currentVisit.visit_date,
            visit_date: payload.newDate,
            postponed_at: new Date().toISOString(),
            cancelation_reason: payload.cancelation_reason ?? null,
            status: "postponed",
        })
        .eq("id", payload.visitId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}