"use client";

import { Avatar, Description, Label, ListBox, Header, Card, Button, SearchField, Dropdown } from "@heroui/react";
import { friends, groups } from "@/data/friends";
import { useChatStore } from "@/context/store/chat";
import { IoSettings, IoSearch, IoPersonAdd, IoFilter } from "react-icons/io5";
import { CgSortAz } from "react-icons/cg";

export const ChatList = () => {

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
                            <p>Friends</p>
                            <ChatListFilterButton />
                        </Header>
                        {friends.map(friend => (
                            <ChatItem key={friend.id} id={friend.id.toString()} name={friend.name} lastMessage={friend.lastMessage} lastMessageTime={friend.lastMessageTime} />
                        ))}
                    </ListBox.Section>
                    <ListBox.Section>
                        <Header className="w-full flex flex-row items-center justify-between">
                            <p>Groups</p>
                            <ChatListFilterButton />
                        </Header>
                        {groups.map(group => (
                            <ChatItem key={group.id} id={group.id.toString()} name={group.name} lastMessage={group.lastMessage} lastMessageTime={group.lastMessageTime} />
                        ))}
                    </ListBox.Section>
                </ListBox>
            </Card.Content>

            <Card.Footer>
                <Button variant="ghost" className="w-full"><IoPersonAdd className="mr-2" />New Chat</Button>
            </Card.Footer>
        </Card>

    )
}

const ChatItem = ({ id, name, lastMessage, lastMessageTime }: { id: string, name: string, lastMessage: string, lastMessageTime: string }) => {
    const { selectedChatId, setSelectedChatId } = useChatStore();
    const isSelected = selectedChatId === id;

    return (
        <ListBox.Item className={`group ${isSelected ? "bg-gray-200" : ""}`} onClick={() => setSelectedChatId(id)}>
            <Avatar size="md" />
            <div className="ml-3 flex flex-col">
                <Label className="group-hover:text-gray-400 text-black">{name}</Label>
                <Description>{lastMessage} | {lastMessageTime}</Description>
            </div>
        </ListBox.Item>
    )
}

const ChatIconButton = ({ icon }: { icon: React.ReactNode }) => {
    return (
        <Button variant="ghost" className="p-[4px] shrink-0 w-[24px] h-[24px]">
            {icon}
        </Button>
    )
}

const ChatListFilterButton = () => {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <Button variant="ghost" className="p-[4px] shrink-0 w-[24px] h-[24px]">
                    <IoFilter color="#333333" size={32} />
                </Button>
            </Dropdown.Trigger>
        </Dropdown>
    )
}
