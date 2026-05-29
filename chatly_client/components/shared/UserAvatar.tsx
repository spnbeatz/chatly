import { Avatar } from "@heroui/react";

export const UserAvatar = ({ name, src, size }: { name: string, src?: string, size?: "sm" | "md" | "lg" }) => {
    return (
        <Avatar size={size || "sm"}>
            { src ? <Avatar.Image src={src} /> : null }
            <Avatar.Fallback>{name.charAt(0).toUpperCase()}</Avatar.Fallback>
        </Avatar>
    )
}