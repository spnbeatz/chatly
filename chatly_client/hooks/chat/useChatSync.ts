import { useQueryClient } from "@tanstack/react-query";

export function useChatSync() {
    return useQueryClient();
}