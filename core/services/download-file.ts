import { toast } from "sonner";
import supabase from "@/core/lib/supabase";

export async function downloadFile(filePath: string, bucket?: string): Promise<boolean> {
  const toastId = toast.loading("Téléchargement en cours...");

  try {
    // ✅ Si c’est une URL complète (public URL)
    if (filePath.startsWith("http")) {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error("Impossible de télécharger le fichier public");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = decodeURIComponent(filePath.split("/").pop() ?? "fichier");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success("Fichier téléchargé avec succès ✅", { id: toastId });
      return true;
    }

    // ✅ Sinon, téléchargement via Supabase (fichier privé)
    if (!bucket) throw new Error("Le bucket est requis pour les chemins privés");

    const { data, error } = await supabase.storage.from(bucket).download(filePath);
    if (error || !data) throw new Error("Erreur de téléchargement");

    const blobUrl = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filePath.split("/").pop() || "fichier";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    toast.success("Fichier téléchargé avec succès ✅", { id: toastId });
    return true;
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Erreur pendant le téléchargement ❌",
      { id: toastId }
    );
    return false;
  }
}
