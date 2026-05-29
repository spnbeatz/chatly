"use client";

import { ListBox, Header, Card, SearchField, Button } from "@heroui/react";
import { IoSettings } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";
import { InfoCenteredText } from "@/components/shared/InfoCenteredText";
import { ChatItem } from "./ChatItem";
import { ChatIconButton } from "./ChatIconButton";
import { UserSearchModal } from "@/components/shared/modals/UserSearchModal";
import { GroupAddDropdown } from "@/components/shared/GroupAddDropdown";
import { useState } from "react";
import { MdPersonAdd } from "react-icons/md";
import { useChats } from "@/api/queries/chats/chats.query";
import { ChatState } from "@/types/chat";
import { useSearchUserModalStore } from "@/context/store/modal";

export const ChatList = () => {

    const { data: chats = {} } = useChats();

    const { openModal } = useSearchUserModalStore();

    const typedChats = Object.values(chats) as ChatState[];

    return (
        <Card className="w-[350px] shrink-0 h-full rounded-md shadow-medium bg-white dark:bg-black/80">
            <Card.Header>

                <Header className="w-full flex flex-col items-center justify-center gap-4">
                    <div className="text-xl flex flex-row justify-between items-center w-full">
                        <p>Chats</p>
                        <div className="flex flex-row items-center justify-center">
                            <ChatIconButton icon={<IoSettings color="#333333" size={32} />} />
                        </div>
                    </div>
                    <SearchField className={"w-full"} variant="secondary">
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input className={"bg-default-100"} placeholder="Search chats..." />
                            <SearchField.ClearButton />
                        </SearchField.Group>
                    </SearchField>

                </Header>
            </Card.Header>

            <Card.Content>
                <ListBox className="w-full h-full" selectionMode="single">
                    <ListBox.Section>
                        <Header className="w-full flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center">
                                <FaUserFriends className="inline-block mr-2 text-[14px]" />
                                <span>Friends</span>
                            </div>
                            <div  className={"w-auto h-auto p-1 cursor-pointer"} onClick={openModal}><MdPersonAdd className="text-black/60" size={16}/></div>

                        </Header>
                        {typedChats.map((chat) => {
                            if (chat.type !== "Direct") return null;
                            return <ChatItem key={chat.chatId} chat={chat} />;
                        })}
                        {typedChats.filter((chat) => chat.type === "Direct").length === 0 ? (
                            <ListBox.Item
                                isDisabled
                                className="cursor-default hover:bg-transparent focus:bg-transparent data-[hover=true]:bg-transparent"
                            >
                                <InfoCenteredText text="No friends found!" />
                            </ListBox.Item>
                        ) : null}
                    </ListBox.Section>
                    <ListBox.Section>
                        <Header className="w-full flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center">
                                <HiMiniUserGroup className="inline-block mr-2 text-[14px]" />
                                <span>Groups</span>
                            </div>
                            <GroupAddDropdown />
                        </Header>
                        {typedChats.map((chat) => {
                            if (chat.type !== "Group") return null;
                            return <ChatItem key={chat.chatId} chat={chat} />;
                        })}
                        {typedChats.filter((chat) => chat.type === "Group").length === 0 ? (
                            <ListBox.Item
                                isDisabled
                                className="cursor-default hover:bg-transparent focus:bg-transparent data-[hover=true]:bg-transparent"
                            >
                                <InfoCenteredText text="Group chats coming soon!" />
                            </ListBox.Item>
                        ) : null}
                    </ListBox.Section>
                </ListBox>
                
            </Card.Content>
        </Card>

    )
}


