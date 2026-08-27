import { Customer360 } from "@/core/types/prospectId/Customer360";
import {
    Mail,
    MessageCircle,
    Phone,
    UserRound,
} from "lucide-react";



interface Props {
    customer: Customer360;
}

export function AssignedCommercialCard({
    customer,
}: Props) {
    const commercial = customer.commercial;

    return (
        <div className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">
                    Commercial assigné
                </h2>

                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                    ACTIF
                </span>
            </div>

            <div className="flex items-center gap-3">
                <img
                    src={
                        commercial.avatar ||
                        "https://i.pravatar.cc/100?img=47"
                    }
                    alt={commercial.name}
                    className="h-12 w-12 rounded-full object-cover"
                />

                <div>
                    <p className="font-semibold">
                        {commercial.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {commercial.role}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <a
                    href={`tel:${commercial.phone}`}
                    className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border text-sm hover:bg-muted"
                >
                    <Phone className="h-4 w-4" />
                    Appeler
                </a>

                <a
                    href={`mailto:${commercial.email}`}
                    className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border text-sm hover:bg-muted"
                >
                    <Mail className="h-4 w-4" />
                    Email
                </a>
            </div>

            <button className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg border text-sm hover:bg-muted">
                <UserRound className="h-4 w-4" />
                Réassigner
            </button>
        </div>
    );
}