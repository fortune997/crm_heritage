"use client";

import {
    ArrowLeft,
    Building2,
    CalendarIcon,
    CheckCircle2,
    FileText,
    Globe2,
    ImageIcon,
    Info,
    LandPlot,
    MapPin,
    Save,
    ShieldCheck,
    Upload,
    User,
    Waves,
    Zap,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { TSiteValues, siteSchema } from "@/core/lib/site";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/ui/field";
import { UploadBox } from "@/components/forms/site/UploadBox";
import { useNewSite } from "@/core/hooks/sites/useSite";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

const siteTypes = [
    "Terrain",
    "Lotissement",
    "Appartement",
    "Immeuble",
    "Domaine",
    "Villa",
    "Autre",
];

const siteStatuses = [
    "Disponible",
    "Indisponible",
    "En cours d’acquisition",
    "En vérification",
    "Réservé",
    "Vendu",
    "Suspendu",
    "Rejeté",
];

const supplierStatuses = [
    "Nouveau fournisseur",
    "En négociation",
    "Validé fournisseur",
    "Documents en attente",
    "Bloqué fournisseur",
    "Partenariat signé",
];

const documentStatuses = [
    "Aucun document",
    "Partiel",
    "Complet",
    "En vérification",
    "Validé",
    "Rejeté",
];


export default function CreateSitePage() {
    const [publicVisible, setPublicVisible] = useState(false);
    const [featured, setFeatured] = useState(false);
    const [gpsVerified, setGpsVerified] = useState(false);
    const { mutate: createSite, isPending } = useNewSite()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TSiteValues>({
        resolver: zodResolver(siteSchema),
        defaultValues: {
            nom_titre: "",

            type_site: "",
            statut_site: "",
           
            description_site: "",
            description_detaille: "",


            region: "",
            ville: "",
            quartier: "",
            localisation_precise: "",
            repere_connu: "",
            latitude: "",
            longitude: "",
            lien_google: "",

            superficie_disponible: '',
            superficie_total: '',
            prix_metre_carre: '',
            observation_topographique: "",

            lots: '',
            lots_disponible: '',

            lots_vendus: '',
            lots_reserve: '',

            modalite_paiement: '',

            numero_titre_site: "",
            statut_numero_titre_site: "",
            statut_document_site: "",
            procedure_acquisition_site: "",

            nom_partenaire_site: "",
            type_fournisseur_site: "",
            telephone_fournisseur_site: "",
            email_fournisseur_site: "",
            statut_fournisseur_site: "",
            fiabilite_fournisseur_site: "",
            prix_fournisseur_site: "",
            note_comportement_fournisseur_site: "",
            electricite_site: "",
            eau_true: "",
            type_sol: "",
            plan_lotissement: undefined,
            document_foncier: undefined,
            topographe_responsable: "",
            frais_supplementaire: "",

            prochaine_action: "",
            derniere_visite: "",

            imageFiles: [],
            videoFile: undefined,
        },
    });

    const onSubmit = (values: TSiteValues) => {
        console.log('SITE DATA', values)
        const res = createSite(values)
        console.log('RESPONSE', res)

    }

    // Helper to get error message for a field
    const getError = (field: keyof TSiteValues) => {
        return errors[field]?.message as string | undefined;
    };

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div className="space-y-3">
                    <Button variant="ghost" size="sm" className="px-0">
                        <Link href="/topographiques/sites">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour aux sites
                        </Link>
                    </Button>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Module topographie</Badge>
                        <Badge variant="secondary">Nouveau site</Badge>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Ajouter un nouveau site
                        </h1>

                        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                            Enregistrez les informations terrain, commerciales, foncières,
                            techniques et publiques du site. Ces données pourront ensuite être
                            utilisées dans le CRM et sur le site web public Heritage.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                        <Link href="/topographiques/sites">Annuler</Link>
                    </Button>

                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer le site
                    </Button>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit,
                (errors) => {
                    console.log("Erreurs :", errors);
                })} className="space-y-8">
                {/* Main grid */}
                <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <div className="space-y-6">
                        {/* Informations principales */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-muted p-2">
                                        <LandPlot className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Informations principales</CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Identité du site et informations générales.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-2">

                                    <Field className="md:col-span-2">
                                        <Label htmlFor="full_name" className="required">
                                            Nom du site
                                        </Label>
                                        <Controller
                                            name="nom_titre"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="nom_titre"
                                                    placeholder="Ex : Domaine Heritage — PK27"
                                                    {...field}
                                                    aria-invalid={!!getError("nom_titre")}
                                                />
                                            )}
                                        />
                                        {getError("nom_titre") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("nom_titre")}</p>
                                        )}
                                    </Field>


                                </div>

                                <div className="grid gap-4 md:grid-cols-2">

                                    <Field>
                                        <Label htmlFor="company_id" className="required">
                                            Types de propriété
                                        </Label>
                                        <Controller
                                            name="type_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="type_site" aria-invalid={!!getError("type_site")}>
                                                        <SelectValue placeholder="Select interest type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {siteTypes.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("type_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("type_site")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="statut_site" className="required">
                                            Statut du site
                                        </Label>
                                        <Controller
                                            name="statut_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="statut_site" aria-invalid={!!getError("statut_site")}>
                                                        <SelectValue placeholder="Select interest type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {siteStatuses.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("statut_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("statut_site")}</p>
                                        )}
                                    </Field>

                                   
                                </div>

                                <Field>
                                    <Label htmlFor="description_site">description Site </Label>
                                    <Controller
                                        name="description_site"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                id="description_site"
                                                placeholder="Description courte qui pourra être utilisée sur le site web public..."
                                                rows={4}
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        )}
                                    />
                                    {getError("description_site") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("description_site")}</p>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor="description_detaille">description détaillée </Label>
                                    <Controller
                                        name="description_detaille"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                id="description_detaille"
                                                placeholder="Décrivez le site, son potentiel, son environnement, ses avantages..."
                                                rows={4}
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        )}
                                    />
                                    {getError("description_detaille") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("description_detaille")}</p>
                                    )}
                                </Field>
                            </CardContent>
                        </Card>

                        {/* Localisation */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-muted p-2">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Localisation & coordonnées GPS</CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Informations géographiques du site.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Field>
                                        <Label htmlFor="" className="required">
                                            Région
                                        </Label>
                                        <Controller
                                            name="region"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="region"
                                                    placeholder="Ex : Littoral"
                                                    {...field}
                                                    aria-invalid={!!getError("region")}
                                                />
                                            )}
                                        />
                                        {getError("region") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("region")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="Ville" className="required">
                                            Ville
                                        </Label>
                                        <Controller
                                            name="ville"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="ville"
                                                    placeholder="Ex : DOUALA"
                                                    {...field}
                                                    aria-invalid={!!getError("ville")}
                                                />
                                            )}
                                        />
                                        {getError("ville") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("ville")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="quartier" className="required">
                                            Quartier / Zone
                                        </Label>
                                        <Controller
                                            name="quartier"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="quartier"
                                                    placeholder="Ex : PK27"
                                                    {...field}
                                                    aria-invalid={!!getError("quartier")}
                                                />
                                            )}
                                        />
                                        {getError("quartier") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("quartier")}</p>
                                        )}
                                    </Field>
                                </div>

                                <Field>
                                    <Label htmlFor="" className="required">
                                        Localisation précise
                                    </Label>
                                    <Controller
                                        name="localisation_precise"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="localisation_precise"
                                                placeholder="Ex : Après le carrefour PK27, axe Douala - Edéa"
                                                {...field}
                                                aria-invalid={!!getError("localisation_precise")}
                                            />
                                        )}
                                    />
                                    {getError("localisation_precise") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("localisation_precise")}</p>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor="repere_connu" className="required">
                                        Repère connu
                                    </Label>
                                    <Controller
                                        name="repere_connu"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="repere_connu"
                                                placeholder="Ex : À 10 minutes de la route principale"
                                                {...field}
                                                aria-invalid={!!getError("repere_connu")}
                                            />
                                        )}
                                    />
                                    {getError("repere_connu") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("repere_connu")}</p>
                                    )}
                                </Field>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <Field>
                                        <Label htmlFor="" className="required">
                                            Latitude
                                        </Label>
                                        <Controller
                                            name="latitude"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="latitude"
                                                    placeholder="Ex : 3.891245"
                                                    {...field}
                                                    aria-invalid={!!getError("latitude")}
                                                />
                                            )}
                                        />
                                        {getError("latitude") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("latitude")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="longitude" className="required">
                                            Longitude
                                        </Label>
                                        <Controller
                                            name="longitude"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="longitude"
                                                    placeholder="Ex : 9.785421"
                                                    {...field}
                                                    aria-invalid={!!getError("longitude")}
                                                />
                                            )}
                                        />
                                        {getError("longitude") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("longitude")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="longitude" className="required">
                                            Lien Google Map
                                        </Label>
                                        <Controller
                                            name="lien_google"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="lien_google"
                                                    placeholder="https://maps.google.com/..."
                                                    {...field}
                                                    aria-invalid={!!getError("lien_google")}
                                                />
                                            )}
                                        />
                                        {getError("lien_google") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("lien_google")}</p>
                                        )}
                                    </Field>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informations commerciales */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-muted p-2">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Informations commerciales</CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Prix, superficies, lots et modalités de paiement.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">


                                <div className="grid gap-4 md:grid-cols-3">
                                    <Field>
                                        <Label htmlFor="prix_metre_carre" className="required">
                                            Prix par m²
                                        </Label>
                                        <Controller
                                            name="prix_metre_carre"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="prix_metre_carre"
                                                    placeholder="Ex : 30 000 FCFA"
                                                    {...field}
                                                    aria-invalid={!!getError("prix_metre_carre")}
                                                />
                                            )}
                                        />
                                        {getError("prix_metre_carre") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("prix_metre_carre")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="superficie_total" className="required">
                                            Superficie totale
                                        </Label>
                                        <Controller
                                            name="superficie_total"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="superficie_total"
                                                    placeholder="Ex : 12 hectares"
                                                    {...field}
                                                    aria-invalid={!!getError("superficie_total")}
                                                />
                                            )}
                                        />
                                        {getError("superficie_total") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("superficie_total")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="superficie_disponible" className="required">
                                            Superficie disponible
                                        </Label>
                                        <Controller
                                            name="superficie_disponible"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="superficie_disponible"
                                                    placeholder="Ex : 8 hectares"
                                                    {...field}
                                                    aria-invalid={!!getError("superficie_disponible")}
                                                />
                                            )}
                                        />
                                        {getError("superficie_disponible") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("superficie_disponible")}</p>
                                        )}
                                    </Field>
                                </div>

                                <div className="grid gap-4 md:grid-cols-4">
                                    <Field>
                                        <Label htmlFor="lots" className="required">
                                            Nombre total de lots
                                        </Label>
                                        <Controller
                                            name="lots"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="lots"
                                                    placeholder="85"
                                                    {...field}
                                                    aria-invalid={!!getError("lots")}
                                                />
                                            )}
                                        />
                                        {getError("lots") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("lots")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="lots_disponible" className="required">
                                            Nombre lots disponibles
                                        </Label>
                                        <Controller
                                            name="lots_disponible"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="lots_disponible"
                                                    placeholder="85"
                                                    {...field}
                                                    aria-invalid={!!getError("lots_disponible")}
                                                />
                                            )}
                                        />
                                        {getError("lots_disponible") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("lots_disponible")}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <Label htmlFor="lots_reserve" className="required">
                                            Lots réservés
                                        </Label>
                                        <Controller
                                            name="lots_reserve"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="lots_reserve"
                                                    placeholder="12"
                                                    {...field}
                                                    aria-invalid={!!getError("lots_reserve")}
                                                />
                                            )}
                                        />
                                        {getError("lots_reserve") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("lots_reserve")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="lots_vendus" className="required">
                                            Lots vendus
                                        </Label>
                                        <Controller
                                            name="lots_vendus"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="lots_vendus"
                                                    placeholder="25"
                                                    {...field}
                                                    aria-invalid={!!getError("lots_vendus")}
                                                />
                                            )}
                                        />
                                        {getError("lots_vendus") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("lots_vendus")}</p>
                                        )}
                                    </Field>
                                </div>

                                <Field>
                                    <Label htmlFor="modalite_paiement" className="required">
                                        Modalités de paiement
                                    </Label>
                                    <Controller
                                        name="modalite_paiement"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                id="modalite_paiement"
                                                placeholder="Ex : Paiement comptant ou échelonné sur 3 à 6 mois..."
                                                rows={4}
                                                {...field}
                                                aria-invalid={!!getError("modalite_paiement")}
                                            />
                                        )}
                                    />
                                    {getError("modalite_paiement") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("modalite_paiement")}</p>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor="frais_supplementaire" className="required">
                                        Frais supplémentaires éventuels
                                    </Label>
                                    <Controller
                                        name="frais_supplementaire"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                id="frais_supplementaire"
                                                placeholder="Ex : frais de dossier, frais de bornage, frais notariés..."
                                                rows={4}
                                                {...field}
                                                aria-invalid={!!getError("frais_supplementaire")}
                                            />
                                        )}
                                    />
                                    {getError("frais_supplementaire") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("frais_supplementaire")}</p>
                                    )}
                                </Field>
                            </CardContent>
                        </Card>

                        {/* Informations foncières */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-muted p-2">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Informations foncières & juridiques</CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Titre foncier, documents, procédure et risque juridique.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-3">

                                    <Field>
                                        <Label htmlFor="statut_site" className="required">
                                            Statut du titre foncier
                                        </Label>
                                        <Controller
                                            name="statut_numero_titre_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="statut_numero_titre_site" aria-invalid={!!getError("statut_numero_titre_site")}>
                                                        <SelectValue placeholder="Statut du titre foncier" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="disponible">Disponible</SelectItem>
                                                        <SelectItem value="en_verification">En vérification</SelectItem>
                                                        <SelectItem value="non_disponible">Non disponible</SelectItem>
                                                        <SelectItem value="non_confirme">Non confirmé</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("statut_numero_titre_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("statut_numero_titre_site")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="numero_titre_site" className="required">
                                            Numéro du titre foncier
                                        </Label>
                                        <Controller
                                            name="numero_titre_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="numero_titre_site"
                                                    placeholder="Ex : TF-2458/LT"
                                                    {...field}
                                                    aria-invalid={!!getError("numero_titre_site")}
                                                />
                                            )}
                                        />
                                        {getError("numero_titre_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("numero_titre_site")}</p>
                                        )}
                                    </Field>


                                    <Field>
                                        <Label htmlFor="statut_document_site" className="required">
                                            Statut documents
                                        </Label>
                                        <Controller
                                            name="statut_document_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="statut_document_site" aria-invalid={!!getError("statut_document_site")}>
                                                        <SelectValue placeholder="Statut documents du site" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {documentStatuses.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("statut_document_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("statut_document_site")}</p>
                                        )}
                                    </Field>


                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field>
                                        <Label htmlFor="procedure_acquisition_site" className="required">
                                            Procédure d’acquisition
                                        </Label>
                                        <Controller
                                            name="procedure_acquisition_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    id="procedure_acquisition_site"
                                                    placeholder="Ex : Contrat de partenariat signé avec fournisseur..."
                                                    rows={4}
                                                    {...field}
                                                    aria-invalid={!!getError("procedure_acquisition_site")}
                                                />
                                            )}
                                        />
                                        {getError("procedure_acquisition_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("procedure_acquisition_site")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="observation_topographique" className="required">
                                            Observations juridiques
                                        </Label>
                                        <Controller
                                            name="observation_topographique"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    id="observation_topographique"
                                                    placeholder="Notes internes sur les vérifications juridiques..."
                                                    rows={4}
                                                    {...field}
                                                    aria-invalid={!!getError("observation_topographique")}
                                                />
                                            )}
                                        />
                                        {getError("observation_topographique") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("observation_topographique")}</p>
                                        )}
                                    </Field>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Fournisseur */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-muted p-2">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Fournisseur / propriétaire</CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Informations sensibles internes, non destinées au site web
                                            public.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field>
                                        <Label htmlFor="nom_partenaire_site" className="required">
                                            Nom du fournisseur / propriétaire
                                        </Label>
                                        <Controller
                                            name="nom_partenaire_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="nom_partenaire_site"
                                                    placeholder="Ex : Famille Ngono"
                                                    {...field}
                                                    aria-invalid={!!getError("nom_partenaire_site")}
                                                />
                                            )}
                                        />
                                        {getError("nom_partenaire_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("nom_partenaire_site")}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <Label htmlFor="type_fournisseur_site" className="required">
                                            Type de fournisseur
                                        </Label>
                                        <Controller
                                            name="type_fournisseur_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="type_fournisseur_site" aria-invalid={!!getError("type_fournisseur_site")}>
                                                        <SelectValue placeholder="Select interest type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="proprietaire_familial">
                                                            Propriétaire familial
                                                        </SelectItem>
                                                        <SelectItem value="particulier">Particulier</SelectItem>
                                                        <SelectItem value="sci_partenaire">SCI partenaire</SelectItem>
                                                        <SelectItem value="promoteur">Promoteur</SelectItem>
                                                        <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("type_fournisseur_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("type_fournisseur_site")}</p>
                                        )}
                                    </Field>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">


                                    <Field>
                                        <Label htmlFor="telephone_fournisseur_site" className="required">
                                            Téléphone fournisseur
                                        </Label>
                                        <Controller
                                            name="telephone_fournisseur_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="telephone_fournisseur_site"
                                                    placeholder="+237 6 90 00 00 00"
                                                    {...field}
                                                    aria-invalid={!!getError("telephone_fournisseur_site")}
                                                />
                                            )}
                                        />
                                        {getError("telephone_fournisseur_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("telephone_fournisseur_site")}</p>
                                        )}
                                    </Field>


                                    <Field>
                                        <Label htmlFor="email_fournisseur_site" className="required">
                                            Email fournisseur
                                        </Label>
                                        <Controller
                                            name="email_fournisseur_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="email_fournisseur_site"
                                                    placeholder="contact@example.com"
                                                    {...field}
                                                    aria-invalid={!!getError("email_fournisseur_site")}
                                                />
                                            )}
                                        />
                                        {getError("email_fournisseur_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("email_fournisseur_site")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="statut_fournisseur_site" className="required">
                                            Statut fournisseur
                                        </Label>
                                        <Controller
                                            name="statut_fournisseur_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="statut_fournisseur_site" aria-invalid={!!getError("statut_fournisseur_site")}>
                                                        <SelectValue placeholder="Select interest type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {supplierStatuses.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("statut_fournisseur_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("statut_fournisseur_site")}</p>
                                        )}
                                    </Field>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">

                                    <Field>
                                        <Label htmlFor="fiabilite_fournisseur_site" className="required">
                                            Fiabilité fournisseur
                                        </Label>
                                        <Controller
                                            name="fiabilite_fournisseur_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="fiabilite_fournisseur_site" aria-invalid={!!getError("fiabilite_fournisseur_site")}>
                                                        <SelectValue placeholder="Select interest type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="elevee">Élevée</SelectItem>
                                                        <SelectItem value="moyenne">Moyenne</SelectItem>
                                                        <SelectItem value="faible">Faible</SelectItem>
                                                        <SelectItem value="a_verifier">À vérifier</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("fiabilite_fournisseur_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("fiabilite_fournisseur_site")}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Label htmlFor="prix_fournisseur_site" className="required">
                                            Prix fournisseur interne
                                        </Label>
                                        <Controller
                                            name="prix_fournisseur_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="prix_fournisseur_site"
                                                    placeholder="Ex : 1 800 000 FCFA / lot"
                                                    {...field}
                                                    aria-invalid={!!getError("prix_fournisseur_site")}
                                                />
                                            )}
                                        />
                                        {getError("prix_fournisseur_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("prix_fournisseur_site")}</p>
                                        )}
                                    </Field>
                                </div>
                                <Field>
                                    <Label htmlFor="note_comportement_fournisseur_site" className="required">
                                        Notes internes fournisseur
                                    </Label>
                                    <Controller
                                        name="note_comportement_fournisseur_site"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                id="note_comportement_fournisseur_site"
                                                placeholder="Notes sur la négociation, le comportement du fournisseur, les risques, les accords..."
                                                rows={5}
                                                {...field}
                                                aria-invalid={!!getError("note_comportement_fournisseur_site")}
                                            />
                                        )}
                                    />
                                    {getError("note_comportement_fournisseur_site") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("note_comportement_fournisseur_site")}</p>
                                    )}
                                </Field>
                            </CardContent>
                        </Card>

                        {/* Technique terrain */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-muted p-2">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Informations techniques terrain</CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Accès, eau, électricité, drainage, sol et bornage.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Field>
                                        <Label htmlFor="electricite_site" className="required">
                                            Électricité
                                        </Label>
                                        <Controller
                                            name="electricite_site"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="electricite_site" aria-invalid={!!getError("electricite_site")}>
                                                        <SelectValue placeholder="Select interest type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="disponible">Disponible</SelectItem>
                                                        <SelectItem value="a_proximite">À proximité</SelectItem>
                                                        <SelectItem value="non_disponible">Non disponible</SelectItem>
                                                        <SelectItem value="non_confirme">Non confirmé</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("electricite_site") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("electricite_site")}</p>
                                        )}
                                    </Field>


                                    <Field>
                                        <Label htmlFor="eau_true" className="required">
                                            Eau
                                        </Label>
                                        <Controller
                                            name="eau_true"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="eau_true" aria-invalid={!!getError("eau_true")}>
                                                        <SelectValue placeholder="Select ..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="disponible">Disponible</SelectItem>
                                                        <SelectItem value="a_proximite">À proximité</SelectItem>
                                                        <SelectItem value="non_disponible">Non disponible</SelectItem>
                                                        <SelectItem value="non_confirme">Non confirmé</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("eau_true") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("eau_true")}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <Label htmlFor="type_sol" className="required">
                                            Etat du sol
                                        </Label>
                                        <Controller
                                            name="type_sol"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="type_sol" aria-invalid={!!getError("type_sol")}>
                                                        <SelectValue placeholder="Select interest type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pente">Pente</SelectItem>
                                                        <SelectItem value="plat">Plat</SelectItem>
                                                        <SelectItem value="sec">Sec</SelectItem>
                                                        <SelectItem value="plane">Plane</SelectItem>
                                                        <SelectItem value="marecageux">Marécageux</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {getError("type_sol") && (
                                            <p className="text-sm text-red-500 mt-1">{getError("type_sol")}</p>
                                        )}
                                    </Field>

                                </div>


                            </CardContent>
                        </Card>

                        {/* Médias et documents */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-muted p-2">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Médias & documents</CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Ajoutez les photos, plans, rapports et documents du site.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Controller
                                        control={control}
                                        name="imageFiles"
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

                                    <Controller
                                        control={control}
                                        name="videoFile"
                                        render={({ field }) => (
                                            <UploadBox
                                                title="Vidéo"
                                                description="Présentation vidéo du site"
                                                type="video"
                                                field={field}
                                            />
                                        )}
                                    />


                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Controller
                                        control={control}
                                        name="plan_lotissement"
                                        render={({ field }) => (
                                            <UploadBox
                                                title="Plan de lotissement"
                                                description="Image ou PDF"
                                                type="file"
                                                field={field}
                                            />
                                        )}
                                    />


                                    <Controller
                                        control={control}
                                        name="document_foncier"
                                        render={({ field }) => (
                                            <UploadBox
                                                title="Plan de lotissement"
                                                description="Titre foncier, contrat, rapport, justificatifs."
                                                type="file"
                                                field={field}
                                            />
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Publication */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Publication web</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="flex items-center justify-between rounded-2xl border p-4">
                                    <div>
                                        <Label className="font-medium">Visible sur le site web</Label>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Le site pourra apparaître sur la plateforme publique.
                                        </p>
                                    </div>

                                    <Switch
                                        checked={publicVisible}
                                        onCheckedChange={setPublicVisible}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-2xl border p-4">
                                    <div>
                                        <Label className="font-medium">Mettre en avant</Label>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Le site pourra apparaître dans les biens recommandés.
                                        </p>
                                    </div>

                                    <Switch checked={featured} onCheckedChange={setFeatured} />
                                </div>

                                <Separator />


                            </CardContent>
                        </Card>

                        {/* Workflow */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Suivi interne</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-5">


                                <Field>
                                    <Label htmlFor="niveau_risque_juridique_site" className="required">
                                        Niveau de risque
                                    </Label>
                                    <Controller
                                        name="niveau_risque_juridique_site"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger id="niveau_risque_juridique_site" aria-invalid={!!getError("niveau_risque_juridique_site")}>
                                                    <SelectValue placeholder="Select level ..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="eleve">Elévée</SelectItem>
                                                    <SelectItem value="moyen">
                                                        Moyen
                                                    </SelectItem>
                                                    <SelectItem value="aucun">Aucun</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {getError("niveau_risque_juridique_site") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("niveau_risque_juridique_site")}</p>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor="topographe_responsable" className="required">
                                        Topographe responsable
                                    </Label>
                                    <Controller
                                        name="topographe_responsable"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger id="topographe_responsable" aria-invalid={!!getError("topographe_responsable")}>
                                                    <SelectValue placeholder="Select responsable..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="daniella"> Daniella </SelectItem>
                                                    <SelectItem value="kevin">
                                                        Kevin Wakap
                                                    </SelectItem>
                                                    <SelectItem value="marie">Dakayi Marie</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {getError("topographe_responsable") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("topographe_responsable")}</p>
                                    )}
                                </Field>

                                {/*  <FormField label="Date de prospection">
                                    <Input type="date" />
                                </FormField>
                                 <Field>
                                    <Label htmlFor="derniere_visite" className="required">
                                        Date de prospection
                                    </Label>

                                    <Controller
                                        name="derniere_visite"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger>
                                                    <Button
                                                        id="derniere_visite"
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal"
                                                        aria-invalid={!!getError("derniere_visite")}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />

                                                        {field.value ? (
                                                            format(new Date(field.value), "PPP", {
                                                                locale: fr,
                                                            })
                                                        ) : (
                                                            <span>Choisir une date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value
                                                                ? new Date(field.value)
                                                                : undefined
                                                        }
                                                        onSelect={(date) => {
                                                            field.onChange(
                                                                date
                                                                    ? format(date, "yyyy-MM-dd")
                                                                    : ""
                                                            );
                                                        }}

                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />

                                    {getError("derniere_visite") && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {getError("derniere_visite")}
                                        </p>
                                    )}
                                </Field> */}

                                <Field>
                                    <Label htmlFor="derniere_visite" className="required">
                                        Dernière visite
                                    </Label>

                                    <Controller
                                        name="derniere_visite"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger>
                                                    <Button
                                                        id="derniere_visite"
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal"
                                                        aria-invalid={!!getError("derniere_visite")}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />

                                                        {field.value ? (
                                                            format(new Date(field.value), "PPP", {
                                                                locale: fr,
                                                            })
                                                        ) : (
                                                            <span>Choisir une date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value
                                                                ? new Date(field.value)
                                                                : undefined
                                                        }
                                                        onSelect={(date) => {
                                                            field.onChange(
                                                                date
                                                                    ? format(date, "yyyy-MM-dd")
                                                                    : ""
                                                            );
                                                        }}

                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />

                                    {getError("derniere_visite") && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {getError("derniere_visite")}
                                        </p>
                                    )}
                                </Field>
                                <Field>
                                    <Label htmlFor="prochaine_action" className="required">
                                        Prochaine action
                                    </Label>
                                    <Controller
                                        name="prochaine_action"
                                        control={control}
                                        render={({ field }) => (

                                            <Textarea
                                                id="prochaine_action"
                                                placeholder="Ex : Vérifier les documents, refaire les photos, confirmer le nombre de lots..."
                                                rows={5}
                                                {...field}
                                                aria-invalid={!!getError("prochaine_action")}
                                            />
                                        )}
                                    />
                                    {getError("prochaine_action") && (
                                        <p className="text-sm text-red-500 mt-1">{getError("prochaine_action")}</p>
                                    )}
                                </Field>
                            </CardContent>
                        </Card>

                        {/* Validation checklist */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Checklist qualité</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <ChecklistItem label="Nom et code interne renseignés" />
                                <ChecklistItem label="Localisation précise renseignée" />
                                <ChecklistItem label="Latitude et longitude ajoutées" />
                                <ChecklistItem label="Prix et lots disponibles renseignés" />
                                <ChecklistItem label="Fournisseur identifié" />
                                <ChecklistItem label="Titre foncier vérifié" />
                                <ChecklistItem label="Photo principale ajoutée" />
                                <ChecklistItem label="Risque terrain évalué" />
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="space-y-3 p-5">
                                <Button disabled={isPending} className="w-full" type="submit">
                                    <Save className="mr-2 h-4 w-4" />
                                    Enregistrer le site
                                </Button>

                                <Button variant="outline" className="w-full">
                                    Enregistrer en brouillon
                                </Button>

                                <Button variant="ghost" className="w-full">
                                    <Link href="/dashboard/topography/sites">Annuler</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </form>
        </div>
    );
}

function FormField({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label>
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>
            {children}
        </div>
    );
}



function ChecklistItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border p-3">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{label}</span>
        </div>
    );
}