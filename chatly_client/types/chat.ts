export type ChatUser = {
    id: string;
    email: string;
    avatarUrl: string;
};

export type ChatMessage = {
    content: string;
    createdAt: string;
    createdById: string;
    id: number;
    topicId: number;
    chatId: number;
};

export type ChatTopic = {
    id: string;
    title: string;
    lastMessage: ChatMessage | null;
    unread: number;
}

export type ChatState = {
    unread: number;
    lastMessage: ChatMessage | null;
    name: string;
    user: ChatUser | ChatUser[] | null;
};