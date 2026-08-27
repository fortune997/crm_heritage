

import { uploadFileToSupabase } from "@/core/lib/uploadFile";
import { toast } from "sonner";

import { TSiteValues } from "@/core/lib/site";
import { SiteStatistics, TSites } from "@/core/types/sites";
import { createClient } from "@/lib/config/supabase";
import { deleteFileFromSupabase } from "../delete-service";


const supabase = createClient()

const fetchSite = async (): Promise<TSites[]> => {
  const { data, error } = await supabase.from('sites').select('*, site_medias(*) ');
  if (error) throw new Error(error.message);
  return data;
}

const fetchMedia = async () => {
  const { data, error } = await supabase.from('medias').select('*');
  if (error) throw new Error(error.message);
  return data;
}

const fetchSiteById = async (id: string): Promise<TSites> => {
  const { data, error } = await supabase.from('sites').select('*, site_medias(*)').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}



const ajoutSite = async (formData: TSiteValues) => {
  const toastId = toast.loading("⏳ Création du site...");

  const uploadedFiles: string[] = [];
  let createdSiteId: string | null = null;



  try {
    // On retire les fichiers des données du site
    const {
      imageFiles,
      videoFile,

      document_foncier,
      plan_lotissement,
      ...siteData
    } = formData;

    console.log('FORMDATA', formData)

    // Création du site
    const { data: site, error: siteError } = await supabase
      .from("sites")
      .insert(siteData)
      .select()
      .single();

    if (siteError) throw siteError;

    console.log('ste ', site)
    console.log('siteError ', siteError)
    console.log('imageFiles ', imageFiles)


    createdSiteId = site.id;

    const medias: any[] = [];

    // Upload des photos
    if (imageFiles?.length) {
      toast.loading("📷 Upload des photos...", { id: toastId });

      for (const [index, file] of imageFiles.entries()) {
        const result = await uploadFileToSupabase({
          bucket: "sites",
          folder: `${site.id}/photos`,
          file,
        });
        console.log('result IMAGE ', result)

        if (!result.success || !result.path) {
          throw new Error(result.error);
        }
        console.log('result IMAGE ', result)


        const uploadeImg = uploadedFiles.push(result.path);
        console.log('UPLOADED IMAGE ', uploadeImg)


        medias.push({
          site_id: site.id,
          type: "photo",
          chemin: result.path,
          nom: file.name,
          mime_type: file.type,
          extension: file.name.split(".").pop(),
          taille: file.size,
          ordre: index + 1,
        });
      }
    }

    // Upload vidéo
    if (videoFile) {
      toast.loading("🎥 Upload de la vidéo...", { id: toastId });

      const result = await uploadFileToSupabase({
        bucket: "sites",
        folder: `${site.id}/videos`,
        file: videoFile,
      });

      console.log('SITE BUCKET  ', result)

      if (!result.success || !result.path) {
        throw new Error(result.error);
      }

      const uploadeVid = uploadedFiles.push(result.path);

      console.log('UPLOADED VIDEO ', uploadeVid)

      medias.push({
        site_id: site.id,
        type: "video",
        chemin: result.path,
        nom: videoFile.name,
        mime_type: videoFile.type,
        extension: videoFile.name.split(".").pop(),
        taille: videoFile.size,
      });
    }

    // Upload plan de lotissement
    if (plan_lotissement) {
      const result = await uploadFileToSupabase({
        bucket: "sites",
        folder: `${site.id}/plans`,
        file: plan_lotissement,
      });

      if (!result.success || !result.path) {
        throw new Error(result.error);
      }

      uploadedFiles.push(result.path);

      medias.push({
        site_id: site.id,
        type: "plan_lotissement",
        chemin: result.path,
        nom: plan_lotissement.name,
        mime_type: plan_lotissement.type,
        extension: plan_lotissement.name.split(".").pop(),
        taille: plan_lotissement.size,
      });
    }

    // Upload document foncier
    /*   if (document_foncier) {
        const result = await uploadFileToSupabase({
          bucket: "sites",
          folder: `${site.id}/documents`,
          file: document_foncier,
        });
  
        if (!result.success || !result.path) {
          throw new Error(result.error);
        }
  
        uploadedFiles.push(result.path);
  
        medias.push({
          site_id: site.id,
          type: "titre_foncier",
          chemin: result.path,
          nom: document_foncier.name,
          mime_type: document_foncier.type,
          extension: document_foncier.name.split(".").pop(),
          taille: document_foncier.size,
        });
      }
   */
    // Insertion des médias
    if (medias.length > 0) {
      const { error: mediaError } = await supabase
        .from("site_medias")
        .insert(medias);

      if (mediaError) throw mediaError;
      console.log('mediaError ', mediaError)

    }

    toast.success("🎉 Site ajouté avec succès !", {
      id: toastId,
    });

    console.log('SITE IMAGE ', site)

    return site;
  } catch (err: any) {
    console.log('SITE ERROR ', err)
    console.error(err);


    toast.error(err.message ?? "Une erreur est survenue", {
      id: toastId,
    });

    // Suppression des fichiers uploadés
    for (const path of uploadedFiles) {
      try {
        await deleteFileFromSupabase(path, "sites");
      } catch (e) {
        console.warn("Erreur suppression :", e);
      }
    }

    // Suppression du site si créé
    if (createdSiteId) {
      await supabase
        .from("sites")
        .delete()
        .eq("id", createdSiteId);
    }

    throw err;
  }
};

/* const updateSite = async ({
  id,
  formData,
}: {
  id: number;
  formData: TSiteValues;
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
 */

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





const siteStatisticsService = {
  async getStatistics(): Promise<SiteStatistics> {
    const { data, error } = await supabase.rpc("get_site_statistics");

    if (error) {
      throw error;
    }

    return data[0];
  },
};

export {
  fetchSite,
  fetchSiteById,
  fetchTotalSite,
  deleteSite,
  ajoutSite,
  fetchMedia,
  siteStatisticsService
}