"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { Activity } from "@/types";

type ActivityTreatDialogProps = {
    activity: Activity;
};

type ActivityResult =
    | "appel_reussi"
    | "pas_de_reponse"
    | "interesse"
    | "non_interesse"
    | "rendez_vous_confirme"
    | "visite_planifiee"
    | "paiement_promis"
    | "a_relancer"
    | "autre";

type NextAction =
    | "aucune"
    | "relance"
    | "visite"
    | "rendez_vous"
    | "paiement"
    | "appel"
    | "whatsapp";

export function ActivityTreatDialog({ activity }: ActivityTreatDialogProps) {
    const [open, setOpen] = React.useState(false);

    const [result, setResult] = React.useState<ActivityResult>("appel_reussi");
    const [resultNote, setResultNote] = React.useState("");
    const [nextAction, setNextAction] = React.useState<NextAction>("aucune");
    const [nextActionDate, setNextActionDate] = React.useState("");
    const [nextActionTime, setNextActionTime] = React.useState("");
    const [nextActionTitle, setNextActionTitle] = React.useState("");

    const shouldCreateNextAction = nextAction !== "aucune";

    const handleSubmit = () => {
        const completedActivityPayload = {
            activityId: activity.id,
            status: "terminee",
            result,
            resultNote,
            completedAt: new Date().toISOString(),
        };

        const nextActivityPayload = shouldCreateNextAction
            ? {
                targetType: activity.targetType,
                targetId: activity.targetId,
                targetName: activity.targetName,
                targetPhone: activity.targetPhone,
                type: nextAction,
                title: nextActionTitle,
                description: resultNote,
                status: "a_faire",
                priority: activity.priority,
                dueDate: nextActionDate,
                dueTime: nextActionTime,
                assignedTo: activity.assignedTo,
                createdBy: activity.createdBy,
            }
            : null;

        console.log("Activité traitée :", completedActivityPayload);
        console.log("Prochaine activité :", nextActivityPayload);

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
                <Button size="sm">
                    <CheckCircle2 className="mr-2 size-4" />
                    Traiter
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Traiter l’activité</DialogTitle>
                    <DialogDescription>
                        Enregistrez le résultat de l’action commerciale et programmez une
                        prochaine action si nécessaire.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-sm text-muted-foreground">Concernant</p>
                        <p className="font-medium">{activity.targetName}</p>

                        <p className="mt-2 text-sm text-muted-foreground">Activité</p>
                        <p className="font-medium">{activity.title}</p>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Résultat</label>

                        <Select
                            value={result}
                            onValueChange={(value) => {
                                if (!value) return;
                                setResult(value as ActivityResult);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir le résultat" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="appel_reussi">Appel réussi</SelectItem>
                                <SelectItem value="pas_de_reponse">Pas de réponse</SelectItem>
                                <SelectItem value="interesse">Client intéressé</SelectItem>
                                <SelectItem value="non_interesse">
                                    Client non intéressé
                                </SelectItem>
                                <SelectItem value="rendez_vous_confirme">
                                    Rendez-vous confirmé
                                </SelectItem>
                                <SelectItem value="visite_planifiee">
                                    Visite planifiée
                                </SelectItem>
                                <SelectItem value="paiement_promis">
                                    Paiement promis
                                </SelectItem>
                                <SelectItem value="a_relancer">À relancer</SelectItem>
                                <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Note de traitement</label>

                        <Textarea
                            rows={4}
                            placeholder="Ex : Le client a confirmé sa disponibilité pour vendredi. Il souhaite recevoir la localisation WhatsApp."
                            value={resultNote}
                            onChange={(event) => setResultNote(event.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Prochaine action</label>

                        <Select
                            value={nextAction}
                            onValueChange={(value) => {
                                if (!value) return;
                                setNextAction(value as NextAction);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir une prochaine action" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="aucune">Aucune</SelectItem>
                                <SelectItem value="relance">Créer une relance</SelectItem>
                                <SelectItem value="visite">Planifier une visite</SelectItem>
                                <SelectItem value="rendez_vous">
                                    Planifier un rendez-vous
                                </SelectItem>
                                <SelectItem value="paiement">Suivre un paiement</SelectItem>
                                <SelectItem value="appel">Programmer un appel</SelectItem>
                                <SelectItem value="whatsapp">
                                    Programmer un message WhatsApp
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {shouldCreateNextAction && (
                        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <label className="text-sm font-medium">
                                    Titre de la prochaine action
                                </label>

                                <Input
                                    placeholder="Ex : Envoyer la localisation WhatsApp"
                                    value={nextActionTitle}
                                    onChange={(event) => setNextActionTitle(event.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Date</label>

                                <Input
                                    type="date"
                                    value={nextActionDate}
                                    onChange={(event) => setNextActionDate(event.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Heure</label>

                                <Input
                                    type="time"
                                    value={nextActionTime}
                                    onChange={(event) => setNextActionTime(event.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>

                    <Button onClick={handleSubmit}>Valider le traitement</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}