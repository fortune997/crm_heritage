"use client";

import { useMemo, useState } from "react";
import { CalendarDays, FileText, History, StepBack } from "lucide-react";
import { useRouter } from "next/navigation";

import EmptyState from "@/components/visites/EmptyState";
import ReportDrawer from "@/components/visites/ReportDrawer";
import TabButton from "@/components/visites/TabButton";
import TodayVisitCard from "@/components/visites/TodayVisitCard";
import { CommercialVisitStats } from "@/components/visites/commercial/CommercialVisitStats";
import { HistorySection } from "@/components/visites/commercial/HistorySection";
import { ReportsSection } from "@/components/visites/commercial/ReportsSection";
import type {
    CommercialVisit,
    VisitFilters,
    VisitPeriod,
    VisitStatusFilter,
} from "@/components/visites/commercial/types";
import {
    getReportDate,
    hasVisitReport,
    isInPeriod,
    matchesVisitFilters,
    normalizeDateKey,
    sortVisitsNewest,
    toLocalDateKey,
} from "@/components/visites/commercial/visit-date-utils";
import { VisitStatusDialog } from "@/components/visites/modale/visit-status-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useVisites } from "@/core/hooks/visites/useVisite";

type ActiveTab = "today" | "reports" | "history";
type VisitAction = "confirm" | "postpone";

const EMPTY_FILTERS: VisitFilters = {
    search: "",
    status: "all",
    type: "all",
    result: "all",
};

