"use client";
import { useState, useEffect } from "react";
import { AgentProfile, getApprovedAgents, supabase } from "@/lib/supabase";
import RealtimeChat from "./RealtimeChat";


export default function AgentsList() {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatAgent, setChatAgent] = useState<AgentProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });

    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const approvedAgents = await getApprovedAgents();
      setAgents(approvedAgents);
      setError(null);
    } catch (err) {
      console.error("Failed to load agents:", err);
      setError("Failed to load agents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-500">Loading available drivers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-700 font-semibold mb-2">⚠️ Error</div>
        <div className="text-red-600 text-sm">{error}</div>
        <button
          onClick={loadAgents}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚗</div>
        <div className="text-slate-600 font-semibold mb-2">No drivers available</div>
        <div className="text-slate-500 text-sm">
          Check back later for available drivers in your area
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Agent Grid — shrinks when chat is open */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 ${chatAgent ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border-2 ${
              chatAgent?.id === agent.id ? "border-blue-500" : "border-slate-200"
            }`}
          >
            {/* Agent Header */}
            <div className="bg-linear-to-r from-blue-100 to-purple-100 h-20"></div>

            {/* Agent Info */}
            <div className="px-6 py-4 -mt-10 relative">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0 border-4 border-white">
                  {agent.profile_photo_url ? (
                    <img src={agent.profile_photo_url} alt={agent.full_name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    agent.full_name.charAt(0)
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 pt-2">
                  <div className="font-bold text-slate-800">{agent.full_name}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <span>🚗</span>
                    <span>{agent.vehicle_model}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {agent.vehicle_color} • {agent.vehicle_number}
                  </div>
                </div>
              </div>

              {/* Rating & Status */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">⭐</span>
                  <span className="text-sm font-semibold text-slate-800">4.8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-green-600 font-semibold">Online</span>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span>📞</span>
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span>📍</span>
                  <span>{agent.city}, {agent.state}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span>👥</span>
                  <span>{agent.seating_capacity} Seats</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setChatAgent(chatAgent?.id === agent.id ? null : agent)}
                className={`w-full mt-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  chatAgent?.id === agent.id
                    ? "bg-slate-200 text-slate-700"
                    : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                }`}
              >
                <span>💬</span>
                <span>{chatAgent?.id === agent.id ? "Close Chat" : "Chat with Driver"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inline Side Chat Panel */}
      {chatAgent && currentUserId && (
        <div className="w-96 shrink-0 sticky top-0 h-[calc(100vh-8rem)]">
          <RealtimeChat
            currentUserId={currentUserId}
            currentUserRole="user"
            otherUserId={chatAgent.id}
            otherUserName={chatAgent.full_name}
            otherUserAvatar={
              chatAgent.profile_photo_url ??
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatAgent.id}`
            }
            onClose={() => setChatAgent(null)}
            inline={true}
          />
        </div>
      )}
    </div>
  );
}