import { useQuery } from "@tanstack/react-query";
import { messageService } from "@/api/services/message.service";
import { messagesKeys } from "./messages.keys";

export function useMessages(chatId: number | null) {
    return useQuery({
        queryKey: messagesKeys.chat(chatId ?? -1),
        queryFn: () => messageService.list(chatId),
        enabled: !!chatId
    });
}

export function useMessage(messageId: number) {
    return useQuery({
        queryKey: messagesKeys.detail(messageId),
        queryFn: () => messageService.getMessage(messageId),
        enabled: !!messageId
    });
}