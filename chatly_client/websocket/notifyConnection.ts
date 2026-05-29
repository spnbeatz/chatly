// websocket/notifyConnection.ts
import * as signalR from "@microsoft/signalr";

export const createNotifyConnection = () => {
    return new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:7119/notifyHub", {
            withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();
};