import { z } from "zod"
import type { TransportMode, VisitStatus } from "@/core/types/visit-type"


export type ProfileFormValues = z.infer<typeof profileFormSchema>
export type SecurityFormValues = z.infer<typeof securityFormSchema>
export const profileFormSchema = z.object({
    nom: z.string().min(2, {
        message: "Le nom d'utilisateur doit comporter au moins 2 caractères.",
    }),
    prenom: z.string().min(2, {
        message: "Le prénom d'utilisateur doit comporter au moins 2 caractères.",
    }),
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide.",
    }),
})

export const securityFormSchema = z
    .object({
        currentPassword: z.string().min(8, {
            message: "Le mot de passe doit comporter au moins 8 caractères.",
        }),
        newPassword: z.string().min(8, {
            message: "Le mot de passe doit comporter au moins 8 caractères.",
        }),
        confirmPassword: z.string().min(8, {
            message: "Le mot de passe doit comporter au moins 8 caractères.",
        }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    })



const fileOrString = (maxSizeMb: number, message: string) =>
  z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .refine(
      (value) =>
        !value || typeof value === "string" || value.size <= maxSizeMb * 1024 * 1024,
      { message }
    );

export const ZFormSchemaEmploye = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  telephone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  telephone_professionnel_mtn: z.string().optional(),
  telephone_professionnel_orange: z.string().optional(),
  adresse: z.string().min(5, { message: "Adresse trop courte" }),
  poste: z.string().min(2, { message: "Poste requis" }),
  sexe: z.string(),
  departement: z.string().min(2, { message: "Département requis" }),
  statut: z.string().min(2, { message: "Statut requis" }),
  salaire: z.coerce.number().positive({ message: "Le salaire doit être positif" }),
  date_embauche: z.date(),
  nom_urgence: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom_urgence: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lien_parente: z.string().min(2, { message: "Veuillez entrez un lien de parenté" }),
  telephone_urgence: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  photo: fileOrString(5, "La photo ne doit pas dépasser 5MB"),
  cv: fileOrString(5, "Le CV ne doit pas dépasser 5MB"),
  diplome: fileOrString(5, "Le diplôme ne doit pas dépasser 5MB"),
  plan_localisation: fileOrString(5, "Le plan de localisation ne doit pas dépasser 5MB"),
  cni: fileOrString(5, "La cni ne doit pas dépasser 5MB"),
})



export type EmployeFormValues = z.infer<typeof ZFormSchemaEmploye>

// Schémas pour chaque étape du formulaire
export const PersonalInfoSchema = ZFormSchemaEmploye.pick({
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  sexe: true,
  telephone_professionnel_mtn: true,
  telephone_professionnel_orange: true,
  adresse: true,
})

export const ProfessionalInfoSchema = ZFormSchemaEmploye.pick({
  poste: true,
  departement: true,
  statut: true,
  salaire: true,
  date_embauche: true,
})

export const ProfessionalContactSchema = ZFormSchemaEmploye.pick({
  nom_urgence: true,
  prenom_urgence: true,
  lien_parente: true,
  telephone_urgence: true,
})

export const DocumentsSchema = ZFormSchemaEmploye.pick({
  photo: true,
  cv: true,
  diplome: true,
  plan_localisation: true,
  cni: true,
})

export type PersonalInfoValues = z.infer<typeof PersonalInfoSchema>
export type ProfessionalInfoValues = z.infer<typeof ProfessionalInfoSchema>
export type DocumentsValues = z.infer<typeof DocumentsSchema>


export const visitSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }),
  date: z.string({ message: "La date est requise" }),
  startTime: z.string({ message: "sélectionner une heure" }),
  point_rencontre: z.string({ message: "sélectionner une point rencontre" }),
  numberVisitor: z.number().optional().default(1),
  prospect_id: z.number(),
  tarifTransport: z.number(),
  transportType: z.string(),
})

export type VisitFormValues = z.infer<typeof visitSchema>

export const defaultVisitValues = {
  title: "",
  startTime: new Date().toISOString(),
  status: '',
  numberVisitor: 0,
  tarifTransport: 0,
  point_rencontre: '',
  prospect_id: 0,
  price: 0,
  transportMode: '',
}

