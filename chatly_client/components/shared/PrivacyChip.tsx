import { ChatPrivacy } from "@/types/chat";
import { Chip } from "@heroui/react";

export const PrivacyChip = ({ privacy, className }: { privacy: ChatPrivacy, className?: string }) => {
    return (
        <Chip color={privacy === "Private" ? "danger" : "default"} className={`${className}`}>
            {privacy}
        </Chip>
    )
}