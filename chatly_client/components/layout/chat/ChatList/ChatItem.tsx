"use client"

import { useChat } from "@/context/providers/ChatProvider";
import { ChatState } from "@/types/chat";
import { formatChatDate } from "@/utils/date";
import { Avatar } from "@heroui/react/avatar";
import { Badge, BadgeAnchor, Description, ListBox, Label } from "@heroui/react";
import { LuDot } from "react-icons/lu";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useEffect } from "react";

export const ChatItem = ({ chat }: { chat: ChatState }) => {

    const { activeChatId, setActiveChatId } = useChat();

    const isSelected = activeChatId === chat.chatId;

    useEffect(() => {
        console.log("Selected chat: ", chat);
    }, [chat])

    const getName = () => {
        if (chat.name && chat.name !== "Unknown") {
            return chat.name;
        }

        if (chat.user) {
            return Array.isArray(chat.user)
                ? chat.user[0]?.email ?? "Unknown"
                : chat.user?.email ?? "Unknown";
        }

        return "Unknown";
    };

    return (
        <ListBox.Item
            className={`group ${isSelected ? "bg-gray-200" : ""}`}
            onClick={() => setActiveChatId(chat.chatId)}
        >
            <BadgeAnchor>
                <UserAvatar name={getName()} size="md" />
                {chat.unread > 0 && (
                    <Badge
                        placement="top-right"
                        color="danger"
                        size="sm"
                    >
                        {chat.unread}
                    </Badge>
                )}
            </BadgeAnchor>

            <div className="ml-3 flex flex-col">
                <Label className="group-hover:text-gray-400 text-black">
                    {getName()}
                </Label>

                <Description>
                    {chat.lastMessage ? (
                        <div className="flex flex-row items-center">
                            {chat.lastMessage.content}
                            <LuDot className="text-sm text-black/50" />
                            {formatChatDate(chat.lastMessage.createdAt)}
                        </div>
                    ) : (
                        "No messages yet"
                    )}
                </Description>
            </div>
        </ListBox.Item>
    );
};