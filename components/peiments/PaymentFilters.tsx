"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaymentMethod, PaymentStatus } from "@/core/types/ventes/type";


interface PaymentFiltersProps {
    search: string;
    status: PaymentStatus | "all";
    method: PaymentMethod | "all";

    onSearchChange: (value: string) => void;
    onStatusChange: (value: PaymentStatus | "all") => void;
    onMethodChange: (value: PaymentMethod | "all") => void;
    onReset: () => void;
}

export function PaymentFilters({
    search,
    status,
    method,
    onSearchChange,
    onStatusChange,
    onMethodChange,
    onReset,
}: PaymentFiltersProps) {
    return (
        <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={search}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    placeholder="Rechercher un client, une référence..."
                    className="pl-9"
                />
            </div>

            <Select
                value={status}
                onValueChange={(value) =>
                    onStatusChange(value as PaymentStatus | "all")
                }
            >
                <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Statut" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">
                        Tous les statuts
                    </SelectItem>

                    <SelectItem value="confirme">
                        Confirmés
                    </SelectItem>

                    <SelectItem value="en_attente">
                        En attente
                    </SelectItem>

                    <SelectItem value="annule">
                        Annulés
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={method}
                onValueChange={(value) =>
                    onMethodChange(value as PaymentMethod | "all")
                }
            >
                <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Mode de paiement" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">
                        Tous les modes
                    </SelectItem>

                    <SelectItem value="especes">
                        Espèces
                    </SelectItem>

                    <SelectItem value="virement">
                        Virement
                    </SelectItem>

                    <SelectItem value="mobile_money">
                        Mobile Money
                    </SelectItem>

                    <SelectItem value="cheque">
                        Chèque
                    </SelectItem>

                    <SelectItem value="carte">
                        Carte
                    </SelectItem>
                </SelectContent>
            </Select>

            <Button
                variant="outline"
                onClick={onReset}
                className="gap-2"
            >
                <X className="h-4 w-4" />
                Réinitialiser
            </Button>
        </div>
    );
}