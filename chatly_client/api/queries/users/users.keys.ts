export const usersKeys = {
    all: ["users"] as const,
    me: () => [...usersKeys.all, "me"] as const,
    search: (q: string) =>
        [...usersKeys.all, "search", q] as const,
    list: (q?: string) =>
        [...usersKeys.all, "list"] as const
};