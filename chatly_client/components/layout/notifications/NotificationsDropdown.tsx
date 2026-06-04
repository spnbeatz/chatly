
import { NotificationDto } from "@/types/notification";
import { Badge, Dropdown } from "@heroui/react";
import { FaBell } from "react-icons/fa";
import { Header } from "@heroui/react";
import { CgUserAdd } from "react-icons/cg";
import { formatChatDate } from "@/utils/date";
import { useNotifications } from "@/api/queries/notifications/notifications.query";
import { useMarkNotificationAsRead } from "@/api/queries/notifications/notifications.mutation";

export const NotificationsDropdown = () => {
    const { data: notifications = [] } = useNotifications();
    const { mutateAsync: markAsRead } = useMarkNotificationAsRead();

    const handleNotificationClick = async (notification: NotificationDto) => {
        if (!notification.isRead) {
            try {
                await markAsRead(notification.id);
            } catch (error) {
                console.error("Error marking notification as read:", error);
                return;
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-[32px] w-[32px] rounded-full shadow-md bg-white">
            <Dropdown>
                <Dropdown.Trigger className={"flex justify-center items-center "}>
                    <Badge.Anchor>
                        <FaBell size={20} color="orange" />
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <Badge size="sm" color="danger">{notifications.filter(n => !n.isRead).length}</Badge>
                        )}
                    </Badge.Anchor>

                </Dropdown.Trigger>
                <Dropdown.Popover placement="bottom end" className={"rounded-lg"}>
                    <Dropdown.Menu>
                        <Dropdown.Section>
                            <Header className="text-md font-semibold text-black/60">Notifications {`(${notifications.filter(n => !n.isRead).length} new)`}</Header>
                            {notifications.length === 0 ? (
                                <Dropdown.Item>No notifications</Dropdown.Item>
                            ) : (
                                notifications.map((n) => {
                                    console.log(n);
                                    return <Dropdown.Item

                                        key={n.id}
                                        onPress={() => handleNotificationClick(n)}
                                        style={{
                                            fontWeight: n.isRead ? "normal" : "bold",
                                        }}
                                        className="flex flex-row items-center justify-start w-[400px] p-2 px-4 rounded-md gap-2 group"
                                    >
                                        <CgUserAdd size={20} color="orange" />
                                        <div className="flex flex-col items-start justify-center w-1/2 shrink-0">
                                            <div className="text-sm text-black/70">{n.title}</div>
                                            <div className="text-xs text-black/50">{n.description}</div>
                                        </div>
                                        <p className="ml-auto mb-auto text-xs text-black/60">{formatChatDate(n.createdAt)}</p>
                                    </Dropdown.Item>
                                })
                            )}
                        </Dropdown.Section>

                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </div>

    )
}