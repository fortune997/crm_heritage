"use client"

import { useState } from "react"
import type { LocationData } from "@/core/types/pointages"

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = async (): Promise<LocationData> => {
    setIsLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = "Géolocalisation non supportée par ce navigateur"
        setError(error)
        setIsLoading(false)
        reject(new Error(error))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          try {
            address = await reverseGeocode(latitude, longitude)
          } catch (err) {
            console.warn("Reverse geocoding échoué :", err)
            // On garde les coordonnées comme adresse simple
          }

          const locationData: LocationData = {
            lat: latitude,
            lng: longitude,
            address,
          }

          setIsLoading(false)
          resolve(locationData)
        },
        (error) => {
          let errorMessage = "Erreur de géolocalisation"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permission de géolocalisation refusée. Le pointage ne peut pas être validé."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Position non disponible. Vérifiez votre connexion GPS."
              break
            case error.TIMEOUT:
              errorMessage = "Délai d'attente dépassé. Réessayez."
              break
          }

          setError(errorMessage)
          setIsLoading(false)
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        },
      )
    })
  }

  const checkPermission = async (): Promise<PermissionState> => {
    if (!navigator.permissions) {
      return "prompt"
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" })
      return result.state
    } catch {
      return "prompt"
    }
  }

  return {
    requestLocation,
    checkPermission,
    isLoading,
    error,
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // Coordonnées approximatives de la salle des fêtes d’Akwa à Douala
  const doualaLat = 4.0500
  const doualaLng = 9.7000

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${lat.toFixed(4)}, ${lng.toFixed(4)} - Salle des fêtes d’Akwa, Douala`)
    }, 500)
  })
}
