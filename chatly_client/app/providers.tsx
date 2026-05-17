"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/context/providers/AuthProvider";
import { ChatProvider } from "@/context/providers/ChatProvider";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ChatProvider>
                    {children}
                </ChatProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}