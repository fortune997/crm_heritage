import { TProspects } from "../prospects";

export type ActivityStatus =
    | "A faire"
    | "En cours"
    | "Terminée"
    | "Annulée";

export type ActivityPriority =
    | "Basse"
    | "Normale"
    | "Haute"
    | "Urgente";

export type ActivityChannel =
    | "Appel"
    | "WhatsApp"
    | "SMS"
    | "Email"
    | "Visite"
    | "Réunion"
    | "Relance"
    | "Autre";

export interface ProspectActivity {
    id: string;

    prospect_id: string;

    created_by: string;
    assigned_to: string | null;

    titre: string;
    description: string | null;

    canal_relance: ActivityChannel;
    statut_activite: ActivityStatus;
    priorite: ActivityPriority;

    prochain_relance: string | null;
    completed_at: string | null;
    created_by_name: string | null;
    sexe: string;

    created_at: string;
    updated_at: string;
    prospects?: TProspects | null;
    profiles?: TProspects | null;
}