"use client";

import { CalendarDays } from "lucide-react";

import type { VisitPeriod } from "./types";

interface VisitPeriodFilterProps {
    value: VisitPeriod;
    selectedDate: string;
    selectedMonth: string;
    onChange: (period: VisitPeriod) => void;
    onSelectedDateChange: (date: string) => void;
    onSelectedMonthChange: (month: string) => void;
}

const PERIODS: Array<{ value: VisitPeriod; label: string }> = [
    { value: "today", label: "Aujourd’hui" },
    { value: "yesterday", label: "Hier" },
    { value: "week", label: "Cette semaine" },
    { value: "date", label: "Un jour" },
    { value: "month", label: "Un mois" },
    { value: "all", label: "Tout" },
];

export function VisitPeriodFilter({
    value,
    selectedDate,
    selectedMonth,
    onChange,
    onSelectedDateChange,
    onSelectedMonthChange,
}: VisitPeriodFilterProps) {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {PERIODS.map((period) => (
                    <button
                        key={period.value}
                        type="button"
                        onClick={() => onChange(period.value)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                            value === period.value
                                ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                    >
                        {period.label}
                    </button>
                ))}
            </div>

            {value === "date" && (
                <label className="inline-flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span className="sr-only">Choisir une date</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(event) => onSelectedDateChange(event.target.value)}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
            )}

            {value === "month" && (
                <label className="inline-flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span className="sr-only">Choisir un mois</span>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(event) => onSelectedMonthChange(event.target.value)}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
            )}
        </div>
    );
}
