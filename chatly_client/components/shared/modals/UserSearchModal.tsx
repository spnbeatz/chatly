"use client"

import { UserSearchItem } from "@/types/user";
import { Button, Modal } from "@heroui/react";
import { useState } from "react";
import { UserAction } from "@/types/user";
import { useChat } from "@/context/providers/ChatProvider";
import { UserSearchField } from "../UserSearchField";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchUsers } from "@/api/queries/users/users.query";
import { useCurrentUser } from "@/api/queries/auth/auth.query";
import { useSendRequest, useAcceptRequest } from "@/api/queries/requests/requests.mutation";
import { MdSearch } from "react-icons/md";
import { ModalHeader } from "./ModalHeader";
import { useSearchUserModalStore } from "@/context/store/modal";
import { CancelButton } from "./CancelButton";

export const UserSearchModal = () => {

    const { isOpen, closeModal } = useSearchUserModalStore();
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue, 300);

    const { data: user } = useCurrentUser();
    const { data: users } = useSearchUsers(debouncedSearchValue, [], user?.id);

    const { setActiveChatId: openChat } = useChat();
    const { mutateAsync: sendRequest } = useSendRequest();
    const { mutateAsync: acceptRequest } = useAcceptRequest();

    const handleUserAction = async (user: UserSearchItem) => {
        const action: UserAction =
            user.chatId != null
                ? "openChat"
                : user.requestReceivedId != null
                    ? "accept"
                    : user.requestSent
                        ? "none"
                        : "invite";

        switch (action) {
            case "openChat":
                return openChat(user.chatId || -1);
            case "accept":
                return await acceptRequest(user.requestReceivedId!);
            case "invite":
                return await sendRequest({ type: "FriendRequest", toUserId: user?.id });
            case "none":
                return;
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={() => { closeModal(); setSearchValue(""); }}>
            
            <Modal.Backdrop>
                <Modal.Container >
                    <Modal.Dialog>
                        <ModalHeader title="Search Users" Icon={MdSearch}/>
                        <Modal.Body className="p-4 flex flex-col items-start justify-start gap-2">
                            <UserSearchField type="friend" users={users} action={handleUserAction} value={searchValue} setValue={setSearchValue} />
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