"use client"

import { useEffect } from "react"
import type { TimeEntry } from "@/core/types/pointages"
import { format, differenceInHours, parseISO } from "date-fns"

export function useAutoClockOut(
  timeEntries: TimeEntry[],
  setTimeEntries: (entries: TimeEntry[] | ((prev: TimeEntry[]) => TimeEntry[])) => void,
  employeeId: string,
  serverTime: Date | null,
) {
  useEffect(() => {
    if (!serverTime) return

    const checkAutoClockOut = () => {
      try {
        const currentHour = serverTime.getHours()
        const today = format(serverTime, "yyyy-MM-dd")

        // Check if it's after 19:00 (7 PM)
        if (currentHour >= 19) {
          const todayEntry = timeEntries.find(
            (e) => e.employeeId === employeeId && e.date === today && e.clockIn && !e.clockOut,
          )

          if (todayEntry) {
            console.log("Auto clock-out triggered at", format(serverTime, "HH:mm:ss"))

            const clockOutTime = "19:00"
            const workStartTime = parseISO(`${todayEntry.date}T${todayEntry.clockIn}`)
            const clockOutDateTime = parseISO(`${todayEntry.date}T${clockOutTime}`)
            const duration = differenceInHours(clockOutDateTime, workStartTime)

            const updatedEntry: TimeEntry = {
              ...todayEntry,
              clockOut: clockOutTime,
              duration: Math.round(duration * 100) / 100,
            }

            setTimeEntries((prev) => prev.map((e) => (e.id === todayEntry.id ? updatedEntry : e)))

            // Show notification if supported
            if ("Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification("Départ automatique", {
                  body: "Votre départ a été enregistré automatiquement à 19h00.",
                  icon: "/favicon.ico",
                })
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then((permission) => {
                  if (permission === "granted") {
                    new Notification("Départ automatique", {
                      body: "Votre départ a été enregistré automatiquement à 19h00.",
                      icon: "/favicon.ico",
                    })
                  }
                })
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in auto clock-out:", error)
      }
    }

    // Check every minute
    const interval = setInterval(checkAutoClockOut, 60000)

    // Check immediately
    checkAutoClockOut()

    return () => clearInterval(interval)
  }, [timeEntries, setTimeEntries, employeeId, serverTime])
}
