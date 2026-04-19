"use client";

import { useChatStore } from "@/context/store/chat";
import { friends, groups } from "@/data/friends";
import { Header, ScrollShadow, Input, ListBox, Avatar, TextArea } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/context/store/user";
import { messages } from "@/data/messages";
import InfiniteScroll from "react-infinite-scroll-component";
import { useChat } from "@/context/providers/ChatProvider";
import { ChatMessage } from "@/types/chat";

const chats = [...friends, ...groups];

export const ChatWindow = () => {
    const { chats, activeChatId, activeTopicId, sendMessage, activeChatMessages } = useChat();

    const [messageContent, setMessageContent] = useState("");

    const [scrollHeight, setScrollHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const PAGE_SIZE = 5;

    const [visibleMessages, setVisibleMessages] = useState(() =>
        messages.slice(-PAGE_SIZE) // na start ostatnie 20
    );
    const [hasMore, setHasMore] = useState(messages.length > PAGE_SIZE);

    const loadMore = () => {
        if (!hasMore) return;

        setVisibleMessages((prev) => {
            const current = prev.length;
            const nextSize = current + PAGE_SIZE;
            const start = Math.max(messages.length - nextSize, 0);
            const nextChunk = messages.slice(start, messages.length - current);

            const updated = [...prev, ...nextChunk];
            if (updated.length >= messages.length) setHasMore(false);
            return updated;
        });
    };

    useEffect(() => {
        if (containerRef.current) {
            setScrollHeight(containerRef.current.clientHeight - 200);
        }
    }, [containerRef.current]);

    useEffect(() => {
        console.log("height", scrollHeight);
    }, [scrollHeight])

    const getHeader = () => {
        if (!activeChatId) return "Select a chat";

        const chat = chats[activeChatId];
        if (!chat) return "Select a chat";

        if (chat.name) return chat.name;

        return Array.isArray(chat.user)
            ? chat.user[0]?.email ?? ""
            : chat.user?.email ?? "";
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-white dark:bg-black/80 rounded-md shadow-medium p-6 flex flex-row items-center justify-between">
            <div className="w-full h-full flex flex-col items-center justify-between">
                <Header className="text-center"><div className="w-full h-[60px] shrink-0 bg-white">{getHeader()}</div></Header>
                <div id="chat-scroll" style={{ maxHeight: scrollHeight }} className="w-full h-full shrink-0 overflow-y-scroll flex flex-col-reverse p-6">
                    <InfiniteScroll
                        dataLength={activeChatMessages.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="chat-scroll"
                        inverse={true}
                    >
                        {activeChatMessages.map((message) => (
                            <MessageRow key={message.id} message={message} />
                        ))}
                    </InfiniteScroll>

                </div>

                <div className="w-full h-[80px] flex flex-row items-center justify-between gap-2">
                    <TextArea
                        className="flex-1"
                        placeholder="Type a message..."
                        variant="secondary"
                        rows={2}
                        value={messageContent}
                        onInput={(e) => setMessageContent(e.currentTarget.value)}
                    />
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        onClick={() => {
                            if (activeTopicId && messageContent.trim()) {
                                sendMessage(String(activeTopicId), messageContent);
                                setMessageContent("");
                            }
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>


        </div>
    )
}

const MessageRow = ({ message }: { message: ChatMessage }) => {
    const { user } = useUserStore();
    const [dateVisible, setDateVisible] = useState(false);
    const [ isOwner, setIsOwner ] = useState(false);
    const { getSenderName } = useChat();

    useEffect(() => {
        setIsOwner(message.createdById === user?.id);
    }, [message.createdById, user?.id]);

    const toggleDate = () => {
        setDateVisible((prev) => !prev);
    }

    return (
        <div className="w-full mt-2 relative">
            <div className={`w-1/3 h-auto flex ${isOwner ? "ml-auto flex-row-reverse" : "mr-auto flex-row"} gap-4 items-start justify-start`}>
                <Avatar>
                    <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                </Avatar>
                <div className={`flex flex-col ${isOwner ? "items-end" : "items-start"} justify-center gap-2 p-4 max-w-full text-xs bg-neutral-100 dark:bg-neutral-700 rounded-md text-neutral-600`} onClick={toggleDate}>
                    <p className="font-semibold">{isOwner ? "You" : getSenderName(message.createdById)}</p>
                    <p className="" >
                        {message.content}
                    </p>
                </div>


            </div>
            {dateVisible && <p className={`text-white/60 absolute text-xs ${isOwner ? "right-[60px]" : "left-[60px]"} `}>{message.createdAt}</p>}
        </div>
    )
}