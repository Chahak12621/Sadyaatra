# 🛕 SadYaatra AI

> **Your AI-powered travel companion for exploring Incredible India**

SadYaatra AI is a full-stack travel platform that combines conversational AI trip planning, real-time agent-user chat, flight/train/hotel bookings, and a verified driver network — all in one seamless experience.

---

## ✨ Features

### 👤 For Travelers
- 🤖 **AI Trip Planner** — Chat with Groq-powered LLaMA AI to generate personalized day-by-day itineraries based on destination, duration, group size, and budget
- ✈️ **Smart Bookings** — Browse and select flights, trains, and hotels in one unified interface
- 💬 **Chat with Drivers** — Browse verified agents and open real-time side-panel chat before booking
- 📋 **Booking Confirmation** — Full trip summary with cost breakdown after checkout
- 📊 **Traveler History** — View past trips, agent ratings, and activity logs

### 🚗 For Agents (Drivers)
- 📥 **Live Chat Inbox** — See all incoming user messages in real-time, no trip request table needed
- 💬 **Realtime Messaging** — Reply to users instantly via Supabase Realtime WebSocket
- 📈 **Agent Dashboard** — Dark-themed portal with earnings overview, trip history, and performance metrics
- 🟢 **Online/Offline Toggle** — Control availability status

### 🔐 Authentication
- Separate sign-up flows for **users** and **agents**
- Agent registration with document uploads (Aadhar, PAN, licence, vehicle RC)
- Admin approval workflow for agents (`pending_review` → `approved`)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime (WebSockets) |
| Storage | Supabase Storage |
| AI | Groq API (LLaMA 3.1 8B Instant) |
| Client | `@supabase/ssr` (browser client) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Groq](https://console.groq.com) API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/sadyaatra.git
cd sadyaatra
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Set up Supabase

Run the following SQL in your **Supabase SQL Editor**:

```sql
-- Enable Realtime on chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- RLS: Allow users to send messages
CREATE POLICY "Send own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS: Allow users to read their own messages  
CREATE POLICY "Read own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- RLS: Allow anyone to view approved agents
CREATE POLICY "Public can view approved agents"
  ON public.agent_profiles FOR SELECT
  USING (status = 'approved');

-- Approve all registered agents (for testing)
UPDATE agent_profiles SET status = 'approved';
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
sadyaatra/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/          # User traveler history
│   │   ├── bookings/           # Flights, trains, hotels + checkout
│   │   ├── plan-trip/          # AI chat trip planner
│   │   └── agents/             # Browse & chat with drivers
│   ├── agent/
│   │   └── dashboard/          # Agent portal with chat inbox
│   ├── api/
│   │   └── plan-trip-chat/     # Groq AI route
│   └── auth/                   # Login / signup pages
├── components/
│   ├── AgentsList.tsx          # Driver cards with inline chat
│   ├── AgentChatInbox.tsx      # Agent-side message inbox
│   ├── RealtimeChat.tsx        # Shared chat component (inline + modal)
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── UserTripsList.tsx       # Trip request list (agent side)
└── lib/
    └── supabase.ts             # Supabase client + all DB helpers
```

---

## 💬 Realtime Chat Architecture

```
User (AgentsList page)                    Agent (Dashboard)
        │                                        │
        │  clicks "Chat with Driver"             │
        │──────────────────────────────────────▶ │
        │                                        │
        │        Supabase chat_messages          │
        │◀──────── INSERT (realtime) ───────────▶│
        │                                        │
        │  subscribeToChatMessages()             │
        │  dual .on() listeners                  │
        │  (sender→receiver both directions)     │
```

Messages flow through **Supabase Realtime** with `postgres_changes` subscriptions — no polling, no third-party services.

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `user_profiles` | Traveler accounts |
| `agent_profiles` | Driver profiles with documents + approval status |
| `chat_messages` | All messages between users and agents |

---

## 🌍 App Flow

```
Landing Page
    ↓
Sign Up (User or Agent)
    ↓
User: Plan Trip (AI Chat) → Get Itinerary → Book (Flights/Trains/Hotels)
    ↓                                              ↓
    └──────────────── Pay Now ────────────▶ Booking Confirmed
                                                   ↓
                                         Find a Driver (/agents)
                                                   ↓
                                         Chat with Driver (Realtime)
                                                   ↓
                                    Agent sees message in Dashboard Inbox
                                                   ↓
                                         Agent replies in realtime
```

---

## 🔑 Key Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `GROQ_API_KEY` | Groq API key for LLaMA AI |

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| AI Trip Planner | Chat interface with dynamic itinerary panel |
| Bookings | Flight/train/hotel selection with live cost summary |
| Agents Page | Driver cards with inline side-panel chat |
| Agent Dashboard | Dark-themed portal with live chat inbox |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <strong>Built with ❤️ for Incredible India 🇮🇳</strong><br/>
  <sub>Powered by Next.js • Supabase • Groq AI</sub>
</div>