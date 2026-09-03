import type { CommercialVisit, VisitFilters, VisitPeriod } from "./types";

export function toLocalDateKey(date: Date): string {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

export function normalizeDateKey(value?: string | null): string {
    if (!value) return "";

    const isoDate = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (isoDate) return isoDate;

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? "" : toLocalDateKey(parsedDate);
}

function addDays(date: Date, numberOfDays: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + numberOfDays);
    return copy;
}

function getMonday(date: Date): Date {
    const copy = new Date(date);
    const day = copy.getDay();
    const distance = day === 0 ? -6 : 1 - day;
    copy.setDate(copy.getDate() + distance);
    return copy;
}

export function getReportDate(visit: CommercialVisit): string {
    return normalizeDateKey(
        visit.report_created_at ?? visit.report_updated_at ?? visit.visit_date
    );
}

export function isInPeriod(
    dateValue: string | null | undefined,
    period: VisitPeriod,
    selectedDate: string,
    selectedMonth: string,
    now = new Date()
): boolean {
    const dateKey = normalizeDateKey(dateValue);
    if (!dateKey) return false;

    const today = toLocalDateKey(now);

    if (period === "all") return true;
    if (period === "today") return dateKey === today;
    if (period === "yesterday") {
        return dateKey === toLocalDateKey(addDays(now, -1));
    }
    if (period === "date") return dateKey === selectedDate;
    if (period === "month") return dateKey.startsWith(selectedMonth);

    const monday = getMonday(now);
    const sunday = addDays(monday, 6);
    return dateKey >= toLocalDateKey(monday) && dateKey <= toLocalDateKey(sunday);
}

export function hasVisitReport(visit: CommercialVisit): boolean {
    return Boolean(
        visit.report?.trim() ||
            visit.observation?.trim() ||
            visit.next_action?.trim() ||
            visit.objections?.trim()
    );
}

export function matchesVisitFilters(
    visit: CommercialVisit,
    filters: VisitFilters
): boolean {
    if (filters.status !== "all" && visit.status !== filters.status) return false;
    if (filters.type !== "all" && visit.type !== filters.type) return false;
    if (filters.result !== "all" && visit.result !== filters.result) return false;

    const query = filters.search.trim().toLocaleLowerCase("fr");
    if (!query) return true;

    const searchableContent = [
        visit.prospects?.full_name,
        visit.prospects?.phone,
        visit.sites?.nom_titre,
        visit.location,
        visit.meeting_point,
        visit.topographe,
        visit.report,
        visit.observation,
        visit.next_action,
        visit.objections,
    ]
        .filter((value): value is string => typeof value === "string")
        .join(" ")
        .toLocaleLowerCase("fr");

    return searchableContent.includes(query);
}

export function sortVisitsNewest(
    visits: CommercialVisit[],
    dateSelector: (visit: CommercialVisit) => string = (visit) =>
        normalizeDateKey(visit.visit_date)
): CommercialVisit[] {
    return [...visits].sort((left, right) => {
        const dateComparison = dateSelector(right).localeCompare(dateSelector(left));
        if (dateComparison !== 0) return dateComparison;
        return (right.start_time ?? "").localeCompare(left.start_time ?? "");
    });
}
