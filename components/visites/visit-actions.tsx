"use client";

import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

interface Props {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function VisitActions({
    onView,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="flex items-center gap-1">
            <button
                onClick={onView}
                className="rounded-md border p-1.5 hover:bg-muted"
                title="Voir"
            >
                <Eye className="h-3.5 w-3.5" />
            </button>

            <button
                onClick={onEdit}
                className="rounded-md border p-1.5 hover:bg-muted"
                title="Modifier"
            >
                <Pencil className="h-3.5 w-3.5" />
            </button>

            <button
                onClick={onDelete}
                className="rounded-md border p-1.5 text-red-500 hover:bg-red-50"
                title="Supprimer"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}