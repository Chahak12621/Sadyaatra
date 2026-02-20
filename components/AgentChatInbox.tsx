"use client";
import { useState, useEffect } from "react";
import { supabase, ChatMessage } from "@/lib/supabase";
import RealtimeChat from "./RealtimeChat";

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

interface AgentChatInboxProps {
  currentAgentId: string;
}

export default function AgentChatInbox({ currentAgentId }: AgentChatInboxProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentAgentId) return;
    loadConversations();

    const channel = supabase
      .channel(`agent_inbox_${currentAgentId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `receiver_id=eq.${currentAgentId}`,
      }, () => {
        loadConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentAgentId]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .or(`receiver_id.eq.${currentAgentId},sender_id.eq.${currentAgentId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const convMap = new Map<string, Conversation>();

      for (const msg of data as ChatMessage[]) {
        const otherUserId = msg.sender_id === currentAgentId ? msg.receiver_id : msg.sender_id;
        if (!convMap.has(otherUserId)) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("full_name")
            .eq("id", otherUserId)
            .single();

          const unreadCount = (data as ChatMessage[]).filter(
            (m) => m.sender_id === otherUserId && m.receiver_id === currentAgentId && !m.read
          ).length;

          convMap.set(otherUserId, {
            userId: otherUserId,
            userName: profile?.full_name ?? "Unknown User",
            lastMessage: msg.message,
            lastTime: msg.created_at,
            unread: unreadCount,
          });
        }
      }

      setConversations(Array.from(convMap.values()));
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="flex gap-4 h-145">
      {/* Inbox Sidebar */}
      <div className="w-72 bg-white/5 border border-white/10 rounded-2xl flex flex-col shrink-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Conversations</h3>
          {totalUnread > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalUnread} new
            </span>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm gap-2">
              <div className="w-5 h-5 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
              Loading...
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="text-4xl mb-3">💬</div>
              <div className="text-slate-300 font-semibold text-sm mb-1">No messages yet</div>
              <div className="text-slate-500 text-xs">
                When users message you, they'll appear here in real-time
              </div>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => {
                  setSelectedUserId(conv.userId);
                  setSelectedUserName(conv.userName);
                }}
                className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/8 transition flex items-center gap-3 ${
                  selectedUserId === conv.userId
                    ? "bg-blue-500/15 border-l-2 border-l-blue-400"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 relative">
                  {conv.userName.charAt(0)}
                  {conv.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-400 rounded-full border-2 border-[#0f1117]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-semibold truncate ${conv.unread > 0 ? "text-white" : "text-slate-300"}`}>
                      {conv.userName}
                    </span>
                    <span className="text-xs text-slate-500 shrink-0 ml-1">
                      {new Date(conv.lastTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 truncate">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-1">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-white/10">
        {selectedUserId ? (
          <RealtimeChat
            currentUserId={currentAgentId}
            currentUserRole="agent"
            otherUserId={selectedUserId}
            otherUserName={selectedUserName}
            otherUserAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUserId}`}
            onClose={() => setSelectedUserId(null)}
            inline={true}
          />
        ) : (
          <div className="h-full bg-white/5 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4">
              💬
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Select a conversation</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Choose a user from the left panel to start chatting in real-time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}