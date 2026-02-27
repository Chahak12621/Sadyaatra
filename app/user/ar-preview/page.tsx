"use client";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

const PLACES = [
  {
    id: 1,
    name: "Taj Mahal, Agra",
    subtitle: "Wonder of the World's Mughal Architecture",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
    tags: ["Historical", "UNESCO Site", "Romantic"],
    lat: 27.1751,
    lon: 78.0421,
  },
  {
    id: 2,
    name: "Jaipur, Rajasthan",
    subtitle: "The Pink City of royal palaces",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
    tags: ["Royal Heritage", "Forts", "Culture"],
    lat: 26.9124,
    lon: 75.7873,
  },
  {
    id: 3,
    name: "Kerala Backwaters",
    subtitle: "Serene houseboats through lush greenery",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    tags: ["Nature", "Houseboats", "Ayurveda"],
    lat: 9.4981,
    lon: 76.3388,
  },
  {
    id: 4,
    name: "Varanasi, UP",
    subtitle: "Ancient spiritual capital on the Ganges",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be",
    tags: ["Spiritual", "Temples", "Ganges"],
    lat: 25.3176,
    lon: 82.9739,
  },
  {
    id: 5,
    name: "Lake View, Bhopal",
    desc: "Welcome to the city of lakes , Bhopal ",
    image: "data:image/jpeg;base64,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",
    tags: ["Spiritual", "Lakes", "Nature"],
    lat: 23.2599,
    lon: 77.4126,
  },
  {
    id: 6,
    name: "B-Fall, Pachmarhi",
    desc: "Queen of Satpura , Pachmarhi",
    image: "data:image/jpeg;base64,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",
    tags: ["AR", "Travel", "AI"],
    lat: 48.8584,
    lon: 2.2945,
  },
];

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
}

export default function ARPreviewPage() {
  const [selected, setSelected] = useState(PLACES[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    fetchWeather(selected.lat, selected.lon);
  }, [selected]);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoadingWeather(true);
    try {
      // Using Open-Meteo (completely free, no API key needed)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
      );
      const data = await res.json();
      const code = data.current.weather_code;
      const conditions: Record<number, string> = {
        0: "Clear", 1: "Partly Cloudy", 2: "Cloudy", 3: "Overcast",
        45: "Foggy", 48: "Foggy", 51: "Drizzle", 61: "Rainy", 80: "Showers",
      };
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        condition: conditions[code] || "Partly Cloudy",
        humidity: data.current.relative_humidity_2m,
      });
    } catch {
      setWeather({ temp: 25, condition: "Partly Cloudy", humidity: 65 });
    } finally {
      setLoadingWeather(false);
    }
  };

  const getCrowdLevel = () => {
    const levels = ["Low", "Moderate", "High"];
    return levels[Math.floor(Math.random() * 3)];
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-80 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selected.name}
              readOnly
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

        <div className="p-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Image with AR points */}
            <div className="col-span-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-150 object-cover"
                />
                {/* AR Info Points */}
                <div className="absolute top-12 right-12 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-pulse cursor-pointer">
                  ℹ️
                </div>
                <div className="absolute top-40 left-20 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-pulse cursor-pointer">
                  📍
                </div>
                <div className="absolute bottom-32 right-32 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-pulse cursor-pointer">
                  🗺️
                </div>
                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 text-white">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      📍 1862 Total AR Enhancements Added
                    </span>
                    <span className="flex items-center gap-2">
                      📷 AI Enhancement Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Place selector */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                {PLACES.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-lg transition ${
                      selected.id === p.id ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-24 object-cover" />
                    <div className="p-2 bg-white">
                      <div className="text-xs font-semibold truncate">{p.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info panel */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{selected.name}</h1>
                <p className="text-sm text-slate-600 mt-1">{selected.subtitle}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Weather & Crowds */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="text-xs text-slate-500 mb-1">🌤️ Weather</div>
                  {loadingWeather ? (
                    <div className="text-sm">Loading...</div>
                  ) : weather ? (
                    <>
                      <div className="text-2xl font-bold">{weather.temp}°C</div>
                      <div className="text-xs text-slate-600">☁️ {weather.condition}</div>
                    </>
                  ) : null}
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="text-xs text-slate-500 mb-1">👥 Crowds</div>
                  <div className="text-2xl font-bold">{getCrowdLevel()}</div>
                  <div className="w-full bg-slate-200 h-1 rounded-full mt-2">
                    <div className="bg-orange-500 h-1 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>

              {/* Yaatra AI Assistant */}
              <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="text-sm font-semibold text-slate-800 mb-2">
                  YAATRA AI ASSISTANT
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Welcome to {selected.name}! I'm your AR assistant. I can show you the best{" "}
                  {selected.tags[0].toLowerCase()} spots or local hidden gems. What would you like
                  to explore?
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Best food spots", "March weather", "Temples tour"].map((chip) => (
                    <button
                      key={chip}
                      className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-50 transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Tip */}
              <div className="bg-blue-500 text-white rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">✈️</div>
                <div>
                  <div className="font-semibold text-sm mb-1">March Travel Tip</div>
                  <p className="text-xs opacity-90">
                    Cherry blossoms peak around March 25th. Book early!
                  </p>
                </div>
              </div>

              {/* CTA Button */}
             
              <div className="text-center text-xs text-slate-500">
                Powered by SadYaatra AI Engine • Version 4.0 AI
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}