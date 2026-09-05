"use client";

import { useState } from "react";

import {
    Controller,
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    CalendarClock,
    Handshake,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    useUpdateClosingCase,
} from "@/core/hooks/closing/useClosing";

import {
    CLOSING_PRIORITIES,
    CLOSING_PRIORITY_OPTIONS,
    CLOSING_STAGES,
    CLOSING_STAGE_OPTIONS,
    type ClosingCase,
} from "@/core/types/closing";


// ============================================================
// VALIDATION
// ============================================================

const closingCaseActionSchema = z
    .object({
        stage: z.enum(CLOSING_STAGES),

        priority: z.enum(
            CLOSING_PRIORITIES
        ),

        estimatedAmount: z
            .string()
            .refine(
                (value) => {
                    if (!value.trim()) {
                        return true;
                    }

                    const amount =
                        Number(value);

                    return (
                        Number.isFinite(
                            amount
                        ) && amount >= 0
                    );
                },
                {
                    message:
                        "Le montant doit être supérieur ou égal à zéro.",
                }
            ),

        nextFollowUpAt: z.string(),

        objections: z
            .string()
            .max(
                3000,
                "Les objections sont trop longues."
            ),

        closingNotes: z
            .string()
            .max(
                5000,
                "Les notes sont trop longues."
            ),

        outcome: z
            .string()
            .max(
                2000,
                "Le résultat est trop long."
            ),

        lossReason: z
            .string()
            .max(
                2000,
                "La raison de perte est trop longue."
            ),
    })
    .superRefine((values, context) => {
        if (
            values.stage === "perdu" &&
            !values.lossReason.trim()
        ) {
            context.addIssue({
                code: "custom",
                path: ["lossReason"],
                message:
                    "La raison de perte est obligatoire.",
            });
        }

        if (
            values.stage ===
                "a_relancer" &&
            !values.nextFollowUpAt
        ) {
            context.addIssue({
                code: "custom",
                path: [
                    "nextFollowUpAt",
                ],
                message:
                    "La date de relance est obligatoire.",
            });
        }

        if (
            values.nextFollowUpAt &&
            Number.isNaN(
                new Date(
                    values.nextFollowUpAt
                ).getTime()
            )
        ) {
            context.addIssue({
                code: "custom",
                path: [
                    "nextFollowUpAt",
                ],
                message:
                    "La date de relance est invalide.",
            });
        }
    });

type ClosingCaseActionFormValues =
    z.infer<
        typeof closingCaseActionSchema
    >;


// ============================================================
// PROPS
// ============================================================

interface ClosingCaseActionDialogProps {
    closingCase: ClosingCase;
    buttonLabel?: string;
}


// ============================================================
// UTILITAIRES
// ============================================================

function toDateTimeLocal(
    value: string | null
): string {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (
        Number.isNaN(date.getTime())
    ) {
        return "";
    }

    const timezoneOffset =
        date.getTimezoneOffset() *
        60_000;

    return new Date(
        date.getTime() -
            timezoneOffset
    )
        .toISOString()
        .slice(0, 16);
}

function getDefaultValues(
    closingCase: ClosingCase
): ClosingCaseActionFormValues {
    return {
        stage: closingCase.stage,

        priority:
            closingCase.priority,

        estimatedAmount:
            closingCase.estimated_amount !==
            null
                ? String(
                      closingCase.estimated_amount
                  )
                : "",

        nextFollowUpAt:
            toDateTimeLocal(
                closingCase.next_follow_up_at
            ),

        objections:
            closingCase.objections ?? "",

        closingNotes:
            closingCase.closing_notes ??
            "",

        outcome:
            closingCase.outcome ?? "",

        lossReason:
            closingCase.loss_reason ??
            "",
    };
}


// ============================================================
// CHAMP D’ERREUR
// ============================================================

interface FieldErrorProps {
    message?: string;
}

function FieldError({
    message,
}: FieldErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <p
            role="alert"
            className="
                text-xs text-red-600
                dark:text-red-400
            "
        >
            {message}
        </p>
    );
}


// ============================================================
// COMPOSANT
// ============================================================

