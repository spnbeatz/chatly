import { useQuery } from "@tanstack/react-query";
import { requestService } from "@/api/services/request.service";

export const useRequests = () => {
    return useQuery({
        queryKey: ["requests"],
        queryFn: async () => {
            const requests = await requestService.getRequests();
            return requests;
        },
        staleTime: 1000 * 60,
    })

}