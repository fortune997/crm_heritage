"use client";


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

import { ProspectActivity } from "@/core/types/activities";
import { useCreateProspectActivity, useUpdateProspectActivity } from "@/core/hooks/useActivities";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ActivityFollowUp } from "@/core/services/activites/activities-service";

type ActivityTreatDialogProps = {
    activity: ActivityFollowUp;
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
    const [open, setOpen] = useState(false);

    const [result, setResult] = useState<ActivityResult>("appel_reussi");
    const [resultNote, setResultNote] = useState("");
    const [nextAction, setNextAction] = useState("aucune");
    const [nextActionDate, setNextActionDate] = useState("");
    const [nextActionTime, setNextActionTime] = useState("");
    const [nextActionTitle, setNextActionTitle] = useState("");

    const shouldCreateNextAction = nextAction !== "aucune";

    const { mutate: updateActivity, isPending: isUpdating } = useUpdateProspectActivity();
    const { mutate: createActivity, isPending: isCreating } = useCreateProspectActivity();

    const { profile } = useAuth()


    const handleSubmit = () => {
        const userId = profile?.id;

        if (!userId) {
            console.error("Profil utilisateur introuvable");
            return;
        }

        updateActivity(
            {
                id: activity.id,
                statut_activite: "Terminée",
            },
            {
                onSuccess: () => {
                    if (shouldCreateNextAction) {
                        const prochainRelance =
                            nextActionDate && nextActionTime
                                ? new Date(`${nextActionDate}T${nextActionTime}`)
                                : nextActionDate
                                    ? new Date(nextActionDate)
                                    : new Date();

                        createActivity(

                            {
                                prospect_id: activity.prospect_id,
                                titre: nextActionTitle,
                                description: resultNote,
                                canal_relance: result,
                                statut_activite: "A faire",
                                prochain_relance: prochainRelance,
                                created_by: userId,
                            },
                            {
                                onSuccess: () => setOpen(false),
                            }
                        );
                    } else {
                        setOpen(false);
                    }
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
                <Button size="sm">
                    <CheckCircle2 className="mr-2 size-4" />
                    Traiter
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Traiter l'activité</DialogTitle>
                    <DialogDescription>
                        Enregistrez le résultat de l'action commerciale et programmez une
                        prochaine action si nécessaire.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 px-6 py-4">
                    <div className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-sm text-muted-foreground">Concernant</p>
                        <p className="font-medium">{activity.prospect_name}</p>

                        <p className="mt-2 text-sm text-muted-foreground">Activité</p>
                        <p className="font-medium">{activity.titre}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
                        {/* Résultat */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Canal de relance
                            </label>

                            <Select
                                value={result}
                                onValueChange={(value) => setResult(value as ActivityResult)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choisir le résultat" />
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
                        </div>

                        {/* Prochaine action */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Prochaine action
                            </label>

                            <Select
                                value={nextAction}
                                onValueChange={(value) => setNextAction(value as NextAction)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Programmer une action" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="aucune">
                                        Aucune
                                    </SelectItem>

                                    <SelectItem value="appel">
                                        📞 Programmer un appel
                                    </SelectItem>

                                    <SelectItem value="whatsapp">
                                        💬 Envoyer un WhatsApp
                                    </SelectItem>

                                    <SelectItem value="sms">
                                        📩 Envoyer un SMS
                                    </SelectItem>

                                    <SelectItem value="email">
                                        ✉️ Envoyer un Email
                                    </SelectItem>

                                    <SelectItem value="relance">
                                        🔄 Créer une relance
                                    </SelectItem>

                                    <SelectItem value="visite">
                                        📍 Planifier une visite
                                    </SelectItem>

                                    <SelectItem value="reunion">
                                        🤝 Planifier une réunion
                                    </SelectItem>

                                    <SelectItem value="paiement">
                                        💰 Suivi de paiement
                                    </SelectItem>

                                    <SelectItem value="signature">
                                        🖊️ Signature du contrat
                                    </SelectItem>

                                    <SelectItem value="reservation">
                                        📑 Réservation
                                    </SelectItem>

                                    <SelectItem value="autre">
                                        📝 Autre
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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

                <DialogFooter className="px-6 pb-6">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit}>Valider le traitement</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}