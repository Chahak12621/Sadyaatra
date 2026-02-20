"use client";
import Sidebar from "@/components/Sidebar";
import { useState, useRef, useEffect } from "react";

interface Msg {
  role: "user" | "bot";
  text: string;
}

interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  location: string;
  day: number;
}

interface TripData {
  destination: string;
  days: number;
  people: number;
  estimatedCost: number;
  costBreakdown: {
    hotel: number;
    transport: number;
    food: number;
    activities: number;
  };
  itinerary: ItineraryItem[];
}

// System prompt that guides the AI to ask the right questions
const SYSTEM_PROMPT = `You are SadYaatra AI, an expert Indian travel planner. Your job is to collect trip details from the user through a friendly conversation, then generate a complete itinerary.

Follow this EXACT conversation flow:
1. First ask: where they want to go
2. Then ask: how many days
3. Then ask: how many people (adults/children)
4. Then ask: their budget preference (budget/mid-range/luxury)
5. Once you have all 4 answers, generate the itinerary

When you have all details, respond with ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "type": "itinerary",
  "destination": "City, State",
  "days": 3,
  "people": 2,
  "estimatedCost": 45000,
  "costBreakdown": {
    "hotel": 18000,
    "transport": 12000,
    "food": 8000,
    "activities": 7000
  },
  "itinerary": [
    {
      "day": 1,
      "time": "09:00 AM",
      "title": "Activity title",
      "description": "What to do and see here",
      "location": "Specific place name"
    }
  ]
}

Include 3-5 activities per day. Calculate costs realistically based on Indian prices and the budget preference given. For budget: ~₹2000/person/day, mid-range: ~₹5000/person/day, luxury: ~₹12000/person/day.

If the user asks anything else during data collection, answer briefly then steer back to collecting the missing details. Be warm, enthusiastic, and use occasional Hindi words like "Namaste", "bilkul", "zabardast".`;

