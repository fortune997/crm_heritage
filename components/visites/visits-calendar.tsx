"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import {
    Visit,
    VisitStatus,
    VisitType,
} from "@/core/types/visites/type";

type CalendarView = "week" | "month" | "agenda";

interface VisitsCalendarProps {
    visits: Visit[];
    date: Date;
    setDate: (date: Date) => void;
    onSelectVisit?: (visit: Visit) => void;
}

interface StatusConfig {
    label: string;
    className: string;
}

const STATUS_CONFIG: Record<VisitStatus, StatusConfig> = {
    planned: {
        label: "Planifiée",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
    confirmed: {
        label: "Confirmée",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    completed: {
        label: "Effectuée",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
    cancelled: {
        label: "Annulée",
        className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    },
    postponed: {
        label: "Reportée",
        className: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
};

const TYPE_CONFIG: Record<VisitType, StatusConfig> = {
    terrain: {
        label: "Terrain",
        className: "bg-emerald-500",
    },
    bureau: {
        label: "Bureau",
        className: "bg-blue-500",
    },
    autre: {
        label: "Autre",
        className: "bg-slate-500",
    },
};

const DAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getMonday(date: Date): Date {
    const result = new Date(date);
    const weekday = result.getDay();
    result.setDate(result.getDate() + (weekday === 0 ? -6 : 1 - weekday));
    result.setHours(0, 0, 0, 0);
    return result;
}

function getDayVisits(visits: Visit[], day: Date): Visit[] {
    const targetDate = toDateKey(day);
    return visits
        .filter((visit) => visit.visit_date.slice(0, 10) === targetDate)
        .sort((first, second) => first.start_time.localeCompare(second.start_time));
}

function formatShortDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
    }).format(date);
}

function getPeriodTitle(date: Date, view: CalendarView): string {
    if (view === "month") {
        return new Intl.DateTimeFormat("fr-FR", {
            month: "long",
            year: "numeric",
        }).format(date);
    }

    if (view === "agenda") {
        return "Agenda des 30 prochains jours";
    }

    const firstDay = getMonday(date);
    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 6);

    return `${new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
    }).format(firstDay)} – ${new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(lastDay)}`;
}

