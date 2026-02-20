"use client";
import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

import React, {
  useEffect,
  useRef,
  useState,
  MouseEvent as RMouseEvent,
} from "react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface DestinationCard {

  name: string;
  country: string;
  flag: string;
  image: string;
  gradient?: string;
  badge: string;
  rating: string;
  reviews: string;
  price: string;
}

interface FeatureCard {
  image: string;
  title: string;
  description: string;
  linkLabel: string;
}

interface LifecycleStep {
  title: string;
  description: string;
  delay: string;
}

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const DESTINATIONS: DestinationCard[] = [
  {

    name: "Taj Mahal",
    country: "India",
    flag: "🇮🇳",
    image: "https://www.trawell.in/images/pics/india_best_main.jpg",
    badge: "🌟 Iconic",
    rating: "4.9",
    reviews: "10k+",
    price: "from ₹2,000",
  },
  {

    name: "Varanasi",
    country: "India",
    flag: "🇮🇳",
    image: "https://img.etimg.com/thumb/msid-118406124%2Cwidth-1200%2Cheight-900%2Cresizemode-4/news/india/from-varanasi-to-jaipur-a-cultural-journey-through-indias-best-cities/varanasi-uttar-pradesh.jpg",
    badge: "🙏 Spiritual",
    rating: "4.8",
    reviews: "8.5k",
    price: "from ₹1,500",
  },
  {

    name: "Jaipur",
    country: "India",
    flag: "🇮🇳",
    image: "https://www.touropia.com/gfx/b/2011/09/hawa_mahal.jpg",
    badge: "🏰 Culture",
    rating: "4.7",
    reviews: "7k",
    price: "from ₹3,000",
  },
  {

    name: "Kerala Backwaters",
    country: "India",
    flag: "🇮🇳",
    image: "https://www.tourmyindia.com/destination_india/image/south-india-banner.webp",
    badge: "🌿 Peaceful",
    rating: "4.9",
    reviews: "9k",
    price: "from ₹3,500",
  },
];
const STEPS = [
  {
    title: "Discover",
    description: "Explore destinations tailored to your mood and travel style.",
    delay: "0s",
    icon: "🧭",
  },
  {
    title: "Plan",
    description: "AI crafts the perfect itinerary with stays and experiences.",
    delay: "0.1s",
    icon: "🗺️",
  },
  {
    title: "Travel",
    description: "Enjoy seamless journeys with real-time assistance.",
    delay: "0.2s",
    icon: "✈️",
  },
  {
    title: "Relive",
    description: "Save memories, reviews, and trip highlights forever.",
    delay: "0.3s",
    icon: "📸",
  },
];



const FEATURES: FeatureCard[] = [
  {
    image: "https://www.touropia.com/gfx/b/2011/09/hawa_mahal.jpg",
    title: "Immersive AR Discovery",
    description:
      "Explore destinations before you even book. Our AI lets you virtually walk through your next adventure, see local highlights, and discover hidden gems curated just for you.",
    linkLabel: "View AR Demo",
  },
  {
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=500&fit=crop",
    title: "Smart Itinerary Builder",
    description:
      "Our AI optimises your entire trip — flights, accommodation, experiences, and local transport. Just say where you want to go, and let the magic unfold.",
    linkLabel: "Build My Trip",
  },
  {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop",
    title: "Live Trip Formations",
    description:
      "Stay updated with real-time alerts, weather shifts, travel advisories, and on-the-ground conditions. Your journey adapts automatically with continuous AI monitoring.",
    linkLabel: "See Live Demo",
  },
];



const STATS: StatItem[] = [
  { target: 240, suffix: "K+", label: "Happy Travelers" },
  { target: 190, suffix: "+", label: "Countries Covered" },
  { target: 98, suffix: "%", label: "Satisfaction Rate" },
  { target: 4, suffix: ".9★", label: "Average Rating" },
];

const TICKER_ITEMS = [
  "Taj Mahal, Agra",
  "Ganga Ghats, Varanasi",
  "Pink City, Jaipur",
  "Beaches of Goa",
  "Himalayan Manali",
  "City of Lakes, Udaipur",
  "God’s Own Country, Kerala",
  "Leh–Ladakh Adventure",
];


const FOOTER_LINKS = {
  Product: ["AI Itinerary Builder", "AR Discovery", "Live Formations", "Smart Booking"],
  Agents: ["Register as Agent", "Agent Dashboard", "Blog Posts", "Resources"],
  Contact: ["Support", "Press Kit", "Partnerships", "hello@sadyaatra.ai"],
};

/* ─────────────────────────────────────────────
   CUSTOM HOOKS
───────────────────────────────────────────── */

/** Animated counter that counts up when element enters viewport */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.round(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

/** Scroll-reveal via IntersectionObserver */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected once as a <style> tag)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Caveat:wght@500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sky: #0ea5e9;
  --sky-deep: #0369a1;
  --ocean: #06b6d4;
  --coral: #f97316;
  --dusk: #1e1b4b;
  --mist: #f0f9ff;
  --ink: #0f172a;
  --slate: #475569;
  --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
}

html { scroll-behavior: smooth; }

