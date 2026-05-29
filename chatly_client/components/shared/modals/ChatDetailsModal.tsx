import { Modal, Avatar, Button } from "@heroui/react";
import { useChatDetailsModalStore } from "@/context/store/modal";
import { MdPeopleOutline } from "react-icons/md";
import { PrivacyChip } from "../PrivacyChip";
import { useActiveChat } from "@/api/queries/chats/chats.query";
import { useCheckRequest } from "@/api/queries/requests/requests.query";
import { useSendRequest, useAcceptRequest, useRejectRequest } from "@/api/queries/requests/requests.mutation";
import { useJoinChat } from "@/api/queries/chats/chats.mutation";
import { CancelButton } from "./CancelButton";


export const ChatDetailsModal = () => {

    const {
        isOpen,
        closeModal,
        chatId
    } = useChatDetailsModalStore();

    const { data: chat } = useActiveChat(chatId);
    const { data: requestStatus } = useCheckRequest(chatId);

    const { mutateAsync: sendRequest } = useSendRequest();
    const { mutateAsync: acceptRequest } = useAcceptRequest(chatId);
    const { mutateAsync: rejectRequest } = useRejectRequest(chatId);
    const { mutateAsync: joinChat } = useJoinChat();

    const handleAction = async () => {

        if (!chat) return;

        if (requestStatus?.type === "ChatInvite") {
            await acceptRequest(requestStatus.id);
            return;
        }

        if (requestStatus?.type === "ChatRequest") {
            await rejectRequest(requestStatus.id);
            return;
        }

        if (chat.chatPrivacy === "Private") {
            await sendRequest({
                type: "ChatRequest",
                toUserId: undefined,
                chatId: chat.id
            });

            return;
        }
        await joinChat(chat.id);
    };

    const getActionButtonText = () => {

        if (!chat)
            return "Join Chat";

        if (requestStatus?.type === "ChatInvite")
            return "Accept Invite";

        if (requestStatus?.type === "ChatRequest")
            return "Cancel Request";

        if (chat.chatPrivacy === "Private")
            return "Request to join";

        return "Join Chat";
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal();
                }
            }}
        >
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>

                        <Modal.Body
                            className="flex flex-row items-center justify-start gap-4 w-full"
                        >

                            <Avatar className="w-[64px] h-[64px]">
                                <Avatar.Fallback>
                                    {chat?.name?.slice(0, 2)}
                                </Avatar.Fallback>
                            </Avatar>

                            <div className="flex flex-col items-start justify-start w-full">

                                <div className="flex items-center gap-2 w-full">

                                    <p className="text-lg font-semibold">
                                        {chat?.name}
                                    </p>

                                    <PrivacyChip
                                        privacy={
                                            chat?.chatPrivacy || "Public"
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdPeopleOutline
                                        size={16}
                                        className="text-black/60"
                                    />

                                    <span className="text-sm text-black/60">
                                        {chat?.members.length} members
                                    </span>
                                </div>

                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <CancelButton />
                            <Button
                                variant={
                                    requestStatus
                                        ? "secondary"
                                        : "primary"
                                }
                                size="sm"
                                className="ml-2"
                                onClick={handleAction}
                            >
                                {getActionButtonText()}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};