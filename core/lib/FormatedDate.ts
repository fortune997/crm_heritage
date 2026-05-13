export function formatedDate(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Date invalide"; // Protéger la fonction
  }
  
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
