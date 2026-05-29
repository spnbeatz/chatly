import { ConfirmationModal } from "@/components/shared/modals/ConfirmationModal";
import { InfoModal } from "@/components/shared/modals/InfoModal";
import { GroupFindModal } from "@/components/shared/modals/GroupFindModal";
import { GroupCreateModal } from "@/components/shared/modals/GroupCreateModal";
import { ChatDetailsModal } from "@/components/shared/modals/ChatDetailsModal";
import { UserSearchModal } from "@/components/shared/modals/UserSearchModal";

export const ModalProvider = () => {
    return (
        <>
            <ConfirmationModal />
            <InfoModal />
            <GroupFindModal />
            <GroupCreateModal />
            <ChatDetailsModal />
            <UserSearchModal />
        </>
    )
}