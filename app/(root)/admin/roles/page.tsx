"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
    Pencil,
    Trash2,
    ShieldCheck,
    Plus,
} from "lucide-react";
import { useNewRole, useRoles } from "@/core/hooks/admin/useRoles";
import { CreateRoleFormValues, createRoleSchema } from "@/core/lib/validations/admin/createUserSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";



type Role = {
    id: string;
    name: string;
    label: string;
    created_at: string;
};



export default function RolesPage() {
    const { data: roles, isLoading } = useRoles()
    const { mutate: newRole, isPending } = useNewRole()


    const [open, setOpen] = useState(false);




    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CreateRoleFormValues>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });







    useEffect(() => {
        if (!open) {
            reset();

        }
    }, [open]);

    const onSubmit = async (values: CreateRoleFormValues) => {

        newRole(values);

        reset();
        setOpen(false)
    };





    return (

        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>

                    <h1 className="text-2xl font-bold">
                        Gestion des rôles
                    </h1>

                    <p className="text-muted-foreground">
                        Gérez les rôles et leurs permissions
                    </p>

                </div>




                <Dialog
                    open={open}
                    onOpenChange={setOpen}
                >

                    <DialogTrigger >


                        <Button

                        >

                            <Plus className="mr-2 h-4 w-4" />

                            Nouveau rôle

                        </Button>


                    </DialogTrigger>



                    <DialogContent>


                        <DialogHeader>

                            <DialogTitle>


                                Créer un rôle


                            </DialogTitle>

                        </DialogHeader>





                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Nom & Prénom */}
                            <div className="grid gap-4">
                                <Field>
                                    <Label htmlFor="last_name" className="required">
                                        Nom
                                    </Label>

                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="name"
                                                placeholder="Nom technique (ex: COMMERCIAL)"
                                                {...field}
                                            />
                                        )}
                                    />

                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor="description" className="required">
                                        Description
                                    </Label>

                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="description"
                                                placeholder="Libellé"
                                                {...field}
                                            />
                                        )}
                                    />

                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </Field>
                            </div>





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


            </div>





            <Card>


                <CardHeader>

                    <CardTitle>
                        Liste des rôles
                    </CardTitle>

                </CardHeader>



                <CardContent>


                    {
                        isLoading ?

                            <p>
                                Chargement...
                            </p>


                            :


                            <Table>


                                <TableHeader>

                                    <TableRow>

                                        <TableHead>
                                            Nom
                                        </TableHead>


                                        <TableHead>
                                            Description
                                        </TableHead>


                                        <TableHead>
                                            Actions
                                        </TableHead>


                                    </TableRow>

                                </TableHeader>




                                <TableBody>


                                    {
                                        roles?.map(role => (


                                            <TableRow
                                                key={role.id}
                                            >


                                                <TableCell
                                                    className="font-medium"
                                                >

                                                    {role.name}

                                                </TableCell>



                                                <TableCell>

                                                    {role.description}

                                                </TableCell>




                                                <TableCell>


                                                    <div className="flex gap-2">


                                                        <Button

                                                            size="icon"

                                                            variant="outline"



                                                        >

                                                            <Link
                                                                href={`/admin/roles/${role.id}`}
                                                            >

                                                                <ShieldCheck
                                                                    className="h-4 w-4"
                                                                />

                                                            </Link>


                                                        </Button>




                                                        <Button

                                                            size="icon"

                                                            variant="outline"

                                                            onClick={() => { }
                                                            }

                                                        >

                                                            <Pencil
                                                                className="h-4 w-4"
                                                            />


                                                        </Button>





                                                        <Button

                                                            size="icon"

                                                            variant="destructive"

                                                            onClick={() => { }}

                                                        >

                                                            <Trash2
                                                                className="h-4 w-4"
                                                            />

                                                        </Button>



                                                    </div>


                                                </TableCell>



                                            </TableRow>


                                        ))
                                    }



                                </TableBody>



                            </Table>


                    }


                </CardContent>


            </Card>



        </div>

    );

}