export const chatsKeys = {

    all: ["chats"] as const,

    lists: () =>
        [...chatsKeys.all, "list"] as const,

    listGroups: () =>
        [...chatsKeys.all, "groups"] as const,

    detail: (chatId: number | null) =>
        [...chatsKeys.all, chatId] as const,

    members: (chatId: number) =>
        [...chatsKeys.all, chatId, "members"] as const,

    search: (query: string) =>
        [...chatsKeys.all, "search", query] as const
};