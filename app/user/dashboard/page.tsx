"use client";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import RealtimeChat from "@/components/RealtimeChat";


interface Trip {
  id: number;
  name: string;
  status: "Completed" | "Upcoming" | "Archived";
  image: string;
  date: string;
  endDate: string;
  distance: string;
  rating: number;
  agent: {
    id: string;      
    name: string;
    avatar: string;
    location: string;
  };
}

interface ActivityLog {
  type: "optimization" | "request" | "alert" | "checkpoint";
  title: string;
  description: string;
  date: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"archive" | "receipts" | "agents">("archive");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("Traveler");


  // ── Chat state ──────────────────────────────────────────
  const [chatAgent, setChatAgent] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);

  // Get logged-in user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        setCurrentUserName(
          user.user_metadata?.full_name ?? user.email ?? "Traveler"
        );
      }
    };
    getUser();
  }, []);

  const stats = [
    { icon: "📍", label: "Distance Covered", value: "2,458 km", subtext: "of 10.5k this year", color: "from-blue-500 to-blue-600" },
    { icon: "✈️", label: "Trips Completed", value: "14", subtext: "", color: "from-purple-500 to-purple-600" },
    { icon: "⭐", label: "Avg. Agent Rating", value: "4.8/5", subtext: "", color: "from-orange-500 to-orange-600" },
    { icon: "💰", label: "Savings via Trust", value: "₹420.50", subtext: "of 25% this year", color: "from-green-500 to-green-600" },
  ];

  
  const trips: Trip[] = [
    {
      id: 1,
      name: "Taj Mahal Heritage Trail",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
      date: "Nov 15, 2025",
      endDate: "Nov 18, 2025",
      distance: "1,142 km",
      rating: 4.9,
      agent: {
        id: "REPLACE_WITH_REAL_AGENT_UUID_1",   
        name: "Karan Verma",
        avatar: "https://i.pravatar.cc/150?img=12",
        location: "Agra",
      },
    },
    {
      id: 2,
      name: "Rajasthan Royal Circuit",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
      date: "Aug 05, 2025",
      endDate: "Aug 15, 2025",
      distance: "1,332 km",
      rating: 5,
      agent: {
        id: "REPLACE_WITH_REAL_AGENT_UUID_2",   
        name: "Sanjay Choudhary",
        avatar: "https://i.pravatar.cc/150?img=33",
        location: "Jaipur",
      },
    },
    {
      id: 3,
      name: "Kerala Backwater Serenity",
      status: "Archived",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
      date: "June 20, 2025",
      endDate: "June 24, 2025",
      distance: "814 km",
      rating: 4.7,
      agent: {
        id: "REPLACE_WITH_REAL_AGENT_UUID_3",  
        name: "Arun Nair",
        avatar: "https://i.pravatar.cc/150?img=68",
        location: "Kochi",
      },
    },
  ];

  const activityLogs: ActivityLog[] = [
    { type: "optimization", title: "AI OPTIMIZATION", description: "Rebooked flight to avoid traffic. Navigation via highway A4.", date: "15:25, Sep 3" },
    { type: "request", title: "ITINERARY REQUEST", description: 'Visited "Amer Fort Market" as an unscheduled stop.', date: "11:05, Sep 2" },
    { type: "alert", title: "SYSTEM ALERT", description: '"Grand Chokhi View" due to heavy rainfall warning.', date: "08:55, Sep 2" },
    { type: "checkpoint", title: "CHECKPOINT", description: "Arrived at Grand Hotel 15 minutes ahead of schedule.", date: "18:15, Sep 4" },
  ];

  const quickInsights = [
    { icon: "🎯", label: "Preferred Mode", value: "Hybrid SUV" },
    { icon: "⏰", label: "Top Activity Time", value: "Morning walk (10PM)" },
    { icon: "📍", label: "Region Focus", value: "East Asia" },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/sadyaatra-logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
            <div className="font-bold text-xl text-slate-800">SadYaatra AI</div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-80 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <span className="text-xl">🔔</span>
            </button>
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentUserName.charAt(0) || "R"}
            </div>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Traveler History</h1>
            <p className="text-slate-600">
              Review your past adventures, manage receipts, and reconnect with your favorite agents.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className={`bg-linear-to-br ${stat.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{stat.icon}</span>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">→</span>
                  </div>
                </div>
                <div className="text-sm font-medium opacity-90 mb-1">{stat.label}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                {stat.subtext && <div className="text-xs opacity-80">{stat.subtext}</div>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                  {[
                    { id: "archive", label: "Trip Archive" },
                    { id: "receipts", label: "Receipts & Billing" },
                    { id: "agents", label: "Agent Network" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 font-semibold text-sm rounded-lg transition ${
                        activeTab === tab.id ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2">
                    <span>⚙️</span> Filter
                  </button>
                  <button className="px-3 py-2 border rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2">
                    <span>📥</span> Export All Data
                  </button>
                </div>
              </div>

              {/* Trip Cards */}
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                    <div className="flex">
                      <div className="relative w-64 h-48 shrink-0">
                        <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {trip.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{trip.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <span>📅 {trip.date}</span>
                              <span>—</span>
                              <span>{trip.endDate}</span>
                              <span>•</span>
                              <span>📏 {trip.distance} covered</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                            <span className="text-orange-500">⭐</span>
                            <span className="font-bold text-slate-800">{trip.rating}</span>
                            <span className="text-xs text-slate-500">Agent Rating</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center gap-3">
                            <img src={trip.agent.avatar} alt={trip.agent.name} className="w-10 h-10 rounded-full" />
                            <div>
                              <div className="font-semibold text-sm text-slate-800">{trip.agent.name}</div>
                              <div className="text-xs text-slate-500">📍 {trip.agent.location}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-700 transition">
                              🔄 Rebook Itinerary
                            </button>

                            {}
                            <button
                              onClick={() => window.location.href = "#"}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                            >
                              💬 Contact Agent
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Activity & Insights */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-blue-600">📊</span> Dynamic Change Log
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Real-time adjustments from your last trip: Taj Mahal Heritage Trail.
                </p>
                <div className="space-y-3">
                  {activityLogs.map((log, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b last:border-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        {log.type === "optimization" && <span className="text-sm">✅</span>}
                        {log.type === "request" && <span className="text-sm">📝</span>}
                        {log.type === "alert" && <span className="text-sm">⚠️</span>}
                        {log.type === "checkpoint" && <span className="text-sm">📍</span>}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">{log.title}</div>
                        <div className="text-sm text-slate-700 leading-relaxed mb-1">{log.description}</div>
                        <div className="text-xs text-slate-400">{log.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-blue-600 font-semibold hover:underline">
                  View Full History Log
                </button>
              </div>

              <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl shadow p-6 border border-blue-100">
                <h3 className="font-bold text-slate-800 mb-4">QUICK INSIGHTS</h3>
                <div className="space-y-3">
                  {quickInsights.map((insight, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <span>{insight.icon}</span>
                        <span>{insight.label}</span>
                      </div>
                      <div className="font-semibold text-sm text-slate-800">{insight.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── RealtimeChat Modal ── */}
      {chatAgent && currentUserId && (
        <RealtimeChat
          currentUserId={currentUserId}
          currentUserRole="user"
          otherUserId={chatAgent.id}
          otherUserName={chatAgent.name}
          otherUserAvatar={chatAgent.avatar}
          onClose={() => setChatAgent(null)}
        />
      )}
    </div>
  );
}