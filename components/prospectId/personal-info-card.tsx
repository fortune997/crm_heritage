import { formatDate } from "@/core/lib/utils";
import { Customer360 } from "@/core/types/prospectId/Customer360";
import { TProspects } from "@/core/types/prospects";
import {
    BriefcaseBusiness,
    Calendar,
    CreditCard,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";



interface Props {
    customer?: TProspects;
}

export function PersonalInfoCard({
    customer,
}: Props) {
     console.log('CUSTOMER DETAIL', customer)
     if(!customer) return null
    const items = [
        {
            label: "Type",
            value:
                customer
                    ? "Prospect"
                    : "Client",
            icon: User,
        },
        {
            label: "Civilité",
            value: `${customer?.sexe === 'Homme'? 'Mr' : 'Mme' } `,
            icon: User,
        },
        {
            label: "Nom complet",
            value: `${customer?.full_name} `,
            icon: User,
        },
        {
            label: "Téléphone",
            value: customer?.phone,
            icon: Phone,
        },
        {
            label: "Adresse",
            value: "Douala",
            icon: MapPin,
        },
        {
            label: "Pièce d'identité",
            value: 'Kit0000',
            icon: CreditCard,
        },
        {
            label: "Profession",
            value: 'Nom renseigné',
            icon: BriefcaseBusiness,
        },
        {
            label: "Source",
            value: customer?.canal_prospection,
            icon: User,
        },
        {
            label: "Enregistré le",
            value: (new Date(customer?.created_at)),
            icon: Calendar,
        },
    ];

    return (
        <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-5 flex items-center gap-2 font-semibold">
                <User className="h-4 w-4 text-primary" />
                Informations personnelles
            </h2>

            <div className="space-y-4">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="grid grid-cols-[20px_120px_1fr] gap-2 text-sm"
                        >
                            <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />

                            <span className="text-muted-foreground">
                                {item.label}
                            </span>

                           {/*  <span className="font-medium break-words">
                                {item.value || "—"}
                            </span> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}