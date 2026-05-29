export type Message = {
    id: number;
    topicId: number;
    senderId: number;
    content: string;
    timestamp: string;
}

export type UpdateMessageDTO = {
    content: string;
    isPinned?: boolean;
}