"use client";

import { Avatar, Badge, Button, Card, Description, Header, Label, ListBox, ScrollShadow } from "@heroui/react";
import { topics } from "@/data/topics";
import { useUserStore } from "@/context/store/user";
import { LuDot } from "react-icons/lu";
import { MdCategory } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { ChatIconButton } from "../ChatList/ChatIconButton";
import { BsPinAngleFill } from "react-icons/bs";
import { MdPermMedia } from "react-icons/md";
import { useState } from "react";
import { InfoCenteredText } from "@/components/shared/InfoCenteredText";
import { Message } from "@/types/messages";
import { authService } from "@/api/services/auth";
import { useChat } from "@/context/providers/ChatProvider";
import { formatChatDate } from "@/utils/date";
import { TopicsSection } from "./TopicsSection/TopicsSection";

export const ChatExtensions = () => {

    const { user, setUser } = useUserStore();
    const { activeChatTopics, openTopic } = useChat();
    const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
    const [chatMedia, setChatMedia] = useState<string[]>([]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    return (
        <Card className="w-[400px] h-full  shrink-0 rounded-md">
            <Card.Header>
                <Header>
                    <p className="text-xl">Your chat extensions</p>
                </Header>
            </Card.Header>
            <Card.Content>
                <ScrollShadow>
                    <TopicsSection />

                    <Header className="w-full flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                            <BsPinAngleFill className="inline-block mr-2 text-[14px]" />
                            <span>Pinned messages</span>
                        </div>
                    </Header>
                    {pinnedMessages.length === 0 ? (
                        <InfoCenteredText text="No pinned messages yet." />
                    ) : (
                        <ListBox selectionMode="single">
                            {pinnedMessages.map(message => (
                                <ListBox.Item key={message.id} className="p-2 w-full rounded-md flex flex-col items-start justify-center gap-1">
                                    <Description className="flex flex-row gap-1">
                                        <Avatar size='sm' className="w-[12px] h-[12px]">
                                            <Avatar.Fallback className="w-full h-full text-xs">{user?.email?.slice(0, 2).toUpperCase()}:</Avatar.Fallback>
                                        </Avatar>
                                        <span className="font-bold text-xs">{user?.email}</span>
                                        <span className="text-xs text-black/50">{message.content.slice(0, 30)}</span>
                                        <LuDot className="text-sm text-black/50" />
                                        <span className="text-xs text-black/50">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </Description>
                                </ListBox.Item>
                            ))}
                        </ListBox>

                    )}
                    <Header className="w-full flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                            <MdPermMedia className="inline-block mr-2 text-[14px]" />
                            <span>Media</span>
                        </div>
                    </Header>
                    {chatMedia.length === 0 ? (
                        <InfoCenteredText text="No media yet." />
                    ) : (
                        <ListBox selectionMode="single">
                            {chatMedia.map((media, index) => (
                                <ListBox.Item key={index} className="p-2 w-full rounded-md flex flex-col items-start justify-center gap-1">
                                    <Description className="flex flex-row gap-1">
                                        <span className="text-xs text-black/50">{media}</span>
                                    </Description>
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    )}

                </ScrollShadow>

            </Card.Content>
            <Card.Footer>
                <Button variant="secondary" className="w-full" onClick={handleLogout}>Logout</Button>
            </Card.Footer>
        </Card>
    )
}