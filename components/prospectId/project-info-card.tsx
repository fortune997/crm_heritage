import { Customer360 } from "@/core/types/prospectId/Customer360";
import {
    Banknote,
    CalendarClock,
    Home,
    MapPinned,
    Ruler,
} from "lucide-react";


interface Props {
    customer: Customer360;
}

export function ProjectInfoCard({
    customer,
}: Props) {
    const project = customer.project;

    return (
        <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-5 flex items-center gap-2 font-semibold">
                <Home className="h-4 w-4 text-primary" />
                Projet / Besoin
            </h2>

            <div className="space-y-4 text-sm">
                <Info
                    label="Type de projet"
                    value={project.type}
                />

                <Info
                    label="Usage"
                    value={project.usage}
                />

                <div>
                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                        <MapPinned className="h-4 w-4" />
                        Zones recherchées
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {project.zones.map((zone) => (
                            <span
                                key={zone}
                                className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
                            >
                                {zone}
                            </span>
                        ))}
                    </div>
                </div>

                <Info
                    label="Superficie souhaitée"
                    value={project.surface}
                    icon={<Ruler className="h-4 w-4" />}
                />

                <Info
                    label="Budget"
                    value={project.budget}
                    icon={<Banknote className="h-4 w-4" />}
                />

                <Info
                    label="Délai d'achat"
                    value={project.purchaseDelay}
                    icon={
                        <CalendarClock className="h-4 w-4" />
                    }
                />

                <Info
                    label="Mode de paiement"
                    value={project.paymentMethod}
                />

                {project.comments && (
                    <div className="border-t pt-4">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                            Commentaires
                        </p>

                        <p className="leading-6">
                            {project.comments}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Info({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div>
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                {icon}
                {label}
            </div>

            <p className="font-medium">{value || "—"}</p>
        </div>
    );
}