import { z } from "zod"

export const ZFormSchemaProspect = z.object({
    nom: z.string().trim().min(2, {
        message: "Le doit contenir minimum 2 caractères.",
    }),


    corporate: z.boolean().default(false),
    telephone: z.string().trim().min(9, {
        message: "Le numero de téléphone doit contenir 9 chiffres."
    }),
    telephone2: z.string().optional(),
    sexe: z.string().trim().nonempty({
        message: "Veuillez sélectionner un sexe."
    }),
    site_concerne: z.string().trim().nonempty({
        message: "Veuillez sélectionner un site."
    }),
    chargee_clientele: z.string().trim().nonempty({
        message: "Veuillez sélectionner une chargée clientèle."
    }),
    canal_prospection: z.string().trim().nonempty({
        message: "Veuillez sélectionner un canal."
    }),
    statut_appel: z.string().trim().nonempty({
        message: "Veuillez entrer un statut."
    }).optional(),
    date_rdv: z.date({
        message: "Veuillez entrer une date.",
    }).optional(),
    statut_rdv: z.string().trim().nonempty({
        message: "Veuillez entrer un statut."
    }).optional(),
    services: z.string().trim().nonempty({
        message: "Veuillez entrer le service."
    }),
})

export const ZFormSchemaStock = z.object({
    nom_produit: z.string().trim().min(2, { message: "Le doit contenir minimum 2 caractères." }),
    reference: z.string(),
})

export const ZFormSchemaPlan = z.object({
    duree_mois: z.string(),
    labels: z.string(),
})

export const ZFormSchemaGC = z.object({
    nom: z.string().trim().min(2, {
        message: "Le doit contenir minimum 2 caractères.",
    }),
    entreprise: z.string(),
    categorie_corporate: z.string(),
    ville: z.string().trim().min(2, {
        message: "Le doit contenir minimum 2 caractères.",
    }),
    email: z.string().optional(),
    corporate: z.boolean().default(false),
    telephone: z.string().trim().min(9, {
        message: "Le numero de téléphone doit contenir 9 chiffres."
    }),
    sexe: z.string().trim().nonempty({
        message: "Veuillez sélectionner un sexe."
    }),
    site_concerne: z.string().trim().nonempty({
        message: "Veuillez sélectionner un site."
    }),
    chargee_clientele: z.string().trim().nonempty({
        message: "Veuillez sélectionner une chargée clientèle."
    }),
    canal_prospection: z.string().trim().nonempty({
        message: "Veuillez sélectionner un canal."
    }),
    statut_rdv: z.string().trim().nonempty({
        message: "Veuillez sélectionner un canal."
    }),
    services: z.string().trim().nonempty({
        message: "Veuillez entrer le service."
    }),
})




export const TPCorporateSchema = z.object({
    nom: z.string().optional(),
    telephone: z.string().optional(),
    email: z.string().optional(),
    entreprise: z.string().min(1, "Le nom de l'entreprise est requis"),
    reference: z.string().optional(),
    chargee_clientele: z.string().optional(),
    statut_rdv: z.string().optional(),
    services: z.string().min(1, "Le champ services est requis"),
    localisation: z.string().min(1, "La localisation est requise"),
    /* date_depot:  z.date({
          message: "Veuillez entrer une date.",
      }).optional(), */

});

export type TPCorporate = z.infer<typeof TPCorporateSchema>;



export type CorporateFormValues = z.infer<typeof ZFormSchemaGC>
export type PropsectFormValues = z.infer<typeof ZFormSchemaProspect>

export const ZFormSchemaLead = z.object({
    telephone: z.string().min(1, "Veuillez saisir au moins un numéro"),
    leads: z.boolean()
});

export const ZFormSchemaRapportVisit = z.object({
    superficie_demande: z.string(),
    degre_interessement: z.string(),
    rapport_visite: z.string()
});

export type RapportVisitFormValues = z.infer<typeof ZFormSchemaRapportVisit>


export const ZFormSchemaDaily = z.object({
    prospect_id: z.number(),
    statut_appel: z.string().trim().nonempty({
        message: "Veuillez saisir un statut."
    }),
    date_rdv: z.date({
        message: "Veuillez entrer une date.",
    }),
    date_depot: z.date({
        message: "Veuillez entrer une date de dépot.",
    }).optional(),
    nature_echange: z.string().trim().nonempty({
        message: "Veuillez saisir la nature de l'échange."
    }),
    decharge: z.boolean().optional(),
    statut_rdv: z.string().trim().nonempty({
        message: "Veuillez sélectionner un statut."
    }),
    canal_echange: z.string().trim().nonempty({
        message: "Veuillez sélectionner un cqnql."
    }),
    prospect: ZFormSchemaProspect.optional()
})

