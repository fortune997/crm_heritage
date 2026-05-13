
import { useEffect, useState } from "react"

export function useGeolocationPermission() {
  const [status, setStatus] = useState<PermissionState | "unsupported">("unsupported")

  useEffect(() => {
    if (!navigator.permissions || !navigator.geolocation) {
      setStatus("unsupported")
      return
    }

    navigator.permissions.query({ name: "geolocation" as PermissionName }).then((result) => {
      setStatus(result.state)

      result.onchange = () => {
        setStatus(result.state)
      }
    })
  }, [])

  return status
}
