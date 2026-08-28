"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useConfirmVisit } from "@/core/hooks/visites/useVisite";

interface ConfirmVisitButtonProps {
    visitId: string;
    disabled?: boolean;
}

export function ConfirmVisitButton({
    visitId,
    disabled = false,
}: ConfirmVisitButtonProps) {
    const { mutate, isPending } = useConfirmVisit();

    const handleConfirm = () => {
        mutate({
            id: visitId,
        });
    };

    return (
        <DropdownMenuItem
            disabled={disabled || isPending}
            onSelect={(event) => {
                event.preventDefault();
                handleConfirm();
            }}
        >
            {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
                <CheckCircle2 className="mr-2 size-4" />
            )}

            {isPending
                ? "Confirmation..."
                : "Confirmer la visite"}
        </DropdownMenuItem>
    );
}