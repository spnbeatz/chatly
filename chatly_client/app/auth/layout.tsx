import { Card } from "@heroui/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <Card className="w-[400px] p-10 rouded-md bg-white shadow-sm">
                {children}
            </Card>
            
        </div>
    );
}