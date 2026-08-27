import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getTodayDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Douala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function formatPrice(price: string): string {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return price;
  }

  return `${new Intl.NumberFormat("fr-FR").format(
    numericPrice
  )} FCFA`;
}

export function formatDa(date: string): string {
  if (!date) {
    return "Date invalide";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return "Date invalide";
  }

  return `${day}/${month}/${year}`;
}