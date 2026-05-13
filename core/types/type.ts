// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


import { TClients, TDevis, TMedia } from "./calineTypes";




// Créez un type commun pour tous vos types de données de table
export type TableData =
  | TDevis
  | TProspect
  | TLeads
  | TSocialNetwork
  | TPublication
  | TRecouvrement
  | TClients
  | TDaily
  | TClient
  | TProfile
  | TVente




export type TPlans = {
  id: number;
  duree_mois: number;
  montant_mois?: number;
  label?: string,
  site?: string,
  total_montant?: number
  prix: number,
  statut_plan: string
};

export type TDjanguiSubscriptions = {
  id: number,
  prospect_id: number,
  plan_id: number,
  status: string,
  debut_date: string,
  assurance_status: string,
  nombre_plan: number,
  date_prochain_paiement: string,
  total_a_payer: string,
  montant_recum: string
  pourcentage_recum: string
  reste: string,
  created_at: string,
  prospect: TProspect
  plan: TPlans
}



export type TProspect = {
  id?: number;
  nom: string;
  telephone: string;
  email?: string;
  sexe: string;
  entreprise?: string;
  corporate?: boolean,
  categorie_corporate?: string,
  matricule?: string;
  site_concerne: string;
  chargee_clientele?: string;
  canal_prospection: string;
  statut_appel?: string;
  services: string,
  date_rdv?: Date;
  canal_echange?: string;
  terrain?: number;
  prospect_land_id?: number
  statut_rdv?: string;
  interaction_prospect_land?: TInteraction[]
  created_at?: Date;
  description?: string
  avatar?: string,
  terrainData?: TSite;
};

export type TAccessScope = "global" | "company";

export type TCurrentUser = TProfile & {
  role: TRoleName | null;
  permissions: TPermissionName[];
  access_scope: TAccessScope | null;
  company_id: string | null;
};

export type TPCorporate = {

  nom?: string;
  telephone?: string;
  email?: string;
  entreprise: string;
  reference?: string;
  chargee_clientele?: string;
  statut_rdv?: string;
  date_depot?: string;
  services: string,
  localisation: string,
  corporate?: boolean,
  canal_echange?: string;
  terrain?: number;
  //date_depot?: Date;
  categorie_corporate?: string;
};



export type TLeadsDeatail = {
  id: number;
  nom: string;
  telephone: string;
  telephone2?: string;
  sexe: string;
  email?: string;
  corporate?: boolean;
  decharge: boolean;
  ville: string;
  entreprise?: string;
  services: string;
  categorie_corporate: string;
  commentaire: string;
  terrain?: number;
  matricule?: string;
  site_concerne: string;
  chargee_clientele?: string;
  canal_prospection: string;
  statut_appel: string;
  localisation: string;

  reference: string;
  date_rdv: Date;
  prospect_land_id?: number
  statut_rdv: string;
  interaction_prospect_land?: TInteraction[]
  created_at: Date;
  date_depot: Date;
  description: string,
  sites: TSites
  avatar: string
  clients: TClient[]
};



export type TLeadNumber = {
  telephone: string;
  leads: true

};

export type TLeads = {
  id?: number;
  telephone: string;
  chargee_clientele?: string;
  date_rdv: Date;
  statut_rdv: string;
  created_at?: Date;
};

export type TInteraction = {
  id: number;
  prospect_caline_house_id: number;
  prochainSuivi: string;
  description: string;
  resultat: "positif" | "neutre" | "negatif";
  type_interaction: "appel" | "email" | "visite" | "proposition" | "relance" | "autre";
  created_at: string;
};

export type TActivities = {
  id: number;
  userId: string;
  action: string;
  description: string;
  plateforme: string;
  entiteId: string;
  created_at: string;
};

export type TDaily = {
  id?: string;
  statut_appel: string;
  date_rdv?: Date;
  date_depot?: Date;
  decharge?: boolean,
  nature_echange: string;
  statut_rdv: string;
  prospects?: TProspect;
  canal_echange?: string;
  prospect_id: number;
  prospect_land_id?: number,
  created_at?: Date;
};

