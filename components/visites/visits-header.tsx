"use client";

import {
    Bell,
    CalendarPlus,
    Menu,
    Search,
} from "lucide-react";
import { useState } from "react";
import { ScheduleVisitDialog } from "./schedule-visit-dialog";



export function VisitsHeader() {
    const [scheduleDialogOpen, setScheduleDialogOpen] =
        useState(false);
    return (
        <header className="border-b bg-background">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <button className="rounded-lg p-2 hover:bg-muted lg:hidden">
                        <Menu className="h-5 w-5" />
                    </button>

                    <div>
                        <h1 className="text-xl font-bold">
                            Visites
                        </h1>

                        <p className="hidden text-xs text-muted-foreground sm:block">
                            Gestion des Visites
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">

                    <button
                        onClick={() => setScheduleDialogOpen(true)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                        <CalendarPlus className="h-4 w-4" />

                        <span className="hidden sm:inline">
                            Planifier une visite
                        </span>
                    </button>
                </div>
            </div>
            <ScheduleVisitDialog
                open={scheduleDialogOpen}
                onOpenChange={setScheduleDialogOpen}
                onSuccess={() => {
                    // ici tu peux invalider React Query
                    // ou recharger les visites
                }}
            />
        </header>
    );
}