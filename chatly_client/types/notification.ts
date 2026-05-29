// types/notification.ts

export type NotificationType =
  | "FriendRequest"
  | "ChatInvite"
  | "Message"
  | "System";

export interface NotificationDto {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}