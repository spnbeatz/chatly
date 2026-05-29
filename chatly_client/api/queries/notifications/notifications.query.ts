import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/api/services/notification.service";
import { notificationsKeys } from "./notifications.keys";

export function useNotifications() {
    return useQuery({
        queryKey: notificationsKeys.list(),
        queryFn: () => notificationService.list()
    });
}