"use client"

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

export function useSignalR() {
    const [connection, setConnection] =
        useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7119/chatHub", {
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        conn.start().then(() => {
            setConnection(conn);
        });

        return () => {
            conn.stop();
        };
    }, []);

    return connection;
}