export const ZFormSchemaCreateVisit = z.object({
    prospect_id: z.number(),
    bien_id: z.coerce.number(),
    nb_personne: z.coerce.number(),
    prix: z.number(),
    status_visite: z.string().trim().nonempty({ message: "Veuillez saisir un statut." }),
    date_visite: z.date({ message: "Veuillez entrer une date visite.", }),
    heure: z.string().trim().nonempty({ message: "Veuillez saisir l'heure." }),


})
export type TFormSchemaCreateVisit = z.infer<typeof ZFormSchemaCreateVisit>



export const ZFormSchemaClient = z.object({
    prospect_id: z.number(),
    adresse: z.string().optional(),
    profession: z.string(),
    commentaire: z.string(),
    photo: z.union([z.string(), z.instanceof(File), z.undefined()]).optional(),
    adresse_mail: z.string().optional(),

});
export type TFormSchemaClient = z.infer<typeof ZFormSchemaClient>
export const ZFormSchemaCategorie = z.object({
    description: z.string().trim().nonempty({ message: "Veuillez sélectionner une Description." }),
    titre: z.string(),
    image_url: z.union([z.string(), z.instanceof(File), z.undefined()]),
});

export const ZFormSchemaRapportVisite = z.object({
    note: z.string().trim().nonempty({ message: "Veuillez sélectionner une note de la Visite." }),
    rapport_visite: z.string(),

});

export const ZFormEspecePaiement = z.object({
    description: z.string().trim().nonempty({ message: "Veuillez sélectionner une note de la Visite." }),
    methode_paiement: z.string(),
    status: z.string(),
    reference: z.string(),
    telephone: z.string(),
    nb_jours: z.number().optional(),
    type_paiement: z.string(),
    amount: z.number(),
    propriete_id: z.number(),
    user_id: z.string(),
    bail_id: z.number(),
    date_period_bail: z.object({
        from: z.date(),
        to: z.date(),
    }),

});




export const ZFormSchemaRecouvrement = z.object({
    vente_id: z.number(),
    frais_dossier: z.number().optional(),
    lot: z.string().optional(),
    bloc: z.string().optional(),
    montant_total: z.number().optional(),
    montant_recu: z.number().min(0, {
        message: "Veuillez entrer le montant recu.",
    }),
    superficie: z.number().optional(),
    prix_m2: z.number().optional(),
    date_prochain_versement: z
        .union([z.date(), z.string().transform((val) => new Date(val))])
        .optional()
        .nullable()
        .refine(
            (val) => !val || val instanceof Date && !isNaN(val.getTime()),
            "Date de versement invalide"
        ),
    client: ZFormSchemaClient.optional()
})


const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIMES = ["image/png", "image/jpeg", "application/pdf"];

export const uploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((f) => f.size > 0 && f.size <= MAX_SIZE_BYTES, {
            message: `Le fichier doit faire au maximum ${MAX_SIZE_BYTES / (1024 * 1024)} MB`,
        })
        .refine((f) => ALLOWED_MIMES.includes(f.type), {
            message: "Types acceptés: png, jpeg, pdf",
        }),
});

export const ZFormSchemaVente = z.object({
    client_id: z.number().min(1, "Veuillez sélectionner un client."),
    lot: z.string().min(1, "Veuillez entrer le lot."),
    prix_m2: z.number().min(1, "Veuillez entrer le prix au m²."),
    titre_foncier: z.string(),
    total_a_payer: z.number().min(1, "Veuillez entrer le prix total."),
    dossier_tech: z.number().min(0, "Veuillez entrer le prix du dossier technique."),
    bornage: z.number().optional(),
    superficie: z.number().min(1, "Veuillez entrer la superficie."),
    bloc: z.string().min(1, "Veuillez entrer le bloc."),
    statut_paiement: z.string().min(1, "Veuillez entrer le statut."),
    categorie: z.string(),

    date_echeance_bornage: z.string().optional(),
    date_echeance_dt: z.string().optional(),
    date_echeance_convention: z.string().optional(),
    date_echeance_pv: z.string().optional(),


})

export const ZFormSchemaPaiementRecouvrement = z.object({
    date_paiement: z.date({ message: "Veuillez sélectionner une date" }),
    montant_recu: z.number().min(1000, "Entrez un montant "),
    statut_paiement: z.string({ message: "Sélectionner le statut du paiement" }),
    methode_paiement: z.string({ message: "Sélectionner la méthode de paiement" }),
    retard_paiement: z.number(),
    date_prochain_paiement: z.date().optional(),
});


