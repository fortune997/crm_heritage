export interface TimeEntry {
  id: string
  employeeId: string
  date: string
  clockIn?: string
  clockOut?: string
  location?: { lat: number; lng: number; address: string }
  duration?: number
  status: "present" | "late" | "absent" | "early"
}


export interface LocationData {
  lat: number
  lng: number
  address: string
}
