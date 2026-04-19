"use client";

import { useEffect } from "react";
import { useUserStore } from "@/context/store/user";
import { userService } from "@/api/services/user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser } = useUserStore();

    useEffect(() => {
        const init = async () => {
            try {
                const res = await userService.getCurrentUser();
                setUser(res); // logged in
                console.log("Current user:", res);
            } catch {
                setUser(null); // not logged in
            }
        };

        init();
    }, [setUser]);

    return children;
}