"use client"

import { ChatInsights } from "@/components/layout/chat/ChatInsights/ChatInsights";
import { ChatList } from "@/components/layout/chat/ChatList/ChatList";
import { ChatWindow } from "@/components/layout/chat/ChatWindow/ChatWindow";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex w-full h-full flex-row items-center justify-center font-sans gap-4">
        <ChatInsights />
        <ChatWindow />
        
        <ChatList />
      </div>
    </ProtectedRoute>
  );
}
