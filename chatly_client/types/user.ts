export type User = {
    id: string;
    avatarUrl?: string | null;
    email: string;
    role?: string;
    status?: string;
}

export type UserSearchItem = {
    id: string;
    email: string;
    requestSent: boolean;
    requestReceivedId: number | null;
    chatId?: number | null;
}

export type UserMini = {
    id: string;
    email: string;
    avatarUrl: string | null;
}

export type UserAction =
  | "invite"
  | "accept"
  | "openChat"
  | "none";

