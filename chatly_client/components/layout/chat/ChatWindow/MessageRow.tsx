import { ChatMessage } from "@/types/chat";
import { Avatar } from "@heroui/react";
import { formatChatDate } from "@/utils/date";
import { useState, useEffect } from "react";
import { useChat } from "@/context/providers/ChatProvider";
import { useCurrentUser } from "@/api/queries/users/users.query";
import { useActiveChat } from "@/api/queries/chats/chats.query";

export const MessageRow = ({ message }: { message: ChatMessage }) => {
    const { activeChat } = useChat();

    const { data: user } = useCurrentUser();
    const [dateVisible, setDateVisible] = useState(false);
    const [ isOwner, setIsOwner ] = useState(false);

    useEffect(() => {
        setIsOwner(message.createdById === user?.id);
    }, [message.createdById, user?.id]);

    const sender = activeChat?.members?.find(u => u.id === message.createdById);

    return (
        <div className="w-full mt-2 relative">
            <div className={`w-1/3 h-auto flex ${isOwner ? "ml-auto flex-row-reverse" : "mr-auto flex-row"} gap-4 items-start justify-start pb-4 group`}>
                <Avatar>
                    <Avatar.Fallback>AV</Avatar.Fallback>
                </Avatar>
                <div className={`flex flex-col group ${isOwner ? "items-end" : "items-start"} justify-center 
                gap-2 p-4 max-w-full text-xs bg-neutral-100 dark:bg-neutral-700 rounded-md text-neutral-600`} 
                onMouseEnter={() => setDateVisible(true)} onMouseLeave={() => setDateVisible(false)}>
                    <p className="font-semibold">{isOwner ? "You" : sender?.email ?? "Unknown"}</p>
                    <p className="" >
                        {message.content}
                    </p>
                </div>
            </div>

            {dateVisible &&<p className={` text-black/60 absolute text-xs bottom-0 duration-200 ${isOwner ? "right-[60px]" : "left-[60px]"} `}>{formatChatDate(message.createdAt)}</p>}
        </div>
    )
}