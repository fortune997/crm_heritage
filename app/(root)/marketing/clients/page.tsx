// app/marketing/clients/page.tsx

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertCircle, RefreshCcw, UserRoundPlus } from "lucide-react";

import { ProspectTableSkeleton } from "@/components/cards/ProspectTableSkeleton";
import { DataTable } from "@/components/forms/table/DataTable";
import {
    clientColumns,
    type Client,
    type ClientStatus,
} from "@/components/shared/columns/ClientsColumn";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useClients } from "@/core/hooks/clients/useClients";
import type { MarketingClientRecord } from "@/core/services/clients/clients-service";

const activeStatuses = new Set(["actif", "reservation", "paiement_en_cours"]);

function getDisplayStatus(status?: string | null): ClientStatus {
    return status?.trim() || "actif";
}

function getClientProperty(client: MarketingClientRecord) {
    return (
        client.prospect?.sites?.nom_titre ??
        client.prospect?.site_interesse ??
        client.prospect?.interest_type ??
        null
    );
}

function toClientRow(client: MarketingClientRecord): Client {
    return {
        id: client.id,
        prospectId: client.prospect_id,
        reference: client.reference,
        fullName:
            client.prospect?.full_name ??
            client.reference ??
            "Client sans nom",
        phone: client.prospect?.phone,
        email: client.prospect?.email,
        type: client.prospect?.interest_type,
        status: getDisplayStatus(client.status),
        property: getClientProperty(client),
        source: client.prospect?.canal_prospection,
        assignedTo: client.prospect?.profiles?.full_name,
        convertedAt: client.converted_at,
        createdAt: client.created_at,
        updatedAt: client.updated_at,
        notes: client.notes,
    };
}

function isRecentConversion(client: Client) {
    const convertedAt = new Date(client.convertedAt ?? client.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return convertedAt >= thirtyDaysAgo;
}

export default function ClientsPage() {
    const {
        data: clientRecords = [],
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useClients();

    const clients = useMemo(
        () => clientRecords.map(toClientRow),
        [clientRecords]
    );

    const stats = useMemo(() => {
        const totalClients = clients.length;
        const activeClients = clients.filter((client) =>
            activeStatuses.has(client.status)
        ).length;
        const finalizedClients = clients.filter(
            (client) => client.status === "finalise"
        ).length;
        const recentConversions = clients.filter(isRecentConversion).length;

        return {
            totalClients,
            activeClients,
            finalizedClients,
            recentConversions,
        };
    }, [clients]);

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
                    <p className="text-sm text-muted-foreground">
                        Suivez les prospects convertis en clients, leurs statuts et les
                        prochaines actions commerciales.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}
                    >
                        <RefreshCcw className="mr-2 size-4" />
                        Actualiser
                    </button>

                    <Link
                        href="/marketing/prospects"
                        className={buttonVariants({ className: "w-full sm:w-auto" })}
                    >
                        <UserRoundPlus className="mr-2 size-4" />
                        Convertir un prospect
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total clients</CardDescription>
                        <CardTitle className="text-2xl">{stats.totalClients}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Clients actifs</CardDescription>
                        <CardTitle className="text-2xl">{stats.activeClients}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Dossiers finalisés</CardDescription>
                        <CardTitle className="text-2xl">{stats.finalizedClients}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Conversions 30 jours</CardDescription>
                        <CardTitle className="text-2xl">{stats.recentConversions}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {isError && (
                <Card className="border-red-500/20 bg-red-500/5">
                    <CardContent className="flex items-start gap-3 p-4 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 size-4" />
                        <div>
                            <p className="font-medium">Impossible de charger les clients.</p>
                            <p>
                                {error instanceof Error
                                    ? error.message
                                    : "Une erreur inconnue est survenue."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Liste des clients</CardTitle>
                    <CardDescription>
                        Retrouvez les clients issus des conversions et accédez à leur
                        fiche ou au prospect d’origine.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <ProspectTableSkeleton />
                    ) : (
                        <DataTable
                            columns={clientColumns}
                            data={clients}
                            searchKey="fullName"
                            searchPlaceholder="Rechercher un client..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
