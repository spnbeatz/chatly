import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/api/queries/queryClient";
import { requestService } from "@/api/services/request.service";
import { requestsKeys } from "./requests.keys";
import { RequestType } from "@/types/request";

export function useSendRequest() {
    return useMutation({
        mutationFn: ({
            type, toUserId, chatId
        }: {
            type: RequestType; toUserId?: string; chatId?: number;
        }) =>
            requestService.sendRequest(type, toUserId, chatId),

        onSuccess: (_, variables) => {
            if (variables.chatId) {
                queryClient.invalidateQueries({
                    queryKey: requestsKeys.all
                });

            }
            queryClient.invalidateQueries({
                queryKey: ["users", "search"]
            });
        }
    });
}

export function useAcceptRequest(chatId?: number) {
    return useMutation({
        mutationFn: (requestId: number) =>
            requestService.acceptRequest(requestId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: requestsKeys.all
            });

            queryClient.invalidateQueries({
                queryKey: ["chats"]
            });
        }
    });
}

export function useRejectRequest(chatId?: number) {
    return useMutation({
        mutationFn: (requestId: number) =>
            requestService.rejectRequest(requestId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: requestsKeys.all
            });
        }
    });
}