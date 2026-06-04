import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { UserListTable } from "@/components/shared/UserListTable";

export default function AdminPage() {
    return (
        <ProtectedRoute role="Admin">
            <div className="w-full h-full">
                <UserListTable />
            </div>

        </ProtectedRoute>
    )
}