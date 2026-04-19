export type User = {
    id: string;
    avatarUrl: string | null;
    email: string;
}

export type UserSearchItem = {
    id: string;
    email: string;
    avatarUrl: string | null;
    hasChat: boolean;
}