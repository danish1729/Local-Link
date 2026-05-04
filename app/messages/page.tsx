import ChatLayout from "@/components/chat/ChatLayout";
import Header from "@/components/layout/Header";
import { Suspense } from "react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
          <ChatLayout />
        </Suspense>
      </div>
    </div>
  );
}
