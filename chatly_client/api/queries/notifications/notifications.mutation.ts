import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/api/queries/queryClient";
import { notificationService } from "@/api/services/notification.service";
import { notificationsKeys } from "./notifications.keys";

export function useMarkNotificationAsRead() {
    return useMutation({
        mutationFn: (id: number) =>
            notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: notificationsKeys.list()
            });
        }
    });
}