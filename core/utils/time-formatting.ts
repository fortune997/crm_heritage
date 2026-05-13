import { TimeEntry } from "../types/type"

export const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }
  
  export const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }
  
  export const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  
  export const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }
  
  export const getUserName = (entry: TimeEntry) => {
    if (entry.profiles) {
      return `${entry.prenom} ${entry.nom}`
    }
    return `${entry.prenom || ""} ${entry.nom || ""}`.trim()
  }
  
  export const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
export  async function getServerTime(): Promise<Date> {
  const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
  const data = await response.json();
  return new Date(data.utc_datetime);
}

