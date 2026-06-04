import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { messagesKeys } from "@/api/queries/messages/messages.keys";
import { chatsKeys } from "@/api/queries/chats/chats.keys";
import { ChatState } from "@/types/chat";

export function useChatRealtime(connection: any) {

    const queryClient = useQueryClient();

    useEffect(() => {

        if (!connection) return;

        const handleReceive = (msg: any) => {

            const chatId = msg.chatId;

            queryClient.setQueryData(
                messagesKeys.chat(chatId),
                (old: any) => {
                    return old ? [msg, ...old] : [msg];
                }
            );

            queryClient.setQueryData(
                chatsKeys.lists(),
                (old: Record<number, ChatState> | undefined) => {

                    if (!old) return old;

                    return {
                        ...old,

                        [chatId]: {
                            ...old[chatId],

                            lastMessage: msg,

                            unread: (old[chatId]?.unread ?? 0) + 1
                        }
                    };
                }
            );
        };

        connection.on("ReceiveMessage", handleReceive);

        return () => {
            connection.off("ReceiveMessage", handleReceive);
        };

    }, [connection, queryClient]);

    const sendMessage = async (chatId: number, content: string) => {
        if (!connection) return;

        const result = await connection.invoke(
            "SendMessage",
            chatId,
            content
        );

        console.log("Message sent, server response:", result);
    };

    return {
        sendMessage
    };
}