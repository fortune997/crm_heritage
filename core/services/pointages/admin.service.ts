import supabase from "@/core/lib/supabase";
import type { TimeEntry, ApiResponse } from "@/core/types/pointages/api";
import { HeritageUser } from "@/core/types/profiles";


export interface DailyAttendance {
  employee: HeritageUser;
  timeEntry: TimeEntry | null;
  status: "present" | "late" | "absent";
}

export interface EmployeeStats {
  employee: HeritageUser;
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  totalHours: number;
  averageHours: number;
  punctualityScore: number;
  presenceRate: number;
}

export interface MonthlyStats {
  totalEmployees: number;
  totalWorkDays: number;
  totalHours: number;
  averagePresenceRate: number;
  punctualEmployees: number;
  lateEmployees: number;
  absentEmployees: number;
}

export interface MonthlyStatsLead {
  total: number;
  prospects_leads: number;
  month: string;
  month_num: number;
  year: number;

}


export class AdminService {
  /**
   * Récupérer la présence journalière de tous les employés
   */
  static async getDailyAttendance(
    date: string
  ): Promise<ApiResponse<DailyAttendance[]>> {
    try {
      // Récupérer tous les employés
      const { data: employees, error: employeesError } = await supabase
        .from("profiles")
        .select("*")
        .order("nom", { ascending: true });

      if (employeesError) {
        return { data: null, error: employeesError.message };
      }

      // Récupérer les pointages du jour
      const { data: timeEntries, error: entriesError } = await supabase
        .from("time_entries")
        .select("*")
        .eq("date", date);

      if (entriesError) {
        return { data: null, error: entriesError.message };
      }

      // Combiner les données
      const attendance: DailyAttendance[] = employees.map((employee) => {
        const timeEntry = timeEntries.find(
          (entry) => entry.user_id === employee.id
        );
        let status: "present" | "late" | "absent" = "absent";

        if (timeEntry) {
          status = timeEntry.status as "present" | "late" | "absent";
        }

        return {
          employee,
          timeEntry: timeEntry || null,
          status,
        };
      });

      return { data: attendance ?? [], error: null };
    } catch (error) {
      return {
        data: null,
        error: "Erreur lors de la récupération de la présence journalière",
      };
    }
  }

  /**
   * Récupérer l'historique complet sans filtres
   */
  static async getHistory(): Promise<
    ApiResponse<
      {
        nom: string;
        prenom: string;
        photo_url: string;
        clock_in_2: string;
        clock_out_2: string;
        duration_2: string;
        date: string;
        location_address: string;
        statut_presence: string;
        poste: string;
      }[]
    >
  > {
    try {
      let query = supabase.from("histori_user_entries").select(`*`);

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: null,
        error: "Erreur lors de la récupération de l'historique",
      };
    }
  }

  /**
   * Récupérer l'historique complet avec filtres
   */
  static async getFilteredHistory(filters: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<(TimeEntry & { employee: HeritageUser })[]>> {
    try {
      let query = supabase
        .from("time_entries")
        .select(
          `
          *,
          profiles(*)
        `
        )
        .order("date", { ascending: false });

      if (filters.employeeId) {
        query = query.eq("user_id", filters.employeeId);
      }

      if (filters.startDate) {
        query = query.gte("date", filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte("date", filters.endDate);
      }

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: null,
        error: "Erreur lors de la récupération de l'historique",
      };
    }
  }

  /**
   * Récupérer les statistiques mensuelles globales
   */
  static async getMonthlyStats(
    year: number,
    month: number
  ): Promise<ApiResponse<MonthlyStats>> {
    try {
      // Validation stricte du mois
      if (month < 1 || month > 12) {
        return { data: null, error: "Mois invalide, doit être entre 1 et 12" };
      }

      // Construction des dates
      const startDateObj = new Date(year, month - 1, 1); // mois JS 0-based
      const endDateObj = new Date(year, month, 0); // dernier jour du mois courant
      const startDate = startDateObj.toISOString().slice(0, 10);
      const endDate = endDateObj.toISOString().slice(0, 10);

      // Récupérer tous les employés
      const { data: employees, error: employeesError } = await supabase
        .from("profiles")
        .select("*");
      if (employeesError) {
        return { data: null, error: employeesError.message };
      }

      // Récupérer les pointages du mois
      const { data: timeEntries, error: entriesError } = await supabase
        .from("time_entries")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate);
      if (entriesError) {
        return { data: null, error: entriesError.message };
      }

      const totalEmployees = employees.length;
      const totalWorkDays = timeEntries.filter(
        (e) => e.clock_in && e.clock_out
      ).length;
      const totalHours = timeEntries.reduce(
        (sum, e) => sum + (e.duration || 0),
        0
      );

      const presentEntries = timeEntries.filter((e) => e.status === "present");
      const lateEntries = timeEntries.filter((e) => e.status === "late");
      const absentEntries = timeEntries.filter((e) => e.status === "absent");

      const stats: MonthlyStats = {
        totalEmployees,
        totalWorkDays,
        totalHours,
        averagePresenceRate:
          totalEmployees > 0
            ? (totalWorkDays / (totalEmployees * 22)) * 100
            : 0,
        punctualEmployees: presentEntries.length,
        lateEmployees: lateEntries.length,
        absentEmployees: absentEntries.length,
      };

      return { data: stats, error: null };
    } catch (error) {
      return {
        data: null,
        error: "Erreur lors du calcul des statistiques mensuelles",
      };
    }
  }

  /**
   * Récupérer les statistiques détaillées par employé
   */
  static async getEmployeeStats(month: string): Promise<
    ApiResponse<
      {
        id: string;
        nom: string;
        prenom: string;
        month: string;
        photo_url: string,
        poste: string,
        jours_travailles: number;
        heures_travaillees: number;
        heures_supplementaires: number;
        taux_presence_pourcentage: number;
      }[]
    >
  > {
    try {
      // Appel RPC vers ta fonction PostgreSQL
      const { data, error } = await supabase.rpc("get_punctuality_ranking", {
        input_month: month,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: "Erreur lors du calcul des statistiques par employé",
      };
    }
  }

  /**
   * Rechercher des employés
   */
  static async searchEmployees(
    query: string
  ): Promise<ApiResponse<HeritageUser[]>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(
          `nom.ilike.%${query}%,email.ilike.%${query}%,poste.ilike.%${query}%`
        )
        .order("name", { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: "Erreur lors de la recherche d'employés" };
    }
  }
}
