import { Avatar} from "@heroui/react";
import { ChatMember } from "@/types/chat";
import { MemberOptionsDropdown } from "./MemberOptionsDropdown";
import { UserAvatar } from "@/components/shared/UserAvatar";

export const MemberItem = ({ member, isAdmin }: { member: ChatMember, isAdmin: boolean }) => {
    return (
        <div className="w-full shrink-0 flex flex-row items-center justify-between px-2 py-1 hover:bg-black/5 rounded-md group relative overflow-hidden">
            <div className="flex flex-row items-center justify-center gap-2">
                <UserAvatar name={member.email} size="sm" />
                <div className="flex flex-col items-start justify-center">
                    <span className="text-sm font-medium text-black/60">{member.email}</span>
                    <span className="text-xs font-light text-black/40">{member.role}</span>
                </div>
            </div>
            <MemberOptionsDropdown member={member} isAdmin={isAdmin} />

        </div>
    )
}
