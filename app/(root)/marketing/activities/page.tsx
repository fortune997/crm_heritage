// app/dashboard/marketing/activites/page.tsx

"use client";

import { ActivityFollowUpBoard } from "@/components/cards/ActivitiesFoolowUpBoard";
import { ActivitySummaryCards } from "@/components/cards/ActivitiesSummaryCard";
import { ActivityCreateDialog } from "@/components/dialog/ActivitiesCreateDialog";
import { DataTable } from "@/components/forms/table/DataTable";
import { activityColumns } from "@/components/shared/columns/ActivitiesColumn";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Activity } from "@/types";



const activities: Activity[] = [
    {
        id: "ACT-001",
        targetType: "prospect",
        targetId: "PR-001",
        targetName: "Jean Marc Tchinda",
        targetPhone: "+237699000111",
        type: "relance",
        title: "Relancer pour confirmer la visite du terrain",
        description:
            "Le prospect est intéressé par le terrain de PK24. Il faut confirmer sa disponibilité.",
        status: "a_faire",
        priority: "haute",
        dueDate: "2026-05-12",
        dueTime: "10:00",
        assignedTo: "Commercial 1",
        createdBy: "Admin",
        createdAt: "2026-05-11",
    },
    {
        id: "ACT-002",
        targetType: "client",
        targetId: "CL-001",
        targetName: "Nadia Fotso",
        targetPhone: "+237675222333",
        type: "paiement",
        title: "Suivre le paiement de la deuxième tranche",
        description:
            "La cliente avait promis de faire un dépôt cette semaine. Relancer pour confirmation.",
        status: "en_retard",
        priority: "urgente",
        dueDate: "2026-05-10",
        dueTime: "14:30",
        assignedTo: "Commercial 2",
        createdBy: "Admin",
        createdAt: "2026-05-08",
    },
    {
        id: "ACT-003",
        targetType: "prospect",
        targetId: "PR-003",
        targetName: "Patrick Mvondo",
        targetPhone: "+237690444555",
        type: "visite",
        title: "Visite du site de Japoma",
        description:
            "Prévoir le topographe et envoyer la localisation au prospect.",
        status: "a_faire",
        priority: "moyenne",
        dueDate: "2026-05-13",
        dueTime: "09:00",
        assignedTo: "Commercial 1",
        createdBy: "Admin",
        createdAt: "2026-05-11",
    },
    {
        id: "ACT-004",
        targetType: "client",
        targetId: "CL-004",
        targetName: "Grace Nguefack",
        targetPhone: "+237677888999",
        type: "appel",
        title: "Appel de suivi après rendez-vous",
        description:
            "La cliente demande plus d’informations sur les modalités de paiement.",
        status: "terminee",
        priority: "faible",
        dueDate: "2026-05-12",
        dueTime: "08:30",
        completedAt: "2026-05-12",
        assignedTo: "Commercial 3",
        createdBy: "Commercial 3",
        createdAt: "2026-05-12",
    },
];

function isToday(date?: string) {
    if (!date) return false;

    const today = new Date().toISOString().split("T")[0];

    return date === today;
}

function isOverdue(activity: Activity) {
    if (!activity.dueDate) return false;
    if (activity.status === "terminee" || activity.status === "annulee") {
        return false;
    }

    const today = new Date().toISOString().split("T")[0];

    return activity.dueDate < today;
}

export default function ActivitiesPage() {
    const todayActivities = activities.filter((activity) =>
        isToday(activity.dueDate)
    );

    const overdueActivities = activities.filter((activity) =>
        isOverdue(activity)
    );

    const upcomingActivities = activities.filter((activity) => {
        if (!activity.dueDate) return false;

        const today = new Date().toISOString().split("T")[0];

        return activity.dueDate > today && activity.status !== "terminee";
    });

    const completedTodayActivities = activities.filter(
        (activity) => activity.status === "terminee" && isToday(activity.completedAt)
    );

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Activités & Suivi commercial
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Pilotez les appels, relances, visites, rendez-vous, notes et suivis
                        liés aux clients et prospects.
                    </p>
                </div>

                <ActivityCreateDialog />
            </div>

            <ActivitySummaryCards
                todayCount={todayActivities.length}
                overdueCount={overdueActivities.length}
                upcomingCount={upcomingActivities.length}
                completedTodayCount={completedTodayActivities.length}
            />

            <ActivityFollowUpBoard activities={activities} />

            <Card>
                <CardHeader>
                    <CardTitle>Historique des activités</CardTitle>
                    <CardDescription>
                        Retrouvez toutes les actions commerciales enregistrées par les
                        commerciaux.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <DataTable
                        columns={activityColumns}
                        data={activities}
                        searchKey="targetName"
                        searchPlaceholder="Rechercher un client ou un prospect..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}