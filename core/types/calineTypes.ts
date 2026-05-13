import { TCreatePaiementDB } from "../services/paiement-service";
import { TProfile } from "./type";

export type PaiementCalineHouse = {
  id: number;
  amount: string;
  bail_id: number;
  created_at: string; // ISO date string
  date_debut_bail: string; // ISO date string
  date_fin_bail: string; // ISO date string
  description: string;
  metadata: any | null;
  methode_paiement: "especes" | string;
  nb_jours: number;
  propriete_id: number;
  reference: string;
  status: "Valider" | "En attente" | string;
  telephone: string;
  type_paiement: "loyer" | string;
  user_id: string; // UUID
};


export type TMedia = {
  video: string,
  image_1: string,
  image_2: string,
  image_3: string,
  image_4: string,
  image_5: string,
  image_6: string,
}

export type TGalerieMedia = {
  video_virtuelle: string,
  image_1: string,
  image_2: string,
  image_3: string,
  image_4: string,
  image_5: string,
  image_6: string,
  image_7: string,
  image_8: string,
  image_9: string,
  image_10: string,
}

export type Tbail_locataire ={
  id: number;
  visit_id: string,
  statut: string,
  created_at: string;
  visite_caline_house: VisitHourCaline,
  users_caline_house: UsersCalineHouse,
  paiement_caline_house: TCreatePaiementDB[]

 }

export type TUserCalineHouse = {
  id?: string,
  nom: string,
  prenom: string,
  profession: string;
  plateforme: string;
  sexe: string,
  telephone: string;
  ville: string;
  biens?: TBiens[];
  bail_locataire: Tbail_locataire;
  photo?: string,
  status: string
  nbre_biens?: number,
  quartier: string,
  montant_total_bien: number, 
  type_user: string,
  avatar_url: string,
  created_at?: string
}

export type TProprietaire = {
  nbre_biens?: number,
  quartier: string,
  montant_total_bien: number
  id: string,
  nom: string,
  prenom: string,
  profession: string;
  sexe: string,
  telephone: string;
  email?: string;
  ville: string;
  biens?: TBiens[];
  photo?: string,
  status: string
}

export type TClients = {
  quartier: string
  user: TUserCalineHouse;
  created_at?: Date;
}

export type TLocalisation = {
  ville: string,
  quartier: string,
  latitude?: number,
  longitude?: number
}

export type TPaiement = {
  methode_paiement: string;
  date_paiement: string,
  montant_recu: number;
  transaction_id: string
}

export type TCategorie = {
  id?: string;
  titre: string;
  description: string, 
  image_url: string | File
}

export type TPaiements = {
  id:                    number;
  created_at:            string;
  user_id:               string;
  logement_id:           number;
  montant_recu:          number;
  type_paiement:         string;
  nb_jours: number;
  reference_transaction: string;
  status_paiement:       string;
  methode_paiement:      string;
  description:           string;
}


export type TBiens = {
  id?: string;
  titre: string;
  description: string;
  prix: number;
  nb_chambre: number;
  nb_salle_bain: number;
  climatisation: boolean;
  balcon: boolean;
  internet: boolean;
  eauChaude: boolean;
  cuisineEquipee: boolean;
  machineALaver: boolean;
  electriciteIncluse: boolean;
  canal: boolean;
  gardiennage: boolean;
  nb_jours: number;
  date_debut: string;
  date_fin: string;
  nb_salon: number;
  nb_cuisine: number;
  parking: boolean;
  superficie: number;
  status_occupation: boolean;
  wifi: boolean;
  categorie_bien: TCategorie;
  localisation: TLocalisation,
  nb_mois_requis: number; 
  nb_mois_requis_second_paiement: number; 
  proprietaire: TProprietaire;
  charge_commercial: TProfile,
  categorie: string
  prix_visite: number,
  caution: number,
  medias: TMedia;
  galerie_medias?: TGalerieMedia;
  imageFiles: (File | string )[];
}


export interface Welcome {
  json: JSON[];
}

export interface VisitHourCaline {
  id:                 number;
  created_at:         Date;
  date_visite:        string;
  heure:              string;
  nb_personne:        number;
  bien_id:            number;
  prix:               number;
  status_visite:      string;
  rapport_visite: string;
  note: string;
  user_id:            string;
  biens:              Biens;
  users_caline_house: UsersCalineHouse;
}

export interface Biens {
  titre:          string;
  localisation:   Localisation;
  categorie_bien: CategorieBien;
  categorie?: CategorieBien;
  charge_commercial: TProfile;
  prix:number
}

export interface CategorieBien {
  id:          number;
  titre:       string;
  image_url:   null;
  created_at:  Date;
  description: string;
}

export interface Localisation {
  id:         number;
  ville:      string;
  latitude:   number;
  quartier:   string;
  longitude:  number;
  created_at: Date;
}

export interface UsersCalineHouse {
  id:         string;
  nom:        string;
  sexe:       string;
  biens:      null;
  ville:      string;
  prenom:     string;
  quartier:   string;
  telephone:  string;
  type_user:  string;
  created_at: Date;
  profession: string;
  avatar_url: string
}


export type TVisite = {
  id?: string;
  client: TClients;
  biens: TBiens;
  nbre_personne: number;
  heure: string;
  date_visite: string;
  status_visite: string
}

export type TLoyer = {
  id?: string;
  montant_total: number;
  montant_recu: number;
  client: TClients;
  biens: TBiens;
  date_fin_loyer: string;
  date_entree: string;
  paiement: TPaiement
}

export type TVisiteTime = {
  id?: string
  jour: string
  heureDebut: string
  heureFin: string
}

export type TCaracteristique = {
  type_contruction: string
}

export type TCledor = {
  id: string,
  titre: string,
  description: string,
  date_conception: string,
  auteur_plan: string,
  superficie: string,
  localisation: TLocalisation,
  type_conception: string,
  telephone: string,
  medias: TMedia;
  budget: string,
  caracteristique: TCaracteristique,
  status_conception: boolean,
  created_at: string
}

export type TDevis = {
  id: string,
  nom: string,
  email?: string,
  telephone: string ,
  ville: string,
  quartier: string,
  type_projet: string,
  budget_estime: number,
  delai_souhaite: string,
  description: string,
  status_demande: string,
  plan_batiment: boolean,
  plan_documents: File | string,
  created_at: string

}

export type TProprieter_publier = {
  id: number
  titre: string,
  type: string,
  description: string,
  loyer: number,
  caution: number,
  superficie: number,
  piece: number,
  chambre: number,
  douche: number,
  quartier: string,
  ville: string,
  ascensuer: boolean,
  parking: boolean,
  balcon_terasse: boolean,
  medias: TMedia,
  user_id: string,
  valider: boolean
}

export type TMeuble = {
  titre: TCategorie
  cuisineEquipee: boolean;
  balcon: boolean;
  climatisation: boolean;
  internet: boolean;
  machineALaver: boolean;
  eauChaude: boolean;
  electriciteIncluse: boolean;
  canal: boolean;
  gardiennage: boolean;
  nb_jours: number;
  paiement : TPaiement,
  date_debut: string;
  date_fin: string;
}


