# Aaradhya — Production-Grade Vedic Ritual Management Platform

> **"Your rituals, organised. Faith with less friction."**

Aaradhya is an enterprise-grade ritual orchestration platform that simplifies the discovery, booking, coordination, live tracking, and generational preservation of Hindu ceremonies. Engineered using a **zero-dependency, serverless modular architecture** in pure HTML5, CSS3, and modern vanilla JavaScript.

---

## Architectural Highlights (Version 2.0.0)

```
aaradhya/
├── index.html                 # Semantic HTML5 stage, landmarks, offline banner & modals
├── styles.css                 # Sacred Sattvic/Sanctum design system, print styles & WCAG AA
├── app.js                     # Root view coordinator, event bus & lifecycle manager
├── package.json               # Node script runners (npm test, npm start)
├── vercel.json                # Serverless edge routing & clean URLs
├── js/
│   ├── core/
│   │   ├── security.js        # HTML escaping (XSS immunization), input sanitizers & validators
│   │   └── store.js           # Reactive store, schema v2 persistence, multi-booking & telemetry
│   ├── data/
│   │   └── catalog.js         # Rigvedic/Yajurvedic ritual specifications & verified Purohit rosters
│   └── services/
│       ├── panchang.js        # Dynamic astronomical Panchang engine (Tithi, Nakshatra, Rahu Kaal)
│       ├── audio.js           # Web Audio API synthesizer for Tanpura drone (138.59Hz Sa) & Temple Bells
│       └── certificate.js     # Printable Digital Sankalp Patras & RFC 5545 iCal calendar sync
└── tests/
    └── unit-tests.js          # Automated zero-dependency test runner (19 test cases)
```

---

## Strategic Production Pillars

1. **Multi-Booking Operational Lifecycle**:
   - Manages multiple concurrent and past ceremonies with unique IDs (`AR-2026-XXXX`).
   - 6-step real-time state machine: `Confirmed` → `Pandit Assigned` → `Samagri Preparing` → `On The Way` → `Arrived` → `Completed`.
   - Automated Escrow Cancellation & 100% refund calculations.
   - Post-ceremony Verified Devotee Rating & Review workflow.

2. **Persistent Family Ritual OS**:
   - Full CRUD operations for household members with Zodiac (Rashi) and Nakshatra alignment.
   - Generational memory vault preserving family Gotras, Purohits, and completed Sankalp records.
   - Complete Data Sovereignty: One-click JSON data export (backup) and import (restore).

3. **Astronomical Vedic Panchang Engine**:
   - Real lunar synodic phase and sidereal motion algorithms calculating actual Tithi, Nakshatra, and ruling deities for any Gregorian date.
   - Accurate dynamic calculation of Rahu Kaal, Yamaganda, and Choghadiya periods (Shubh, Amrit, Labh, Char, Rog, Kaal, Udveg).

4. **Security & Defensive Engineering**:
   - Rigorous HTML entity escaping (`escapeHTML`) on all user-supplied interpolations.
   - Pincode and Indian phone number validation.
   - Safe localStorage serialization with corruption auto-recovery and schema migrations.

5. **Audio Synthesis & Sacred Utilities**:
   - Pure Web Audio API drone synthesizing fundamental Sa (138.59 Hz) and Pa (207.65 Hz) harmonics with zero external MP3/audio files.
   - 108-bead tactile digital Japa Mala counter with mobile haptic vibration and milestone temple bell chimes.

6. **Accessibility & Offline Resilience**:
   - WCAG AA contrast compliance across both Sattvic Light and Sanctum Dark modes.
   - Immediate offline degradation banner with uninterrupted offline operation.
   - Keyboard navigation with ESC modal dismissal and focus containment.

---

## How to Run

### Direct Local Browser
Open `index.html` directly in any modern browser (Chrome, Edge, Safari, Firefox). Zero build tools required.

### Local Server
```bash
# Using Node npm
npm start

# Using Python
npm run serve
# or: python -m http.server 8080
```
Visit `http://localhost:8080`.

---

## Automated Testing

Aaradhya includes an automated unit and integration test suite with zero external dependencies:

```bash
npm test
# or: node tests/unit-tests.js
```

### Verified Test Coverage:
- **Security & XSS Immunization**: Malicious script injection, quote escaping, null safety, phone & 6-digit pincode validation.
- **Panchang & Muhurat Engine**: Tithi, Nakshatra, and weekday Rahu Kaal calculations.
- **Booking State Machine**: Booking creation, 6-step progression, review submission, cancellation & refund calculation, slot rescheduling.
- **Family Ritual OS**: Member CRUD, 108 Japa round completion, Seva records, and state JSON backup/restore.

---

## Presentation & Pitch Guide

1. Click **⚡ Pitch Demo (60s)** in the top controller to auto-run the end-to-end customer journey.
2. Click **📊 Audit Log** in the top bar to inspect structured real-time telemetry and state transitions.
3. Click **💾 Backup** to test exporting and importing the ritual archive.
4. Click **📱 Mobile Frame** to switch between responsive layout and simulated 390px mobile viewport.
5. Click **🔄 Reset** to restore pristine initial demo state with clean seed data.
