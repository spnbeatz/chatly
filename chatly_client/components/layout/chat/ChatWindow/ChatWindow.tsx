"use client";

import { useState } from "react";
import { Header, Avatar, TextArea } from "@heroui/react";
import { useChat } from "@/context/providers/ChatProvider";
import { useMessages } from "@/api/queries/messages/messages.query";
import { useActiveChat } from "@/api/queries/chats/chats.query";
import { MessageRow } from "./MessageRow";
import { InfoCenteredText } from "@/components/shared/InfoCenteredText";

export const ChatWindow = () => {
    const { activeChatId, sendMessage, activeChat } = useChat();
    const { data: activeChatMessages = [] } = useMessages(activeChatId);

    const [messageContent, setMessageContent] = useState("");

    const getHeader = () => {
        if (!activeChat) return "Select a chat";

        if (activeChat.name && activeChat.name !== "Unknown") {
            return activeChat.name;
        }

        const members = activeChat.members;

        if (Array.isArray(members) && members.length > 0) {
            return members[0]?.email ?? "Chat";
        }

        return "Chat";
    };

    return (
        <div className="w-full h-full bg-white dark:bg-black/80 rounded-md shadow-medium p-6 flex flex-col">
            
            {/* HEADER */}
            <Header className="w-full flex flex-row items-center justify-start">
                <Avatar className="mr-4">
                    <Avatar.Fallback>AV</Avatar.Fallback>
                </Avatar>
                <div className="text-md font-semibold">
                    {getHeader()} Chat
                </div>
            </Header>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
                {activeChatMessages.length === 0 ? (
                    <InfoCenteredText 
                        text="No messages yet. Start the conversation!" 
                        className="h-full"
                    />
                ) : (
                    activeChatMessages.map((message) => (
                        <MessageRow key={message.id} message={message} />
                    ))
                )}
            </div>

            {/* INPUT */}
            <div className="flex flex-row items-center gap-2">
                <TextArea
                    className="flex-1"
                    placeholder="Type a message..."
                    variant="secondary"
                    rows={1}
                    value={messageContent}
                    onInput={(e) => setMessageContent(e.currentTarget.value)}
                />

                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => {
                        if (!activeChatId || !messageContent.trim()) return;

                        sendMessage(activeChatId, messageContent);
                        setMessageContent("");
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};
