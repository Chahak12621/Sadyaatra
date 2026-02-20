


import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Types ─────────────────────────────────────────────────

export type UserRole = "user" | "agent";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "user";
  created_at: string;
}

export interface AgentProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  vehicle_type: string;
  vehicle_number: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_color: string;
  seating_capacity: string;
  aadhar_number: string;
  pan_number: string;
  licence_number: string;
  licence_expiry: string;
  aadhar_front_url: string | null;
  aadhar_back_url: string | null;
  licence_image_url: string | null;
  vehicle_rc_url: string | null;
  vehicle_insurance_url: string | null;
  profile_photo_url: string | null;
  role: "agent";
  status: "pending_review" | "approved" | "rejected";
  created_at: string;
}

// ── Auth helpers ──────────────────────────────────────────

/** Register a regular traveller */
export async function signUpUser(
  email: string,
  password: string,
  fullName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "user" } },
  });
  if (error) throw error;

  const { error: dbErr } = await supabase.from("user_profiles").insert({
    id: data.user!.id,
    email,
    full_name: fullName,
    role: "user",
  });
  if (dbErr) throw dbErr;

  return data.user!;
}

/** Sign in — works for both roles */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/** Read role from user_metadata (set at sign-up) */
export async function getMyRole(): Promise<UserRole | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return (user.user_metadata?.role as UserRole) ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ── Storage helper ────────────────────────────────────────

/**
 * Uploads a File to Supabase Storage bucket "agent-docs"
 * and returns the public URL.
 * Path format: {userId}/{fieldName}.{ext}
 */
