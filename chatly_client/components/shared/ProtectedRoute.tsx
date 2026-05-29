"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/api/queries/users/users.query";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { data: user } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            router.push("/auth/login");
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