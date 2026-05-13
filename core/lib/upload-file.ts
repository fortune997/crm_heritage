import supabase from "./supabase";

export async function uploadFile(file: File, folder: string, fileName: string) {
  const ext = file.name.split(".").pop();
  const filePath = `${folder}/${fileName}_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
      .from(folder)
      .upload(filePath, file);

  if (uploadError) {
      throw new Error(`Upload échoué pour ${filePath}: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage.from(folder).getPublicUrl(filePath);
  return urlData?.publicUrl ?? "";
}