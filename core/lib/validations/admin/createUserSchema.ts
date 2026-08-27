import { z } from "zod";


export const createUserSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(2, "Le prénom doit contenir au moins 2 caractères."),

    last_name: z
        .string()
        .trim()
        .min(2, "Le nom doit contenir au moins 2 caractères."),

    email: z
        .string()
        .trim()
        .email("Veuillez saisir une adresse email valide."),

    phone: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    password: z
        .string(),

    roleId: z
        .string()
        .min(1, "Veuillez sélectionner un rôle."),

    department: z.string(),
    /*  avatarUrl: z
         .instanceof(File)
         .nullable()
         .optional(),
  */

    status: z.string(),
    brandIds: z
        .array(z.string())
        .min(1, "Veuillez sélectionner au moins une marque."),


});


export type CreateUserFormValues = z.infer<typeof createUserSchema>;



export const createRoleSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Le name doit contenir au moins 2 caractères."),

    description: z
        .string()
        .trim()
        .min(2, "Le description doit contenir au moins 2 caractères."),

});


export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;