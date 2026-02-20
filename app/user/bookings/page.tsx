"use client";
import Sidebar from "@/components/Sidebar";
import AgentsList from "@/components/AgentsList";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";



type Tab = "flights" | "trains" | "hotels" | "agents" | "checkout";

interface Flight {
  id: number;
  airline: string;
  logo: string;
  departure: string;
  depTime: string;
  arrival: string;
  arrTime: string;
  duration: string;
  stops: number;
  badge?: string;
  price: number;
}

interface Train {
  id: number;
  name: string;
  number: string;
  departure: string;
  depTime: string;
  arrival: string;
  arrTime: string;
  duration: string;
  class: string;
  price: number;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  amenities: string[];
  image: string;
  pricePerNight: number;
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("flights");
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searched, setSearched] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("Traveler");
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>("https://api.dicebear.com/7.x/avataaars/svg?seed=user");
  const [showChat, setShowChat] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);


  // Selection state
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Get current user on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        setCurrentUserName(user.user_metadata?.full_name || "Traveler");
        setCurrentUserAvatar(user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Mock data
  const flights: Flight[] = [
    {
      id: 1,
      airline: "Air India",
      logo: "🛫",
      departure: "DEL",
      depTime: "08:00",
      arrival: "IXC",
      arrTime: "10:30",
      duration: "2h 30m",
      stops: 0,
      badge: "Best Connection",
      price: 5400,
    },
    {
      id: 2,
      airline: "IndiGo",
      logo: "✈️",
      departure: "DEL",
      depTime: "11:15",
      arrival: "IXC",
      arrTime: "13:45",
      duration: "2h 30m",
      stops: 0,
      badge: "Cheapest",
      price: 4200,
    },
    {
      id: 3,
      airline: "Vistara",
      logo: "🛩️",
      departure: "DEL",
      depTime: "14:00",
      arrival: "IXC",
      arrTime: "16:30",
      duration: "2h 30m",
      stops: 0,
      price: 6800,
    },
  ];

  const trains: Train[] = [
    {
      id: 1,
      name: "Kalka Mail",
      number: "12311",
      departure: "NDLS",
      depTime: "22:45",
      arrival: "KLK",
      arrTime: "05:15",
      duration: "6h 30m",
      class: "3AC",
      price: 850,
    },
    {
      id: 2,
      name: "Himalayan Queen",
      number: "14095",
      departure: "NDLS",
      depTime: "06:00",
      arrival: "KLK",
      arrTime: "11:30",
      duration: "5h 30m",
      class: "Chair Car",
      price: 450,
    },
  ];

  const hotels: Hotel[] = [
    {
      id: 1,
      name: "The Oberoi Cecil",
      location: "Chaura Maidan, Shimla",
      rating: 4.8,
      amenities: ["Pool", "Spa", "Restaurant", "WiFi"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      pricePerNight: 18500,
    },
    {
      id: 2,
      name: "Wildflower Hall",
      location: "Mashobra, Shimla",
      rating: 4.9,
      amenities: ["Mountain View", "Spa", "Gym", "WiFi"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      pricePerNight: 22000,
    },
    {
      id: 3,
      name: "Clarkes Hotel",
      location: "The Mall, Shimla",
      rating: 4.6,
      amenities: ["Drivers", "WiFi", "Restaurant"],
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      pricePerNight: 8500,
    }
  ];



  const handleSearch = () => {
    if (searchFrom && searchTo && searchDate) {
      setSearched(true);
    }
  };

  const tabs = [
    { id: "flights", icon: "✈️", label: "FLIGHTS" },
    { id: "trains", icon: "🚂", label: "TRAINS" },
    { id: "hotels", icon: "🏨", label: "HOTELS" },
  ];


  const totalCost =
    (selectedFlight?.price || 0) +
    (selectedTrain?.price || 0) +
    (selectedHotel?.pricePerNight || 0);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/sadyaatra-logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
            <div className="font-bold text-xl text-slate-800">SadYaatra AI</div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-80 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <span className="text-xl">🔔</span>
            </button>
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Search section (shows before searching) */}
          {!searched ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Plan Your Trip</h1>
              <p className="text-slate-600 mb-8">
                Search for flights, trains, and hotels all in one place
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">From</label>
                  <input
                    type="text"
                    placeholder="Delhi"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">To</label>
                  <input
                    type="text"
                    placeholder="Manali"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={!searchFrom || !searchTo || !searchDate}
                    className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Search Bookings →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">✈️</div>
                  <div className="font-bold text-slate-800">Flights</div>
                  <div className="text-sm text-slate-600">200+ airlines</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">🚂</div>
                  <div className="font-bold text-slate-800">Trains</div>
                  <div className="text-sm text-slate-600">IRCTC integrated</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">🏨</div>
                  <div className="font-bold text-slate-800">Hotels</div>
                  <div className="text-sm text-slate-600">5000+ properties</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Trip header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Trip to {searchTo || "Manali"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>📍 {searchFrom || "Delhi"}</span>
                  <span>→</span>
                  <span>{searchTo || "Chandigarh"}</span>
                  <span>→</span>
                  <span>{searchTo || "Manali"}</span>
                </div>
              </div>

              <div className="flex gap-6">
                {/* Left: Booking options */}
                <div className="flex-1">
                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition ${activeTab === tab.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* Flights */}
                    {activeTab === "flights" && (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold text-slate-800">Select Your Flight</h2>
                          <div className="flex gap-2 text-sm">
                            <button className="text-blue-600 font-semibold">Sort by Price</button>
                            <span className="text-slate-400">|</span>
                            <button className="text-slate-600">Duration</button>
                          </div>
                        </div>
                        {flights.map((flight) => (
                          <div
                            key={flight.id}
                            className={`bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer ${selectedFlight?.id === flight.id
                              ? "ring-2 ring-blue-500"
                              : ""
                              }`}
                            onClick={() => setSelectedFlight(flight)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-4xl">{flight.logo}</div>
                                <div>
                                  <div className="font-bold text-slate-800">{flight.airline}</div>
                                  {flight.badge && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                      {flight.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-slate-800">
                                  ₹{flight.price.toLocaleString()}
                                </div>
                                <button className="mt-1 text-sm text-blue-600 font-semibold hover:underline">
                                  Select
                                </button>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm">
                              <div>
                                <div className="font-bold text-slate-800">
                                  {flight.departure} {flight.depTime}
                                </div>
                                <div className="text-slate-500">DEP / RATING</div>
                              </div>
                              <div className="text-center">
                                <div className="text-slate-500">{flight.duration}</div>
                                <div className="flex items-center gap-1 text-slate-400 text-xs">
                                  <span>—————</span>
                                  <span>✈️</span>
                                  <span>—————</span>
                                </div>
                                <div className="text-slate-500">
                                  {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-slate-800">
                                  {flight.arrival} {flight.arrTime}
                                </div>
                                <div className="text-slate-500">ARR / DURATION</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Trains */}
                    {activeTab === "trains" && (
                      <>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Select Your Train</h2>
                        {trains.map((train) => (
                          <div
                            key={train.id}
                            className={`bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer ${selectedTrain?.id === train.id ? "ring-2 ring-blue-500" : ""
                              }`}
                            onClick={() => setSelectedTrain(train)}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="font-bold text-lg text-slate-800">{train.name}</div>
                                <div className="text-sm text-slate-500">#{train.number}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-slate-800">
                                  ₹{train.price.toLocaleString()}
                                </div>
                                <div className="text-xs text-slate-500">{train.class}</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <div className="font-bold text-slate-800">
                                  {train.departure} {train.depTime}
                                </div>
                                <div className="text-slate-500">Departure</div>
                              </div>
                              <div className="text-center text-slate-500">{train.duration}</div>
                              <div className="text-right">
                                <div className="font-bold text-slate-800">
                                  {train.arrival} {train.arrTime}
                                </div>
                                <div className="text-slate-500">Arrival</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Hotels */}
                    {activeTab === "hotels" && (
                      <>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Select Your Hotel</h2>
                        {hotels.map((hotel) => (
                          <div
                            key={hotel.id}
                            className={`bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer ${selectedHotel?.id === hotel.id ? "ring-2 ring-blue-500" : ""
                              }`}
                            onClick={() => setSelectedHotel(hotel)}
                          >
                            <div className="flex">
                              <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-48 h-48 object-cover"
                              />
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="font-bold text-lg text-slate-800">
                                      {hotel.name}
                                    </div>
                                    <div className="text-sm text-slate-500">{hotel.location}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800">
                                      ₹{hotel.pricePerNight.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500">/ night</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                  <span className="text-orange-500">⭐</span>
                                  <span className="font-semibold text-slate-800">{hotel.rating}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {hotel.amenities.map((amenity) => (
                                    <span
                                      key={amenity}
                                      className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}





                    {/* Checkout */}
                    {activeTab === "checkout" && (
  <div className="bg-white rounded-xl p-8 shadow">
    {!bookingConfirmed ? (
      <>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Review Your Booking</h2>
        <div className="space-y-4">
          {selectedFlight && (
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✈️</span>
                <div>
                  <div className="font-semibold">{selectedFlight.airline}</div>
                  <div className="text-sm text-slate-600">{selectedFlight.departure} → {selectedFlight.arrival}</div>
                </div>
              </div>
              <div className="font-bold">₹{selectedFlight.price.toLocaleString()}</div>
            </div>
          )}
          {selectedTrain && (
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚂</span>
                <div>
                  <div className="font-semibold">{selectedTrain.name}</div>
                  <div className="text-sm text-slate-600">{selectedTrain.class}</div>
                </div>
              </div>
              <div className="font-bold">₹{selectedTrain.price.toLocaleString()}</div>
            </div>
          )}
          {selectedHotel && (
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏨</span>
                <div>
                  <div className="font-semibold">{selectedHotel.name}</div>
                  <div className="text-sm text-slate-600">1 night</div>
                </div>
              </div>
              <div className="font-bold">₹{selectedHotel.pricePerNight.toLocaleString()}</div>
            </div>
          )}
        </div>
        <div className="mt-6 pt-6 border-t flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">Total Amount</div>
          <div className="text-3xl font-bold text-blue-600">₹{totalCost.toLocaleString()}</div>
        </div>
        <button
          onClick={() => setTimeout(() => setBookingConfirmed(true), 800)}
          className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg"
        >
          Pay Now →
        </button>
      </>
    ) : (
      /* ── Booking Confirmed Screen ── */
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 mb-8">Your trip is all set. Here's your booking summary.</p>

        <div className="text-left space-y-3 mb-8">
          {selectedFlight && (
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✈️</span>
                <div>
                  <div className="font-semibold text-slate-800">{selectedFlight.airline}</div>
                  <div className="text-sm text-slate-500">{selectedFlight.departure} → {selectedFlight.arrival}</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-800">₹{selectedFlight.price.toLocaleString()}</div>
                <div className="text-xs text-green-600 text-right">Confirmed</div>
              </div>
            </div>
          )}
          {selectedTrain && (
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚂</span>
                <div>
                  <div className="font-semibold text-slate-800">{selectedTrain.name}</div>
                  <div className="text-sm text-slate-500">{selectedTrain.class}</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-800">₹{selectedTrain.price.toLocaleString()}</div>
                <div className="text-xs text-green-600 text-right">Confirmed</div>
              </div>
            </div>
          )}
          {selectedHotel && (
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏨</span>
                <div>
                  <div className="font-semibold text-slate-800">{selectedHotel.name}</div>
                  <div className="text-sm text-slate-500">1 night</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-800">₹{selectedHotel.pricePerNight.toLocaleString()}</div>
                <div className="text-xs text-green-600 text-right">Confirmed</div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center p-4 bg-slate-800 rounded-xl">
            <div className="font-bold text-white text-lg">Total Paid</div>
            <div className="text-2xl font-black text-white">₹{totalCost.toLocaleString()}</div>
          </div>
        </div>

        <button
          onClick={() => window.location.href = "/user/agents"}
          className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition"
        >
          Find a Driver →
        </button>
      </div>
    )}
  </div>
)}
</div>
</div>
                {/* Right: Selection summary */}
                <div className="w-80">
                  <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow sticky top-6">
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src="/sadyaatra-logo.png"
                        alt="AI"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-bold text-slate-800">SADYAATRA AI</div>
                        <div className="text-xs text-slate-600">I'm optimizing your timing!</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 mb-4">
                      <div className="text-sm font-bold text-slate-500 uppercase mb-3">
                        SELECTION SUMMARY
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">✈️ Flight</span>
                          <span className="font-semibold">
                            {selectedFlight ? "Selected" : "Not Selected"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">🚂 Train</span>
                          <span className="font-semibold">
                            {selectedTrain ? "Selected" : "Not Selected"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">🏨 Hotel</span>
                          <span className="font-semibold">
                            {selectedHotel ? "Selected" : "Not Selected"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 mb-4">
                      <div className="text-sm font-bold text-slate-500 mb-2">Est. Total</div>
                      <div className="text-3xl font-bold text-slate-800">
                        ₹{totalCost.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("checkout")}
                      disabled={totalCost === 0}
                      className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Plan →
                    </button>

                    <div className="mt-4 bg-blue-100 rounded-lg p-3 text-xs text-blue-800">
                      💡 <strong>AI INSIGHT:</strong> "Booking these specific options together saves
                      you ₹1,200 in transit fare compared to separate bookings."
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}