"use client";

import { useMemo, useState } from "react";
import {
    Controller,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Building2,
    Calculator,
    Loader2,
    Plus,
    ReceiptText,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";

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
    PaymentSchedule,
    Sale,
} from "@/core/types/ventes/type";
import { TSites } from "@/core/types/sites";
import ProspectPhoneSearch from "../forms/ProspectSearch";
import { useSite } from "@/core/hooks/sites/useSite";
import { useCreateSale } from "@/core/hooks/sales/useSales";
import { CreateSaleFormValues, createSaleSchema } from "@/core/lib/validations/sales/Sales";

type CreateSaleDialogProps = {
    prospectId?: string;
    prospectPhone?: string;
    onCreated?: (sale: Sale) => void;
};

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function CreateSaleDialog({
   
    prospectId,
    prospectPhone,
    onCreated,
}: CreateSaleDialogProps) {
    const [open, setOpen] = useState(false);
    const { data: sites = [], isLoading } = useSite()
    const {mutate :createSaleMutation, isPending} = useCreateSale();

    const form = useForm<CreateSaleFormValues>({
        resolver: zodResolver(createSaleSchema),
        mode: "onTouched",
        defaultValues: {
            prospect_id: prospectId ?? "",
            site_id: "",
            sale_amount: 0,
            payment_schedule: "comptant",
            installment_count: undefined,
            first_due_date: "",
            notes: "",
        },
    });

    const selectedSiteId = form.watch("site_id");
    const saleAmount = form.watch("sale_amount");
    const paymentSchedule = form.watch(
        "payment_schedule"
    );
    const installmentCount = form.watch(
        "installment_count"
    );

    const selectedSite = useMemo(
        () =>
            sites.find(
                (site) => site.id === selectedSiteId
            ),
        [sites, selectedSiteId]
    );

    const estimatedInstallment = useMemo(() => {
        if (
            paymentSchedule !== "echelonne" ||
            !installmentCount ||
            installmentCount < 2 ||
            saleAmount <= 0
        ) {
            return 0;
        }

        return saleAmount / installmentCount;
    }, [
        installmentCount,
        paymentSchedule,
        saleAmount,
    ]);

    function resetForm(): void {
        form.reset({
            prospect_id: prospectId ?? "",
            site_id: "",
            sale_amount: 0,
            payment_schedule: "comptant",
            installment_count: undefined,
            first_due_date: "",
            notes: "",
        });
    }

    async function onSubmit(
        values: CreateSaleFormValues
    ): Promise<void> {
        try {
            console.log('VALUES', values)
            createSaleMutation(values);

           

           //
           
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Impossible de créer la vente";

            toast.error(message);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);

                if (
                    !value &&
                    !isPending
                ) {
                    resetForm();
                }
            }}
        >
            <DialogTrigger>
                <Button>
                    <Plus className="mr-2 size-4" />
                    Nouvelle vente
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ReceiptText className="size-5 text-primary" />
                        Enregistrer une vente
                    </DialogTitle>

                    <DialogDescription>
                        Associez un prospect à son site,
                        puis définissez les conditions de
                        paiement.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="create-sale-form"
                    onSubmit={form.handleSubmit(
                        onSubmit, (error)=> console.log(error)
                    )}
                    
                >
                    <FieldGroup className="grid gap-5 md:grid-cols-2">
                        <Controller
                            name="prospect_id"
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
                                        className="flex items-center gap-2"
                                    >
                                        <UserRound className="size-4" />
                                        Prospect
                                    </FieldLabel>

                                    {prospectId ? (
                                        <Input
                                            id={field.name}
                                            value={
                                                prospectPhone ??
                                                "Prospect sélectionné"
                                            }
                                            disabled
                                        />
                                    ) : (
                                        <ProspectPhoneSearch
                                            value={field.value}
                                            onChange={(
                                                value
                                            ) => {
                                                field.onChange(
                                                    value
                                                );
                                            }}
                                        />
                                    )}

                                    <FieldDescription>
                                        Une vente ne peut être
                                        associée qu’à un seul
                                        prospect.
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
                            name="site_id"
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
                                        className="flex items-center gap-2"
                                    >
                                        <Building2 className="size-4" />
                                        Site choisi
                                    </FieldLabel>

                                    <Select
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={
                                            field.onChange
                                        }
                                    >
                                        <SelectTrigger
                                            id={field.name}
                                            className="w-full"
                                            aria-invalid={
                                                fieldState.invalid
                                            }
                                        >
                                            <SelectValue placeholder="Sélectionner le site choisi par le prospect" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {sites.map(
                                                (site) => (
                                                    <SelectItem
                                                        key={
                                                            site.id
                                                        }
                                                        value={
                                                            site.id
                                                        }
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {
                                                                    site.nom_titre
                                                                }
                                                            </span>

                                                            {site.localisation_precise && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {
                                                                        site.localisation_precise
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                )
                                            )}
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

                        {selectedSite && (
                            <div className="rounded-xl border bg-muted/40 p-4 md:col-span-2">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                        <Building2 className="size-5" />
                                    </div>

                                    <div>
                                        <p className="font-semibold">
                                            {
                                                selectedSite.nom_titre
                                            }
                                        </p>

                                        {selectedSite.localisation_precise && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {
                                                    selectedSite.localisation_precise
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Controller
                            name="sale_amount"
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
                                        Montant de la vente
                                    </FieldLabel>

                                    <div className="relative">
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            min={1}
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
                                            placeholder="Ex. 5 000 000"
                                            className="pr-16"
                                            aria-invalid={
                                                fieldState.invalid
                                            }
                                        />

                                        <span className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                                            FCFA
                                        </span>
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
    name="payment_schedule"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field
            data-invalid={fieldState.invalid}
        >
            <FieldLabel htmlFor={field.name}>
                Modalité de paiement
            </FieldLabel>

            <Select
                name={field.name}
                value={field.value}
                onValueChange={(value) => {
                    if (value === null) {
                        return;
                    }

                    field.onChange(value);

                    if (value === "comptant") {
                        form.setValue(
                            "installment_count",
                            undefined
                        );

                        form.setValue(
                            "first_due_date",
                            ""
                        );

                        form.clearErrors([
                            "installment_count",
                            "first_due_date",
                        ]);
                    }
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
                    <SelectItem value="comptant">
                        Paiement total
                    </SelectItem>

                    <SelectItem value="echelonne">
                        Paiement échelonné
                    </SelectItem>
                </SelectContent>
            </Select>

            {fieldState.invalid && (
                <FieldError
                    errors={[fieldState.error]}
                />
            )}
        </Field>
    )}
/>

                        {paymentSchedule ===
                            "echelonne" && (
                            <>
                                <Controller
                                    name="installment_count"
                                    control={
                                        form.control
                                    }
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
                                                htmlFor={
                                                    field.name
                                                }
                                            >
                                                Nombre
                                                d’échéances
                                            </FieldLabel>

                                            <Input
                                                id={
                                                    field.name
                                                }
                                                name={
                                                    field.name
                                                }
                                                type="number"
                                                min={2}
                                                max={60}
                                                value={
                                                    field.value ??
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
                                                            ? undefined
                                                            : Number(
                                                                  value
                                                              )
                                                    );
                                                }}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Ex. 5"
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

                                <Controller
                                    name="first_due_date"
                                    control={
                                        form.control
                                    }
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
                                                htmlFor={
                                                    field.name
                                                }
                                            >
                                                Première
                                                échéance
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id={
                                                    field.name
                                                }
                                                type="date"
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
                            </>
                        )}

                        {paymentSchedule ===
                            "echelonne" &&
                            estimatedInstallment > 0 && (
                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 md:col-span-2">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                            <Calculator className="size-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Montant
                                                estimatif par
                                                échéance
                                            </p>

                                            <p className="mt-1 text-lg font-semibold">
                                                {formatCurrency(
                                                    estimatedInstallment
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Les arrondis
                                                éventuels seront
                                                appliqués à la
                                                dernière échéance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        <Separator className="md:col-span-2" />

                        <Controller
                            name="notes"
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
                                        Notes
                                    </FieldLabel>

                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        rows={3}
                                        className="resize-none"
                                        placeholder="Informations complémentaires sur la vente..."
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
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={
                                isPending
                            }
                        >
                            Annuler
                        </Button>
                    </DialogClose>

                    <Button
                        type="submit"
                        form="create-sale-form"
                        disabled={
                            isPending
                        }
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <ReceiptText className="mr-2 size-4" />
                        )}

                        Créer la vente
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}