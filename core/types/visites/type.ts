
import { HeritageUser } from "../profiles";
import { TProspects } from "../prospects";
import { TSites } from "../sites";


export type VisitType =
    | "terrain"
    | "bureau"
    | "autre";

export type VisitStatus =
    | "planned"
    | "completed"
    | "confirmed"
    | "cancelled"
    | "postponed";

export type VisitResult =
    | "very_interested"
    | "interested"
    | "not_interested"
    | "pending";

export interface Visit {
    id: string;

    date: string;
    startTime: string;
    endTime: string;
venue_rdv: boolean;
    type: VisitType;

    status: VisitStatus;


    location?: string;

    result?: VisitResult;

    notes?: string;
    prospect_id: string,
    commercial_id: string,
    site_id: string,
    visit_type: string,

    visit_date: string,
    start_time: string,
    meeting_point: string,
    report: string,
    topographe: string,
    objections: string,
    next_action: string,
    created_by: string,
    observation: string,
    updated_by: string,
    interest_level: string,
    desired_price: string,
    interested_area: string,
    created_at: string,
    updated_at: string,
    prospects: TProspects,
    sites: TSites,
    profiles: HeritageUser
}