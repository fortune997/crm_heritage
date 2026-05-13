export type TJob = {
    id: number
    slug: string
    titre: string
    localisation: string
    type: string
    salaire: number | null   // correspond à double precision en DB, null si non défini
    diplome_requis: string | null
    nb_places: number | null
    age_requis: string | null
    place_dispo: number | null
    date_limite: string | null   // ISO string
    description: string | null
    missions: string[] | null
    image: string
    comission: boolean | null
  }
  
  export type TApplication = {
    job: number;
    nom: string;
    prenom: string;
    email: string;
    age: string;
    ville: string;
    status_matrimonial: string;
    niveau_etude: string;
    cv_url?: string | null;
    photo_url?: string | null;
    status?: string;
    telephone?: string;
  }
  