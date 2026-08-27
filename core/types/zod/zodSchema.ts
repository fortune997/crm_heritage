import { z } from "zod"


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






