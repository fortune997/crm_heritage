import { Customer360 } from "@/core/types/prospectId/Customer360";
import {
    CalendarDays,
    CheckCircle2,
    FileText,
    Phone,
    Plus,
    UserPlus,
} from "lucide-react";



interface Props {
    customer: Customer360;
}

export function ActivityTimeline({
    customer,
}: Props) {
    return (
        <div className="rounded-xl border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">
                    Activités & historique
                </h2>

                <button className="text-xs font-semibold text-primary">
                    Voir tout
                </button>
            </div>

            <div className="relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

                <div className="space-y-6">
                    {customer.activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="relative flex gap-3"
                        >
                            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                                <ActivityIcon type={activity.type} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm font-semibold">
                                        {activity.title}
                                    </p>

                                    <span className="text-[10px] text-muted-foreground">
                                        {activity.date}
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {activity.author}
                                </p>

                                {activity.description && (
                                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                        {activity.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="mt-6 flex h-9 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium hover:bg-muted">
                <Plus className="h-4 w-4" />
                Ajouter une activité
            </button>
        </div>
    );
}

function ActivityIcon({
    type,
}: {
    type: string;
}) {
    const className = "h-4 w-4";

    switch (type) {
        case "call":
            return <Phone className={className} />;

        case "visit":
            return <CalendarDays className={className} />;

        case "document":
            return <FileText className={className} />;

        case "qualification":
            return <CheckCircle2 className={className} />;

        default:
            return <UserPlus className={className} />;
    }
}