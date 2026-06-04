"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/api/queries/users/users.query";
import { Loading } from "./Loading";

export const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string  }) => {
    
    const router = useRouter();
    const { data: user, isLoading } = useCurrentUser();

    useEffect(() => {
        if (isLoading) return;
        console.log(user, "user logged");
        if (user === null) {
            router.push("/auth/login");
        }
        if(role && user?.role !== role) {
            router.push("/noaccess");
        }
    }, [user, isLoading, role, router]);

    if (isLoading) {
        return <Loading />;
    }

/*     if (user === null) {
        return null;
    } */

    return <>{children}</>;
};