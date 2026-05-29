import { RequestType, RequestDto, OutgoingRequestDto } from "@/types/request";
import Service from "../service";

class RequestService extends Service {
    async sendRequest(type: RequestType, toUserId?: string, chatId?: number) {
        return this.post("/request", {
            type,
            toUserId,
            chatId
        });
    }

    async getRequests(): Promise<RequestDto[]> {
        return this.get("/request/incoming");
    }

    async getChatRequests(chatId: number): Promise<RequestDto[]> {
        return this.get(
            `/request/incoming/chat?chatId=${chatId}`
        );
    }

    async getOutgoingRequests(): Promise<OutgoingRequestDto[]> {
        return this.get("/request/outgoing");
    }

    async checkRequested(chatId?: number | null): Promise<{ id: number, type: RequestType } | null> {
        return this.get(
            `/request/check?chatId=${chatId}`
        );
    }

    async acceptRequest(requestId: number): Promise<{ success: boolean, chatId: number }> {
        return this.post(`/request/${requestId}/accept`);
    }

    async rejectRequest(requestId: number): Promise<{ message: string }> {
        return this.post(`/request/${requestId}/reject`);
    }


}

export const requestService = new RequestService();