import { LuDot } from "react-icons/lu";
import { ChatTopic } from "@/types/chat";
import { formatChatDate } from "@/utils/date";
import { Description, Avatar } from "@heroui/react";
import { useChat } from "@/context/providers/ChatProvider";
import { useEffect } from "react";

export const TopicLastMessage = ({ topic }: { topic: ChatTopic }) => {
    const { getSenderName } = useChat();

    useEffect(() => {
        console.log("topic last message", topic.lastMessage);
    }, [topic.lastMessage]);
    if (!topic.lastMessage) return null;

    return (
        <Description className="flex flex-row gap-2 items-center">
            <Avatar size='sm' className="w-[18px] h-[18px]">
                <Avatar.Fallback className="w-full h-full text-xs">{getSenderName(topic.lastMessage.createdById).slice(0, 2).toUpperCase()}</Avatar.Fallback>
            </Avatar>
            <span className="font-bold text-xs">{getSenderName(topic.lastMessage.createdById)}</span>
            {topic.lastMessage && (
                <>
                    <span className="text-xs text-black/50">{topic.lastMessage?.content.slice(0, 30)}</span>
                    <LuDot className="text-sm text-black/50" />
                    <span className="text-xs text-black/50">{formatChatDate(topic.lastMessage?.createdAt)}</span>
                </>
            )}
        </Description>
    );
}