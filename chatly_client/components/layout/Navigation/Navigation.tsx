"use client"

import { Card, Dropdown } from "@heroui/react"
import { Avatar } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { NotificationsDropdown } from "../notifications/NotificationsDropdown";
import { RequestsModal } from "@/components/shared/modals/RequestsModal";
import { useCurrentUser } from "@/api/queries/auth/auth.query";
import { useLogout } from "@/api/queries/auth/auth.mutation";
import { UserDropdown } from "./UserDropdown";
import { RouteItem } from "./RouteItem";


export type Route = {
    name: string;
    path: string;
    onClick: () => void;
}

const routes: Route[] = [
    { name: "Home", path: "/", onClick: () => console.log("home") },
    { name: "Admin", path: "/admin", onClick: () => console.log("admin") },

]

export const Navigation = () => {
    const { data: user } = useCurrentUser();
    const pathname = usePathname();

    if (pathname === "/auth/login" || pathname === "/auth/register") {
        return null;
    }

    return (
        <Card className="w-full bg-white rounded-md flex flex-col items-start justify-start shrink-0 px-8">
            <Card.Content className="w-full flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-center gap-4">
                    {routes.map((route: Route) => {
                        if (route.name === "Admin" && user?.role !== "Admin") {
                            return null;
                        }
                        return (
                            <RouteItem key={route.name} route={route} />
                        );
                    })}
                </div>

                <div className="flex flex-row items-center justify-center gap-4">
                    <div className="flex flex-row items-center justify-center gap-2 bg-default rounded-full px-1 py-1">
                        <RequestsModal />
                        <NotificationsDropdown />
                    </div>

                    <UserDropdown />
                </div>

            </Card.Content>

        </Card>
    )
}