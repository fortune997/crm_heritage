'use client'


import { formatDate } from "@/core/lib/utils";
import { Visit } from "@/core/types/visites/type";
import { CalendarDays, FileText, MapPin, MessageSquareText, X } from "lucide-react";
import InfoBox from "./InfoBox";
import ReportSection from "./ReportSection";
import { formatDa, formatPrice } from "@/lib/utils";
import { getResultConfig, getTypeLabel } from "./visit-config";

interface ReportDrawerProps {
    visit: Visit;
    onClose: () => void;
}

function ReportDrawer({
    visit,
    onClose,
}: ReportDrawerProps) {


    const result = visit.result
        ? getResultConfig(visit.result)
        : null;
    return (
        <div className="fixed inset-0 z-50 flex">

            {/* BACKDROP */}

            <button
                type="button"
                aria-label="Fermer"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
            />

            {/* DRAWER */}

            <aside className="relative ml-auto flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

                {/* HEADER */}

                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">

                    <div>
                        <div className="mb-1 flex items-center gap-2 text-sm text-slate-400">
                            <FileText className="h-4 w-4" />
                            Rapport de visite
                        </div>

                        <h2 className="text-lg font-bold">
                            Visite du{" "}
                            {formatDa(visit.visit_date)}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {visit.start_time}

                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* CONTENT */}

                <div className="flex-1 overflow-y-auto px-6 py-6">

                    {/* VISIT INFO */}

                    <div className="mb-6 grid grid-cols-2 gap-3">

                        <InfoBox
                            icon={
                                <MapPin className="h-4 w-4" />
                            }
                            label="Lieu"
                            value={
                                visit.location ??
                                visit.meeting_point ??
                                "Non renseigné"
                            }
                        />

                        <InfoBox
                            icon={
                                <CalendarDays className="h-4 w-4" />
                            }
                            label="Type"
                            value={
                                getTypeLabel(visit.visit_type)
                            }
                        />

                    </div>

                    {/* RESULT */}

                    {result && (
                        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Niveau d'intérêt
                            </p>

                            <p
                                className={`mt-1 text-base font-bold ${result.className}`}
                            >
                                {result.label}
                            </p>

                            {visit.interest_level && (
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {visit.interest_level}
                                </p>
                            )}
                        </div>
                    )}

                    {/* REPORT */}

                    <ReportSection
                        icon={
                            <MessageSquareText className="h-4 w-4" />
                        }
                        title="Compte rendu"
                        value={visit.report}
                    />

                    <ReportSection
                        title="Observation"
                        value={visit.observation}
                    />

                    <ReportSection
                        title="Objections"
                        value={visit.objections}
                    />

                    <ReportSection
                        title="Prochaine action"
                        value={visit.next_action}
                    />

                    {/* COMMERCIAL INFO */}

                    <div className="mt-6 grid grid-cols-2 gap-3">

                        <InfoBox
                            label="Surface recherchée"
                            value={
                                visit.interested_area ||
                                "Non renseignée"
                            }
                        />

                        <InfoBox
                            label="Budget souhaité"
                            value={
                                visit.desired_price
                                    ? formatPrice(
                                        visit.desired_price
                                    )
                                    : "Non renseigné"
                            }
                        />

                    </div>

                    {/* TOPOGRAPHE */}

                    {visit.topographe && (
                        <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">

                            <p className="text-xs text-slate-400">
                                Topographe
                            </p>

                            <p className="mt-1 text-sm font-medium">
                                {visit.topographe}
                            </p>

                        </div>
                    )}

                </div>

                {/* FOOTER */}

                <div className="border-t border-slate-200 p-4 dark:border-slate-800">

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
                    >
                        Fermer
                    </button>

                </div>
            </aside>
        </div>
    );
}


export default ReportDrawer