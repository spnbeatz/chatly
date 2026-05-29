"use client";

import { Modal, Button, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { useChat } from "@/context/providers/ChatProvider";
import { useInfoModalStore } from "@/context/store/modal";
import { MdEdit } from "react-icons/md";
import { TiUserAddOutline } from "react-icons/ti";
import { useUpdateChat } from "@/api/queries/chats/chats.mutation";
import { ModalHeader } from "./ModalHeader";
import { CancelButton } from "./CancelButton";

export const ChangeChatNameModal = () => {

    const { activeChat } = useChat();

    const [nameValue, setNameValue] = useState("");

    const { mutateAsync: updateChat } = useUpdateChat();

    useEffect(() => {
        setNameValue(activeChat?.name || "");
    }, [activeChat?.name]);

    const handleSave = async () => {

        if (!activeChat) return;

        try {

            await updateChat({
                chatId: activeChat.id,
                data: {
                    name: nameValue,
                    chatPrivacy: activeChat.chatPrivacy
                }
            });

            useInfoModalStore.getState().openModal({
                title: "Success",
                description: "Chat name updated successfully.",
                type: "success",
            });

        } catch {

            useInfoModalStore.getState().openModal({
                title: "Error",
                description: "Failed to update chat name.",
                type: "error",
            });
        }
    };

    return (
        <Modal>

            <Button
                variant="outline"
                className="w-full text-black/60"
            >
                <MdEdit size={14} />
                Change chat name
            </Button>

            <Modal.Backdrop>
                <Modal.Container>

                    <Modal.Dialog>
                        <ModalHeader 
                            title="Change Chat Name" 
                            description="Please enter a new name for the chat."
                            Icon={TiUserAddOutline} 
                        />
                        <Modal.Body className="p-1">

                            <Input
                                value={nameValue}
                                onChange={(e) =>
                                    setNameValue(e.target.value)
                                }
                                placeholder="Enter new chat name"
                                variant="secondary"
                                className="w-full"
                            />

                        </Modal.Body>

                        <Modal.Footer>
                            <CancelButton />
                            <Button
                                slot="close"
                                variant="primary"
                                onClick={handleSave}
                                isDisabled={!nameValue.trim()}   
                            >
                                Save
                            </Button>

                        </Modal.Footer>

                    </Modal.Dialog>

                </Modal.Container>
            </Modal.Backdrop>

        </Modal>
    );
};