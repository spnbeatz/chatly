import { create } from "zustand";

type ChatState = {
    selectedChatId: string | null;
    selectedChatTopicId: string | null;
    setSelectedChatId: (id: string | null) => void;
    setSelectedChatTopicId: (id: string | null) => void;
};

export const useChatStore = create<ChatState>((set) => ({
    selectedChatId: null,
    setSelectedChatId: (id) => set({ selectedChatId: id }),
    selectedChatTopicId: null,
    setSelectedChatTopicId: (id) => set({ selectedChatTopicId: id }),
}));