"use client";

import {
    CalendarDays,
    Clock,
    MapPin,
    X,
} from "lucide-react";

import {
    Controller,
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import ProspectPhoneSearch from "../forms/ProspectSearch";
import { ScheduleVisitFormValues, scheduleVisitSchema } from "@/core/lib/validations/visites";
import { Label } from "../ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNewVisite } from "@/core/hooks/visites/useVisite";
import { toast } from "sonner";
import { useSite } from "@/core/hooks/sites/useSite";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ScheduleVisitDialog({
    open,
    onOpenChange,
    onSuccess,
}: Props) {
    const { mutate: createVisite, isPending } = useNewVisite()
    const { data: sites = [], isLoading } = useSite()
    const { user } = useAuth()

    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<ScheduleVisitFormValues>({
        resolver: zodResolver(
            scheduleVisitSchema
        ),

        defaultValues: {
            prospect_id: "",
            site_id: "",
            visit_type: "terrain",
            visit_date: new Date()
                .toISOString()
                .split("T")[0],
            start_time: "10:00",

            location: "",
            notes: ""

        },
    });


    async function onSubmit(values: ScheduleVisitFormValues) {
        const userId = user?.id;

        if (!userId) {
            toast.error("Utilisateur non authentifié");
            return;
        }

        const newVisit = {
            ...values,
            created_by: userId,
        };


        try {
            await createVisite(newVisit);

            reset();
            onOpenChange(false);
            onSuccess?.();

        } catch (error) {
            console.error("Erreur complète :", error);

            if (error instanceof Error) {
                console.error("message :", error.message);
            }

            toast.error("Impossible de programmer la visite");
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                onClick={() =>
                    onOpenChange(false)
                }
            />

            {/* Container */}
            <div className="relative flex min-h-full items-end justify-center sm:items-center sm:p-4">
                <div className="flex max-h-[95vh] w-full flex-col overflow-hidden bg-background shadow-2xl sm:max-w-2xl sm:rounded-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-4 py-4 md:px-6">
                        <div>
                            <h2 className="text-lg font-bold">
                                Planifier une visite
                            </h2>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Créer un nouveau rendez-vous client
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit,
                            (error) => console.log('error', error)
                        )}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
                            <div className="space-y-6 w-full">
                                {/* Client */}
                                <section className="w-full">
                                    <Label className="mb-3 flex items-center gap-2">
                                        Client / Prospect
                                    </Label>

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

                                    {errors.prospect_id && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {
                                                errors.prospect_id
                                                    .message
                                            }
                                        </p>
                                    )}
                                </section>

                                {/* Informations visite */}
                                <section>


                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {/* Type */}
                                        <div>
                                            <Label className="mb-1.5 block text-sm font-medium">
                                                Type de visite
                                            </Label>

                                            <select
                                                {...register(
                                                    "visit_type"
                                                )}
                                                className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="terrain">
                                                    Visite terrain
                                                </option>

                                                <option value="bureau">
                                                    Visite bureau
                                                </option>


                                            </select>
                                        </div>

                                        {/* Date */}
                                        <div>
                                            <Label className="mb-1.5 block text-sm font-medium">
                                                Date
                                            </Label>

                                            <div className="relative">
                                                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                <input
                                                    type="date"
                                                    {...register(
                                                        "visit_date"
                                                    )}
                                                    className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>

                                            {errors.visit_date && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {
                                                        errors.visit_date
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Heure début */}
                                        <div>
                                            <Label className="mb-1.5 block text-sm font-medium">
                                                Heure de début
                                            </Label>

                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                <input
                                                    type="time"
                                                    {...register(
                                                        "start_time"
                                                    )}
                                                    className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>

                                        {/* Commercial */}
                                        <section>



                                            <Controller
                                                name="site_id"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="site_id"
                                                            className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                                        >
                                                            Site
                                                        </label>

                                                        <select
                                                            {...field}
                                                            id="site_id"
                                                            value={field.value ?? ""}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            className="
                    w-full rounded-lg
                    border border-gray-300
                    bg-white text-gray-900
                    px-3 py-2.5 text-sm
                    outline-none
                    transition-colors
                    focus:border-primary
                    focus:ring-2 focus:ring-primary/20

                    dark:border-gray-700
                    dark:bg-gray-900
                    dark:text-gray-100
                    dark:focus:border-primary
                    dark:focus:ring-primary/20
                "
                                                        >
                                                            <option
                                                                value=""
                                                                className="bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                                                            >
                                                                Sélectionner un site
                                                            </option>

                                                            {sites?.map((site) => (
                                                                <option
                                                                    key={site.id}
                                                                    value={site.id}
                                                                    className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
                                                                >
                                                                    {site.nom_titre}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {errors.site_id?.message && (
                                                            <p className="text-sm text-red-500 dark:text-red-400">
                                                                {errors.site_id.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </section>
                                    </div>
                                </section>



                                {/* Lieu */}
                                <section>


                                    <div className="space-y-4">
                                        
                                          <div>
                                            <Label className="mb-1.5 block text-sm font-medium">
                                                <span>Lieu / point de rendez-vous</span>
                                                 <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            </Label>

                                            <select
                                                {...register(
                                                    "location"
                                                )}
                                                aria-placeholder="point de rencontre"
                                                className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="rail_boulangerie">
                                                    Boulangerie du rail
                                                </option>

                                                <option value="Carrefour_logbaba">
                                                   Bomono Gare
                                                </option>

                                                 <option value="Nyalla_pariso">
                                                   Total Nkolbong
                                                </option>
                                                 <option value="Nyalla_pariso">
                                                   Neptune PK14
                                                </option>
                                                <option value="Nyalla_pariso">
                                                   Rond Point Deido
                                                </option>
                                                <option value="Nyalla_pariso">
                                                   Carrefour TILO
                                                </option>
                                            </select>
                                        </div>

                                     

                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium">
                                                Notes
                                            </label>

                                            <textarea
                                                {...register(
                                                    "notes"
                                                )}
                                                rows={4}
                                                placeholder="Informations complémentaires..."
                                                className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </section>


                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex shrink-0 items-center justify-end gap-2 border-t bg-muted/20 px-4 py-3 md:px-6">
                            <button
                                type="button"
                                onClick={() =>
                                    onOpenChange(false)
                                }
                                className="h-10 rounded-lg border bg-background px-4 text-sm font-medium hover:bg-muted"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Enregistrement..."
                                    : "Planifier la visite"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

