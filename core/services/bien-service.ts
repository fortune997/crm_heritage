import supabase from "@/core/lib/supabase"
import { uploadFileToSupabase } from"@/core/lib/uploadFile";
import { PropertyFormData, PropertyFormDataGalerie } from "@/core/types/zod/zodSchemaProperty";
import { toast } from "sonner";
import { uploadFile } from "../lib/upload-file";



export const deleteFileFromSupabase = async (url: string) => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  const { error } = await supabase.storage.from('biens').remove([fileName]);
  if (error) throw new Error(error.message);
};
const createBien = async (formData: PropertyFormData) => {
  const toastId = toast.loading("⏳ Démarrage de l'ajout du bien...");

  let videoUrl: string | null = null;
  const imageUrls: string[] = [];


  try {
    //  Vidéo principale + images
    if (formData.videoFile) {
      toast.loading("📤 Upload de la vidéo principale...", { id: toastId });
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

    //  Insertion dans localisation
    const { data: localisationData, error: localisationError } = await supabase
      .from("localisation")
      .insert([formData.localisation])
      .select()
      .single();
    if (localisationError) throw new Error(localisationError.message);

    //  Insertion du bien
    const {
      imageFiles, videoFile, localisation, 
      ...otherData
    } = formData;



    const bienToInsert = {
      ...otherData,
      medias: mediasData.id,
      localisation: localisationData.id,
    };


    const { data: bienResult, error: bienError } = await supabase
      .from("biens")
      .insert([bienToInsert])
      .select();
    if (bienError) throw new Error(bienError.message);

    toast.success("🎉 Bien ajouté avec succès !", { id: toastId });
    

      
    return bienResult;

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
        
      } catch (cleanupError) {
        console.warn("⚠️ Erreur suppression fichier rollback :", cleanupError);
      }
    }

    throw err;
  }
};

const statutMeuble = async ({
  id,
  newStatus,
}: {
  newStatus: boolean
  id: number
}) => {
  const { error } = await supabase
    .from("biens")
    .update({ status_occupation: newStatus })
    .eq("id", id)

  if (error) {
    toast.error(
      `Impossible de changer le statut d'occupation.`
    )
  } else {
    toast.success(
      `Statut Propriété ${newStatus === true ? "Occupée" : "Libre"} avec succès.`
    )
  }
};

