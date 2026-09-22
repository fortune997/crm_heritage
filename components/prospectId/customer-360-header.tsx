"use client";

import { Customer360 } from "@/core/types/prospectId/Customer360";
import { TProspects } from "@/core/types/prospects";
import {
    Calendar,
    ChevronDown,
    Mail,
    MapPin,
    MoreHorizontal,
    Pencil,
    Phone,
    Plus,
} from "lucide-react";
import { QualificationStatus } from "../status/QualificationStatus";



interface Props {
    customer?: TProspects;
}

export function Customer360Header({
    customer,
}: Props) {
    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground">
                Accueil / CRM /{" "}
                <span className="text-foreground">
                    Fiche client
                </span>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                {/* Identity */}
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt={customer?.full_name}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="truncate text-2xl font-bold tracking-tight">
                                {customer?.full_name}
                            </h1>

                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                {customer
                                    ? "PROSPECT"
                                    : "CLIENT"}
                            </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <a
                                href={`tel:${customer?.phone}`}
                                className="flex items-center gap-1.5 hover:text-primary"
                            >
                                <Phone className="h-4 w-4" />
                                {customer?.phone}
                            </a>

                          

                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                Douala
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    <QualificationStatus qualificationStatus={customer?.qualification} />

                    <button className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted">
                        <Pencil className="h-4 w-4" />
                        Modifier
                    </button>

                    <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            Nouvelle action
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}