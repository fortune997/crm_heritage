export type TVote = {
    id: string
    user_id: string
    candidat_id: string
    points: number
    month: number
    year: number
    created_at: string
    profiles?: TProfile
  }
  
  export type TVotingSession = {
    id?: string
    user_id: string
    month: number
    year: number
    total_points_used: number
    is_completed: boolean
    completed_at?: string
    created_at: string
  }
  
  export type TEmployeeVoteResult = {
    profile: TProfile
    totalPoints: number
    rank: number
    votes: Array<{
      voterName: string
      points: number
    }>
  }
  
  export type TVoteStats = {
    totalPoints: number
    uniqueVoters: number
    totalVotes: number
    averagePointsPerVote: number
  }
  
  export type TProfile = {
    id: string
    nom: string
    prenom: string
    email: string
    telephone: string
    adresse: string
    poste: string
    departement: string
    photo_url?: string
    // Ajoutez les autres champs selon votre structure
    nom_urgence?: string
    prenom_urgence?: string
    lien_parente?: string
    telephone_urgence?: string
    statut?: string
    salaire?: number
    date_embauche?: Date
    cv_url?: string
    diplome_url?: string
    plan_localisation_url?: string
    cni_url?: string
    profile_id?: string
    year_xp?: number
    contrat_type?: string
    created_at?: string
  }
  