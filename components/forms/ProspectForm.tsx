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
import { useAddProspect, useUpdateProspect } from "@/core/hooks/prospects/useProspect";
import { useCanal } from "@/core/hooks/canal/useCanal";
import { useSite } from "@/core/hooks/sites/useSite";
import { Plus } from "lucide-react";
import { checkProspectPhone } from "@/core/services/prospects/prospect-service";




export function ProspectForm({
    prospect,
    submitLabel,
    open: controlledOpen,
    onOpenChange,
    trigger,
    type

}: ProspectFormProps) {
      const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen ?? internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;

    const isEditing = Boolean(prospect?.id);
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutate: createProspect, isPending } = useAddProspect();
    const { mutate: updateProspect, isPending: isUpdating } = useUpdateProspect();
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
            full_name: prospect?.full_name || "",
            phone: prospect?.phone || "",
            canal_prospection: prospect?.canal_prospection || "",
            message: prospect?.message || "",
            langue: prospect?.langue || "",
            qualification: prospect?.qualification || "",
            sexe: prospect?.sexe || "homme",
            site_interesse: prospect?.site_interesse || "new",
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
            const existing = await checkProspectPhone(phone);

            if (existing && existing.id !== prospect?.id) {
                setExistingProspect(existing);
            } else {
                setExistingProspect(null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCheckingPhone(false);
        }
    };

    const timeout = setTimeout(checkPhone, 500);

    return () => clearTimeout(timeout);
}, [phone, prospect?.id]);

useEffect(() => {
    if (!open) return;

    reset({
        full_name: prospect?.full_name ?? "",
        phone: prospect?.phone ?? "",
        canal_prospection: prospect?.canal_prospection ?? "",
        message: prospect?.message ?? "",
        sexe: prospect?.sexe ?? "homme",
        qualification: prospect?.qualification || "",
            langue: prospect?.langue || "",

        site_interesse: prospect?.site_interesse ?? "",
    });
}, [open, prospect?.id, reset]);

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
     

         if (isEditing && prospect) {
        updateProspect(
            {
                id: prospect.id,
                prospectData :data,
            }
        );

        return;
    }else {
   createProspect(newdata);
    }
        reset()

    };



    // Helper to get error message for a field
    const getError = (field: keyof ProspectFormValues) => {
        return errors[field]?.message as string | undefined;
    };

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            
                  {trigger && (
                        <DialogTrigger>
                            {trigger }
                        </DialogTrigger>
                    )}
            



            <DialogContent className="rounded-3xl max-h-[90vh] overflow-auto border bg-white text-foreground sm:max-w-2xl">
                <DialogHeader>
                     <DialogTitle>
                {type === "edit" ? "Modifier le prospect" : "Nouveau prospect"}
            </DialogTitle>

            <DialogDescription>
                {type === "edit"
                    ? "Modifiez les informations du prospect."
                    : "Enregistrez un nouveau prospect."}
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
                                        placeholder="Dylane Mempouza"
                                        {...field}
                                        value={field.value ?? ""}
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

                        <Field>
                            <Label htmlFor="site_interesse" className="required">
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

                        {/* qualification prospect*/}

                             <Field>
                            <Label htmlFor="qualification" className="required">
                                Qualification
                            </Label>
                            <Controller
                                name="qualification"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="qualification" aria-invalid={!!getError("qualification")}>
                                            <SelectValue placeholder="Choisir son qualification..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="H1">H1 - Non Intéressé</SelectItem>
                                            <SelectItem value="H2">H2 - Besoins d'Infos</SelectItem>
                                            <SelectItem value="H3">H3 - Intéressé</SelectItem>
                                            <SelectItem value="H4">H4 - Intentions RDV bureau</SelectItem>
                                            <SelectItem value="H5">H5 - Intentions RDV Terrain</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {getError("qualification") && (
                                <p className="text-sm text-red-500 mt-1">{getError("qualification")}</p>
                            )}
                        </Field>

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
                        {/* Langue */}
                        <Field>
                            <Label htmlFor="sexe" className="required">
                                Langue
                            </Label>
                            <Controller
                                name="langue"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="langue" aria-invalid={!!getError("langue")}>
                                            <SelectValue placeholder="Choisir son langue..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="anglais">Anglais</SelectItem>
                                            <SelectItem value="francais">Français</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {getError("langue") && (
                                <p className="text-sm text-red-500 mt-1">{getError("langue")}</p>
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
                         <Button type="submit" disabled={isPending || isUpdating}>
            {isPending
                ? type === "edit"
                    ? "Modification..."
                    : "Enregistrement..."
                : submitLabel ??
                  (type === "edit" ? "Modifier" : "Enregistrer")}
        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}