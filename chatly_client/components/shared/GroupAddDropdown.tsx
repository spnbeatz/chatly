"use client";

import { Dropdown, Button, Modal } from "@heroui/react"
import { MdGroupAdd, MdSearch, MdAdd } from "react-icons/md";
import { useGroupCreateModalStore, useGroupFindModalStore } from "@/context/store/modal";

export const GroupAddDropdown = () => {
    const { openModal: setFindModalOpen } = useGroupFindModalStore();
    const { openModal: setCreateModalOpen } = useGroupCreateModalStore();
    return (
        <>
            <Dropdown>
                <Dropdown.Trigger>
                    <div className={"w-auto h-auto p-1 cursor-pointer"}><MdGroupAdd className="text-black/60" size={16} /></div>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <Button variant="ghost" className="w-full h-auto p-1 flex flex-row justify-start" onClick={() => setFindModalOpen()}><MdSearch className="mr-2 text-black/60" />Find Group</Button>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Button variant="ghost" className="w-full h-auto p-1 flex flex-row justify-start" onClick={() => setCreateModalOpen()}><MdAdd className="mr-2 text-black/60" />Create Group</Button>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </>

    )
}

