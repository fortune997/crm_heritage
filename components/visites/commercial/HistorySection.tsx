import EmptyState from "@/components/visites/EmptyState";
import HistoryRow from "@/components/visites/HistoryRow";

import type { CommercialVisit, VisitFilters, VisitPeriod } from "./types";
import { VisitFiltersPanel } from "./VisitFiltersPanel";

interface HistorySectionProps {
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

export function HistorySection({
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
}: HistorySectionProps) {
    return (
        <section className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold">Historique de mes visites</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Retrouvez une visite passée par jour, semaine, mois, statut ou résultat.
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

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                            <tr>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Date</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Visite</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Type</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Statut</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Résultat</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Présence</th>
                                <th className="px-5 py-3 text-right font-medium text-slate-500">Rapport</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {visits.map((visit) => (
                                <HistoryRow
                                    key={visit.id}
                                    visit={visit}
                                    onReport={() => onOpenReport(visit)}
                                />
                            ))}
                        </tbody>
                    </table>

                    {visits.length === 0 && <EmptyState />}
                </div>
            </div>
        </section>
    );
}
