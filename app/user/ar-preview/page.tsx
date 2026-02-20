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