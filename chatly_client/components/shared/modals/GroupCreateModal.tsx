import { Label, Modal, Switch, TextField } from "@heroui/react";
import { UserSearchField } from "../UserSearchField";
import { UserSearchItem } from "@/types/user";
import { useEffect, useState } from "react";
import { useGroupCreateModalStore } from "@/context/store/modal";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { notificationQueue } from "@/app/providers";
import { MdGroup, MdError } from "react-icons/md";
import { ChatPrivacy } from "@/types/chat";
import { useSearchUsers } from "@/api/queries/users/users.query";
import { useCurrentUser } from "@/api/queries/auth/auth.query";
import { useCreateChat } from "@/api/queries/chats/chats.mutation";
import { ModalHeader } from "./ModalHeader";
import { CancelButton } from "./CancelButton";

export const GroupCreateModal = () => {
    const { data: user } = useCurrentUser();


    const { mutateAsync: createChat } = useCreateChat();
    const { isOpen, closeModal } = useGroupCreateModalStore();
    const [searchValue, setSearchValue] = useState("");

    const [addedUsers, setAddedUsers] = useState<UserSearchItem[]>([]);
    const [groupName, setGroupName] = useState("");
    const [groupPrivate, setGroupPrivate] = useState<ChatPrivacy>("Public");

    const { data: users } = useSearchUsers(searchValue, addedUsers, user?.id);


    const handleAction = (user: UserSearchItem) => {
        if (addedUsers.some((u: UserSearchItem) => u.id === user.id)) {
            setAddedUsers((prev) => prev.filter((u: UserSearchItem) => u.id !== user.id));
        } else {
            setAddedUsers((prev) => [...prev, user]);
        }
    };

    const handleCloseModal = () => {
        setSearchValue("");
        setAddedUsers([]);
        setGroupName("");
        setGroupPrivate("Public");
        closeModal();
    }

    const handleCreateGroup = async () => {
        const createData = {
            participants: addedUsers.map((u) => u.id),
            name: groupName,
            chatPrivacy: groupPrivate
        }
        const result = await createChat(createData);

        if (!result) {
            notificationQueue.add({
                title: "Error",
                description: "Failed to create group.",
                indicator: <MdError size={20} color="red" />,
            })
            return;
        }

        notificationQueue.add({
            title: "Success",
            description: `Successfully created group "${groupName}".`,
            variant: "default",
            indicator: <MdGroup size={20} color="blue" />,
        })
        handleCloseModal();
    }

    useEffect(() => {
        console.log("selected private:", groupPrivate);
    }, [groupPrivate])

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => {
            if (!open) {
                handleCloseModal();
            }
        }}>

            <Modal.Backdrop isDismissable={groupName.trim() === "" && addedUsers.length === 0}>
                <Modal.Container>
                    <Modal.Dialog>
                        <ModalHeader title="Create Group" Icon={MdGroup} />
                        <Modal.Body>
                            <TextField isRequired name="name" className={"p-1"}>
                                <Label className="text-black/60">Group Name</Label>
                                <Input placeholder="Enter group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} variant="secondary" />
                            </TextField>
                            <div className="w-full flex flex-row justify-between items-center p-1">
                                <Label className="text-black/60">Set the privacy of the group</Label>
                                <Switch isSelected={groupPrivate === "Private"} onChange={(value) => setGroupPrivate(value ? "Private" : "Public")}>
                                    <Switch.Control>
                                        <Switch.Thumb>
                                            <Switch.Icon />
                                        </Switch.Thumb>
                                    </Switch.Control>
                                </Switch>
                            </div>
                            <div className="w-full p-1">
                                <UserSearchField type="group" users={users} action={handleAction} value={searchValue} setValue={setSearchValue} selectedUsers={addedUsers} />
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" isDisabled={groupName.trim() === "" || addedUsers.length < 2} onClick={handleCreateGroup}>Create</Button>
                            <CancelButton />
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}