import { ChatMessage } from "@/types/chat";
import { UpdateMessageDTO } from "@/types/messages";
import Service from "../service";

class MessageService extends Service {
    async list(chatId: number | null): Promise<ChatMessage[]> {
        return this.get(`/message?chatId=${chatId}`);
    }

    async update(messageId: number, data: UpdateMessageDTO) {
        return this.put(`/message/${messageId}`,data);
    }

    async deleteMessage(messageId: number) {
        return this.delete(`/message/${messageId}`);
    }

    async getMessage(messageId: number) {
        return this.get(`/message/${messageId}`);
    };
}

export const messageService = new MessageService();