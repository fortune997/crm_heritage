

export type TMedia = {
    id: string,
    type: string,
    site_id: string,
    nom: string,
    chemin: string,
    taille: string,
    mime_type: string,
    extension: string,
    ordre: number,
    created_at: string,
}


export type TSites = {
    id: string,
    nom_titre: string;
    code_interne: string;
    type_site: string;
    statut_site: string;
    slug: string;
    description_site: string;
    description_detaille: string;

    region: string;
    ville: string;
    quartier: string;
    localisation_precise: string;
    repere_connu: string;
    latitude: string;
    longitude: string;
    lien_google: string;

    prix_metre_carre: number;
    superficie_total: number;
    superficie_disponible: number;

    lots: number;
    lots_disponible: number;
    lots_total: number;
    lots_vendus: number;
    lots_reserve: number;

    modalite_paiement: number;

    numero_titre_site: string;
    statut_numero_titre_site: string;
    statut_document_site: string;
    procedure_acquisition_site: string;
    note_juridique_site: string;


    nom_partenaire_site: string;
    type_fournisseur_site: string;
    telephone_fournisseur_site: string;
    email_fournisseur_site: string;
    statut_fournisseur_site: string;
    fiabilite_fournisseur_site: string;
    prix_fournisseur_site: string;
    note_comportement_fournisseur_site: string;

    electricite_site: string;
    eau_true: string;
    type_sol: string;
    observation_topographique: string;
    plan_lotissement: string;
    topographe_responsable: string;

    prochaine_action: string;
    derniere_visite: string;
    created_at: string;
    site_medias: TMedia[];
    imageFiles: File[];
    videoFile?: File;
};


export interface SiteStatistics {
    total_sites: number;
    available_sites: number;
    acquisition_sites: number;
    sales_sites: number;
}