"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import type {
    VisitFilters,
    VisitPeriod,
    VisitResultFilter,
    VisitStatusFilter,
    VisitTypeFilter,
} from "./types";
import { VisitPeriodFilter } from "./VisitPeriodFilter";

interface VisitFiltersPanelProps {
    period: VisitPeriod;
    selectedDate: string;
    selectedMonth: string;
    filters: VisitFilters;
    onPeriodChange: (period: VisitPeriod) => void;
    onSelectedDateChange: (date: string) => void;
    onSelectedMonthChange: (month: string) => void;
    onFiltersChange: (filters: VisitFilters) => void;
    showAdvancedFilters?: boolean;
}

const selectClassName =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500";

export function VisitFiltersPanel({
    period,
    selectedDate,
    selectedMonth,
    filters,
    onPeriodChange,
    onSelectedDateChange,
    onSelectedMonthChange,
    onFiltersChange,
    showAdvancedFilters = true,
}: VisitFiltersPanelProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <h2 className="text-sm font-semibold">Période et filtres</h2>
            </div>

            <VisitPeriodFilter
                value={period}
                selectedDate={selectedDate}
                selectedMonth={selectedMonth}
                onChange={onPeriodChange}
                onSelectedDateChange={onSelectedDateChange}
                onSelectedMonthChange={onSelectedMonthChange}
            />

            <div className={`mt-4 grid gap-3 ${showAdvancedFilters ? "md:grid-cols-2 xl:grid-cols-5" : ""}`}>
                <div className={showAdvancedFilters ? "relative xl:col-span-2" : "relative"}>
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={filters.search}
                        onChange={(event) =>
                            onFiltersChange({ ...filters, search: event.target.value })
                        }
                        placeholder="Prospect, téléphone, site, rapport..."
                        className={`${selectClassName} pl-9`}
                    />
                </div>

                {showAdvancedFilters && (
                    <>
                        <select
                            value={filters.status}
                            onChange={(event) =>
                                onFiltersChange({
                                    ...filters,
                                    status: event.target.value as VisitStatusFilter,
                                })
                            }
                            className={selectClassName}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="planned">Planifiées</option>
                            <option value="confirmed">Confirmées</option>
                            <option value="completed">Terminées</option>
                            <option value="postponed">Reportées</option>
                            <option value="cancelled">Annulées</option>
                        </select>

                        <select
                            value={filters.type}
                            onChange={(event) =>
                                onFiltersChange({
                                    ...filters,
                                    type: event.target.value as VisitTypeFilter,
                                })
                            }
                            className={selectClassName}
                        >
                            <option value="all">Tous les types</option>
                            <option value="terrain">Terrain</option>
                            <option value="bureau">Bureau</option>
                            <option value="autre">Autre</option>
                        </select>

                        <select
                            value={filters.result}
                            onChange={(event) =>
                                onFiltersChange({
                                    ...filters,
                                    result: event.target.value as VisitResultFilter,
                                })
                            }
                            className={selectClassName}
                        >
                            <option value="all">Tous les résultats</option>
                            <option value="very_interested">Très intéressé</option>
                            <option value="interested">Intéressé</option>
                            <option value="not_interested">Pas intéressé</option>
                            <option value="pending">En attente</option>
                        </select>
                    </>
                )}
            </div>
        </div>
    );
}
