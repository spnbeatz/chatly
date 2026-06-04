import { useQuery } from "@tanstack/react-query";
import { userService } from "@/api/services/user.service";
import { usersKeys } from "./users.keys";
import { ChatMember } from "@/types/chat";
import { UserSearchItem } from "@/types/user";

export function useCurrentUser() {
    return useQuery({
        queryKey: usersKeys.me(),
        queryFn: () => userService.getCurrentUser()
    });
}

export function useSearchUsers(query: string, members: ChatMember[] | UserSearchItem[], currentUserId?: string) {
    return useQuery({
        queryKey: usersKeys.search(query),
        queryFn: () => userService.searchUsers(query),
        enabled: !!query,
        select: (data) =>
            data.filter(u =>
                u.id !== currentUserId &&
                !members.some(m => m.id === u.id)
            )
    });
}

export function useUserList(query?: string) {
    return useQuery({
        queryKey: usersKeys.list(query),
        queryFn: () => userService.list(query)
    });

}