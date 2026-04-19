"use client";

import { useEffect } from "react";
import { useUserStore } from "@/context/store/user";
import { useRouter } from "next/navigation";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            router.push("/auth/register");
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    if (user === undefined) {
        return <div>Loading...</div>;
    }

    if (user === null) {
        return null;
    }

    return <>{children}</>;
};