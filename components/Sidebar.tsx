"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const icons = {
  Explore: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  "AR Preview": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  "Plan Trip": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.9a16 16 0 006.19 6.19l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Bookings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  "Live Tracking": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" strokeDasharray="3 3" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  ),
};

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState("Explore");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    getUser();
  }, []);

  const items = [
    { label: "Explore", href: "/user/home", badge: null },
    { label: "AR Preview", href: "/user/ar-preview", badge: "New" },
    { label: "Plan Trip", href: "/user/plan-trip", badge: null },
    { label: "Bookings", href: "/user/bookings", badge: null },
    { label: "Dashboard", href: "/user/dashboard", badge: null },
    { label: "Live Tracking", href: "/user/live-tracking", badge: null },
  ];

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")
    : "U";

  return (
    <aside className="w-64 bg-white flex flex-col border-r border-slate-100 shadow-sm">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/sadyaatra-logo.png"
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-100"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-base tracking-tight">SadYaatra AI</div>
            <div className="text-[11px] text-slate-400 font-medium">Your Travel Companion</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">Menu</p>
        {items.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => {
                setActive(item.label);
                window.location.href = item.href;
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {/* Icon container */}
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                }`}
              >
                {icons[item.label as keyof typeof icons]}
              </span>

              <span className={`flex-1 text-left text-sm font-medium ${isActive ? "text-white" : ""}`}>
                {item.label}
              </span>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active left accent — optional subtle pill */}
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-2 border-t border-slate-100 pt-3">

        {/* Logout */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/user/login";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-red-100 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* User card */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
          <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-blue-200 shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">
              {user?.user_metadata?.full_name || "User"}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {user?.email}
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}