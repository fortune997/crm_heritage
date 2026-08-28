import { VisitStatus } from "@/core/types/visites/type";

interface StatusConfig {
    label: string;
    className: string;
}

const VISIT_STATUS_CONFIG: Record<
    VisitStatus,
    StatusConfig
> = {
    planned: {
        label: "Planifiée",
        className:
            "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    },

    confirmed: {
        label: "Confirmée",
        className:
            "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    },

    completed: {
        label: "Effectuée",
        className:
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    },

    cancelled: {
        label: "Annulée",
        className:
            "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    },

    postponed: {
        label: "Reportée",
        className:
            "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    },
};

interface VisitStatusBadgeProps {
    status: VisitStatus;
}

export function VisitStatusBadge({
    status,
}: VisitStatusBadgeProps) {
    const item = VISIT_STATUS_CONFIG[status];

    return (
        <span
            className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${item.className}`}
        >
            {item.label}
        </span>
    );
}