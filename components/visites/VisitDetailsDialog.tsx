"use client";

import {
    CalendarDays,
    Clock,
    MapPin,
    Phone,
    User,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ProspectActivity } from "@/core/types/activities";
import { Visit } from "@/core/types/visites/type";

export type VisitStatus =
    | "planned"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "postponed";

export type VisitType =
    | "terrain"
    | "bureau"
    | "autre";

export interface VisitDetails {
    id: string;
    date: string;
    time?: string | null;
    type: VisitType;
    status: VisitStatus;
    notes?: string | null;

    prospects?: {
        fullname: string;
        phone: string;
    } | null;

    sites?: {
        nom_titre: string;
    } | null;
}

interface VisitDetailsDialogProps {
    visit: Visit;
}

const statusLabels: Record<VisitStatus, string> = {
    planned: "Planifiée",
    confirmed: "Confirmée",
    completed: "Terminée",
    cancelled: "Annulée",
    postponed: "Reportée",
};

const typeLabels: Record<VisitType, string> = {
    terrain: "Terrain",
    bureau: "Bureau",
    autre: "Autre",
};

export function VisitDetailsDialog({
    visit,
}: VisitDetailsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger >
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                >
                    Voir les détails
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Détails de la visite
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5">
                    {/* Prospect */}
                    <div className="rounded-lg border p-4">
                        <h3 className="mb-3 text-sm font-semibold">
                            Prospect
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="size-4 text-muted-foreground" />

                                <div>
                                    <p className="text-sm font-medium">
                                        {visit.prospects?.full_name ??
                                            "Prospect inconnu"}
                                    </p>

                                    {visit.prospects?.phone && (
                                        <p className="text-xs text-muted-foreground">
                                            {visit.prospects.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {visit.prospects?.phone && (
                                <a
                                    href={`tel:${visit.prospects.phone}`}
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <Phone className="size-4" />
                                    Appeler le prospect
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Visite */}
                    <div className="rounded-lg border p-4">
                        <h3 className="mb-3 text-sm font-semibold">
                            Informations de la visite
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <CalendarDays className="size-4 text-muted-foreground" />

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Date
                                    </p>
                                    <p className="text-sm font-medium">
                                        {visit.created_at}
                                    </p>
                                </div>
                            </div>

                            {visit.startTime && (
                                <div className="flex items-center gap-3">
                                    <Clock className="size-4 text-muted-foreground" />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Heure
                                        </p>
                                        <p className="text-sm font-medium">
                                            {visit.startTime}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Type
                                </p>
                                <p className="text-sm font-medium">
                                    {typeLabels[visit.type]}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Statut
                                </p>
                                <p className="text-sm font-medium">
                                    {statusLabels[visit.status]}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Site */}
                    <div className="rounded-lg border p-4">
                        <h3 className="mb-3 text-sm font-semibold">
                            Site
                        </h3>

                        <div className="flex items-center gap-3">
                            <MapPin className="size-4 text-muted-foreground" />

                            <p className="text-sm font-medium">
                                {visit.sites?.nom_titre ??
                                    "Aucun site associé"}
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    {visit.notes && (
                        <div className="rounded-lg border p-4">
                            <h3 className="mb-2 text-sm font-semibold">
                                Notes
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                {visit.notes}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}