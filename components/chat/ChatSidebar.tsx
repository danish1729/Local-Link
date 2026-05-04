"use client";

import { formatDistanceToNow } from "date-fns";
import { User, CheckCircle2 } from "lucide-react";

interface ChatSidebarProps {
  currentUser: any;
  conversations: any[];
  activeConvoId: string | null;
  setActiveConvoId: (id: string) => void;
}

export default function ChatSidebar({ currentUser, conversations, activeConvoId, setActiveConvoId }: ChatSidebarProps) {
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No conversations yet.
          </div>
        ) : (
          conversations.map((convo) => {
            const otherUser = convo.participants.find((p: any) => p._id !== currentUser._id);
            const isUnread = convo.unreadCount?.[currentUser._id] > 0;
            const lastMsg = convo.lastMessage;

            return (
              <div 
                key={convo._id}
                onClick={() => setActiveConvoId(convo._id)}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 ${activeConvoId === convo._id ? 'bg-indigo-50 hover:bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    {otherUser?.profileImage ? (
                      <img src={otherUser.profileImage} alt={otherUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-2.5 text-slate-400" />
                    )}
                  </div>
                  {/* Presence indicator (Mocked as online for now, could integrate pusher presence) */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-semibold text-sm truncate ${isUnread ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                      {otherUser?.name || "Unknown User"}
                    </h3>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {lastMsg?.createdAt ? formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: true }) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${isUnread ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      {lastMsg?.isOffer ? "🤝 Sent a custom offer" : lastMsg?.text || "Started a conversation"}
                    </p>
                    {isUnread && (
                      <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {convo.unreadCount[currentUser._id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
