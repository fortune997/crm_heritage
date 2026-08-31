import z from "zod"


export const siteSchema = z.object({
    nom_titre: z.string().trim().min(1, "Nom obligatoire"),

    type_site: z.string().trim().min(1),
    statut_site: z.string().trim().min(1),
   

    description_site: z.string().trim().min(1),
    description_detaille: z.string().trim().min(1),

    region: z.string().trim().min(1),
    ville: z.string().trim().min(1),
    quartier: z.string().trim().min(1),
    localisation_precise: z.string().trim().min(1),
    repere_connu: z.string().trim().min(1),

    latitude: z.string().trim().min(1),
    longitude: z.string().trim().min(1),
    lien_google: z.string().trim().min(1),

    prix_metre_carre: z.string().min(1),
    superficie_total: z.string().min(1),
    superficie_disponible: z.string().min(1),

    lots: z.string().min(0),
    lots_disponible: z.string().min(0),

    lots_vendus: z.string().min(0),
    lots_reserve: z.string().min(0),

    modalite_paiement: z.string().trim().min(1),

    numero_titre_site: z.string().trim().min(1),
    statut_numero_titre_site: z.string().trim().min(1),
    statut_document_site: z.string().trim().min(1),
    procedure_acquisition_site: z.string().trim().min(1),

    niveau_risque_juridique_site: z.string().trim().min(1),

    nom_partenaire_site: z.string().trim().min(1),
    type_fournisseur_site: z.string().trim().min(1),
    telephone_fournisseur_site: z.string().trim().min(1),

    email_fournisseur_site: z
        .string()
        .email("Email invalide")
        .optional()
        .or(z.literal("")),

    statut_fournisseur_site: z.string().trim().min(1),
    fiabilite_fournisseur_site: z.string().trim().min(1),
    prix_fournisseur_site: z.string().trim().min(1),
    note_comportement_fournisseur_site: z.string().trim().min(1),
    frais_supplementaire: z.string().trim().min(1),

    electricite_site: z.string().trim().min(1),
    eau_true: z.string().trim().min(1),
    type_sol: z.string().trim().min(1),

    topographe_responsable: z.string().trim().min(1),

    prochaine_action: z.string().trim().min(1),
    derniere_visite: z.string().trim().min(1),

    imageFiles: z
        .array(z.instanceof(File))
        .min(2, "Au moins 2 images sont requises")
        .max(10, "Maximum 10 images"),

    videoFile: z.instanceof(File).optional(),
    observation_topographique: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),
    document_foncier: z.instanceof(File).optional(),

    plan_lotissement: z.instanceof(File).optional(),
});

export type TSiteValues = z.infer<typeof siteSchema>
