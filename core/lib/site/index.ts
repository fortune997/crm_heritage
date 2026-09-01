import z from "zod"


export const siteSchema = z.object({
    nom_titre: z.string().trim().min(1, "Nom obligatoire"),

    type_site: z.string().trim().min(1),
    statut_site: z.string().trim().min(1),
   

    description_site: z.string().optional(),
    description_detaille: z.string().optional(),

    region: z.string().trim().min(1),
    ville: z.string().trim().min(1),
    quartier: z.string().trim().min(1),
    localisation_precise: z.string().optional(),
    repere_connu: z.string().trim().min(1),

    latitude: z.string().optional(),
    longitude: z.string().optional(),
    lien_google: z.string().optional(),

    prix_metre_carre: z.string().min(1),
    superficie_total: z.string().min(1),
    superficie_disponible: z.string().min(1),

    lots: z.string().optional(),
    lots_disponible: z.string().optional(),

    lots_vendus: z.string().optional(),
    lots_reserve: z.string().optional(),

    modalite_paiement: z.string().trim().min(1),

    numero_titre_site: z.string().trim().min(1),
    statut_numero_titre_site: z.string().trim().min(1),
    statut_document_site: z.string().trim().min(1),
    procedure_acquisition_site: z.string().trim().min(1),

    niveau_risque_juridique_site: z.string().optional(),

    nom_partenaire_site: z.string().trim().min(1),
    type_fournisseur_site: z.string().trim().min(1),
    telephone_fournisseur_site: z.string().optional(),

    email_fournisseur_site: z
        .string()
        .email("Email invalide")
        .optional()
        .or(z.literal("")),

    statut_fournisseur_site: z.string().trim().min(1),
    fiabilite_fournisseur_site: z.string().trim().min(1),
    prix_fournisseur_site: z.string().trim().optional(),
    note_comportement_fournisseur_site: z.string().optional(),
    frais_supplementaire: z.string().optional(),

    electricite_site: z.string().trim().min(1),
    eau_true: z.string().trim().min(1),
    type_sol: z.string().trim().min(1),

    topographe_responsable: z.string().optional(),

    prochaine_action: z.string().optional(),
    derniere_visite: z.string().optional(),

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
