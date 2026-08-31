"use client";

import * as React from "react";
import { Mic, MicOff, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { ActivitiesFormValues, activitySchema } from "@/lib/validations/schema";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import ProspectPhoneSearch from "../forms/ProspectSearch";
import { useCreateProspectActivity } from "@/core/hooks/useActivities";
import { useAuth } from "@/contexts/AuthContext";


type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
        length: number;
    };
};

declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }
}

type ActivityCreateDialogProps = {
    prospectId?: string;
};

export function ActivityCreateDialog(
    {
        prospectId,
    }: ActivityCreateDialogProps
) {
    const [open, setOpen] = React.useState(false);
    const [isListening, setIsListening] = React.useState(false);
    const {
        mutate: createActivity,
        isPending,
    } = useCreateProspectActivity();
    const { profile } = useAuth()

    const recognitionRef = React.useRef<SpeechRecognition | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<ActivitiesFormValues>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            prospect_id: prospectId ?? "",
            titre: "",
            description: "",
            canal_relance: "",
            statut_activite: "A faire",
            prochain_relance: new Date(),
        },
    });

    React.useEffect(() => {
        reset({
            prospect_id: prospectId ?? "",
            titre: "",
            description: "",
            canal_relance: "",
            statut_activite: "A faire",
            prochain_relance: new Date(),
        });
    }, [prospectId, reset]);

    const handleVoiceInput = () => {
        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            alert("La saisie vocale n’est pas supportée par ce navigateur.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }


        const recognition = new SpeechRecognitionAPI();

        recognition.lang = "fr-FR";
        recognition.continuous = false;
        recognition.interimResults = false;


        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;


            const currentDescription =
                getValues("description");


            setValue(
                "description",
                currentDescription
                    ? `${currentDescription} ${transcript}`
                    : transcript,
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );
        };


        /*  recognition.onerror = () => {
             setIsListening(false);
         };
  */

        recognition.onend = () => {
            setIsListening(false);
        };


        recognitionRef.current = recognition;

        recognition.start();

        setIsListening(true);
    };

    const onSubmit = (values: ActivitiesFormValues) => {
        if (!profile?.id) {
            console.error("Profil utilisateur introuvable");
            return;
        }
        createActivity(
            {
                ...values,
                created_by: profile!.id,
            },
            {
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
                onError: (error) => {
                    console.error(error);
                },
            }
        );
    };

    // Helper to get error message for a field
    const getError = (field: keyof ActivitiesFormValues) => {
        return errors[field]?.message as string | undefined;
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
                <Button>
                    <Plus className=" size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="overflow-auto h-120 sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Ajouter une activité</DialogTitle>
                    <DialogDescription>
                        Enregistrez rapidement un appel, une relance, une visite, un
                        rendez-vous ou une note commerciale.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <FieldGroup>
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
                        <div className="grid gap-2">


                            <Field>
                                <Label>Titre</Label>
                                <Controller
                                    name="titre"
                                    control={control}
                                    render={({ field }) => (
                                        <Input

                                            value={field.value}
                                            placeholder="Ex : Relancer le client pour la visite"
                                            onChange={(e) =>
                                                field.onChange((e.target.value))
                                            }
                                        />
                                    )}
                                />
                                {getError("titre") && (
                                    <p className="text-sm text-red-500 mt-1">{getError("titre")}</p>
                                )}
                            </Field>
                        </div>

                        <div className="flex gap-5">
                            <Field>
                                <Label>canal de rélance</Label>
                                <Controller
                                    name="canal_relance"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un canal de relance" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="Appel">📞 Appel</SelectItem>
                                                <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
                                                <SelectItem value="Email">📧 Email</SelectItem>
                                                <SelectItem value="Visite">🏠 Visite</SelectItem>
                                                <SelectItem value="Réunion">🤝 Réunion</SelectItem>
                                                <SelectItem value="Relance">🔄 Relance</SelectItem>
                                                <SelectItem value="Autre">📌 Autre</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {getError("canal_relance") && (
                                    <p className="text-sm text-red-500 mt-1">{getError("canal_relance")}</p>
                                )}
                            </Field>

                            <Field>
                                <Label>Statut de la Rélance</Label>
                                <Controller
                                    name="statut_activite"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Statut d'actvité" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="A faire">
                                                    ⏳ À faire
                                                </SelectItem>

                                                <SelectItem value="En cours">
                                                    🚀 En cours
                                                </SelectItem>

                                                <SelectItem value="Terminée">
                                                    ✅ Terminée
                                                </SelectItem>

                                                <SelectItem value="Annulée">
                                                    ❌ Annulée
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {getError("statut_activite") && (
                                    <p className="text-sm text-red-500 mt-1">{getError("statut_activite")}</p>
                                )}
                            </Field>


                        </div>

                        <Field>
                            <Label>Prochaine Rélance</Label>
                            <Controller
                                name="prochain_relance"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                    .toISOString()
                                                    .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            field.onChange(new Date(e.target.value))
                                        }
                                    />
                                )}
                            />
                            {getError("prochain_relance") && (
                                <p className="text-sm text-red-500 mt-1">{getError("prochain_relance")}</p>
                            )}
                        </Field>


                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Description / Note</label>

                                <Button
                                    type="button"
                                    variant={isListening ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={handleVoiceInput}
                                >
                                    {isListening ? (
                                        <>
                                            <MicOff className="mr-2 size-4" />
                                            Arrêter
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="mr-2 size-4" />
                                            Dicter
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Field>
                                <Label>Description/Notes de l'activité</Label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            rows={5}
                                            placeholder="Décrivez l'activité..."
                                            {...field}
                                        />
                                    )}
                                />
                                {getError("description") && (
                                    <p className="text-sm text-red-500 mt-1">{getError("description")}</p>
                                )}

                            </Field>



                        </div>
                    </FieldGroup>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                setOpen(false);
                            }}
                        >
                            Annuler
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending
                                ? "Enregistrement..."
                                : "Enregistrer"
                            }
                        </Button>
                    </DialogFooter>
                </form>


            </DialogContent>
        </Dialog>
    );
}