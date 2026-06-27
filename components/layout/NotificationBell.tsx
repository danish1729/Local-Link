"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Loader2 } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
      });

    // Sub to personal channel for notifications
    if (!pusherClient) return;

    console.log("NotificationBell: Subscribing to", `private-user-${userId}`);
    const channel = pusherClient.subscribe(`private-user-${userId}`);
    
    channel.bind("pusher:subscription_error", (error: any) => {
      console.error("NotificationBell: Pusher subscription error:", error);
    });

    channel.bind("new-notification", (notification: any) => {
      console.log("NotificationBell: Received notification:", notification);
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      pusherClient.unsubscribe(`private-user-${userId}`);
      channel.unbind_all();
    };
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id?: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id })
    });
    setNotifications(prev => prev.map(n => (id ? n._id === id : true) ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col max-h-96"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={() => handleMarkAsRead()} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  Mark all as read
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-indigo-600"/></div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No notifications yet.</div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => {
                      if (!n.isRead) handleMarkAsRead(n._id);
                    }}
                    className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors flex gap-3 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                  >
                    {!n.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 shrink-0"></div>}
                    <div>
                      <p className={`text-sm ${!n.isRead ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{n.content}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
