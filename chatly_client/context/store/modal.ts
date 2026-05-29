import { create } from "zustand";

interface ConfirmationModalState {
    isOpen: boolean;
    modalText?: string;
    onConfirm?: () => void;

    openModal: (options?: {
        text?: string;
        onConfirm?: () => void;
    }) => void;

    closeModal: () => void;
}

export const useConfirmationModalStore = create<ConfirmationModalState>((set) => ({
    isOpen: false,
    modalText: undefined,
    onConfirm: undefined,

    openModal: ({ text, onConfirm } = {}) =>
        set({
            isOpen: true,
            modalText: text,
            onConfirm,
        }),

    closeModal: () =>
        set({
            isOpen: false,
            modalText: undefined,
            onConfirm: undefined,
        }),
}));

interface InfoModalState {
    isOpen: boolean;
    title?: string;
    description?: string;
    type: "info" | "error" | "success";
    openModal: (options?: {
        title?: string;
        description?: string;
        type?: "info" | "error" | "success";
    }) => void;
    closeModal: () => void;
}

export const useInfoModalStore = create<InfoModalState>((set) => ({
    isOpen: false,
    title: undefined,
    description: undefined,
    type: "info",

    openModal: ({ title, description, type } = {}) =>
        set({
            isOpen: true,
            title,
            description,
            type,
        }),

    closeModal: () =>
        set({
            isOpen: false,
            title: undefined,
            description: undefined,
            type: "info",
        }),
}));

interface ModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useGroupCreateModalStore = create<ModalState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}));

export const useGroupFindModalStore = create<ModalState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}));

export const useSearchUserModalStore = create<ModalState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}));

interface ChatDetailsModalState {
    isOpen: boolean;
    chatId?: number;
    openModal: (chatId?: number) => void;
    closeModal: () => void;
}
export const useChatDetailsModalStore = create<ChatDetailsModalState>((set) => ({
    isOpen: false,
    chatId: undefined,
    openModal: (chatId?: number) => set({ isOpen: true, chatId }),
    closeModal: () => set({ isOpen: false, chatId: undefined }),
}));
