import { apiConfig } from "../config";

export const chatService = {
    async createChat(participants: string[]) {
        const response = await fetch(`${apiConfig.baseUrl}/chat`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(participants)
        });
        if (!response.ok) {
            const error = await response.text();
            throw error;
        }
        return response.json();
    },

    async listChats() {
        const response = await fetch(`${apiConfig.baseUrl}/chat/list`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            const error = await response.text();
            throw error;
        }
        return response.json();
    },

    async getChatTopics(chatId: string) {
        const response = await fetch(`${apiConfig.baseUrl}/chat/topics?chatId=${chatId}`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            const error = await response.text();
            throw error;
        }
        return response.json();
    },

    async getTopicMessages(topicId: string) {
        const response = await fetch(`${apiConfig.baseUrl}/chat/messages?topicId=${topicId}`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            const error = await response.text();
            throw error;
        }
        return response.json();

    }

}