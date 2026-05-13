import { IVisit } from "@/core/types/type"

export const generatePDF = (visits: IVisit[]) => {
  // In a real application, you would use a library like jspdf or pdfmake
  // For this demo, we'll create a simple CSV and trigger a download

  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,"

  // Add headers
  csvContent += "Titre,Client,Lieu,Statut,Date de début,Date de fin,Description\n"

  // Add visit data
  visits.forEach((visit) => {
    const startDate = new Date(visit.startTime).toLocaleString("fr-FR")
    const endDate = new Date(visit.endTime).toLocaleString("fr-FR")
    const status = getStatusLabel(visit.status)

    // Escape commas in text fields
    const row = [
      `"${visit.title}"`,
      `"${visit.prospects?.nom}"`,
      `"${visit.prospects?.site_concerne}"`,
      `"${status}"`,
      `"${startDate}"`,
      `"${endDate}"`,
    ].join(",")

    csvContent += row + "\n"
  })

  // Create download link
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `visites_${new Date().toISOString().split("T")[0]}.csv`)
  document.body.appendChild(link)

  // Trigger download
  link.click()

  // Clean up
  document.body.removeChild(link)
}

function getStatusLabel(status: IVisit["status"]): string {
  const statusMap = {
    "programmé": "Planifiée",
    "cours": "En cours",
    "terminer": "Terminée",
    "annulé": "Annulée",
    "manquer": "Manquée",
  } as const;

  return statusMap[status as keyof typeof statusMap]
}
