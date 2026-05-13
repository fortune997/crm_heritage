// features/activities/components/activity-create-dialog.tsx

"use client";

import * as React from "react";
import { Mic, MicOff, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

export function ActivityCreateDialog() {
    const [open, setOpen] = React.useState(false);
    const [isListening, setIsListening] = React.useState(false);

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [type, setType] = React.useState("relance");
    const [targetType, setTargetType] = React.useState("prospect");
    const [priority, setPriority] = React.useState("moyenne");
    const [dueDate, setDueDate] = React.useState("");

    const recognitionRef = React.useRef<SpeechRecognition | null>(null);

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
            const transcript = event.results[0][0].transcript;

            setDescription((previous) =>
                previous ? `${previous} ${transcript}` : transcript
            );
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    const handleSubmit = () => {
        const payload = {
            title,
            description,
            type,
            targetType,
            priority,
            dueDate,
        };

        console.log("Nouvelle activité :", payload);

        setOpen(false);
        setTitle("");
        setDescription("");
        setType("relance");
        setTargetType("prospect");
        setPriority("moyenne");
        setDueDate("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
                <Button>
                    <Plus className="mr-2 size-4" />
                    Ajouter une activité
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Ajouter une activité</DialogTitle>
                    <DialogDescription>
                        Enregistrez rapidement un appel, une relance, une visite, un
                        rendez-vous ou une note commerciale.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Titre</label>
                        <Input
                            placeholder="Ex : Relancer le client pour la visite"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Type d’activité</label>
                            <Select
                                value={type}
                                onValueChange={(value) => {
                                    if (value) setType(value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="appel">Appel</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="visite">Visite</SelectItem>
                                    <SelectItem value="relance">Relance</SelectItem>
                                    <SelectItem value="rendez_vous">Rendez-vous</SelectItem>
                                    <SelectItem value="note">Note</SelectItem>
                                    <SelectItem value="paiement">Paiement</SelectItem>
                                    <SelectItem value="reservation">Réservation</SelectItem>
                                    <SelectItem value="autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Concernant</label>
                            <Select
                                value={targetType}
                                onValueChange={(value) => {
                                    if (value) setTargetType(value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Cible" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="prospect">Prospect</SelectItem>
                                    <SelectItem value="client">Client</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Priorité</label>
                            <Select
                                value={priority}
                                onValueChange={(value) => {
                                    if (value) setPriority(value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priorité" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="faible">Faible</SelectItem>
                                    <SelectItem value="moyenne">Moyenne</SelectItem>
                                    <SelectItem value="haute">Haute</SelectItem>
                                    <SelectItem value="urgente">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Date de suivi</label>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                        />
                    </div>

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

                        <Textarea
                            rows={5}
                            placeholder="Ex : Le client souhaite visiter le terrain samedi. Il faut lui envoyer la localisation WhatsApp..."
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>

                    <Button onClick={handleSubmit}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}