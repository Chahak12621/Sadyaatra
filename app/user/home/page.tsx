"use client";
import Sidebar from "@/components/Sidebar";
import React, { useState, useRef, useEffect } from "react";

const PLACES = [
  {
    id: 1,
    name: "Taj Mahal, Agra",
    desc: "Wonder of the World · Mughal Architecture · UNESCO",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
    price: "₹8,500",
    rating: "4.9",
  },
  {
    id: 2,
    name: "Jaipur, Rajasthan",
    desc: "Pink City · Forts · Royal Heritage",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
    price: "₹6,200",
    rating: "4.8",
  },
  {
    id: 3,
    name: "Kerala Backwaters",
    desc: "Houseboats · Nature · Ayurveda",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    price: "₹9,800",
    rating: "4.9",
  },
  {
    id: 4,
    name: "Varanasi, UP",
    desc: "Spiritual Capital · Ganges · Ancient Temples",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be",
    price: "₹5,500",
    rating: "4.7",
  },
  {
    id: 5,
    name: "Goa Beaches",
    desc: "Beaches · Nightlife · Portuguese Heritage",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
    price: "₹7,200",
    rating: "4.8",
  },
  {
    id: 6,
    name: "Manali, Himachal",
    desc: "Hill Station · Adventure · Himalayan Views",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
    price: "₹8,000",
    rating: "4.9",
  },
  {
    id: 7,
    name: "Taj Mahal, Agra",
    desc: "Wonder of the World · Mughal Architecture · UNESCO",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
    price: "₹8,500",
    rating: "4.9",
  },
  {
    id: 8,
    name: "Jaipur, Rajasthan",
    desc: "Pink City · Forts · Royal Heritage",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
    price: "₹6,200",
    rating: "4.8",
  },
];

interface Msg { role: "user" | "bot"; text: string }

export default function HomePage() {
  const [selected, setSelected] = useState(PLACES[0]);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Namaste 🙏 I'm your SadYaatra AI assistant! Click any destination to learn more, or ask me anything about Indian travel!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const askBot = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user" as const, text };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/explore-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...msgs, userMsg], place: selected.name }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "bot", text: data.reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Oops 😅 Server thoda busy hai, try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <Sidebar />

      <main className="flex-1 flex overflow-hidden">
        {/* Places Grid */}
        <section className="flex-1 p-8 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Explore India
            </h1>
            <p className="text-slate-600">Discover incredible destinations curated by AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PLACES.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelected(p);
                  askBot(`Tell me about ${p.name} - what are the must-visit places and best time to go?`);
                }}
                className={`group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                  selected.id === p.id ? "ring-4 ring-blue-500 shadow-2xl" : ""
                }`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-slate-800">
                        from {p.price}
                      </span>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        ⭐ {p.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-lg text-slate-800 mb-1">{p.name}</div>
                  <div className="text-sm text-slate-500">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chatbot Panel */}
        <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-linear-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <div className="font-bold text-lg">Explore Assistant</div>
                <div className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </div>
              </div>
            </div>
            <div className="text-sm bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              📍 Currently viewing: <span className="font-semibold">{selected.name}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] text-sm px-4 py-3 rounded-2xl shadow-sm ${
                    m.role === "user"
                      ? "bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
                      : "bg-white text-slate-800 rounded-bl-sm border border-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:"0.1s"}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:"0.2s"}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askBot(input)}
                placeholder="Ask about places, food, history..."
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                onClick={() => askBot(input)}
                disabled={loading || !input.trim()}
                className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-5 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➤
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}