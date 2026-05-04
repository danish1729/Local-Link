"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher-client";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { Loader2 } from "lucide-react";

export default function ChatLayout() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUserId = searchParams.get("userId");

  useEffect(() => {
    // Fetch user and conversations
    Promise.all([
      fetch("/api/auth/me").then(res => res.json()),
      fetch("/api/chat/conversations").then(res => res.json())
    ]).then(async ([userData, convoData]) => {
      let convos = convoData?.conversations || [];
      if (userData?.user) setCurrentUser(userData.user);
      
      // If we have a targetUserId, ensure the conversation exists
      if (targetUserId && userData?.user) {
        const existingConvo = convos.find((c: any) => 
          c.participants.some((p: any) => p._id === targetUserId)
        );

        if (existingConvo) {
          setActiveConvoId(existingConvo._id);
        } else {
          try {
            const res = await fetch("/api/chat/conversations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ otherUserId: targetUserId })
            });
            const newConvo = await res.json();
            if (newConvo && !newConvo.error) {
              convos = [newConvo, ...convos];
              setActiveConvoId(newConvo._id);
            }
          } catch (error) {
            console.error("Failed to start conversation", error);
          }
        }
        
        // Remove userId from URL cleanly
        router.replace("/messages");
      }

      setConversations(convos);
      setLoading(false);
    });
  }, [targetUserId, router]);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to presence channel to show online users
    const channel = pusherClient.subscribe("presence-locallink");

    channel.bind("pusher:subscription_succeeded", () => {
      // Could mark self as online in UI if needed
    });

    return () => {
      pusherClient.unsubscribe("presence-locallink");
    };
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex h-full border-t border-slate-200">
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 bg-white ${activeConvoId ? 'hidden md:block' : 'block'}`}>
        <ChatSidebar 
          currentUser={currentUser}
          conversations={conversations} 
          activeConvoId={activeConvoId} 
          setActiveConvoId={setActiveConvoId} 
        />
      </div>
      <div className={`flex-1 bg-slate-50 ${!activeConvoId ? 'hidden md:flex md:flex-col' : 'flex flex-col'}`}>
        {activeConvoId ? (
          <ChatWindow 
            currentUser={currentUser}
            conversation={conversations.find(c => c._id === activeConvoId)}
            onBack={() => setActiveConvoId(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 flex-col">
            <img src="https://illustrations.popsy.co/amber/communication.svg" alt="Chat" className="w-64 h-64 opacity-50 mb-4" />
            <p className="text-lg font-medium text-slate-600">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