export type TAllDaily = {
  id: string;
  statut_appel: string;
  date_rdv: Date;
  nature_echange: string;
  statut_rdv: string;
  prospects: TProspect;
  prospect_id: number;
  prospect_land_id?: number,
  created_at?: Date;
};

export type TClient = {
  id?: string;
  adresse?: string;
  profession?: string;
  photo?: string;
  info_clees?: string;
  statut_rdv?: string;
  dailies?: TDaily;
  prospect_id: number;
  commentaire?: string;
  adresse_mail?: string;
  superficie?: string;
  bloc?: string;
  prospects?: TProspect;
  created_at?: Date;
};

export type TRecouvrement = {
  id?: string;
  montant_total?: number;
  montant_recu: number;
  reste_a_payer?: number;
  clients?: TClient;
  client_id?: number;
  created_at?: Date;
  frais_dossier?: number;
  statut?: string;
  lot?: string;
  date_prochain_versement?: Date | string | null
  superficie?: number;
  bloc?: string;
  prix_m2?: number;
  ventes?: TVentes
  vente_land?: TVentes
};

export type TVente = {
  id?: string
  client_id: number
  lot: string
  prix_m2: number
  total_a_payer: number
  montant_recu?: number
  dossier_tech: number
  superficie: number
  bloc: string
  statut_paiement?: string
  echeance?: string
  created_at?: Date
  clients?: TClient;
  titre_foncier: string,
  bornage?: number,
  doc_bornage?: string,
  dt_document?: boolean,
  pv?: boolean,
  convention?: boolean,
  bornage_document?: boolean,
  date_echeance_convention?: string
  date_echeance_bornage?: string,
  pourcentage_versement?: number,
  date_echeance_dt?: string
  date_echeance_pv?: string,
  categorie?: string,
  dt_doc_url?: string,
  terrain?: TSite;
  recouvrements?: TRecouvrement[]
}


/* 
export type SearchFilters = {
  search: string;
  categorie: string;
  titre_foncier: string;
  dt_document: boolean | undefined;
  convention: boolean | undefined;
  bornage_document: boolean | undefined;
  pv: boolean | undefined;
  date_echeance_convention: DateRange | undefined;
  date_echeance_dt: DateRange | undefined;
  date_echeance_bornage: DateRange | undefined;
  date_echeance_pv: DateRange | undefined;
} */

export interface SalesCardProps {
  vente: TVente;
  onEdit?: (vente: TVente) => void;
  totalPaiement: (id: number) => Promise<number>;
  onDelete?: (id: string) => void;
}

export type TVentes = {
  id?: number
  client_id: number,
  statut_paiement?: string,
  lot: string
  prix_m2: number
  total_a_payer: number
  montant_recu: number
  dt_doc_url?: string,
  dossier_tech: number
  superficie: number
  bloc: string
  statut: string
  echeance?: string
  created_at?: Date
  clients?: TClient;
  date_echeance_bornage?: string,
  dt_document?: boolean,
  date_echeance_tf?: string;
  date_echeance_pv?: string,
  pv?: boolean,
  convention?: boolean,
  date_echeance_convention?: string,
  pourcentage_versement?: number,
  bornage_document?: boolean,
  titre_foncier?: string,
  categorie?: string,
  pv_doc_url?: string,
  convention_doc_url?: string,
  recouvrements?: TRecouvrement[]
}

export type TPaiementRecouvrement = {
  id?: string;
  numero_facture?: string;
  date_paiement: Date;
  reste_a_payer?: string;
  montant_recu: string;
  total_a_payer?: number;
  statut_paiement: string;
  methode_paiement: string;
  retard_paiement: string;
  date_prochain_paiement?: Date;
  recouvrement_id: string;
  recouvrements?: TRecouvrement;
  created_at?: string;
};

export type TOnePaiementRecouvrement = {
  id?: number,
  created_at?: string,
  date_paiement: Date;
  montant_recu: number;
  statut_paiement: string;
  methode_paiement: string;
  retard_paiement: number;
  date_prochain_paiement?: Date;
  recouvrement_id?: number;
  source_id: number;
  source_type: string;
};

