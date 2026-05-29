import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/api/queries/queryClient";
import { messageService } from "@/api/services/message.service";
import { messagesKeys } from "./messages.keys";
import { UpdateMessageDTO } from "@/types/messages";

export function useUpdateMessage() {
    return useMutation({
        mutationFn: ({messageId, data }: { messageId: number; data: UpdateMessageDTO}) =>
            messageService.update(messageId,data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: messagesKeys.all
            });
        }
    });
}

export function useDeleteMessage() {
    return useMutation({
        mutationFn: messageService.deleteMessage,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: messagesKeys.all
            });
        }
    });
}