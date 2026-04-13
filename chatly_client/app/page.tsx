"use client"

import { useEffect } from "react";
import { ChatList } from "@/components/layout/chat/ChatList";
import { ChatWindow } from "@/components/layout/chat/ChatWindow";
import { useUserStore } from "@/context/store/user";
import { ChatTopics } from "@/components/layout/chat/ChatTopics";

export default function Home() {
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(1, "JohnDoe");
  }, [setUser]);

  return (
    <div className="flex flex-col flex-1 flex-row items-center justify-center  font-sans  p-6 gap-6">
      
      <ChatWindow />
      <ChatList />
    </div>
  );
}
