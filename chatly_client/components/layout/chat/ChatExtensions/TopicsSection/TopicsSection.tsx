import { Header } from "@heroui/react"
import { MdCategory } from "react-icons/md"
import { ChatIconButton } from "../../ChatList/ChatIconButton"
import { FaPlus } from "react-icons/fa6"

import { TopicsList } from "./TopicsList"

export const TopicsSection = () => {

    return (
        <div>
            <Header className="w-full flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                    <MdCategory className="inline-block mr-2 text-[14px]" />
                    <span>Chat topics</span>
                </div>

                <ChatIconButton icon={<FaPlus color="#333333" size={16} />} />
            </Header>
            <TopicsList />
        </div>
    )
}