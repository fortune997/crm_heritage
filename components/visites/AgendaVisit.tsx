"use client";

import {
    CalendarDays,
    Clock,
    MapPin,
    Phone,
    User,
} from "lucide-react";

import { Visit } from "@/core/types/visites/type";

interface Props {
    visit: Visit;
}

export function AgendaVisit({
    visit,
}: Props) {
    return (
        <div className="group rounded-xl border bg-background p-4 transition hover:border-primary/30 hover:bg-muted/20">

            <div className="flex flex-col gap-4 md:flex-row md:items-start">

                {/* Heure */}
                <div className="flex shrink-0 items-center gap-2 md:w-28 md:flex-col md:items-start md:gap-0">

                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                        <Clock className="h-4 w-4 text-primary md:hidden" />

                        {visit.startTime?.slice(
                            0,
                            5
                        ) ?? "--:--"}
                    </div>

                    {visit.endTime && (
                        <span className="text-xs text-muted-foreground">
                            →{" "}
                            {visit.endTime.slice(
                                0,
                                5
                            )}
                        </span>
                    )}

                </div>

                {/* Informations principales */}
                <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                        <h3 className="truncate font-semibold">
                            {visit.prospects?.full_name ??
                                "Prospect"}
                        </h3>

                        <VisitTypeBadge
                            type={
                                visit.type
                            }
                        />

                        <StatusBadge
                            status={
                                visit.status
                            }
                        />
                    </div>

                    {/* Terrain */}
                    {visit.sites?.nom_titre && (
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />

                            <span className="truncate">
                                {
                                    visit
                                        .sites
                                        .nom_titre
                                }
                            </span>

                            {visit.sites
                                .ville && (
                                    <span className="text-xs">
                                        ·{" "}
                                        {
                                            visit
                                                .sites
                                                .ville
                                        }
                                    </span>
                                )}
                        </div>
                    )}

                    {/* Informations */}
                    <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">

                        <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />

                            <span>
                                {
                                    visit
                                        .profiles
                                        ?.id
                                }
                            </span>
                        </div>

                        {visit.prospects
                            ?.phone && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5" />

                                    <span>
                                        {
                                            visit
                                                .prospects
                                                .phone
                                        }
                                    </span>
                                </div>
                            )}

                        {visit.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />

                                <span className="truncate">
                                    {
                                        visit.location
                                    }
                                </span>
                            </div>
                        )}

                    </div>

                    {/* Notes */}
                    {visit.notes && (
                        <div className="mt-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                            {visit.notes}
                        </div>
                    )}

                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2 md:flex-col">

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"
                    >
                        Détails
                    </button>

                    {visit.status !==
                        "cancelled" && (
                            <button
                                type="button"
                                className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"
                            >
                                Modifier
                            </button>
                        )}

                </div>

            </div>
        </div>
    );
}

function VisitTypeBadge({
    type,
}: {
    type?: string;
}) {
    const config: Record<
        string,
        {
            label: string;
            className: string;
        }
    > = {
        terrain: {
            label: "Terrain",
            className:
                "bg-emerald-500/10 text-emerald-700",
        },

        bureau: {
            label: "Bureau",
            className:
                "bg-blue-500/10 text-blue-700",
        },

        phone: {
            label: "Téléphone",
            className:
                "bg-purple-500/10 text-purple-700",
        },

        video: {
            label: "Visio",
            className:
                "bg-orange-500/10 text-orange-700",
        },

        other: {
            label: "Autre",
            className:
                "bg-muted text-muted-foreground",
        },
    };

    const item =
        config[type ?? ""] ??
        config.other;

    return (
        <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.className}`}
        >
            {item.label}
        </span>
    );
}

function StatusBadge({
    status,
}: {
    status?: string;
}) {
    const config: Record<
        string,
        string
    > = {
        planned: "Planifiée",
        confirmed: "Confirmée",
        completed: "Terminée",
        cancelled: "Annulée",
        postponed: "Reportée",
        no_show: "Absent",
    };

    return (
        <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium">
            {config[status ?? ""] ??
                status ??
                "—"}
        </span>
    );
}