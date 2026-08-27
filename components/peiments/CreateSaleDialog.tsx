"use client";

import { useEffect, useMemo } from "react";

import { CalendarIcon, Loader2 } from "lucide-react";

import {
    Controller,
    Form,
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";




import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";



import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Separator,
} from "@/components/ui/separator";

import {
    Calendar,
} from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";


import { SaleFormValues, saleSchema } from "@/core/lib/validations/clients/sale-schema";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import ProspectPhoneSearch from "../forms/ProspectSearch";

interface CreateSaleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    prospectId?: string;
    // prospects: ProspectOption[];
    // sites: SiteOption[];

    isSubmitting?: boolean;

    onSubmit: (
        values: SaleFormValues
    ) => Promise<void>;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDateForInput(
    date: Date
): string {
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseInputDate(
    value: string
): Date | undefined {
    if (!value) {
        return undefined;
    }

    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? undefined
        : date;
}
type ActivityCreateDialogProps = {

};
export function CreateSaleDialog({
    open,
    onOpenChange,

    isSubmitting = false,

    onSubmit,

    prospectId

}: CreateSaleDialogProps) {
    const form = useForm<SaleFormValues>({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            prospectId: "",
            siteId: null,
            saleAmount: "",
            paymentSchedule: "comptant",
            firstPaymentAmount: "",
            paymentMethod: "mobile_money",
            paymentDate:
                formatDateForInput(new Date()),
            transactionReference: "",
            notes: "",
        },
    });

    const paymentSchedule =
        form.watch("paymentSchedule");

    const saleAmount =
        form.watch("saleAmount");

    const firstPaymentAmount =
        form.watch("firstPaymentAmount");

    const remainingAmount = useMemo(() => {
        const total = Number(saleAmount);
        const paid = Number(firstPaymentAmount);

        if (
            !Number.isFinite(total) ||
            !Number.isFinite(paid)
        ) {
            return 0;
        }

        return Math.max(total - paid, 0);
    }, [
        saleAmount,
        firstPaymentAmount,
    ]);

    useEffect(() => {
        if (
            paymentSchedule === "comptant" &&
            saleAmount
        ) {
            form.setValue(
                "firstPaymentAmount",
                saleAmount,
                {
                    shouldValidate: true,
                }
            );
        }
    }, [
        paymentSchedule,
        saleAmount,
        form,
    ]);

    const handleOpenChange = (
        nextOpen: boolean
    ) => {
        if (!nextOpen && !isSubmitting) {
            form.reset();
        }

        onOpenChange(nextOpen);
    };

    const handleSubmit = async (
        values: SaleFormValues
    ) => {
        await onSubmit(values);

        form.reset();
    };

    // Helper to get error message for a field
    /*  const getError = (field: keyof SaleFormValues) => {
         return errors[field]?.message as string | undefined;
     };
 
  */
    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>
                        Nouvelle vente
                    </DialogTitle>

                    <DialogDescription>
                        Enregistrez une vente et son premier
                        paiement. Le prospect deviendra
                        automatiquement client après confirmation
                        du paiement.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(
                            handleSubmit
                        )}
                        className="space-y-6"
                    >
                        {/* PROSPECT */}

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">
                                    Client
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Sélectionnez le prospect
                                    concerné par cette vente.
                                </p>
                            </div>

                            {/* <FieldGroup>
                                <Field className="md:col-span-2">
                                    <Label htmlFor="full_name" className="required">
                                        Numéro de Telephone
                                    </Label>

                                    {prospectId ? (
                                        <Input
                                            value="Numéro sélectionné"
                                            disabled
                                        />
                                    ) : (
                                        <Controller
                                            name="prospect_id"
                                            control={control}
                                            render={({ field }) => (
                                                <ProspectPhoneSearch
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    )}


                                    {getError("prospect_id") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("prospect_id")}</p>
                                    )}
                                </Field>
                            </FieldGroup> */}

                        </div>

                        <Separator />

                        {/* VENTE

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">
                                    Informations de la vente
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Définissez le terrain et le
                                    montant de la vente.
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="siteId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Terrain / Site
                                        </FormLabel>

                                        <FormControl>
                                            <SiteCommand
                                                sites={sites}
                                                value={
                                                    field.value
                                                }
                                                onChange={
                                                    field.onChange
                                                }
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="saleAmount"
                                    render={({
                                        field,
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Montant de la vente
                                            </FormLabel>

                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        placeholder="10 000 000"
                                                        className="pr-14"
                                                        disabled={
                                                            isSubmitting
                                                        }
                                                    />

                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                                        FCFA
                                                    </span>
                                                </div>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="paymentSchedule"
                                    render={({
                                        field,
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Type de règlement
                                            </FormLabel>

                                            <Select
                                                value={
                                                    field.value
                                                }
                                                onValueChange={
                                                    field.onChange
                                                }
                                                disabled={
                                                    isSubmitting
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="comptant">
                                                        Paiement comptant
                                                    </SelectItem>

                                                    <SelectItem value="echelonne">
                                                        Paiement échelonné
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div> */}

                        <Separator />

                        {/* PAIEMENT 

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">
                                    Premier paiement
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Tout paiement confirmé
                                    transforme automatiquement le
                                    prospect en client.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="firstPaymentAmount"
                                    render={({
                                        field,
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Montant payé
                                            </FormLabel>

                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        placeholder="2 000 000"
                                                        className="pr-14"
                                                        disabled={
                                                            isSubmitting ||
                                                            paymentSchedule ===
                                                            "comptant"
                                                        }
                                                    />

                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                                        FCFA
                                                    </span>
                                                </div>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({
                                        field,
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Mode de paiement
                                            </FormLabel>

                                            <Select
                                                value={
                                                    field.value
                                                }
                                                onValueChange={
                                                    field.onChange
                                                }
                                                disabled={
                                                    isSubmitting
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="mobile_money">
                                                        Mobile Money
                                                    </SelectItem>

                                                    <SelectItem value="virement">
                                                        Virement bancaire
                                                    </SelectItem>

                                                    <SelectItem value="especes">
                                                        Espèces
                                                    </SelectItem>

                                                    <SelectItem value="cheque">
                                                        Chèque
                                                    </SelectItem>

                                                    <SelectItem value="carte">
                                                        Carte bancaire
                                                    </SelectItem>

                                                    <SelectItem value="autre">
                                                        Autre
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="paymentDate"
                                    render={({
                                        field,
                                    }) => {
                                        const selectedDate =
                                            parseInputDate(
                                                field.value
                                            );

                                        return (
                                            <FormItem>
                                                <FormLabel>
                                                    Date du paiement
                                                </FormLabel>

                                                <Popover>
                                                    <PopoverTrigger
                                                        asChild
                                                    >
                                                        <FormControl>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !field.value &&
                                                                    "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />

                                                                {selectedDate
                                                                    ? new Intl.DateTimeFormat(
                                                                        "fr-FR",
                                                                        {
                                                                            dateStyle:
                                                                                "medium",
                                                                        }
                                                                    ).format(
                                                                        selectedDate
                                                                    )
                                                                    : "Sélectionner une date"}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>

                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                selectedDate
                                                            }
                                                            onSelect={(
                                                                date
                                                            ) => {
                                                                if (
                                                                    date
                                                                ) {
                                                                    field.onChange(
                                                                        formatDateForInput(
                                                                            date
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>

                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="transactionReference"
                                    render={({
                                        field,
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Référence transaction
                                                <span className="ml-1 text-muted-foreground">
                                                    (optionnel)
                                                </span>
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Ex: OM-123456789"
                                                    disabled={
                                                        isSubmitting
                                                    }
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* SOLDE *

                            <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Reste à payer
                                        </p>

                                        <p className="mt-1 text-xl font-bold">
                                            {formatCurrency(
                                                remainingAmount
                                            )}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">
                                            Après ce paiement
                                        </p>

                                        <p className="text-sm font-medium">
                                            {paymentSchedule ===
                                                "comptant"
                                                ? "Vente soldée"
                                                : "Vente active"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>*/}

                        <Separator />

                        {/* NOTES 

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Notes
                                        <span className="ml-1 text-muted-foreground">
                                            (optionnel)
                                        </span>
                                    </FormLabel>

                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Informations complémentaires..."
                                            rows={3}
                                            disabled={
                                                isSubmitting
                                            }
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />*/}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    handleOpenChange(
                                        false
                                    )
                                }
                                disabled={
                                    isSubmitting
                                }
                            >
                                Annuler
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                            >
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}

                                Enregistrer la vente
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}