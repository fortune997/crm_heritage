// app/dashboard/marketing/prospects/page.tsx

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/forms/table/DataTable";
import { prospectColumns } from "@/components/shared/columns/ProspectColumns";


// features/prospects/types/prospect.type.ts

export type ProspectStatus =
    | "nouveau"
    | "contacte"
    | "interesse"
    | "visite_planifiee"
    | "converti"
    | "perdu";

export type ProspectPriority = "faible" | "moyenne" | "haute";

export type Prospect = {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    status: ProspectStatus;
    priority: ProspectPriority;
    source: string;
    interestedProperty: string;
    budget?: number;
    assignedTo?: string;
    createdAt: string;
};


const prospects: Prospect[] = [
    {
        id: "PR-001",
        fullName: "Jean Marc Tchinda",
        phone: "+237 699 000 111",
        email: "jeanmarc@email.com",
        source: "Facebook",
        status: "nouveau",
        priority: "haute",
        interestedProperty: "Terrain à PK24",
        budget: 4500000,
        assignedTo: "Commercial 1",
        createdAt: "2026-05-10",
    },
    {
        id: "PR-002",
        fullName: "Nadia Fotso",
        phone: "+237 675 222 333",
        source: "WhatsApp",
        status: "interesse",
        priority: "moyenne",
        interestedProperty: "Appartement meublé Bonamoussadi",
        budget: 250000,
        assignedTo: "Commercial 2",
        createdAt: "2026-05-11",
    },
];

export default function ProspectsPage() {
    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Prospects</h1>
                    <p className="text-sm text-muted-foreground">
                        Gérez les prospects, leurs statuts, leurs sources et leurs suivis
                        commerciaux.
                    </p>
                </div>

                <Button >
                    <Link href="/marketing/prospects/create">
                        <Plus className="mr-2 size-4" />
                        Ajouter un prospect
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-4 md:p-6">
                    <DataTable
                        columns={prospectColumns}
                        data={prospects}
                        searchKey="fullName"
                        searchPlaceholder="Rechercher un prospect..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}