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