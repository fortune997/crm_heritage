import { z } from "zod"



export const propertySchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  prix: z.number().min(1, "Le prix doit être supérieur à 0"),
  nb_chambre: z.number().min(0, "Le nombre de chambres doit être positif"),
  nb_salle_bain: z.number().min(0, "Le nombre de salles de bain doit être positif"),
  nb_salon: z.number().min(0, "Le nombre de salons doit être positif"),
  nb_cuisine: z.number().min(0, "Le nombre de cuisines doit être positif"),
  parking: z.boolean(),
  superficie: z.number().min(1, "La superficie doit être supérieure à 0"),
  status_occupation: z.boolean(),
  wifi: z.boolean(),
  balcon: z.boolean().optional(),
  climatisation: z.boolean().optional(),
  internet: z.boolean().optional(),
  machineALaver: z.boolean().optional(),
  eauChaude: z.boolean().optional(),
  electriciteIncluse: z.boolean().optional(),
  gardiennage: z.boolean().optional(),
  cuisineEquipee: z.boolean().optional(),
  canal:z.boolean().optional(),
  localisation: z.object({
    ville: z.string().min(1, "La ville est requise"),
    quartier: z.string().min(1, "Le quartier est requis"),
    latitude: z.string().min(1, "La latitude doit être supérieure à 0").optional(),
    longitude: z.string().min(1, "La longitude doit être supérieure à 0").optional(),
  }),
  nb_mois_requis: z.number().min(1, "Le nombre de mois requis doit être supérieur à 0"),
  caution: z.number().min(0, "La caution doit être supérieure à 0").optional(),
  nb_mois_requis_second_paiement: z
    .number()
    .min(1, "Le nombre de mois pour le second paiement doit être supérieur à 0"),
  proprietaire: z.string().min(1, "Le nom du propriétaire est requis"),
  charge_commercial: z.string().min(1, "Le nom du chargé commercial est requis"),
  categorie: z.string().min(1, "La catégorie est requise"),
  prix_visite: z.number().min(0, "Le prix de visite doit être positif"),
  imageFiles: z.array(z.instanceof(File)).min(2, "2 images minimun sont requises").max(10, "Maximum 10 images"),
  videoFile: z.instanceof(File),

})

export type PropertyFormData = z.infer<typeof propertySchema>

export const propertySchemaGalerie = z.object({
 
  galerieImageVirtuelle: z.array(z.instanceof(File)).max(10, "Maximum 10 images").optional(),
  videoFileVirtuelle: z.instanceof(File).optional(),
})
export type PropertyFormDataGalerie = z.infer<typeof propertySchemaGalerie>
