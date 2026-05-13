import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { TContact } from "../types/type"
import { deleteContact, fetchContact } from "../services/contact-service"
import { toast } from "sonner"


const useAllContact= () => {
  return useQuery<TContact[]>({
    queryKey: ['contact'],
        queryFn: fetchContact,
  })
}

const useDeleteCalineHouseContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteContact(id),
    onSuccess: () => {
      toast.success("contact supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
    onError: (error: Error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
};

export {useAllContact, useDeleteCalineHouseContact }