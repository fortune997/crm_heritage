import { z } from "zod";

export const acquisitionChannelSchema = z.object({
    nom: z
        .string()
        .min(2, "Le nom est obligatoire.")
        .max(100),

    type: z
        .string()
        .min(1, "Veuillez sélectionner un type."),

    category: z
        .string()
        .min(1, "Veuillez sélectionner une catégorie."),

    statut: z.boolean(),

    owner: z
        .string()
        .min(2, "Le responsable est obligatoire."),

    description: z
        .string()
        .max(500)
        .optional(),

    cost: z.string(),

    leads: z.string(),

    qualifiedLeads: z.string(),

    conversions: z.string(),
});

export type AcquisitionChannelFormValues = z.infer<typeof acquisitionChannelSchema>;

