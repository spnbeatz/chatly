import { NotificationDto } from "@/types/notification";
import Service from "../service";

class NotificationService extends Service {
    async list(): Promise<NotificationDto[]> {
        return this.get(
            "/notification"
        );
    }

    async markAsRead(notificationId: string): Promise<void> {
        return this.post(
            `/notification/${notificationId}/read`
        );
    }
}

export const notificationService = new NotificationService();
