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

export type LoginFormValues = z.infer<typeof loginSchema>;