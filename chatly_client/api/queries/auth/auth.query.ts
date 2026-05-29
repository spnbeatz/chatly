import { useQuery } from "@tanstack/react-query";
import { userService } from "@/api/services/user.service";
import { authKeys } from "./auth.keys";


export function useCurrentUser() {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: () => userService.getCurrentUser(),
        retry: false
    });
}