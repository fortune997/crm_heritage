// components/payments/RegisterPaymentDialog.tsx

"use client";

import {
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    Controller,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Banknote,
    Building2,
    CalendarDays,
    CheckCircle2,
    Loader2,
    ReceiptText,
    UserRound,
    WalletCards,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import type {
    Payment,
    PaymentMethod,
 
    PaymentStatus,
 
    Sale,
} from "@/core/types/ventes/type";
import { useCreatePayment } from "@/core/hooks/payments/usePayments";
import { useAuth } from "@/contexts/AuthContext";

const PAYMENT_METHODS = {
    CASH: "especes",
    MOBILE_MONEY: "mobile_money",
    BANK_TRANSFER: "virement",
    CHECK: "cheque",
} as const satisfies Record<string, PaymentMethod>;

const PAYMENT_STATUSES = {
    CONFIRMED: "confirme",
    PENDING: "en_attente",
} as const satisfies Record<string, PaymentStatus>;

const registerPaymentSchema = z
    .object({
        amount: z
            .number({
                message:
                    "Le montant du paiement est obligatoire",
            })
            .positive(
                "Le montant doit être supérieur à zéro"
            ),

        payment_method: z.enum([
            PAYMENT_METHODS.CASH,
            PAYMENT_METHODS.MOBILE_MONEY,
            PAYMENT_METHODS.BANK_TRANSFER,
            PAYMENT_METHODS.CHECK,
        ]),

        status: z.enum([
            PAYMENT_STATUSES.CONFIRMED,
            PAYMENT_STATUSES.PENDING,
        ]),

        payment_date: z
            .string()
            .min(
                1,
                "La date du paiement est obligatoire"
            ),

        transaction_reference: z
            .string()
            .trim()
            .max(
                100,
                "Maximum 100 caractères"
            )
            .optional(),

        notes: z
            .string()
            .trim()
            .max(
                500,
                "Maximum 500 caractères"
            )
            .optional(),
    })
    .superRefine((values, context) => {
        const requiresReference =
            values.payment_method !==
            PAYMENT_METHODS.CASH;

        if (
            requiresReference &&
            !values.transaction_reference
        ) {
            context.addIssue({
                code: "custom",
                path: ["transaction_reference"],
                message:
                    "La référence est obligatoire pour ce mode de paiement",
            });
        }
    });

type RegisterPaymentFormValues = z.infer<
    typeof registerPaymentSchema
>;

type RegisterPaymentDialogProps = {
    sale: Sale;
    trigger?: ReactNode;
    onCreated?: (payment: Payment) => void;
};

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(amount);
}

function getToday(): string {
    const currentDate = new Date();
    const timezoneOffset =
        currentDate.getTimezoneOffset() * 60_000;

    return new Date(
        currentDate.getTime() - timezoneOffset
    )
        .toISOString()
        .split("T")[0];
}

