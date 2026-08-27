import { Customer360 } from "@/core/types/prospectId/Customer360";
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
    customer: Customer360;
}

export function PersonalInfoCard({
    customer,
}: Props) {
    const items = [
        {
            label: "Type",
            value:
                customer.type === "prospect"
                    ? "Prospect"
                    : "Client",
            icon: User,
        },
        {
            label: "Civilité",
            value: customer.civility,
            icon: User,
        },
        {
            label: "Nom complet",
            value: `${customer.firstName} ${customer.lastName}`,
            icon: User,
        },
        {
            label: "Téléphone",
            value: customer.phone,
            icon: Phone,
        },
        {
            label: "Email",
            value: customer.email,
            icon: Mail,
        },
        {
            label: "Adresse",
            value: customer.address,
            icon: MapPin,
        },
        {
            label: "Pièce d'identité",
            value: customer.identityNumber,
            icon: CreditCard,
        },
        {
            label: "Profession",
            value: customer.profession,
            icon: BriefcaseBusiness,
        },
        {
            label: "Source",
            value: customer.source,
            icon: User,
        },
        {
            label: "Enregistré le",
            value: customer.createdAt,
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

                            <span className="font-medium break-words">
                                {item.value || "—"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}