body {
  font-family: 'DM Sans', sans-serif;
  background: #fff;
  color: var(--ink);
  overflow-x: hidden;
  cursor: none;
}

/* ── Keyframes ─────────────────────────────── */
@keyframes fade-up   { to { opacity:1; transform:translateY(0); } }
@keyframes slide-in-right { to { opacity:1; transform:translateY(-50%) translateX(0); } }
@keyframes float-orb { from { transform:translate(0,0) scale(1); } to { transform:translate(30px,30px) scale(1.08); } }
@keyframes float-card{ 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
@keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.4);opacity:.6;} }
@keyframes line-in   { to { transform:scaleX(1); } }
@keyframes ticker-scroll { from{transform:translateX(0);} to{transform:translateX(-50%);} }
@keyframes loader-pulse  { from{opacity:.5;transform:scale(.97);} to{opacity:1;transform:scale(1);} }
@keyframes loader-fill   { from{width:0;} to{width:100%;} }

/* ── Loader ──────────────────────────────── */
.st-loader { position:fixed; inset:0; z-index:10000; background:#e8f6f8;
  display:flex; align-items:center; justify-content:center; flex-direction:column;
  transition:opacity .5s ease, visibility .5s ease; }
.st-loader.done { opacity:0; visibility:hidden; }
.st-loader-logo { margin-bottom:24px; animation:loader-pulse 1s ease-in-out infinite alternate; }
.st-loader-logo img { width:160px; height:160px; object-fit:contain; }
.st-loader-bar  { width:200px; height:3px; background:rgba(0,0,0,.1); border-radius:3px; overflow:hidden; }
.st-loader-fill { height:100%; background:linear-gradient(90deg,#38bdf8,#fb923c);
  border-radius:3px; animation:loader-fill 1.5s ease forwards; }

/* ── Cursor ──────────────────────────────── */
.st-cursor {
  position:fixed; width:12px; height:12px; background:var(--sky);
  border-radius:50%; pointer-events:none; z-index:9999;
  transform:translate(-50%,-50%);
  transition:width .3s var(--ease-spring), height .3s var(--ease-spring), background .3s;
  mix-blend-mode:multiply;
}
.st-cursor.hovered { width:20px; height:20px; background:var(--coral); }
.st-cursor-ring {
  position:fixed; width:40px; height:40px; border:1.5px solid var(--sky);
  border-radius:50%; pointer-events:none; z-index:9998;
  transform:translate(-50%,-50%);
  transition:width .3s var(--ease-spring), height .3s var(--ease-spring), opacity .3s;
  opacity:.5;
}
.st-cursor-ring.hovered { width:56px; height:56px; opacity:.2; }

/* ── Particles canvas ────────────────────── */
.st-particles { position:fixed; inset:0; pointer-events:none; z-index:0; }

/* ── Nav ─────────────────────────────────── */
.st-nav {
  position:fixed; top:0; left:0; right:0; z-index:100;
  display:flex; align-items:center; justify-content:space-between;
  padding:18px 60px;
  background:rgba(255,255,255,.72);
  backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(14,165,233,.1);
  transition:background .4s, box-shadow .4s;
}
.st-nav.scrolled { background:rgba(255,255,255,.92); box-shadow:0 4px 30px rgba(14,165,233,.08); }
.st-nav-logo { font-family:'Playfair Display',serif; font-size:1.25rem; font-weight:700;
  color:var(--sky-deep); letter-spacing:-.02em; cursor:default; }
.st-nav-links { display:flex; gap:36px; list-style:none; }
.st-nav-links a {
  text-decoration:none; font-size:.88rem; font-weight:500; color:var(--slate);
  position:relative; transition:color .3s; cursor:none;
}
.st-nav-links a::after {
  content:''; position:absolute; bottom:-4px; left:0;
  width:0; height:1.5px; background:var(--sky);
  transition:width .3s var(--ease-spring);
}
.st-nav-links a:hover { color:var(--sky-deep); }
.st-nav-links a:hover::after { width:100%; }
.st-btn-ghost {
  padding:9px 20px; border:1.5px solid rgba(14,165,233,.35);
  border-radius:50px; font-size:.85rem; font-weight:500;
  color:var(--sky-deep); background:transparent; cursor:none;
  font-family:'DM Sans',sans-serif;
  transition:all .3s;
}
.st-btn-ghost:hover { background:rgba(14,165,233,.06); border-color:var(--sky); }
.st-btn-primary {
  padding:9px 22px; background:linear-gradient(135deg,var(--sky),var(--ocean));
  border:none; border-radius:50px; font-size:.85rem; font-weight:600;
  color:#fff; cursor:none; position:relative; overflow:hidden;
  font-family:'DM Sans',sans-serif;
  transition:transform .3s var(--ease-spring), box-shadow .3s;
}
.st-btn-primary::before { content:''; position:absolute; inset:0;
  background:linear-gradient(135deg,var(--ocean),var(--sky)); opacity:0; transition:opacity .3s; }
.st-btn-primary:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 8px 24px rgba(14,165,233,.4); }
.st-btn-primary:hover::before { opacity:1; }
.st-btn-primary span { position:relative; z-index:1; }

