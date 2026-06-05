# SadYaatra AI Web - Placeholders Documentation

This document outlines the current placeholders in the web application. These are features or links that are currently stubbed out (using `alert()` or placeholder UI) and need to be connected to real functionality or external links before production.

---

## 1. 3D Rendering & Immersive Exploration
- **File Location**: `app/page.tsx` (around lines 1280-1300)
- **Current State**: A black dashed box displaying the text `[ placeholder for Three.js / Spline 3D Viewer ]`.
- **What it does**: This section is meant to showcase high-fidelity 3D renderings or AR models of destinations so users can explore immersively before downloading the app.
- **Action Required**: 
  - Replace the placeholder `div` with a real 3D canvas (e.g., using `react-three-fiber` / `Three.js`) or an embedded iframe from a 3D service like Spline.

## 2. Voice Bot / Voice Assistant
- **File Location**: `components/ChatWidget.tsx` (inside the `chat-input-row`)
- **Current State**: A microphone button that triggers a browser alert: `"Voice assistant coming soon!"`.
- **What it does**: Allows users to interact with the AI Chatbot using their voice instead of typing.
- **Action Required**: 
  - Integrate a speech-to-text service (like the browser's native Web Speech API or an external API like OpenAI Whisper/Groq Whisper).
  - Capture the user's audio, transcribe it to text, and pass it directly into the `send()` function to get a response from the AI.

## 3. App Store Download Links
There are two places where the user is prompted to download the mobile app to personalize their trip. Both currently trigger alerts.

### Hero Section "Start Planning"
- **File Location**: `app/page.tsx` (inside the `st-hero-search` div)
- **Current State**: Clicking the button triggers an alert: `"Please download our app to start personalizing and planning your trip!"`.
- **What it does**: Intercepts users trying to search/plan a trip on the web and redirects them to the app.
- **Action Required**: 
  - Change the `onClick` handler to open a modal with QR codes, or directly open links to the Google Play Store / Apple App Store.

### Bottom CTA Section "Download App"
- **File Location**: `app/page.tsx` (inside `CtaSection`)
- **Current State**: Clicking the "Download App" button triggers an alert: `"Redirecting to App Store / Play Store..."`.
- **What it does**: Primary call-to-action at the bottom of the landing page.
- **Action Required**: 
  - Replace the `onClick` alert with actual `window.location.href` or `target="_blank"` anchor tags pointing to your live App Store and Play Store URLs.

## 4. Agent Login / Registration Link
- **File Location**: `app/page.tsx` (inside `CtaSection`)
- **Current State**: The "Join as an Agent" button redirects to `/agent/login`.
- **What it does**: Directs drivers/agents to their specific portal.
- **Action Required**: 
  - If the agent portal is hosted on a different subdomain (or if you removed it from this repository), ensure the URL `/agent/login` is updated to point to the correct live Agent Portal URL.
