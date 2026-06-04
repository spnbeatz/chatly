"use client";

import { Table, Checkbox, Pagination, EmptyState, Input, Button, Chip, SearchField } from "@heroui/react";
import { useUserList } from "@/api/queries/users/users.query";
import { User } from "@/types/user";
import type { SortDescriptor, Selection } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useChangeEmail, useChangeUserStatus } from "@/api/queries/users/users.mutation";
import { useConfirmationModalStore, useUserEditModalStore } from "@/context/store/modal";
import { notificationQueue } from "@/app/providers";
import { Card } from "@heroui/react";
import { MdBlock, MdEdit } from "react-icons/md";
import { useDebounce } from "@/hooks/useDebounce";
import { IoPersonAdd } from "react-icons/io5";

const ROWS_PER_PAGE = 15;

export const UserListTable = () => {


    const { openModal } = useConfirmationModalStore();
    const { openModal: openUserEditModal } = useUserEditModalStore();
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "email",
        direction: "ascending",
    });
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const { data: users = [], isLoading } = useUserList(debouncedSearchQuery);

    const { mutateAsync: changeUserStatus } = useChangeUserStatus();

    useEffect(() => {
        console.log("Users: ", users);
    }, [users]);



    const [page, setPage] = useState(1);

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            const col = sortDescriptor.column as keyof User;

            const first = String(a[col] ?? "");
            const second = String(b[col] ?? "");

            let cmp = first.localeCompare(second);

            if (sortDescriptor.direction === "descending") {
                cmp *= -1;
            }

            return cmp;
        });
    }, [users, sortDescriptor]);

    const totalPages = Math.max(1, Math.ceil(sortedUsers.length / ROWS_PER_PAGE));
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return sortedUsers.slice(start, start + ROWS_PER_PAGE);
    }, [sortedUsers, page]);

    useEffect(() => {
        setPage(1);
    }, [sortDescriptor]);

    const start = (page - 1) * ROWS_PER_PAGE + 1;
    const end = Math.min(page * ROWS_PER_PAGE, sortedUsers.length);

    const handleBlockUser = (user: User) => {
        console.log("Blocking/unblocking user: ", user);
        openModal({
            text: user.status === "Active" ? "Are you sure you want to block this user?" : "Are you sure you want to unblock this user?",
            onConfirm: async () => {
                try {
                    if (user.status === "Blocked") {
                        await changeUserStatus({ userId: user.id, status: "Active" });
                        notificationQueue.add({
                            title: "User unblocked",
                            description: `User ${user.email} has been unblocked successfully.`,
                            variant: "success",
                        });
                    } else if (user.status === "Active") {
                        await changeUserStatus({ userId: user.id, status: "Blocked" });
                        notificationQueue.add({
                            title: "User blocked",
                            description: `User ${user.email} has been blocked successfully.`,
                            variant: "success",
                        });
                    }

                } catch (error) {
                    notificationQueue.add({
                        title: "Error",
                        description: `Failed to block user ${user.email}. ${error}`,
                        variant: "danger",
                    });
                }
            },
            variant: user.status === "Active" ? "danger" : "info"
        });
    }

    const handleEditUser = (user: User) => {
        openUserEditModal(user);
    }

    return (
        <Card className="rounded-md h-full flex flex-col justify-between">
            <Card.Header className="w-full flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold text-black/60">Users</h2>
                <div className="flex flex-row items-center justify-center gap-2">
                    <SearchField>
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input
                                placeholder="Search..."
                                value={searchQuery}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                            />
                            <SearchField.ClearButton onClick={() => setSearchQuery("")} />
                        </SearchField.Group>

                    </SearchField>
                    <Button variant="secondary" size="sm"><IoPersonAdd />Create User</Button>
                    <Button variant="danger-soft" size="sm"><MdBlock />Block Selected</Button>
                </div>
            </Card.Header>
            <Table className="rounded-md text-black/60 h-full flex flex-col justify-between">
                <Table.ScrollContainer >
                    <Table.Content
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        selectionMode="multiple"
                        className="h-full"
                    >
                        <Table.Header>
                            <Table.Column className="pr-0" isRowHeader>
                                <Checkbox aria-label="Select all" slot="selection">
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                </Checkbox>
                            </Table.Column>
                            <Table.Column allowsSorting>ID</Table.Column>
                            <Table.Column allowsSorting>Email</Table.Column>
                            <Table.Column allowsSorting>Role</Table.Column>
                            <Table.Column>Status</Table.Column>
                            <Table.Column></Table.Column>
                        </Table.Header>
                        <Table.Body items={paginatedUsers}
                            renderEmptyState={() => (
                                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                    <span className="text-sm text-muted">No results found</span>
                                </EmptyState>
                            )}
                        >
                            {(user) => (
                                <Table.Row key={user.id} >
                                    <Table.Cell className="pr-0">
                                        <Checkbox
                                            aria-label={`Select ${user.email}`}
                                            slot="selection"
                                            variant="secondary"
                                        >
                                            <Checkbox.Control>
                                                <Checkbox.Indicator />
                                            </Checkbox.Control>
                                        </Checkbox>
                                    </Table.Cell>
                                    <Table.Cell className="text-black/60">{user.id}</Table.Cell>
                                    <Table.Cell className="text-black/60">
                                        {user.email}
                                    </Table.Cell>
                                    <Table.Cell className="text-black/60">{user.role}</Table.Cell>
                                    <Table.Cell className="text-black/60">
                                        <Chip variant="soft" color={user.status == "Active" ? "success" : user.status == "Inactive" ? "default" : "danger"} size="md">
                                            {user.status}
                                        </Chip>
                                    </Table.Cell>
                                    <Table.Cell className="text-black/60 flex flex-row items-center justify-center gap-2">
                                        <Button size="sm" variant="secondary" className="text-xs px-4 py-1" onPress={() => handleEditUser(user)}><MdEdit />Edit</Button>
                                        <Button size="sm" variant={user.status === "Active" ? "danger-soft" : "secondary"} className="text-xs px-4 py-1" onPress={() => handleBlockUser(user)}><MdBlock />{user.status === "Active" ? "Block" : "Unblock"}</Button>

                                    </Table.Cell>
                                </Table.Row>
                            )}

                        </Table.Body>
                    </Table.Content>

                </Table.ScrollContainer>
                <Table.Footer className="max-h-16">
                    <Pagination size="sm">
                        <Pagination.Summary>
                            {start} to {end} of {users.length} results
                        </Pagination.Summary>
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.Previous
                                    isDisabled={page === 1}
                                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                                >
                                    <Pagination.PreviousIcon />
                                    Prev
                                </Pagination.Previous>
                            </Pagination.Item>
                            {pages.map((p) => (
                                <Pagination.Item key={p}>
                                    <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                                        {p}
                                    </Pagination.Link>
                                </Pagination.Item>
                            ))}
                            <Pagination.Item>
                                <Pagination.Next
                                    isDisabled={page === totalPages}
                                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                                >
                                    Next
                                    <Pagination.NextIcon />
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                </Table.Footer>
            </Table>
        </Card>

    )
}