/* ── Hero ────────────────────────────────── */
.st-hero {
  position:relative; min-height:100vh;
  display:flex; align-items:center;
  padding:140px 60px 80px; overflow:hidden;
}
.st-hero-bg {
  position:absolute; inset:0; z-index:1;
  background:linear-gradient(145deg,#f0f9ff 0%,#e0f2fe 35%,#bae6fd 65%,#e0f2fe 100%);
}
.st-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:2;
  animation:float-orb 8s ease-in-out infinite alternate; }
.st-orb-1 { width:500px;height:500px;background:rgba(14,165,233,.2);top:-100px;right:-80px;animation-duration:9s; }
.st-orb-2 { width:350px;height:350px;background:rgba(6,182,212,.15);bottom:-50px;left:30%;animation-duration:11s;animation-delay:-3s; }
.st-orb-3 { width:250px;height:250px;background:rgba(249,115,22,.12);top:40%;right:20%;animation-duration:7s;animation-delay:-5s; }
.st-hero-grid {
  position:absolute; inset:0; z-index:2;
  background-image:linear-gradient(rgba(14,165,233,.05) 1px,transparent 1px),
    linear-gradient(90deg,rgba(14,165,233,.05) 1px,transparent 1px);
  background-size:60px 60px;
  mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
}
.st-hero-content { position:relative; z-index:3; max-width:640px; }
.st-hero-badge {
  display:inline-flex; align-items:center; gap:8px;
  background:rgba(14,165,233,.1); border:1px solid rgba(14,165,233,.25);
  border-radius:50px; padding:6px 16px;
  font-size:.78rem; font-weight:600; color:var(--sky-deep);
  margin-bottom:28px;
  opacity:0; transform:translateY(20px);
  animation:fade-up .7s ease forwards .2s;
}
.st-pulse { width:8px;height:8px;background:var(--coral);border-radius:50%;
  animation:pulse-dot 1.5s ease-in-out infinite; }
.st-hero h1 {
  font-family:'Playfair Display',serif;
  font-size:clamp(2.6rem,5vw,4.2rem); font-weight:900;
  line-height:1.1; color:var(--dusk); letter-spacing:-.03em;
  margin-bottom:24px;
  opacity:0; transform:translateY(30px);
  animation:fade-up .8s ease forwards .4s;
}
.st-hero h1 em { font-style:italic; color:var(--sky); position:relative; }
.st-hero h1 em::after {
  content:''; position:absolute; bottom:4px; left:0; right:0;
  height:3px; background:linear-gradient(90deg,var(--sky),var(--coral));
  border-radius:3px; transform:scaleX(0); transform-origin:left;
  animation:line-in .6s ease forwards 1.3s;
}
.st-hero p {
  font-size:1.05rem; line-height:1.75; color:var(--slate);
  max-width:520px; margin-bottom:36px;
  opacity:0; transform:translateY(20px);
  animation:fade-up .8s ease forwards .6s;
}
.st-hero-search {
  display:flex; background:#fff; border-radius:16px;
  box-shadow:0 8px 40px rgba(14,165,233,.15),0 1px 0 rgba(14,165,233,.1) inset;
  overflow:hidden;
  opacity:0; transform:translateY(20px);
  animation:fade-up .8s ease forwards .8s;
}
.st-hero-search input {
  flex:1; border:none; outline:none; padding:18px 22px;
  font-family:'DM Sans',sans-serif; font-size:.95rem; color:var(--ink);
}
.st-hero-search input::placeholder { color:#94a3b8; }
.st-hero-search button {
  margin:8px; padding:12px 28px;
  background:linear-gradient(135deg,var(--sky),var(--sky-deep));
  border:none; border-radius:10px; color:#fff;
  font-family:'DM Sans',sans-serif; font-size:.92rem; font-weight:600;
  cursor:none; white-space:nowrap;
  transition:transform .3s var(--ease-spring), box-shadow .3s;
}
.st-hero-search button:hover { transform:scale(1.04); box-shadow:0 6px 20px rgba(14,165,233,.4); }
.st-hero-tags {
  display:flex; gap:10px; margin-top:20px; flex-wrap:wrap;
  opacity:0; transform:translateY(20px);
  animation:fade-up .8s ease forwards 1s;
}
.st-hero-tag {
  display:inline-flex; align-items:center; gap:6px;
  font-size:.8rem; font-weight:500; color:var(--slate);
  padding:5px 12px;
  background:rgba(255,255,255,.7); border:1px solid rgba(14,165,233,.2);
  border-radius:50px; cursor:none;
  transition:all .3s;
}
.st-hero-tag:hover { color:var(--sky-deep); background:#fff; border-color:var(--sky); transform:translateY(-2px); }

/* ── Hero Visual ─────────────────────────── */
.st-hero-visual {
  position:absolute; right:60px; top:50%;
  transform:translateY(-50%) translateX(60px);
  z-index:3; width:420px;
  opacity:0;
  animation:slide-in-right 1s var(--ease-spring) forwards 1.1s;
}
.st-hero-card {
  background:#fff; border-radius:24px; overflow:hidden;
  box-shadow:0 30px 80px rgba(14,165,233,.2),0 0 0 1px rgba(14,165,233,.08);
  transform:perspective(800px) rotateY(-8deg) rotateX(2deg);
  transition:transform .6s var(--ease-spring);
}
.st-hero-card:hover { transform:perspective(800px) rotateY(0deg) rotateX(0deg); }
.st-hero-card-img {
  width:100%; height:220px; position:relative; overflow:hidden;
  display:flex; align-items:center; justify-content:center;
}
.st-hero-card-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 60%);
}
.st-hero-card-label {
  position:absolute; bottom:16px; left:16px;
  color:#fff; z-index:1; font-size:1.1rem; font-weight:700;
  font-family:'Playfair Display',serif;
}
.st-hero-card-body { padding:20px 22px; }
.st-hero-card-body .dest { font-weight:700; font-size:1.05rem; }
.st-hero-card-body .meta { font-size:.82rem; color:var(--slate); margin-top:4px; }
.st-hero-card-body .price {
  display:inline-block; margin-top:12px;
  background:linear-gradient(135deg,var(--sky),var(--ocean));
  color:#fff; padding:6px 16px; border-radius:50px;
  font-size:.88rem; font-weight:700;
}
.st-float-badge {
  position:absolute; background:#fff; border-radius:16px;
  padding:14px 18px; box-shadow:0 12px 40px rgba(0,0,0,.12);
  display:flex; align-items:center; gap:12px;
}
.st-float-badge-1 { bottom:-30px; left:-50px; animation:float-card 4s ease-in-out infinite; }
.st-float-badge-2 { top:-20px; right:-40px; animation:float-card 5s ease-in-out infinite reverse; animation-delay:-2s; }
.st-badge-icon { font-size:1.6rem; }
.st-badge-text { font-size:.82rem; font-weight:600; color:var(--ink); }
.st-badge-sub  { font-size:.72rem; color:var(--slate); }

