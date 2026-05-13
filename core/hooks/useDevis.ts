import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createDevis, deleteDevis, fetchDevis, fetchDevisById, updateDevis } from "../services/devis-service"
import { TDevis } from "../types/calineTypes"



export const useDevis = () => {
  return useQuery<TDevis[]>({
    queryKey: ['devis_conception'],
    queryFn: fetchDevis
  })
}

export const useDevisById = (id: number)  => {
  return useQuery<TDevis>({
    queryKey: [ 'devis_conception', id],
    queryFn : () => fetchDevisById(id)
  })
}

export const useCreateDevis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createDevis(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devis_conception'] });
    },
  });
};

export const useUpdateDevis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      updateDevis({ id, formData }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['devis_conception'] });
      queryClient.invalidateQueries({ queryKey: ['devis_conception', data.id] });
    },
  });
};

export const useDeleteDevis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDevis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devis_conception'] });
    },
  });
};

// Hook pour télécharger un document
export const useDownloadPlan = () => {
  const downloadPlan = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      throw error;
    }
  };

  return { downloadPlan };
};