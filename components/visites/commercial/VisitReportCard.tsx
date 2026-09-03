import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    MapPin,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { CommercialVisit } from "./types";

interface VisitReportCardProps {
    visit: CommercialVisit;
    onOpen: () => void;
}

function formatVisitDate(value: string): string {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    if (!year || !month || !day) return value;

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
    }).format(new Date(year, month - 1, day));
}

export function VisitReportCard({ visit, onOpen }: VisitReportCardProps) {
    const reportPreview =
        visit.report?.trim() ||
        visit.observation?.trim() ||
        "Le rapport ne contient pas encore de résumé.";

    return (
        <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Rapport disponible
                        </span>
                        {visit.venue_rdv === false && (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
                                Prospect absent
                            </span>
                        )}
                    </div>

                    <div>
                        <h3 className="truncate text-base font-semibold">
                            {visit.prospects?.full_name ?? "Prospect non renseigné"}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatVisitDate(visit.visit_date)}
                            </span>
                            {visit.start_time && (
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    {visit.start_time}
                                </span>
                            )}
                            {(visit.sites?.nom_titre || visit.location) && (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {visit.sites?.nom_titre ?? visit.location}
                                </span>
                            )}
                            {visit.topographe && (
                                <span className="inline-flex items-center gap-1.5">
                                    <UserRound className="h-3.5 w-3.5" />
                                    {visit.topographe}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {reportPreview}
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 gap-2"
                    onClick={onOpen}
                >
                    <FileText className="h-4 w-4" />
                    Lire le rapport
                </Button>
            </div>
        </article>
    );
}
