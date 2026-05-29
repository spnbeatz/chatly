import { Modal, SearchField, Label, ScrollShadow, ListBox, Avatar, Chip } from "@heroui/react";
import { useChatDetailsModalStore, useGroupFindModalStore, } from "@/context/store/modal";
import { useEffect, useState } from "react";
import { PrivacyChip } from "../PrivacyChip";
import { useDebounce } from "@/hooks/useDebounce";
import { useGroupChats } from "@/api/queries/chats/chats.query";
import { FiSearch } from "react-icons/fi";
import { ModalHeader } from "./ModalHeader";
import { CancelButton } from "./CancelButton";

export const GroupFindModal = () => {
    const { isOpen, closeModal } = useGroupFindModalStore();

    const openModal = useChatDetailsModalStore((s) => s.openModal);
    const isChatDetailsOpen = useChatDetailsModalStore((s) => s.isOpen);

    const [searchValue, setSearchValue] = useState("");

    const debouncedSearch = useDebounce(searchValue, 300);

    const { data: results = [], isLoading } = useGroupChats(debouncedSearch);

    useEffect(() => {
        if (isOpen) {
            setSearchValue("");
        }
    }, [isOpen]);


    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => {
            if (!open) {
                closeModal();
            }
        }}>

            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <ModalHeader title="Find Group" Icon={FiSearch} />
                        <Modal.Body>
                            <SearchField name="search" className="p-1" variant="secondary">
                                <Label className="text-black/60">Search group</Label>
                                <SearchField.Group>
                                    <SearchField.SearchIcon />
                                    <SearchField.Input className="w-full" placeholder="Search..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                                    <SearchField.ClearButton />
                                </SearchField.Group>
                            </SearchField>
                            <ScrollShadow className="w-full max-h-96">
                                <ListBox className="w-full h-full" selectionMode="single">
                                    {results.map((chat) => (
                                        <ListBox.Item key={chat.id} className="p-2 rounded-md w-full cursor-pointer hover:bg-gray-100 flex flex-row items-center justify-start" onClick={() => {
                                            console.log("Opening chat details for chat ID:", chat.id);
                                            console.log("isChatDetailsOpen before openModal:", isChatDetailsOpen);
                                            openModal(chat.id)
                                            console.log("isChatDetailsOpen after openModal:", isChatDetailsOpen);
                                        }}>
                                                <Avatar size="sm">
                                                    <Avatar.Fallback>{chat.name.slice(0, 2)}</Avatar.Fallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{chat.name}</span>
                                                    <span className="text-sm text-gray-500">{chat.participantsCount} members</span>
                                                </div>
                                                <PrivacyChip privacy={chat.chatPrivacy} className="ml-auto" />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </ScrollShadow>
                        </Modal.Body>
                        <Modal.Footer>
                            <CancelButton />
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}