export function RegisterPaymentDialog({
    sale,
    trigger,
    onCreated,
}: RegisterPaymentDialogProps) {
    const [open, setOpen] = useState(false);
const { profile } = useAuth();
    const {
        mutateAsync: createPayment,
        isPending,
    } = useCreatePayment();

    const isCashSale =
        sale.payment_schedule === "comptant";

    const isFullyPaid =
        sale.remaining_amount <= 0;

    const isCancelled = [
        "annulee",
        "annule",
        "cancelled",
    ].includes(String(sale.status));

    const canReceivePayment =
        !isFullyPaid && !isCancelled;

    function getDefaultValues(): RegisterPaymentFormValues {
        return {
            amount: isCashSale
                ? sale.remaining_amount
                : 0,
            payment_method:
                PAYMENT_METHODS.CASH,
            status:
                PAYMENT_STATUSES.CONFIRMED,
            payment_date: getToday(),
            transaction_reference: "",
            notes: "",
        };
    }

    const form =
        useForm<RegisterPaymentFormValues>({
            resolver: zodResolver(
                registerPaymentSchema
            ),
            mode: "onTouched",
            defaultValues: getDefaultValues(),
        });

    const selectedMethod = form.watch(
        "payment_method"
    );

    const enteredAmount = form.watch("amount");

    const remainingAfterPayment = useMemo(() => {
        if (
            enteredAmount <= 0 ||
            enteredAmount >
                sale.remaining_amount
        ) {
            return sale.remaining_amount;
        }

        return (
            sale.remaining_amount -
            enteredAmount
        );
    }, [
        enteredAmount,
        sale.remaining_amount,
    ]);

    function resetForm(): void {
        form.reset(getDefaultValues());
    }

    async function onSubmit(
    values: RegisterPaymentFormValues
): Promise<void> {
    if (!profile?.id) {
        toast.error(
            "Utilisateur non authentifié"
        );
        return;
    }

    if (!canReceivePayment) {
        toast.error(
            "Cette vente ne peut plus recevoir de paiement"
        );
        return;
    }

    if (
        values.amount >
        sale.remaining_amount
    ) {
        form.setError("amount", {
            type: "validate",
            message: `Le montant maximum est ${formatCurrency(
                sale.remaining_amount
            )}`,
        });

        return;
    }

    try {
        const payment = await createPayment({
            sale_id: sale.id,
            amount: values.amount,
            payment_method:
                values.payment_method,
            status: values.status,
            payment_date:
                values.payment_date,
            transaction_reference:
                values.transaction_reference ||
                null,
            notes: values.notes || null,

            // Utilisateur connecté
            created_by: profile.id,
        });

        toast.success(
            `Paiement ${payment.reference} enregistré`
        );
        setOpen(false);
        resetForm();
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Impossible d’enregistrer le paiement";

        toast.error(message);
    }
}

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (
                    !value &&
                    isPending
                ) {
                    return;
                }

                setOpen(value);

                if (value) {
                    resetForm();
                }
            }}
        >
            <DialogTrigger >
                {trigger ?? (
                    <Button
                        type="button"
                        disabled={!canReceivePayment}
                    >
                        <Banknote className="mr-2 size-4" />
                        Enregistrer un paiement
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Banknote className="size-5 text-primary" />
                        Enregistrer un paiement
                    </DialogTitle>

                    <DialogDescription>
                        Le paiement sera associé à la
                        vente {sale.reference}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2">
                    <InformationItem
                        icon={UserRound}
                        label="Prospect"
                        value={sale.prospects?.full_name}
                    />

                    <InformationItem
                        icon={WalletCards}
                        label="Téléphone"
                        value={sale.prospects?.phone}
                    />

                <InformationItem
    icon={Building2}
    label="Site"
    value={
        sale.sites?.nom_titre ??
        "Site non renseigné"
    }
/>

                    <InformationItem
                        icon={ReceiptText}
                        label="Référence vente"
                        value={sale.reference}
                    />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <AmountItem
                        label="Montant de la vente"
                        amount={sale.sale_amount}
                    />

                    <AmountItem
                        label="Total payé"
                        amount={sale.total_paid}
                        variant="success"
                    />

                    <AmountItem
                        label="Reste à payer"
                        amount={
                            sale.remaining_amount
                        }
                        variant="warning"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                        {isCashSale
                            ? "Paiement comptant"
                            : "Paiement échelonné"}
                    </Badge>

                    {isFullyPaid && (
                        <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">
                            <CheckCircle2 className="mr-1 size-3" />
                            Vente soldée
                        </Badge>
                    )}
                </div>

                <Separator />

                <form
                    id={`register-payment-${sale.id}`}
                    onSubmit={form.handleSubmit(
                        onSubmit
                    )}
                    noValidate
                >
                    <FieldGroup className="grid gap-5 md:grid-cols-2">
                        <Controller
                            name="amount"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    className="md:col-span-2"
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Montant payé
                                    </FieldLabel>

                                    <div className="relative">
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            min={1}
                                            max={
                                                sale.remaining_amount
                                            }
                                            step={1}
                                            value={
                                                field.value ||
                                                ""
                                            }
                                            onBlur={
                                                field.onBlur
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                const value =
                                                    event
                                                        .target
                                                        .value;

                                                field.onChange(
                                                    value ===
                                                        ""
                                                        ? 0
                                                        : Number(
                                                              value
                                                          )
                                                );
                                            }}
                                            placeholder="Ex. 500 000"
                                            className="pr-16"
                                            aria-invalid={
                                                fieldState.invalid
                                            }
                                            disabled={
                                                isCashSale
                                            }
                                        />

                                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                                            FCFA
                                        </span>
                                    </div>

                                    <FieldDescription>
                                        {isCashSale
                                            ? "Le montant comptant correspond au reste à payer."
                                            : `Maximum : ${formatCurrency(
                                                  sale.remaining_amount
                                              )}`}
                                    </FieldDescription>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="payment_method"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Mode de paiement
                                    </FieldLabel>

                                   <Select
    name={field.name}
    value={field.value}
    onValueChange={(value) => {
        /*
         * Le Select peut retourner null lorsqu'il
         * réinitialise la sélection.
         */
        if (value === null) {
            return;
        }

        field.onChange(value);

        if (
            value ===
            PAYMENT_METHODS.CASH
        ) {
            form.setValue(
                "transaction_reference",
                ""
            );

            form.clearErrors(
                "transaction_reference"
            );
        }
    }}
>
    <SelectTrigger
        id={field.name}
        className="w-full"
        aria-invalid={fieldState.invalid}
    >
        <SelectValue placeholder="Sélectionner" />
    </SelectTrigger>

    <SelectContent>
        <SelectItem
            value={PAYMENT_METHODS.CASH}
        >
            Espèces
        </SelectItem>

        <SelectItem
            value={
                PAYMENT_METHODS.MOBILE_MONEY
            }
        >
            Mobile Money
        </SelectItem>

        <SelectItem
            value={
                PAYMENT_METHODS.BANK_TRANSFER
            }
        >
            Virement bancaire
        </SelectItem>

        <SelectItem
            value={PAYMENT_METHODS.CHECK}
        >
            Chèque
        </SelectItem>

       

        
    </SelectContent>
</Select>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="payment_date"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Date du paiement
                                    </FieldLabel>

                                    <div className="relative">
                                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="date"
                                            className="pl-9"
                                            aria-invalid={
                                                fieldState.invalid
                                            }
                                        />
                                    </div>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                       <Controller
    name="status"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field
            data-invalid={fieldState.invalid}
        >
            <FieldLabel htmlFor={field.name}>
                Statut
            </FieldLabel>

            <Select
                name={field.name}
                value={field.value}
                onValueChange={(value) => {
                    if (value === null) {
                        return;
                    }

                    field.onChange(value);
                }}
            >
                <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={
                        fieldState.invalid
                    }
                >
                    <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="confirme">
                        Confirmé
                    </SelectItem>

                    <SelectItem value="en_attente">
                        En attente
                    </SelectItem>
                </SelectContent>
            </Select>

            <FieldDescription>
                Seul un paiement confirmé réduit le
                reste à payer.
            </FieldDescription>

            {fieldState.invalid && (
                <FieldError
                    errors={[fieldState.error]}
                />
            )}
        </Field>
    )}
