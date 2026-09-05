# Aaradhya — High-Fidelity Monolithic Serverless Prototype

> **"Your rituals, organised. Faith with less friction."**

Aaradhya is a trusted ritual-management platform that makes Hindu rituals easier to discover, book, coordinate, track, and repeat for a family. Built as a high-fidelity, responsive, monolithic serverless web application using pure **HTML5, CSS3, and vanilla JavaScript (zero external runtime dependencies)**.

---

## Key Strategic Pillars

1. **Ritual Orchestration**: Coordinates the entire physical ritual journey:  
   `Need → Ritual → Muhurat → Pandit → Samagri → Execution → Completion → Memory → Rebooking`
2. **Family Ritual OS**: The user's family is a persistent entity with stored Gotra, tradition, preferred Purohit, previous rituals, and smart festive reminders.
3. **The Trust Stack**: Vetted Vedic Pandits, transparent packages, unadulterated Samagri checklist, live operational tracking, and digital Sankalp certificates.
4. **Deterministic Pitch & Demo Mode**: Includes an integrated top controller with an auto-advancing 30–60s pitch sequence, 390px mobile viewport toggle, and demo reset.

---

## Screen Catalog (15+ High-Fidelity Screens)

- **Screen 01 & 03: Home**: Sacred hero banner, dominant "Book a Puja" CTA, popular rituals grid (Griha Pravesh, Satyanarayan, Havan, etc.), smart festival reminder ("Navratri begins in 7 days"), family lifecycle card, and sacred utilities.
- **Screen 04: Puja Discovery**: Searchable catalog with category filter chips, pricing, and Vedic inclusions.
- **Screen 05: Puja Details**: Comprehensive overview of ritual significance, deity, duration, and Trust Stack guarantees.
- **Screen 06: Package Selection**: Two clean comparison packages (**Essential ₹5,500** vs. **Premium ₹8,999** Recommended).
- **Screen 07: Date & Muhurat**: Recommended Vedic Panchang slot (**18 October 2026, 10:00 AM – 12:15 PM** with Shubh Choghadiya & Rohini Nakshatra), alternative slots, and custom date picker.
- **Screen 08: Puja Location**: Doorstep address form with city hub coverage preview.
- **Screen 09: Pandit Matching**: Interactive matching animation ("Finding the right Pandit for you…") matching language, tradition, and experience, followed by **Pandit Rajesh Sharma** profile and alternative Purohit switcher.
- **Screen 10: Samagri Selection**: Complete 18-item unadulterated Samagri package (with categorized expandable checklist) vs. self-managed option.
- **Screen 11: Review & Secure Payment**: Transparent pricing breakdown (no hidden Dakshina or cash haggling) and escrow payment simulator (UPI, Card, Net Banking).
- **Screen 12: Booking Confirmation**: Reassurance banner, booking summary, and instant calendar sync.
- **Screen 13: Booking Tracking**: Vertical timeline showing real-time progression (`Confirmed` → `Pandit Assigned` → `Samagri Preparing` → `On The Way` → `Arrived` → `Completed`) with Pandit contact and 24×7 Concierge support.
- **Screen 14: Completion / Ritual Memory**: Ceremony conclusion, Digital Sankalp Certificate download/share, and 4-photo ritual memory vault.
- **Screen 15: Family Profile**: Family members (Drishti, Vikram, Maa, Papa) with Rashi/Nakshatra, Gotra (Kashyap), preferred Purohit, 1-click rebook, and ritual history.
- **Temple Seva**: Ancient temple offering flow (Kashi Vishwanath, Mahakaleshwar, Tirupati Balaji) with consecrated Prasad delivery.
- **Vedic Kundli & Muhurat**: Janampatri generator and daily Panchang auspicious timings.

---

## How to Run

### Direct Local Browser
Open `index.html` directly in any modern browser (Chrome, Edge, Safari, Firefox).

### Local HTTP Server
```bash
# Using Python
python -m http.server 8080

# Using Node.js npx
npx serve .
```
Then visit `http://localhost:8080`.

---

## Deployment

Deployable instantly to any static host:
- **Vercel**: Pre-configured with `vercel.json` (`cleanUrls: true`).
- **GitHub Pages**: Push repository and enable GitHub Pages on root.
- **Netlify / Cloudflare Pages**: Drag and drop folder.

Zero build steps, zero npm installs, 100% serverless.

---

## Presentation & Pitch Guide

1. Click **⚡ Pitch Demo (60s)** in the top bar to auto-run the core demo path:  
   `Home → Griha Pravesh → Premium → Muhurat → Location → Pandit Matching → Samagri → Review → Confirmation → Tracking → Advance to Complete → Ritual Memory → Family Profile`.
2. Click **📱 Mobile Frame** to switch between full responsive desktop layout and a simulated 390px mobile viewport.
3. Click **🔄 Reset** at any time to restore pristine initial state.
