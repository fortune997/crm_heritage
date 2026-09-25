import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClosingFull } from "@/core/services/closing/closing-service";

export function useUpdateClosingFull() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateClosingFull,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["closing_cases"] });
      qc.invalidateQueries({ queryKey: ["closingCases"] });
    },
  });
}