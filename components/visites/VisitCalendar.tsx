// components/visits/visits-calendar.tsx

"use client";

import { useMemo } from "react";
import {
    Calendar,
    dateFnsLocalizer,
    EventProps,
    View,
} from "react-big-calendar";
import {
    format,
    getDay,
    parse,
    startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Visit } from "@/core/types/visites/type";

const locales = {
    fr,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (
        date: Date
    ) => startOfWeek(date, {
        weekStartsOn: 1,
    }),
    getDay,
    locales,
});

export interface VisitCalendarEvent {
    id: string;
    title: string;
    start: Date;

    resource: Visit;
}

interface VisitsCalendarProps {
    visits: Visit[];
    view: View;
    onViewChange: (view: View) => void;
    onSelectVisit?: (visit: Visit) => void;
}

function createVisitDate(
    date: string,
    time: string | null,
    fallbackTime: string
): Date {
    const selectedTime = time ?? fallbackTime;

    return new Date(
        `${date}T${selectedTime}`
    );
}

function CalendarEvent({
    event,
}: EventProps<VisitCalendarEvent>) {
    return (
        <div className="overflow-hidden text-xs">
            <p className="truncate font-semibold">
                {event.title}
            </p>

            <p className="truncate opacity-80">
                {event.resource.sites?.nom_titre ??
                    "Site non renseigné"}
            </p>
        </div>
    );
}

export function VisitsCalendar({
    visits,
    view,
    onViewChange,
    onSelectVisit,
}: VisitsCalendarProps) {
    const events =
        useMemo<VisitCalendarEvent[]>(() => {
            return visits.map((visit) => ({
                id: visit.id,

                title:
                    visit.prospects?.full_name ??
                    "Visite sans prospect",

                start: createVisitDate(
                    visit.visit_date,
                    visit.start_time,
                    "08:00:00"
                ),



                resource: visit,
            }));
        }, [visits]);

    return (
        <div className="visit-calendar h-180 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <Calendar<VisitCalendarEvent>
                localizer={localizer}
                events={events}
                view={view}
                onView={onViewChange}
                views={[
                    "month",
                    "week",
                    "agenda",
                ]}
                startAccessor="start"

                culture="fr"
                popup
                selectable
                onSelectEvent={(event) =>
                    onSelectVisit?.(
                        event.resource
                    )
                }
                components={{
                    event: CalendarEvent,
                }}
                messages={{
                    today: "Aujourd’hui",
                    previous: "Précédent",
                    next: "Suivant",
                    month: "Mois",
                    week: "Semaine",
                    agenda: "Agenda",
                    date: "Date",
                    time: "Heure",
                    event: "Visite",
                    noEventsInRange:
                        "Aucune visite sur cette période",
                    showMore: (total) =>
                        `+ ${total} visite(s)`,
                }}
            />
        </div>
    );
}