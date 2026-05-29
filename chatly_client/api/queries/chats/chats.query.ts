import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/api/services/chat.service";
import { chatsKeys } from "./chats.keys";
import { ChatState } from "@/types/chat";

export function useChats() {
    return useQuery({
        queryKey: chatsKeys.lists(),
        queryFn: () => chatService.list(),
        select: (data) => {
            console.log("Fetched chats:", data)
            return data.reduce((acc, chat) => {
                acc[chat.chatId] = { ...chat };
                return acc;
            }, {} as Record<number, ChatState>)
        }

    });
}

export function useChat(
    chatId: number
) {
    return useQuery({
        queryKey:
            chatsKeys.detail(chatId),
        queryFn:
            () => chatService.getChat(chatId),
        enabled: !!chatId
    });
}

export function useGroupChats(
    query: string
) {
    return useQuery({
        queryKey:
            chatsKeys.search(query),
        queryFn:
            () => chatService.getGroupChats(query),
        enabled:
            query.length > 0
    });
}

export function useChatMembers(
    chatId: number
) {
    return useQuery({
        queryKey:
            chatsKeys.members(chatId),
        queryFn:
            () => chatService.getMembers(chatId),
        enabled: !!chatId
    });
}

export function useActiveChat(chatId?: number | null) {
    return useQuery({
        queryKey: chatsKeys.detail(chatId ?? -1),
        queryFn: () => chatService.getChat(chatId!),
        enabled: !!chatId
    });
}