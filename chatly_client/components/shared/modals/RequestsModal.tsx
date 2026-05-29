"use client";

import { Button, Modal, ScrollShadow, Tabs } from "@heroui/react";
import { MdGroupAdd } from "react-icons/md";
import { OutgoingRequestDto, RequestDto } from "@/types/request";
import { useRequests } from "@/hooks/requests";
import { useAcceptRequest, useRejectRequest } from "@/api/queries/requests/requests.mutation";
import { ModalHeader } from "./ModalHeader";
import { InfoCenteredText } from "../InfoCenteredText";
import { useOutgoingRequests } from "@/api/queries/requests/requests.query";
import { formatChatDate } from "@/utils/date";

export const RequestsModal = () => {
    const { data: requests = [], refetch } = useRequests();
    const { data: outgoingRequests = [] } = useOutgoingRequests();

    const { mutateAsync: acceptRequest } = useAcceptRequest();
    const { mutateAsync: rejectRequest } = useRejectRequest();

    const friendRequests = requests.filter(
        (r: RequestDto) => r.type === "FriendRequest"
    );

    const groupRequests = requests.filter(
        (r: RequestDto) => r.type === "ChatInvite"
    );

    return (
        <Modal onOpenChange={(open) => {
            if (open) refetch();
        }}>
            <Button variant="ghost" className="flex justify-center items-center h-[32px] w-[32px] rounded-full shadow-md bg-white">
                <MdGroupAdd size={20} color="blue" />
            </Button>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog>
                        <ModalHeader title="Requests" Icon={MdGroupAdd} />
                        <Modal.Body>
                            <Tabs>
                                <Tabs.ListContainer>
                                    <Tabs.List>
                                        <Tabs.Tab id={"friend"}>
                                            Friend Requests
                                            <Tabs.Indicator />
                                        </Tabs.Tab>
                                        <Tabs.Tab id={"group"}>
                                            Group Invites
                                            <Tabs.Indicator />
                                        </Tabs.Tab>
                                        <Tabs.Tab id={"user"}>
                                            User Requests
                                            <Tabs.Indicator />
                                        </Tabs.Tab>
                                    </Tabs.List>

                                </Tabs.ListContainer>
                                <Tabs.Panel id={"friend"}>
                                    <ScrollShadow className="h-[200px]">
                                        {friendRequests.length === 0 ? (
                                            <InfoCenteredText text="No friend requests" className="py-10" />
                                        ) : (
                                            friendRequests.map((request: RequestDto) => (
                                                <div className="flex flex-row items-center justify-between p-2 rounded-md hover:bg-default">
                                                    <p>{request.fromUser.email}</p>
                                                    <div className="flex flex-row items-center justify-center gap-2">
                                                        <Button variant="primary" size="sm" onClick={() => acceptRequest(request.id)}>Accept</Button>
                                                        <Button variant="secondary" size="sm" onClick={() => rejectRequest(request.id)}>Reject</Button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </ScrollShadow>

                                </Tabs.Panel>
                                <Tabs.Panel id={"group"}>
                                    <ScrollShadow className="h-[200px]">
                                        {groupRequests.length === 0 ? (
                                            <InfoCenteredText text="No group invites" className="py-10" />
                                        ) : (
                                            groupRequests.map((request: RequestDto) => (
                                                <div className="flex flex-row items-center justify-between p-2 rounded-md hover:bg-default">
                                                <p>{request.fromUser.email} invited you to join {request.chatName}</p>
                                                <div className="flex flex-row items-center justify-center gap-2">
                                                    <Button variant="primary" size="sm" onClick={() => acceptRequest(request.id)}>Join</Button>
                                                    <Button variant="secondary" size="sm" onClick={() => rejectRequest(request.id)}>Reject</Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    </ScrollShadow>
                                </Tabs.Panel>
                                <Tabs.Panel id={"user"}>
                                    <ScrollShadow className="h-[200px]">
                                        {outgoingRequests.length === 0 ? (

                                        <InfoCenteredText text="No user requests" className="py-10" />
                                    ) : (
                                        outgoingRequests.map((request: OutgoingRequestDto) => (
                                            <div key={request.id} className="flex flex-row items-center justify-between p-2 rounded-md hover:bg-default">
                                                <div className="flex flex-col">
                                                    <p>You sent a {request.type === "FriendRequest" ? "friend request" : "group request"} to {request.toUser.email || request.chat?.name + " group"}</p>
                                                    <div className="flex flex-row items-center justify-start gap-2">
                                                        <p className="text-xs text-black/60">{formatChatDate(request.createdAt)}</p>
                                                        <p className="text-xs text-black/60">Pending</p>
                                                    </div>

                                                </div>
                                                <Button variant="secondary" size="sm" onClick={() => rejectRequest(request.id)}>Cancel</Button>
                                            </div>
                                        ))
                                    )}
                                    </ScrollShadow>
                                </Tabs.Panel>
                            </Tabs>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}