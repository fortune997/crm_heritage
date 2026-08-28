// components/visits/visit-status-dialog.tsx

"use client";

import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Visit } from "@/core/types/visites/type";
import { useUpdateVisitStatus } from "@/core/hooks/visites/useVisite";


type VisitAction = "confirm" | "postpone";

interface VisitStatusDialogProps {
    visit: Visit | null;
    action: VisitAction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VisitStatusDialog({
    visit,
    action,
    open,
    onOpenChange,
}: VisitStatusDialogProps) {
    const [newDate, setNewDate] = useState("");
    const { mutate, isPending } = useUpdateVisitStatus();

    useEffect(() => {
        if (!open) {
            setNewDate("");
        }
    }, [open]);

    if (!visit || !action) {
        return null;
    }

    const isConfirmation = action === "confirm";

    function handleSubmit() {
        if (!visit?.id) {
            return;
        }

        if (isConfirmation) {
            mutate(
                {
                    visitId: visit.id,
                    status: "confirmed",
                },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                }
            );

            return;
        }

        if (!newDate) {
            return;
        }

        mutate(
            {
                visitId: visit.id,
                status: "postponed",
                newDate,
            },
            {
                onSuccess: () => {
                    setNewDate("");
                    onOpenChange(false);
                },
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isConfirmation ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                            <CalendarClock className="h-5 w-5 text-amber-600" />
                        )}

                        {isConfirmation
                            ? "Confirmer la visite"
                            : "Reporter la visite"}
                    </DialogTitle>

                    <DialogDescription>
                        {isConfirmation
                            ? "Confirmez-vous que cette visite est maintenue ?"
                            : "Choisissez la nouvelle date de la visite."}
                    </DialogDescription>
                </DialogHeader>

                {!isConfirmation && (
                    <div className="space-y-2 py-4">
                        <Label htmlFor="new-visit-date">
                            Nouvelle date
                        </Label>

                        <Input
                            id="new-visit-date"
                            type="date"
                            value={newDate}
                            min={
                                new Date()
                                    .toISOString()
                                    .split("T")[0]
                            }
                            onChange={(event) =>
                                setNewDate(event.target.value)
                            }
                            disabled={isPending}
                        />
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                    >
                        Annuler
                    </Button>

                    <Button
                        type="button"
                        disabled={
                            isPending ||
                            (!isConfirmation && !newDate)
                        }
                        onClick={handleSubmit}
                        className={
                            isConfirmation
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-amber-600 text-white hover:bg-amber-700"
                        }
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}

                        {isConfirmation
                            ? "Confirmer la visite"
                            : "Confirmer le report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}