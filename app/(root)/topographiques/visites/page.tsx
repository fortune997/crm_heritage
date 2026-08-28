// app/(dashboard)/visits/page.tsx

"use client";

import {
    useMemo,
    useState,
} from "react";
import {
    CalendarDays,
    Download,
    List,
    Loader2,
    MapPin,
    Search,
} from "lucide-react";
import { View } from "react-big-calendar";


import {
    Visit,
    VisitStatus,
} from "@/core/types/visites/type";
import { useVisites } from "@/core/hooks/visites/useVisite";
import { exportVisitsToPdf } from "@/components/visites/ExportVisitsPDF";

import { CalendarSidebar } from "@/components/visites/calendar-sidebar";
import { VisitsCalendar } from "@/components/visites/visits-calendar";


type DisplayMode = "table" | "calendar";

const STATUS_OPTIONS: Array<{
    value: VisitStatus;
    label: string;
}> = [
        {
            value: "planned",
            label: "Planifiée",
        },
        {
            value: "confirmed",
            label: "Confirmée",
        },
        {
            value: "completed",
            label: "Terminée",
        },
        {
            value: "postponed",
            label: "Reportée",
        },
        {
            value: "cancelled",
            label: "Annulée",
        },
    ];

const STATUS_LABELS: Record<
    VisitStatus,
    string
> = {
    planned: "Planifiée",
    confirmed: "Confirmée",
    completed: "Terminée",
    postponed: "Reportée",
    cancelled: "Annulée",
};

const STATUS_CLASSES: Record<
    VisitStatus,
    string
> = {
    planned:
        "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",

    confirmed:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",

    completed:
        "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",

    postponed:
        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",

    cancelled:
        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function getCommercialName(
    visit: Visit
): string {
    if (!visit.profiles) {
        return "Non renseigné";
    }

    const firstName =
        visit.profiles.first_name ?? "";

    const lastName =
        visit.profiles.last_name ?? "";

    return `${firstName} ${lastName}`.trim() ||
        "Non renseigné";
}

function formatVisitDate(
    value: string
): string {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
    }).format(new Date(value));
}