export default function PlanTripPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Namaste! 🙏 I'm your SadYaatra AI assistant. Let's plan your perfect trip!\n\nWhere would you like to explore? Tell me your dream destination! 🗺️",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const askBot = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", text };
    const updatedMsgs = [...msgs, userMsg];
    setMsgs(updatedMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/plan-trip-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs,
          systemPrompt: SYSTEM_PROMPT,
        }),
      });
      const data = await res.json();
      const reply: string = data.reply;

      // Try to parse itinerary JSON from AI response
      try {
        const parsed = JSON.parse(reply.trim());
        if (parsed.type === "itinerary") {
          setTripData(parsed);
          setActiveDay(1);
          setMsgs((m) => [
            ...m,
            {
              role: "bot",
              text: `Zabardast! 🎉 I've created your personalized ${parsed.days}-day itinerary for ${parsed.destination}! Check it out on the right panel. You can assign this to an agent when you're ready.`,
            },
          ]);
          return;
        }
      } catch {
        // Not JSON, normal conversation reply
      }

      setMsgs((m) => [...m, { role: "bot", text: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "bot", text: "Oops 😅 Thoda load hai, please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Get itinerary items for the active day
  const dayItems = tripData?.itinerary.filter((item) => item.day === activeDay) ?? [];
  const uniqueDays = tripData ? Array.from(new Set(tripData.itinerary.map((i) => i.day))).sort() : [];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <section className="flex-1 flex flex-col bg-white min-w-0">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-linear-to-r from-blue-50 to-purple-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200">
                <img src="/sadyaatra-logo.png" alt="AI" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-lg text-slate-800">AI Trip Planner</div>
                <div className="text-xs text-slate-500">Powered by SadYaatra AI</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-600 font-semibold">AI Online</span>
            </div>
          </div>

          {/* Progress indicator */}
          {!tripData && (
            <div className="px-6 py-3 bg-blue-50 border-b flex items-center gap-6 text-xs text-slate-500 shrink-0">
              <span className={msgs.length >= 2 ? "text-blue-600 font-bold" : ""}>1. Destination</span>
              <span>→</span>
              <span className={msgs.length >= 4 ? "text-blue-600 font-bold" : ""}>2. Duration</span>
              <span>→</span>
              <span className={msgs.length >= 6 ? "text-blue-600 font-bold" : ""}>3. Group size</span>
              <span>→</span>
              <span className={msgs.length >= 8 ? "text-blue-600 font-bold" : ""}>4. Budget</span>
              <span>→</span>
              <span className={tripData ? "text-green-600 font-bold" : ""}>5. Itinerary ✨</span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center mr-3 shrink-0 self-end">
                    <img src="/sadyaatra-logo.png" alt="AI" className="w-6 h-6 rounded-full" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-slate-800 rounded-bl-sm border border-slate-200"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
                  <div className={`text-xs mt-1 ${m.role === "user" ? "text-blue-200" : "text-slate-400"}`}>
                    {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center ml-3 shrink-0 self-end text-white font-bold text-sm">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center mr-3 shrink-0">
                  <img src="/sadyaatra-logo.png" alt="AI" className="w-6 h-6 rounded-full" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t bg-white shrink-0">
            <div className="text-xs text-slate-500 mb-2">
              Tell me your destination, trip duration, group size, and budget preference.
            </div>
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askBot(input)}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => askBot(input)}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send →
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Itinerary Panel — only shows when AI has generated data */}
        {tripData && (
          <aside className="w-96 bg-white border-l overflow-y-auto shrink-0">
            {/* Header */}
            <div className="p-6 border-b bg-linear-to-r from-blue-50 to-purple-50 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-lg text-slate-800">Your Itinerary</div>
                <button
                  onClick={() => setTripData(null)}
                  className="text-xs text-slate-400 hover:text-red-500 font-semibold transition"
                >
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                <span>📅 {tripData.days} Days</span>
                <span>•</span>
                <span>👥 {tripData.people} People</span>
                <span>•</span>
                <span>📍 {tripData.destination}</span>
              </div>

              {/* Day tabs */}
              <div className="flex gap-2 flex-wrap">
                {uniqueDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      activeDay === day
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Day {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Activities */}
            <div className="p-6">
              <div className="text-xs font-bold text-slate-500 uppercase mb-4">
                Day {activeDay} Schedule
              </div>
              <div className="space-y-4">
                {dayItems.map((item, i) => (
                  <div key={i} className="relative pl-8 pb-5 border-l-2 border-blue-200 last:border-0">
                    <div className="absolute left-0 top-0 w-8 h-8 -ml-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
                      {i + 1}
                    </div>
                    <div className="mb-1">
                      <span className="text-xs font-bold text-blue-600">{item.time}</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Confirmed</span>
                    </div>
                    <div className="font-semibold text-sm text-slate-800 mb-1">{item.title}</div>
                    <div className="text-xs text-slate-600 leading-relaxed mb-2">{item.description}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span>📍</span><span>{item.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="px-6 pb-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-3">Cost Estimate</div>
                <div className="space-y-2 mb-3">
                  {[
                    { label: "🏨 Hotel", value: tripData.costBreakdown.hotel },
                    { label: "🚗 Transport", value: tripData.costBreakdown.transport },
                    { label: "🍽️ Food", value: tripData.costBreakdown.food },
                    { label: "🎭 Activities", value: tripData.costBreakdown.activities },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold text-slate-800">₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="font-bold text-slate-700">Total</span>
                  <span className="text-xl font-bold text-blue-600">₹{tripData.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 text-right">
                  ₹{Math.round(tripData.estimatedCost / tripData.people).toLocaleString()} per person
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <button
                onClick={() => window.location.href = "/user/agents"}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Assign to Agent →</span>
              </button>
              <p className="text-xs text-slate-400 text-center mt-2">
                Browse verified drivers and chat before booking
              </p>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}