"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ChatProvider } from "@/context/providers/ChatProvider";
import { Navigation } from "@/components/layout/Navigation/Navigation";
import { NotificationProvider } from "@/context/providers/NotificationProvider";
import { Toast, ToastQueue } from "@heroui/react";
import { queryClient } from "@/api/queries/queryClient";
import { ModalProvider } from "@/context/providers/ModalProvider";

export const notificationQueue = new ToastQueue({ maxVisibleToasts: 4 });

export const Providers = ({ children }: { children: React.ReactNode }) => {

    return (
        <QueryClientProvider client={queryClient}>
            <Toast.Provider queue={notificationQueue} placement="top end" />
            <NotificationProvider>
                <ChatProvider>
                    <div className="w-full h-full flex flex-col items-start justify-between gap-4">
                        <Navigation />
                        {children}
                    </div>
                    <ModalProvider />
                </ChatProvider>
            </NotificationProvider>
        </QueryClientProvider>
    )
}