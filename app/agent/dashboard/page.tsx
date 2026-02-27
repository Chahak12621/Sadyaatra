"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AgentChatInbox from "@/components/AgentChatInbox";

export default function AgentDashboardPage() {
  const [currentAgentId, setCurrentAgentId] = useState<string>("");
  const [agentName, setAgentName] = useState<string>("Agent");
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activeChart, setActiveChart] = useState<"week" | "month">("week");

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
      label: "Today's Earnings", value: "₹12,450", change: "+12%", positive: true,
      color: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/20",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: "Completed Trips", value: "14", change: "+3 today", positive: true,
      color: "from-blue-500 to-blue-600", glow: "shadow-blue-500/20",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      label: "Driver Rating", value: "4.92", change: "+0.2 pts", positive: true,
      color: "from-amber-500 to-orange-500", glow: "shadow-amber-500/20",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      label: "Online Hours", value: "6h 45m", change: "+2.3h", positive: true,
      color: "from-violet-500 to-purple-600", glow: "shadow-violet-500/20",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  const weekData = [
    { day: "Mon", trips: 8, earn: 28000 },
    { day: "Tue", trips: 12, earn: 42000 },
    { day: "Wed", trips: 9, earn: 31500 },
    { day: "Thu", trips: 15, earn: 52500 },
    { day: "Fri", trips: 11, earn: 38500 },
    { day: "Sat", trips: 18, earn: 63000 },
    { day: "Sun", trips: 14, earn: 49000 },
  ];

  const monthData = [
    { day: "W1", trips: 52, earn: 182000 },
    { day: "W2", trips: 61, earn: 213500 },
    { day: "W3", trips: 48, earn: 168000 },
    { day: "W4", trips: 67, earn: 234500 },
  ];

  const chartData = activeChart === "week" ? weekData : monthData;
  const maxEarn = Math.max(...chartData.map(d => d.earn));
  const maxTrips = Math.max(...chartData.map(d => d.trips));

  const recentTrips = [
    { id: "TRP-001", traveler: "Priya Sharma", from: "Mumbai", to: "Pune", amount: "₹2,400", status: "Completed", time: "2h ago", rating: 5 },
    { id: "TRP-002", traveler: "Rahul Mehta", from: "Delhi", to: "Agra", amount: "₹3,800", status: "Completed", time: "5h ago", rating: 5 },
    { id: "TRP-003", traveler: "Anita Singh", from: "Jaipur", to: "Udaipur", amount: "₹5,200", status: "Completed", time: "Yesterday", rating: 4 },
    { id: "TRP-004", traveler: "Vijay Kumar", from: "Bangalore", to: "Mysore", amount: "₹1,900", status: "In Progress", time: "Now", rating: null },
  ];

  const performance = [
    { label: "Acceptance Rate", value: 94, color: "from-emerald-500 to-teal-400" },
    { label: "On-Time Arrival", value: 88, color: "from-blue-500 to-cyan-400" },
    { label: "Customer Satisfaction", value: 96, color: "from-violet-500 to-purple-400" },
    { label: "Trip Completion", value: 99, color: "from-amber-500 to-orange-400" },
  ];

  const donutSegments = [
    { label: "Completed", value: 72, color: "#3b82f6" },
    { label: "Cancelled", value: 8, color: "#ef4444" },
    { label: "In Progress", value: 20, color: "#10b981" },
  ];

  // SVG donut chart
  const total = donutSegments.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const donutPaths = donutSegments.map((seg) => {
    const offset = circumference - (seg.value / total) * circumference;
    const rotate = (cumulative / total) * 360 - 90;
    cumulative += seg.value;
    return { ...seg, offset, rotate };
  });

  return (
    <div className="flex h-screen bg-[#080c14] text-white overflow-hidden">
      {/* Left glow accent */}
      <div className="w-1 shrink-0 bg-linear-to-b from-blue-500 via-violet-500 to-emerald-500" />

      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

        {/* ── Header ── */}
        <div className="sticky top-0 z-30 bg-[#080c14]/80 backdrop-blur-xl border-b border-white/5 px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center text-sm font-black">S</div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">SadYaatra</div>
              <div className="font-bold text-white text-sm leading-none">Agent Portal</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-mono text-slate-300 tabular-nums">
              {currentTime?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) ?? "--:--:--"}
            </div>

            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isOnline
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                  : "bg-white/5 text-slate-400 border border-white/10"
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              {isOnline ? "Online" : "Offline"}
            </button>

            <button className="relative p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5 text-slate-300">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#080c14]"></span>
            </button>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/agent/login";
              }}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>

            <div className="w-9 h-9 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20">
              {agentName.charAt(0)}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">

          {/* ── Welcome Banner ── */}
          <div className="relative bg-linear-to-r from-blue-600/20 via-violet-600/10 to-transparent border border-blue-500/20 rounded-2xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-violet-600/10 to-transparent" />
            <div className="absolute -right-8 -top-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">
                {currentTime?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) ?? ""}
              </p>
              <h1 className="text-3xl font-black text-white mb-1">
                Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-violet-400">{agentName.split(" ")[0]}</span> 👋
              </h1>
              <p className="text-slate-400 text-sm">Your vehicle is verified and {isOnline ? <span className="text-emerald-400 font-semibold">online</span> : <span className="text-slate-500">offline</span>}. You've earned <span className="text-white font-semibold">₹12,450</span> today.</p>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={`relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all group overflow-hidden shadow-xl ${stat.glow}`}>
                <div className="absolute -right-4 -top-4 w-24 h-24 opacity-10 rounded-full blur-2xl" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    {stat.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT: Charts + Messages (2 cols) */}
            <div className="lg:col-span-2 space-y-5">

              {/* ── Earnings Bar Chart ── */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-white text-base">Earnings Overview</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Revenue & trips breakdown</p>
                  </div>
                  <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                    {(["week", "month"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveChart(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${activeChart === t ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                          }`}
                      >
                        {t === "week" ? "7 Days" : "4 Weeks"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div className="flex items-end gap-2 h-36 mb-2">
                  {chartData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                      <div className="w-full flex flex-col items-center gap-0.5">
                        {/* Trips bar (thin, on top) */}
                        <div className="relative w-full">
                          <div
                            className="w-full rounded-t-lg bg-linear-to-t from-violet-600 to-violet-400 opacity-60 group-hover/bar:opacity-90 transition-all duration-300"
                            style={{ height: `${(d.trips / maxTrips) * 48}px` }}
                          />
                        </div>
                        {/* Earnings bar */}
                        <div
                          className="w-full rounded-b-sm bg-linear-to-t from-blue-700 to-blue-500 group-hover/bar:from-blue-600 group-hover/bar:to-blue-400 transition-all duration-300 relative"
                          style={{ height: `${(d.earn / maxEarn) * 80}px` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none z-10 shadow-xl">
                            ₹{(d.earn / 1000).toFixed(0)}k · {d.trips} trips
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{d.day}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-5 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-linear-to-t from-blue-700 to-blue-500" />
                    <span className="text-xs text-slate-400">Earnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-linear-to-t from-violet-600 to-violet-400" />
                    <span className="text-xs text-slate-400">Trips</span>
                  </div>
                  <div className="ml-auto flex gap-6 text-right">
                    <div>
                      <div className="text-xs text-slate-500">Total Earned</div>
                      <div className="text-sm font-bold text-white">₹{activeChart === "week" ? "3.04L" : "7.98L"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Total Trips</div>
                      <div className="text-sm font-bold text-white">{activeChart === "week" ? "87" : "228"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Chat Inbox ── */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <h2 className="font-bold text-white flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    Live User Messages
                  </h2>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Real-time</span>
                </div>
                <div className="p-4">
                  {currentAgentId ? (
                    <AgentChatInbox currentAgentId={currentAgentId} />
                  ) : (
                    <div className="py-12 text-center text-slate-500 text-sm">Loading inbox...</div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="space-y-5">

              {/* ── Donut Chart: Trip Status ── */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-white text-sm mb-1">Trip Status</h3>
                <p className="text-xs text-slate-500 mb-5">Distribution this month</p>

                <div className="flex items-center justify-center mb-5">
                  <div className="relative">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      {donutPaths.map((seg, i) => (
                        <circle
                          key={i}
                          cx="50" cy="50"
                          r={radius}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="14"
                          strokeDasharray={`${circumference - seg.offset} ${seg.offset}`}
                          strokeDashoffset={circumference * 0.25}
                          transform={`rotate(${seg.rotate} 50 50)`}
                          className="transition-all duration-500"
                          style={{ filter: `drop-shadow(0 0 6px ${seg.color}60)` }}
                        />
                      ))}
                      <circle cx="50" cy="50" r="26" fill="#0d1117" />
                      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">228</text>
                      <text x="50" y="58" textAnchor="middle" fill="#64748b" fontSize="7">Total</text>
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  {donutSegments.map((seg, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: seg.color }} />
                        <span className="text-xs text-slate-400">{seg.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${seg.value}%`, backgroundColor: seg.color }} />
                        </div>
                        <span className="text-xs font-bold text-white w-8 text-right">{seg.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Performance Bars ── */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-white text-sm mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  {performance.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="font-bold text-white">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-linear-to-r ${item.color} rounded-full`}
                          style={{ width: `${item.value}%`, boxShadow: "0 0 8px rgba(99,102,241,0.4)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Recent Trips ── */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm">Recent Trips</h3>
                  <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold">View all →</button>
                </div>
                <div className="space-y-3">
                  {recentTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group">
                      <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-lg shadow-blue-500/20">
                        {trip.traveler.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-white truncate">{trip.traveler}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>{trip.from}</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-2.5 h-2.5 text-slate-600"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          <span>{trip.to}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-xs text-white">{trip.amount}</div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${trip.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"
                          }`}>
                          {trip.status === "In Progress" ? "Active" : "Done"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Mini Heatmap: Hourly Activity ── */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-white text-sm mb-1">Hourly Activity</h3>
                <p className="text-xs text-slate-500 mb-4">Peak hours this week</p>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 24 }, (_, i) => {
                    const intensity = [0, 0, 0, 0, 1, 1, 2, 3, 4, 4, 3, 3, 2, 3, 4, 5, 5, 4, 3, 2, 2, 1, 1, 0][i];
                    const colors = ["bg-white/5", "bg-blue-900/60", "bg-blue-700/60", "bg-blue-600/70", "bg-blue-500/80", "bg-blue-400"];
                    return (
                      <div
                        key={i}
                        className={`h-5 rounded-sm ${colors[intensity]} transition-all hover:scale-110`}
                        title={`${i}:00 — ${["Quiet", "Low", "Moderate", "Busy", "Peak", "Very Busy"][intensity]}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-600">
                  <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] text-slate-500">Less</span>
                  {["bg-white/5", "bg-blue-900/60", "bg-blue-700/60", "bg-blue-500/80", "bg-blue-400"].map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                  ))}
                  <span className="text-[10px] text-slate-500">More</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}