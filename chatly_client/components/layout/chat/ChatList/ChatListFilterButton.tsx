import { Dropdown, Header, Label, ListBox } from "@heroui/react";
import { IoFilter } from "react-icons/io5";

export const ChatListFilterButton = () => {
    return (
        <Dropdown>
            <Dropdown.Trigger className="p-[4px] shrink-0 w-[24px] h-[24px]">
                <IoFilter color="#333333" size={14} />
            </Dropdown.Trigger>
        </Dropdown>
    )
}
