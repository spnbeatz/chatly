import { Modal } from "@heroui/react";
import { IconType } from "react-icons";

export const ModalHeader = ({ title, description, Icon }: { title: string, description?: string, Icon: IconType }) => {
    return (
        <Modal.Header className="text-black/60">
            <div className="flex flex-row gap-2">
                <Icon size={22} />
                <p>{title}</p>
            </div>
            {description && (
                <p className="text-xs uppercase text-black/50 px-1 mb-2">
                    {description}
                </p>
            )}
        </Modal.Header>
    )
}