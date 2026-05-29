"use client"

import { Accordion, Avatar, Badge, Button, Card, Chip, Dropdown, Header, Modal, ScrollShadow } from "@heroui/react";
import { useChat } from "@/context/providers/ChatProvider";
import { MdPeopleOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import { PrivacyChip } from "@/components/shared/PrivacyChip";
import { useCurrentUser } from "@/api/queries/auth/auth.query";
import { ChatMembersSection } from "./ChatMembersSection";
import { ChatRequestsSection } from "./ChatRequestsSection";
import { ChatSettingsSection } from "./ChatSettingsSection";
import { InfoCenteredText } from "@/components/shared/InfoCenteredText";


export const ChatInsights = () => {
    const { activeChat } = useChat();
    const [isAdmin, setIsAdmin] = useState(false);
    const { data: user } = useCurrentUser();

    useEffect(() => {
        if (activeChat) {
            const currentUserId = user?.id;
            const member = activeChat.members.find(m => String(m.id) === String(currentUserId));
            setIsAdmin(member?.role === "Admin");
            console.log("Active chat id: ", activeChat.id);
        }
    }, [activeChat, user]);

    return (
        <Card className="w-[350px] shrink-0 h-full rounded-md shadow-medium bg-white dark:bg-black/80">
            <Card.Content>

                {activeChat ? (
                    <>
                        <div className="w-full flex flex-col items-center justify-center gap-4 py-10">
                            <Avatar>
                                <Avatar.Fallback>
                                    AV
                                </Avatar.Fallback>
                            </Avatar>
                            <p className="text-sm font-medium text-black/60">{activeChat?.name || "Unknown Chat"}</p>
                            <div className="flex flex-row items-center justify-between w-full px-6">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <MdPeopleOutline size={16} className="text-black/60" />
                                    <span className="text-sm text-black/60">{activeChat.members.length} members</span>
                                </div>
                                <PrivacyChip privacy={activeChat.chatPrivacy} />
                            </div>
                        </div>
                        <ScrollShadow hideScrollBar className="h-full w-full">
                            <ChatMembersSection isAdmin={isAdmin} />
                            {isAdmin && <ChatRequestsSection />}
                            <ChatSettingsSection isAdmin={isAdmin} />
                        </ScrollShadow>

                    </>


                ) : (
                    <InfoCenteredText text="Select a chat to see insights" className="h-full" />
                )}
            </Card.Content>
        </Card>
    )
}
