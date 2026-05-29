import { useState } from "react";

export function useChatState() {
    const [activeChatId, setActiveChatId] =
        useState<number | null>(null);

    return {
        activeChatId,
        setActiveChatId
    };
}