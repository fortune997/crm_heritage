import supabase from "@/core/lib/supabase"
import type {
  TimeEntry,
  CreateTimeEntryRequest,
  UpdateTimeEntryRequest,
  ClockInRequest,
  ClockOutRequest,
  TimeEntriesFilters,
  ApiResponse,
} from "@/core/types/pointages/api"

export class TimeEntryService {
  /**
   * Récupérer tous les pointages d'un employé
   */
  static async getTimeEntriesByEmployee(employeeId: string): Promise<ApiResponse<TimeEntry[]>> {
    try {
      const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", employeeId)
        .order("created_at", { ascending: false })

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: "Erreur lors de la récupération des pointages" }
    }
  }

  /**
   * Récupérer les pointages par période
   */
  static async getTimeEntriesByDateRange(filters: TimeEntriesFilters): Promise<ApiResponse<TimeEntry[]>> {
    try {
      let query = supabase.from("time_entries").select("*").eq("user_id", filters.user_id)

      if (filters.start_date) {
        query = query.gte("date", filters.start_date)
      }

      if (filters.end_date) {
        query = query.lte("date", filters.end_date)
      }

      if (filters.status) {
        query = query.eq("status", filters.status)
      }

      const { data, error } = await query.order("date", { ascending: false })

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: "Erreur lors de la récupération des pointages" }
    }
  }

  /**
   * Récupérer le pointage du jour
   */
  static async getTodayTimeEntry(employeeId: string, date: string): Promise<ApiResponse<TimeEntry>> {
    try {
      const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", employeeId)
        .eq("date", date)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        return { data: null, error: error.message }
      }

      return { data: data || null, error: null }
    } catch (error) {
      return { data: null, error: "Erreur lors de la récupération du pointage du jour" }
    }
  }

  /**
   * Créer un nouveau pointage
   */
  static async createTimeEntry(timeEntryData: CreateTimeEntryRequest): Promise<ApiResponse<TimeEntry>> {
    try {
      const { data, error } = await supabase.from("time_entries").insert(timeEntryData).select().single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: "Erreur lors de la création du pointage" }
    }
  }

  /**
   * Mettre à jour un pointage
   */
  static async updateTimeEntry(id: string, updates: UpdateTimeEntryRequest): Promise<ApiResponse<TimeEntry>> {
    try {
      const { data, error } = await supabase.from("time_entries").update(updates).eq("id", id).select().single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: "Erreur lors de la mise à jour du pointage" }
    }
  }

  /**
   * Supprimer un pointage
   */
  static async deleteTimeEntry(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.from("time_entries").delete().eq("id", id)

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: true, error: null }
    } catch (error) {
      return { data: null, error: "Erreur lors de la suppression du pointage" }
    }
  }

  /**
   * Pointer l'arrivée
   */
  static async clockIn(clockInData: ClockInRequest): Promise<ApiResponse<TimeEntry>> {
    try {
      const timeEntryData: CreateTimeEntryRequest = {
        user_id: clockInData.user_id,
        date: clockInData.date,
        clock_in_2: clockInData.time,
        location_lat: clockInData.location.lat,
        location_lng: clockInData.location.lng,
        location_address: clockInData.location.address,
        status: clockInData.status,
      }

      return await this.createTimeEntry(timeEntryData)
    } catch (error) {
      return { data: null, error: "Erreur lors du pointage d'arrivée" }
    }
  }

  /**
   * Pointer le départ
   */
  static async clockOut(clockOutData: ClockOutRequest): Promise<ApiResponse<TimeEntry>> {
    try {
      const updates: UpdateTimeEntryRequest = {
        clock_out_2: clockOutData.time,
        duration_2: clockOutData.duration,
        location_lat: clockOutData.location.lat,
        location_lng: clockOutData.location.lng,
        location_address: clockOutData.location.address,
      }

      return await this.updateTimeEntry(clockOutData.time_entry_id, updates)
    } catch (error) {
      return { data: null, error: "Erreur lors du pointage de départ" }
    }
  }

  /**
   * Récupérer les statistiques d'un employé
   */
  static async getEmployeeStats(employeeId: string, startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", employeeId)
        .gte("date", startDate)
        .lte("date", endDate)

      if (error) {
        return { data: null, error: error.message }
      }

      const entries = data || []
      const workDays = entries.filter((e) => e.clock_in && e.clock_out).length
      const totalHours = entries.reduce((sum, e) => sum + (e.duration || 0), 0)
      const lateCount = entries.filter((e) => e.status === "late").length
      const absentCount = entries.filter((e) => e.status === "absent").length

      const stats = {
        workDays,
        totalHours,
        overtimeHours: Math.max(0, totalHours - workDays * 8),
        lateCount,
        absentCount,
        averageHoursPerDay: workDays > 0 ? totalHours / workDays : 0,
        presenceRate: entries.length > 0 ? (workDays / entries.length) * 100 : 0,
      }

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: "Erreur lors du calcul des statistiques" }
    }
  }
}
