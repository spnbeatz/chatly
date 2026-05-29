import { Accordion, Header, ScrollShadow } from "@heroui/react";
import { useChat } from "@/context/providers/ChatProvider";
import { MdPeople } from "react-icons/md";

import { AddMemberModal } from "@/components/shared/modals/AddMemberModal";
import { MemberItem } from "./MemberItem";

export const ChatMembersSection = ({ isAdmin }: { isAdmin: boolean }) => {
    const { activeChat } = useChat();

    return (
        <Accordion hideSeparator>
            <Accordion.Item>
                <Accordion.Heading>
                    <Accordion.Trigger>
                        <Header className="w-full flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center">
                                <MdPeople className="inline-block mr-2 text-[14px]" />
                                <span>Chat Members</span>
                            </div>
                        </Header>
                        <Accordion.Indicator />
                    </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                    <div className="px-6">
                        <ScrollShadow hideScrollBar className="max-h-[200px]">
                            {activeChat?.members.length === 0 ? (
                                <p className="text-xs text-black/60 w-full h-full flex justify-center items-center">No chat members yet!</p>
                            ) : (
                                <div className="w-full flex flex-col items-start justify-start ">
                                    {activeChat?.members.map((member) => (
                                        <MemberItem key={member.id} member={member} isAdmin={isAdmin} />
                                    ))}
                                    
                                </div>
                            )}
                        </ScrollShadow>
                        <AddMemberModal />
                    </div>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}