export const ZFormSchemaPublication = z.object({
    titre: z.string().trim().min(2, {
        message: "Le titre est trop court."
    }).optional(),
    description: z.string().trim().nonempty({
        message: "Veuillez entrez le contenu."
    }).optional(),
    lien: z.string().trim().nonempty({
        message: "Veuillez entrez le lien"
    }).optional(),
    date_pub: z.date(),
    image: z.string().trim().nonempty({
        message: "Veuillez entrez le lien"
    }).optional(),
    views: z.string().trim().nonempty({
        message: "veuillez entrez un nombre"
    }).optional(),
    likes: z.string().trim().nonempty({
        message: "Veuillez entrez un nombre."
    }).optional(),
    comments: z.string().trim().nonempty({
        message: "Veuillez entrez un nombre."
    }).optional(),
    shares: z.string().trim().nonempty({
        message: "Veuillez entrez un nombre."
    }).optional(),
    plateform_name: z.string().nonempty({
        message: "Veuillez sélectionner un réseau social."
    }).optional(),
    plateform_icon: z.string().nonempty({
        message: "Veuillez sélectionner un réseau social."
    }).optional(),
    plateform_color: z.string().nonempty({
        message: "Veuillez sélectionner un réseau social."
    }).optional(),
    author_name: z.string().nonempty({
        message: "Veuillez sélectionner un réseau social."
    }).optional(),
    author_avatar: z.string().nonempty({
        message: "Veuillez sélectionner un réseau social."
    }).optional(),
})


export const ZFormSchemaSocial = z.object({
    titre: z.string().trim().min(2, {
        message: "Le titre est trop court."
    }),
    username: z.string().trim().nonempty({
        message: "Veuillez entrez un nombre."
    }),
    follower: z.string().trim().nonempty({
        message: "Veuillez entrez un nombre."
    }),
    follow: z.string().trim().nonempty({
        message: "Veuillez entrez un nombre."
    }),
    post: z.string().nonempty({
        message: "Veuillez sélectionner un réseau social."
    }),
    icon: z.string().nonempty({
        message: "Veuillez sélectionner une icone."
    }).optional(),
    image: z.string().nonempty({
        message: "Veuillez sélectionner un réseau social."
    }).optional(),
    couleur: z.string().nonempty({
        message: "Veuillez sélectionner une couleur."
    }),
})

// Définition du schéma de validation pour le formulaire de terrain
export const ZFormSchemaTerrain = z.object({
    titre: z.string().min(2, {
        message: "Le nom doit comporter au moins 2 caractères.",
    }),
    adresse: z.string().min(5, {
        message: "L'adresse doit comporter au moins 5 caractères.",
    }),
    ville: z.string().min(2, {
        message: "La ville doit comporter au moins 2 caractères.",
    }),
    codePostal: z.string().min(5, {
        message: "Le code postal doit comporter au moins 5 caractères.",
    }),
    superficie: z.string().min(1, {
        message: "La superficie est requise.",
    }),
    prix: z.string().min(1, {
        message: "Le prix est requis.",
    }),
    type: z.string({
        required_error: "Veuillez sélectionner un type de terrain.",
    }),
    statut: z.string({
        required_error: "Veuillez sélectionner un statut.",
    }),
    image: z.string({
        required_error: "Veuillez sélectionner une image.",
    }).optional(),
    description: z
        .string()
        .max(500, {
            message: "La description ne doit pas dépasser 500 caractères.",
        }),

    media: z.number().optional(),
    latitude: z.string().min(1, "La latitude doit être supérieure à 0"),
    longitude: z.string().min(1, "La longitude doit être supérieure à 0"),
    point_rencontre: z.string().min(1, "Le point rencontre est requis"),
    lat_point_rencontre: z.string().min(1, "Le point rencontre est requis"),
    long_point_rencontre: z.string().min(1, "Le point rencontre est requis"),
    zone: z.string().min(1, "La zone est requise"),
    constructible: z.boolean().default(false),
    promotion: z.boolean().default(false),
    viabilise: z.boolean().default(false),
    pente: z.boolean().default(false),
    imageFiles: z.array(z.instanceof(File)).min(2, "2 images minimun sont requises").max(10, "Maximum 10 images"),
    videoFile: z.instanceof(File).optional()


})

export type TFormSchemaSite = z.infer<typeof ZFormSchemaTerrain>
export type TFormSchemaVisite = z.infer<typeof ZFormSchemaVisite>
const VisitStatusEnum = z.enum(["programmé", "en cours", "terminer"])

