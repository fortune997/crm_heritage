import type {
    Visit,
    VisitResult,
    VisitStatus,
    VisitType,
} from "@/core/types/visites/type";

export type CommercialVisit = Visit & {
    report?: string | null;
    observation?: string | null;
    report_created_at?: string | null;
    report_updated_at?: string | null;
    venue_rdv?: boolean | null;
    topographe?: string | null;
};

export type VisitPeriod =
    | "today"
    | "yesterday"
    | "week"
    | "date"
    | "month"
    | "all";

export type VisitStatusFilter = VisitStatus | "all";
export type VisitTypeFilter = VisitType | "all";
export type VisitResultFilter = VisitResult | "all";

export interface VisitFilters {
    search: string;
    status: VisitStatusFilter;
    type: VisitTypeFilter;
    result: VisitResultFilter;
}
