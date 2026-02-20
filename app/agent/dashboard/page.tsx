"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AgentChatInbox from "@/components/AgentChatInbox";

export default function AgentDashboardPage() {
  const [currentAgentId, setCurrentAgentId] = useState<string>("");
  const [agentName, setAgentName] = useState<string>("Agent");
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentAgentId(user.id);
        setAgentName(user.user_metadata?.full_name ?? user.email ?? "Agent");
      }
    };
    getUser();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: "💰",
      label: "Today's Earnings",
      value: "₹12,450",
      change: "+12%",
      bg: "from-emerald-500 to-teal-600",
      light: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: "🚗",
      label: "Completed Trips",
      value: "14",
      change: "+3",
      bg: "from-blue-500 to-blue-600",
      light: "bg-blue-50 text-blue-700",
    },
    {
      icon: "⭐",
      label: "Driver Rating",
      value: "4.92",
      change: "+0.2",
      bg: "from-amber-500 to-orange-500",
      light: "bg-amber-50 text-amber-700",
    },
    {
      icon: "⏱️",
      label: "Online Hours",
      value: "6h 45m",
      change: "+2.3h",
      bg: "from-violet-500 to-purple-600",
      light: "bg-violet-50 text-violet-700",
    },
  ];

  const recentHistory = [
    { id: "TRP-001", traveler: "Priya Sharma", from: "Mumbai", to: "Pune", amount: "₹2,400", status: "Completed", time: "2h ago" },
    { id: "TRP-002", traveler: "Rahul Mehta", from: "Delhi", to: "Agra", amount: "₹3,800", status: "Completed", time: "5h ago" },
    { id: "TRP-003", traveler: "Anita Singh", from: "Jaipur", to: "Udaipur", amount: "₹5,200", status: "Completed", time: "Yesterday" },
    { id: "TRP-004", traveler: "Vijay Kumar", from: "Bangalore", to: "Mysore", amount: "₹1,900", status: "In Progress", time: "Now" },
  ];

  const weekData = [40, 65, 50, 80, 60, 90, 75];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">
      {/* Sidebar accent */}
      <div className="w-1 bg-linear-to-b from-blue-500 via-violet-500 to-emerald-500 shrink-0" />

      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-[#0f1117]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">SadYaatra</div>
              <div className="font-bold text-white text-lg">Agent Portal</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live clock */}
            <div className="bg-white/5 rounded-lg px-4 py-2 text-sm font-mono text-slate-300">
  {currentTime?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) ?? "--:--:--"}
</div>

            {/* Online toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isOnline
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-700 text-slate-400 border border-slate-600"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              {isOnline ? "Online" : "Offline"}
            </button>

            {/* Notification */}
            <button className="relative p-2 bg-white/5 hover:bg-white/10 rounded-lg transition">
              <span className="text-lg">🔔</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 bg-linear-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {agentName.charAt(0)}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-1">
              Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-violet-400">{agentName.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-slate-400">
              {currentTime?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) ?? "Loading..."}
              {" · "}Your vehicle is verified and {isOnline ? "online" : "offline"}.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.bg} flex items-center justify-center text-xl shadow-lg`}>
                    {stat.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Chat Inbox — takes 2 cols */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  User Messages
                </h2>
                <span className="text-xs text-slate-500">Real-time • Live</span>
              </div>
              {currentAgentId ? (
                <AgentChatInbox currentAgentId={currentAgentId} />
              ) : (
                <div className="bg-white/5 rounded-2xl p-8 text-center text-slate-400">
                  Loading...
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Weekly Earnings Chart */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white">Weekly Earnings</h3>
                  <span className="text-xs text-emerald-400 font-bold">↗ +18.4%</span>
                </div>
                <p className="text-xs text-slate-500 mb-5">Revenue last 7 days</p>

                <div className="flex items-end justify-between gap-1.5 h-28">
                  {weekData.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-linear-to-t from-blue-600 to-violet-500 opacity-80 hover:opacity-100 transition"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-xs text-slate-500">{days[i]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                  <div>
                    <div className="text-slate-400 text-xs">This Week</div>
                    <div className="font-bold text-white">₹38,200</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-xs">Last Week</div>
                    <div className="font-bold text-slate-300">₹32,150</div>
                  </div>
                </div>
              </div>

              {/* Recent Trip History */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-4">Recent Trips</h3>
                <div className="space-y-3">
                  {recentHistory.map((trip) => (
                    <div key={trip.id} className="flex items-center gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      {/* Avatar */}
                      <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {trip.traveler.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-white truncate">{trip.traveler}</div>
                        <div className="text-xs text-slate-500 truncate">{trip.from} → {trip.to}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-sm text-white">{trip.amount}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          trip.status === "Completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold text-slate-300 transition">
                  View Full Ledger →
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-linear-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">Performance</h3>
                <div className="space-y-3">
                  {[
                    { label: "Acceptance Rate", value: "94%", bar: 94 },
                    { label: "On-Time Arrival", value: "88%", bar: 88 },
                    { label: "Customer Satisfaction", value: "96%", bar: 96 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-bold">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-blue-500 to-violet-500 rounded-full"
                          style={{ width: `${item.bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}