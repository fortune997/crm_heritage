// features/activities/components/activity-follow-up-board.tsx

import { AlertCircle, CalendarClock, PhoneCall } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Activity } from "@/types";
import { ActivityTreatDialog } from "../dialog/ActivityTreatDialog";

type ActivityFollowUpBoardProps = {
    activities: Activity[];
};

export function ActivityFollowUpBoard({
    activities,
}: ActivityFollowUpBoardProps) {
    const priorityActivities = activities
        .filter(
            (activity) =>
                activity.status === "en_retard" ||
                activity.priority === "urgente" ||
                activity.status === "a_faire"
        )
        .slice(0, 5);

    return (
        <div className="rounded-xl border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Suivis prioritaires</h2>
                    <p className="text-sm text-muted-foreground">
                        Clients et prospects nécessitant une action rapide.
                    </p>
                </div>

                <Badge variant="secondary">
                    {priorityActivities.length} à traiter
                </Badge>
            </div>

            <div className="space-y-3">
                {priorityActivities.length ? (
                    priorityActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex flex-col gap-3 rounded-lg border bg-background p-3 md:flex-row md:items-center md:justify-between"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 flex size-9 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                                    {activity.status === "en_retard" ? (
                                        <AlertCircle className="size-4" />
                                    ) : (
                                        <CalendarClock className="size-4" />
                                    )}
                                </div>

                                <div>
                                    <div className="font-medium">{activity.targetName}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {activity.title}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        Échéance : {activity.dueDate ?? "Non définie"}{" "}
                                        {activity.dueTime ? `à ${activity.dueTime}` : ""}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {activity.targetPhone && (
                                    <Button size="sm" variant="outline" >
                                        <a href={`tel:${activity.targetPhone}`}>
                                            <PhoneCall className="mr-2 size-4" />
                                            Appeler
                                        </a>
                                    </Button>
                                )}

                                <ActivityTreatDialog activity={activity} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        Aucun suivi prioritaire pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
}