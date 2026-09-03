import EmptyState from "@/components/visites/EmptyState";

import type { CommercialVisit, VisitFilters, VisitPeriod } from "./types";
import { VisitFiltersPanel } from "./VisitFiltersPanel";
import { VisitReportCard } from "./VisitReportCard";

interface ReportsSectionProps {
    visits: CommercialVisit[];
    period: VisitPeriod;
    selectedDate: string;
    selectedMonth: string;
    filters: VisitFilters;
    onPeriodChange: (period: VisitPeriod) => void;
    onSelectedDateChange: (date: string) => void;
    onSelectedMonthChange: (month: string) => void;
    onFiltersChange: (filters: VisitFilters) => void;
    onOpenReport: (visit: CommercialVisit) => void;
}

export function ReportsSection({
    visits,
    period,
    selectedDate,
    selectedMonth,
    filters,
    onPeriodChange,
    onSelectedDateChange,
    onSelectedMonthChange,
    onFiltersChange,
    onOpenReport,
}: ReportsSectionProps) {
    return (
        <section className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold">Rapports du topographe</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Consultez les comptes rendus des visites effectuées. La période
                    sélectionnée utilise la date du rapport lorsqu’elle existe,
                    sinon la date de visite.
                </p>
            </div>

            <VisitFiltersPanel
                period={period}
                selectedDate={selectedDate}
                selectedMonth={selectedMonth}
                filters={filters}
                onPeriodChange={onPeriodChange}
                onSelectedDateChange={onSelectedDateChange}
                onSelectedMonthChange={onSelectedMonthChange}
                onFiltersChange={onFiltersChange}
            />

            {visits.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <EmptyState />
                </div>
            ) : (
                <div className="grid gap-4">
                    {visits.map((visit) => (
                        <VisitReportCard
                            key={visit.id}
                            visit={visit}
                            onOpen={() => onOpenReport(visit)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
