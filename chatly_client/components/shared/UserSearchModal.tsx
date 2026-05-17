"use client"

import { chatService } from "@/api/services/chat";
import { userService } from "@/api/services/user";
import { useUserStore } from "@/context/store/user";
import { UserSearchItem } from "@/types/user";
import { Avatar, Button, Label, ListBox, Modal, ScrollShadow, SearchField } from "@heroui/react";
import { useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";

export const UserSearchModal = () => {

    const { user } = useUserStore();
    const [searchValue, setSearchValue] = useState("");
    const [users, setUsers] = useState<UserSearchItem[]>([]);


    useEffect(() => {
        if (searchValue.trim() === "") {
            setUsers([]);
            return;
        }
        const fetchUsers = async () => {
            const currentUserId = user?.id;
            const result = await userService.searchUsers(searchValue);

            setUsers(result.filter((u: UserSearchItem) => u.id !== currentUserId));
        };
        fetchUsers();
    }, [searchValue]);

    const handleCreateChat = async (userId: string) => {
        try {
            await chatService.createChat([userId]);
        } catch (error) {
            console.error("Error creating chat:", error);
        }

    }
    return (
        <Modal>
            <Button variant="ghost" className="w-full"><IoPersonAdd className="mr-2" />New Chat</Button>
            <Modal.Backdrop>
                <Modal.Container >
                    <Modal.Dialog className="max-h-[300px]">
                        <Modal.Header>Search Users</Modal.Header>
                        <Modal.Body className="p-4">
                            <SearchField className={"w-full"} variant="secondary">
                                <SearchField.Group>
                                    <SearchField.SearchIcon />
                                    <SearchField.Input className={"bg-default-100"} placeholder="Search chats..." value={searchValue} onInput={(e) => setSearchValue(e.currentTarget.value)} />
                                    <SearchField.ClearButton />
                                </SearchField.Group>
                            </SearchField>
                            <ScrollShadow>
                                <ListBox className="w-full h-full" selectionMode="single">
                                    {users.map(user => (
                                        <ListBox.Item key={user.id} className="p-2 w-full rounded-md flex flex-row items-start justify-between gap-1">
                                            <div className="flex flex-row gap-2 relative items-center">
                                                <Avatar size='sm'>
                                                    <Avatar.Fallback className="w-full h-full text-xs">{user.email.slice(0, 2).toUpperCase()}:</Avatar.Fallback>
                                                </Avatar>
                                                <Label className="font-bold text-black/70">{user.email}</Label>
                                            </div>
                                            <Button variant="primary" size="sm" onPress={() => {
                                                if (user.hasChat) {
                                                    return;
                                                }
                                                handleCreateChat(user.id);
                                            }}>{user.hasChat ? "Open Chat" : "Added"}</Button>
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </ScrollShadow>

                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>

            </Modal.Backdrop>
        </Modal>
    )
}