import { Button } from "@heroui/react"

export const ChatIconButton = ({ icon }: { icon: React.ReactNode }) => {
    return (
        <Button variant="ghost" className="p-[4px] shrink-0 w-[24px] h-[24px]">
            {icon}
        </Button>
    )
}