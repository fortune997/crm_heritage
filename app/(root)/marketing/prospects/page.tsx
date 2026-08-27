"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/forms/table/DataTable";
import { getProspectColumns } from "@/components/shared/columns/ProspectColumns";
import { ProspectForm } from "@/components/forms/ProspectForm";
import { useProspect } from "@/core/hooks/prospects/useProspect";
import { ProspectTableSkeleton } from "@/components/cards/ProspectTableSkeleton";
import { usePermission } from "@/core/hooks/admin/usePermission";


export default function ProspectsPage() {
    const {
        data: prospectsData = [],
        isLoading,
    } = useProspect();

    // Vérifie si l'utilisateur peut voir les prospects des autres
    const {
        data: canViewAll = true,
        isLoading: isPermissionLoading,
    } = usePermission("prospect.read.all");

    const columns = useMemo(
        () => getProspectColumns(canViewAll),
        [canViewAll]
    );

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Prospects
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Gérez les prospects, leurs statuts, leurs sources et leurs suivis commerciaux.
                    </p>
                </div>

                <ProspectForm />
            </div>

            <Card>
                <CardContent className="p-4 md:p-6">
                    {isLoading || isPermissionLoading ? (
                        <ProspectTableSkeleton />
                    ) : (
                        <DataTable
                            columns={columns}
                            data={prospectsData}
                            searchKey="full_name"
                            searchPlaceholder="Rechercher un prospect..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}