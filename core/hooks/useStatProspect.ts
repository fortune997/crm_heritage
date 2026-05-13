import { useQuery } from '@tanstack/react-query';
import { countProspectsByCanal } from '../services/stat-prospect-service';

const useProspectCountByCanal = (role: string, commercialName: string, canal: string) => {
  return useQuery<number>({
    queryKey: [canal, role, commercialName],
    queryFn: () => countProspectsByCanal(role, commercialName, canal),
    enabled: !!commercialName, // la requête ne s'exécute que si commercialName est défini
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 60 * 24,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // retry: 1,
  });
};


export {
  useProspectCountByCanal
}