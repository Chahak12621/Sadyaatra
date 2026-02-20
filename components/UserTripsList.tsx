"use client";
import { useState, useEffect } from "react";
import { getPendingTripRequests, acceptTripRequest, TripRequest, getUserById, UserProfile } from "@/lib/supabase";
import RealtimeChat from "./RealtimeChat";
import { supabase } from "@/lib/supabase";

interface UserTripWithProfile extends TripRequest {
  userProfile: UserProfile | null;
}

interface UserTripsListProps {
  currentAgentId: string;
  onTripAccepted?: (trip: TripRequest) => void;
}

export default function UserTripsList({ currentAgentId, onTripAccepted }: UserTripsListProps) {
  const [trips, setTrips] = useState<UserTripWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserTripWithProfile | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
    const channel = supabase
  .channel("pending_trips")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "trip_requests",
    filter: `status=eq.pending`,
  }, () => {
    loadTrips(); 
  })
  .subscribe();

return () => { supabase.removeChannel(channel); };
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const pendingTrips = await getPendingTripRequests();
      
      // Fetch user profiles for each trip
      const tripsWithProfiles = await Promise.all(
        pendingTrips.map(async (trip) => {
          const userProfile = await getUserById(trip.user_id);
          return { ...trip, userProfile };
        })
      );
      
      setTrips(tripsWithProfiles);
      setError(null);
    } catch (err) {
      console.error("Failed to load trips:", err);
      setError("Failed to load trip requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTrip = async (trip: UserTripWithProfile) => {
    if (!trip.userProfile) return;
    
    try {
      setAcceptingId(trip.id);
      await acceptTripRequest(trip.id, currentAgentId);
      
      // Set selected user and open chat
      setSelectedUser(trip);
      setShowChat(true);
      
      // Reload trips
      await loadTrips();
      onTripAccepted?.(trip);
    } catch (err) {
      console.error("Failed to accept trip:", err);
      alert("Failed to accept trip. Please try again.");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500 text-center">
          <div className="text-3xl mb-2">🔄</div>
          <div>Loading trip requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-700 font-semibold mb-2">⚠️ Error</div>
        <div className="text-red-600 text-sm">{error}</div>
        <button
          onClick={loadTrips}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center">
        <div className="text-5xl mb-3">🌍</div>
        <div className="text-slate-600 font-semibold mb-2">No pending requests</div>
        <div className="text-slate-500 text-sm">
          Check back soon! Trip requests will appear here when users book.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-slate-200"
          >
            <div className="flex">
              {/* Left: User Info */}
              <div className="flex-1 p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* User Avatar */}
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {trip.userProfile?.full_name.charAt(0) || "U"}
                  </div>

                  {/* User Details */}
                  <div className="flex-1">
                    <div className="font-bold text-lg text-slate-800">
                      {trip.userProfile?.full_name || "Unknown User"}
                    </div>
                    <div className="text-sm text-slate-600">{trip.userProfile?.email}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Customer since {new Date(trip.userProfile?.created_at || "").toLocaleDateString()}
                    </div>
                  </div>

                  {/* Trip Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-semibold text-orange-600">Requesting Now</span>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase mb-1">From</div>
                      <div className="font-semibold text-slate-800">{trip.from_location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase mb-1">To</div>
                      <div className="font-semibold text-slate-800">{trip.to_location}</div>
                    </div>
                    {trip.distance && (
                      <div>
                        <div className="text-xs text-slate-500 font-semibold uppercase mb-1">Distance</div>
                        <div className="font-semibold text-slate-800">{trip.distance} km</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase mb-1">Est. Fare</div>
                      <div className="font-bold text-green-600 text-lg">₹{trip.estimated_fare}</div>
                    </div>
                  </div>
                </div>

                {/* Time Requested */}
                <div className="text-xs text-slate-500">
                  Requested {new Date(trip.created_at).toLocaleTimeString()}
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex flex-col gap-3 p-6 bg-slate-50 justify-center shrink-0 w-40">
                <button
                  onClick={() => handleAcceptTrip(trip)}
                  disabled={acceptingId === trip.id}
                  className="px-4 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {acceptingId === trip.id ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Accepting...</span>
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      <span>Accept Trip</span>
                    </>
                  )}
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition">
                  Decline
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition">
                  ⏰ Later
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      {showChat && selectedUser && selectedUser.userProfile && (
        <RealtimeChat
          currentUserId={currentAgentId}
          currentUserRole="agent"
          otherUserId={selectedUser.user_id}
          otherUserName={selectedUser.userProfile.full_name}
          otherUserAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.user_id}`}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
}
