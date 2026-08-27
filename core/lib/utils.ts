
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



export function coupeText(texte: string): string {
  const mots = texte.split(" ");
  return mots.slice(0, 3).join(" ") + (mots.length > 3 ? "..." : "");
}


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



