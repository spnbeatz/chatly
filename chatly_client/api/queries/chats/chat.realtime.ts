import { useEffect } from "react";
import { useChatSync } from "@/hooks/chat/useChatSync";
import { messagesKeys } from "@/api/queries/messages/messages.keys";
import { chatsKeys } from "@/api/queries/chats/chats.keys";

export function useChatRealtime(connection: any) {

    const queryClient = useChatSync();

    useEffect(() => {
        if (!connection) return;

        connection.on("ReceiveMessage", (msg: any) => {

            const chatId = msg.chatId;

            queryClient.setQueryData(
                messagesKeys.chat(chatId),
                (old: any) => {
                    if (!old) return [msg];
                    return [...old, msg];
                }
            );

            queryClient.setQueryData(
                chatsKeys.lists(),
                (old: any) => {
                    if (!old) return old;

                    return old.map((chat: any) =>
                        chat.chatId === chatId
                            ? {
                                ...chat,
                                lastMessage: msg,
                                unread: chat.unread + 1
                            }
                            : chat
                    );
                }
            );
        });

    }, [connection]);
}