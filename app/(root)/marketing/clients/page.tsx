// app/dashboard/marketing/clients/page.tsx

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/forms/table/DataTable";
import { clientColumns } from "@/components/shared/columns/ClientsColumn";

// features/clients/types/client.type.ts

export type ClientStatus =
    | "actif"
    | "en_negociation"
    | "reservation"
    | "paiement_en_cours"
    | "finalise"
    | "inactif";

export type ClientType = "particulier" | "entreprise" | "diaspora";

export type Client = {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    type: ClientType;
    status: ClientStatus;
    property: string;
    totalAmount?: number;
    amountPaid?: number;
    assignedTo?: string;
    lastActivityDate?: string;
    createdAt: string;
};

const clients: Client[] = [
    {
        id: "CL-001",
        fullName: "Jean Marc Tchinda",
        phone: "+237 699 000 111",
        email: "jeanmarc@email.com",
        type: "particulier",
        status: "paiement_en_cours",
        property: "Terrain à PK24",
        totalAmount: 4500000,
        amountPaid: 2500000,
        assignedTo: "Commercial 1",
        lastActivityDate: "2026-05-10",
        createdAt: "2026-05-09",
    },
    {
        id: "CL-002",
        fullName: "Nadia Fotso",
        phone: "+237 675 222 333",
        email: "nadia@email.com",
        type: "diaspora",
        status: "reservation",
        property: "Appartement meublé Bonamoussadi",
        totalAmount: 12000000,
        amountPaid: 3000000,
        assignedTo: "Commercial 2",
        lastActivityDate: "2026-05-11",
        createdAt: "2026-05-08",
    },
    {
        id: "CL-003",
        fullName: "Patrick Mvondo",
        phone: "+237 690 444 555",
        type: "entreprise",
        status: "finalise",
        property: "Terrain à Japoma",
        totalAmount: 6000000,
        amountPaid: 6000000,
        assignedTo: "Commercial 1",
        lastActivityDate: "2026-05-12",
        createdAt: "2026-05-07",
    },
    {
        id: "CL-004",
        fullName: "Grace Nguefack",
        phone: "+237 677 888 999",
        type: "particulier",
        status: "en_negociation",
        property: "Maison basse à Douala",
        totalAmount: 15000000,
        amountPaid: 0,
        assignedTo: "Commercial 3",
        lastActivityDate: "2026-05-09",
        createdAt: "2026-05-06",
    },
];

export default function ClientsPage() {
    const totalClients = clients.length;

    const activeClients = clients.filter(
        (client) =>
            client.status === "actif" ||
            client.status === "reservation" ||
            client.status === "paiement_en_cours"
    ).length;

    const finalizedClients = clients.filter(
        (client) => client.status === "finalise"
    ).length;

    const totalRevenue = clients.reduce((total, client) => {
        return total + (client.amountPaid ?? 0);
    }, 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XAF",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
                    <p className="text-sm text-muted-foreground">
                        Gérez les clients, les biens achetés, les paiements et le suivi
                        commercial.
                    </p>
                </div>

                <Button className="w-full md:w-auto">
                    <Link href="/dashboard/marketing/clients/create">
                        <Plus className="mr-2 size-4" />
                        Ajouter un client
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total clients</CardDescription>
                        <CardTitle className="text-2xl">{totalClients}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Clients actifs</CardDescription>
                        <CardTitle className="text-2xl">{activeClients}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Dossiers finalisés</CardDescription>
                        <CardTitle className="text-2xl">{finalizedClients}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Montant encaissé</CardDescription>
                        <CardTitle className="text-xl">
                            {formatCurrency(totalRevenue)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des clients</CardTitle>
                    <CardDescription>
                        Suivez chaque client après conversion : réservation, paiement,
                        acquisition et finalisation du dossier.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <DataTable
                        columns={clientColumns}
                        data={clients}
                        searchKey="fullName"
                        searchPlaceholder="Rechercher un client..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}