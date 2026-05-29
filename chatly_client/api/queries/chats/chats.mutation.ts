import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/api/queries/queryClient";
import { chatService } from "@/api/services/chat.service";
import { chatsKeys } from "./chats.keys";
import { CreateChatDTO, UpdateChatDTO } from "@/types/chat";

export function useCreateChat() {
    return useMutation({
        mutationFn: (data: CreateChatDTO) => chatService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: chatsKeys.lists()
            });
        }
    });
}

export function useUpdateChat() {
    return useMutation({
        mutationFn: ({ chatId, data }: { chatId: number; data: UpdateChatDTO;}) =>
                chatService.update(chatId, data ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: chatsKeys.detail(variables.chatId)
            });
            queryClient.invalidateQueries({
                queryKey: chatsKeys.lists()
            });
        }
    });
}

export function useDeleteChat() {
    return useMutation({
        mutationFn: (chatId: number) =>
            chatService.deleteChat(chatId),

        onSuccess: (_, chatId) => {

            queryClient.invalidateQueries({
                queryKey: chatsKeys.lists()
            });
            queryClient.removeQueries({
                queryKey: chatsKeys.detail(chatId)
            });
        }
    });
}

export function useJoinChat() {
    return useMutation({
        mutationFn: (chatId: number) => chatService.join(chatId),
        onSuccess: (_, chatId) => {
            queryClient.invalidateQueries({
                queryKey: chatsKeys.detail(chatId)
            });

            queryClient.invalidateQueries({
                queryKey: chatsKeys.lists()
            });
        }
    });
}

export function useLeaveChat() {
    return useMutation({
        mutationFn: (chatId: number) => chatService.leave(chatId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: chatsKeys.lists()
            });
        }
    });
}

export function useDeleteMember() {
    return useMutation({
        mutationFn: ({ chatId, memberId }: { chatId: number | null; memberId: string }) =>
            chatService.deleteMember(chatId, memberId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: chatsKeys.members(variables.chatId ?? -1)
            });
            queryClient.invalidateQueries({
                queryKey: chatsKeys.detail(variables.chatId)
            });
        }
    });
}

export function usePromoteUser() {
    return useMutation({
        mutationFn: ({ chatId, memberId }: { chatId: number; memberId: string }) =>
            chatService.promoteUser(chatId, memberId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: chatsKeys.members(variables.chatId)
            });
            queryClient.invalidateQueries({
                queryKey: chatsKeys.detail(variables.chatId)
            });
        }
    });
}