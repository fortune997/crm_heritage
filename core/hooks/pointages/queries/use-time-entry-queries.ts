"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { TimeEntryService } from "@/core/services/pointages/time-entry.service"
import type {
  CreateTimeEntryRequest,
  UpdateTimeEntryRequest,
  ClockInRequest,
  ClockOutRequest,
  TimeEntriesFilters,
} from "@/core/types/pointages/api"

// Query Keys
export const timeEntryKeys = {
  all: ["timeEntries"] as const,
  byEmployee: (employeeId: string) => [...timeEntryKeys.all, "byEmployee", employeeId] as const,
  byDateRange: (filters: TimeEntriesFilters) => [...timeEntryKeys.all, "byDateRange", filters] as const,
  today: (employeeId: string, date: string) => [...timeEntryKeys.all, "today", employeeId, date] as const,
  stats: (employeeId: string, startDate: string, endDate: string) =>
    [...timeEntryKeys.all, "stats", employeeId, startDate, endDate] as const,
}

/**
 * Hook pour récupérer tous les pointages d'un employé
 */
export function useTimeEntriesByEmployee(employeeId: string) {
  return useQuery({
    queryKey: timeEntryKeys.byEmployee(employeeId),
    queryFn: async () => {
      const response = await TimeEntryService.getTimeEntriesByEmployee(employeeId)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!employeeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook pour récupérer les pointages par période
 */
export function useTimeEntriesByDateRange(filters: TimeEntriesFilters) {
  return useQuery({
    queryKey: timeEntryKeys.byDateRange(filters),
    queryFn: async () => {
      const response = await TimeEntryService.getTimeEntriesByDateRange(filters)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!filters.user_id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook pour récupérer le pointage du jour
 */
export function useTodayTimeEntry(employeeId: string, date: string) {
  return useQuery({
    queryKey: timeEntryKeys.today(employeeId, date),
    queryFn: async () => {
      const response = await TimeEntryService.getTodayTimeEntry(employeeId, date)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!employeeId && !!date,
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 60 * 1000, // Refetch toutes les minutes
  })
}

/**
 * Hook pour récupérer les statistiques d'un employé
 */
export function useEmployeeStats(employeeId: string, startDate: string, endDate: string) {
  return useQuery({
    queryKey: timeEntryKeys.stats(employeeId, startDate, endDate),
    queryFn: async () => {
      const response = await TimeEntryService.getEmployeeStats(employeeId, startDate, endDate)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!employeeId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook pour créer un pointage
 */
export function useCreateTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (timeEntryData: CreateTimeEntryRequest) => {
      const response = await TimeEntryService.createTimeEntry(timeEntryData)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.byEmployee(data.user_id) })
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.today(data.user_id, data.date) })
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.stats(data.user_id, "", "") })
      }
    },
  })
}

/**
 * Hook pour mettre à jour un pointage
 */
export function useUpdateTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTimeEntryRequest }) => {
      const response = await TimeEntryService.updateTimeEntry(id, updates)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.byEmployee(data.user_id) })
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.today(data.user_id, data.date) })
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.stats(data.user_id, "", "") })
      }
    },
  })
}

/**
 * Hook pour pointer l'arrivée
 */
export function useClockIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (clockInData: ClockInRequest) => {
      const response = await TimeEntryService.clockIn(clockInData)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.byEmployee(data.user_id) })
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.today(data.user_id, data.date) })
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.stats(data.user_id, "", "") })
      }
    },
  })
}

/**
 * Hook pour pointer le départ
 */
export function useClockOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (clockOutData: ClockOutRequest) => {
      const response = await TimeEntryService.clockOut(clockOutData)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.byEmployee(data.user_id) })
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.today(data.user_id, data.date) })
        queryClient.invalidateQueries({ queryKey: timeEntryKeys.stats(data.user_id, "", "") })
      }
    },
  })
}

/**
 * Hook pour supprimer un pointage
 */
export function useDeleteTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await TimeEntryService.deleteTimeEntry(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeEntryKeys.all })
    },
  })
}