export default function VisitsPage() {
    const {
        data: visits = [],
        isLoading,
        isError,
    } = useVisites();

    const [displayMode, setDisplayMode] =
        useState<DisplayMode>("table");

    const [calendarView, setCalendarView] =
        useState<View>("month");
    const [calendarDate, setCalendarDate] =
        useState<Date>(new Date());

    const [selectedVisit, setSelectedVisit] =
        useState<Visit | null>(null);

    const [search, setSearch] =
        useState("");

    const [commercialId, setCommercialId] =
        useState("all");

    const [siteId, setSiteId] =
        useState("all");

    const [status, setStatus] =
        useState<VisitStatus | "all">("all");

    const commercials = useMemo(() => {
        const values = new Map<
            string,
            string
        >();

        visits.forEach((visit) => {
            if (visit.commercial_id) {
                values.set(
                    visit.commercial_id,
                    getCommercialName(visit)
                );
            }
        });

        return Array.from(
            values.entries()
        ).map(([id, name]) => ({
            id,
            name,
        }));
    }, [visits]);

    const sites = useMemo(() => {
        const values = new Map<
            string,
            string
        >();

        visits.forEach((visit) => {
            if (
                visit.site_id &&
                visit.sites
            ) {
                values.set(
                    visit.site_id,
                    visit.sites.nom_titre
                );
            }
        });

        return Array.from(
            values.entries()
        ).map(([id, name]) => ({
            id,
            name,
        }));
    }, [visits]);

    const filteredVisits = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return visits.filter((visit) => {
            const prospectName =
                visit.prospects?.full_name
                    ?.toLowerCase() ?? "";

            const commercialName =
                getCommercialName(visit)
                    .toLowerCase();

            const siteName =
                visit.sites?.nom_titre
                    ?.toLowerCase() ?? "";

            const location =
                (
                    visit.location ??
                    visit.meeting_point ??
                    ""
                ).toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                prospectName.includes(
                    normalizedSearch
                ) ||
                commercialName.includes(
                    normalizedSearch
                ) ||
                siteName.includes(
                    normalizedSearch
                ) ||
                location.includes(
                    normalizedSearch
                );

            const matchesCommercial =
                commercialId === "all" ||
                visit.commercial_id ===
                commercialId;

            const matchesSite =
                siteId === "all" ||
                visit.site_id === siteId;

            const matchesStatus =
                status === "all" ||
                visit.status === status;

            return (
                matchesSearch &&
                matchesCommercial &&
                matchesSite &&
                matchesStatus
            );
        });
    }, [
        visits,
        search,
        commercialId,
        siteId,
        status,
    ]);

    function resetFilters(): void {
        setSearch("");
        setCommercialId("all");
        setSiteId("all");
        setStatus("all");
    }

    if (isLoading) {
        return (
            <div className="flex min-h-125 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                Impossible de charger les visites.
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-4 text-slate-950 dark:bg-slate-950 dark:text-white lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Gestion des visites
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Planning et suivi des visites
                            des topographes.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={
                            filteredVisits.length === 0
                        }
                        onClick={() =>
                            exportVisitsToPdf(
                                filteredVisits
                            )
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        <Download className="h-4 w-4" />
                        Télécharger le PDF
                    </button>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500">
                            Total affiché
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {filteredVisits.length}
                        </p>
                    </div>

                    {[
                        "confirmed",
                        "planned",
                        "postponed",
                    ].map((item) => {
                        const visitStatus =
                            item as VisitStatus;

                        return (
                            <div
                                key={visitStatus}
                                className="rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                            >
                                <p className="text-sm text-slate-500">
                                    {
                                        STATUS_LABELS[
                                        visitStatus
                                        ]
                                    }
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {
                                        filteredVisits.filter(
                                            (visit) =>
                                                visit.status ===
                                                visitStatus
                                        ).length
                                    }
                                </p>
                            </div>
                        );
                    })}
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Prospect, lieu, site..."
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                            />
                        </div>

                        <select
                            value={commercialId}
                            onChange={(event) =>
                                setCommercialId(
                                    event.target.value
                                )
                            }
                            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                        >
                            <option value="all">
                                Tous les commerciaux
                            </option>

                            {commercials.map(
                                (commercial) => (
                                    <option
                                        key={commercial.id}
                                        value={commercial.id}
                                    >
                                        {commercial.name}
                                    </option>
                                )
                            )}
                        </select>

                        <select
                            value={siteId}
                            onChange={(event) =>
                                setSiteId(
                                    event.target.value
                                )
                            }
                            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                        >
                            <option value="all">
                                Tous les sites
                            </option>

                            {sites.map((site) => (
                                <option
                                    key={site.id}
                                    value={site.id}
                                >
                                    {site.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value as
                                    | VisitStatus
                                    | "all"
                                )
                            }
                            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                        >
                            <option value="all">
                                Tous les statuts
                            </option>

                            {STATUS_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                )
                            )}
                        </select>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                            Réinitialiser
                        </button>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setDisplayMode("table")
                            }
                            className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm ${displayMode === "table"
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-slate-100 dark:bg-slate-800"
                                }`}
                        >
                            <List className="h-4 w-4" />
                            Tableau
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setDisplayMode(
                                    "calendar"
                                )
                            }
                            className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm ${displayMode ===
                                "calendar"
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-slate-100 dark:bg-slate-800"
                                }`}
                        >
                            <CalendarDays className="h-4 w-4" />
                            Calendrier
                        </button>
                    </div>
                </section>

                {displayMode === "calendar" ? (
                    <VisitsCalendar
                        visits={filteredVisits}
                        date={calendarDate}
                        setDate={setCalendarDate}
                        onSelectVisit={(visit) => {
                            setSelectedVisit(visit);
                        }}
                    />
                ) : (
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Date
                                        </th>
                                        <th className="px-4 py-3">
                                            Prospect
                                        </th>
                                        <th className="px-4 py-3">
                                            Commercial
                                        </th>
                                        <th className="px-4 py-3">
                                            Site
                                        </th>
                                        <th className="px-4 py-3">
                                            Lieu
                                        </th>
                                        <th className="px-4 py-3">
                                            Statut
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {filteredVisits.map(
                                        (visit) => (
                                            <tr
                                                key={visit.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            >
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <p className="font-medium">
                                                        {formatVisitDate(
                                                            visit.visit_date
                                                        )}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            visit.start_time
                                                        }

                                                    </p>
                                                </td>

                                                <td className="px-4 py-4 font-medium">
                                                    {visit
                                                        .prospects
                                                        ?.full_name ??
                                                        "Non renseigné"}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {getCommercialName(
                                                        visit
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {visit
                                                        .sites
                                                        ?.nom_titre ??
                                                        "Non renseigné"}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-slate-400" />

                                                        {visit.location ??
                                                            visit.meeting_point ??
                                                            "Non renseigné"}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[
                                                            visit
                                                                .status
                                                        ]
                                                            }`}
                                                    >
                                                        {
                                                            STATUS_LABELS[
                                                            visit
                                                                .status
                                                            ]
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>

                            {filteredVisits.length ===
                                0 && (
                                    <div className="p-12 text-center text-sm text-slate-500">
                                        Aucune visite ne
                                        correspond aux filtres.
                                    </div>
                                )}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}