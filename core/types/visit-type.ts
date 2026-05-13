export type VisitStatus = "programmé" | "en cours" | "terminer" | "annulé" | "manquer"
export type TransportMode = "car" | "public" | "bike" | "walk" | "other"

export interface Visit {
  id: string
  title: string
  client: string
  location: string
  description?: string
  status: VisitStatus
  startTime: string
  endTime: string
  transportMode?: TransportMode
  price?: number
}