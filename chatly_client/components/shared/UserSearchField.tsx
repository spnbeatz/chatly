import { SearchField, ScrollShadow, Avatar, ListBox, Button, Label } from "@heroui/react";
import { UserSearchItem } from "@/types/user";
import { MdClose } from "react-icons/md";

export const UserSearchField = ({ 
    type, 
    users,
    action,
    value,
    setValue,
    selectedUsers
}: { 
    type: "friend" | "group", 
    users?: UserSearchItem[],
    action: (user: UserSearchItem) => void,
    value: string,
    setValue: (value: string) => void,
    selectedUsers?: UserSearchItem[],
}) => {

    


    const getButtonText = (user: UserSearchItem) => {
        if (type === "friend") {
            if (user.chatId != null) return "Chat";
            if (user.requestReceivedId != null) return "Accept";
            if (user.requestSent) return "Invited";
        } else if (type === "group") {
            if (selectedUsers?.some(u => u.id === user.id)) return "Added";
            return "Add";
        }

        return "Invite";
    };

    const getVariant = (user: UserSearchItem) => {
        if (type === "friend") {
            if (user.chatId != null || user.requestSent) return "secondary";
            if (user.requestReceivedId != null) return "primary";
        } else if (type === "group") {
            if (selectedUsers?.some(u => u.id === user.id)) return "secondary";
            return "primary";
        }
    }
    return (
        <>

            <SearchField className={"w-full"} variant="secondary">
                <Label className="text-black/60">Users</Label>
                {selectedUsers && selectedUsers.length > 0 && (
                    <div className="flex flex-row items-center gap-1 mb-2 flex-wrap">
                        {selectedUsers.map(user => (
                            <div key={user.id} className="flex items-center gap-1 rounded-full bg-default/50 px-2 py-1">
                                <Avatar className="w-[10px] h-[10px]">
                                    <Avatar.Fallback className="w-full h-full text-[6px]">{user.email.slice(0, 2).toUpperCase()}:</Avatar.Fallback>
                                </Avatar>
                                <Label className=" text-black/70 text-xs">{user.email}</Label>
                                <MdClose className="cursor-pointer" size={12} onClick={() => action(user)} />
                            </div>
                        ))}
                    </div>
                )}
                <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search users..." value={value} onInput={(e) => setValue(e.currentTarget.value)} />
                    <SearchField.ClearButton />
                </SearchField.Group>
            </SearchField>
            <ScrollShadow className="w-full max-h-96">
                <ListBox className="w-full h-full" selectionMode="single">
                    {users && users.map(user => (
                        <ListBox.Item key={user.id} className="p-2 w-full rounded-md flex flex-row items-start justify-between gap-1">
                            <div className="flex flex-row gap-2 relative items-center">
                                <Avatar size='sm'>
                                    <Avatar.Fallback className="w-full h-full text-xs">{user.email.slice(0, 2).toUpperCase()}:</Avatar.Fallback>
                                </Avatar>
                                <Label className="font-bold text-black/70">{user.email}</Label>
                            </div>
                            <Button
                                slot={user.chatId !== null && type === "friend" ? "close" : null}
                                variant={getVariant(user)} size="sm"
                                onPress={() => action(user)}>{getButtonText(user)}</Button>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </ScrollShadow>
        </>
    )
}