import supabase from "@/core/lib/supabase"
import { TSite } from "../types/type"
import { TFormSchemaSite } from "../types/zod/zodSchema";
import { toast } from "sonner";
import { uploadFileToSupabase } from "../lib/uploadFile";
import { deleteFileFromSupabase } from "./bien-service";
import { PropertyFormData } from "../types/zod/zodSchemaProperty";

const fetchSite = async () => {
  const { data, error } = await supabase.from('sites').select('*, medias(*)');
  if (error) throw new Error(error.message);
  return data;
}

const fetchMedia = async () => {
  const { data, error } = await supabase.from('medias').select('*');
  if (error) throw new Error(error.message);
  return data;
}

const fetchSiteById = async (id: string) => {
  const { data, error } = await supabase.from('sites').select('*, medias(*)').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

const addSite = async (dataSite: TSite) => {
  const { data, error } = await supabase.from('sites').insert([dataSite]);
  if (error) throw new Error(error.message);
  return data;
}

const ajoutSite = async (formData: TFormSchemaSite) => {
  const toastId = toast.loading("⏳ Démarrage de l'ajout du site...");

  let videoUrl: string | null = null;
  const imageUrls: string[] = [];


  try {
    //  Vidéo principale + images
    if (formData.videoFile) {
      toast.loading("📤 Upload de la vidéo ...", { id: toastId });
      const videoResult = await uploadFileToSupabase(formData.videoFile, 'biens');
      if (!videoResult.success || !videoResult.url) {
        throw new Error(videoResult.error || "Erreur vidéo principale.");
      }
      videoUrl = videoResult.url;
      toast.success("✅ Vidéo principale uploadée !", { id: toastId });
    }

    if (formData.imageFiles?.length) {
      for (let i = 0; i < formData.imageFiles.length; i++) {
        toast.loading(`📷 Upload image ${i + 1}...`, { id: toastId });
        const imgResult = await uploadFileToSupabase(formData.imageFiles[i], 'biens');
        if (!imgResult.success || !imgResult.url) {
          throw new Error(imgResult.error || `Erreur image ${i + 1}`);
        }
        imageUrls.push(imgResult.url);
      }
      toast.success("✅ Images principales uploadées !", { id: toastId });
    }



    //  Insertion dans medias
    const { data: mediasData, error: mediasError } = await supabase
      .from("medias")
      .insert([{
        video: videoUrl,
        image_1: imageUrls[0] || null,
        image_2: imageUrls[1] || null,
        image_3: imageUrls[2] || null,
        image_4: imageUrls[3] || null,
        image_5: imageUrls[4] || null,
        image_6: imageUrls[5] || null,
        image_7: imageUrls[6] || null,
        image_8: imageUrls[7] || null,
        image_9: imageUrls[8] || null,
        image_10: imageUrls[9] || null,
      }])
      .select()
      .single();
    if (mediasError) throw new Error(mediasError.message);


    //  Insertion du bien
    const {
      imageFiles, videoFile,
      ...otherData
    } = formData;



    const siteToInsert = {
      ...otherData,
      media: mediasData.id,

    };


    const { data: siteResult, error: siteError } = await supabase
      .from("sites")
      .insert([siteToInsert])
      .select();
    if (siteError) throw new Error(siteError.message);

    toast.success("🎉 Site ajouté avec succès !", { id: toastId });



    return siteResult;

  } catch (err: any) {
    console.error("❌ Erreur lors de l'ajout :", err);
    toast.error(`❌ ${err.message || "Une erreur est survenue."}`, { id: toastId });

    // ROLLBACK fichiers uploadés
    const uploadedUrls = [
      videoUrl,
      ...imageUrls,

    ].filter(Boolean) as string[];

    for (const url of uploadedUrls) {
      try {
        await deleteFileFromSupabase(url);
        console.log("🧹 Fichier supprimé :", url);
      } catch (cleanupError) {
        console.warn("⚠️ Erreur suppression fichier rollback :", cleanupError);
      }
    }

    throw err;
  }
};

const updateSite = async ({
  id,
  formData,
}: {
  id: number;
  formData: TFormSchemaSite;
}) => {
  const toastId = toast.loading("⏳ Mise à jour du site en cours...");

  try {
    if (!id) throw new Error("ID du site manquant");

    // 1️⃣ Récupérer le site existant
    const { data: existingSite, error: fetchError } = await supabase
      .from("sites")
      .select("id, media")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!existingSite) throw new Error("Site non trouvé");

    // 2️⃣ Uploads fichiers
    let videoUrl: string | null = null;
    const imageUrls: string[] = [];

    // Vidéo
    if (formData.videoFile) {
      const videoResult = await uploadFileToSupabase(formData.videoFile, "biens");
      if (!videoResult.success) throw new Error(videoResult.error);
      videoUrl = videoResult.url!;
    }

    // Images
    if (formData.imageFiles?.length) {
      for (const file of formData.imageFiles) {
        const imgResult = await uploadFileToSupabase(file as File, "biens");
        if (!imgResult.success) throw new Error(imgResult.error);
        imageUrls.push(imgResult.url!);
      }
    }

    // 3️⃣ Si le site n’a pas encore de média → on crée un nouveau média
    let mediaId = existingSite.media;

    if (mediaId) {
      const { error: updateMediaError } = await supabase
        .from("medias")
        .update({
          ...(videoUrl && { video: videoUrl }),
          ...(imageUrls[0] && { image_1: imageUrls[0] }),
          ...(imageUrls[1] && { image_2: imageUrls[1] }),
          ...(imageUrls[2] && { image_3: imageUrls[2] }),
          ...(imageUrls[3] && { image_4: imageUrls[3] }),
          ...(imageUrls[4] && { image_5: imageUrls[4] }),
          ...(imageUrls[5] && { image_6: imageUrls[5] }),
          ...(imageUrls[6] && { image_7: imageUrls[6] }),
          ...(imageUrls[7] && { image_8: imageUrls[7] }),
          ...(imageUrls[8] && { image_9: imageUrls[8] }),
          ...(imageUrls[9] && { image_10: imageUrls[9] }),
        })
        .eq("id", mediaId);

      if (updateMediaError) throw updateMediaError;
    }

    // 4️⃣ Mise à jour du site avec les autres champs
    const { imageFiles, videoFile, ...siteUpdateData } = formData;

    const { data, error: updateSiteError } = await supabase
      .from("sites")
      .update(siteUpdateData)
      .eq("id", id)
      .single()

    if (updateSiteError) throw updateSiteError;

    toast.success("🎉 Site mis à jour avec succès !", { id: toastId });
    return data;
  } catch (err: any) {
    console.error("❌ Erreur mise à jour :", err);
    toast.error(`❌ ${err.message || "Une erreur est survenue."}`, { id: toastId });
    throw err;
  }
};


/* const updateSiteX = async ({
  id
  
}: {
  id: number;

}) => {
  const toastId = toast.loading("⏳ Démarrage de la mise à jour du site...");

  try {



    // Update property
    const { data: updatedSite, error: siteError } = await supabase
      .from("sites")
      .update({ media: 18 })
      .eq("id", id) 
      .select()
      .single();
    if (siteError) throw new Error(siteError.message);

    toast.success("🎉 site mis à jour avec succès !", { id: toastId });
    return updatedSite;

  } catch (err: any) {
    console.error("❌ Erreur mise à jour :", err);
    toast.error(`❌ ${err.message || "Une erreur est survenue."}`, { id: toastId });
    throw err;
  }
};
 */


const fetchTotalSite = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('sites')
    .select('*', { count: 'exact', head: true });

  if (error) throw new Error(error.message);
  return count ?? 0; // On garantit que ça retourne toujours un nombre
};

const deleteSite = async (id: string) => {
  const { data, error } = await supabase.from('sites').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return data;
}


export {
  fetchSite,
  fetchSiteById,
  addSite,
  updateSite,
  fetchTotalSite,
  deleteSite,
  ajoutSite,
  fetchMedia
}