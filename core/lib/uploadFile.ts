
import { createClient } from "@/lib/config/supabase";

export type UploadFileOptions = {
  bucket: string;
  folder?: string;
  file: File;
};

export type UploadResult = {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
};
const supabase = createClient()
export async function uploadFileToSupabase({
  bucket,
  folder = "",
  file,
}: UploadFileOptions): Promise<UploadResult> {

  try {
    if (!file) {
      return {
        success: false,
        error: "Aucun fichier fourni.",
      };
    }

    const extension = file.name.split(".").pop();

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = folder
      ? `${folder}/${fileName}`
      : fileName;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error(error);
      console.error(JSON.stringify(error, null, 2));
    }

    console.log(await supabase.auth.getSession());

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('data UP', data)


    return {
      success: true,
      path: filePath,
      url: data.publicUrl,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}