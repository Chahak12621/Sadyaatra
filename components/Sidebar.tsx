"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState("Explore");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  const items = [
    { icon: "🗺️", label: "Explore", href: "/user/home", badge: null },
    { icon: "🔮", label: "AR Preview", href: "/user/ar-preview", badge: "New" },
    { icon: "✈️", label: "Plan Trip", href: "/user/plan-trip", badge: null },
    { icon: "📋", label: "Bookings", href: "/user/bookings", badge: null },
    { icon: "📊", label: "Dashboard", href: "/user/dashboard", badge: null },
    { icon: "📍", label: "Live Tracking", href: "/user/live-tracking", badge: null },
  ];

  return (
    <aside className="w-64 bg-white text-slate-800 flex flex-col border-r">

      {/* Logo */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src="/sadyaatra-logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-bold text-lg">SadYaatra AI</div>
            <div className="text-xs text-slate-500">Your Travel Companion</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setActive(item.label);
              window.location.href = item.href;
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              active === item.label
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-left text-sm font-medium">
              {item.label}
            </span>
            {item.badge && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/user/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
        >
          <span>🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* User card */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.user_metadata?.full_name?.[0] || "U"}
          </div>
          <div className="text-sm">
            <div className="font-semibold">
              {user?.user_metadata?.full_name || "User"}
            </div>
            <div className="text-xs text-slate-500">
              {user?.email}
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
