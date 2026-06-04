import { Spinner } from "@heroui/react";

export const Loading = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <p className="mr-2 text-gray-200">Loading</p>
            <Spinner size="lg" color="current" />
        </div>
    )
}