const updateProperty = async ({
  bienId,
  formData,
}: {
  bienId: number;
  formData: PropertyFormData;
}) => {
  const toastId = toast.loading("⏳ Démarrage de la mise à jour du bien...");

  try {

    if (!bienId) throw new Error("ID du bien manquant");

    // Get existing property data to reference IDs
    const { data: existingBien, error: fetchError } = await supabase
      .from("biens")
      .select("*, localisation(*), medias(*)")
      .eq("id", bienId)
      .single();

    if (fetchError) throw new Error(fetchError.message);
    if (!existingBien) throw new Error("Bien non trouvé");

  

    let videoUrl: string | null = null;
    const imageUrls: string[] = [];

    // 📤 Upload vidéo
    if (formData.videoFile) {
      toast.loading("📤 Upload de la vidéo...", { id: toastId });
      const videoResult = await uploadFileToSupabase(formData.videoFile, "biens");
      if (!videoResult.success || !videoResult.url) {
        throw new Error(videoResult.error || "Erreur upload vidéo");
      }
      videoUrl = videoResult.url;
      toast.success("✅ Vidéo uploadée !", { id: toastId });
    }

    // 📷 Upload images
    if (formData.imageFiles?.length) {
      for (let i = 0; i < formData.imageFiles.length; i++) {
        toast.loading(`📷 Upload image ${i + 1}...`, { id: toastId });
        const imgResult = await uploadFileToSupabase(formData.imageFiles[i] as File, "biens");
        if (!imgResult.success || !imgResult.url) {
          throw new Error(imgResult.error || `Erreur image ${i + 1}`);
        }
        imageUrls.push(imgResult.url);
      }
      toast.success("✅ Images uploadées !", { id: toastId });
    }

    // 🧭 Update localisation (using existing location ID)
    const { error: locError } = await supabase
      .from("localisation")
      .update(formData.localisation)
      .eq("id", existingBien.localisation.id); 
    if (locError) throw new Error(locError.message);

    // 🖼 Update medias (using existing media ID)
    const { error: mediasError } = await supabase
      .from("medias")
      .update({
        video: videoUrl || existingBien.medias.video,
        image_1: imageUrls[0] || existingBien.medias.image_1,
        image_2: imageUrls[1] || existingBien.medias.image_2,
        image_3: imageUrls[2] || existingBien.medias.image_3,
        image_4: imageUrls[3] || existingBien.medias.image_4,
        image_5: imageUrls[4] || existingBien.medias.image_5,
        image_6: imageUrls[5] || existingBien.medias.image_6,
        image_7: imageUrls[6] || existingBien.medias.image_7,
        image_8: imageUrls[7] || existingBien.medias.image_8,
        image_9: imageUrls[8] || existingBien.medias.image_9,
        image_10: imageUrls[9] || existingBien.medias.image_10,
      })
      .eq("id", existingBien.medias.id); // Add WHERE clause
    if (mediasError) throw new Error(mediasError.message);

    // Prepare property data
    const { imageFiles, videoFile, localisation, ...bienUpdateData } = formData;

    // Update property
    const { data: updatedBien, error: biensError } = await supabase
      .from("biens")
      .update(bienUpdateData)
      .eq("id", bienId) 
      .select()
      .single();
    if (biensError) throw new Error(biensError.message);

    toast.success("🎉 Bien mis à jour avec succès !", { id: toastId });
    return updatedBien;

  } catch (err: any) {
    console.error("❌ Erreur mise à jour :", err);
    toast.error(`❌ ${err.message || "Une erreur est survenue."}`, { id: toastId });
    throw err;
  }
};


const fetchBien = async () => {
  const { data, error } = await supabase.from('biens').select('*, categorie_bien(*), localisation(*), medias(*), galerie_medias(*)');
  if (error) throw new Error(error.message);
  return data
}

const fetchBienById = async (id: string) => {
  const { data, error } = await supabase.from('biens').select('*,proprietaire(*), categorie_bien(*), localisation(*), medias(*) ,  galerie_medias(*)').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data
}


// const deleteBien = async (id: number) => {
//   const toastId = toast.loading("⏳ Suppression de la propriété...");
 

//   // Supprimer le bien
//   const { error: bienError } = await supabase
//     .from('biens')
//     .delete()
//     .eq('id', id);
//     toast.success("🎉 Propriété supprimé avec succès !", { id: toastId });

//   if (bienError) {
//     throw new Error(`Erreur suppression bien : ${bienError.message}`);

//   }
// };

const suppressionProprieteAvecMedia = async (id: number) => {
  const toastId = toast.loading("⏳ Début de la suppression...");

  try {
    // 1. First get the property with its media and location
    const { data: existingBien, error: fetchError } = await supabase
      .from("biens")
      .select("*, localisation(*), medias(*)")
      .eq("id", id)
      .single();

    if (fetchError) throw new Error(fetchError.message);
    if (!existingBien) throw new Error("Bien non trouvé");

    // 2. Collect all media URLs to delete from storage
    const mediaUrls: string[] = [];
    
    // Add video URL if exists
    if (existingBien.medias?.video) {
      mediaUrls.push(existingBien.medias.video);
    }

    // Add image URLs if they exist
    for (let i = 1; i <= 10; i++) {
      const imageKey = `image_${i}` as keyof typeof existingBien.medias;
      if (existingBien.medias?.[imageKey]) {
        mediaUrls.push(existingBien.medias[imageKey]);
      }
    }

    // 3. Delete media files from storage
    for (const url of mediaUrls) {
      try {
        await deleteFileFromSupabase(url);
      
      } catch (cleanupError) {
        console.warn("⚠️ Erreur lors de la suppression du fichier :", url, cleanupError);
      }
    }

    // 4. Delete the media record from database
    const { error: mediaDeleteError } = await supabase
      .from("medias")
      .delete()
      .eq("id", existingBien.medias.id);

    if (mediaDeleteError) throw new Error(`Erreur suppression médias: ${mediaDeleteError.message}`);

    // 5. Delete the location record from database
    if (existingBien.localisation) {
      const { error: locationDeleteError } = await supabase
        .from("localisation")
        .delete()
        .eq("id", existingBien.localisation.id);

      if (locationDeleteError) throw new Error(`Erreur suppression localisation: ${locationDeleteError.message}`);
    }

    // 6. Finally delete the property itself
    const { error: propertyDeleteError } = await supabase
      .from("biens")
      .delete()
      .eq("id", id);

    if (propertyDeleteError) throw new Error(`Erreur suppression propriété: ${propertyDeleteError.message}`);

    toast.success("🎉 Propriété et médias supprimés avec succès !", { id: toastId });
    return true;

  } catch (err: any) {
    console.error("❌ Erreur lors de la suppression:", err);
    toast.error(`❌ ${err.message || "Erreur lors de la suppression"}`, { id: toastId });
    throw err;
  }
};











