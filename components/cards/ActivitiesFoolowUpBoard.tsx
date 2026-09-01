
import { AlertCircle, CalendarClock, MessageCircle, PhoneCall } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTreatDialog } from "../dialog/ActivityTreatDialog";
import { ProspectActivity } from "@/core/types/activities";
import { formatDateTime } from "@/core/lib/utils";
import { ActivityFollowUp } from "@/core/services/activites/activities-service";


type ActivityFollowUpBoardProps = {
    activities: ActivityFollowUp[];
};

const isDueOrOverdue = (value?: string | null) => {
    if (!value) return false;

    // Compatible avec : 2026-08-15 ou 2026-08-15T10:30:00
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);

    if (!year || !month || !day) return false;

    // Comparaison uniquement sur la date, sans tenir compte de l'heure
    const relanceDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return relanceDate <= today;
};

const normalizeStatus = (status?: string | null) =>
    String(status ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

export function ActivityFollowUpBoard({
    activities,
}: ActivityFollowUpBoardProps) {
    const priorityActivities = activities
        .filter(
            (activity) =>
                isDueOrOverdue(activity.prochain_relance) &&
                normalizeStatus(activity.statut_activite) !== "Terminée"
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

            {priorityActivities.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {priorityActivities.map((activity) => {
                        const isUrgent = activity.priorite === "Normale";

                        return (
                            <div
                                key={activity.id}
                                className="relative flex flex-col gap-3 overflow-hidden rounded-lg border bg-background p-3"
                            >
                                {isUrgent && (
                                    <span className="absolute right-3 top-3 flex size-2.5">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                                        <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                                    </span>
                                )}

                                <div className="flex items-start gap-3">
                                    <div
                                        className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600 ${isUrgent ? "animate-pulse" : ""
                                            }`}
                                    >
                                        {isUrgent ? (
                                            <AlertCircle className="size-4" />
                                        ) : (
                                            <CalendarClock className="size-4" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="truncate font-medium">
                                            {activity.prospect_name}
                                        </div>
                                        <div className="truncate text-sm text-muted-foreground">
                                            {activity.titre}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            Échéance : {activity.prochain_relance
                                                ? formatDateTime(activity.prochain_relance)
                                                : "Non définie"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-2 pt-1">
                                    {activity.prospect_phone && (
                                        <Button size="sm" variant="outline">
                                            <a
                                                href={`https://wa.me/${activity.prospect_phone.replace(/\D/g, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className="mr-2 size-4 text-green-600" />

                                            </a>
                                        </Button>
                                    )}
                                    <ActivityTreatDialog activity={activity} />
                                     <div className="truncate font-medium">
                                            {activity.created_by_name}
                                        </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Aucun suivi prioritaire pour le moment.
                </div>
            )}
        </div>
    );
}