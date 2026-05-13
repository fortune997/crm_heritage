import supabase from "@/core/lib/supabase"
import { uploadFileToSupabase } from"@/core/lib/uploadFile";
import { toast } from "sonner";
import { CledorFormValues } from "../lib/schema";


const createConception = async (formData: CledorFormValues) => {
  const toastId = toast.loading("📤 Upload de la vidéo en cours...");

  try {
    let videoUrl: string | null = null;

    if (formData.videoFile) {
      const uploadResult = await uploadFileToSupabase(formData.videoFile, 'biens');
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "Erreur lors de l'upload de la vidéo.");
      }
      videoUrl = uploadResult.url;
      toast.success("✅ Vidéo uploadée avec succès !", { id: toastId });
    } else {
      toast.info("ℹ️ Aucune vidéo à uploader.", { id: toastId });
    }

    toast.loading("📤 Upload des images en cours...", { id: toastId });
    const imageUrls: string[] = [];

    // for (let i = 0; i < formData.imageFiles.length; i++) {
    //   toast.loading(`📷 Upload de l'image ${i + 1}...`, { id: toastId });
    //   const result = await uploadFileToSupabase(formData.imageFiles, 'biens');
    //   if (!result.success || !result.url) {
    //     throw new Error(result.error || `Erreur lors de l'upload de l'image ${i + 1}`);
    //   }
    //   imageUrls.push(result.url);
    // }
    for (let i = 0; i < formData.imageFiles.length; i++) {
      const fileOrUrl = formData.imageFiles[i];
      
      if (fileOrUrl instanceof File) {
        // Case 1: It's a File → Upload to Supabase
        toast.loading(`📷 Upload de l'image ${i + 1}...`, { id: toastId });
        const result = await uploadFileToSupabase(fileOrUrl, 'biens'); // Note: Only pass the File, not the whole array
        if (!result.success || !result.url) {
          throw new Error(result.error || `Erreur lors de l'upload de l'image ${i + 1}`);
        }
        imageUrls.push(result.url);
      } else {
        // Case 2: It's a string → Assume it's already a URL
        imageUrls.push(fileOrUrl);
      }
    }

    toast.success("✅ Images uploadées avec succès !", { id: toastId });

    toast.loading("🗂️ Enregistrement des médias...", { id: toastId });
    const { data: mediasData, error: mediasError } = await supabase
      .from("medias")
      .insert([{
        video: videoUrl,
        image_1: imageUrls[0] || null,
        image_2: imageUrls[1] || null,
        image_3: imageUrls[2] || null,
        image_4: imageUrls[3] || null,
      }])
      .select()
      .single();

    if (mediasError) throw new Error(mediasError.message);
    toast.success("✅ Médias enregistrés !", { id: toastId });

    toast.loading("📍 Enregistrement de la localisation...", { id: toastId });
    const localisationData = formData.localisation;
    const { data: localisationResult, error: localisationError } = await supabase
      .from("localisation")
      .insert([localisationData])
      .select()
      .single();

    if (localisationError) throw new Error(localisationError.message);
    toast.success("✅ Localisation enregistrée !", { id: toastId });

    const {
      imageFiles, videoFile, localisation,
      ...otherformData
    } = formData;

    const conceptionToInsert = {
      ...otherformData,
      medias: mediasData.id,
      localisation: localisationResult.id,
    };

    toast.loading("🏠 Enregistrement de la conception...", { id: toastId });
    const { data: bienResult, error: bienError } = await supabase
      .from("conception_architecture")
      .insert([conceptionToInsert])
      .select();

    if (bienError) throw new Error(bienError.message);

    toast.success("🎉 Conception ajouté avec succès !", { id: toastId });
    return bienResult;

  } catch (error: any) {
    console.error("Erreur lors de l'ajout du Conception :", error);
    toast.error(`❌ ${error.message || "Une erreur est survenue."}`, { id: toastId });
    throw error;
  }
};


const fetchConception = async () => {
  const { data, error } = await supabase.from('conception_architecture').select('*, localisation(*), medias(*)');
  if (error) throw new Error(error.message);
  return data
}