type AddMediaParams = {
  bienId: number;
  formData: PropertyFormDataGalerie;  

};

 const addMediaToBien = async ({ bienId, formData }: AddMediaParams) => {
  const toastId = toast.loading("⏳ Upload des fichiers...");

  try {
    if (!formData || formData.galerieImageVirtuelle?.length === 0) {
      throw new Error("Aucune image fournie pour l'upload.");
    }

    const imageUrls: string[] = [];

    if (formData.galerieImageVirtuelle?.length) {
      for (let i = 0; i < formData.galerieImageVirtuelle.length; i++) {
        toast.loading(`📷 Upload galerie image ${i + 1}...`, { id: toastId });
        const imgResult = await uploadFileToSupabase(formData.galerieImageVirtuelle[i], 'biens');
        if (!imgResult.success || !imgResult.url) {
          throw new Error(imgResult.error || `Erreur image ${i + 1}`);
        }
        imageUrls.push(imgResult.url);
      }
      toast.success("✅ Images principales uploadées !", { id: toastId });
    }


    let videoUrl: string | null = null;
    if (formData.videoFileVirtuelle) {
      const videoResult = await uploadFileToSupabase(formData.videoFileVirtuelle, "biens");
      if (!videoResult.success || !videoResult.url) throw new Error(videoResult.error || "Erreur upload vidéo");
      videoUrl = videoResult.url;
    }




    // Insert des galerie médias
    const { data: mediaData, error } = await supabase
      .from("galerie_medias")
      .insert([
       { video_virtuelle: videoUrl,
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

    if (error) throw new Error(error.message);
    if (!mediaData?.id) throw new Error("Erreur inattendue: ID média non retourné.");


    // Mise a jour du bien avec la référence a la galerie
    
    const {
      galerieImageVirtuelle, videoFileVirtuelle, 
      ...otherData
    } = formData;

    const galerieToInsert = {
      ...otherData,
      galerie_medias: mediaData,
    };

    const { data: propertyResult, error: updateError } = await supabase
      .from("biens")
      .update([{galerie_medias: mediaData.id}])
      .eq("id", bienId)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);
    console.log('propertyResult',propertyResult);  
    toast.success("✅ Médias ajoutés au bien avec succès !", { id: toastId });

    return propertyResult;
  } catch (err: any) {
    console.error(err);
    toast.error(`❌ ${err.message}`, { id: toastId });
    throw err;
  }
};

// Nombre de Biens, Locataire et Visite caline House par mois
const fetchBiensVisiteLocataireCountMonth = async (year: number) => {
  const { data, error } = await supabase.from('monthly_stats').select('*').eq('year', year)
  if (error) throw new Error(error.message);
  return data;
}



export {updateProperty,statutMeuble, createBien, fetchBien, fetchBienById, addMediaToBien, suppressionProprieteAvecMedia, fetchBiensVisiteLocataireCountMonth }
