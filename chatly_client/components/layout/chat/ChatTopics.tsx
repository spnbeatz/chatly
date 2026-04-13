import { Card, Header } from "@heroui/react"

export const ChatTopics = () => {
    return (
        <div className="w-[300px] h-full  shrink-0 mr-6 border-r-[1px] border-r-neutral-200">
            <Card.Header>
                <Header>
                    <p className="text-xl">Chat Topics</p>
                </Header>   
            </Card.Header>
        </div>
    )
}