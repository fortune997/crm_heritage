// features/activities/components/activity-summary-cards.tsx

import {
    AlertTriangle,
    CalendarCheck,
    Clock3,
    ListTodo,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type ActivitySummaryCardsProps = {
    todayCount: number;
    overdueCount: number;
    upcomingCount: number;
    completedTodayCount: number;
};

export function ActivitySummaryCards({
    todayCount,
    overdueCount,
    upcomingCount,
    completedTodayCount,
}: ActivitySummaryCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        À faire aujourd’hui
                    </CardTitle>
                    <ListTodo className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{todayCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Activités prévues pour la journée
                    </p>
                </CardContent>
            </Card>

            <Card className="border-red-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">En retard</CardTitle>
                    <AlertTriangle className="size-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        {overdueCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Relances ou suivis dépassés
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">À venir</CardTitle>
                    <Clock3 className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{upcomingCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Activités planifiées prochainement
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Terminées aujourd’hui
                    </CardTitle>
                    <CalendarCheck className="size-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {completedTodayCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Actions déjà effectuées
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}