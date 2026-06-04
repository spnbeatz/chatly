import { Button, Input, Label, Modal } from "@heroui/react"
import { ModalHeader } from "./ModalHeader"
import { CancelButton } from "./CancelButton"
import { useUserEditModalStore } from "@/context/store/modal"
import { User } from "@/types/user"
import { useEffect, useState } from "react"

export const UserEditModal = () => {
    const { isOpen, closeModal, data } = useUserEditModalStore();
    const [editedData, setEditedData] = useState<User | undefined>(data);

    useEffect(() => {
        setEditedData(data);
    }, [data]);

    const setField = (field: keyof User, value: string) => {
        setEditedData((prev) => prev ? { ...prev, [field]: value } : prev);
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => {
            if (!open) {
                closeModal();
                setEditedData(undefined);
            }
        }}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <ModalHeader title="Edit User" />
                        <Modal.Body>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="Enter new email..." value={editedData?.email || ""} onChange={(e) => setField("email", e.target.value)} />
                            <Label htmlFor="role">Role</Label>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary">Save</Button>
                            <CancelButton />
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>

            </Modal.Backdrop>
        </Modal>
    )
}