"use client";

import { useMemo, useState } from "react";
import {
    Backpack,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    FileText,
    Filter,
    History,
    MapPin,
    MessageSquareText,
    MoreHorizontal,
    Search,
    SlidersHorizontal,
    StepBack,
    UserRound,
    X,
    XCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Visit, VisitResult, VisitStatus, VisitType } from "@/core/types/visites/type";
import { useMyVisites } from "@/core/hooks/visites/useVisite";
import { getTodayDate } from "@/lib/utils";
import ReportDrawer from "@/components/visites/ReportDrawer";
import EmptyState from "@/components/visites/EmptyState";
import HistoryRow from "@/components/visites/HistoryRow";
import FilterSelect from "@/components/visites/FilterSelect";
import TodayVisitCard from "@/components/visites/TodayVisitCard";
import TabButton from "@/components/visites/TabButton";
import StatVisitCard from "@/components/visites/StatVisitCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";






export default function CommercialVisitsPage() {
    const [activeTab, setActiveTab] = useState<"today" | "history">("today");
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<VisitStatus | "all">("all");
    const [typeFilter, setTypeFilter] = useState<VisitType | "all">("all");
    const [resultFilter, setResultFilter] = useState<VisitResult | "all">("all");
    const router = useRouter()

    const { profile } = useAuth()
    const { data: myVisites = [] } = useMyVisites(profile?.id ?? '')

    const getTodayDate = (): string => {
        const now = new Date();

        return [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        ].join("-");
    };

    const today = getTodayDate();
    console.log('TODAY', today)

    const todayVisits = useMemo(() => {
        return myVisites.filter((visit) => {
            if (!visit || !visit.visit_date) {
                return false;
            }

            if (visit.visit_date !== today) {
                return false;
            }

            if (
                statusFilter !== "all" &&
                visit.status !== statusFilter
            ) {
                return false;
            }

            return true;
        });
    }, [myVisites, today, statusFilter]);

    const historyVisits = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return myVisites
            .filter((visit) => visit.visit_date !== today)
            .filter((visit) => {
                if (statusFilter === "all") {
                    return true;
                }

                return visit.status === statusFilter;
            })
            .filter((visit) => {
                if (typeFilter === "all") {
                    return true;
                }

                return visit.type === typeFilter;
            })
            .filter((visit) => {
                if (resultFilter === "all") {
                    return true;
                }

                return visit.result === resultFilter;
            })
            .filter((visit) => {
                if (!normalizedSearch) {
                    return true;
                }

                const content = [
                    visit.location,
                    visit.meeting_point,
                    visit.report,
                    visit.observation,
                    visit.next_action,
                    visit.objections,
                ]
                    .filter(
                        (value): value is string =>
                            typeof value === "string" && value.length > 0
                    )
                    .join(" ")
                    .toLowerCase();

                return content.includes(normalizedSearch);
            });
    }, [
        myVisites,
        today,
        search,
        statusFilter,
        typeFilter,
        resultFilter,
    ]);


    const completedToday = todayVisits.filter(
        (visit) => visit.status === "completed"
    ).length;

    const plannedToday = todayVisits.filter(
        (visit) => visit.status === "planned"
    ).length;

    const withReport = myVisites.filter(
        (visit) =>
            visit.status === "completed" &&
            visit.report.trim().length > 0
    ).length;


    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
            <div className="mx-auto max-w-375 px-4 py-6 sm:px-6 lg:px-8">

                {/* HEADER */}

                <header className="mb-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex gap-4 items-center">
                            <Button onClick={() => router.back()} className="mb-1 flex items-center gap-2 text-sm">
                                <StepBack className="h-4 w-4" />
                                <span>
                                    Retour
                                </span>
                            </Button >

                            <h1 className="text-2xl font-bold tracking-tight">
                                Mes visites
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Suivez vos visites du jour
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                            >
                                <CalendarDays className="h-4 w-4" />
                                Aujourd'hui
                            </button>
                        </div>
                    </div>
                </header>

                {/* STATS */}

                <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <StatVisitCard
                        icon={<CalendarDays className="h-5 w-5" />}
                        label="Visites du jour"
                        value={todayVisits.length}
                    />

                    <StatVisitCard
                        icon={<Clock3 className="h-5 w-5" />}
                        label="À effectuer"
                        value={plannedToday}
                    />

                    <StatVisitCard
                        icon={<FileText className="h-5 w-5" />}
                        label="Rapports enregistrés"
                        value={withReport}
                    />
                </section>

                {/* TABS */}

                <div className="mb-5 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex gap-6">

                        <TabButton
                            active={activeTab === "today"}
                            onClick={() =>
                                setActiveTab("today")
                            }
                            icon={
                                <CalendarDays className="h-4 w-4" />
                            }
                            label="Aujourd'hui"
                            count={todayVisits.length}
                        />

                        <TabButton
                            active={activeTab === "history"}
                            onClick={() =>
                                setActiveTab("history")
                            }
                            icon={
                                <History className="h-4 w-4" />
                            }
                            label="Historique"
                            count={historyVisits.length}
                        />
                    </div>
                </div>

                {/* TODAY */}

                {activeTab === "today" && (
                    <section>

                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="font-semibold">
                                    Visites confirmées du jour
                                </h2>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Consultez rapidement vos visites et
                                    leurs rapports.
                                </p>
                            </div>

                            <FilterSelect
                                value={statusFilter}
                                onChange={(value) =>
                                    setStatusFilter(value)
                                }
                                options={[
                                    {
                                        value: "all",
                                        label: "Tous les statuts",
                                    },
                                    {
                                        value: "planned",
                                        label: "Planifiées",
                                    },
                                    {
                                        value: "completed",
                                        label: "Terminées",
                                    },
                                    {
                                        value: "cancelled",
                                        label: "Annulées",
                                    },
                                ]}
                            />
                        </div>

                        {todayVisits.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="space-y-3">
                                {todayVisits.map((visit) => (
                                    <TodayVisitCard
                                        key={visit.id}
                                        visit={visit}
                                        onReport={() =>
                                            setSelectedVisit(
                                                visit
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}

                    </section>
                )}

                {/* HISTORY */}

                {activeTab === "history" && (
                    <section>

                        {/* FILTERS */}

                        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                            <div className="mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" />

                                <h2 className="text-sm font-semibold">
                                    Filtrer l'historique
                                </h2>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">

                                {/* SEARCH */}

                                <div className="relative lg:col-span-2">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Rechercher une visite..."
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
                                    />
                                </div>

                                <FilterSelect
                                    value={statusFilter}
                                    onChange={(value) =>
                                        setStatusFilter(value)
                                    }
                                    options={[
                                        {
                                            value: "all",
                                            label: "Tous les statuts",
                                        },
                                        {
                                            value: "planned",
                                            label: "Planifiées",
                                        },
                                        {
                                            value: "completed",
                                            label: "Terminées",
                                        },
                                        {
                                            value: "cancelled",
                                            label: "Annulées",
                                        },
                                        {
                                            value: "postponed",
                                            label: "Reportées",
                                        },
                                    ]}
                                />

                                <FilterSelect
                                    value={typeFilter}
                                    onChange={(value) =>
                                        setTypeFilter(value)
                                    }
                                    options={[
                                        {
                                            value: "all",
                                            label: "Tous les types",
                                        },
                                        {
                                            value: "terrain",
                                            label: "Terrain",
                                        },
                                        {
                                            value: "bureau",
                                            label: "Bureau",
                                        },
                                        {
                                            value: "autre",
                                            label: "Autre",
                                        },
                                    ]}
                                />

                                <FilterSelect
                                    value={resultFilter}
                                    onChange={(value) =>
                                        setResultFilter(value)
                                    }
                                    options={[
                                        {
                                            value: "all",
                                            label: "Tous les résultats",
                                        },
                                        {
                                            value: "very_interested",
                                            label: "Très intéressé",
                                        },
                                        {
                                            value: "interested",
                                            label: "Intéressé",
                                        },
                                        {
                                            value: "not_interested",
                                            label: "Pas intéressé",
                                        },
                                        {
                                            value: "pending",
                                            label: "En attente",
                                        },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* HISTORY TABLE */}

                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[900px] text-sm">

                                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">

                                        <tr>
                                            <th className="px-5 py-3 text-left font-medium text-slate-500">
                                                Date
                                            </th>

                                            <th className="px-5 py-3 text-left font-medium text-slate-500">
                                                Visite
                                            </th>

                                            <th className="px-5 py-3 text-left font-medium text-slate-500">
                                                Type
                                            </th>

                                            <th className="px-5 py-3 text-left font-medium text-slate-500">
                                                Statut
                                            </th>

                                            <th className="px-5 py-3 text-left font-medium text-slate-500">
                                                Résultat
                                            </th>

                                            <th className="px-5 py-3 text-right font-medium text-slate-500">
                                                Action
                                            </th>
                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                                        {historyVisits.map(
                                            (visit) => (
                                                <HistoryRow
                                                    key={visit.id}
                                                    visit={visit}
                                                    onReport={() =>
                                                        setSelectedVisit(
                                                            visit
                                                        )
                                                    }
                                                />
                                            )
                                        )}

                                    </tbody>

                                </table>

                                {historyVisits.length === 0 && (
                                    <EmptyState />
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* REPORT DRAWER */}

            {selectedVisit && (
                <ReportDrawer
                    visit={selectedVisit}
                    onClose={() =>
                        setSelectedVisit(null)
                    }
                />
            )}
        </div>
    );
}

