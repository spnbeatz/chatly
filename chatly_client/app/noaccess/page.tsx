import { Card } from "@heroui/react";

export default function NoAccessPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <Card className="p-6">
                <Card.Content className="w-full flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold text-black/60">Access Denied</h1>
                    <p className="text-gray-600">You do not have permission to access this page.</p>
                </Card.Content>
            </Card>
        </div>
    )
}