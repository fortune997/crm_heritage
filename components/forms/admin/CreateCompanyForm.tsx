// features/companies/components/company-create-form.tsx

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";

import { toast } from "sonner";

import { createCompanyAction } from "@/core/actions/create-company.action";
import { CompanyFormValues, companySchema } from "@/lib/validations/schema";

export function CompanyCreateForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: "",
            slug: "",
            legal_name: "",
            company_type: "sci",
            email: "",
            phone: "",
            address: "",
            logo_url: "",
            status: "active",
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const watchedName = watch("name");

    function generateSlug(value: string) {
        return value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function handleGenerateSlug() {
        setValue("slug", generateSlug(watchedName), {
            shouldValidate: true,
            shouldDirty: true,
        });
    }

    function onSubmit(values: CompanyFormValues) {
        startTransition(async () => {
            const result = await createCompanyAction(values);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Entreprise créée avec succès");
            router.push("/dashboard/admin/companies");
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Building2 className="size-5" />
                        </div>

                        <div>
                            <CardTitle>Créer une entreprise</CardTitle>
                            <CardDescription>
                                Ajoutez une nouvelle entreprise à la holding.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8">
                    <FieldSet>
                        <FieldLegend>Informations générales</FieldLegend>

                        <FieldGroup className="grid gap-5 md:grid-cols-2">
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="name">
                                    Nom de l’entreprise <span className="text-destructive">*</span>
                                </FieldLabel>

                                <Input
                                    id="name"
                                    placeholder="Ex: Heritage"
                                    aria-invalid={!!errors.name}
                                    {...register("name")}
                                />

                                <FieldDescription>
                                    Nom court utilisé dans l’interface du CRM.
                                </FieldDescription>

                                {errors.name && <FieldError>{errors.name.message}</FieldError>}
                            </Field>

                            <Field data-invalid={!!errors.legal_name}>
                                <FieldLabel htmlFor="legal_name">Nom légal</FieldLabel>

                                <Input
                                    id="legal_name"
                                    placeholder="Ex: SCI Heritage SARL"
                                    aria-invalid={!!errors.legal_name}
                                    {...register("legal_name")}
                                />

                                <FieldDescription>
                                    Nom juridique officiel de l’entreprise.
                                </FieldDescription>

                                {errors.legal_name && (
                                    <FieldError>{errors.legal_name.message}</FieldError>
                                )}
                            </Field>

                            <Field data-invalid={!!errors.slug}>
                                <FieldLabel htmlFor="slug">
                                    Slug <span className="text-destructive">*</span>
                                </FieldLabel>

                                <div className="flex gap-2">
                                    <Input
                                        id="slug"
                                        placeholder="heritage"
                                        aria-invalid={!!errors.slug}
                                        {...register("slug")}
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerateSlug}
                                    >
                                        Générer
                                    </Button>
                                </div>

                                <FieldDescription>
                                    Identifiant unique utilisé dans le système et les URLs.
                                </FieldDescription>

                                {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
                            </Field>

                            <Field data-invalid={!!errors.company_type}>
                                <FieldLabel>
                                    Type d’entreprise <span className="text-destructive">*</span>
                                </FieldLabel>

                                <Select
                                    defaultValue="sci"
                                    onValueChange={(value) =>
                                        setValue(
                                            "company_type",
                                            value as CompanyFormValues["company_type"],
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            }
                                        )
                                    }
                                >
                                    <SelectTrigger aria-invalid={!!errors.company_type}>
                                        <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="sci">SCI / Immobilier</SelectItem>
                                        <SelectItem value="logistique">Logistique</SelectItem>
                                        <SelectItem value="conseil">Conseil</SelectItem>
                                        <SelectItem value="holding">Holding</SelectItem>
                                        <SelectItem value="autre">Autre</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FieldDescription>
                                    Permet de catégoriser l’activité principale.
                                </FieldDescription>

                                {errors.company_type && (
                                    <FieldError>{errors.company_type.message}</FieldError>
                                )}
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSet>
                        <FieldLegend>Coordonnées</FieldLegend>

                        <FieldGroup className="grid gap-5 md:grid-cols-2">
                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email">Email professionnel</FieldLabel>

                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contact@heritage.com"
                                    aria-invalid={!!errors.email}
                                    {...register("email")}
                                />

                                {errors.email && <FieldError>{errors.email.message}</FieldError>}
                            </Field>

                            <Field data-invalid={!!errors.phone}>
                                <FieldLabel htmlFor="phone">Téléphone</FieldLabel>

                                <Input
                                    id="phone"
                                    placeholder="+237 6 95 12 34 56"
                                    aria-invalid={!!errors.phone}
                                    {...register("phone")}
                                />

                                {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                            </Field>

                            <Field data-invalid={!!errors.address} className="md:col-span-2">
                                <FieldLabel htmlFor="address">Adresse</FieldLabel>

                                <Textarea
                                    id="address"
                                    placeholder="Adresse complète de l’entreprise"
                                    aria-invalid={!!errors.address}
                                    {...register("address")}
                                />

                                {errors.address && (
                                    <FieldError>{errors.address.message}</FieldError>
                                )}
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSet>
                        <FieldLegend>Identité visuelle</FieldLegend>

                        <FieldGroup className="grid gap-5 md:grid-cols-3">
                            <Field data-invalid={!!errors.logo_url} className="md:col-span-3">
                                <FieldLabel htmlFor="logo_url">URL du logo</FieldLabel>

                                <Input
                                    id="logo_url"
                                    placeholder="https://heritage.com/logo.png"
                                    aria-invalid={!!errors.logo_url}
                                    {...register("logo_url")}
                                />

                                <FieldDescription>
                                    Lien vers le logo de l’entreprise.
                                </FieldDescription>

                                {errors.logo_url && (
                                    <FieldError>{errors.logo_url.message}</FieldError>
                                )}
                            </Field>



                            <Field data-invalid={!!errors.status}>
                                <FieldLabel>Statut</FieldLabel>

                                <Select
                                    defaultValue="active"
                                    onValueChange={(value) =>
                                        setValue("status", value as CompanyFormValues["status"], {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                    }
                                >
                                    <SelectTrigger aria-invalid={!!errors.status}>
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FieldDescription>
                                    Une entreprise inactive sera masquée des usages principaux.
                                </FieldDescription>

                                {errors.status && (
                                    <FieldError>{errors.status.message}</FieldError>
                                )}
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/admin/companies")}
                >
                    Annuler
                </Button>

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Création..." : "Créer l’entreprise"}
                </Button>
            </div>
        </form>
    );
}