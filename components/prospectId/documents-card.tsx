import { Customer360 } from "@/core/types/prospectId/Customer360";
import {
    CheckCircle2,
    Clock3,
    FileText,
    Plus,
} from "lucide-react";


interface Props {
    customer: Customer360;
}

export function DocumentsCard({
    customer,
}: Props) {
    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">
                    Documents reçus
                </h2>

                <button className="text-xs font-semibold text-primary">
                    Voir tout
                </button>
            </div>

            <div className="space-y-3">
                {customer.documents.map((document) => (
                    <div
                        key={document.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {document.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {document.date || "Date non renseignée"}
                            </p>
                        </div>

                        <DocumentStatus
                            status={document.status}
                        />
                    </div>
                ))}
            </div>

            <button className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium hover:bg-muted">
                <Plus className="h-4 w-4" />
                Ajouter un document
            </button>
        </section>
    );
}

function DocumentStatus({
    status,
}: {
    status: string;
}) {
    if (status === "received" || status === "validated") {
        return (
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Reçu
            </span>
        );
    }

    return (
        <span className="flex shrink-0 items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
            <Clock3 className="h-3 w-3" />
            En attente
        </span>
    );
}