import { Label } from "@heroui/react"

export const InputLabel = ({text}: {text: string}) => {
    return (
        <Label className="text-sm text-neutral-500">{text}</Label>
    )
}