export const ZFormSchemaVisite = z.object({
    title: z.string().min(2, {
        message: "Veuillez saisir un titre.",
    }),
    date_visite: z.date({
        message: "Veuillez entrer une date de visite."
    }),
    startTime: z.string().min(2, {
        message: "Veuillez entrer une heure."
    }),
    endTime: z.string().min(2, {
        message: "Veuillez entrer une heure."
    }),
    prospect_name: z.string().min(2, {
        message: "Veuillez sélectionner un prospect."
    }),
    prospect_id: z.number(),

    status: VisitStatusEnum.refine(
        (val) => VisitStatusEnum.options.includes(val),
        { message: "Veuillez entrer un statut valide : creer, en cours ou terminer." }
    ),
    site: z.string().min(2, {
        message: "Veuillez sélectionner un site."
    }),
    contact: z.string().min(2, {
        message: "Veuillez entrer un contact."
    }),
    tarifTransport: z.string().min(2, {
        message: "Veuillez entrer un tarif."
    }),
    numberVisitor: z.string().min(2, {
        message: "Veuillez entrer un nombre."
    }),
    transportType: z.string().min(2, {
        message: "Veuillez sélectionner le transport."
    }),
})

export const ZFormSchemaUser = z.object({
    email: z.string().trim().min(2, {
        message: "Vore email."
    }),
    password: z.string().trim().nonempty({
        message: "Votre password."
    }),
})

export const ZFormSchemaForgot = z.object({ email: z.string() })
export const ZFormSchemaResetPassword = z.object({ password: z.string().trim().nonempty({ message: "Votre password." }), })

export const ZFormSchemaCanal = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().min(1, "La description est requise"),
    type: z.string().min(1, "Le type est requis"),
    statut: z.boolean()
})

export const ZFormSchemaEmploye = z.object({
    nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Email invalide" }),
    telephone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
    adresse: z.string().min(5, { message: "Adresse trop courte" }),
    poste: z.string().min(2, { message: "Poste requis" }),
    departement: z.string().min(2, { message: "Département requis" }),
    statut: z.string().min(2, { message: "Statut requis" }),
    salaire: z.coerce.number().positive({ message: "Le salaire doit être positif" }),
    date_embauche: z.date(),
    photo: z
        .instanceof(File)
        .nullable()
        .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
            message: "La photo ne doit pas dépasser 5MB",
        }),
    cv: z
        .instanceof(File)
        .nullable()
        .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
            message: "Le CV ne doit pas dépasser 5MB",
        }),
})



export const ZFormAddCalineHouseProspect = z.object({
    nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }).max(50, { message: "Le nom ne peut pas dépasser 50 caractères" }),
    typeClient: z.string(),
    statut: z.string().min(1, { message: "Le statut est obligatoire" }),

    budget: z.string(),
    nb_mois: z.string().optional(),
    description: z.string().min(2, { message: "Decrire la propriété" }).max(500, { message: "La description ne peut pas dépasser 500 caractères" }).optional(),
    commerciale: z.string(),
    typeLogement: z.array(z.string()).min(1, "Choisissez au moins un type de propriété"),
    prenom: z.string().optional(),

    telephone: z.string().regex(/^(?:\+237|237)?6\d{8}$/, { message: "Numéro de téléphone invalide. Exemple: +237655889677" }).optional(),
    telephone_mtn: z.string().optional(),

    sexe: z.enum(["Homme", "Femme"], { errorMap: () => ({ message: "Le sexe doit être 'Homme' ou 'Femme'" }), }),


    ville: z
        .string()
        .min(2, { message: "La ville doit contenir au moins 2 caractères" })
        .max(50, { message: "La ville ne peut pas dépasser 50 caractères" }),

    quartier: z
        .string()
        .min(2, { message: "Le quartier doit contenir au moins 2 caractères" })
        .max(50, { message: "Le quartier ne peut pas dépasser 50 caractères" }),
});

export const ZFormAddInteractionCalineHouseProspect = z.object({

    description: z.string(),
    prochainSuivi: z.string().optional(),
    resultat: z.string(),
    type_interaction: z.string(),
    prospect_caline_house_id: z.number()




});

export const ZFormAddInteractionLandProspect = z.object({

    description: z.string(),
    prochainSuivi: z.date({
        message: "Veuillez entrer une date.",
    }).optional(),
    resultat: z.string(),
    type_interaction: z.string(),
    prospect_land_id: z.number(),
    nature_echange: z.string().optional()


});



export const ZFormSchemaPlanProspect = z.object({
    prospect_id: z.number(),
    plan_id: z.number(),
    status: z.boolean().default(false),
    debut_date: z.date(),
    date_prochain_paiement: z.date(),
    total_a_payer: z.number().positive(),
    pourcentage_recu: z.number().min(0).max(100),
});


export type TFormSchemaAddInteractionCalineHouseProspect = z.infer<typeof ZFormAddInteractionCalineHouseProspect>
export type TFormSchemaAddInteractionLandProspect = z.infer<typeof ZFormAddInteractionLandProspect>
export type TFormSchemaProspectCaline = z.infer<typeof ZFormAddCalineHouseProspect>