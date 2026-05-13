"use client"

import { useState, useEffect } from "react"

export function useTimeSync() {
  const [serverTime, setServerTime] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const syncTime = async () => {
      try {
        // Try to fetch server time from API
        const response = await fetch("/api/time", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON")
        }

        const data = await response.json()
        const syncedTime = new Date(data.timestamp)
        setServerTime(syncedTime)
        setLastSyncTime(new Date())
        setIsLoading(false)

        console.log("Time synced successfully:", syncedTime.toISOString())
      } catch (error) {
        console.warn("Failed to sync with server time, using local time:", error)
        // Fallback to local time if server time fails
        setServerTime(new Date())
        setLastSyncTime(new Date())
        setIsLoading(false)
      }
    }

    // Initial sync
    syncTime()

    // Update time every second based on last sync
    const timeInterval = setInterval(() => {
      if (serverTime && lastSyncTime) {
        const timeSinceSync = Date.now() - lastSyncTime.getTime()
        const updatedTime = new Date(serverTime.getTime() + timeSinceSync)
        setServerTime(updatedTime)
      }
    }, 1000)

    // Sync with server every 5 minutes
    const syncInterval = setInterval(syncTime, 5 * 60 * 1000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(syncInterval)
    }
  }, [serverTime]) // Remove serverTime from dependencies to avoid infinite loop

  return { serverTime, isLoading }
}
