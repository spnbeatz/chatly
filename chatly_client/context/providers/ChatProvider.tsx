"use client";
toggleReaction: (messageId: number, type: ReactionType) => Promise<void>;

import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { chatService } from "@/api/services/chat";
import { ChatState, ChatMessage, ChatTopic } from "@/types/chat";
import { useUserStore } from "../store/user";
import { ChatState, ChatMessage, ChatTopic, ReactionType } from "@/types/chat";

interface ChatProviderProps {
    children: React.ReactNode;
}

type ChatProviderValue = {
    chats: Record<string, ChatState>;
    activeChatId: number | null;
    activeTopicId: number | null;
    activeChatMessages: ChatMessage[];
    activeChatTopics: ChatTopic[];
    getSenderName: (senderId: string) => string;
    getActiveChat: () => ChatState | null;
    openChat: (chatId: string) => void;
    openTopic: (topicId: string) => void;
    sendMessage: (chatId: string, content: string) => void;
};

const ChatContext = createContext<ChatProviderValue | null>(null);

export function ChatProvider({ children }: ChatProviderProps) {
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const { user } = useUserStore();

    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
    const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>([]);
    const [activeChatTopics, setActiveChatTopics] = useState<ChatTopic[]>([]);

    const activeChatRef = useRef<number | null>(null);
    const activeTopicRef = useRef<number | null>(null);

    const [chats, setChats] = useState<Record<string, ChatState>>({});


    // 🔌 SIGNALR
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7119/chatHub", {
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        connection.on("ReceiveMessage", (msg) => {
            handleIncomingMessage(msg);
        });

        // Brak pewności gdzie to dodać (Reakcje)
        connection.on("ReactionUpdated", (reaction) => {
            handleReactionUpdated(reaction);
        });
        connection.off("ReactionUpdated");

        const start = async () => {
            try {
                await connection.start();
                console.log("SignalR connected");
            } catch (err) {
                console.error("SignalR error:", err);
            }
        };

        start();

        return () => {
            connection.off("ReceiveMessage");
            connection.stop();
        };
    }, []);

    // 📥 FETCH CHATS
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await chatService.listChats();

                const mapped: Record<string, ChatState> = res.reduce(
                    (acc: Record<number, ChatState>, chat: any) => {
                        acc[chat.chatId] = {
                            name: chat.name || 'Unknown',
                            user: chat.otherUser ?? null,
                            unread: 0,
                            lastMessage: chat.lastMessage ?? null
                        };

                        return acc;
                    },
                    {}
                );

                setChats(mapped);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        fetchChats();
    }, []);

    // 📩 INCOMING MESSAGE
    function handleIncomingMessage(msg: ChatMessage) {
        setChats((prev) => {
            const chat = prev[msg.chatId];
            if (!chat) return prev;

            return {
                ...prev,
                [msg.chatId]: {
                    ...chat,
                    lastMessage: msg,
                    unread:
                        msg.chatId === activeChatRef.current
                            ? chat.unread
                            : chat.unread + 1
                }
            };
        });

        if (msg.chatId === activeChatRef.current && msg.topicId === activeTopicRef.current) {
            setActiveChatMessages((prev) => [...prev, msg]);
            return;
        }

        if (msg.chatId === activeChatRef.current && msg.topicId !== activeTopicRef.current) {
            setActiveChatTopics((prev) =>
                prev.map((t) =>
                    Number(t.id) === msg.topicId
                        ? {
                            ...t,
                            lastMessage: msg,
                            unread: (t.unread ?? 0) + 1
                        }
                        : t
                )
            );
        }
    }

    // 📤 SEND MESSAGE
    async function sendMessage(topicId: string, content: string) {
        if (!content.trim()) return;

        await connectionRef.current?.invoke(
            "SendMessage",
            Number(topicId),
            content
        );
    }


    // 📂 OPEN CHAT
    async function openChat(chatId: string) {
        setActiveChatId(Number(chatId));
        setChats((prev) => {
            const chat = prev[chatId];
            if (!chat) return prev;
            const updated = { ...prev };
            updated[chatId] = {
                ...chat,
                unread: 0
            };
            return updated;
        }
        );
    }
    // Funkcja do reakcji
    async function toggleReaction(messageId: number, type: ReactionType) {
        await connectionRef.current?.invoke("ToggleReaction", messageId, type);
    }

    async function openTopic(topicId: string) {
        setActiveTopicId(Number(topicId));
    }

    useEffect(() => {
        if (!activeChatId) return;
        console.log("Active chat changed:", activeChatId);
        const fetchTopics = async () => {
            try {
                const res = await chatService.getChatTopics(String(activeChatId));
                setActiveChatTopics(res);
                setActiveTopicId(res[0]?.id ?? null);
                console.log("Fetched topics for chat", activeChatId, res);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();
    }, [activeChatId]);

    useEffect(() => {
        activeChatRef.current = activeChatId;
    }, [activeChatId]);



    useEffect(() => {
        console.log("Active topic changed:", activeTopicId);
        const fetchMessages = async () => {
            if (!activeChatId || !activeTopicId) return;
            try {
                const res = await chatService.getTopicMessages(String(activeTopicId));
                setActiveChatMessages(res);
                console.log("Fetched messages for topic", activeTopicId, res);
            } catch (error) {
                console.error("Error fetching messages:", error);

            }
        }
        fetchMessages();
    }, [activeTopicId]);

    useEffect(() => {
        activeTopicRef.current = activeTopicId;
    }, [activeTopicId]);

    const getSenderName = (senderId: string) => {
        if (!senderId) return "Unknownssssss";

        if (String(senderId) === String(user?.id)) return "You";

        const chat = activeChatId ? chats[String(activeChatId)] : null;
        if (!chat) return "Unknownsss";
        
        const sender = Array.isArray(chat.user)
            ? chat.user.find(u => String(u.id) === String(senderId))
            : chat.user && String(chat.user.id) === String(senderId)
                ? chat.user
                : null;

        return sender?.email ?? "sss";
    };

    const getActiveChat = () => {
        if (!activeChatId) return null;
        return chats[String(activeChatId)] ?? null;
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                activeChatId,
                activeTopicId,
                activeChatMessages,
                activeChatTopics,
                getActiveChat,
                getSenderName,
                openChat,
                openTopic,
                sendMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within ChatProvider");
    return ctx;
};

//Obsługa aktualizacji
function handleReactionUpdated(reaction: {
    messageId: number;
    createdById: string;
    type: ReactionType | null;
    removed: boolean;
}) {
    setActiveChatMessages((prev) =>
        prev.map((message) => {
            if (message.id !== reaction.messageId) return message;

            const currentReactions = message.reactions ?? [];

            const withoutUserReaction = currentReactions.filter(
                (r) => r.createdById !== reaction.createdById
            );

            if (reaction.removed || !reaction.type) {
                return {
                    ...message,
                    reactions: withoutUserReaction
                };
            }

            return {
                ...message,
                reactions: [
                    ...withoutUserReaction,
                    {
                        messageId: reaction.messageId,
                        createdById: reaction.createdById,
                        type: reaction.type
                    }
                ]
            };
        })
    );
}