/* ── Ticker ──────────────────────────────── */
.st-ticker-wrap { background:var(--sky); padding:14px 0; overflow:hidden; white-space:nowrap; }
.st-ticker { display:inline-flex; gap:60px; animation:ticker-scroll 20s linear infinite; }
.st-ticker-item { font-size:.85rem; font-weight:600; color:#fff;
  display:inline-flex; align-items:center; gap:16px; }
.st-ticker-dot { width:5px; height:5px; background:rgba(255,255,255,.5); border-radius:50%; }

/* ── Section Shared ──────────────────────── */
.st-section-label {
  display:inline-block; font-size:.78rem; font-weight:700;
  text-transform:uppercase; letter-spacing:.12em; color:var(--sky); margin-bottom:14px;
}
.st-section-title {
  font-family:'Playfair Display',serif;
  font-size:clamp(2rem,3vw,2.8rem); font-weight:900;
  line-height:1.2; color:var(--dusk); letter-spacing:-.02em; margin-bottom:16px;
}
.st-section-subtitle { font-size:1rem; line-height:1.7; color:var(--slate); max-width:540px; }

/* reveal transitions */
.st-reveal { opacity:0; transform:translateY(40px); transition:opacity .7s ease,transform .7s ease; }
.st-reveal.visible { opacity:1; transform:translateY(0); }
.st-reveal-left { opacity:0; transform:translateX(-40px); transition:opacity .7s ease,transform .7s ease; }
.st-reveal-left.visible { opacity:1; transform:translateX(0); }
.st-reveal-right { opacity:0; transform:translateX(40px); transition:opacity .7s ease,transform .7s ease; }
.st-reveal-right.visible { opacity:1; transform:translateX(0); }

/* ── Features ────────────────────────────── */
.st-features { background:#fff; padding:100px 60px; text-align:center; }
.st-features-header { margin-bottom:70px; }
.st-features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px;
  max-width:1100px; margin:0 auto; }
.st-feature-card {
  background:var(--mist); border-radius:20px; padding:36px 30px;
  text-align:left; border:1px solid rgba(14,165,233,.1);
  position:relative; overflow:hidden; cursor:none;
  transition:transform .4s var(--ease-spring), box-shadow .4s, border-color .4s;
}
.st-feature-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:3px;
  background:linear-gradient(90deg,var(--sky),var(--ocean));
  transform:scaleX(0); transform-origin:left; transition:transform .4s ease;
}
.st-feature-card:hover { transform:translateY(-8px); box-shadow:0 20px 60px rgba(14,165,233,.15); border-color:rgba(14,165,233,.25); }
.st-feature-card:hover::before { transform:scaleX(1); }
.st-feature-icon {
  width:56px; height:56px; border-radius:14px;
  background:linear-gradient(135deg,var(--sky),var(--ocean));
  display:flex; align-items:center; justify-content:center;
  font-size:1.6rem; margin-bottom:22px;
  box-shadow:0 8px 20px rgba(14,165,233,.3);
  transition:transform .4s var(--ease-spring), box-shadow .4s;
}
.st-feature-card:hover .st-feature-icon { transform:scale(1.1) rotate(-4deg); box-shadow:0 12px 30px rgba(14,165,233,.4); }
.st-feature-card h3 { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:700; margin-bottom:12px; color:var(--dusk); }
.st-feature-card p  { font-size:.9rem; line-height:1.65; color:var(--slate); }
.st-feature-link {
  display:inline-flex; align-items:center; gap:6px;
  margin-top:20px; font-size:.85rem; font-weight:600; color:var(--sky);
  text-decoration:none; cursor:none; transition:gap .3s;
}
.st-feature-link:hover { gap:10px; }

