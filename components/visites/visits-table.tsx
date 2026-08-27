"use client";


import { VisitTypeBadge } from "./visit-type-badge";
import { VisitStatusBadge } from "./visit-status-badge";
import { VisitActions } from "./visit-actions";
import { Visit } from "@/core/types/visites/type";

interface Props {
    visits: Visit[];
}

export function VisitsTable({
    visits,
}: Props) {
    return (
        <section className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b p-4">
                <div>
                    <h2 className="font-semibold">
                        Liste des visites
                    </h2>

                    <p className="text-xs text-muted-foreground">
                        {visits.length} visite
                        {visits.length > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Mobile */}
            <div className="divide-y md:hidden">
                {visits.map((visit) => (
                    <MobileVisit
                        key={visit.id}
                        visit={visit}
                    />
                ))}
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-250 text-sm">
                    <thead>
                        <tr className="border-b bg-muted/30 text-left text-xs text-muted-foreground">
                            <th className="px-4 py-3">
                                Date & heure
                            </th>

                            <th className="px-4 py-3">
                                Type
                            </th>

                            <th className="px-4 py-3">
                                Client / Prospect
                            </th>

                            <th className="px-4 py-3">
                                Terrain
                            </th>

                            <th className="px-4 py-3">
                                Commercial
                            </th>

                            <th className="px-4 py-3">
                                Statut
                            </th>

                            <th className="px-4 py-3">
                                Résultat
                            </th>

                            <th className="px-4 py-3 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {visits.map((visit) => (
                            <tr
                                key={visit.id}
                                className="hover:bg-muted/20"
                            >
                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {formatDate(visit.date)}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {visit.startTime} -{" "}
                                        {visit.endTime}
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <VisitTypeBadge
                                        type={visit.type}
                                    />
                                </td>

                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {visit.prospects.full_name}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {visit.prospects?.phone}
                                    </div>

                                    {/*   <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase">
                                        {visit.prospects.type}
                                    </span> */}
                                </td>

                                <td className="px-4 py-3">
                                    {visit.sites ? (
                                        <>
                                            <div className="font-medium">
                                                {visit.sites.nom_titre}
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {visit.sites.ville} ·{" "}
                                                {visit.sites.superficie_total || '-'} m²
                                            </div>
                                        </>
                                    ) : (
                                        "—"
                                    )}
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {visit.profiles?.avatar_url ? (
                                            <img
                                                src={visit.profiles?.avatar_url}
                                                className="h-7 w-7 rounded-full object-cover"
                                                alt={visit.profiles?.full_name ?? "Utilisateur"}
                                            />
                                        ) : (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                {visit.profiles?.full_name?.charAt(0).toUpperCase() ?? "U"}
                                            </div>
                                        )}

                                        <span className="text-xs font-medium">
                                            {visit.profiles?.full_name ?? "Utilisateur"}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <VisitStatusBadge
                                        status={visit.status}
                                    />
                                </td>

                                <td className="px-4 py-3">
                                    <ResultBadge
                                        result={visit.result}
                                    />
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex justify-end">
                                        <VisitActions />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        Affichage de 1 à {visits.length} sur{" "}
                        {visits.length} visites
                    </span>

                    <div className="flex gap-1">
                        <button className="rounded border px-2 py-1 hover:bg-muted">
                            ‹
                        </button>

                        <button className="rounded bg-primary px-2.5 py-1 text-white">
                            1
                        </button>

                        <button className="rounded border px-2 py-1 hover:bg-muted">
                            2
                        </button>

                        <button className="rounded border px-2 py-1 hover:bg-muted">
                            3
                        </button>

                        <button className="rounded border px-2 py-1 hover:bg-muted">
                            ›
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MobileVisit({
    visit,
}: {
    visit: Visit;
}) {
    return (
        <div className="p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-semibold">
                        {visit.prospects.full_name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {formatDate(visit.date)} ·{" "}
                        {visit.startTime}
                    </p>
                </div>

                <VisitStatusBadge
                    status={visit.status}
                />
            </div>

            <div className="mt-3">
                <VisitTypeBadge
                    type={visit.type}
                />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                    <p className="text-muted-foreground">
                        Terrain
                    </p>

                    <p className="mt-1 font-medium">
                        {visit.sites?.nom_titre || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-muted-foreground">
                        Commercial
                    </p>

                    <p className="mt-1 font-medium">
                        {visit.profiles?.full_name ?? "Non renseigné"}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex justify-end">
                <VisitActions />
            </div>
        </div>
    );
}

function ResultBadge({
    result,
}: {
    result?: Visit["result"];
}) {
    const config = {
        very_interested: [
            "Très intéressé",
            "bg-emerald-50 text-emerald-700",
        ],
        interested: [
            "Intéressé",
            "bg-blue-50 text-blue-700",
        ],
        not_interested: [
            "Pas intéressé",
            "bg-red-50 text-red-700",
        ],
        pending: [
            "À définir",
            "bg-muted text-muted-foreground",
        ],
    };

    if (!result) return "—";

    const [label, classes] = config[result];

    return (
        <span
            className={`rounded-md px-2 py-1 text-[10px] font-semibold ${classes}`}
        >
            {label}
        </span>
    );
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }
    ).format(new Date(date));
}