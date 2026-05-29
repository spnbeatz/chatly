import { Accordion, Badge, Button, Header, Avatar, ScrollShadow } from "@heroui/react";
import { useChat } from "@/context/providers/ChatProvider";
import { MdGroupAdd } from "react-icons/md";
import { useChatRequests } from "@/api/queries/requests/requests.query";
import { ChatRequestItem } from "./ChatRequestItem";

export const ChatRequestsSection = () => {

    const { activeChatId } = useChat();

    const { data: requests = [] } = useChatRequests(activeChatId);

    return (
        <Accordion hideSeparator>
            <Accordion.Item>
                <Accordion.Heading>
                    <Accordion.Trigger>
                        <Header className="w-full flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center">
                                <MdGroupAdd className="mr-2 text-[14px]" />
                                <span>Chat Requests</span>

                                {requests.length > 0 && (
                                    <p className="text-xs text-black/60 ml-1">{requests.length}</p>
                                )}
                            </div>
                        </Header>
                        <Accordion.Indicator />
                    </Accordion.Trigger>
                </Accordion.Heading>

                <Accordion.Panel className="px-6">
                    <ScrollShadow hideScrollBar className="max-h-[150px]">
                        {requests.length === 0 ? (
                            <p className="text-xs text-black/60 w-full flex justify-center items-center py-[15px]">
                                No chat requests yet!
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {requests.map((request) => (
                                    <ChatRequestItem key={request.id} request={request} />
                                ))}
                            </div>
                        )}
                    </ScrollShadow>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};