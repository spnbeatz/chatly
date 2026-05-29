export type ChatUser = {
    id: string;
    email: string;
    avatarUrl: string;
};

export type ChatMessage = {
    content: string;
    createdAt: string;
    updatedAt: string;
    createdById: string;
    id: number;
    isPinned: boolean;
    status: string;
    chatId: number;
};

export type ChatTopic = {
    id: string;
    title: string;
    lastMessage: ChatMessage | null;
    unread: number;
}

export type ChatState = {
    chatId: number;
    unread: number;
    lastMessage: ChatMessage | null;
    name: string;
    user: ChatUser | ChatUser[] | null;
    type: "Direct" | "Group";
};

export type ChatMember = {
    id: string;
    email: string;
    role: string;
    avatarUrl: string;
    chatId: number;
}

export type UpdateChatDTO = {
    name: string;
    chatPrivacy: ChatPrivacy;
}

export type ShowChatDTO = {
    id: number;
    name: string;
    members: ChatMember[];
    type: string;
    createdAt: string;
    updatedAt: string;
    chatPrivacy: ChatPrivacy;
}

export type CreateChatDTO = {
    participants: string[];
    name?: string;
    chatPrivacy: ChatPrivacy;
}

export type ChatPrivacy = "Private" | "Public";

export type ChatMiniDTO = {
    id: number;
    name: string;
    chatPrivacy: ChatPrivacy;
    participantsCount: number;
}