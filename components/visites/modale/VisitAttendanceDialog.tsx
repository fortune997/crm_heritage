"use client";

import { useState } from "react";
import {
    CheckCircle2,
    Loader2,
    UserCheck,
    UserX,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useConfirmVisit } from "@/core/hooks/visites/useVisite";

type AttendanceValue = boolean | null;

interface VisitAttendanceDialogProps {
    visitId: string;
    currentValue: AttendanceValue;
    prospectName?: string;
}

function AttendanceBadge({ value }: { value: AttendanceValue }) {
    if (value === true) {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Présent
            </span>
        );
    }

    if (value === false) {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                <XCircle className="h-4 w-4" />
                Absent
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            À renseigner
        </span>
    );
}

export function VisitAttendanceDialog({
    visitId,
    currentValue,
    prospectName,
}: VisitAttendanceDialogProps) {
    const [open, setOpen] = useState(false);

    const {
        mutate: confirmAttendance,
        isPending,
        variables,
    } = useConfirmVisit();

    const markAttendance = (isPresent: boolean) => {
        confirmAttendance(
            {
                visitId,
                isPresent,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
        className="rounded-md px-2 py-1 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:hover:bg-slate-800"
        aria-label="Modifier la présence à la visite"
    >
        <AttendanceBadge value={currentValue} />
    </DialogTrigger>
           

            <DialogContent
                className="sm:max-w-md"
                onClick={(event) => event.stopPropagation()}
            >
                <DialogHeader>
                    <DialogTitle>Présence à la visite</DialogTitle>

                    <DialogDescription>
                        Marquer {prospectName ?? "ce prospect"} comme présent ou
                        absent. Le choix est enregistré immédiatement.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 pt-3 sm:grid-cols-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="
                            h-24 flex-col gap-2
                            border-red-200 text-red-700
                            hover:bg-red-50 hover:text-red-800
                            dark:border-red-900
                            dark:text-red-400
                            dark:hover:bg-red-950/40
                        "
                        disabled={isPending}
                        onClick={() => markAttendance(false)}
                    >
                        {isPending &&
                        variables?.isPresent === false ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <UserX className="h-6 w-6" />
                        )}

                        Absent
                    </Button>

                    <Button
                        type="button"
                        className="
                            h-24 flex-col gap-2
                            bg-emerald-600 text-white
                            hover:bg-emerald-700
                        "
                        disabled={isPending}
                        onClick={() => markAttendance(true)}
                    >
                        {isPending &&
                        variables?.isPresent === true ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <UserCheck className="h-6 w-6" />
                        )}

                        Présent
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}