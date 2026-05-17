"use client"

import { useChat } from "@/context/providers/ChatProvider";
import { ChatState } from "@/types/chat";
import { formatChatDate } from "@/utils/date";
import { Avatar } from "@heroui/react/avatar";
import { Badge, BadgeAnchor, Description, ListBox, Label } from "@heroui/react";
import { useEffect, useState } from "react";
import { LuDot } from "react-icons/lu";

export const ChatItem = ({ id, chat }: { id: string, chat?: ChatState }) => {

    const { openChat, activeChatId, chats } = useChat();
    const [ unreadCount, setUnreadCount ] = useState(0);

    useEffect(() => {
        const chat = chats[id];
        if (chat) {
            setUnreadCount(chat.unread);
        }
    }, [chats, id]);

    const isSelected = String(activeChatId) === id;

    const getName = () => {
        if (chat?.name && chat.name !== "Unknown") {
            return chat.name;
        } else {
            if (chat?.user) {
                return Array.isArray(chat.user) ? chat.user[0]?.email ?? "Unknown" : chat.user?.email ?? "Unknown";
            } else {
                return "Unknown";
            }
        }
    }

    if (!chat) { return null;}

    return (
        <ListBox.Item className={`group ${isSelected ? "bg-gray-200" : ""}`} onClick={() => openChat(id)}>
            <BadgeAnchor>
                <Avatar size="md">
                    <Avatar.Fallback>{getName().slice(0, 2).toUpperCase()}</Avatar.Fallback>
                </Avatar>
                <Badge placement="bottom-left" color="success" size="sm" className="border-none"></Badge>
                {unreadCount > 0 && <Badge placement='top-right' color="danger" size="sm" className="border-none">{unreadCount}</Badge>}
            </BadgeAnchor>

             <div className="ml-3 flex flex-col">
                <Label className="group-hover:text-gray-400 text-black">{getName()}</Label>
                <Description>{chat?.lastMessage !== null ? 
                    <div className="flex flex-row items-center">{chat.lastMessage.content} <LuDot className="text-sm text-black/50" /> {formatChatDate(chat.lastMessage.createdAt)}</div> 
                    : 
                    "No messages yet"}
                </Description>
            </div>
        </ListBox.Item>
    )
}