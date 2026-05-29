import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/api/queries/queryClient";

import { authService } from "@/api/services/auth.service";
import { authKeys } from "./auth.keys";

export function useLogin() {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) => 
            authService.login({ email, password }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: authKeys.me()
            });
        }
    });
}

export function useLogout() {
    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.clear();
        }
    });
}