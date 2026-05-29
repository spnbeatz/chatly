import { Modal } from "@heroui/react";
import { useState } from "react";
import { UserSearchItem } from "@/types/user";
import { Button} from "@heroui/react";
import { MdAdd } from "react-icons/md";
import { TiUserAddOutline } from "react-icons/ti";
import { UserSearchField } from "../UserSearchField";
import { useChat } from "@/context/providers/ChatProvider";
import { requestService } from "@/api/services/request.service";
import { useSearchUsers } from "@/api/queries/users/users.query";
import { useDebounce } from "@/hooks/useDebounce";
import { useCurrentUser } from "@/api/queries/auth/auth.query";
import { ModalHeader } from "@/components/shared/modals/ModalHeader";
import { CancelButton } from "./CancelButton";

export const AddMemberModal = () => {

    const [searchValue, setSearchValue] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<UserSearchItem[]>([]);

    const { data: user } = useCurrentUser();
    const { activeChat } = useChat();

    const debouncedSearch = useDebounce(searchValue, 300);

    const { data: users = [] } = useSearchUsers(
        debouncedSearch,
        activeChat?.members || [],
        user?.id
    );

    const addMember = (user: UserSearchItem) => {
        setSelectedUsers((prev) =>
            prev.some(u => u.id === user.id)
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user]
        );
    };

    const handleInvite = async () => {
        await Promise.all(
            selectedUsers.map(user =>
                requestService.sendRequest("ChatInvite", user.id, activeChat?.id)
            )
        );
    };

    const handleCloseModal = () => {
        setSearchValue("");
        setSelectedUsers([]);
    };

    return (
        <Modal onOpenChange={handleCloseModal}>
            <Button variant="outline" className="w-full mt-4 text-black/60">
                <MdAdd size={14} />
                Add Member
            </Button>

            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <ModalHeader title="Add Member" Icon={TiUserAddOutline} />
                        <Modal.Body className="p-1">
                            <UserSearchField
                                type="group"
                                users={users}
                                action={addMember}
                                value={searchValue}
                                setValue={setSearchValue}
                                selectedUsers={selectedUsers}
                            />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                variant="primary"
                                onClick={handleInvite}
                                isDisabled={!selectedUsers.length}
                            >
                                Invite
                            </Button>

                            <CancelButton />
                        </Modal.Footer>

                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};