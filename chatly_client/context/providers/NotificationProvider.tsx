"use client";

import { useEffect, useRef } from "react";
import { createNotifyConnection } from "@/websocket/notifyConnection";
import { useNotificationStore } from "../store/notification";
import { NotificationDto } from "@/types/notification";
import { notificationService } from "@/api/services/notification.service";
import { toast } from "@heroui/react";
import { formatChatDate } from "@/utils/date";
import { notificationQueue } from "@/app/providers";
import { CgUserAdd } from "react-icons/cg";
import { useUserStore } from "../store/user";

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const add = useNotificationStore((s) => s.add);
    const connectionRef = useRef<any>(null);
    const { user } = useUserStore();
    useEffect(() => {
        const fetchNotifications = async () => {
            const notifications = await notificationService.list();
            useNotificationStore.setState({ notifications });
        };

        fetchNotifications();
    }, [user]);

    useEffect(() => {
        const start = async () => {
            try {
                const signalR = await import("@microsoft/signalr");

                const connection = new signalR.HubConnectionBuilder()
                    .withUrl("https://localhost:7119/notifyHub", {
                        withCredentials: true,
                    })
                    .withAutomaticReconnect()
                    .build();

                connectionRef.current = connection;

                await connection.start();

                console.log("NotifyHub connected");

                connection.on("notification", (data: NotificationDto) => {
                    add(data);
                    console.log("NEW NOTIFICATION:", data);
                    notificationQueue.add({
                        title: data.title,
                        description: `${data.description} - ${formatChatDate(data.createdAt)}`,
                        variant: "default",
                        indicator: <CgUserAdd size={20} color="orange" />,
                    })

                });

                connection.onreconnected(() => {
                    console.log("Reconnected - refetch notifications");
                });

            } catch (err) {
                console.error("SignalR error:", err);
            }
        };

        start();

        return () => {
            connectionRef.current?.off("notification");
            connectionRef.current?.stop();
        };
    }, [add]);

    return <>{children}</>;
};

export const useNotifications = () => {
    return useNotificationStore((state) => state.notifications);
};