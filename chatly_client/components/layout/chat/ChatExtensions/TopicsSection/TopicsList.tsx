import { useChat } from "@/context/providers/ChatProvider";
import { ListBox } from "@heroui/react";
import { TopicsListItem } from "./TopicsListItem";

export const TopicsList = () => {
    const { activeChatTopics } = useChat();

    return (
        <ListBox selectionMode="single">
            {activeChatTopics.length > 0 && activeChatTopics && activeChatTopics.map(topic => (
                <TopicsListItem key={topic.id} topic={topic} />
            ))}
        </ListBox>
    )
}