import { useChat } from "@/context/providers/ChatProvider";
import { ListBox, Label } from "@heroui/react";
import { TopicLastMessage } from "./TopicLastMessage";
import { ChatTopic } from "@/types/chat";

export const TopicsListItem = ({ topic }: { topic: ChatTopic }) => {
    const { openTopic } = useChat();

    return (
        <ListBox.Item key={topic.id} className="p-2 w-full rounded-md flex flex-col items-start justify-center gap-1" onClick={() => openTopic(topic.id)}>
            <div className="flex flex-row gap-1 relative">
                <Label className="font-bold text-black/70">{topic.title}</Label>
                {topic.unread > 0 && (
                    <div className="px-1 h-[16px] rounded-full flex justify-center items-center bg-danger text-white text-[10px] shrink-0">
                        {topic.unread}
                    </div>
                )}
            </div>
            <TopicLastMessage topic={topic} />
        </ListBox.Item>
    )
}