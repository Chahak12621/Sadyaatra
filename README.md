# SadYaatra AI Web Portal

> **Your AI-powered travel companion for exploring Incredible India**

SadYaatra AI Web is the landing and exploration portal for the SadYaatra platform. It allows users to discover destinations, interact with our general AI travel assistant, and experience high-fidelity 3D renderings of locations before downloading the mobile app for personalized trip planning.

---

## Features

### For Travelers (Web Exploration)
- **General Exploration** — Browse and discover various travel destinations across India.
- **AI Travel Assistant** — Chat with our Groq-powered AI for general travel queries and basic information.
- **Voice Bot** — (Coming Soon) Interact with the AI using voice commands.
- **Immersive 3D Rendering** — Explore destinations through high-fidelity 3D/AR models.
- **Seamless App Transition** — Once you are ready to personalize your trip and make bookings, seamlessly transition to the SadYaatra Mobile App.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Groq API (LLaMA 3.1 8B Instant) |
| Database | Supabase (PostgreSQL) |
| 3D Rendering | Three.js / Spline (Planned) |

---

## Getting Started

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

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Web App Flow

```text
Landing Page
    |
User explores static destinations (No Personalization)
    |
User interacts with AI Chatbot / Voicebot for general queries
    |
User explores places via 3D Rendering (Immersive View)
    |
User clicks "Start Planning" or attempts personalization
    |
Redirected to download SadYaatra Mobile App
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<div align="center">
  <strong>Built with love for Incredible India</strong><br/>
  <sub>Powered by Next.js, Supabase, and Groq AI</sub>
</div>
