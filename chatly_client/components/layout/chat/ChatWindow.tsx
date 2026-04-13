"use client";

import { useChatStore } from "@/context/store/chat";
import { friends, groups } from "@/data/friends";
import { Header, ScrollShadow, Input, ListBox, Avatar } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/context/store/user";
import { messages } from "@/data/messages";
import InfiniteScroll from "react-infinite-scroll-component";
import { ChatTopics } from "./ChatTopics";

const chats = [...friends, ...groups];

export const ChatWindow = () => {
    const { selectedChatId } = useChatStore();
    const [scrollHeight, setScrollHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const PAGE_SIZE = 20;

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

    return (
        <div ref={containerRef} className="w-full h-full bg-white dark:bg-black/80 rounded-md shadow-medium p-4 flex flex-row items-center justify-between">
            <div className="w-full h-full flex flex-col items-center justify-between">
                <Header className="text-center"><div className="w-full h-[60px] shrink-0 bg-white">Header</div></Header>
                <div id="chat-scroll" style={{ maxHeight: scrollHeight }} className="w-full shrink-0 overflow-y-scroll flex flex-col-reverse pr-2">
                    <InfiniteScroll
                        dataLength={visibleMessages.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="chat-scroll"
                        inverse={true}
                    >
                        {visibleMessages.map((message) => (
                            <MessageRow key={message.id} message={message} />
                        ))}
                    </InfiniteScroll>

                </div>

                <div className="w-full h-[80px] flex flex-row items-center justify-between gap-2">
                    <Input className="flex-1 h-full" placeholder="Type a message..." />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Send</button>
                </div>
            </div>


        </div>
    )
}

const MessageRow = ({ message }: { message: any }) => {
    const { id, username } = useUserStore();
    const [dateVisible, setDateVisible] = useState(false);

    const toggleDate = () => {
        setDateVisible((prev) => !prev);
    }

    return (
        <div className="w-full mt-2 relative">
            <div className={`w-1/3 h-auto flex ${message.senderId === id ? "ml-auto flex-row-reverse" : "mr-auto flex-row"} gap-4 items-start justify-start`}>
                <Avatar>
                    <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                </Avatar>
                <p className="p-4 max-w-full text-xs bg-neutral-100 dark:bg-neutral-700 rounded-md text-neutral-600" onClick={toggleDate}>
                    {message.content}
                </p>

            </div>
            {dateVisible && <p className={`text-white/60 absolute text-xs ${message.senderId === id ? "right-[60px]" : "left-[60px]"} `}>{message.timestamp}</p>}
        </div>
    )
}