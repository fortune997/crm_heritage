export async function getLocationFromCoords(lat: number, lon: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
  
      // Récupère un niveau pertinent de localisation
      return data.address?.suburb || data.address?.neighbourhood || data.address?.city || data.address?.village || null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'adresse :", error);
      return null;
    }
  }
  