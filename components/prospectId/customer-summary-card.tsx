import { Customer360 } from "@/core/types/prospectId/Customer360";
import {
    CalendarClock,
    Flag,
    Gauge,
    Target,
} from "lucide-react";



interface Props {
    customer: Customer360;
}

export function CustomerSummaryCard({
    customer,
}: Props) {
    return (
        <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-5 flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4 text-primary" />
                Résumé
            </h2>

            <div className="space-y-5 text-sm">
                <Item
                    label="Étape actuelle"
                    value={customer.currentStage}
                    className="bg-blue-50 text-blue-700"
                />

                <Item
                    label="Statut"
                    value={customer.currentStatus}
                    className="bg-amber-50 text-amber-700"
                />

                <Item
                    label="Intérêt"
                    value={customer.interest}
                    className="bg-emerald-50 text-emerald-700"
                />

                <div>
                    <p className="mb-1 text-muted-foreground">
                        Prochaine action
                    </p>

                    <p className="font-semibold text-purple-600">
                        {customer.nextAction}
                    </p>
                </div>

                <div>
                    <p className="mb-1 flex items-center gap-2 text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        Date prochaine action
                    </p>

                    <p className="font-medium">
                        {customer.nextActionDate}
                    </p>
                </div>

                <div>
                    <p className="mb-2 flex items-center gap-2 text-muted-foreground">
                        <Flag className="h-4 w-4" />
                        Priorité
                    </p>

                    <span className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                        Haute
                    </span>
                </div>

                <div>
                    <p className="mb-2 flex items-center gap-2 text-muted-foreground">
                        <Gauge className="h-4 w-4" />
                        Score
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 text-yellow-500">
                            ★★★★
                            <span className="text-muted-foreground">
                                ★
                            </span>
                        </div>

                        <span className="font-semibold">
                            80%
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <Badge>Habitation</Badge>
                    <Badge>Bonamoussadi</Badge>
                    <Badge>Budget moyen</Badge>
                </div>
            </div>
        </div>
    );
}

function Item({
    label,
    value,
    className,
}: {
    label: string;
    value: string;
    className: string;
}) {
    return (
        <div>
            <p className="mb-1 text-muted-foreground">
                {label}
            </p>

            <span
                className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${className}`}
            >
                {value}
            </span>
        </div>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
            {children}
        </span>
    );
}