export interface IOnePaiement {
  date_paiement: Date,
  montant_recu: number,
  statut_paiement: string,
  methode_paiement: string,
  retard_paiement: number,
  date_prochain_paiement?: Date,
  source_id: number,
  source_type: string,
}


export type TUser = {
  id?: number;
  password: string;
  email: string;
};

export type TProfile = {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  username: string;
  mail_professionnel: string;
  phone: string;
  avatar_url: string;
  status: string
  last_login_at: string;
  last_seen_at: string;
  email_verified: string;
  must_change_password: boolean;
  language: string;
  theme: string;
  timezone: string;
  created_by: number;
  invited_by: string;

  accepted_invitation_at: string;
  updated_at?: string;
  created_at?: string;
};



export type TRolePermission = {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
};

export type TRoleName =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "USER";

export type TRole = {
  id: string;
  name: TRoleName;
  label: string;
  created_at: string;
};




export type TPermissionModule =
  | "admin"
  | "company"
  | "user"
  | "role"
  | "marketing"
  | "kpi"
  | "settings";

export type TPermissionName =
  | "admin.access"
  | "company.read"
  | "company.create"
  | "company.update"
  | "company.delete"
  | "user.read"
  | "user.create"
  | "user.update"
  | "user.delete"
  | "role.read"
  | "role.manage"
  | "marketing.read"
  | "marketing.manage"
  | "kpi.read"
  | "kpi.manage"
  | "settings.read"
  | "settings.update";

export type TPermission = {
  id: string;
  name: TPermissionName;
  label: string;
  module: TPermissionModule;
  created_at: string;
};

export type TSite = {
  id?: number;
  titre: string;
  adresse: string;
  ville: string;
  codePostal: string;
  superficie: string;
  prix: string;
  type: string;
  statut: string;
  description: string;
  terrain?: number,
  image?: string;
  constructible?: boolean,
  promotion?: boolean,
  viabilise?: boolean,
  imageFiles?: File[];
  pente?: boolean,
  zone: string,
  latitude: string,
  point_rencontre: string,
  longitude: string,
  long_point_rencontre?: string,
  lat_point_rencontre?: string,
  medias?: TMedia;

  created_at?: Date;
};
export type TSites = {
  id: number;
  titre: string;
  adresse: string;
  ville: string;
  codePostal: string;
  superficie: string;
  prix: string;
  type: string;
  statut: string;
  description: string;
  terrain?: number,
  image?: string;
  constructible?: boolean,
  promotion?: boolean,
  viabilise?: boolean,
  imageFiles?: File[];
  pente?: boolean,
  zone: string,
  latitude: string,
  point_rencontre: string,
  longitude: string,
  long_point_rencontre?: string,
  lat_point_rencontre?: string,
  medias?: TMedia;

  created_at?: Date;
};

export type TContact = {
  id: number;
  nom: string;
  telephone: string;
  message: string;
  email: string;
  created_at: string;

};

export type TAnnonce = {
  id: number;
  nom: string;
  email: string;
  commerciale: string,
  telephone: string;
  typeClient: string;
  budget: number;
  localisation: string;
  telephone_mtn: string,
  typeLogement: string;
  prenom: string;
  interaction_prospect_caline_house: TInteraction[],
  ville: string;
  created_at: string,
  prochaineSuivi: string,
  sexe: 'Homme' | 'Femme',
  nb_mois: string,
  statut: 'Nouveau' | 'Visite programmée' | 'Pas intéressé' | 'Intéressé' | 'Contrat signé';

  quartier: string;
  description: string;
  besoin: string;
  contactPreference: string;
  newsletter: boolean;
  rdv: boolean;
};

export type VisitStatus =
  | "programmé"
  | "cours"
  | "terminer"
  | "annulé"
  | "manquer";

// export const VISIT_STATUSES = [
//     "programmé",
//     "en cours",
//     "terminer",
//     "annulé",
//     "manquer"
//   ] as const;

//   export type VisitStatus = typeof VISIT_STATUSES[number];

