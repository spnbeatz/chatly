import { RequestDto } from "@/types/request";
import { Avatar, Button } from "@heroui/react";
import { useAcceptRequest, useRejectRequest } from "@/api/queries/requests/requests.mutation";
import { useEffect } from "react";
import { IoClose, IoCheckmark } from "react-icons/io5";

export const ChatRequestItem = ({ request } : { request: RequestDto }) => {

    

    const { mutateAsync: acceptRequest } = useAcceptRequest(request.chatId);
    const { mutateAsync: rejectRequest } = useRejectRequest(request.chatId);

    useEffect(() => {
        console.log("Request updated: ", request);
    }, [request]);

    return (
        <div
            key={request.id}
            className="flex justify-between items-center px-2 py-1 hover:bg-black/5 rounded-md"
        >
            <div className="flex items-center gap-2">
                <Avatar size="sm">
                    <Avatar.Fallback>
                        {request.fromUser.email.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-black/60">
                        {request.fromUser.email}
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={() =>
                        acceptRequest(request.id)
                    }
                >
                    <IoCheckmark color="white" className="text-xs"/>
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                        rejectRequest(request.id)
                    }
                >
                    <IoClose className="text-xs"/>
                </Button>
            </div>
        </div>
    )
}