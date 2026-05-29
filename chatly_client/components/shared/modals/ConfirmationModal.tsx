import { Modal, Button } from "@heroui/react";
import { useConfirmationModalStore } from "@/context/store/modal";
import { ModalHeader } from "./ModalHeader";
import { IoMdCheckmark } from "react-icons/io";
import { CancelButton } from "./CancelButton";

export const ConfirmationModal = () => {
    const {
        isOpen,
        modalText,
        onConfirm,
        closeModal
    } = useConfirmationModalStore();

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={closeModal}
        >
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <ModalHeader title="Confirmation" Icon={IoMdCheckmark} />
                        <Modal.Body>
                            <p>
                                {modalText || "Are you sure?"}
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <CancelButton />

                            <Button
                                variant="primary"
                                onClick={async () => {
                                    await onConfirm?.();
                                    closeModal();
                                }}
                            >
                                Confirm
                            </Button>

                        </Modal.Footer>

                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};