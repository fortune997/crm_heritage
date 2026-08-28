"use client";

import { Visit } from "@/core/types/visites/type";
import {
    CalendarClock,
    CheckCircle2,
    FileText,
    MapPin,
    Phone,
    UserRound,
} from "lucide-react";

import {
    getResultConfig,
    getStatusConfig,
    getTypeLabel,
} from "./visit-config";

interface TodayVisitCardProps {
    visit: Visit;
    onReport: () => void;
    onConfirmVisit: () => void;
    onPostponeVisit: () => void;
}

const TodayVisitCard = ({
    visit,
    onReport,
    onConfirmVisit,
    onPostponeVisit,
}: TodayVisitCardProps) => {
    const result = visit.result
        ? getResultConfig(visit.result)
        : null;

    const prospectName =
        visit.prospects?.full_name ??
        "Prospect non renseigné";

    const prospectPhone =
        visit.prospects?.phone ?? null;

    const status = getStatusConfig(visit.status);

    const canManageVisit =
        visit.status !== "confirmed";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex min-w-20 flex-col items-center justify-center rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950">
                        <span className="text-lg font-bold">
                            {visit.start_time}
                        </span>
                    </div>

                    <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                                Visite{" "}
                                {getTypeLabel(
                                    visit.visit_type
                                )}
                            </h3>

                            <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
                            >
                                {status.label}
                            </span>
                        </div>

                        <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0" />

                                <span>
                                    {visit.location ??
                                        visit.meeting_point ??
                                        "Lieu non renseigné"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <UserRound className="h-4 w-4 shrink-0" />

                                <span className="font-medium text-slate-700 dark:text-slate-200">
                                    {prospectName}
                                </span>
                            </div>

                            {prospectPhone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />

                                    <a
                                        href={`tel:${prospectPhone}`}
                                        className="transition hover:text-slate-900 hover:underline dark:hover:text-white"
                                    >
                                        {prospectPhone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {result && (
                        <div className="mr-3 hidden text-right sm:block">
                            <p className="text-xs text-slate-400">
                                Résultat
                            </p>

                            <p
                                className={`mt-1 text-sm font-semibold ${result.className}`}
                            >
                                {result.label}
                            </p>
                        </div>
                    )}

                    {canManageVisit && (
                        <>
                            <button
                                type="button"
                                onClick={onConfirmVisit}
                                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Confirmer
                            </button>

                            <button
                                type="button"
                                onClick={onPostponeVisit}
                                className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-medium text-white transition hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                            >
                                <CalendarClock className="h-4 w-4" />
                                Reporter
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={onReport}
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        <FileText className="h-4 w-4" />

                        {visit.report
                            ? "Voir le rapport"
                            : "Ajouter le rapport"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodayVisitCard;