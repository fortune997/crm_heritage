export interface TimeEntry {
  id: string
  user_id: string
  date: string
  clock_in_2?: string
  clock_out_2?: string
  location_lat?: number
  location_lng?: number
  location_address?: string
  duration_2?: number
  duration?: number
  status: "present" | "late" | "absent" | "early"
  created_at: string
  updated_at: string
}

export interface CreateTimeEntryRequest {
  user_id: string
  date: string
  clock_in_2?: string
  clock_out_2?: string
  location_lat?: number
  location_lng?: number
  location_address?: string
  duration?: number
  status: "present" | "late" | "absent" | "early"
}

export interface UpdateTimeEntryRequest {
  clock_in_2?: string
  clock_out_2?: string
  location_lat?: number
  location_lng?: number
  location_address?: string
  duration_2?: number
  status?: "present" | "late" | "absent" | "early"
}

export interface ClockInRequest {
  user_id: string
  date: string
  time: string
  location: {
    lat: number
    lng: number
    address: string
  }
  status: "present" | "late"
}

export interface ClockOutRequest {
  time_entry_id: string
  time: string
  duration: number
  location: {
    lat: number
    lng: number
    address: string
  }
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface TimeEntriesFilters {
  user_id: string
  start_date?: string
  end_date?: string
  status?: "present" | "late" | "absent" | "early"
}
