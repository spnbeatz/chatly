export const requestsKeys = {
    all: ["requests"] as const,

    incoming: () =>
        [...requestsKeys.all, "incoming"] as const,

    chat: (chatId: number) =>
        [...requestsKeys.all, "chat", chatId] as const,

    check: (chatId: number) =>
        [...requestsKeys.all, "check", chatId] as const,
    outgoing: () =>
        [...requestsKeys.all, "outgoing"] as const
};