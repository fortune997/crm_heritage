import { Customer360 } from "@/core/types/prospectId/Customer360";
import {
    ExternalLink,
    MapPin,
    Ruler,
} from "lucide-react";


interface Props {
    customer: Customer360;
}

export function ProposedLandCard({
    customer,
}: Props) {
    const land = customer.land;

    if (!land) return null;

    return (
        <div className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">
                    Terrain proposé
                </h2>

                <button className="text-xs font-semibold text-primary">
                    Voir tout
                </button>
            </div>

            {land.image && (
                <img
                    src={land.image}
                    alt={land.title}
                    className="h-40 w-full rounded-lg object-cover"
                />
            )}

            <div className="mt-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-semibold">
                            {land.title}
                        </h3>

                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {land.location}
                        </p>
                    </div>

                    <span className="rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                        {land.status}
                    </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Superficie
                        </p>

                        <p className="flex items-center gap-1 text-sm font-semibold">
                            <Ruler className="h-3.5 w-3.5" />
                            {land.surface}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                            Prix
                        </p>

                        <p className="text-sm font-bold">
                            {new Intl.NumberFormat("fr-FR").format(
                                land.price
                            )}{" "}
                            FCFA
                        </p>
                    </div>
                </div>

                <button className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium hover:bg-muted">
                    Voir le terrain
                    <ExternalLink className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}