"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AcquisitionChannelFormValues, acquisitionChannelSchema } from "@/core/lib/validations/canals";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useAddCanal } from "@/core/hooks/canal/useCanal";




export function AcquisitionChannelForm() {
    const { mutate: createCanal, isPending } = useAddCanal()

    const form = useForm<AcquisitionChannelFormValues>({
        resolver: zodResolver(acquisitionChannelSchema),
        defaultValues: {
            nom: "",
            type: "",
            category: "",
            statut: true,
            owner: "",
            description: "",
            cost: "",
            leads: "",
            qualifiedLeads: "",
            conversions: "",
        }
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    const onSubmit = (values: AcquisitionChannelFormValues) => {
        console.log(values);
        createCanal(values)

    };

    // Helper to get error message for a field
    const getError = (field: keyof AcquisitionChannelFormValues) => {
        return errors[field]?.message as string | undefined;
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit,
                (errors) => {
                    console.log("Erreurs :", errors);
                }
            )}
            className="space-y-6"
        >
            <div className="grid gap-4 md:grid-cols-2">

                <Field className="">
                    <Label htmlFor="nom" className="required">
                        Nom du canal
                    </Label>
                    <Controller
                        name="nom"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="nom"
                                placeholder="Facebook"
                                {...field}
                                aria-invalid={!!getError("nom")}
                            />
                        )}
                    />
                    {getError("nom") && (
                        <p className="text-sm text-red-500 mt-1">{getError("nom")}</p>
                    )}
                </Field>

                <Field>
                    <Label htmlFor="owner" className="required">
                        Responsable
                    </Label>
                    <Controller
                        name="owner"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <SelectTrigger id="owner" aria-invalid={!!getError("owner")}>
                                    <SelectValue placeholder="Select interest type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alexis">Nziele Alexis</SelectItem>
                                    <SelectItem value="schekina">Ebembi Schekina</SelectItem>
                                    <SelectItem value="marlyse">Marlyse Moukala</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {getError("owner") && (
                        <p className="text-sm text-red-500 mt-1">{getError("owner")}</p>
                    )}
                </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Field
                >
                    <Label htmlFor="type" className="required">
                        Type de canal
                    </Label>
                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir..." />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="Réseau social">
                                        Réseau social
                                    </SelectItem>

                                    <SelectItem value="Publicité">
                                        Publicité
                                    </SelectItem>

                                    <SelectItem value="Email">
                                        Email
                                    </SelectItem>

                                    <SelectItem value="Téléphone">
                                        Téléphone
                                    </SelectItem>

                                    <SelectItem value="Physique">
                                        Physique
                                    </SelectItem>

                                    <SelectItem value="Autre">
                                        Autre
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>

                <Field>
                    <Label htmlFor="category" className="required">
                        Catégorie
                    </Label>
                    <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir..." />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="Digital">
                                        Digital
                                    </SelectItem>

                                    <SelectItem value="Offline">
                                        Offline
                                    </SelectItem>

                                    <SelectItem value="Partenariat">
                                        Partenariat
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>

                <Field>
                    <Label htmlFor="statut" className="required">
                        Statut
                    </Label>
                    <Controller
                        control={control}
                        name="statut"
                        render={({ field }) => (
                            <Select
                                value={field.value ? "true" : "false"}
                                onValueChange={(value) => field.onChange(value === "true")}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value={true}>
                                        Actif
                                    </SelectItem>

                                    <SelectItem value={false}>
                                        Inactif
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Field className="">
                    <Label htmlFor="name" className="required">
                        Coût (FCFA)
                    </Label>
                    <Controller
                        name="cost"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="cost"
                                placeholder="cost"
                                {...field}
                                aria-invalid={!!getError("cost")}
                            />
                        )}
                    />
                    {getError("cost") && (
                        <p className="text-sm text-red-500 mt-1">{getError("cost")}</p>
                    )}
                </Field>



                <Field className="">
                    <Label htmlFor="name" className="required">
                        Leads générés
                    </Label>
                    <Controller
                        name="leads"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="leads"
                                placeholder="Nombre de leads"
                                {...field}
                                aria-invalid={!!getError("leads")}
                            />
                        )}
                    />
                    {getError("leads") && (
                        <p className="text-sm text-red-500 mt-1">{getError("leads")}</p>
                    )}
                </Field>

                <Field className="">
                    <Label htmlFor="name" className="required">
                        Leads qualifiés
                    </Label>
                    <Controller
                        name="qualifiedLeads"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="qualifiedLeads"
                                placeholder="Facebook"
                                {...field}
                                aria-invalid={!!getError("qualifiedLeads")}
                            />
                        )}
                    />
                    {getError("qualifiedLeads") && (
                        <p className="text-sm text-red-500 mt-1">{getError("qualifiedLeads")}</p>
                    )}
                </Field>


                <Field className="">
                    <Label htmlFor="name" className="required">
                        Conversions
                    </Label>
                    <Controller
                        name="conversions"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="conversions"
                                placeholder="Facebook"
                                {...field}
                                aria-invalid={!!getError("conversions")}
                            />
                        )}
                    />
                    {getError("conversions") && (
                        <p className="text-sm text-red-500 mt-1">{getError("conversions")}</p>
                    )}
                </Field>
            </div>

            <Field>
                <Label htmlFor="owner" className="required">
                    Description
                </Label>
                <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <Textarea
                            rows={5}
                            placeholder="Description du canal..."
                            {...field}
                        />
                    )}
                />
            </Field>

            <Button type="submit">
                {isPending ? 'Enregistrement en cours ' : 'Enregistrez'}
            </Button>
        </form>
    );
}