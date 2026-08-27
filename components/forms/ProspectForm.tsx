'use client'


import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProspectFormValues, prospectSchema } from "@/lib/validations/schema";
import { ProspectFormProps } from "@/types/prospects/type";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useAddProspect } from "@/core/hooks/prospects/useProspect";
import { useCanal } from "@/core/hooks/canal/useCanal";
import { useSite } from "@/core/hooks/sites/useSite";
import { Plus } from "lucide-react";
import { checkProspectPhone } from "@/core/services/prospects/prospect-service";




export function ProspectForm({
    initialData,
    submitLabel = "Enregistre Prospect",

}: ProspectFormProps) {
    const [open, setOpen] = useState(false);
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutate: createProspect, isPending } = useAddProspect();
    const [existingProspect, setExistingProspect] = useState<{
        id: string;
        full_name: string | null;
    } | null>(null);

    const [isCheckingPhone, setIsCheckingPhone] = useState(false);
    const { data: canals = [], isLoading: isCanalLoading } = useCanal()
    const { data: sites = [], isLoading: isSiteLoading } = useSite()

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ProspectFormValues>({
        resolver: zodResolver(prospectSchema),
        defaultValues: {
            full_name: initialData?.full_name || "",
            phone: initialData?.phone || "",
            email: initialData?.email || "",
            canal_prospection: initialData?.canal_prospection || "",
            message: initialData?.message || "",
            sexe: initialData?.sexe || "homme",
            site_interesse: initialData?.site_interesse || "new",
        },
    });
    const normalizePhone = (phone: string) => {
        return phone.replace(/\s+/g, "").trim();
    };

    const phone = watch("phone");

    useEffect(() => {
        const checkPhone = async () => {
            if (!phone || phone.trim().length < 9) {
                setExistingProspect(null);
                return;
            }

            setIsCheckingPhone(true);

            try {
                const prospect = await checkProspectPhone(phone);
                setExistingProspect(prospect);
            } catch (error) {
                console.error(error);
            } finally {
                setIsCheckingPhone(false);
            }
        };

        const timeout = setTimeout(checkPhone, 500);

        return () => clearTimeout(timeout);
    }, [phone]);

    const onFormSubmit = async (data: ProspectFormValues) => {
        setIsSubmitting(true);

        if (!user) {
            toast.error("Vous devez être connecté.");
            return;
        }
        const normalizedPhone = normalizePhone(data.phone);

        const newdata = {
            ...data,
            created_by: user?.id,
            prospect_company: 'heritage',
            status: 'Nouveau',
            phone: normalizedPhone
        }
        createProspect(newdata);
        reset()

    };



    // Helper to get error message for a field
    const getError = (field: keyof ProspectFormValues) => {
        return errors[field]?.message as string | undefined;
    };

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className="rounded-2xl bg-green-800 text-white shadow">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un prospect
                </Button>
            </DialogTrigger>



            <DialogContent className="rounded-3xl max-h-[90vh] overflow-auto border bg-white text-foreground sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nouveau prospect </DialogTitle>
                    <DialogDescription>
                        Enregistrez un prospect.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(
                    onFormSubmit,
                    (errors) => {
                        console.log("Erreurs :", errors);
                    }
                )} className="space-y-4">
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <Field className="md:col-span-2">
                            <Label htmlFor="full_name" className="required">
                                Nom
                            </Label>
                            <Controller
                                name="full_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="full_name"
                                        placeholder="John Doe"
                                        {...field}
                                        aria-invalid={!!getError("full_name")}
                                    />
                                )}
                            />
                            {getError("full_name") && (
                                <p className="text-sm text-red-500 mt-1">{getError("full_name")}</p>
                            )}
                        </Field>

                        {/* Phone */}
                        <Field>
                            <Label htmlFor="phone" className="required">
                                Telephone
                            </Label>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="655889677"
                                        {...field}
                                        aria-invalid={!!getError("phone")}
                                    />
                                )}
                            />
                            {getError("phone") && (
                                <p className="text-sm text-red-500 mt-1">{getError("phone")}</p>
                            )}
                            {isCheckingPhone && (
                                <p className="text-sm text-muted-foreground">
                                    Vérification du numéro...
                                </p>
                            )}

                            {existingProspect && (
                                <p className="text-sm text-red-500">
                                    Ce numéro existe déjà pour{" "}
                                    <strong>{existingProspect.full_name}</strong>.
                                </p>
                            )}
                        </Field>

                        {/* Email */}
                        <Field>
                            <Label htmlFor="email" className="required">
                                Email
                            </Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        {...field}
                                        aria-invalid={!!getError("email")}
                                    />
                                )}
                            />
                            {getError("email") && (
                                <p className="text-sm text-red-500 mt-1">{getError("email")}</p>
                            )}
                        </Field>

                        {/* Source */}
                        <Field>
                            <Label htmlFor="canal_prospection" className="required">
                                Canal de prospection
                            </Label>
                            <Controller
                                name="canal_prospection"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger id="canal_prospection" aria-invalid={!!getError("canal_prospection")}>
                                            <SelectValue placeholder="Sélectionnez canal de prospection..." />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {isCanalLoading ? (
                                                <SelectItem value="loading" disabled>
                                                    Loading canal de prospection...
                                                </SelectItem>
                                            ) : (
                                                canals.map((canal) => (
                                                    <SelectItem
                                                        key={canal.id}
                                                        value={String(canal.nom)}
                                                    >
                                                        {canal.nom}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {getError("canal_prospection") && (
                                <p className="text-sm text-red-500 mt-1">{getError("canal_prospection")}</p>
                            )}
                        </Field>

                        {/* Interest Type 
                        <Field>
                            <Label htmlFor="interest_type" className="required">
                                Interest Type
                            </Label>
                            <Controller
                                name="interest_type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="interest_type" aria-invalid={!!getError("interest_type")}>
                                            <SelectValue placeholder="Select interest type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="opendoors">Open Doors</SelectItem>
                                            <SelectItem value="heritage">Heritage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {getError("interest_type") && (
                                <p className="text-sm text-red-500 mt-1">{getError("interest_type")}</p>
                            )}
                        </Field>*/}

                        {/* Company
                        <Field>
                            <Label htmlFor="company_id" className="required">
                                Entreprise
                            </Label>
                            <Controller
                                name="company_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="company_id" aria-invalid={!!getError("company_id")}>
                                            <SelectValue placeholder="Choisir l'entreprise..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoading ? (
                                                <SelectItem value="loading" disabled>
                                                    Loading companies...
                                                </SelectItem>
                                            ) : (
                                                companies.map((company) => (
                                                    <SelectItem key={company.id} value={company.id}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {getError("company_id") && (
                                <p className="text-sm text-red-500 mt-1">{getError("company_id")}</p>
                            )}
                        </Field> */}




                        <Field>
                            <Label htmlFor="company_id" className="required">
                                Site choisi
                            </Label>
                            <Controller
                                name="site_interesse"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="site_interesse" aria-invalid={!!getError("site_interesse")}>
                                            <SelectValue placeholder="Choisir le site intéresse..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isSiteLoading ? (
                                                <SelectItem value="loading" disabled>
                                                    Chagement du site...
                                                </SelectItem>
                                            ) : (
                                                sites.map((site) => (
                                                    <SelectItem key={site.id} value={site.id}>
                                                        {site.nom_titre}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {getError("site_interesse") && (
                                <p className="text-sm text-red-500 mt-1">{getError("site_interesse")}</p>
                            )}
                        </Field>
                        {/* Status 
                        <Field className="md:col-span-2">
                            <Label htmlFor="status" className="required">
                                Status du Prospect
                            </Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="status" aria-invalid={!!getError("status")}>
                                            <SelectValue placeholder="Selectionnez le statut..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nouveau">Nouveau</SelectItem>
                                            <SelectItem value="Contacté">Contacté</SelectItem>
                                            <SelectItem value="Intéressé">Intéressé</SelectItem>
                                            <SelectItem value="Converti">Converti</SelectItem>
                                            <SelectItem value="Perdu">Perdu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {getError("status") && (
                                <p className="text-sm text-red-500 mt-1">{getError("status")}</p>
                            )}
                        </Field>*/}

                        {/* Sexe */}
                        <Field>
                            <Label htmlFor="sexe" className="required">
                                Sexe
                            </Label>
                            <Controller
                                name="sexe"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="sexe" aria-invalid={!!getError("sexe")}>
                                            <SelectValue placeholder="Choisir son sexe..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="homme">Homme</SelectItem>
                                            <SelectItem value="femme">Femme</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {getError("sexe") && (
                                <p className="text-sm text-red-500 mt-1">{getError("sexe")}</p>
                            )}
                        </Field>

                        {/* Message */}
                        <Field className="md:col-span-2">
                            <Label htmlFor="message">Message / Notes</Label>
                            <Controller
                                name="message"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        id="message"
                                        placeholder="Message additionnel..."
                                        rows={4}
                                        {...field}
                                        value={field.value || ""}
                                    />
                                )}
                            />
                            {getError("message") && (
                                <p className="text-sm text-red-500 mt-1">{getError("message")}</p>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="gap-5">
                        <DialogClose >
                            <Button
                                variant="outline"
                                type="button"

                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Enregistrement..." : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}