export default function CommercialVisitsPage() {
    const router = useRouter();
    const { profile } = useAuth();
    const { data: visitsData = [] } = useVisites();

    const now = useMemo(() => new Date(), []);
    const today = toLocalDateKey(now);
    const currentMonth = today.slice(0, 7);

    const [activeTab, setActiveTab] = useState<ActiveTab>("today");
    const [selectedVisit, setSelectedVisit] = useState<CommercialVisit | null>(null);
    const [selectedStatusVisit, setSelectedStatusVisit] = useState<CommercialVisit | null>(null);
    const [visitAction, setVisitAction] = useState<VisitAction | null>(null);
    const [todayStatus, setTodayStatus] = useState<VisitStatusFilter>("all");

    const [reportPeriod, setReportPeriod] = useState<VisitPeriod>("yesterday");
    const [reportDate, setReportDate] = useState(today);
    const [reportMonth, setReportMonth] = useState(currentMonth);
    const [reportFilters, setReportFilters] = useState<VisitFilters>(EMPTY_FILTERS);

    const [historyPeriod, setHistoryPeriod] = useState<VisitPeriod>("all");
    const [historyDate, setHistoryDate] = useState(today);
    const [historyMonth, setHistoryMonth] = useState(currentMonth);
    const [historyFilters, setHistoryFilters] = useState<VisitFilters>(EMPTY_FILTERS);

    const myVisits = visitsData as CommercialVisit[];

    const allTodayVisits = useMemo(
        () =>
            [...myVisits]
                .filter((visit) => normalizeDateKey(visit.visit_date) === today)
                .sort((left, right) =>
                    (left.start_time ?? "").localeCompare(right.start_time ?? "")
                ),
        [myVisits, today]
    );

    const todayVisits = useMemo(
        () =>
            allTodayVisits.filter(
                (visit) => todayStatus === "all" || visit.status === todayStatus
            ),
        [allTodayVisits, todayStatus]
    );

    const reports = useMemo(
        () =>
            sortVisitsNewest(
                myVisits
                    .filter(hasVisitReport)
                    .filter((visit) =>
                        isInPeriod(
                            getReportDate(visit),
                            reportPeriod,
                            reportDate,
                            reportMonth,
                            now
                        )
                    )
                    .filter((visit) => matchesVisitFilters(visit, reportFilters)),
                getReportDate
            ),
        [myVisits, reportPeriod, reportDate, reportMonth, reportFilters, now]
    );

    const historyVisits = useMemo(
        () =>
            sortVisitsNewest(
                myVisits
                    .filter((visit) =>
                        isInPeriod(
                            visit.visit_date,
                            historyPeriod,
                            historyDate,
                            historyMonth,
                            now
                        )
                    )
                    .filter((visit) => matchesVisitFilters(visit, historyFilters))
            ),
        [myVisits, historyPeriod, historyDate, historyMonth, historyFilters, now]
    );

    const yesterdayReportsCount = useMemo(
        () =>
            myVisits.filter(
                (visit) =>
                    hasVisitReport(visit) &&
                    isInPeriod(getReportDate(visit), "yesterday", today, currentMonth, now)
            ).length,
        [myVisits, today, currentMonth, now]
    );

    const weekReportsCount = useMemo(
        () =>
            myVisits.filter(
                (visit) =>
                    hasVisitReport(visit) &&
                    isInPeriod(getReportDate(visit), "week", today, currentMonth, now)
            ).length,
        [myVisits, today, currentMonth, now]
    );

    const remainingTodayCount = allTodayVisits.filter((visit) =>
        ["planned", "confirmed"].includes(visit.status)
    ).length;

    function openVisitStatusDialog(visit: CommercialVisit, action: VisitAction) {
        setSelectedStatusVisit(visit);
        setVisitAction(action);
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
            <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => router.back()}
                                aria-label="Retour"
                            >
                                <StepBack className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Visites et rapports
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                                    Suivez les rendez-vous du jour, consultez les rapports du
                                    topographe et retrouvez tout votre historique.
                                </p>
                            </div>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium dark:bg-slate-800">
                            <CalendarDays className="h-4 w-4" />
                            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(now)}
                        </div>
                    </div>
                </header>

                <CommercialVisitStats
                    todayCount={allTodayVisits.length}
                    remainingTodayCount={remainingTodayCount}
                    yesterdayReportsCount={yesterdayReportsCount}
                    weekReportsCount={weekReportsCount}
                />

                <div className="border-b border-slate-200 dark:border-slate-800">
                    <div className="flex gap-5 overflow-x-auto">
                        <TabButton
                            active={activeTab === "today"}
                            onClick={() => setActiveTab("today")}
                            icon={<CalendarDays className="h-4 w-4" />}
                            label="Aujourd’hui"
                            count={allTodayVisits.length}
                        />
                        <TabButton
                            active={activeTab === "reports"}
                            onClick={() => setActiveTab("reports")}
                            icon={<FileText className="h-4 w-4" />}
                            label="Rapports"
                            count={reports.length}
                        />
                        <TabButton
                            active={activeTab === "history"}
                            onClick={() => setActiveTab("history")}
                            icon={<History className="h-4 w-4" />}
                            label="Historique"
                            count={historyVisits.length}
                        />
                    </div>
                </div>

                {activeTab === "today" && (
                    <section className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Programme de la journée</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Les visites sont classées selon leur heure de départ.
                                </p>
                            </div>
                            <select
                                value={todayStatus}
                                onChange={(event) =>
                                    setTodayStatus(event.target.value as VisitStatusFilter)
                                }
                                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="planned">Planifiées</option>
                                <option value="confirmed">Confirmées</option>
                                <option value="completed">Terminées</option>
                                <option value="postponed">Reportées</option>
                                <option value="cancelled">Annulées</option>
                            </select>
                        </div>

                        {todayVisits.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                                <EmptyState />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {todayVisits.map((visit) => (
                                    <TodayVisitCard
                                        key={visit.id}
                                        visit={visit}
                                        onReport={() => setSelectedVisit(visit)}
                                        onConfirmVisit={() =>
                                            openVisitStatusDialog(visit, "confirm")
                                        }
                                        onPostponeVisit={() =>
                                            openVisitStatusDialog(visit, "postpone")
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === "reports" && (
                    <ReportsSection
                        visits={reports}
                        period={reportPeriod}
                        selectedDate={reportDate}
                        selectedMonth={reportMonth}
                        filters={reportFilters}
                        onPeriodChange={setReportPeriod}
                        onSelectedDateChange={setReportDate}
                        onSelectedMonthChange={setReportMonth}
                        onFiltersChange={setReportFilters}
                        onOpenReport={setSelectedVisit}
                    />
                )}

                {activeTab === "history" && (
                    <HistorySection
                        visits={historyVisits}
                        period={historyPeriod}
                        selectedDate={historyDate}
                        selectedMonth={historyMonth}
                        filters={historyFilters}
                        onPeriodChange={setHistoryPeriod}
                        onSelectedDateChange={setHistoryDate}
                        onSelectedMonthChange={setHistoryMonth}
                        onFiltersChange={setHistoryFilters}
                        onOpenReport={setSelectedVisit}
                    />
                )}
            </main>

            <VisitStatusDialog
                visit={selectedStatusVisit}
                action={visitAction}
                open={Boolean(selectedStatusVisit && visitAction)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedStatusVisit(null);
                        setVisitAction(null);
                    }
                }}
            />

            {selectedVisit && (
                <ReportDrawer
                    visit={selectedVisit}
                    onClose={() => setSelectedVisit(null)}
                />
            )}
        </div>
    );
}