export const ZFormSchemaLocataire = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  telephone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  quartier: z.string().min(5, { message: "Quartier requis" }),
  status: z.string(),
  nbre_biens: z.number(),
  montant_total_bien: z.number(),
  type_user:  z.string(),
  profession: z.string().min(2, { message: "Profession requis" }),
  ville: z.string().min(2, { message: "Ville requis" }),
  sexe: z.string().trim().nonempty({message: "Veuillez sélectionner un sexe."}),
  date_naissance: z.date(),
  photo: fileOrString(5, "La photo ne doit pas dépasser 5MB"),
  cni: fileOrString(5, "La cni ne doit pas dépasser 5MB"),

})


export type LocataireFormValues = z.infer<typeof ZFormSchemaLocataire>
// Schémas pour chaque étape du formulaire
export const LocatairePersonalInfoSchema = ZFormSchemaLocataire.pick({
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  sexe: true,
})
export const MoreLocataireInfoSchema = ZFormSchemaLocataire.pick({
  profession: true,
  date_naissance: true,
  ville: true,
  quartier: true,
})
export const LocataireDocumentsSchema = ZFormSchemaLocataire.pick({
  photo: true,
  cni: true,
})


export type BiensFormValues = z.infer<typeof TBiensSchema>


export const TBiensSchema = z.object({
  titre: z.string(),
  superficie: z.coerce.number().positive({ message: "La superficie doit être positif" }),
  description: z.string(),
  nb_chambre: z.coerce.number().positive({ message: "Le nombre de chambre doit être positif" }),
  nb_salle_bain: z.coerce.number().positive({ message: "Le nombre salle de bain doit être positif" }),
  nb_salon: z.coerce.number().positive({ message: "Le nombre salon doit être positif" }),
  nb_cuisine: z.coerce.number().positive({ message: "Le nombre cuisine doit être positif" }),
  parking: z.boolean(),
  status_occupation: z.boolean(),
  wifi: z.boolean(),
  categorie_bien_id:z.string() ,
  prix: z.coerce.number().positive({ message: "Le prix doit être positif" }),
  photo: z
    .array(z.instanceof(File))
    .refine(
      (files) => {
        const images = files.filter(f => f.type.startsWith("image/"))
        const videos = files.filter(f => f.type.startsWith("video/"))
        return images.length <= 4 && videos.length <= 1
      },
      {
        message: "Max. 4 images et 1 vidéo autorisées",
      }
    ),
  proprietaireId: z.string(),
  latitude: z.coerce.number(),
  video: z.array(z.instanceof(File)),
  longitude: z.coerce.number(),
  ville: z.string(),
  quartier: z.string(),
  clientId:  z.string(),
  nb_mois_requis: z.coerce.number().positive({ message: "Le nombre mois requis doit être positif" }),
  nb_mois_requis_second_paiement: z.coerce.number().positive({ message: "Le nbre_mois_requis_second_paiement doit être positif" }),
  charge_commercial_id: z.string() ,
});

export const BiensInfoSchema = TBiensSchema.pick({
  titre: true,
  superficie: true,
  status_occupation: true,
  description: true,
})
export const PlusBiensInfoSchema = TBiensSchema.pick({
  nb_chambre: true,
  nb_salle_bain: true,
  prix: true,
  nb_salon: true,
  parking: true,
  nb_cuisine: true,
})
export const LocalisationBiensSchema = TBiensSchema.pick({
  quartier: true,
  wifi: true,
  latitude: true,
  longitude: true,
  ville: true,

})

export const ImageBiensSchema = TBiensSchema.pick({
  photo: true,
  video: true,
})

export type CledorFormValues = z.infer<typeof TCledorSchema> 

export const TCledorSchema =  z.object({
  titre: z.string().min(4, "Veuillez entrez un titre"),
  superficie: z.coerce.number().positive({ message: "La superficie doit être positif" }),
  description: z.string().min(10, "Veuillez entrez un titre"),
  auteur_plan:z.string() ,
  type_conception:z.string() ,
  date_conception:z.string() ,
  telephone:z.string().min(9, "Veuillez entrez le numéro de téléphone de l'auteur ") ,
  
  budget: z.coerce.number().positive({ message: "Le budget doit être positif" }),
  imageFiles: z.array(z.instanceof(File)).min(4, "4 images sont requises").max(4, "Maximum 4 images"),
  videoFile: z.instanceof(File),
   localisation: z.object({
      ville: z.string().min(1, "La ville est requise"),
      quartier: z.string().min(1, "Le quartier est requis"),
    }),
});