export interface IVisit {
  id: number;
  created_at: string;
  title: string;
  date: string;
  rapport_visite: string;
  point_rencontre: string;
  superficie_demande: string;
  degre_interessement: string;
  startTime: string;
  avisiter: boolean;
  status: string;
  tarifTransport: number;
  numberVisitor: number;
  transportType: string;
  endTime: string;
  prospect: number;
  prospects: TProspect;
}

export interface Prospects {
  id: number;
  nom: string;
  sexe: string;
  date_rdv: string;
  matricule: string;
  telephone: string;
  created_at: string;
  statut_rdv: string;
  statut_appel: string;
  site_concerne: string;
  canal_prospection: string;
  chargee_clientele: string;
}

export type TSocialNetwork = {
  id?: string;
  titre: string;
  username: string;
  follower: string;
  follow: string;
  post: string;
  icon?: string;
  image?: string;
  couleur: string;
  created_at?: Date;
};

// Type pour les données de publication
export type TPublication = {
  id?: string;
  titre?: string;
  description?: string;
  lien?: string;
  date_pub?: Date;
  created_at?: Date;
  image?: string;
  views?: string;
  likes?: string;
  comments?: string;
  shares?: string;
  plateform_name?: string;
  plateform_icon?: string;
  plateform_color?: string;
  author_name?: string;
  author_avatar?: string;
};

export type TCanal = {
  id?: string;
  nom: string;
  description: string;
  type: string;
  statut: boolean;
  created_at?: Date;
};

export type TimeEntry = {
  id?: string; // UUID
  user_id: string; // UUID (référence à auth.users)
  clock_in: string | null; // ISO timestamp (nullable si pas encore pointé)
  clock_out: string | null; // ISO timestamp (nullable si pas encore pointé)
  duration: number | null; // En secondes (nullable si clock_out non défini)
  status: string | null; // Ex: 'Complété', 'En cours', etc.
  localisation: string;
  heure_suplementaire: number;
  profiles?: TProfile;
  created_at?: string; // ISO timestamp
  photo_url: string;
  statut_presence?: string;
  nom?: string;
  prenom?: string;
  photoUrl?: string;
  jours_travailles?: number;
  heures_supplementaires?: number;
  nb_retards?: number;
  nb_absences?: number;
  total_days?: number;
  taux_presence?: number;
  taux_absence?: number;
  score_ponctualite?: number;
  heures_travaillees?: number;
  entry_date?: string;
};

export type TProspectChart = {
  month: string;
  total: number;
};

export type TKPI = {
  id: string;
  user_id: string;
  titre: string;
  description: string;
  icone: string;
  semaine: string;
  statut: "en retard" | "en cours" | "terminer";
  priorite: "faible" | "moyen" | "eleve";
  date_echeance: string;
  profiles?: TProfile;
  created_at?: string;
  created_by: string,
  equipe: string,
  kpi_tache?: TTask[],
  commentaire: string,
  updated_at: string,

};

export type TObjectif = {
  id: string;
  titre: string;
  description: string;
  equipe: string,
  chiffre: string,
  created_at: string,

};

export type TExpense = {
  id: string
  amount: number
  date: string
  employee?: string
  description?: string
  receipt?: string
  status: "pending" | "approved" | "rejected"
}


export type TKPIs = {
  id: number,
  title: string,
  description: string,
  icon: string,
  target_value: number,
  current_value: number,
  unit: string,
  priority: string,
  start_date: Date,
  due_date: Date,
  metier: string,
  responsible_id: string,
  created_at: string,
  updated_at: string
}

export interface TSoustache {
  id: number;
  titre: string;
  status: string
  taskId: string;
  created_at: string;
  jour_realisation: string;
  heure_debut: string;
  heure_fin: string;
  description: string;
}

export type TTask = {
  id: number,
  kpi_id: string,
  titre: string,
  description: string,
  created_by: string,
  progress: string,
  status: "terminer" | "en cours" | "a faire" | "en retard",
  date_fin: string,
  created_at: string,
  updated_at: string,
  priority: "urgente" | "moyenne" | "faible",
  profiles: TProfile,
  sous_taches?: TSoustache[];
} 