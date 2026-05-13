import { TimeEntry, TProspect, TVente } from "@/core/types/type"
import { WorkHoursResult } from "@/core/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { startOfWeek, endOfWeek, getWeek, format, getDay } from 'date-fns'
import { fr } from 'date-fns/locale'




export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR").format(date)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
  }).format(amount)
}


export function getCategorieClient(vente: TVente): string {
  if (!vente.created_at) return "CLASSIQUE";

  const versementDate = new Date(vente.created_at);
  const now = new Date();

  // Pourcentage payer
  const pourcentage = (vente.montant_recu ?? 0) / vente.total_a_payer * 100;

  // Nombre de jours depuis le début
  const joursDepuisVersement = Math.floor((now.getTime() - versementDate.getTime()) / (1000 * 3600 * 24));

  // -------------------------
  //       PLATINIUM
  // -------------------------
  if (
    // Convention le même jour
    vente.convention === true && joursDepuisVersement <= 0 &&
    // Bornage en 7 jours
    joursDepuisVersement >= 0 && joursDepuisVersement <= 7 &&
    // PV après 90%
    pourcentage >= 90 &&
    // Dossier technique dans 60 jours
    vente.dt_document === true && joursDepuisVersement <= 60
  ) {
    return "PLATINIUM";
  }

  // -------------------------
  //       DIAMOND
  // -------------------------
  if (
    // Convention le même jour
    vente.convention === true && joursDepuisVersement <= 0 &&
    // Bornage en 7 jours
    joursDepuisVersement <= 7 &&
    // PV en 14 jours
    vente.pv === true && joursDepuisVersement <= 14 &&
    // Dossier technique en 30 jours
    vente.dt_document === true && joursDepuisVersement <= 30
  ) {
    return "DIAMOND";
  }

  // -------------------------
  //       GOLD
  // -------------------------
  if (
    // Convention en 5 jours
    vente.convention === true && joursDepuisVersement <= 5 &&
    // Bornage en 7 jours
    joursDepuisVersement <= 7 &&
    // PV après 90%
    pourcentage >= 90 &&
    // Dossier technique dans 90 jours
    vente.dt_document === true && joursDepuisVersement <= 90
  ) {
    return "GOLD";
  }

  // -------------------------
  //       CLASSIQUE
  // -------------------------
  if (
    // Convention en 7 jours
    vente.convention === true && joursDepuisVersement <= 7 &&
    // Bornage après 85%
    pourcentage >= 85 &&
    // PV après 90%
    pourcentage >= 90 &&
    // Dossier technique dans 90 jours
    vente.dt_document === true && joursDepuisVersement <= 90
  ) {
    return "CLASSIQUE";
  }

  // Si rien ne correspond → par défaut
  return "CLASSIQUE";
}




export function calculateWorkStats(entries: TimeEntry[]): WorkHoursResult {
  const now = new Date();

  // Start of current week (Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  // Start and end of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let weeklyMs = 0;
  let monthlyMs = 0;
  const daysWorkedSet = new Set<string>();
  let supplementaryMs = 0;
  let lateArrivals = 0;
  let onTimeArrivals = 0; // <-- nouvelle variable

  for (const entry of entries) {
    if (!entry.clock_in || !entry.clock_out) continue;

    const start = new Date(entry.clock_in);
    const end = new Date(entry.clock_out);

    const durationMs = end.getTime() - start.getTime();

    // Month stats
    if (start >= startOfMonth && start <= endOfMonth) {
      monthlyMs += durationMs;

      // Count days worked
      daysWorkedSet.add(start.toDateString());

      // Late / On time logic
      const hour = start.getHours();
      const minutes = start.getMinutes();


      if (hour > 8 || (hour === 8 && minutes > 0)) {
        lateArrivals++;
      } else {
        onTimeArrivals++; // Arrivé à l'heure ou en avance
      }

      // Supplementary logic
      const weekday = start.getDay();
      const expectedHours = weekday === 6 ? 4 : 8;
      const workedHours = durationMs / (1000 * 60 * 60);
      if (workedHours > expectedHours) {
        supplementaryMs += (workedHours - expectedHours) * 60 * 60 * 1000;
      }
    }

    // Weekly stats
    if (start >= startOfWeek) {
      weeklyMs += durationMs;
    }
  }

  const targetHours = 160;
  const hoursWorked = monthlyMs / (1000 * 60 * 60);
  const missingHours = Math.max(0, targetHours - hoursWorked);

  return {
    weeklyHours: Math.round((weeklyMs / (1000 * 60 * 60)) * 100) / 100,
    monthlyHours: Math.round(hoursWorked * 100) / 100,
    daysWorked: daysWorkedSet.size,
    supplementaryHours: Math.round((supplementaryMs / (1000 * 60 * 60)) * 100) / 100,
    lateArrivals,
    onTimeArrivals, // <-- ici on retourne aussi le nombre d’arrivées à l’heure
    targetHours,
    missingHours: Math.round(missingHours * 100) / 100,
  };
}

