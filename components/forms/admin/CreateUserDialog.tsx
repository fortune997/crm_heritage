"use client";

import { useEffect, useState } from "react";

import {
    UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Label,
} from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateUserFormValues, createUserSchema } from "@/core/lib/validations/admin/createUserSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateUser } from "@/core/hooks/admin/useCreateUser";
import { useBrands, useRoles } from "@/core/hooks/admin/useRoles";
import { Checkbox } from "@/components/ui/checkbox";
import { AvatarUpload } from "./avatar-upload";
import { UploadBox } from "../site/UploadBox";


export const roleLabels: Record<string, string> = {
    pdg: "PDG",
    dg: "DG Héritage",
    dsi: "DSI",
    directeur_marketing_commercial:
        "Directeur Marketing & Commercial",
    brand_manager:
        "Brand Manager OpenDoor & Land",
    responsable_commercial:
        "Responsable Commercial",
    responsable_corporate:
        "Responsable Corporate",
    directeur_topographique:
        "Directeur Topographique",
    topographe:
        "Topographe",
    responsable_digital:
        "Responsable Digital",
    social_media_manager:
        "Social Media Manager",
};

export const departmentLabels: Record<
    string,
    string
> = {
    direction: "Direction",
    administration: "Administration",
    marketing_commercial:
        "Marketing & Commercial",
    corporate: "Corporate",
    topographie: "Topographie",
    digital: "Digital",
};

export const statusLabels: Record<
    UserStatus,
    string
> = {
    active: "Actif",
    inactive: "Inactif",
    suspended: "Suspendu",
    invited: "Invité",
};

export const statusColors: Record<
    UserStatus,
    string
> = {
    active:
        "bg-green-50 text-green-700 border-green-200",
    inactive:
        "bg-gray-50 text-gray-600 border-gray-200",
    suspended:
        "bg-red-50 text-red-700 border-red-200",
    invited:
        "bg-orange-50 text-orange-700 border-orange-200",
};

export type UserStatus =
    | "active"
    | "inactive"
    | "suspended"
    | "invited";

export type UserRole =
    | "pdg"
    | "dg"
    | "dsi"
    | "directeur_marketing_commercial"
    | "brand_manager"
    | "responsable_commercial"
    | "responsable_corporate"
    | "directeur_topographique"
    | "topographe"
    | "responsable_digital"
    | "social_media_manager";

export type UserDepartment =
    | "direction"
    | "administration"
    | "marketing_commercial"
    | "corporate"
    | "topographie"
    | "digital";

export type HeritageUser = {
    id: string;

    first_name: string;
    last_name: string;
    full_ame: string;

    email: string;
    phone?: string;
    last_login_at: string;

    avatarUrl?: string;

    role: UserRole;
    department: UserDepartment;

    status: UserStatus;

    permissions: string[];

    scopes: string[];

    lastActivity?: string;

    createdAt: string;
    /* user_roles: 
        id: string,
        role_id: string,
        assigned_at: string,
        assigned_by: string
     */
};

export function CreateUserDialog() {
    const [open, setOpen] =
        useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { data: allRole, isLoading } = useRoles()
    const { data: brands = [] } = useBrands();
    const { mutateAsync: createUserAccount, isPending } = useCreateUser()




    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            department: "",
            first_name: "",
            roleId: "",
            status: "",
            last_name: "",
            phone: "",
            email: "",
            password: "",
            brandIds: [],
            // avatarUrl: null

        },
    });

    useEffect(() => {
        if (!open) {
            reset();
            setShowPassword(false);
        }
    }, [open]);

    const onSubmit = async (values: CreateUserFormValues) => {
        try {
            console.log('VALUES,', values)
            await createUserAccount(values);

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger >
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter un utilisateur
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl overflow-auto h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        Ajouter un utilisateur
                    </DialogTitle>
                </DialogHeader>


                <form
                    onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
                    className="space-y-4"
                >
                    {/* Nom & Prénom */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field>
                            <Label htmlFor="last_name" className="required">
                                Nom
                            </Label>

                            <Controller
                                name="last_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="last_name"
                                        placeholder="Ex : Mempouza"
                                        {...field}
                                    />
                                )}
                            />

                            {errors.last_name && (
                                <p className="text-sm text-red-500">
                                    {errors.last_name.message}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="first_name" className="required">
                                Prénom
                            </Label>

                            <Controller
                                name="first_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="first_name"
                                        placeholder="Ex : Dylane"
                                        {...field}
                                    />
                                )}
                            />

                            {errors.first_name && (
                                <p className="text-sm text-red-500">
                                    {errors.first_name.message}
                                </p>
                            )}
                        </Field>
                    </div>

                    {/* Email */}
                    <Field>
                        <Label htmlFor="email" className="required">
                            Email professionnel
                        </Label>

                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contact@entreprise.com"
                                    {...field}
                                />
                            )}
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </Field>

                    {/* Téléphone */}
                    <Field>
                        <Label htmlFor="phone">
                            Téléphone
                        </Label>

                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="phone"
                                    placeholder="+237 655889677"
                                    {...field}
                                />
                            )}
                        />

                        {errors.phone && (
                            <p className="text-sm text-red-500">
                                {errors.phone.message}
                            </p>
                        )}
                    </Field>

                    {/* Mot de passe */}
                    <Field>
                        <Label htmlFor="password" className="required">
                            Mot de passe
                        </Label>

                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                />
                            )}
                        />

                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </Field>

                    {/* Rôle & Département */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field>
                            <Label className="required">
                                Rôle
                            </Label>

                            <Controller
                                name="roleId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un rôle" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {allRole?.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.roleId && (
                                <p className="text-sm text-red-500">
                                    {errors.roleId.message}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <Label className="required">
                                Département
                            </Label>

                            <Controller
                                name="department"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un département" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {Object.entries(departmentLabels).map(
                                                ([value, label]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.department && (
                                <p className="text-sm text-red-500">
                                    {errors.department.message}
                                </p>
                            )}
                        </Field>
                    </div>
                    <div className="grid gap-4 items-center md:grid-cols-2">
                        {/* Statut */}
                        <Field>
                            <Label className="required">
                                Statut
                            </Label>

                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {Object.entries(statusLabels).map(
                                                ([value, label]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.status && (
                                <p className="text-sm text-red-500">
                                    {errors.status.message}
                                </p>
                            )}
                        </Field>

                        { /* scope */}

                        <Field>
                            <Label className="required">
                                Marques
                            </Label>

                            <Controller
                                name="brandIds"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex gap-2">
                                        {brands.map((brand) => (
                                            <label
                                                key={brand.id}
                                                className="flex items-center gap-2"
                                            >
                                                <Checkbox
                                                    checked={field.value.includes(brand.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange([
                                                                ...field.value,
                                                                brand.id,
                                                            ]);
                                                        } else {
                                                            field.onChange(
                                                                field.value.filter(
                                                                    (id) => id !== brand.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />

                                                <span>{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            />

                            {errors.brandIds && (
                                <p className="text-sm text-red-500">
                                    {errors.brandIds.message}
                                </p>
                            )}
                        </Field>
                    </div>
                    {/*  <Field>
                        <Controller
                            control={control}
                            name="avatarUrl"
                            render={({ field }) => (
                                <UploadBox
                                    title="Galerie photos"
                                    description="Photos du site"
                                    type="image"
                                    multiple
                                    field={field}
                                />
                            )}
                        />

                    </Field> */}

                    {/* Boutons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending
                                ? "Création..."
                                : "Créer l'utilisateur"}
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );
}

