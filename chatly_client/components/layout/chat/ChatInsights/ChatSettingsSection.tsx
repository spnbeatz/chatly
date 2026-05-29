import { Accordion, Button, Header } from "@heroui/react";
import { useChat } from "@/context/providers/ChatProvider";
import { MdSettings, MdExitToApp, MdDelete } from "react-icons/md";
import { useLeaveChat } from "@/api/queries/chats/chats.mutation";
import { useDeleteChat } from "@/api/queries/chats/chats.mutation";
import { useConfirmationModalStore, useInfoModalStore } from "@/context/store/modal";
import { ChangeChatNameModal } from "@/components/shared/modals/ChangeChatNameModal";

export const ChatSettingsSection = ({ isAdmin }: { isAdmin: boolean }) => {

    const { activeChatId, setActiveChatId } = useChat();
    const { mutateAsync: leaveChat } = useLeaveChat();
    const { mutateAsync: deleteChat } = useDeleteChat();

    const { openModal } = useConfirmationModalStore();
    const { openModal: openInfoModal } = useInfoModalStore();

    const handleLeaveChat = () => {
        openModal({
            text: "Are you sure you want to leave this chat?",
            onConfirm: async () => {

                try {
                    await leaveChat(activeChatId!);

                    openInfoModal({
                        title: "Success",
                        description: "You left the chat.",
                        type: "success",
                    });

                    setActiveChatId(null);

                } catch (e) {
                    openInfoModal({
                        title: "Error",
                        description: "Failed to leave chat.",
                        type: "error",
                    });
                }
            }
        });
    };

    const handleDeleteChat = () => {
        openModal({
            text: "Are you sure you want to delete this chat? This action cannot be undone.",

            onConfirm: async () => {

                try {
                    await deleteChat(activeChatId!);

                    openInfoModal({
                        title: "Chat Deleted",
                        description: "The chat has been deleted successfully.",
                        type: "success",
                    });

                    setActiveChatId(null);

                } catch (e) {

                    openInfoModal({
                        title: "Error",
                        description: "Failed to delete the chat. Please try again.",
                        type: "error",
                    });
                }
            }
        });
    };


    return (
        <Accordion hideSeparator>
            <Accordion.Item>
                <Accordion.Heading>
                    <Accordion.Trigger>
                        <Header className="w-full flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center">
                                <MdSettings className="inline-block mr-2 text-[14px]" />
                                <span>Settings</span>
                            </div>
                        </Header>
                        <Accordion.Indicator />
                    </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel className={"gap-2 flex flex-col"}>
                    <Button variant="outline" className="w-full text-black/60 text-left" onClick={handleLeaveChat}>
                        <MdExitToApp size={14} />
                        Leave Chat
                    </Button>
                    <ChangeChatNameModal />
                    {isAdmin && (
                        <Button variant="outline" className="w-full text-red-600/60 text-left" onClick={handleDeleteChat}>
                            <MdDelete size={14} />
                            Delete Chat
                        </Button>
                    )}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}


