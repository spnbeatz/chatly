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

export function useChangeEmail() {
    return useMutation({
        mutationFn: ({userId, email}: {userId: string, email: string}) =>
            userService.changeEmail(
                userId,
                email
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: usersKeys.list()
            });
        }
    });
}

export function useChangeUserStatus() {
    return useMutation({
        mutationFn: ({userId, status}: {userId: string, status: "Active" | "Blocked" | "Inactive"}) => userService.changeStatus(userId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: usersKeys.list()
            });
        }
    });
}