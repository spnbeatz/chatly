import { useQuery } from "@tanstack/react-query";
import { requestService } from "@/api/services/request.service";
import { requestsKeys } from "./requests.keys";

export function useRequests() {
    return useQuery({
        queryKey: requestsKeys.incoming(),
        queryFn: () => requestService.getRequests()
    });
}

export function useChatRequests(chatId?: number | null) {
    return useQuery({
        queryKey: requestsKeys.chat(chatId ?? -1),
        queryFn: () => requestService.getChatRequests(chatId!),
        enabled: !!chatId
    });
}

export function useCheckRequest(chatId?: number | null) {
    return useQuery({
        queryKey: requestsKeys.check(chatId ?? -1),
        queryFn: () => requestService.checkRequested(chatId),
        enabled: !!chatId
    });
}

export function useOutgoingRequests() {
    return useQuery({
        queryKey: requestsKeys.outgoing(),
        queryFn: () => requestService.getOutgoingRequests()
    });
}