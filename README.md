# Webstudios Mobile · Android Booking App

> Official Android mobile application for [webstudios.world](https://webstudios.world) — Book hand-coded websites, schedule technical scoping consultations, explore sector packages, and manage digital passes.

---

## 📱 Features

- **Pixel Flagship Android Experience (Material Design 3)**
  - Google Pixel 9 chassis simulation with punch-hole camera and hardware buttons
  - Live synchronized Android status bar (clock, 5G, Wi-Fi 6, battery indicator)
  - Material You dynamic theming (Glacier Cyan, Emerald Mint, Cosmic Violet, Solar Amber, Pixel Blue)
  - Bottom navigation bar with choice of modern Gesture Bar or 3-Button Navigation (Back, Home, Recents)
  - Canvas switcher: Device Simulation vs. Full Mobile Canvas

- **Sector Discovery & Package Catalog**
  - 8 Business Sectors: Restaurants, Clinics, Real Estate, E-Commerce, Legal, Salons, Schools, Corporate
  - Upfront transparent pricing in Kenyan Shillings (KSh) and US Dollars ($)
  - Performance guarantees: Sub-second 4G load times and 99+ Mobile Lighthouse scores

- **Interactive Booking Wizard & Digital Passes**
  - Session types: Free 30-min Discovery Call, 60-min Tech Architecture Review, 5–8 Day Project Kickoff, Speed Audit
  - Real-time date scroller & morning/afternoon/evening slot selection
  - Addons: Daraja M-Pesa STK Push Express checkout, custom booking engines, technical SEO, and priority delivery
  - Google Wallet-style digital pass with scannable SVG QR Code
  - 1-tap **Add to Google Calendar** and 1-tap **.ICS calendar file download**

- **Interactive Project Cost Calculator**
  - Live budget builder with itemized cost breakdowns

- **Direct Studio Desk & WhatsApp Integration**
  - Direct WhatsApp chat (+254 728 423 472), phone call, and email desk

- **PWA & Offline Awareness**
  - Full PWA compliance with manifest, service worker via `vite-plugin-pwa`, and offline banner

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd webstudios-mobile

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs on `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Material Design 3 guidelines
- **Icons**: Lucide React
- **PWA**: `vite-plugin-pwa`
- **Animation**: Motion
