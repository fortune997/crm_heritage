import { TimeEntry } from "@/core/types/type";
import { ReactNode } from "react";

export type KPI = {
  id: string
  department: string
  icon: React.ReactNode
  total: number
  completed: number
  month: string
  color: "blue" | "purple" | "orange"
}


export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  bucket: string;
  folder: string;
  id: number; // id de la vente_land
  title?: string;
  description?: string;
  document_url?: string
}

export interface LeadGeneralInfoProps {
  status: string;
  source: string;
  createdBy: string;
  entreprise: string;
  language?: string;
  type?: boolean;
  privacy?: string;
  site: string;
  assignedTo?: {
    name: string;
    avatar?: string;
  };
  leadBy?: {
    name: string;
    avatar?: string;
    description?: string;
    poste?: string;
  };
  onEdit?: () => void;
}
export interface InteractionsListProps {
  data: TDaily[];
  id: string,
  prospectId?: string
}

export interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface ProfileContentProps {
  prospect: TLeadsDeatail;
}
export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  apartment: string;
  floor: number;
  lease: Lease;
  avatar?: string;
}

export interface Lease {
  id: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'expired' | 'pending' | 'terminated';
  paymentMethod: PaymentMethod;
  payments: TPaiements[];
}

export type TPaiements = {
  id: number;
  created_at: string;
  user_id: string;
  logement_id: number;
  montant_recu: number;
  type_paiement: string;
  nb_jours: number;
  reference_transaction: string;
  status_paiement: string;
  methode_paiement: string;
  description: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  dateCreation: string;
  telephone: string;
  besoin: 'Studio' | 'Appartement' | 'Maison' | 'Local commercial';
  ville: string;
  quartier: string;
  nombreMois: number;
  budget: number;
  status: 'nouveau' | 'Visite programmée' | 'Pas intéressé' | 'Intéressé' | 'Contrat signé';
  notes?: string;
  interactions: Interaction[];
  prochaineSuivi?: string;
  biensProposés: BienPropose[];
}

export interface Interaction {
  id: string;
  type: 'appel' | 'email' | 'visite' | 'proposition' | 'relance' | 'autre';
  date: string;
  description: string;
  resultat?: 'positif' | 'neutre' | 'negatif';
  prochaineSuivi?: string;
}
export interface BienPropose {
  id: string;
  titre: string;
  adresse: string;
  prix: number;
  type: 'Studio' | 'Appartement' | 'Maison' | 'Local commercial';
  dateProposition: string;
  statut: 'proposé' | 'visite_programmée' | 'visite_effectuée' | 'refusé' | 'accepté';
  notes?: string;

}
export type ClientStatus = Client['status'];
export type BesoinType = Client['besoin'];


export type PaymentMethod = 'bank_transfer' | 'cash' | 'check' | 'card' | 'online';

export interface NewPayment {
  montant_recu: number;
  type_paiement: string;
  nb_jours: number;
  methode_paiement: string;
  description: string;
}

export type WorkHoursResult = WorkStats & {
  weeklyHours?: number;
  monthlyHours?: number;
  daysWorked?: number;
  supplementaryHours?: number;
  lateArrivals?: number;
  targetHours?: number;
  missingHours?: number;
};

export type ModalsProps = {
  titre: ReactNode,
  modalTitle?: string,
  modalDescription?: string;
  children: ReactNode;
  isEditMode?: boolean
  isModalOpen: boolean,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type AnnonceFormData = {
  nom: string;
  email: string;
  telephone: string;
  typeClient: string;
  budget: string;
  localisation: string;
  typeLogement: string;
  besoins: string;
  contactPreference: string;
  newsletter: boolean;
  rdv: boolean;
};

export interface DragDropFileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  type: "image" | "document";
  // label: string;
  accept: string;
  helpText: string;
}

export interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export type TClient = {
  id: string;
  nom: string;
  status: string;
  prenom: string;
  sexe: "Homme" | "Femme",
  telephone: string;
  email?: string;
  ville: string;
  profession: string;
  date_naissance: string;
  cni?: File,
  photo?: File,
  quartier: string,
  created_at: string
}

/* djangui_assurance (

  id uuid PK,
  subscription_plan_id uuid FK -> djangui_subscription_plans.id,

  type text,                -- partiel, total
  raison text,              -- maladie, perte d’emploi, difficulté temporaire
  date_demande timestamp,
  statut_assurance text,              -- en_attente, approuve, rejete
  duree_mois int,           -- durée demandée
  nouvelle_date_fin timestamp, -- si accordée
  commentaire_assurance text,
  created_at timestamp

) */

/*    
  djangui_plan_subscriptions                   paiement_subscription_plan 

id,                                               id
plan_id                                           montant_recu
client_djangui_id                                 dlangui_plan_subscriptions_id  
terrain_id                                        created_at
montant_mois,                                     date_paiement
total_montant,                                    date_echeance
total_payer,                                      statut
paiement_subscription_plan_id
lot: ,
bloc: ,
prix_site: 7500,
statut_assurance: "moratoire"
statut_plan: "ACTIVE"
 
*/

/*    
  plans_services

  id: number;
  duree_mois: number;
  label?: string,
 
*/


// types.ts
export type DeviceStatus = "AVAILABLE" | "ASSIGNED";

export type ArticleStock = {
  id: number;
  nom_produit: string;
  reference: string;
  statut: string;

};

export type Employe = {
  id: string;
  nom: string;
  prenom: string;
};

export type CreateDjanguySubscriptionType = {
  prospect_id: number,
  plan_id: number,
  status: boolean,
  debut_date: Date,
  date_prochain_paiement: Date,
  total_a_payer: number,
  pourcentage_recu: number,
}

// Type Plan
export interface Plan {
  id: number;
  duree_mois: number;
  montant_mois: number;
  label: string;
  total_montant: number;
}

// Type principal Abonnement
export interface Abonnement {
  id: number;
  prospect_id: number;
  plan_id: number;
  status: boolean;
  debut_date: string; // ou Date si vous préférez
  date_prochain_paiement: string; // ou Date
  total_a_payer: number;
  montant_recu: number;
  pourcentage_recu: string;
  reste: string;
  prospects: Prospect;
  djangui_plans: Plan;
}

export interface SubscriptionCardProps {
  subscription: Abonnement
  showAlert?: boolean
  className?: string
  compact?: boolean
}