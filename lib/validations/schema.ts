import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "L'adresse email est obligatoire")
        .email("Adresse email invalide"),

    password: z
        .string()
        .min(1, "Le mot de passe est obligatoire")
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"),

    rememberMe: z.boolean(),
});


export const companySchema = z.object({
    name: z.string().min(2, "Le nom de l’entreprise est obligatoire"),
    slug: z
        .string()
        .min(2, "Le slug est obligatoire")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Le slug doit contenir uniquement des minuscules, chiffres et tirets"
        ),

    legal_name: z.string().optional(),
    company_type: z.enum(["sci", "logistique", "conseil", "holding", "autre"]),

    email: z.string().email("Email invalide").optional().or(z.literal("")),
    phone: z.string(),
    address: z.string().optional(),

    logo_url: z.string().url("URL invalide").optional().or(z.literal("")),

    status: z.enum(["active", "inactive"]),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;

// Zod schema
export const prospectSchema = z
    .object({
        full_name: z.string().min(1, "Full name is required"),
        sexe: z.string().min(1, "Sexe is required"),
        langue: z.string().min(1, "Langue is required"),
        phone: z.string().min(1, "Phone number is required"),
        site_interesse: z.string().min(1, "Site intéresse"),
        canal_prospection: z.string().min(1, "Source is required"),
        message: z.string().optional(),
        qualification: z.string(),
    })


export type ProspectFormValues = z.infer<typeof prospectSchema>;


export const activitySchema = z.object({
    prospect_id: z.string().min(1, "Recherchez un prospect"),

    titre: z.string().min(3, "Le titre est obligatoire"),

    description: z.string().min(5, "La description est obligatoire"),
    qualification: z.string().optional(),
    canal_relance: z.string().min(1, "Sélectionnez le canal de relance"),
    statut_activite: z.string().min(1, "Sélectionnez le statut d'activité"),

    prochain_relance: z.date(),
});


export type ActivitiesFormValues = z.infer<typeof activitySchema>;