export function ClosingCaseActionDialog({
    closingCase,
    buttonLabel = "Traiter le dossier",
}: ClosingCaseActionDialogProps) {
    const [open, setOpen] =
        useState(false);

    const updateMutation =
        useUpdateClosingCase();

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: {
            errors,
            isDirty,
        },
    } =
        useForm<ClosingCaseActionFormValues>(
            {
                resolver: zodResolver(
                    closingCaseActionSchema
                ),

                defaultValues:
                    getDefaultValues(
                        closingCase
                    ),
            }
        );

    const selectedStage =
        watch("stage");

    function handleOpenChange(
        nextOpen: boolean
    ) {
        if (
            !nextOpen &&
            updateMutation.isPending
        ) {
            return;
        }

        setOpen(nextOpen);

        if (nextOpen) {
            reset(
                getDefaultValues(
                    closingCase
                )
            );
        }
    }

    function onSubmit(
        values: ClosingCaseActionFormValues
    ) {
        const isTerminalStage =
            values.stage === "gagne" ||
            values.stage === "perdu";

        const estimatedAmount =
            values.estimatedAmount.trim()
                ? Number(
                      values.estimatedAmount
                  )
                : null;

        const nextFollowUpAt =
            !isTerminalStage &&
            values.nextFollowUpAt
                ? new Date(
                      values.nextFollowUpAt
                  ).toISOString()
                : null;

        updateMutation.mutate(
            {
                id: closingCase.id,

                values: {
                    stage: values.stage,

                    priority:
                        values.priority,

                    estimated_amount:
                        estimatedAmount,

                    next_follow_up_at:
                        nextFollowUpAt,

                    objections:
                        values.objections.trim() ||
                        null,

                    closing_notes:
                        values.closingNotes.trim() ||
                        null,

                    outcome:
                        values.outcome.trim() ||
                        null,

                    loss_reason:
                        values.stage ===
                            "perdu"
                            ? values.lossReason.trim()
                            : null,
                },
            },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            }
        );
    }

    return (
        <>
            <Button
                type="button"
                onClick={() =>
                    handleOpenChange(true)
                }
            >
                <Handshake className="size-4" />

                {buttonLabel}
            </Button>

            <Dialog
                open={open}
                onOpenChange={
                    handleOpenChange
                }
            >
                <DialogContent
                    className="
                        max-h-[90vh]
                        overflow-y-auto
                        sm:max-w-2xl
                    "
                >
                    <DialogHeader>
                        <DialogTitle>
                            Traiter le dossier
                            Closing
                        </DialogTitle>

                        <DialogDescription>
                            Mettez à jour le suivi
                            de{" "}
                            <span className="font-medium">
                                {
                                    closingCase
                                        .prospect
                                        .full_name
                                }
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="space-y-6"
                    >
                        {/* Étape et priorité */}

                        <div
                            className="
                                grid gap-4
                                sm:grid-cols-2
                            "
                        >
                            <div className="space-y-2">
                                <Label>
                                    Étape du closing
                                </Label>

                                <Controller
                                    name="stage"
                                    control={control}
                                    render={({
                                        field,
                                    }) => (
                                        <Select
                                            value={
                                                field.value
                                            }
                                            onValueChange={
                                                field.onChange
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une étape" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {CLOSING_STAGE_OPTIONS.map(
                                                    (
                                                        option
                                                    ) => (
                                                        <SelectItem
                                                            key={
                                                                option.value
                                                            }
                                                            value={
                                                                option.value
                                                            }
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                <FieldError
                                    message={
                                        errors.stage
                                            ?.message
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Priorité
                                </Label>

                                <Controller
                                    name="priority"
                                    control={control}
                                    render={({
                                        field,
                                    }) => (
                                        <Select
                                            value={
                                                field.value
                                            }
                                            onValueChange={
                                                field.onChange
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une priorité" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {CLOSING_PRIORITY_OPTIONS.map(
                                                    (
                                                        option
                                                    ) => (
                                                        <SelectItem
                                                            key={
                                                                option.value
                                                            }
                                                            value={
                                                                option.value
                                                            }
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                <FieldError
                                    message={
                                        errors
                                            .priority
                                            ?.message
                                    }
                                />
                            </div>
                        </div>

                        {/* Montant */}

                        <div className="space-y-2">
                            <Label htmlFor="estimatedAmount">
                                Montant potentiel
                                de la vente
                            </Label>

                            <div className="relative">
                                <Input
                                    id="estimatedAmount"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Exemple : 5000000"
                                    className="pr-16"
                                    {...register(
                                        "estimatedAmount"
                                    )}
                                />

                                <span
                                    className="
                                        pointer-events-none
                                        absolute right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-xs font-medium
                                        text-slate-500
                                    "
                                >
                                    FCFA
                                </span>
                            </div>

                            <FieldError
                                message={
                                    errors
                                        .estimatedAmount
                                        ?.message
                                }
                            />
                        </div>

                        {/* Relance */}

                        {![
                            "gagne",
                            "perdu",
                        ].includes(
                            selectedStage
                        ) && (
                            <div className="space-y-2">
                                <Label htmlFor="nextFollowUpAt">
                                    Prochaine relance
                                </Label>

                                <div className="relative">
                                    <CalendarClock
                                        className="
                                            pointer-events-none
                                            absolute left-3
                                            top-1/2 size-4
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />

                                    <Input
                                        id="nextFollowUpAt"
                                        type="datetime-local"
                                        className="pl-9"
                                        {...register(
                                            "nextFollowUpAt"
                                        )}
                                    />
                                </div>

                                <FieldError
                                    message={
                                        errors
                                            .nextFollowUpAt
                                            ?.message
                                    }
                                />
                            </div>
                        )}

                        {/* Objections */}

                        <div className="space-y-2">
                            <Label htmlFor="objections">
                                Objections du
                                prospect
                            </Label>

                            <Textarea
                                id="objections"
                                rows={3}
                                placeholder="Prix, localisation, modalités de paiement, délai de décision..."
                                {...register(
                                    "objections"
                                )}
                            />

                            <FieldError
                                message={
                                    errors
                                        .objections
                                        ?.message
                                }
                            />
                        </div>

                        {/* Résultat */}

                        <div className="space-y-2">
                            <Label htmlFor="outcome">
                                Résultat du dernier
                                échange
                            </Label>

                            <Textarea
                                id="outcome"
                                rows={3}
                                placeholder="Résumé de la réponse du prospect et de sa position actuelle..."
                                {...register(
                                    "outcome"
                                )}
                            />

                            <FieldError
                                message={
                                    errors.outcome
                                        ?.message
                                }
                            />
                        </div>

                        {/* Notes */}

                        <div className="space-y-2">
                            <Label htmlFor="closingNotes">
                                Notes internes du
                                Closing
                            </Label>

                            <Textarea
                                id="closingNotes"
                                rows={4}
                                placeholder="Informations importantes, stratégie proposée et prochaine action..."
                                {...register(
                                    "closingNotes"
                                )}
                            />

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Ces notes sont
                                internes à
                                l’entreprise.
                            </p>

                            <FieldError
                                message={
                                    errors
                                        .closingNotes
                                        ?.message
                                }
                            />
                        </div>

                        {/* Raison de perte */}

                        {selectedStage ===
                            "perdu" && (
                            <div
                                className="
                                    space-y-2
                                    rounded-xl border
                                    border-red-200
                                    bg-red-50 p-4
                                    dark:border-red-900
                                    dark:bg-red-950/40
                                "
                            >
                                <Label
                                    htmlFor="lossReason"
                                    className="
                                        text-red-700
                                        dark:text-red-300
                                    "
                                >
                                    Raison de perte
                                </Label>

                                <Textarea
                                    id="lossReason"
                                    rows={3}
                                    placeholder="Pourquoi le prospect n’a-t-il pas été converti ?"
                                    {...register(
                                        "lossReason"
                                    )}
                                />

                                <FieldError
                                    message={
                                        errors
                                            .lossReason
                                            ?.message
                                    }
                                />
                            </div>
                        )}

                        {/* Confirmation gagné */}

                        {selectedStage ===
                            "gagne" && (
                            <div
                                className="
                                    flex items-start
                                    gap-3 rounded-xl
                                    border
                                    border-emerald-200
                                    bg-emerald-50 p-4
                                    text-emerald-700
                                    dark:border-emerald-900
                                    dark:bg-emerald-950/40
                                    dark:text-emerald-300
                                "
                            >
                                <Handshake className="mt-0.5 size-5 shrink-0" />

                                <div>
                                    <p className="font-medium">
                                        Confirmation du
                                        closing
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Le dossier sera
                                        marqué comme gagné.
                                        Il pourra ensuite
                                        être transmis à la
                                        comptabilité pour
                                        créer la vente.
                                    </p>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={
                                    updateMutation
                                        .isPending
                                }
                                onClick={() =>
                                    handleOpenChange(
                                        false
                                    )
                                }
                            >
                                Annuler
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    updateMutation
                                        .isPending ||
                                    !isDirty
                                }
                            >
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2
                                            className="
                                                size-4
                                                animate-spin
                                            "
                                        />

                                        Enregistrement...
                                    </>
                                ) : (
                                    "Enregistrer les modifications"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}