/>

                        <Controller
                            name="transaction_reference"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Référence de transaction
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Ex. MOMO-2026-00125"
                                        disabled={
                                            selectedMethod ===
                                            PAYMENT_METHODS.CASH
                                        }
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                    />

                                    <FieldDescription>
                                        Obligatoire sauf pour
                                        un paiement en espèces.
                                    </FieldDescription>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="notes"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Notes
                                    </FieldLabel>

                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        rows={3}
                                        className="resize-none"
                                        placeholder="Informations complémentaires..."
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {enteredAmount > 0 && (
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 md:col-span-2">
                                <p className="text-xs text-muted-foreground">
                                    Reste après confirmation
                                </p>

                                <p className="mt-1 text-lg font-bold text-primary">
                                    {formatCurrency(
                                        remainingAfterPayment
                                    )}
                                </p>
                            </div>
                        )}
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose >
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                        >
                            Annuler
                        </Button>
                    </DialogClose>

                    <Button
                        type="submit"
                        form={`register-payment-${sale.id}`}
                        disabled={
                            isPending ||
                            !canReceivePayment
                        }
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Banknote className="mr-2 size-4" />
                        )}

                        Confirmer le paiement
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function InformationItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof UserRound;
    label: string;
    value: string | null | undefined;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm">
                <Icon className="size-4" />
            </div>

            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                    {label}
                </p>

                <p className="truncate text-sm font-medium">
                    {value || "Non renseigné"}
                </p>
            </div>
        </div>
    );
}

function AmountItem({
    label,
    amount,
    variant = "default",
}: {
    label: string;
    amount: number;
    variant?:
        | "default"
        | "success"
        | "warning";
}) {
    return (
        <div
            className={
                variant === "success"
                    ? "rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3"
                    : variant === "warning"
                      ? "rounded-xl border border-orange-500/20 bg-orange-500/5 p-3"
                      : "rounded-xl border bg-muted/20 p-3"
            }
        >
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p
                className={
                    variant === "success"
                        ? "mt-1 font-bold text-emerald-700 dark:text-emerald-400"
                        : variant === "warning"
                          ? "mt-1 font-bold text-orange-700 dark:text-orange-400"
                          : "mt-1 font-bold"
                }
            >
                {formatCurrency(amount)}
            </p>
        </div>
    );
}