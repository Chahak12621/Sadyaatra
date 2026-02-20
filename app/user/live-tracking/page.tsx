"use client";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

interface ItineraryItem {
  id: number;
  status: "Done" | "En Route" | "Next";
  name: string;
  time: string;
  description?: string;
  expanded?: boolean;
}

export default function LiveTrackingPage() {
  const [progress, setProgress] = useState(40);
  const [currentLocation, setCurrentLocation] = useState({ lat: 26.9124, lng: 75.7873 });

  const [items, setItems] = useState<ItineraryItem[]>([
    {
      id: 1,
      status: "Done",
      name: "Taj Mahal East Gate",
      time: "09:15 AM",
    },
    {
      id: 2,
      status: "Done",
      name: "Fatehpur Sikri",
      time: "11:45 AM",
    },
    {
      id: 3,
      status: "En Route",
      name: "Abhaneri Stepwell",
      time: "02:30 PM",
      description: "Short heritage stopover on the way to Jaipur.",
      expanded: true,
    },
    {
      id: 4,
      status: "Next",
      name: "Hawa Mahal, Jaipur",
      time: "05:15 PM",
    },
    {
      id: 5,
      status: "Next",
      name: "Chokhi Dhani Resort",
      time: "07:30 PM",
    },
  ]);

  const toggleExpand = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  // Simulate progress increase
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 1 : p));
    }, 30000); // +1% every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-hidden relative">
        {/* Map Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"
            alt="Map"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Map overlay with route */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Dotted route line */}
            <line
              x1="30%"
              y1="80%"
              x2="70%"
              y2="30%"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="10,10"
              strokeLinecap="round"
            />
            {/* Start marker (green) */}
            <circle cx="30%" cy="80%" r="12" fill="#10b981" stroke="white" strokeWidth="3" />
            {/* Current location marker (blue pulsing) */}
            <circle cx="50%" cy="55%" r="20" fill="#3b82f6" opacity="0.3">
              <animate
                attributeName="r"
                values="20;28;20"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50%" cy="55%" r="12" fill="#3b82f6" stroke="white" strokeWidth="3" />
            {/* End marker (gray) */}
            <circle cx="70%" cy="30%" r="12" fill="#94a3b8" stroke="white" strokeWidth="3" />
          </svg>
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm px-8 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/sadyaatra-logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-80 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <span className="text-xl">🔔</span>
              </button>
              <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
            </div>
          </div>
        </div>

        {/* Currently in Transit Card */}
        <div className="absolute top-24 left-8 right-8 z-10">
          <div className="bg-white rounded-2xl shadow-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                🚗
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Currently in Transit
                </div>
                <div className="font-bold text-xl text-slate-800">Toyota Innova Crysta</div>
                <div className="text-sm text-slate-600">DL 1C AB 4590</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase mb-1">Agent</div>
                <div className="flex items-center gap-2">
                  <img
                    src="https://i.pravatar.cc/150?img=15"
                    alt="Rajesh"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="font-semibold text-slate-800">Rajesh K.</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm">Safe Journey Active</span>
              </div>
              <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition flex items-center gap-2">
                <span>✕</span>
                <span>End Trip Early</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Itinerary Panel */}
        <div className="absolute top-48 left-8 bottom-8 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Panel Header */}
          <div className="px-6 py-4 border-b bg-linear-to-r from-blue-50 to-purple-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🗺️</span>
              <span className="font-bold text-slate-800">Live Itinerary</span>
            </div>
            <button className="p-2 hover:bg-white rounded-lg transition">
              <span className="text-slate-600">⚙️</span>
            </button>
          </div>

          {/* Itinerary Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`rounded-xl border-2 transition ${
                  item.status === "En Route"
                    ? "border-blue-500 bg-blue-50"
                    : item.status === "Done"
                    ? "border-green-200 bg-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => item.description && toggleExpand(item.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {item.status === "Done" && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          ✓
                        </div>
                      )}
                      {item.status === "En Route" && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                      {item.status === "Next" && (
                        <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-white text-xs">
                          ⏱
                        </div>
                      )}
                      <div>
                        <div
                          className={`font-semibold text-sm ${
                            item.status === "Done" ? "text-slate-600" : "text-slate-800"
                          }`}
                        >
                          {item.status === "Done" && "✓ Done"}
                          {item.status === "En Route" && (
                            <span className="text-blue-600">En Route</span>
                          )}
                          {item.status === "Next" && "Next"}
                        </div>
                      </div>
                    </div>
                    {item.description && (
                      <button className="text-slate-400 text-xs">
                        {item.expanded ? "▲" : "▼"}
                      </button>
                    )}
                  </div>

                  <div className="ml-9">
                    <div className="font-bold text-slate-800 mb-1">{item.name}</div>
                    <div className="text-sm text-slate-500">{item.time}</div>

                    {item.expanded && item.description && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="text-sm text-slate-600 mb-3">{item.description}</div>
                        <button className="text-sm text-blue-600 font-semibold hover:underline">
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Footer */}
          <div className="px-6 py-4 border-t bg-slate-50">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600 font-semibold">Total Progress</span>
              <span className="text-slate-800 font-bold">{progress}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* AI Traffic Alert */}
        <div className="absolute top-48 right-8 w-80 space-y-4 z-10">
          <div className="bg-white rounded-2xl shadow-xl p-5 border-l-4 border-orange-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink">
                <span className="text-lg">⚠️</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">
                  AI TRAFFIC ALERT
                </div>
                <div className="text-sm text-slate-800 leading-relaxed mb-2">
                  Heads up! Heavy traffic at Jaipur Bypass. Suggesting a 15-min detour through NH-21.
                </div>
                <button className="text-sm text-blue-600 font-semibold hover:underline">
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-5 border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink">
                <span className="text-lg">💡</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-blue-600 uppercase mb-1">SMART TIP</div>
                <div className="text-sm text-slate-800 leading-relaxed">
                  The weather at Abhaneri is quite sunny today. Don't forget your hat and water!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 text-center text-xs text-slate-500">
          © 2026 SadYaatra AI. All rights reserved.
        </div>
      </main>
    </div>
  );
}