import {
    ChatMiniDTO,
    CreateChatDTO,
    ShowChatDTO,
    UpdateChatDTO,
    ChatState,
    ChatMember,
} from "@/types/chat";
import Service from "../service";

class ChatService extends Service {
    async getChat(chatId: number): Promise<ShowChatDTO> {
        return this.get(`/chat/${chatId}`);
    }

    async getGroupChats(nameQuery: string): Promise<ChatMiniDTO[]> {
        return this.get(
            `/chat/group?name=${encodeURIComponent(nameQuery)}`
        );
    }

    async create(createData: CreateChatDTO) {
        return this.post("/chat", createData);
    }

    async update(chatId: number, data: UpdateChatDTO) {
        return this.put(`/chat/${chatId}`, data);
    }

    async deleteChat(chatId: number) {
        return this.delete(`/chat/${chatId}`);
    }

    async list(): Promise<ChatState[]> {
        return this.get("/chat");
    }

    async listGroup() {
        return this.get("/chat/list/groups");
    }

    async getMembers(chatId: number): Promise<ChatMember[]> {
        return this.get(`/chat/${chatId}/members`);
    }

    async leave(chatId: number) {
        return this.delete(`/chat/${chatId}/leave`);
    }

    async join(chatId: number) {
        return this.post(`/chat/${chatId}/join`);
    }

    async deleteMember(chatId: number | null, memberId: string) {
        return this.delete(`/chat/${chatId}/participants/${memberId}`);
    }

    async promoteUser(chatId: number, memberId: string) {
        return this.put(`/chat/${chatId}/participants/${memberId}/promote`);
    }
}

export const chatService = new ChatService();
