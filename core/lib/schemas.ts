import { z } from "zod"

export const localisationSchema = z.object({
  adresse: z.string().min(1, "L'adresse est requise"),
  ville: z.string().min(1, "La ville est requise"),
  quartier: z.string().min(1, "Le quartier est requis"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export const proprietaireSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
})

export const chargeCommercialSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
})

export const categorieSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
})

export const bienSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  prix: z.number().min(1, "Le prix doit être supérieur à 0"),
  nb_chambre: z.number().min(0, "Le nombre de chambres doit être positif"),
  nb_salle_bain: z.number().min(0, "Le nombre de salles de bain doit être positif"),
  nb_salon: z.number().min(0, "Le nombre de salons doit être positif"),
  nb_cuisine: z.number().min(0, "Le nombre de cuisines doit être positif"),
  parking: z.boolean(),
  superficie: z.number().min(1, "La superficie doit être supérieure à 0"),
  status_occupation: z.boolean(),
  wifi: z.boolean(),
  localisation: localisationSchema,
  nb_mois_requis: z.number().min(1, "Le nombre de mois requis doit être supérieur à 0"),
  nb_mois_requis_second_paiement: z
    .number()
    .min(1, "Le nombre de mois pour le second paiement doit être supérieur à 0"),
  proprietaire: proprietaireSchema,
  charge_commercial: chargeCommercialSchema,
  categorie_bien: categorieSchema,
  prix_visite: z.number().min(0, "Le prix de visite doit être positif"),
})

export type BienFormData = z.infer<typeof bienSchema>
