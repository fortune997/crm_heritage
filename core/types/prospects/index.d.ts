import { TSites } from "../sites"
import { TProfile } from "../type"

export type TProspects = {
    id: string,
    company_id: string,
    full_name: string,
    phone: string,
    email: string,
    canal_prospection: string,
    interest_type: string,
    site_interesse: string,
    site_id: string,
    langue: string,
    sexe: string,
    budget_min: number,
    budget_max: number,
    message: string,
    qualification: string,
    status: ProspectStatus,
    created_by: string,
    created_at: string,
    updated_by: string,
    sites: TSites,
    profiles: TProfile

}