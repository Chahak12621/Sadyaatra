"use client";
import { useState, useEffect, useRef } from "react";
import { supabase, sendChatMessage, getChatHistory, subscribeToChatMessages, ChatMessage } from "@/lib/supabase";

interface RealtimeChatProps {
  currentUserId: string;
  currentUserRole: "user" | "agent";
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  onClose: () => void;
  inline?: boolean; // ← when true, renders as side panel instead of full modal
}

export default function RealtimeChat({
  currentUserId,
  currentUserRole,
  otherUserId,
  otherUserName,
  otherUserAvatar,
  onClose,
  inline = false,
}: RealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const channel = subscribeToChatMessages(currentUserId, otherUserId, (newMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.find((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const history = await getChatHistory(currentUserId, otherUserId);
      setMessages(history);
    } catch (err) {
      console.error("Failed to load chat history:", JSON.stringify(err));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      await sendChatMessage(currentUserId, currentUserRole, otherUserId, input);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", JSON.stringify(err));
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Shared inner content
  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <img src={otherUserAvatar} alt={otherUserName} className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-bold text-white">{otherUserName}</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-white/5 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-slate-500 mt-20">
            No messages yet. Say hi! 👋
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white text-slate-800 rounded-bl-sm border border-slate-200"
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap">{msg.message}</div>
                <div className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-slate-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-transparent shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder:text-slate-400"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "→"}
          </button>
        </div>
      </div>
    </div>
  );

  // Inline = side panel, no overlay
  if (inline) {
    return (
      <div className="w-full h-full bg-[#0f1117] rounded-2xl border border-white/10 overflow-hidden">
        {chatContent}
      </div>
    );
  }

  // Default = full screen modal with overlay
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-150 shadow-2xl overflow-hidden">
        {chatContent}
      </div>
    </div>
  );
}