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
    reactions: MessageReaction[];
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

export type ReactionType = "Like" | "Dislike" | "Laugh" | "Sad" | "Angry";

export type MessageReaction = {
    id?: number;
    messageId: number;
    createdById: string;
    type: ReactionType;
};