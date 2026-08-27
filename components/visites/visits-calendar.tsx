/* "use client";

import { Visit } from "@/core/types/visites/type";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { CalendarEvent } from "./calendar-event";
import { useMemo, useState } from "react";
import { AgendaVisit } from "./AgendaVisit";

interface Props {
    visits?: Visit[];
    date: Date;
    setDate: (date: Date) => void;
    commercial: string;
    types: string[],
}

const DAYS = [
    "Lun.",
    "Mar.",
    "Mer.",
    "Jeu.",
    "Ven.",
    "Sam.",
    "Dim.",
];

const HOURS = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
];

const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];

export function VisitsCalendar({
    visits,
    date,
    setDate,
    commercial,
    types,
}: Props) {

    const weekStart = getMonday(date);
    const [viewMode, setViewMode] = useState<"week" | "month" | "agenda">(
        "week"
    );

    const filteredVisits = useMemo(() => {
        return visits?.filter((visit) => {
            const commercialMatch =
                !commercial ||
                visit.profiles?.id === commercial;

            const typeMatch =
                types.length === 0 ||
                types.includes(visit.type);

            return (
                commercialMatch &&
                typeMatch
            );
        });
    }, [
        visits,
        commercial,
        types,
    ]);

    /**
     * Les 7 jours de la semaine
     
    const weekDays = Array.from(
        { length: 7 },
        (_, index) => {
            const day = new Date(weekStart);

            day.setDate(
                weekStart.getDate() + index
            );

            return day;
        }
    );



    /**
     * Retour aujourd'hui
     
    function goToToday() {
        setDate(new Date());
    }

    function goNext() {
        const newDate =
            new Date(date);

        if (viewMode === "week") {
            newDate.setDate(
                newDate.getDate() + 7
            );
        }

        if (viewMode === "month") {
            newDate.setMonth(
                newDate.getMonth() + 1
            );
        }

        if (viewMode === "agenda") {
            newDate.setDate(
                newDate.getDate() + 7
            );
        }

        setDate(newDate);
    }

    function goPrevious() {
        const newDate =
            new Date(date);

        if (viewMode === "week") {
            newDate.setDate(
                newDate.getDate() - 7
            );
        }

        if (viewMode === "month") {
            newDate.setMonth(
                newDate.getMonth() - 1
            );
        }

        if (viewMode === "agenda") {
            newDate.setDate(
                newDate.getDate() - 7
            );
        }

        setDate(newDate);
    }

    function AgendaView({
        visits,
    }: {
        visits?: Visit[];
    }) {
        const upcomingVisits =
            getUpcomingVisits(
                visits,
                30
            );

        if (!upcomingVisits) return <p>Pas de visite </p>

        if (upcomingVisits.length === 0) {
            return (
                <div className="flex min-h-[400px] items-center justify-center p-6">
                    <div className="text-center">
                        <p className="font-medium">
                            Aucune visite à venir
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Aucune visite prévue
                            dans les 30 prochains
                            jours.
                        </p>
                    </div>
                </div>
            );
        }

  
        const groupedVisits =
            upcomingVisits.reduce<
                Record<string, Visit[]>
            >((groups, visit) => {
                if (!groups[visit.date]) {
                    groups[visit.date] = [];
                }

                groups[visit.date].push(
                    visit
                );

                return groups;
            }, {});

        return (
            <div className="divide-y">

                {Object.entries(
                    groupedVisits
                ).map(
                    ([
                        date,
                        dayVisits,
                    ]) => {
                        const dateObject =
                            new Date(
                                `${date}T00:00:00`
                            );

                        return (
                            <div
                                key={date}
                                className="p-4"
                            >

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <span className="text-[9px] uppercase">
                                            {dateObject.toLocaleDateString(
                                                "fr-FR",
                                                {
                                                    weekday:
                                                        "short",
                                                }
                                            )}
                                        </span>

                                        <span className="text-sm font-bold">
                                            {dateObject.getDate()}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            {dateObject.toLocaleDateString(
                                                "fr-FR",
                                                {
                                                    weekday:
                                                        "long",
                                                    day: "numeric",
                                                    month: "long",
                                                }
                                            )}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {
                                                dayVisits.length
                                            }{" "}
                                            visite
                                            {dayVisits.length >
                                                1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>
                                </div>

                               
                                <div className="space-y-3">

                                    {dayVisits.map(
                                        (
                                            visit
                                        ) => (
                                            <AgendaVisit
                                                key={
                                                    visit.id
                                                }
                                                visit={
                                                    visit
                                                }
                                            />
                                        )
                                    )}

                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        );
    }

    function getUpcomingVisits(
        visits?: Visit[],
        days = 30
    ) {
        const now = new Date();

        const endDate = new Date(now);

        endDate.setDate(
            endDate.getDate() + days
        );

        endDate.setHours(
            23,
            59,
            59,
            999
        );

        return visits?.filter((visit) => {
            if (!visit.date) {
                return false;
            }

            const visitDate = new Date(
                `${visit.date}T${visit.startTime ?? "00:00"
                }`
            );

            return (
                visitDate >= now &&
                visitDate <= endDate
            );
        })
            .sort((a, b) => {
                const dateA = new Date(
                    `${a.date}T${a.startTime ?? "00:00"
                    }`
                );

                const dateB = new Date(
                    `${b.date}T${b.startTime ?? "00:00"
                    }`
                );

                return (
                    dateA.getTime() -
                    dateB.getTime()
                );
            });
    }




 
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];

    const rangeTitle =
        firstDay.getMonth() ===
            lastDay.getMonth()
            ? `${firstDay.getDate()} – ${lastDay.getDate()} ${MONTHS[firstDay.getMonth()]
            } ${firstDay.getFullYear()}`
            : `${firstDay.getDate()} ${MONTHS[firstDay.getMonth()]
            } – ${lastDay.getDate()} ${MONTHS[lastDay.getMonth()]
            } ${lastDay.getFullYear()}`;

    return (
        <section className="overflow-hidden rounded-xl border bg-card">

            
            <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Navigation 
                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={goPrevious}
                        className="rounded-lg border p-2 hover:bg-muted"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={goNext}
                        className="rounded-lg border p-2 hover:bg-muted"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={goToToday}
                        className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"
                    >
                        Aujourd'hui
                    </button>

                </div>

                {/* Titre *
                <h2 className="text-center text-sm font-semibold sm:text-base">
                    {rangeTitle}
                </h2>

                {/* Vue *
                <button
                    type="button"
                    onClick={() =>
                        setViewMode("week")
                    }
                    className={
                        viewMode === "week"
                            ? "rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                            : "rounded-md border px-3 py-2 text-xs hover:bg-muted"
                    }
                >
                    Semaine
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setViewMode("month")
                    }
                    className={
                        viewMode === "month"
                            ? "rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                            : "rounded-md border px-3 py-2 text-xs hover:bg-muted"
                    }
                >
                    Mois
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setViewMode("agenda")
                    }
                    className={
                        viewMode === "agenda"
                            ? "rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                            : "rounded-md border px-3 py-2 text-xs hover:bg-muted"
                    }
                >
                    Agenda
                </button>
            </div>

            
            <div className="overflow-x-auto">

                {viewMode === "week" && (
                    <WeekView
                        visits={filteredVisits}
                        date={date}
                    />
                )}

                {viewMode === "month" && (
                    <MonthView
                        visits={filteredVisits}
                        date={date}
                        setDate={setDate}
                    />
                )}

                {viewMode === "agenda" && (
                    <AgendaView
                        visits={filteredVisits}
                    />
                )}
            </div>

            {/* Legend *
            <div className="flex flex-wrap gap-4 border-t p-4 text-xs">

                <Legend
                    color="bg-emerald-500"
                    label="Visite terrain"
                />

                <Legend
                    color="bg-blue-500"
                    label="Visite bureau"
                />

                <Legend
                    color="bg-purple-500"
                    label="Appel"
                />

                <Legend
                    color="bg-orange-500"
                    label="Visio"
                />

                <Legend
                    color="bg-gray-400"
                    label="Autre"
                />

            </div>

        </section>
    );
}


function getMonday(
    date: Date
) {
    const result = new Date(date);

    const day = result.getDay();

    const diff =
        day === 0
            ? -6
            : 1 - day;

    result.setDate(
        result.getDate() + diff
    );

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}

function WeekView({
    visits,
    date,
}: {
    visits?: Visit[];
    date: Date;
}) {
    const weekStart = getMonday(date);

    const weekDays = Array.from(
        { length: 7 },
        (_, index) => {
            const day = new Date(
                weekStart
            );

            day.setDate(
                weekStart.getDate() + index
            );

            return day;
        }
    );

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[900px]">

              
                <div className="grid grid-cols-[70px_repeat(7,minmax(120px,1fr))] border-b">

                    <div />

                    {weekDays.map(
                        (day, index) => (
                            <div
                                key={day.toISOString()}
                                className="border-l px-2 py-3 text-center"
                            >
                                <p className="text-[10px] font-medium text-muted-foreground">
                                    {DAYS[index]}
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {formatDayDate(
                                        day
                                    )}
                                </p>
                            </div>
                        )
                    )}
                </div>

                {/
                <div className="relative grid grid-cols-[70px_repeat(7,minmax(120px,1fr))]">

                   
                    <div>
                        {HOURS.map(
                            (hour) => (
                                <div
                                    key={hour}
                                    className="h-20 border-b px-2 pt-2 text-[10px] text-muted-foreground"
                                >
                                    {hour}
                                </div>
                            )
                        )}
                    </div>

                    {weekDays.map(
                        (day) => (
                            <div
                                key={day.toISOString()}
                                className="relative border-l"
                            >
                                {HOURS.map(
                                    (hour) => (
                                        <div
                                            key={hour}
                                            className="h-20 border-b"
                                        />
                                    )
                                )}

                                {getDayVisits(
                                    visits,
                                    day
                                ).map(
                                    (visit) => (
                                        <CalendarEvent
                                            key={
                                                visit.id
                                            }
                                            visit={
                                                visit
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

function formatDayDate(
    day: Date
) {
    return `${String(
        day.getDate()
    ).padStart(2, "0")}/${String(
        day.getMonth() + 1
    ).padStart(2, "0")}`;
}


function MonthView({
    visits,
    date,
    setDate,
}: {
    visits?: Visit[];
    date: Date;
    setDate: (date: Date) => void;
}) {
    const year =
        date.getFullYear();

    const month =
        date.getMonth();

    const firstDay = new Date(
        year,
        month,
        1
    );

    const lastDay = new Date(
        year,
        month + 1,
        0
    );

    const startDay =
        firstDay.getDay() === 0
            ? 6
            : firstDay.getDay() - 1;

    const daysInMonth =
        lastDay.getDate();

    const calendarDays = [
        ...Array(startDay).fill(null),
        ...Array.from(
            {
                length: daysInMonth,
            },
            (_, i) => i + 1
        ),
    ];

    return (
        <div className="p-4">

           
            <div className="grid grid-cols-7 border-l border-t">

                {DAYS.map((day) => (
                    <div
                        key={day}
                        className="border-b border-r bg-muted/30 p-2 text-center text-xs font-semibold"
                    >
                        {day}
                    </div>
                ))}

                {calendarDays.map(
                    (day, index) => {

                        if (day === null) {
                            return (
                                <div
                                    key={`empty-${index}`}
                                    className="min-h-30 border-b border-r bg-muted/5"
                                />
                            );
                        }

                        const currentDate =
                            new Date(
                                year,
                                month,
                                day
                            );

                        const dayVisits =
                            getDayVisits(
                                visits,
                                currentDate
                            );

                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() =>
                                    setDate(
                                        currentDate
                                    )
                                }
                                className="min-h-30 border-b border-r p-2 text-left align-top hover:bg-muted/30"
                            >
                                <div className="mb-2 flex justify-between">
                                    <span className="text-xs font-semibold">
                                        {day}
                                    </span>

                                    {dayVisits.length >
                                        0 && (
                                            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] text-primary-foreground">
                                                {
                                                    dayVisits.length
                                                }
                                            </span>
                                        )}
                                </div>

                                <div className="space-y-1">
                                    {dayVisits
                                        .slice(
                                            0,
                                            3
                                        )
                                        .map(
                                            (
                                                visit
                                            ) => (
                                                <div
                                                    key={
                                                        visit.id
                                                    }
                                                    className="truncate rounded bg-primary/10 px-1.5 py-1 text-[10px]"
                                                >
                                                    <span className="font-semibold">
                                                        {visit.startTime?.slice(
                                                            0,
                                                            5
                                                        )}
                                                    </span>

                                                    {" "}

                                                    {visit
                                                        .prospects
                                                        ?.full_name ??
                                                        "Prospect"}
                                                </div>
                                            )
                                        )}

                                    {dayVisits.length >
                                        3 && (
                                            <div className="text-[10px] text-muted-foreground">
                                                +
                                                {dayVisits.length -
                                                    3}{" "}
                                                autres
                                            </div>
                                        )}
                                </div>
                            </button>
                        );
                    }
                )}
            </div>
        </div>
    );
}


function getDayVisits(
    day: Date,
    visits?: Visit[]

) {
    const year =
        day.getFullYear();

    const month = String(
        day.getMonth() + 1
    ).padStart(2, "0");

    const date = String(
        day.getDate()
    ).padStart(2, "0");

    const targetDate =
        `${year}-${month}-${date}`;

    return visits?.filter(
        (visit) =>
            visit.date === targetDate
    );
}


function isToday(
    date: Date
) {
    const today = new Date();

    return (
        date.getDate() ===
        today.getDate() &&
        date.getMonth() ===
        today.getMonth() &&
        date.getFullYear() ===
        today.getFullYear()
    );
}


function Legend({
    color,
    label,
}: {
    color: string;
    label: string;
}) {
    return (
        <span className="flex items-center gap-2">

            <span
                className={`h-2.5 w-2.5 rounded-full ${color}`}
            />

            {label}

        </span>
    );
}

function AgendaView({
    visits,
    date,
}: {
    visits?: Visit[];
    date: Date;
}) {
    const sortedVisits =
        [...visits].sort(
            (a, b) => {
                const dateA =
                    `${a.date} ${a.startTime ?? ""}`;

                const dateB =
                    `${b.date} ${b.startTime ?? ""}`;

                return dateA.localeCompare(
                    dateB
                );
            }
        );

    if (sortedVisits.length === 0) {
        return (
            <div className="flex min-h-100 items-center justify-center p-6">
                <div className="text-center">
                    <p className="font-medium">
                        Aucune visite
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Aucune visite ne correspond
                        aux filtres actuels.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="divide-y">

            {sortedVisits.map(
                (visit) => (
                    <div
                        key={visit.id}
                        className="flex flex-col gap-4 p-4 transition hover:bg-muted/30 md:flex-row md:items-start"
                    >

                     
                        <div className="w-24 shrink-0">
                            <p className="text-sm font-semibold">
                                {visit.startTime?.slice(
                                    0,
                                    5
                                ) ??
                                    "--:--"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {visit.endTime
                                    ? visit.endTime.slice(
                                        0,
                                        5
                                    )
                                    : ""}
                            </p>
                        </div>

                        
                        <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                                <h3 className="font-semibold">
                                    {
                                        visit
                                            .prospects
                                            ?.full_name
                                    }
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

                            <p className="mt-1 text-sm text-muted-foreground">
                                {visit.sites
                                    ?.nom_titre ??
                                    "Aucun terrain"}
                            </p>

                            <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">

                                <div>
                                    <span className="font-medium text-foreground">
                                        Commercial :
                                    </span>{" "}
                                    {
                                        visit
                                            .profiles
                                            ?.fullName
                                    }
                                </div>

                                <div>
                                    <span className="font-medium text-foreground">
                                        Téléphone :
                                    </span>{" "}
                                    {
                                        visit
                                            .prospects
                                            ?.phone
                                    }
                                </div>

                                {visit.location && (
                                    <div>
                                        <span className="font-medium text-foreground">
                                            Lieu :
                                        </span>{" "}
                                        {
                                            visit.location
                                        }
                                    </div>
                                )}
                            </div>

                            {visit.notes && (
                                <p className="mt-3 rounded-lg bg-muted/50 p-3 text-xs">
                                    {
                                        visit.notes
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                )
            )}

        </div>
    );
}

function VisitTypeBadge({
    type,
}: {
    type?: string;
}) {
    const labels: Record<
        string,
        string
    > = {
        terrain: "Terrain",
        bureau: "Bureau",
        phone: "Téléphone",
        video: "Visio",
        other: "Autre",
    };

    return (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
            {labels[type ?? ""] ??
                "Autre"}
        </span>
    );
}

function StatusBadge({
    status,
}: {
    status?: string;
}) {
    const labels: Record<
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
        <span className="rounded-full border px-2 py-0.5 text-[10px]">
            {labels[status ?? ""] ??
                status ??
                "—"}
        </span>
    );
}

 */



const visitCalendar = () => {
    return (
        <div>visits-calenC</div>
    )
}

export default visitCalendar