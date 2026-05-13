"use client"

import { useQuery } from "@tanstack/react-query"
import { AdminService, DailyAttendance } from "@/core/services/pointages/admin.service"

// Query Keys
export const adminKeys = {
  all: ["admin"] as const,
  dailyAttendance: (date: string) => [...adminKeys.all, "dailyAttendance", date] as const,
  filteredHistory: (filters: any) => [...adminKeys.all, "filteredHistory", filters] as const,
  history: () => [...adminKeys.all, "history"] as const,
  monthlyStats: (year: number, month: number) => [...adminKeys.all, "monthlyStats", year, month] as const,
  employeeStats: () => [...adminKeys.all, "employeeStats"] as const,
  searchEmployees: (query: string) => [...adminKeys.all, "searchEmployees", query] as const,
}

/**
 * Hook pour récupérer la présence journalière
 */
export function useDailyAttendance(date: string) {
  return useQuery<DailyAttendance[], Error>({
    queryKey: adminKeys.dailyAttendance(date),
    queryFn: async () => {
      const response = await AdminService.getDailyAttendance(date)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data ?? []
    },
    enabled: !!date,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })  
}

/**
 * Hook pour récupérer l'historique filtré
 */
export function useFilteredHistory(filters: {
  employeeId?: string
  startDate?: string
  endDate?: string
  status?: string
}) {
  return useQuery({
    queryKey: adminKeys.filteredHistory(filters),
    queryFn: async () => {
      const response = await AdminService.getFilteredHistory(filters)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useHistory() {
  return useQuery({
    queryKey: adminKeys.history(),
    queryFn: async () => {
      const response = await AdminService.getHistory()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook pour récupérer les statistiques mensuelles
 */
export function useMonthlyStats(year: number, month: number) {
  return useQuery({
    queryKey: adminKeys.monthlyStats(year, month),
    queryFn: async () => {
      const response = await AdminService.getMonthlyStats(year, month)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!year && !!month,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook pour récupérer les statistiques par employé
 */
// export function useEmployeeStats(year: number, month: number) {
//   return useQuery({
//     queryKey: adminKeys.employeeStats(year, month),
//     queryFn: async () => {
//       const response = await AdminService.getEmployeeStats(year, month)
//       if (response.error) {
//         throw new Error(response.error)
//       }
//       return response.data
//     },
//     enabled: !!year && !!month,
//     staleTime: 10 * 60 * 1000,
//   })
// }

/**
 * Hook pour récupérer les statistiques par employé
 */

export function useEmployeeStats(year: number, month: number) {
  // Format YYYY-MM-01 (premier jour du mois)
  const inputMonth = `${year}-${month.toString().padStart(2, '0')}-01`;

  return useQuery({
    queryKey: ['employeeStats', inputMonth],
    queryFn: async () => {
      const response = await AdminService.getEmployeeStats(inputMonth);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook pour rechercher des employés
 */
export function useSearchEmployees(query: string) {
  return useQuery({
    queryKey: adminKeys.searchEmployees(query),
    queryFn: async () => {
      const response = await AdminService.searchEmployees(query)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: query.length >= 2, // Recherche seulement si au moins 2 caractères
    staleTime: 5 * 60 * 1000,
  })
}
