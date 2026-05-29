export const messagesKeys = {
    all: ["messages"] as const,

    chat: (chatId: number) =>
        [...messagesKeys.all, chatId] as const,

    detail: (messageId: number) =>
        [...messagesKeys.all, "detail", messageId] as const
};