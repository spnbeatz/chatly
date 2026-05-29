import { Dropdown, Button } from "@heroui/react";
import { MdSettings } from "react-icons/md";
import { useConfirmationModalStore } from "@/context/store/modal";
import { ChatMember } from "@/types/chat";
import { useDeleteMember, usePromoteUser } from "@/api/queries/chats/chats.mutation";
import { useEffect } from "react";
import { useChat } from "@/context/providers/ChatProvider";

export const MemberOptionsDropdown = ({ member, isAdmin }: { member: ChatMember, isAdmin: boolean }) => {
    const { openModal } = useConfirmationModalStore();
    const { mutateAsync: deleteMember } = useDeleteMember();
    const { mutateAsync: promoteUser } = usePromoteUser();
    const { activeChatId } = useChat();

    return (
        <Dropdown>
            <Dropdown.Trigger className="absolute right-0 top-1/2 -translate-y-1/2">
                <Button variant="ghost" className={"opacity-0 bg-default group-hover:opacity-100 duration-200"}>
                    <MdSettings size={20} />
                </Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
                <Dropdown.Menu className="text-black/60">
                    <Dropdown.Item>View Profile</Dropdown.Item>
                    <Dropdown.Item>Change Name</Dropdown.Item>
                    {member.role !== "Admin" && isAdmin &&
                        <Dropdown.Item
                            onClick={() => openModal({
                                text: `Are you sure to promote user ${member.email} to Admin role?`,
                                onConfirm: () => promoteUser({ chatId: activeChatId!, memberId: member.id })
                            })}
                        >Promote to Admin</Dropdown.Item>}
                    {member.role === "Admin" && isAdmin &&
                        <Dropdown.Item
                            onClick={() => openModal({
                                text: `Are you sure to demote user ${member.email} to Member role?`,
                                onConfirm: () => promoteUser({ chatId: activeChatId!, memberId: member.id })
                            })}
                        >Demote to Member</Dropdown.Item>}
                    {isAdmin &&
                        <Dropdown.Item className="text-red-600" onClick={() => openModal({
                            text: `Are you sure you want to remove ${member.email} from the chat?`,
                            onConfirm: () => deleteMember({ chatId: activeChatId, memberId: member.id })
                        })}>
                            Remove from chat
                        </Dropdown.Item>}

                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}