const fetchConceptionById = async (id: string) => {
  const { data, error } = await supabase.from('conception_architecture').select('*, localisation(*), medias(*)').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data
}

const updateConception = async ({id, conceptionData}: {id: number, conceptionData: CledorFormValues}) => {
  const toastId = toast.loading("📤 Upload de la vidéo en cours...");

  try {
    let videoUrl: string | null = null;

    if (conceptionData.videoFile) {
      const uploadResult = await uploadFileToSupabase(conceptionData.videoFile, 'biens');
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "Erreur lors de l'upload de la vidéo.");
      }
      videoUrl = uploadResult.url;
      toast.success("✅ Vidéo uploadée avec succès !", { id: toastId });
    } else {
      toast.info("ℹ️ Aucune vidéo à uploader.", { id: toastId });
    }

    toast.loading("📤 Upload des images en cours...", { id: toastId });
    const imageUrls: string[] = [];

    // for (let i = 0; i < conceptionData.imageFiles.length; i++) {
    //   toast.loading(`📷 Upload de l'image ${i + 1}...`, { id: toastId });
    //   const result = await uploadFileToSupabase(conceptionData.imageFiles[i], 'biens');
    //   if (!result.success || !result.url) {
    //     throw new Error(result.error || `Erreur lors de l'upload de l'image ${i + 1}`);
    //   }
    //   imageUrls.push(result.url);
    // }
    for (let i = 0; i < conceptionData.imageFiles.length; i++) {
      const fileOrUrl = conceptionData.imageFiles[i];
      
      if (fileOrUrl instanceof File) {
        // Case 1: It's a File → Upload to Supabase
        toast.loading(`📷 Upload de l'image ${i + 1}...`, { id: toastId });
        const result = await uploadFileToSupabase(fileOrUrl, 'biens'); // Note: Only pass the File, not the whole array
        if (!result.success || !result.url) {
          throw new Error(result.error || `Erreur lors de l'upload de l'image ${i + 1}`);
        }
        imageUrls.push(result.url);
      } else {
        // Case 2: It's a string → Assume it's already a URL
        imageUrls.push(fileOrUrl);
      }
    }

    toast.success("✅ Images uploadées avec succès !", { id: toastId });

    toast.loading("🗂️ Enregistrement des médias...", { id: toastId });
    const { data: mediasData, error: mediasError } = await supabase
      .from("medias")
      .insert([{
        video: videoUrl,
        image_1: imageUrls[0] || null,
        image_2: imageUrls[1] || null,
        image_3: imageUrls[2] || null,
        image_4: imageUrls[3] || null,
      }])
      .select()
      .single();

    if (mediasError) throw new Error(mediasError.message);
    toast.success("✅ Médias enregistrés !", { id: toastId });

    toast.loading("📍 Enregistrement de la localisation...", { id: toastId });
    const localisationData = conceptionData.localisation;
    const { data: localisationResult, error: localisationError } = await supabase
      .from("localisation")
      .insert([localisationData])
      .select()
      .single();

    if (localisationError) throw new Error(localisationError.message);
    toast.success("✅ Localisation enregistrée !", { id: toastId });

    const {
      imageFiles, videoFile, localisation,
      ...otherformData
    } = conceptionData;

    const conceptionToInsert = {
      ...otherformData,
      medias: mediasData.id,
      localisation: localisationResult.id,
    };

    toast.loading("🏠 Enregistrement de la conception...", { id: toastId });
    const { data: conceptionResult, error: conceptionError } = await supabase
      .from("conception_architecture")
      .update([conceptionToInsert])
      .eq("id", id);

    if (conceptionError) throw new Error(conceptionError.message);

    toast.success("🎉 Conception ajouté avec succès !", { id: toastId });
    return conceptionResult;

  } catch (error: any) {
    console.error("Erreur lors de la modification d le conception Conception :", error);
    toast.error(`❌ ${error.message || "Une erreur est survenue."}`, { id: toastId });
    throw error;
  }
};

const deleteConception = async (id: number) => {
    const { error } = await supabase
        .from('conception_architecture')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Erreur suppression : ${error.message}`);
};


export { createConception, fetchConception, updateConception, fetchConceptionById, deleteConception }
