"use client";

import { ListBox, Header, Card,  SearchField } from "@heroui/react";
import { IoSettings } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";
import { useChat } from "@/context/providers/ChatProvider";
import { InfoCenteredText } from "@/components/shared/InfoCenteredText";
import { ChatItem } from "./ChatItem";
import { ChatIconButton } from "./ChatIconButton";
import { ChatListFilterButton } from "./ChatListFilterButton";
import { UserSearchModal } from "@/components/shared/UserSearchModal";

export const ChatList = () => {

    const { chats } = useChat();

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

                            <ChatListFilterButton/>
                        </Header>
                        {Object.entries(chats).map(([chatId, chat]) => (
                            <ChatItem key={chatId} id={chatId} chat={chat} />
                        ))}
                    </ListBox.Section>
                    <ListBox.Section>
                        <Header className="w-full flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center">
                                <HiMiniUserGroup className="inline-block mr-2 text-[14px]" />
                                <span>Groups</span>
                            </div>
                            <ChatListFilterButton />
                        </Header>
{/*                         {[groups].map(group => (
                            <ChatItem key={group.id} id={group.id.toString()} chat={undefined} />
                        ))} */}
                        <ListBox.Item
                            isDisabled
                            className="cursor-default hover:bg-transparent focus:bg-transparent data-[hover=true]:bg-transparent"
                        >
                            <InfoCenteredText text="Group chats coming soon!" />
                        </ListBox.Item>
                    </ListBox.Section>
                </ListBox>
            </Card.Content>

            <Card.Footer>
                <UserSearchModal />
            </Card.Footer>
        </Card>

    )
}


