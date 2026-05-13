import supabase from '@/core/lib/supabase';

type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export async function uploadFileToSupabase(file: File, bucketName: string): Promise<UploadResult> {
  try {
    if (!file) {
      return { success: false, error: 'Aucun fichier fourni.' };
    }

    if (!bucketName) {
      return { success: false, error: 'Nom du bucket manquant.' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Échec de l'upload : ${uploadError.message}` };
    }

    // Récupérer l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      return {
        success: false,
        error: "Impossible de récupérer l'URL publique",
      };
    }

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error) {
    return {
      success: false,
      error: `Une erreur inattendue s'est produite : ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
