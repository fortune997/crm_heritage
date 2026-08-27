import { fetchCompanies } from "@/core/services/company/compny-service";
import { TCompanies } from "@/core/types/company/type";
import { useQuery } from "@tanstack/react-query";


const useCompany = () => {
    return useQuery<TCompanies[]>({
        queryKey: ['compaanies'],
        queryFn: () => fetchCompanies(),

    });
};

export {
    useCompany
}