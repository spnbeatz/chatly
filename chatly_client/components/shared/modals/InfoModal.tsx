import { Modal, Button } from "@heroui/react";
import { useInfoModalStore } from "@/context/store/modal";
import { CiCircleInfo } from "react-icons/ci";
import { MdErrorOutline, MdWarningAmber, MdInfoOutline } from "react-icons/md";
import { ModalHeader } from "./ModalHeader";

export const InfoModal = () => {
    const {
        isOpen,
        title,
        description,
        type,
        closeModal
    } = useInfoModalStore();

    const getTypeIcon = () => {
        switch (type) {
            case "info":
                return MdInfoOutline;
            case "error":
                return MdErrorOutline;
            case "success":
                return MdWarningAmber;
            default:
                return CiCircleInfo;
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={closeModal}
        >
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <ModalHeader title={title || "Information"} Icon={getTypeIcon()} />
                        <Modal.Body>
                            <p>
                                {description || "No additional information available."}
                            </p>
                        </Modal.Body>

                        <Modal.Footer className="w-full flex items-center justify-center">

                            <Button
                                variant="primary"
                                onClick={closeModal}
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