export const getCurrentWeekInfo = (date: Date = new Date()) => {
  const weekNumber = getWeek(date, { locale: fr, weekStartsOn: 1 }) // semaine commence lundi
  const start = startOfWeek(date, { locale: fr, weekStartsOn: 1 })
  const end = endOfWeek(date, { locale: fr, weekStartsOn: 1 })

  return {
    weekNumber,
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd")
  }
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1);

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) + ' à ' + date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Douala'
  });
}


export function getWorkdaysPassedThisWeek() {
  const today = new Date();
  const dayOfWeek = getDay(today); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Map: Mon=1, Tue=2, Wed=3, Thu=4, Fri=5
  // For Sat and Sun, return 5
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 5;
  } else {
    return dayOfWeek;
  }
}

export function extractClockInTime(clock_in: string | null): string | null {
  if (!clock_in) return null;

  const date = new Date(clock_in);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const formatAmount = (amount?: number | null) =>
  typeof amount === "number" ? amount.toLocaleString("fr-FR") + " F CFA" : "–"

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Payé": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
    case "En retard": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    case "En attente": return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
    default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
  }
}


export const getPunctualityBadge = (score: number) => {
  if (score >= 90) return { variant: "default" as const, label: "Excellent", color: "bg-green-500" }
  if (score >= 80) return { variant: "secondary" as const, label: "Bon", color: "bg-blue-500" }
  if (score >= 70) return { variant: "outline" as const, label: "Moyen", color: "bg-yellow-500" }
  return { variant: "destructive" as const, label: "À améliorer", color: "bg-red-500" }
}

export const getStatusColorSite = (status: string) => {
  switch (status) {
    case "disponible":
      return "bg-green-500"
    case "option":
      return "bg-yellow-500"
    case "vendu":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}
export const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

// Obtenir la semaine courante au format ISO
export const getCurrentWeek = () => {
  const now = new Date()
  const year = now.getFullYear()
  const week = getWeekNumber(now)
  return `${year}-W${week.toString().padStart(2, "0")}`
}


export function coupeText(texte: string): string {
  const mots = texte.split(" ");
  return mots.slice(0, 3).join(" ") + (mots.length > 3 ? "..." : "");
}

export async function sendNotification({ title, body }: { title: string; body: string }) {
  try {
    const response = await fetch('https://pktkoydvuzzqbkfmytxw.supabase.co/functions/v1/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string}`
      },
      body: JSON.stringify({ title, body }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Notification failed with status ${response.status}: ${errorData.message || 'Unknown error'}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error;
  }
}


export function generateReferenceTransaction(prefix = "REF"): string {
  const now = new Date();
  const yyyyMMdd = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ""); // "20250804"

  const timestamp = now.getTime(); // 1692358457123

  return `${prefix}-${yyyyMMdd}-${timestamp}`;
}

export const getStatusColo = (status: string) => {
  switch (status) {
    case "actif":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "en attente":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

export const getPaymentMethodLabel = (method: string) => {
  const labels = {
    virement_bancaire: "Virement bancaire",
    especes: "Espèces",
    cheque: "Chèque",
    mobile_money: "mobile_money",
    paiement_en_ligne: "Paiement en ligne",
  };
  return labels[method as keyof typeof labels] || method;
};


export function getProspectStatus(prospect: TProspect) {
  if (!prospect.created_at || (prospect.interaction_prospect_land?.length ?? 0) > 0) {
    return null;
  }

  const created_at = new Date(prospect.created_at);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - created_at.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays >= 5) return "5j";
  if (diffDays >= 3) return "3j";
  if (diffDays >= 1) return "1j";

  return null;
}


export const getStatusStyle = (statut?: string) => {
  switch (statut?.toLowerCase()) {
    case "terminé":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
    case "en cours":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
    case "annulé":
      return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
    default:
      return "bg-muted text-muted-foreground border border-border"
  }
}

export const getStatusColorSales = (status: string) => {
  switch (status) {
    case "Payé":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300";
    case "En retard":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    case "En attente":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
};

export const getCategoryBadge = (category?: string) => {
  switch (category) {
    case "CLASSIQUE":
      return "bg-gray-400 text-white";
    case "GOLD":
      return "bg-yellow-500 text-white";
    case "DIAMOND":
      return "bg-blue-500 text-white";
    case "PLATINUM":
      return "bg-purple-600 text-white";
    default:
      return "bg-gray-200 text-gray-700";
  }
};


export function getPlanColor(duree: number) {
  switch (duree) {
    case 12:
      return {
        border: "border-blue-500",
        badge: "bg-blue-100 text-blue-700",
        button: "bg-blue-600 hover:bg-blue-700",
        text: "text-blue-600",
      };
    case 24:
      return {
        border: "border-green-500",
        badge: "bg-green-100 text-green-700",
        button: "bg-green-600 hover:bg-green-700",
        text: "text-green-600",
      };
    default:
      return {
        border: "border-gray-300",
        badge: "bg-gray-100 text-gray-600",
        button: "bg-gray-600 hover:bg-gray-700",
        text: "text-gray-600",
      };
  }
}




