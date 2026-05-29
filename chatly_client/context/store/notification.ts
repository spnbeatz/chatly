import { create } from "zustand";
import { NotificationDto } from "@/types/notification";

interface NotificationState {
  notifications: NotificationDto[];
  add: (n: NotificationDto) => void;
  setAll: (n: NotificationDto[]) => void;
  markAsRead: (id: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  add: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
    })),

  setAll: (n) => set({ notifications: n }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
}));