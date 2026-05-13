
import supabase from "@/core/lib/supabase"
import type { TEmployeeVoteResult, TProfile } from "../types/vote-type"


// Récupérer tous les votes
const fetchVotes = async () => {
  const { data, error } = await supabase
    .from("votes")
    .select(`
            *,
            profiles:candidat_id(*)
        `)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// Récupérer les votes d'un utilisateur pour un mois donné
const fetchUserVotes = async (userId: string, month: number, year: number) => {
  const { data, error } = await supabase
    .from("votes")
    .select(`
            *,
            profiles:candidat_id(*)
        `)
    .eq("user_id", userId)
    .eq("month", month)
    .eq("year", year)

  if (error) throw new Error(error.message)
  return data
}

// Vérifier si un utilisateur a déjà voté ce mois
const checkUserHasVoted = async (userId: string, month: number, year: number) => {
  const { data, error } = await supabase
    .from("voting_sessions")
    .select("is_completed")
    .eq("user_id", userId)
    .eq("month", month)
    .eq("year", year)
    .single()

  if (error && error.code !== "PGRST116") throw new Error(error.message)
  return data?.is_completed || false
}

// Ajouter des votes (transaction)
const addVotes = async (votes: Array<{ candidat_id: string; points: number }>, userId: string) => {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  // Préparer les données de vote
  const voteData = votes.map((vote) => ({
    user_id: userId,
    candidat_id: vote.candidat_id,
    points: vote.points,
    month,
    year,
  }))

  // Calculer le total des points
  const totalPoints = votes.reduce((sum, vote) => sum + vote.points, 0)

  // Transaction pour insérer les votes et mettre à jour la session
  const { data: votesResult, error: votesError } = await supabase.from("votes").insert(voteData)

  if (votesError) throw new Error(votesError.message)

  // Créer ou mettre à jour la session de vote
  const { error: sessionError } = await supabase.from("voting_sessions").upsert({
    user_id: userId,
    month,
    year,
    total_points_used: totalPoints,
    is_completed: true,
    completed_at: new Date().toISOString(),
  })

  if (sessionError) throw new Error(sessionError.message)

  return votesResult
}

// Récupérer les résultats de vote pour un mois donné
const fetchVoteResults = async (month: number, year: number): Promise<TEmployeeVoteResult[]> => {
  // D'abord récupérer tous les votes pour le mois/année
  const { data: votes, error: votesError } = await supabase
    .from("votes")
    .select(`
      candidat_id,
      points,
      user_id
    `)
    .eq("month", month)
    .eq("year", year)

  if (votesError) throw new Error(votesError.message)

  if (!votes || votes.length === 0) {
    return []
  }

  // Récupérer les profils des candidats
  const candidatIds = [...new Set(votes.map((vote) => vote.candidat_id))]
  const { data: candidats, error: candidatsError } = await supabase.from("profiles").select("*").in("id", candidatIds)

  if (candidatsError) throw new Error(candidatsError.message)

  // Récupérer les profils des votants
  const voterIds = [...new Set(votes.map((vote) => vote.user_id))]
  const { data: voters, error: votersError } = await supabase
    .from("profiles")
    .select("id, prenom, nom")
    .in("id", voterIds)

  if (votersError) throw new Error(votersError.message)

  // Grouper les résultats par candidat
  const resultsMap = new Map<
    string,
    {
      profile: TProfile
      totalPoints: number
      votes: Array<{ voterName: string; points: number }>
    }
  >()

  votes.forEach((vote) => {
    const candidat = candidats?.find((c: TProfile) => c.id === vote.candidat_id)
    const voter = voters?.find((v: { id: string; prenom: string; nom: string }) => v.id === vote.user_id)

    if (!candidat) return

    if (!resultsMap.has(vote.candidat_id)) {
      resultsMap.set(vote.candidat_id, {
        profile: candidat,
        totalPoints: 0,
        votes: [],
      })
    }

    const result = resultsMap.get(vote.candidat_id)!
    result.totalPoints += vote.points
    result.votes.push({
      voterName: voter ? `${voter.prenom} ${voter.nom}` : "Anonyme",
      points: vote.points,
    })
  })

  // Convertir en tableau et trier par points
  const results = Array.from(resultsMap.values())
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
    }))

  return results
}

// Récupérer les statistiques de vote
const fetchVoteStats = async (month: number, year: number) => {
  const { data, error } = await supabase.from("votes").select("points, user_id").eq("month", month).eq("year", year)

  if (error) throw new Error(error.message)

  if (!data || data.length === 0) {
    return {
      totalPoints: 0,
      uniqueVoters: 0,
      totalVotes: 0,
      averagePointsPerVote: 0,
    }
  }

  const totalPoints = data.reduce((sum, vote) => sum + vote.points, 0)
  const uniqueVoters = new Set(data.map((vote) => vote.user_id)).size
  const totalVotes = data.length

  return {
    totalPoints,
    uniqueVoters,
    totalVotes,
    averagePointsPerVote: totalVotes > 0 ? totalPoints / totalVotes : 0,
  }
}

export { fetchVotes, fetchUserVotes, checkUserHasVoted, addVotes, fetchVoteResults, fetchVoteStats }