/* ── Destinations ────────────────────────── */
.st-destinations {
  padding:100px 60px;
  background:linear-gradient(180deg,#f8fcff 0%,var(--mist) 100%);
  overflow:hidden;
}
.st-dest-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:48px; }
.st-view-all {
  font-size:.88rem; font-weight:600; color:var(--sky); text-decoration:none;
  cursor:none; display:flex; align-items:center; gap:6px; transition:gap .3s;
}
.st-view-all:hover { gap:10px; }
.st-dest-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:22px; }
.st-dest-card {
  border-radius:20px; overflow:hidden; background:#fff;
  box-shadow:0 4px 20px rgba(0,0,0,.07); cursor:none; position:relative;
  transition:transform .4s var(--ease-spring), box-shadow .4s;
  perspective:600px;
}
.st-dest-card:hover { transform:translateY(-10px) scale(1.01); box-shadow:0 24px 60px rgba(14,165,233,.2); }
.st-dest-img { height:200px; position:relative; overflow:hidden;
  display:flex; align-items:center; justify-content:center; }
.st-dest-img-bg { position:absolute; inset:0; transition:transform .6s ease; }
.st-dest-card:hover .st-dest-img-bg { transform:scale(1.08); }
.st-dest-overlay { position:absolute; inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.5) 0%,rgba(0,0,0,.1) 60%,transparent 100%); }
.st-dest-emoji { position:relative; z-index:1; font-size:3.5rem; }
.st-dest-badge {
  position:absolute; top:14px; right:14px; z-index:2;
  background:rgba(255,255,255,.9); backdrop-filter:blur(8px);
  border-radius:50px; padding:4px 12px;
  font-size:.78rem; font-weight:700; color:var(--sky-deep);
}
.st-dest-info { padding:18px 20px; }
.st-dest-info h3 { font-size:1rem; font-weight:700; color:var(--dusk); }
.st-dest-loc { font-size:.82rem; color:var(--slate); margin-top:3px; }
.st-dest-footer {
  display:flex; align-items:center; justify-content:space-between;
  margin-top:14px; padding-top:14px;
  border-top:1px solid rgba(14,165,233,.1);
}
.st-dest-rating { display:flex; align-items:center; gap:4px; font-size:.82rem; font-weight:600; color:var(--dusk); }
.st-dest-star { color:#f59e0b; }
.st-dest-price { font-size:.9rem; font-weight:700; color:var(--sky-deep); }

/* ── Stats Band ──────────────────────────── */
.st-stats-band {
  background:linear-gradient(135deg,var(--dusk) 0%,#312e81 100%);
  padding:60px; display:grid; grid-template-columns:repeat(4,1fr);
  gap:40px; text-align:center; position:relative; overflow:hidden;
}
.st-stats-band::before {
  content:''; position:absolute; inset:0;
  background-image:radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px);
  background-size:40px 40px;
}
.st-stat { position:relative; z-index:1; }
.st-stat-num {
  font-family:'Playfair Display',serif; font-size:3rem; font-weight:900;
  color:#fff; line-height:1; margin-bottom:8px;
  background:linear-gradient(135deg,#fff,rgba(255,255,255,.7));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.st-stat-accent { color:var(--coral); -webkit-text-fill-color:var(--coral); }
.st-stat-label { font-size:.9rem; color:rgba(255,255,255,.6); font-weight:500; }

/* ── Lifecycle ───────────────────────────── */
.st-lifecycle { padding:100px 60px; background:#fff; text-align:center; }
.st-lifecycle-header { margin-bottom:70px; }
.st-lifecycle-steps {
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:0; max-width:1000px; margin:0 auto; position:relative;
}
.st-lifecycle-steps::before {
  content:''; position:absolute;
  top:36px; left:calc(12.5% + 20px); right:calc(12.5% + 20px);
  height:2px; background:linear-gradient(90deg,var(--sky),var(--coral)); z-index:0;
}
.st-step { display:flex; flex-direction:column; align-items:center; padding:0 16px; position:relative; z-index:1; }
.st-step-icon {
  width:72px; height:72px; border-radius:50%;
  background:#fff; display:flex; align-items:center; justify-content:center;
  font-size:1.8rem; margin-bottom:24px; position:relative;
  box-shadow:0 8px 24px rgba(14,165,233,.2);
  transition:transform .4s var(--ease-spring), box-shadow .4s;
  cursor:none;
}
.st-step-icon::before {
  content:''; position:absolute; inset:-4px; border-radius:50%;
  background:linear-gradient(135deg,var(--sky),var(--coral));
  z-index:-1; opacity:0; transition:opacity .4s;
}
.st-step:hover .st-step-icon { transform:scale(1.12); box-shadow:0 12px 36px rgba(14,165,233,.3); }
.st-step:hover .st-step-icon::before { opacity:1; }
.st-step h4 { font-family:'Playfair Display',serif; font-size:1.05rem; font-weight:700; color:var(--dusk); margin-bottom:10px; }
.st-step p  { font-size:.85rem; line-height:1.6; color:var(--slate); }

/* ── CTA ─────────────────────────────────── */
.st-cta {
  padding:100px 60px;
  background:linear-gradient(135deg,#0369a1 0%,var(--sky) 50%,var(--ocean) 100%);
  position:relative; overflow:hidden; text-align:center;
}
.st-cta::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(circle at 20% 50%,rgba(255,255,255,.08) 0%,transparent 50%),
    radial-gradient(circle at 80% 50%,rgba(255,255,255,.06) 0%,transparent 50%);
}
.st-cta-content { position:relative; z-index:1; }
.st-cta-eyebrow { font-family:'Caveat',cursive; font-size:1.4rem; color:rgba(255,255,255,.8);
  margin-bottom:12px; display:block; }
.st-cta h2 { font-family:'Playfair Display',serif;
  font-size:clamp(2.4rem,4vw,3.5rem); font-weight:900; color:#fff;
  line-height:1.1; letter-spacing:-.03em; margin-bottom:20px; }
.st-cta p { font-size:1.05rem; color:rgba(255,255,255,.8);
  max-width:500px; margin:0 auto 44px; line-height:1.7; }
.st-cta-buttons { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
.st-btn-white {
  padding:14px 34px; background:#fff; border:none; border-radius:50px;
  font-family:'DM Sans',sans-serif; font-size:.95rem; font-weight:700;
  color:var(--sky-deep); cursor:none;
  transition:transform .3s var(--ease-spring), box-shadow .3s;
  box-shadow:0 8px 30px rgba(0,0,0,.15);
}
.st-btn-white:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 16px 40px rgba(0,0,0,.2); }
.st-btn-outline-white {
  padding:14px 34px; background:transparent;
  border:2px solid rgba(255,255,255,.5); border-radius:50px;
  font-family:'DM Sans',sans-serif; font-size:.95rem; font-weight:600;
  color:#fff; cursor:none; transition:all .3s;
}
.st-btn-outline-white:hover { border-color:#fff; background:rgba(255,255,255,.1); transform:translateY(-3px); }

/* ── Footer ──────────────────────────────── */
.st-footer { background:var(--dusk); color:rgba(255,255,255,.7); padding:70px 60px 40px; }
.st-footer-grid { display:grid; grid-template-columns:1.8fr 1fr 1fr 1fr; gap:50px; margin-bottom:50px; }
.st-footer-logo { font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:700; color:#fff; margin-bottom:16px; }
.st-footer-about { font-size:.88rem; line-height:1.7; max-width:280px; }
.st-footer-col h4 { font-size:.85rem; font-weight:700; color:#fff;
  text-transform:uppercase; letter-spacing:.08em; margin-bottom:20px; }
.st-footer-col ul { list-style:none; display:flex; flex-direction:column; gap:12px; }
.st-footer-col a { text-decoration:none; font-size:.88rem; color:rgba(255,255,255,.6);
  transition:color .3s; cursor:none; }
.st-footer-col a:hover { color:var(--sky); }
.st-footer-bottom {
  border-top:1px solid rgba(255,255,255,.08); padding-top:30px;
  display:flex; align-items:center; justify-content:space-between;
}
.st-footer-bottom p { font-size:.82rem; }
`;

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/* Particles Canvas */
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let rafId: number;

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    interface Ptcl { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string; }
    const reset = (): Ptcl => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? "14,165,233" : "249,115,22",
    });

    const pts: Ptcl[] = Array.from({ length: 80 }, reset);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) Object.assign(p, reset());
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(14,165,233,${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="st-particles" />;
}

/* Custom Cursor */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0), my = useRef(0);
  const rx = useRef(0), ry = useRef(0);

  useEffect(() => {
    const cursor = cursorRef.current!;
    const ring = ringRef.current!;
    let rafId: number;

    const onMove = (e: globalThis.MouseEvent) => { mx.current = e.clientX; my.current = e.clientY; };
    document.addEventListener("mousemove", onMove);

    const animate = () => {
      cursor.style.left = mx.current + "px";
      cursor.style.top = my.current + "px";
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      ring.style.left = rx.current + "px";
      ring.style.top = ry.current + "px";
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const hoverTargets = 'a,button,.st-dest-card,.st-feature-card,.st-step,.st-hero-tag';
    const addHover = () => { cursor.classList.add("hovered"); ring.classList.add("hovered"); };
    const rmHover = () => { cursor.classList.remove("hovered"); ring.classList.remove("hovered"); };

    const attachListeners = () => {
      document.querySelectorAll<HTMLElement>(hoverTargets).forEach(el => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", rmHover);
      });
    };
    attachListeners();
    // re-attach after any dynamic renders
    const mo = new MutationObserver(attachListeners);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="st-cursor" />
      <div ref={ringRef} className="st-cursor-ring" />
    </>
  );
}

/* Loader */
function Loader({ done }: { done: boolean }): React.ReactElement {
  return (
    <div className={`st-loader${done ? " done" : ""}`}>
      <div className="st-loader-logo">
        <img src="/sadyaatra-logo.png" alt="SadYaatra AI" />
      </div>
      <div className="st-loader-bar">
        <div className="st-loader-fill" />
      </div>
    </div>
  );
}


/* Navbar */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`st-nav${scrolled ? " scrolled" : ""}`}>
      <div className="st-nav-logo">
        Sadyaatra<span style={{ color: "#0369a1" }}></span>
        <span style={{ color: "#f97316" }}>.</span>AI
      </div>
      <ul className="st-nav-links">
        {["Features", "Destinations", "How It Works", "Contact"].map(l => (
          <li key={l}><a href={`#${l.toLowerCase().replace(/ /g, "-")}`}>{l}</a></li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className="st-btn-ghost"
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        >
          Log In
        </button>
        <button
          className="st-btn-primary"
          onClick={() => window.location.href = "/user/login"}
        >
          <span>Get Started</span>
        </button>
      </div>
    </nav>
  );
}

/* Hero */
function Hero() {
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      if (visualRef.current) {
        visualRef.current.style.transform =
          `translateY(-50%) translateX(${x * 0.5}px) translateY(${y * 0.3}px)`;
      }
      orbRefs.current.forEach((orb: HTMLDivElement | null, i: number) => {
        if (!orb) return;
        const f = (i + 1) * 0.015;
        orb.style.transform = `translate(${x * f * 20}px, ${y * f * 20}px)`;
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section className="st-hero" id="hero">
      <div className="st-hero-bg" />
      {[1, 2, 3].map(n => (
        <div
          key={n}
          className={`st-orb st-orb-${n}`}
          ref={el => { orbRefs.current[n - 1] = el; }}
        />
      ))}
      <div className="st-hero-grid" />

      <div className="st-hero-content">
        <div className="st-hero-badge">
          <span className="st-pulse" />
          AI-Powered Travel Assistant
        </div>
        <h1>Your Entire Journey,<br /><em>Perfectly Orchestrated</em></h1>
        <p>
          Discover destinations through AI, build dynamic itineraries with GL, and travel with
          confidence using real-time insight tracking and automated transparent billing.
        </p>
        <div className="st-hero-search">
          <input type="text" placeholder="Where do you dream of going?" />
          <button onClick={() => window.location.href = "/user/login"}>Start Planning ✦</button>
        </div>
        <div className="st-hero-tags">
          {[
            { icon: "✈️", label: "Verified Agent" },
            { icon: "/sadyaatra-logo.png", label: "AI-Powered" },
            { icon: "🌍", label: "200+ Countries" },
            { icon: "⚡", label: "Instant Booking" },
          ].map(t => (
            <span key={t.label} className="st-hero-tag">
              <span>{t.icon.startsWith("/") ? <img src={t.icon} style={{ width: "20px", height: "20px", objectFit: "contain" }} alt="" /> : t.icon}</span> {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Right floating card */}
      <div className="st-hero-visual" id="hero-visual" ref={visualRef}>
        <div style={{ position: "relative" }}>
          <div className="st-hero-card">
            <div className="st-hero-card-img">
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg,#0ea5e9,#0c4a6e,#06b6d4)"
              }} />
              <div style={{ position: "relative", zIndex: 1, fontSize: "5rem" }}><img src={"https://www.tourmyindia.com/destination_india/image/south-india-banner.webp"}></img></div>
              <div className="st-hero-card-overlay" />
              <div className="st-hero-card-label">Kerala, India</div>
            </div>
            <div className="st-hero-card-body">
              <div className="dest">Backwater Houseboat Stay</div>
              <div className="meta">📅 Dec 1–6 · 2 travelers · ⭐ 4.9</div>
              <div className="price">From ₹26,000 / person</div>
            </div>
          </div>
          <div className="st-float-badge st-float-badge-1">
            <span className="st-badge-icon">🛡️</span>
            <div>
              <div className="st-badge-text">Trusted Travel</div>
              <div className="st-badge-sub">Govt & Local Verified</div>

            </div>
          </div>
          <div className="st-float-badge st-float-badge-2">
            <span className="st-badge-icon">⚡</span>
            <div>
              <div className="st-badge-text">AI Itinerary Ready</div>
              <div className="st-badge-sub">Built in 3 seconds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Ticker */
function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="st-ticker-wrap">
      <div className="st-ticker">
        {doubled.map((item, i) => (
          <span key={i} className="st-ticker-item">
            {item} <span className="st-ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* Reveal wrapper */
function Reveal({
  children, className = "", delay = "0s", direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
  direction?: "up" | "left" | "right";
  key?: React.Key;
}) {
  const cls = direction === "left" ? "st-reveal-left" : direction === "right" ? "st-reveal-right" : "st-reveal";
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`${cls}${visible ? " visible" : ""} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
}

/* Features */
function Features() {
  return (
    <section className="st-features" id="features">
      <div className="st-features-header">
        <Reveal>
          <span className="st-section-label">The Future of Exploration</span>
          <h2 className="st-section-title">
            Sadyaatra AI brings a living edge technology<br />
            to the former finite lease
          </h2>
        </Reveal>
      </div>
      <div className="st-features-grid">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={`${(i + 1) * 0.1}s`}>
            <div
              className="st-feature-card"
              onMouseMove={(e: RMouseEvent<HTMLDivElement>) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform =
                  `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
              }}
              onMouseLeave={(e: RMouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = ""; }}
            >
              <div className="st-feature-icon" style={{
                backgroundImage: `url('${f.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '200px',
                borderRadius: '12px'
              }} />
              <h3>{f.title}</h3>
              <p>{f.description}</p>
              <a href="#" className="st-feature-link">{f.linkLabel} →</a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* Destinations */
function Destinations() {
  return (
    <section className="st-destinations" id="destinations">
      <div className="st-dest-header">
        <Reveal direction="left">
          <span className="st-section-label">Trending Destinations</span>
          <h2 className="st-section-title" style={{ marginBottom: 0 }}>
            Top picks handcrafted by our AI discovery engine
          </h2>
        </Reveal>
        <Reveal direction="right">
          <a href="#" className="st-view-all">View All Destinations →</a>
        </Reveal>
      </div>
      <div className="st-dest-grid">
        {DESTINATIONS.map((d, i) => (
          <Reveal key={d.name} delay={`${(i + 1) * 0.1}s`}>
            <div
              className="st-dest-card"
              onMouseMove={(e: RMouseEvent<HTMLDivElement>) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform =
                  `translateY(-10px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.01)`;
              }}
              onMouseLeave={(e: RMouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = ""; }}
            >
              <div className="st-dest-img">
                <div className="st-dest-img-bg" style={{
                  background: d.gradient,
                  backgroundImage: `url('${d.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                <div className="st-dest-overlay" />

                <div className="st-dest-badge">{d.badge}</div>
              </div>
              <div className="st-dest-info">
                <h3>{d.name}</h3>
                <div className="st-dest-loc">{d.flag} {d.country}</div>
                <div className="st-dest-footer">
                  <div className="st-dest-rating">
                    <span className="st-dest-star">★</span>
                    {d.rating} ({d.reviews})
                  </div>
                  <div className="st-dest-price">{d.price}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* Counter stat */
function StatCounter({ stat }: { stat: StatItem }) {
  const { count, ref } = useCounter(stat.target);
  return (
    <div className="st-stat">
      <div className="st-stat-num">
        <span ref={ref}>{count}</span>
        <span className="st-stat-accent">{stat.suffix}</span>
      </div>
      <div className="st-stat-label">{stat.label}</div>
    </div>
  );
}

/* Stats Band */
function StatsBand() {
  return (
    <div className="st-stats-band">
      {STATS.map(s => (
        <Reveal key={s.label}>
          <StatCounter stat={s} />
        </Reveal>
      ))}
    </div>
  );
}

/* Lifecycle */
function Lifecycle() {
  return (
    <section className="st-lifecycle" id="how-it-works">
      <div className="st-lifecycle-header">
        <Reveal>
          <span className="st-section-label">The Journey Lifecycle</span>
          <h2 className="st-section-title">Four steps to your perfect escape</h2>
          <p className="st-section-subtitle" style={{ margin: "0 auto" }}>
            From the spark of wanderlust to returning home with memories that last a lifetime —
            SunTreasure handles every detail.
          </p>
        </Reveal>
      </div>
      <div className="st-lifecycle-steps">
        {STEPS.map((s) => (
          <Reveal key={s.title} delay={s.delay}>
            <div className="st-step">

              {/* ICON */}
              <div className="st-step-icon">
                {s.icon}
              </div>

              <h4>{s.title}</h4>
              <p>{s.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

    </section>
  );
}

/* CTA */
function CtaSection() {
  return (
    <section className="st-cta" id="contact">
      <div className="st-cta-content">
        <Reveal>
          <span className="st-cta-eyebrow">Ready to start your story?</span>
          <h2>Ready for your next adventure?</h2>
          <p>
            Join thousands of smart travelers already using Sadyaatra AI to craft
            extraordinary journeys around the world.
          </p>
          <div className="st-cta-buttons">
            <button className="st-btn-white" onClick={() => window.location.href = "/user/login"}>
              🗺️ Start Planning
            </button>
            <button className="st-btn-outline-white" onClick={() => window.location.href = "/agent/login"}>
              ✈️ Join as an Agent
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Footer */
function Footer() {
  return (
    <footer className="st-footer">
      <div className="st-footer-grid">
        <div>
          <div className="st-footer-logo">
            Sadyaatra<span style={{ color: "#0ea5e9" }}></span>
            <span style={{ color: "#f97316" }}>.</span>AI
          </div>
          <p className="st-footer-about">
            The future of AI-powered travel planning. Discover, plan, and explore with
            confidence — backed by cutting-edge artificial intelligence and a team that cares.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col} className="st-footer-col">
            <h4>{col}</h4>
            <ul>
              {links.map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="st-footer-bottom">
        <p>© 2026 Sadyaatra AI. All rights reserved.</p>
        <p></p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaderDone(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Inject global styles once */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <Loader done={loaderDone} />
      <ChatWidget />
      <ParticlesCanvas />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Features />
        <Destinations />
        <StatsBand />
        <Lifecycle />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}