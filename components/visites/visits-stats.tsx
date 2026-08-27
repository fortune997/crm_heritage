import { Visit } from "@/core/types/visites/type";
import {
    CalendarCheck,
    CalendarClock,
    CalendarX,
    Percent,
    Users,
} from "lucide-react";



interface Props {
    visits: Visit[];
}

export function VisitsStats({
    visits,
}: Props) {
    const total = visits.length;

    const completed = visits.filter(
        (v) => v.status === "completed"
    ).length;

    const planned = visits.filter(
        (v) => v.status === "planned"
    ).length;

    const cancelled = visits.filter(
        (v) => v.status === "cancelled"
    ).length;

    const conversion = total
        ? Math.round(
            (visits.filter(
                (v) =>
                    v.result === "very_interested"
            ).length /
                total) *
            100
        )
        : 0;

    const stats = [
        {
            label: "Total visites",
            value: total,
            icon: Users,
            description: "Ce mois",
        },
        {
            label: "Visites effectuées",
            value: completed,
            icon: CalendarCheck,
            description: `${Math.round(
                (completed / Math.max(total, 1)) * 100
            )}%`,
        },
        {
            label: "Visites à venir",
            value: planned,
            icon: CalendarClock,
            description: "Planifiées",
        },
        {
            label: "Visites annulées",
            value: cancelled,
            icon: CalendarX,
            description: `${Math.round(
                (cancelled / Math.max(total, 1)) * 100
            )}%`,
        },
        {
            label: "Taux d'intérêt",
            value: `${conversion}%`,
            icon: Percent,
            description: "Très intéressés",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="rounded-xl border bg-card p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.label}
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {stat.value}
                                </p>

                                <p className="mt-1 text-[10px] text-muted-foreground">
                                    {stat.description}
                                </p>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}