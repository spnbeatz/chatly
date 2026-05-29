import { ChatMiniDTO } from "./chat";
import { UserMini } from "./user";

export type RequestDto = {
    id: number;
    type: RequestType;
    chatId?: number;
    createdAt: string;
    fromUser: UserMini
    chatName?: string;

}

export type OutgoingRequestDto = {
    id: number;
    type: RequestType;
    createdAt: string;
    toUser: UserMini
    chatName?: string;
    chat?: ChatMiniDTO
}

export type RequestType = "FriendRequest" | "ChatInvite" | "ChatRequest";

