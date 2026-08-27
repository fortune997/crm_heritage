
"use client";

import { ActivityFollowUpBoard } from "@/components/cards/ActivitiesFoolowUpBoard";
import { ActivitySummaryCards } from "@/components/cards/ActivitiesSummaryCard";
import { ActivityCreateDialog } from "@/components/dialog/ActivitiesCreateDialog";
import { DataTable } from "@/components/forms/table/DataTable";
import { activityColumns } from "@/components/shared/columns/ActivitiesColumn";
import { ActivitiesPageSkeleton } from "@/components/skeleton/ActivitiesPageSkeleton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScheduleVisitDialog } from "@/components/visites/schedule-visit-dialog";
import { useAcitivities } from "@/core/hooks/useActivities";
import { Activity } from "@/types";
import { CalendarPlus, EyeIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/core/hooks/admin/usePermission";
import { ProspectTableSkeleton } from "@/components/cards/ProspectTableSkeleton";



export default function ActivitiesPage() {
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const { data: allActivities = [], isLoading } = useAcitivities()
    const router = useRouter()

    const {
        data: canViewAll = true,
        isLoading: isPermissionLoading,
    } = usePermission("activity.read.all");

    const columns = useMemo(
        () => activityColumns(canViewAll),
        [canViewAll]
    );

    const activityStats = useMemo(() => {
        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        const todayCount = allActivities.filter((activity) => {
            const date = new Date(activity.scheduled_at);

            return date >= startOfToday && date <= endOfToday;
        }).length;

        const overdueCount = allActivities.filter((activity) => {
            const date = new Date(activity.scheduled_at);

            return date < startOfToday && activity.status !== "completed";
        }).length;

        const upcomingCount = allActivities.filter((activity) => {
            const date = new Date(activity.scheduled_at);

            return date > endOfToday && activity.status !== "completed";
        }).length;

        const completedTodayCount = allActivities.filter((activity) => {
            const date = new Date(activity.completed_at ?? "");

            return (
                activity.status === "completed" &&
                date >= startOfToday &&
                date <= endOfToday
            );
        }).length;

        return {
            todayCount,
            overdueCount,
            upcomingCount,
            completedTodayCount,
        };
    }, [allActivities]);

    if (isLoading) {
        return <ActivitiesPageSkeleton />;
    }


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

                <div className="flex gap-4 items-center ">
                    <button
                        onClick={() => setScheduleDialogOpen(true)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                        <CalendarPlus className="h-4 w-4" />

                        <span className="hidden sm:inline">
                            Planifier une visite
                        </span>
                    </button>
                    <ActivityCreateDialog />
                    <button
                        onClick={() => router.push('/marketing/activities/mes_visites')}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >

                        <span className="hidden sm:inline">
                            Mes Visites
                        </span>
                    </button>
                </div>

            </div>

            <ActivitySummaryCards
                todayCount={activityStats.todayCount}
                overdueCount={activityStats.overdueCount}
                upcomingCount={activityStats.upcomingCount}
                completedTodayCount={activityStats.completedTodayCount}
            />

            <ActivityFollowUpBoard activities={allActivities} />

            <Card>
                <CardHeader>
                    <CardTitle>Historique des activités</CardTitle>
                    <CardDescription>
                        Retrouvez toutes les actions commerciales enregistrées par les
                        commerciaux.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading || isPermissionLoading ? (
                        <ProspectTableSkeleton />
                    ) :
                        <DataTable
                            columns={columns}
                            data={allActivities ?? []}
                            searchKey="phone"
                            searchPlaceholder="Rechercher un numéro..."
                        />}
                </CardContent>
            </Card>
            <ScheduleVisitDialog
                open={scheduleDialogOpen}
                onOpenChange={setScheduleDialogOpen}

            />
        </div>
    );
}