function VisitStatusBadge({ status }: { status: VisitStatus }) {
    const config = STATUS_CONFIG[status];
    return (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.className}`}>
            {config.label}
        </span>
    );
}

function VisitCard({ visit, compact = false, onClick }: {
    visit: Visit;
    compact?: boolean;
    onClick?: () => void;
}) {
    const visitType: VisitType =
        visit.visit_type === "terrain" ||
            visit.visit_type === "bureau" ||
            visit.visit_type === "autre"
            ? visit.visit_type
            : "autre";
    const typeConfig = TYPE_CONFIG[visitType];

    if (compact) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="block w-full truncate rounded-md bg-primary/10 px-1.5 py-1 text-left text-[10px] transition hover:bg-primary/20"
            >
                <span className={`mr-1 inline-block h-2 w-2 rounded-full ${typeConfig.className}`} />
                <span className="font-semibold">{visit.start_time.slice(0, 5)}</span>{" "}
                {visit.prospects?.full_name ?? "Prospect"}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full rounded-lg border bg-background p-3 text-left shadow-sm transition hover:bg-muted/50"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                        {visit.prospects?.full_name ?? "Prospect non renseigné"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {visit.start_time.slice(0, 5)}
                        {visit.endTime ? ` – ${visit.endTime.slice(0, 5)}` : ""}
                    </p>
                </div>
                <VisitStatusBadge status={visit.status} />
            </div>
            <p className="mt-2 flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                {visit.sites?.nom_titre ?? visit.location ?? visit.meeting_point ?? "Lieu non renseigné"}
            </p>
        </button>
    );
}

function WeekView({ visits, date, onSelectVisit }: {
    visits: Visit[];
    date: Date;
    onSelectVisit?: (visit: Visit) => void;
}) {
    const weekStart = getMonday(date);
    const weekDays = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + index);
        return day;
    });

    return (
        <div className="min-w-[950px]">
            <div className="grid grid-cols-[70px_repeat(7,minmax(125px,1fr))] border-b">
                <div />
                {weekDays.map((day, index) => (
                    <div key={day.toISOString()} className="border-l px-2 py-3 text-center">
                        <p className="text-[10px] font-medium text-muted-foreground">{DAYS[index]}</p>
                        <p className="mt-1 text-sm font-semibold">{formatShortDate(day)}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[70px_repeat(7,minmax(125px,1fr))]">
                <div>
                    {HOURS.map((hour) => (
                        <div key={hour} className="h-20 border-b px-2 pt-2 text-[10px] text-muted-foreground">
                            {hour}
                        </div>
                    ))}
                </div>

                {weekDays.map((day) => (
                    <div key={day.toISOString()} className="relative border-l">
                        {HOURS.map((hour) => <div key={hour} className="h-20 border-b" />)}
                        {getDayVisits(visits, day).map((visit) => {
                            const hour = Number(visit.start_time.slice(0, 2));
                            const minutes = Number(visit.start_time.slice(3, 5));
                            const top = Math.max(0, ((hour - 8) * 60 + minutes) * (80 / 60));

                            return (
                                <div key={visit.id} className="absolute left-1 right-1 z-10" style={{ top }}>
                                    <VisitCard visit={visit} onClick={() => onSelectVisit?.(visit)} />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MonthView({ visits, date, setDate, onSelectVisit }: {
    visits: Visit[];
    date: Date;
    setDate: (date: Date) => void;
    onSelectVisit?: (visit: Visit) => void;
}) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptyCells = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const cells: Array<number | null> = [
        ...Array.from({ length: emptyCells }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    return (
        <div className="min-w-[760px] p-4">
            <div className="grid grid-cols-7 border-l border-t">
                {DAYS.map((day) => (
                    <div key={day} className="border-b border-r bg-muted/30 p-2 text-center text-xs font-semibold">
                        {day}
                    </div>
                ))}

                {cells.map((dayNumber, index) => {
                    if (dayNumber === null) {
                        return <div key={`empty-${index}`} className="min-h-32 border-b border-r bg-muted/10" />;
                    }

                    const currentDate = new Date(year, month, dayNumber);
                    const dayVisits = getDayVisits(visits, currentDate);

                    return (
                        <div key={dayNumber} className="min-h-32 border-b border-r p-2 hover:bg-muted/20">
                            <button type="button" onClick={() => setDate(currentDate)} className="mb-2 text-xs font-semibold">
                                {dayNumber}
                            </button>
                            <div className="space-y-1">
                                {dayVisits.slice(0, 3).map((visit) => (
                                    <VisitCard
                                        key={visit.id}
                                        visit={visit}
                                        compact
                                        onClick={() => onSelectVisit?.(visit)}
                                    />
                                ))}
                                {dayVisits.length > 3 && (
                                    <p className="text-[10px] text-muted-foreground">+{dayVisits.length - 3} autres</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function AgendaView({ visits, date, onSelectVisit }: {
    visits: Visit[];
    date: Date;
    onSelectVisit?: (visit: Visit) => void;
}) {
    const groupedVisits = useMemo(() => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 30);

        const groups: Record<string, Visit[]> = {};
        visits
            .filter((visit) => {
                const visitDate = new Date(`${visit.visit_date.slice(0, 10)}T${visit.start_time}`);
                return visitDate >= start && visitDate <= end;
            })
            .sort((first, second) => {
                const firstValue = `${first.visit_date} ${first.start_time}`;
                const secondValue = `${second.visit_date} ${second.start_time}`;
                return firstValue.localeCompare(secondValue);
            })
            .forEach((visit) => {
                const key = visit.visit_date.slice(0, 10);
                groups[key] ??= [];
                groups[key].push(visit);
            });

        return groups;
    }, [visits, date]);

    const entries = Object.entries(groupedVisits);
    if (entries.length === 0) {
        return <div className="flex min-h-96 items-center justify-center p-6 text-sm text-muted-foreground">Aucune visite dans les 30 prochains jours.</div>;
    }

    return (
        <div className="divide-y">
            {entries.map(([dateKey, dayVisits]) => {
                const currentDate = new Date(`${dateKey}T00:00:00`);
                return (
                    <section key={dateKey} className="grid gap-4 p-4 md:grid-cols-[180px_1fr]">
                        <div>
                            <p className="text-sm font-semibold capitalize">
                                {new Intl.DateTimeFormat("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                }).format(currentDate)}
                            </p>
                            <p className="text-xs text-muted-foreground">{dayVisits.length} visite(s)</p>
                        </div>
                        <div className="grid gap-3 lg:grid-cols-2">
                            {dayVisits.map((visit) => (
                                <VisitCard key={visit.id} visit={visit} onClick={() => onSelectVisit?.(visit)} />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

export function VisitsCalendar({ visits, date, setDate, onSelectVisit }: VisitsCalendarProps) {
    const [viewMode, setViewMode] = useState<CalendarView>("week");

    function changePeriod(direction: -1 | 1): void {
        const nextDate = new Date(date);
        if (viewMode === "month") {
            nextDate.setMonth(nextDate.getMonth() + direction);
        } else if (viewMode === "agenda") {
            nextDate.setDate(nextDate.getDate() + 30 * direction);
        } else {
            nextDate.setDate(nextDate.getDate() + 7 * direction);
        }
        setDate(nextDate);
    }

    return (
        <section className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <header className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2">
                    <button type="button" aria-label="Période précédente" onClick={() => changePeriod(-1)} className="rounded-lg border p-2 hover:bg-muted">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Période suivante" onClick={() => changePeriod(1)} className="rounded-lg border p-2 hover:bg-muted">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setDate(new Date())} className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted">
                        Aujourd’hui
                    </button>
                </div>

                <h2 className="text-center text-sm font-semibold capitalize sm:text-base">
                    {getPeriodTitle(date, viewMode)}
                </h2>

                <div className="flex rounded-lg border p-1">
                    {(["week", "month", "agenda"] as const).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setViewMode(mode)}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${viewMode === mode ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                }`}
                        >
                            {mode === "week" ? "Semaine" : mode === "month" ? "Mois" : "Agenda"}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto">
                {viewMode === "week" && <WeekView visits={visits} date={date} onSelectVisit={onSelectVisit} />}
                {viewMode === "month" && <MonthView visits={visits} date={date} setDate={setDate} onSelectVisit={onSelectVisit} />}
                {viewMode === "agenda" && <AgendaView visits={visits} date={date} onSelectVisit={onSelectVisit} />}
            </div>

            <footer className="flex flex-wrap gap-4 border-t p-4 text-xs">
                {(Object.entries(TYPE_CONFIG) as Array<[VisitType, StatusConfig]>).map(([type, config]) => (
                    <span key={type} className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${config.className}`} />
                        {config.label}
                    </span>
                ))}
            </footer>
        </section>
    );
}
