import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/api/queries/queryClient";
import { userService } from "@/api/services/user.service";
import { usersKeys } from "./users.keys";
import { RegisterFormData } from "@/utils/validation";

export function useUpdateUser() {
    return useMutation({
        mutationFn: ({userId, data}: {userId: string, data: any}) =>
            userService.updateUser(
                userId,
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: usersKeys.me()
            });
        }
    });
}


export function useRegisterUser() {
    return useMutation({
        mutationFn: (data: RegisterFormData) =>
            userService.registerUser(data),
    });
}