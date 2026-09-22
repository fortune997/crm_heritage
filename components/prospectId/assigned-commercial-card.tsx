import { Customer360 } from "@/core/types/prospectId/Customer360";
import { TProspects } from "@/core/types/prospects";
import {
    Mail,
    MessageCircle,
    Phone,
    UserRound,
} from "lucide-react";



interface Props {
    customer?: TProspects;
}

export function AssignedCommercialCard({
    customer,
}: Props) {


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
                        "https://i.pravatar.cc/100?img=47"
                    }
                    alt={customer?.full_name}
                    className="h-12 w-12 rounded-full object-cover"
                />

                <div>
                    <p className="font-semibold">
                        {customer?.profiles?.full_name}
                    </p>

                   {/*  <p className="text-xs text-muted-foreground">
                        {customer.role}
                    </p> */}
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <a
                    href={`tel:${customer?.profiles?.phone}`}
                    className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border text-sm hover:bg-muted"
                >
                    <Phone className="h-4 w-4" />
                    Appeler
                </a>

                <a
                    href={`mailto:${customer?.profiles?.professinnal_email}`}
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