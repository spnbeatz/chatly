"use client"

import { Avatar, Dropdown } from "@heroui/react";
import { FaUser } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/api/queries/auth/auth.mutation";
import { useCurrentUser } from "@/api/queries/users/users.query";

export const UserDropdown = () => {
    const { data: user } = useCurrentUser();
    const { mutateAsync: logout } = useLogout();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <div className="flex flex-row items-center justify-center gap-2">
                    <Avatar>
                        <Avatar.Fallback>
                            <FaUser className="text-black/60" />
                        </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                        <span className="text-sm font-medium text-black/60">{user?.email}</span>
                        <span className="text-xs font-light text-black/40">{user?.role}</span>
                    </div>
                </div>
            </Dropdown.Trigger>
            <Dropdown.Popover>
                <Dropdown.Menu className="text-black/60">
                    <Dropdown.Item onClick={() => router.push("/profile")}>Profile</Dropdown.Item>
                    <Dropdown.Item onClick={() => router.push("/settings")}>Settings</Dropdown.Item>
                    <Dropdown.Item className="text-red-600" onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}