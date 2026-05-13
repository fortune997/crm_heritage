import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  fetchVotes,
  fetchUserVotes,
  checkUserHasVoted,
  addVotes,
  fetchVoteResults,
  fetchVoteStats,
} from "../services/vote-service"

// Hook pour récupérer tous les votes
export const useVotes = () => {
  return useQuery({
    queryKey: ["votes"],
    queryFn: fetchVotes,
    // staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook pour récupérer les votes d'un utilisateur
export const useUserVotes = (userId: string, month: number, year: number) => {
  return useQuery({
    queryKey: ["user-votes", userId, month, year],
    queryFn: () => fetchUserVotes(userId, month, year),
    enabled: !!userId,
    // staleTime: 1000 * 60 * 5,
  })
}

// Hook pour vérifier si un utilisateur a voté
export const useHasUserVoted = (userId: string, month: number, year: number) => {
  return useQuery({
    queryKey: ["has-voted", userId, month, year],
    queryFn: () => checkUserHasVoted(userId, month, year),
    enabled: !!userId,
    // staleTime: 1000 * 60 * 5,
  })
}

// Hook pour ajouter des votes
export const useAddVotes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      votes,
      userId,
    }: {
      votes: Array<{ candidat_id: string; points: number }>
      userId: string
    }) => addVotes(votes, userId),
    onMutate: () => {
      const toastId = toast.loading("Enregistrement de vos votes...")
      return { toastId }
    },
    onSuccess: (_, __, context) => {
      toast.dismiss(context?.toastId)
      toast.success("Vos votes ont été enregistrés avec succès !")

      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: ["votes"] })
      queryClient.invalidateQueries({ queryKey: ["user-votes"] })
      queryClient.invalidateQueries({ queryKey: ["has-voted"] })
      queryClient.invalidateQueries({ queryKey: ["vote-results"] })
      queryClient.invalidateQueries({ queryKey: ["vote-stats"] })
    },
    onError: (error, _, context) => {
      toast.dismiss(context?.toastId)
      toast.error("Erreur lors de l'enregistrement : " + error.message)
    },
  })
}

// Hook pour récupérer les résultats de vote
export const useVoteResults = (month: number, year: number) => {
  return useQuery({
    queryKey: ["vote-results", month, year],
    queryFn: () => fetchVoteResults(month, year),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Hook pour récupérer les statistiques de vote
export const useVoteStats = (month: number, year: number) => {
  return useQuery({
    queryKey: ["vote-stats", month, year],
    queryFn: () => fetchVoteStats(month, year),
    staleTime: 1000 * 60 * 10,
  })
}
