"use client";

import { useState, useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { ChevronLeft, User, MoreVertical, ShieldAlert } from "lucide-react";
import ChatInput from "./ChatInput";
import OfferBubble from "./OfferBubble";

interface ChatWindowProps {
  currentUser: any;
  conversation: any;
  onBack: () => void;
}

export default function ChatWindow({ currentUser, conversation, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const otherUser = conversation?.participants.find((p: any) => p._id !== currentUser._id);

  useEffect(() => {
    if (!conversation) return;

    // Fetch historical messages
    fetch(`/api/chat/messages?conversationId=${conversation._id}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages || []);
        setLoading(false);
        scrollToBottom();
      });

    // Mark as read
    fetch("/api/chat/conversations/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: conversation._id })
    }).catch(console.error);

    // Subscribe to Pusher channel for this conversation
    const channelName = `private-conversation-${conversation._id}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-message", (newMsg: any) => {
      setMessages(prev => [...prev, newMsg]);
      scrollToBottom();
    });

    channel.bind("offer-updated", (updatedMsg: any) => {
      setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(channelName);
    };
  }, [conversation]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleReportUser = async () => {
    const reason = prompt("Why are you reporting this user? (Spam, Inappropriate, etc.)");
    if (!reason) return;

    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedUserId: otherUser._id,
          conversationId: conversation._id,
          reason
        })
      });
      alert("Report submitted successfully.");
    } catch (error) {
      alert("Failed to submit report");
    }
  };

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="h-16 border-b border-slate-200 px-4 flex items-center justify-between bg-white shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
            {otherUser?.profileImage ? (
              <img src={otherUser.profileImage} alt={otherUser.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-2 text-slate-400" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">{otherUser?.name || "User"}</h2>
            <p className="text-xs text-emerald-600 font-medium">Online</p>
          </div>
        </div>

        <div className="flex items-center">
          <button 
            onClick={handleReportUser}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group relative"
            title="Report User"
          >
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50"
      >
        {loading ? (
          <div className="text-center text-slate-400 text-sm mt-10">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-10">Say hi to start the conversation!</div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser._id || msg.senderId?._id === currentUser._id;
            
            return (
              <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  
                  {msg.isOffer ? (
                    <OfferBubble msg={msg} isMe={isMe} currentUser={currentUser} />
                  ) : (
                    <div className={`p-3 rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-sm'}`}>
                      {msg.text}
                      {msg.attachment && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-black/10">
                          <img src={msg.attachment} alt="Attachment" className="max-w-full h-auto max-h-64 object-contain bg-white" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <ChatInput conversationId={conversation._id} isProvider={currentUser.role === 'provider'} />
    </div>
  );
}
