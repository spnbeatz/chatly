"use client"

import { ChatList } from "@/components/layout/chat/ChatList/ChatList";
import { ChatWindow } from "@/components/layout/chat/ChatWindow/ChatWindow";
import { ChatExtensions } from "@/components/layout/chat/ChatExtensions/ChatExtensions";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-row items-center justify-center font-sans p-6 gap-6">
        <ChatExtensions />
        <ChatWindow />
        <ChatList />
      </div>
    </ProtectedRoute>
  );
}
