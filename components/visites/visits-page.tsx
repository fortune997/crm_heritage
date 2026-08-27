"use client";

import React from 'react'

const PageCisit = () => {
    return (
        <div>PageCisit</div>
    )
}

export default PageCisit

/* 
import { useMemo, useState } from "react";

import { VisitsHeader } from "./visits-header";
import { VisitsTabs } from "./visits-tabs";
import { VisitsFilters } from "./visits-filters";
import { VisitsStats } from "./visits-stats";
import { VisitsTable } from "./visits-table";

import { CalendarSidebar } from "./calendar-sidebar";

import { useVisites } from "@/core/hooks/visites/useVisite";
import { Visit } from "@/core/types/visites/type";

export function VisitsPage() {
    const [view, setView] = useState<"list" | "calendar">("list");
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [commercial, setCommercial] = useState("");
    const [result, setResult] = useState("");
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [calendarCommercial, setCalendarCommercial] = useState("");
    const [calendarTypes, setCalendarTypes] = useState<string[]>([]);


    const { data: visitData, isLoading, isError, error } = useVisites();


    const visits = useMemo(() => {
        if (!visitData) return [];

        return visitData.map((visit: Visit) => ({
            id: visit.id,

            prospects: {
                id: visit.prospect_id,
                name:
                    visit.prospects?.full_name ??

                    "Prospect inconnu",

                phone:
                    visit.prospects?.phone ??

                    "-",
            },

            sites: visit.sites
                ? {
                    id: visit.sites.id,
                    name:
                        visit.sites.nom_titre ??
                        "Terrain sans nom",

                    city:
                        visit.sites.ville ??
                        "-",

                    /* address:
                        visit.sites.ad ??
                        "-", *

                    superficie_total:
                        visit.sites.superficie_total ??
                        "-",

                    prix_metre_carre:
                        visit.sites.prix_metre_carre ??
                        "-",

                    latitude:
                        visit.sites.latitude ??
                        null,

                    longitude:
                        visit.sites.longitude ??
                        null,

                    repere_connu:
                        visit.sites.repere_connu ??
                        "-",
                }
                : undefined,

            profiles: visit.profiles?.fullName
                ? {
                    id: visit.profiles.id,

                    full_name:
                        visit.profiles.fullName ??

                        "Commercial",

                    phone:
                        visit.profiles.phone ??
                        "",
                }
                : {
                    id: "",
                    fullName: "Non attribué",
                    phone: "",
                },

            profile: visit.profiles
                ? {
                    id: visit.profiles.id,

                    fullName:
                        visit.profiles.fullName ??
                        "-",
                }
                : undefined,

            type: visit.visit_type,

            status: visit.status,

            result: visit.result ?? "",

            date: visit.visit_date,

            startTime: visit.start_time,



            /*  location:
                 visit.location ?? "-",
 
             meetingPoint:
                 visit.meeting_point ?? "-", *

            purpose:
                visit.notes ?? "-",

            notes:
                visit.notes ?? "-",

            report:
                visit.report ?? "-",

            nextAction:
                visit.next_action ?? "-",

            nextActionDate:
                visit.next_action ?? null,

            created_at:
                visit.created_at,

            updated_at:
                visit.updated_at,
        }));
    }, [visitData]);

    const commercials = useMemo(() => {
        const map = new Map<
            string,
            {
                id: string;
                name: string;
            }
        >();

        visits.forEach((visit) => {
            if (visit.profiles?.id && visit.profiles?.fullName) {
                map.set(visit.profiles.id, {
                    id: visit.profiles.id,
                    name: visit.profiles.fullName,
                });
            }
        });

        return Array.from(map.values());
    }, [visits]);


    /*     const calendarVisits = useMemo(() => {
            return visits.filter((visit) => {
                const commercialMatch =
                    !calendarCommercial ||
                    visit.profiles?.id === calendarCommercial;
    
                const typeMatch =
                    calendarTypes.length === 0 ||
                    calendarTypes.includes(visit.type);
    
                return commercialMatch && typeMatch;
            });
        }, [
            visits,
            calendarCommercial,
            calendarTypes,
        ]); *


    const filteredVisits = useMemo(() => {
        return visits.filter((visit) => {
            // Recherche
            const searchValue = search.trim().toLowerCase();

            const searchMatch =
                !searchValue ||
                visit.prospects?.name
                    ?.toLowerCase()
                    .includes(searchValue)
            /* visit.prospects?.phone
                ?.toLowerCase()
                .includes(searchValue) ||
            visit.sites?.nom_titre
                ?.toLowerCase()
                .includes(searchValue) ||
            visit.profiles?.fullName
                ?.toLowerCase()
                .includes(searchValue); *

            // Type
            const typeMatch =
                !type ||
                visit.type === type;

            // Statut
            const statusMatch =
                !status ||
                visit.status === status;

            // Commercial
            const commercialMatch =
                !commercial ||
                visit.profiles?.id === commercial;

            // Résultat
            const resultMatch =
                !result ||
                visit.result === result;

            return (
                searchMatch &&
                typeMatch &&
                statusMatch &&
                commercialMatch &&
                resultMatch
            );
        });
    }, [
        visits,
        search,
        type,
        status,
        commercial,
        result,
    ]);

    /**
     * Reset filtres
     *
    function resetFilters() {
        setSearch("");
        setType("");
        setStatus("");
        setCommercial("");
        setResult("");
    }

 
    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted/20">
                <VisitsHeader />

                <main className="mx-auto max-w-450 space-y-5 p-4 md:p-6">
                    <div className="flex min-h-100 items-center justify-center">
                        <div className="text-sm text-muted-foreground">
                            Chargement des visites...
                        </div>
                    </div>
                </main>
            </div>
        );
    }


    if (isError) {
        return (
            <div className="min-h-screen bg-muted/20">
                <VisitsHeader />

                <main className="mx-auto max-w-450 space-y-5 p-4 md:p-6">
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                        <h2 className="font-semibold text-destructive">
                            Impossible de charger les visites
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {error instanceof Error
                                ? error.message
                                : "Une erreur est survenue."}
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <VisitsHeader />

            <main className="mx-auto max-w-450 space-y-5 p-4 md:p-6">

                {/* Tabs 
                <VisitsCalendar
                    visits={visitData}
                    date={calendarDate}
                    setDate={setCalendarDate}
                    commercial={calendarCommercial}
                    types={calendarTypes}
                />*

               
                {view === "list" && (
                    <div className="grid grid-cols-1 gap-5">
                        <div className="min-w-0 space-y-5">

                            <VisitsFilters
                                search={search}
                                setSearch={setSearch}

                                type={type}
                                setType={setType}

                                status={status}
                                setStatus={setStatus}

                                commercial={commercial}
                                setCommercial={setCommercial}

                                result={result}
                                setResult={setResult}

                                reset={resetFilters}
                            />

                            <VisitsStats
                                visits={filteredVisits}
                            />

                            <VisitsTable
                                visits={filteredVisits}
                            />

                        </div>
                    </div>
                )}

                
                {view === "calendar" && (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[240px_minmax(0,1fr)]">

                        <CalendarSidebar
                            date={calendarDate}
                            setDate={setCalendarDate}

                            commercial={calendarCommercial}
                            setCommercial={
                                setCalendarCommercial
                            }

                            selectedTypes={calendarTypes}
                            setSelectedTypes={
                                setCalendarTypes
                            }

                            commercials={commercials}
                        />

                        <VisitsCalendar
                            visits={visits}
                            date={calendarDate}
                            setDate={setCalendarDate}
                            commercial={calendarCommercial}
                            types={calendarTypes}
                        />



                    </div>
                )}
            </main>
        </div>
    );
} */