export async function uploadAgentDoc(
  userId: string,
  fieldName: string,
  file: File
): Promise<string> {
  const ext  = file.name.split(".").pop() ?? "bin";
  const path = `${userId}/${fieldName}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("agent-docs")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (upErr) throw new Error(upErr.message);

  const { data } = supabase.storage
    .from("agent-docs")
    .getPublicUrl(path);

  return data.publicUrl;
}

// ── Agent registration (step 4 submit) ───────────────────

export interface AgentFormData {
  fullName: string; email: string; phone: string; dob: string;
  gender: string; address: string; city: string; state: string; pincode: string;
  password: string;
  vehicleType: string; vehicleNumber: string; vehicleModel: string;
  vehicleYear: string; vehicleColor: string; seatingCapacity: string;
  aadharNumber: string; panNumber: string;
  licenceNumber: string; licenceExpiry: string;
  aadharFrontFile: File | null; aadharBackFile: File | null;
  licenceImageFile: File | null; vehicleRCFile: File | null;
  vehicleInsuranceFile: File | null; profilePhotoFile: File | null;
}

export async function registerAgent(form: AgentFormData) {
  // 1 — Create auth user
  const { data, error: authErr } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: { data: { full_name: form.fullName, role: "agent" } },
  });
  if (authErr) throw authErr;
  const uid = data.user!.id;

  // 2 — Upload all documents in parallel
  const upload = async (field: string, file: File | null) =>
    file ? uploadAgentDoc(uid, field, file) : null;

  const [
    aadharFrontUrl, aadharBackUrl, licenceImageUrl,
    vehicleRCUrl, vehicleInsuranceUrl, profilePhotoUrl,
  ] = await Promise.all([
    upload("aadhar_front",       form.aadharFrontFile),
    upload("aadhar_back",        form.aadharBackFile),
    upload("licence_image",      form.licenceImageFile),
    upload("vehicle_rc",         form.vehicleRCFile),
    upload("vehicle_insurance",  form.vehicleInsuranceFile),
    upload("profile_photo",      form.profilePhotoFile),
  ]);

  // 3 — Insert agent profile row
  const { error: dbErr } = await supabase.from("agent_profiles").insert({
    id: uid,
    email: form.email,
    full_name: form.fullName,
    phone: form.phone,
    dob: form.dob,
    gender: form.gender,
    address: form.address,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    vehicle_type: form.vehicleType,
    vehicle_number: form.vehicleNumber,
    vehicle_model: form.vehicleModel,
    vehicle_year: form.vehicleYear,
    vehicle_color: form.vehicleColor,
    seating_capacity: form.seatingCapacity,
    aadhar_number: form.aadharNumber,
    pan_number: form.panNumber,
    licence_number: form.licenceNumber,
    licence_expiry: form.licenceExpiry,
    aadhar_front_url: aadharFrontUrl,
    aadhar_back_url: aadharBackUrl,
    licence_image_url: licenceImageUrl,
    vehicle_rc_url: vehicleRCUrl,
    vehicle_insurance_url: vehicleInsuranceUrl,
    profile_photo_url: profilePhotoUrl,
    role: "agent",
    status: "pending_review",
  });
  if (dbErr) throw dbErr;

  return uid;
}

/** Get all approved agents */
export async function getApprovedAgents(): Promise<AgentProfile[]> {
  const { data, error } = await supabase
    .from("agent_profiles")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as AgentProfile[];
}

/** Get single agent by ID */
export async function getAgentById(agentId: string): Promise<AgentProfile | null> {
  const { data, error } = await supabase
    .from("agent_profiles")
    .select("*")
    .eq("id", agentId)
    .single();
  
  if (error && error.code !== "PGRST116") throw error;
  return data as AgentProfile | null;
}

/** Get all users (for agents to see) */
export async function getAvailableUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as UserProfile[];
}

/** Get single user by ID */
export async function getUserById(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error && error.code !== "PGRST116") throw error;
  return data as UserProfile | null;
}

// ─────────────────────────────────────────────────────────
// TRIP REQUEST SYSTEM
// ─────────────────────────────────────────────────────────

export interface TripRequest {
  id: string;
  user_id: string;
  agent_id?: string;
  from_location: string;
  to_location: string;
  distance?: number;
  estimated_fare: number;
  status: "pending" | "accepted" | "completed" | "cancelled";
  created_at: string;
  accepted_at?: string;
}

/** Create a new trip request from user */
export async function createTripRequest(
  userId: string,
  fromLocation: string,
  toLocation: string,
  estimatedFare: number,
  distance?: number
) {
  const { error } = await supabase.from("trip_requests").insert({
    user_id: userId,
    from_location: fromLocation,
    to_location: toLocation,
    distance,
    estimated_fare: estimatedFare,
    status: "pending",
  });
  if (error) throw error;
}

/** Get pending trip requests for agents */
export async function getPendingTripRequests(): Promise<TripRequest[]> {
  const { data, error } = await supabase
    .from("trip_requests")
    .select("*")
    .eq("status", "pending")
    .is("agent_id", null)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as TripRequest[];
}

/** Accept a trip request */
export async function acceptTripRequest(tripId: string, agentId: string) {
  const { error } = await supabase
    .from("trip_requests")
    .update({ agent_id: agentId, status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", tripId);
  
  if (error) throw error;
}

/** Get trip requests accepted by agent */
export async function getAgentTrips(agentId: string): Promise<TripRequest[]> {
  const { data, error } = await supabase
    .from("trip_requests")
    .select("*")
    .eq("agent_id", agentId)
    .in("status", ["accepted", "completed"])
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as TripRequest[];
}
// ─────────────────────────────────────────────────────────
// REALTIME CHAT HELPERS
// ─────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_role: "user" | "agent";
  receiver_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

/** Send a chat message */
export async function sendChatMessage(
  senderId: string,
  senderRole: "user" | "agent",
  receiverId: string,
  message: string
) {
  const { error } = await supabase.from("chat_messages").insert({
    sender_id: senderId,
    sender_role: senderRole,
    receiver_id: receiverId,
    message,
    read: false,
  });
  if (error) throw error;
}

/** Get chat history between two users */
export async function getChatHistory(userId: string, agentId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${agentId}),and(sender_id.eq.${agentId},receiver_id.eq.${userId})`
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as ChatMessage[];
}
/** Subscribe to new messages in realtime */
export function subscribeToChatMessages(
  userId: string,
  agentId: string,
  callback: (message: ChatMessage) => void
) {
  const channel = supabase
    .channel(`chat_${userId}_${agentId}`)
    // Direction 1: user → agent
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "chat_messages",
      filter: `sender_id=eq.${userId}`,
    }, (payload) => {
      const msg = payload.new as ChatMessage;
      if (msg.receiver_id === agentId) callback(msg);
    })
    // Direction 2: agent → user
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "chat_messages",
      filter: `sender_id=eq.${agentId}`,
    }, (payload) => {
      const msg = payload.new as ChatMessage;
      if (msg.receiver_id === userId) callback(msg);
    })
    .subscribe();

  return channel;
}

/** Mark messages as read */
export async function markMessagesAsRead(receiverId: string, senderId: string) {
  const { error } = await supabase
    .from("chat_messages")
    .update({ read: true })
    .eq("receiver_id", receiverId)
    .eq("sender_id", senderId);
  
  if (error) throw error;
}