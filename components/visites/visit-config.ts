export function getStatusConfig(status: string) {
    switch (status) {
        case "planned":
            return {
                label: "Planifiée",
                className:
                    "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
            };

        case "completed":
            return {
                label: "Terminée",
                className:
                    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
            };

        case "cancelled":
            return {
                label: "Annulée",
                className:
                    "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
            };

        case "postponed":
            return {
                label: "Reportée",
                className:
                    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
            };

        default:
            return {
                label: status,
                className:
                    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
            };
    }
}

export function getResultConfig(result: string) {
    switch (result) {
        case "very_interested":
            return {
                label: "Très intéressé",
                className:
                    "text-emerald-700 dark:text-emerald-400",
            };

        case "interested":
            return {
                label: "Intéressé",
                className:
                    "text-blue-700 dark:text-blue-400",
            };

        case "not_interested":
            return {
                label: "Pas intéressé",
                className:
                    "text-red-700 dark:text-red-400",
            };

        case "pending":
            return {
                label: "En attente",
                className:
                    "text-orange-700 dark:text-orange-400",
            };

        default:
            return {
                label: result,
                className:
                    "text-slate-500 dark:text-slate-400",
            };
    }
}

export function getTypeLabel(type: string): string {
    switch (type) {
        case "terrain":
            return "Terrain";

        case "bureau":
            return "Bureau";

        case "autre":
            return "Autre";

        default:
            return type;
    }
}