"use client";

import React, { createContext, useContext, useEffect } from "react";


import { useChatState } from "@/hooks/chat/useChatState";
import { useSignalR } from "@/hooks/chat/useSignalR";
import { useChatRealtime } from "@/hooks/chat/useChatRealtime";
import { useActiveChat } from "@/api/queries/chats/chats.query";
import { ShowChatDTO } from "@/types/chat";
import { queryClient } from "@/api/queries/queryClient";

type ChatContextType = {
    activeChatId: number | null;
    setActiveChatId: (id: number | null) => void;
    sendMessage: (chatId: number, content: string) => Promise<void>;
    activeChat?: ShowChatDTO;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({
    children
}: {
    children: React.ReactNode;
}) {

    const {
        activeChatId,
        setActiveChatId
    } = useChatState();



    const { data: activeChat } = useActiveChat(activeChatId);
    const connection = useSignalR();
    const { sendMessage } = useChatRealtime(connection);

    return (
        <ChatContext.Provider
            value={{
                activeChatId,
                setActiveChatId,
                sendMessage,
                activeChat
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

// hook
export function useChat() {
    const ctx = useContext(ChatContext);

    if (!ctx) {
        throw new Error(
            "useChat must be used within ChatProvider"
        );
    }

    return ctx;
}