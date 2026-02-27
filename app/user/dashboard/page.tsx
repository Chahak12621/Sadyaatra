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

const typeConfig = {
  optimization: { bg: "bg-emerald-100", text: "text-emerald-600", icon: "✓", border: "border-emerald-200" },
  request: { bg: "bg-blue-100", text: "text-blue-600", icon: "↗", border: "border-blue-200" },
  alert: { bg: "bg-amber-100", text: "text-amber-600", icon: "!", border: "border-amber-200" },
  checkpoint: { bg: "bg-violet-100", text: "text-violet-600", icon: "◉", border: "border-violet-200" },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"archive" | "receipts" | "agents">("archive");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("Traveler");
  const [chatAgent, setChatAgent] = useState<{ id: string; name: string; avatar: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        setCurrentUserName(user.user_metadata?.full_name ?? user.email ?? "Traveler");
      }
    };
    getUser();
  }, []);

  const stats = [
    { label: "Distance Covered", value: "2,458", unit: "km", subtext: "of 10.5k this year", color: "bg-blue-600", lightColor: "bg-blue-50", textColor: "text-blue-600", progress: 23,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
      )
    },
    { label: "Trips Completed", value: "14", unit: "", subtext: "+3 this season", color: "bg-indigo-600", lightColor: "bg-indigo-50", textColor: "text-indigo-600", progress: 70,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.9a16 16 0 006.19 6.19l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      )
    },
    { label: "Avg. Agent Rating", value: "4.8", unit: "/5", subtext: "Excellent scores", color: "bg-amber-500", lightColor: "bg-amber-50", textColor: "text-amber-600", progress: 96,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    { label: "Savings via Trust", value: "₹420", unit: "", subtext: "25% saved this year", color: "bg-emerald-600", lightColor: "bg-emerald-50", textColor: "text-emerald-600", progress: 42,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      )
    },
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
      agent: { id: "REPLACE_WITH_REAL_AGENT_UUID_1", name: "Karan Verma", avatar: "https://i.pravatar.cc/150?img=12", location: "Agra" },
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
      agent: { id: "REPLACE_WITH_REAL_AGENT_UUID_2", name: "Sanjay Choudhary", avatar: "https://i.pravatar.cc/150?img=33", location: "Jaipur" },
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
      agent: { id: "REPLACE_WITH_REAL_AGENT_UUID_3", name: "Arun Nair", avatar: "https://i.pravatar.cc/150?img=68", location: "Kochi" },
    },
  ];

  const activityLogs: ActivityLog[] = [
    { type: "optimization", title: "AI OPTIMIZATION", description: "Rebooked flight to avoid traffic. Navigation via highway A4.", date: "15:25, Sep 3" },
    { type: "request", title: "ITINERARY REQUEST", description: 'Visited "Amer Fort Market" as an unscheduled stop.', date: "11:05, Sep 2" },
    { type: "alert", title: "SYSTEM ALERT", description: '"Grand Chokhi View" due to heavy rainfall warning.', date: "08:55, Sep 2" },
    { type: "checkpoint", title: "CHECKPOINT", description: "Arrived at Grand Hotel 15 minutes ahead of schedule.", date: "18:15, Sep 4" },
  ];

  const quickInsights = [
    { label: "Preferred Mode", value: "Hybrid SUV", icon: "🚙" },
    { label: "Top Activity Time", value: "Morning (10AM)", icon: "🌅" },
    { label: "Region Focus", value: "East Asia", icon: "🗺️" },
  ];

  const statusStyles: Record<string, string> = {
    Completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Upcoming: "bg-blue-100 text-blue-700 border border-blue-200",
    Archived: "bg-slate-100 text-slate-600 border border-slate-200",
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">

        {/* ── Header ── */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <img src="/sadyaatra-logo.png" alt="Logo" className="w-9 h-9 rounded-xl ring-2 ring-blue-100" />
            <div className="font-bold text-xl text-slate-800 tracking-tight">SadYaatra <span className="text-blue-600">AI</span></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trips, destinations..."
                className="w-72 pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-slate-600">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-200">
              {currentUserName.charAt(0) || "R"}
            </div>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto">

          {/* ── Page Title ── */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Overview</p>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Traveler History</h1>
              <p className="text-slate-500 mt-1 text-sm">Review your past adventures, manage receipts, and reconnect with agents.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm shadow-blue-200">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Data
              </button>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${stat.lightColor} ${stat.textColor} rounded-xl flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-semibold ${stat.textColor} ${stat.lightColor} px-2 py-1 rounded-full`}>
                    {stat.subtext}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                    <span className="text-sm text-slate-500 font-medium">{stat.unit}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color} rounded-full transition-all duration-500`} style={{ width: `${stat.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Main Content ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Trips */}
            <div className="lg:col-span-2 space-y-4">

              {/* Tabs */}
              <div className="bg-white border border-slate-100 rounded-2xl p-1.5 flex gap-1 shadow-sm">
                {[
                  { id: "archive", label: "Trip Archive", icon: "🗂️" },
                  { id: "receipts", label: "Receipts & Billing", icon: "🧾" },
                  { id: "agents", label: "Agent Network", icon: "👥" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Trip Cards */}
              {activeTab === "archive" && (
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      <div className="flex">
                        {/* Image */}
                        <div className="relative w-56 shrink-0 overflow-hidden">
                          <img
                            src={trip.image}
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${statusStyles[trip.status]}`}>
                              {trip.status}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-400">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              <span className="text-xs font-bold text-slate-800">{trip.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight">{trip.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <span>{trip.date} — {trip.endDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                </svg>
                                <span>{trip.distance} covered</span>
                              </div>
                            </div>
                          </div>

                          {/* Agent + Actions */}
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <div className="relative">
                                <img src={trip.agent.avatar} alt={trip.agent.name} className="w-9 h-9 rounded-xl object-cover" />
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-800">{trip.agent.name}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                                  </svg>
                                  {trip.agent.location}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center gap-1">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                                </svg>
                                Rebook
                              </button>
                              <button
                                onClick={() => setChatAgent(trip.agent)}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-1 shadow-sm shadow-blue-200"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                                </svg>
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "receipts" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-blue-600">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Receipts & Billing</h3>
                  <p className="text-sm text-slate-500">Your invoices and payment history will appear here.</p>
                </div>
              )}

              {activeTab === "agents" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-blue-600">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Agent Network</h3>
                  <p className="text-sm text-slate-500">All your connected agents and their profiles will show here.</p>
                </div>
              )}
            </div>

            {/* ── Right Column ── */}
            <div className="space-y-5">

              {/* Activity Log */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Dynamic Change Log</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Last trip: Taj Mahal Heritage Trail</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>

                <div className="space-y-3">
                  {activityLogs.map((log, i) => {
                    const cfg = typeConfig[log.type];
                    return (
                      <div key={i} className={`flex gap-3 p-3 rounded-xl border ${cfg.border} ${cfg.bg.replace("100", "50")}`}>
                        <div className={`w-7 h-7 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                          {cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${cfg.text} mb-0.5`}>{log.title}</div>
                          <div className="text-xs text-slate-700 leading-relaxed">{log.description}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{log.date}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="w-full mt-4 py-2 text-xs text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition">
                  View Full History →
                </button>
              </div>

              {/* Quick Insights */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3.5 h-3.5">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Quick Insights</h3>
                </div>
                <div className="space-y-2">
                  {quickInsights.map((insight, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{insight.icon}</span>
                        <span className="text-xs text-slate-600 font-medium">{insight.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                        {insight.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation card */}
              <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-sm">✨</div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">AI Recommendation</span>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  Based on your travel patterns, <strong className="font-bold text-white">Himachal Pradesh</strong> in December could save you ₹2,400 vs peak season.
                </p>
                <button className="mt-4 w-full py-2 bg-white text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 transition">
                  Explore Suggestion →
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

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