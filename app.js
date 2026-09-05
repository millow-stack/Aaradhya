/**
 * Aaradhya — Monolithic Pure Vanilla JS Application
 * "Your rituals, organised. Faith with less friction."
 * Upgraded Hindu Essence Theme: Sacred Vermilion Red / Saffron Orange / Turmeric Gold
 * Typography: Pure White & Radiant Light-Green Text
 */

// ==========================================================================
// 1. Prototype State Store
// ==========================================================================
const AppState = {
  // Navigation & View State
  view: 'home',
  bookingStep: 0,
  isMatchingPandit: false,
  deviceFrame: false,

  // User Profile
  user: {
    name: 'Drishti',
    phone: '+91 98765 43210',
    city: 'Delhi NCR',
    language: 'Hindi',
    tradition: 'North Indian'
  },

  // Family Entity (Family Ritual OS)
  family: {
    name: 'Drishti Family',
    gotra: 'Kashyap',
    tradition: 'North Indian',
    preferredLanguage: 'Hindi',
    preferredPandit: 'Pandit Rajesh Sharma',
    members: [
      { id: 'm1', name: 'Drishti', role: 'You', avatar: '👩', rashi: 'Leo', nakshatra: 'Magha' },
      { id: 'm2', name: 'Vikram', role: 'Husband', avatar: '👨', rashi: 'Taurus', nakshatra: 'Rohini' },
      { id: 'm3', name: 'Sushila Devi', role: 'Maa', avatar: '👵', rashi: 'Cancer', nakshatra: 'Pushya' },
      { id: 'm4', name: 'Rajendra Kumar', role: 'Papa', avatar: '👴', rashi: 'Aries', nakshatra: 'Ashwini' }
    ],
    history: [
      {
        id: 'hist-1',
        ritual: 'Griha Pravesh Puja',
        date: '18 April 2026',
        pandit: 'Pandit Rajesh Sharma',
        package: 'Premium',
        location: 'Sector 62, Noida',
        status: 'Completed',
        sankalp: 'For Griha Pravesh & family peace and prosperity',
        rating: 5
      },
      {
        id: 'hist-2',
        ritual: 'Satyanarayan Katha',
        date: '15 December 2025',
        pandit: 'Pandit Rajesh Sharma',
        package: 'Essential',
        location: 'Mayur Vihar, Delhi',
        status: 'Completed',
        sankalp: 'Monthly family thanksgiving and blessings',
        rating: 5
      }
    ]
  },

  // Booking Flow State
  booking: {
    ritualId: 'griha-pravesh',
    ritualName: 'Griha Pravesh Puja',
    package: 'Premium',
    packagePrice: 8999,
    date: '18 October 2026',
    time: '10:00 AM – 12:15 PM',
    muhuratType: 'Shubh Choghadiya & Rohini Nakshatra (Auspicious)',
    location: {
      house: 'Tower B, Flat 702',
      address: 'Skyline Residency, Sector 62',
      landmark: 'Near Fortis Hospital',
      city: 'Delhi NCR',
      pincode: '201301'
    },
    panditId: 'rajesh',
    panditName: 'Pandit Rajesh Sharma',
    samagriChoice: 'Complete Samagri',
    paymentMethod: 'UPI',
    status: 'Confirmed'
  },

  // Ecosystem Data
  sevaOfferings: [
    { id: 'seva-1', temple: 'Shri Kashi Vishwanath, Varanasi', amount: '₹501', title: 'Nitya Deepdaan & Chadhava', date: '2 days ago' }
  ],

  // Devotional Features per design.json (2026.1.0)
  theme: 'light',
  japa: {
    count: 0,
    target: 108,
    rounds: 0,
    currentMantra: 'gayatri'
  },
  audioVisualizer: {
    isPlaying: false,
    trackName: 'Sacred Gayatri Mahamantra & Vedic Tanpura Drone'
  },

  // UI helpers
  toastTimer: null
};

// ==========================================================================
// 2. Catalogs & Mock Databases
// ==========================================================================
const RITUALS_CATALOG = [
  {
    id: 'griha-pravesh',
    icon: '🏠',
    name: 'Griha Pravesh Puja',
    shortDesc: 'Sacred blessings for peaceful entry into a new home.',
    priceStart: 5500,
    duration: '2.5 – 3 Hours',
    deity: 'Lord Ganesha & Vastu Purush',
    purpose: 'New Home & Prosperity',
    tags: ['Most Booked', 'Vedic'],
    details: 'A sacred Vedic ceremony performed before shifting into a new residence to cleanse negative energies, invoke divine blessings of Vastu Devata, and bring abundance, health, and peace to the entire household.'
  },
  {
    id: 'satyanarayan',
    icon: '🪔',
    name: 'Satyanarayan Katha',
    shortDesc: 'Vedic recitation of Lord Vishnu’s divine glory.',
    priceStart: 3500,
    duration: '2 Hours',
    deity: 'Lord Satyanarayan (Vishnu)',
    purpose: 'Peace & Thanksgiving',
    tags: ['Family Favorite'],
    details: 'Recitation of the sacred Satyanarayan Katha from the Skanda Purana, performed on Poornima or special family occasions to express gratitude, seek divine protection, and restore household harmony.'
  },
  {
    id: 'havan',
    icon: '🔥',
    name: 'Maha Ganapati Havan',
    shortDesc: 'Removal of obstacles with sacred fire offerings.',
    priceStart: 2500,
    duration: '1.5 – 2 Hours',
    deity: 'Lord Ganesha',
    purpose: 'Obstacle Removal & Sankalp',
    tags: ['Auspicious'],
    details: 'Holy agnihotra fire ritual invoking Lord Ganesha to eliminate impediments from work, business, or personal ventures, and sanctify your premises with sacred herb-infused mantras.'
  },
  {
    id: 'naamkaran',
    icon: '👶',
    name: 'Naamkaran Sanskar',
    shortDesc: 'Traditional Vedic newborn naming ceremony.',
    priceStart: 4500,
    duration: '2 Hours',
    deity: 'Kuldevata & Navagrahas',
    purpose: 'Newborn Ceremony',
    tags: ['Sanskar'],
    details: 'One of the principal 16 Vedic Sanskars performed on the 11th or 21st day after childbirth to name the newborn in accordance with astrological nakshatra syllables and ancestral traditions.'
  },
  {
    id: 'mundan',
    icon: '✂️',
    name: 'Mundan Sanskar',
    shortDesc: 'First tonsure ceremony for vitality and longevity.',
    priceStart: 4000,
    duration: '2 Hours',
    deity: 'Kuldevata & Ganga Mata',
    purpose: 'Child Purification',
    tags: ['Sanskar'],
    details: 'Traditional head-shaving ritual performed in childhood to sever karmic ties with past life impressions, promote healthy cranial hair growth, and invoke divine mental clarity.'
  },
  {
    id: 'vastu-puja',
    icon: '🕉️',
    name: 'Vastu Shanti Puja',
    shortDesc: 'Balancing the 5 cosmic elements in your space.',
    priceStart: 5000,
    duration: '3 Hours',
    deity: 'Vastu Purush & Dikpalas',
    purpose: 'Home Harmony',
    tags: ['Architectural Harmony'],
    details: 'Sacred ritual aimed at pacifying directional discrepancies (Vastu Doshas) in residences or commercial establishments, inviting harmonic life-force (Prana) flow.'
  },
  {
    id: 'shradh',
    icon: '🙏',
    name: 'Shradh & Pitru Tarpan',
    shortDesc: 'Ancestral homage and generational blessings.',
    priceStart: 4500,
    duration: '2 Hours',
    deity: 'Pitru Devatas',
    purpose: 'Ancestral Peace',
    tags: ['Solemn Vedic'],
    details: 'Sacred ceremonial homage to ancestors performed during Pitru Paksha or death anniversaries with black sesame (Til), barley, and Kusha grass to seek ancestral peace and blessings.'
  },
  {
    id: 'rudrabhishek',
    icon: '🔱',
    name: 'Maha Rudrabhishek',
    shortDesc: 'Potent Vedic abhishek for health and inner peace.',
    priceStart: 3800,
    duration: '2.5 Hours',
    deity: 'Lord Shiva',
    purpose: 'Health & Protection',
    tags: ['Powerful'],
    details: 'Potent abhishek of the Shiva Linga with Panchamrit, holy Gangajal, and sugarcane juice while chanting the Sri Rudram hymn to ward off malefic influences and cultivate spiritual serenity.'
  }
];

const PANDITS_DATABASE = [
  {
    id: 'rajesh',
    name: 'Pandit Rajesh Sharma',
    avatarInitials: 'RS',
    experience: '8+ years',
    rating: 4.9,
    bookingsCount: 247,
    languages: 'Hindi • Sanskrit',
    tradition: 'North Indian / Shukla Yajurveda',
    education: 'Acharya from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi',
    verified: true,
    bgChecked: true,
    bio: 'Specialist in Griha Pravesh, Vastu, and Mahamrityunjaya Havan with authentic Vedic pronunciation. Known for punctuality, explaining ritual mantras clearly to families, and graceful conduct.',
    reviews: [
      { devotee: 'Anurag & Neha', comment: 'Pandit ji explained the deeper meaning behind each mantra during our Griha Pravesh. Extremely calm and punctual.' },
      { devotee: 'Meenakshi K.', comment: 'Everything was conducted respectfully. He arrived 15 minutes before the Muhurat with his puja attire.' }
    ]
  },
  {
    id: 'anand',
    name: 'Pandit Anand Shastri',
    avatarInitials: 'AS',
    experience: '12+ years',
    rating: 4.9,
    bookingsCount: 310,
    languages: 'Hindi • Awadhi • Sanskrit',
    tradition: 'North Indian / Rigveda',
    education: 'Shastri from Kashi Naresh Sanskrit Vidyalaya',
    verified: true,
    bgChecked: true,
    bio: 'Venerated Purohit specializing in Sanskars, Ramcharitmanas recitation, and elaborate Havan rituals. Over a decade of ritual service across Delhi NCR.',
    reviews: [
      { devotee: 'Rameshwar Dayal', comment: 'Very deep knowledge of Muhurat and Shastras. Our family has invited him thrice.' }
    ]
  },
  {
    id: 'manoj',
    name: 'Pandit Manoj Mishra',
    avatarInitials: 'MM',
    experience: '10+ years',
    rating: 4.8,
    bookingsCount: 190,
    languages: 'Hindi • Maithili',
    tradition: 'Mithila & North Indian',
    education: 'Darbhanga Sanskrit Vishwavidyalaya',
    verified: true,
    bgChecked: true,
    bio: 'Dedicated to Vedic rituals with pristine pronunciation and adherence to family Kul-parampara. Highly appreciated for warm, patient guidance.',
    reviews: [
      { devotee: 'Vikas Sharma', comment: 'Handled our Satyanarayan katha very smoothly. Punctual and humble.' }
    ]
  }
];

const SAMAGRI_ITEMS = [
  { category: 'Havan & Sacred Fire', items: ['Dry Wood Sticks (Samidha)', 'Pure Cow Ghee (500g)', 'Vedic Havan Samagri Herbs', 'Pure Camphor (Bhimseni Kapoor)', 'Guggal & Loban incense', 'Navagraha Wood Sticks'] },
  { category: 'Kalash & Vastra', items: ['Pure Brass Kalash', 'Sacred Red Altar Cloth (1.25m)', 'Yellow Vastra for Ganesha', 'Sacred Kalawa / Mauli Thread', 'Sacred Janeu Threads (3 pairs)'] },
  { category: 'Botanicals & Offerings', items: ['Fresh Mango Leaves (Ashoka/Aam)', 'Whole Water Coconuts (Shrifal)', 'Betel Leaves (Paan) & Betel Nuts (Supari)', 'Organic Haldi & Kumkum', 'Whole Akshat Rice'] },
  { category: 'Sacred Fluids & Essentials', items: ['Pure Gangajal from Haridwar', 'Panchamrit Mixture Essentials', 'Brass Diya & Cotton Wicks', 'Pure Dhoop & Agarbatti'] }
];

// ==========================================================================
// 2.5 Devotional Features (design.json 2026.1.0)
// ==========================================================================

const JAPA_MANTRAS = {
  gayatri: {
    name: 'Gayatri Mahamantra',
    deity: 'Maa Gayatri / Savitr',
    devanagari: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    meaning: 'May the Divine Sun inspire and illuminate our intellect with transcendental wisdom.'
  },
  mahamrityunjaya: {
    name: 'Maha Mrityunjaya',
    deity: 'Bhagwan Shiva',
    devanagari: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
    meaning: 'We worship the Three-Eyed Lord who nourishes all beings. May He liberate us from mortality.'
  },
  om_namah_shivaya: {
    name: 'Shiva Panchakshari',
    deity: 'Mahadev',
    devanagari: 'ॐ नमः शिवाय',
    meaning: 'I bow with supreme surrender to Shiva, the auspicious inner consciousness.'
  },
  hare_krishna: {
    name: 'Maha Mantra',
    deity: 'Sri Sri Radha Krishna',
    devanagari: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥',
    meaning: 'O Divine Energy (Hare) and All-Attractive Supreme (Krishna/Rama), engage me in devotion.'
  }
};

// Web Audio API Synthesizer (Zero External Dependencies)
let webAudioCtx = null;
let tanpuraOscillators = [];

function playDevotionalAudio() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!webAudioCtx) webAudioCtx = new AudioCtx();
    if (webAudioCtx.state === 'suspended') webAudioCtx.resume();

    stopDevotionalAudio();

    // Sacred Tanpura drone harmonic frequencies: Sa (138.59 Hz), Pa (207.65 Hz), Sa' (277.18 Hz), High Sa (554.37 Hz)
    const freqs = [138.59, 207.65, 277.18, 554.37];
    freqs.forEach((f, idx) => {
      const osc = webAudioCtx.createOscillator();
      const gain = webAudioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, webAudioCtx.currentTime);
      gain.gain.setValueAtTime(0.04 / (idx + 1), webAudioCtx.currentTime);
      osc.connect(gain);
      gain.connect(webAudioCtx.destination);
      osc.start();
      tanpuraOscillators.push({ osc, gain });
    });
    AppState.audioVisualizer.isPlaying = true;
    updateAudioUI(true);
  } catch (e) {
    console.log('Web Audio started on user action');
  }
}

function stopDevotionalAudio() {
  if (tanpuraOscillators.length > 0) {
    tanpuraOscillators.forEach(o => {
      try { o.osc.stop(); o.osc.disconnect(); } catch (e) {}
    });
    tanpuraOscillators = [];
  }
  AppState.audioVisualizer.isPlaying = false;
  updateAudioUI(false);
}

function toggleAartiPlayer() {
  if (AppState.audioVisualizer.isPlaying) {
    stopDevotionalAudio();
    showToast('Aarti & Tanpura drone paused');
  } else {
    playDevotionalAudio();
    showToast('Playing sacred Tanpura drone & Om resonance');
  }
}

function updateAudioUI(isPlaying) {
  const bars = document.getElementById('aartiVisualizerContainer');
  if (bars) {
    if (isPlaying) bars.classList.add('visualizer-playing');
    else bars.classList.remove('visualizer-playing');
  }
  const quickIcon = document.getElementById('aartiQuickIcon');
  const headerIcon = document.getElementById('headerAartiIcon');
  const playBtnText = document.getElementById('aartiPlayBtnText');
  const playBtnIcon = document.getElementById('aartiPlayBtnIcon');

  if (isPlaying) {
    if (quickIcon) quickIcon.textContent = '⏸️';
    if (headerIcon) headerIcon.textContent = '🔔';
    if (playBtnIcon) playBtnIcon.textContent = '⏸️';
    if (playBtnText) playBtnText.textContent = 'Pause Aarti';
  } else {
    if (quickIcon) quickIcon.textContent = '🎵';
    if (headerIcon) headerIcon.textContent = '🪔';
    if (playBtnIcon) playBtnIcon.textContent = '▶️';
    if (playBtnText) playBtnText.textContent = 'Play Aarti';
  }
}

function playTempleChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!webAudioCtx) webAudioCtx = new AudioCtx();
    if (webAudioCtx.state === 'suspended') webAudioCtx.resume();

    const osc = webAudioCtx.createOscillator();
    const gain = webAudioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, webAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, webAudioCtx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.3, webAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, webAudioCtx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(webAudioCtx.destination);
    osc.start();
    osc.stop(webAudioCtx.currentTime + 0.8);
  } catch (e) {}
}

function triggerHaptic() {
  if (navigator.vibrate) {
    try { navigator.vibrate([35]); } catch (e) {}
  }
}

// Bi-directional Devotional Theme Switcher
function toggleDevotionalTheme(explicit) {
  const current = document.body.getAttribute('data-theme') || AppState.theme || 'light';
  const nextTheme = explicit || (current === 'light' ? 'dark' : 'light');
  document.body.setAttribute('data-theme', nextTheme);
  AppState.theme = nextTheme;
  localStorage.setItem('aaradhya_devotional_theme', nextTheme);

  const demoIcon = document.getElementById('themeToggleDemoIcon');
  const demoText = document.getElementById('themeToggleDemoText');
  const headerIcon = document.getElementById('headerThemeIcon');

  if (nextTheme === 'dark') {
    if (demoIcon) demoIcon.textContent = '☀️';
    if (demoText) demoText.textContent = 'Sattvic Light';
    if (headerIcon) headerIcon.textContent = '☀️';
    showToast('Switched to Temple Sanctum Dark Mode');
  } else {
    if (demoIcon) demoIcon.textContent = '🌙';
    if (demoText) demoText.textContent = 'Sanctum Mode';
    if (headerIcon) headerIcon.textContent = '🌙';
    showToast('Switched to Sattvic Devotional Light Mode');
  }
}

// Contextual & Temporal Muhurat Calculations
function getTemporalMuhuratInfo() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 6) {
    return { name: 'Brahma Muhurta', description: 'Highest Sattvic energy for meditation & Sankalp', isAuspicious: true };
  } else if (hour >= 6 && hour < 9) {
    return { name: 'Pratah Sandhya', description: 'Surya Vandana and auspicious morning rituals', isAuspicious: true };
  } else if (hour >= 9 && hour < 12) {
    return { name: 'Shubh Choghadiya', description: 'Ideal Muhurat for Griha Pravesh & Havan', isAuspicious: true };
  } else if (hour >= 12 && hour < 13) {
    return { name: 'Abhijit Muhurat', description: 'Vijay Muhurat — eliminates all inauspiciousness', isAuspicious: true };
  } else if (hour >= 16 && hour < 18) {
    return { name: 'Rahu Kaal Period', description: 'Time for quiet introspection; avoid new undertakings', isAuspicious: false };
  } else if (hour >= 18 && hour < 20) {
    return { name: 'Sayam Sandhya & Twilight Aarti', description: 'Deepdaan, Temple Aarti and evening prayer', isAuspicious: true };
  } else {
    return { name: 'Ratri Shanti & Nishita', description: 'Calm evening remembrance & peaceful reflection', isAuspicious: true };
  }
}

// UI Component: Daily Panchang Card per design.json
function renderDailyPanchangCard() {
  const temporal = getTemporalMuhuratInfo();
  return `
    <div class="daily-panchang-card" aria-label="Daily Vedic Panchang Card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px">
        <div>
          <div class="eyebrow" style="color:#D84315">Vedic Panchang & Muhurat</div>
          <h3 class="daily-panchang-title">
            <span>📅</span> Today's Auspicious Timings (${AppState.user.city})
          </h3>
        </div>
        <span class="badge badge-verified">
          <span class="pulse-ring"></span> ${temporal.name} Active
        </span>
      </div>

      <div class="daily-panchang-body">
        <p style="margin-bottom:12px">
          Astrological alignment calculated according to North Indian Panchang for today, ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
        </p>

        <div class="panchang-grid-metrics">
          <div class="panchang-metric-box">
            <div class="panchang-metric-label">Tithi</div>
            <div class="panchang-metric-val">Shukla Dashami</div>
          </div>
          <div class="panchang-metric-box">
            <div class="panchang-metric-label">Nakshatra</div>
            <div class="panchang-metric-val auspicious">Rohini (Divine)</div>
          </div>
          <div class="panchang-metric-box">
            <div class="panchang-metric-label">Abhijit Muhurat</div>
            <div class="panchang-metric-val auspicious">11:45 AM – 12:35 PM</div>
          </div>
          <div class="panchang-metric-box">
            <div class="panchang-metric-label">Rahu Kaal (Avoid)</div>
            <div class="panchang-metric-val caution">04:30 PM – 06:00 PM</div>
          </div>
        </div>

        <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px">
          <div style="font-size:12px; font-weight:600; color:var(--soft-sage-green-text)">
            ✦ Deity of the Day: <strong>Surya Narayan & Lord Ganesha</strong>
          </div>
          <div style="display:flex; gap:8px; align-items:center">
            <button type="button" class="btn btn-sm btn-ghost" onclick="nav('kundli')" style="font-weight:600">
              Full Kundli & Chart →
            </button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="startBookingFlow('griha-pravesh')">
              Plan Puja for Date →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// UI Component: Aarti & Mantra Audio Visualizer per design.json
function renderAartiVisualizerBar() {
  const isPlaying = AppState.audioVisualizer.isPlaying;
  return `
    <div class="aarti-visualizer-bar" id="aartiVisualizerContainer">
      <div class="visualizer-info">
        <div class="visualizer-icon-wrap">🪔</div>
        <div>
          <div class="eyebrow" style="color:var(--deep-vermilion-red)">Dynamic Audio Visualizer</div>
          <div class="visualizer-title">${AppState.audioVisualizer.trackName}</div>
          <div class="visualizer-sub">Harmonic Vedic Tanpura & Temple Bells Ambient Sound</div>
        </div>
      </div>

      <div class="visualizer-waves-container ${isPlaying ? 'visualizer-playing' : ''}">
        <span class="visualizer-wave-bar"></span>
        <span class="visualizer-wave-bar"></span>
        <span class="visualizer-wave-bar"></span>
        <span class="visualizer-wave-bar"></span>
        <span class="visualizer-wave-bar"></span>
        <span class="visualizer-wave-bar"></span>
        <span class="visualizer-wave-bar"></span>
        <span class="visualizer-wave-bar"></span>
      </div>

      <div class="visualizer-controls">
        <button type="button" class="btn btn-sm btn-primary" onclick="toggleAartiPlayer()">
          <span id="aartiPlayBtnIcon">${isPlaying ? '⏸️' : '▶️'}</span>
          <span id="aartiPlayBtnText">${isPlaying ? 'Pause Aarti' : 'Play Aarti'}</span>
        </button>
        <button type="button" class="btn btn-sm btn-secondary" onclick="openJapaMalaModal()">
          <span>📿 Japa Mala</span>
        </button>
      </div>
    </div>
  `;
}

// UI Component: Tactile Digital Prayer Beads (Japa Counter with haptics & audio)
function openJapaMalaModal() {
  const mantra = JAPA_MANTRAS[AppState.japa.currentMantra] || JAPA_MANTRAS.gayatri;
  const circumference = 565;
  const progressOffset = circumference - (AppState.japa.count / AppState.japa.target) * circumference;

  openModal(`
    <div class="japa-counter-wrap">
      <div class="eyebrow" style="margin-bottom:8px">Tactile Digital Prayer Beads</div>
      <h2 class="japa-mantra-title" id="japaMantraTitle">${mantra.name}</h2>
      <p class="japa-mantra-devanagari" id="japaMantraDevanagari">${mantra.devanagari}</p>

      <div class="japa-ring-stage">
        <svg class="japa-ring-svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="japaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#D84315" />
              <stop offset="50%" stop-color="#FF6F00" />
              <stop offset="100%" stop-color="#FFB300" />
            </linearGradient>
          </defs>
          <circle class="japa-circle-bg" cx="100" cy="100" r="90" />
          <circle class="japa-circle-bar" id="japaCircleBar" cx="100" cy="100" r="90" style="stroke-dashoffset:${progressOffset}px" />
        </svg>

        <div class="japa-center-info">
          <div class="japa-count-display" id="japaCountNum">${AppState.japa.count}</div>
          <div class="japa-target-sub">/ 108 Sacred Beads</div>
          <div class="micro text-light-green" id="japaRoundsText" style="margin-top:4px">
            Round: <strong>${AppState.japa.rounds} Completed</strong>
          </div>
        </div>
      </div>

      <!-- Mantra selector chips -->
      <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:16px">
        ${Object.keys(JAPA_MANTRAS).map(k => `
          <button type="button" class="badge ${AppState.japa.currentMantra === k ? 'badge-primary' : 'badge-neutral'}" 
                  onclick="selectJapaMantra('${k}')" style="cursor:pointer; padding:6px 12px; font-size:12px">
            ${JAPA_MANTRAS[k].name}
          </button>
        `).join('')}
      </div>

      <div class="japa-action-row">
        <button type="button" class="japa-tap-btn mantra-counter-button" onclick="tapJapaBead()">
          <span>📿</span> <strong>Chant (Japa)</strong>
        </button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="resetJapaMala()">
          <span>🔄 Reset</span>
        </button>
      </div>
      <p class="micro text-light-green" style="margin-top:14px">
        ✨ Tactile haptics, prayer bead counter, and sacred bell chime active.
      </p>
    </div>
  `);
}

function tapJapaBead() {
  triggerHaptic();
  playTempleChime();

  AppState.japa.count += 1;
  if (AppState.japa.count >= AppState.japa.target) {
    AppState.japa.count = 0;
    AppState.japa.rounds += 1;
    showToast('✨ 1 Mala (108 chants) Completed! Divine blessings!');
  }

  const countEl = document.getElementById('japaCountNum');
  const roundsEl = document.getElementById('japaRoundsText');
  const barEl = document.getElementById('japaCircleBar');

  if (countEl) countEl.textContent = AppState.japa.count;
  if (roundsEl) roundsEl.innerHTML = `Round: <strong>${AppState.japa.rounds} Completed</strong>`;
  if (barEl) {
    const circumference = 565;
    const progressOffset = circumference - (AppState.japa.count / AppState.japa.target) * circumference;
    barEl.style.strokeDashoffset = `${progressOffset}px`;
  }
}

function resetJapaMala() {
  AppState.japa.count = 0;
  const countEl = document.getElementById('japaCountNum');
  const barEl = document.getElementById('japaCircleBar');
  if (countEl) countEl.textContent = '0';
  if (barEl) barEl.style.strokeDashoffset = '565px';
  showToast('Mala counter reset to 0');
}

function selectJapaMantra(mantraKey) {
  if (JAPA_MANTRAS[mantraKey]) {
    AppState.japa.currentMantra = mantraKey;
    openJapaMalaModal();
  }
}

// ==========================================================================
// 3. Navigation & Core Flow Controls
// ==========================================================================
function nav(viewName, step = 0) {
  AppState.view = viewName;
  AppState.bookingStep = step;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectRitual(ritualId) {
  const ritual = RITUALS_CATALOG.find(r => r.id === ritualId) || RITUALS_CATALOG[0];
  AppState.booking.ritualId = ritual.id;
  AppState.booking.ritualName = ritual.name;
  AppState.view = 'detail';
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startBookingFlow(ritualId) {
  if (ritualId) {
    const ritual = RITUALS_CATALOG.find(r => r.id === ritualId);
    if (ritual) {
      AppState.booking.ritualId = ritual.id;
      AppState.booking.ritualName = ritual.name;
    }
  }
  AppState.view = 'book';
  AppState.bookingStep = 1;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextBookingStep() {
  if (AppState.bookingStep === 3) {
    AppState.bookingStep = 4;
    AppState.isMatchingPandit = true;
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      AppState.isMatchingPandit = false;
      renderApp();
      showToast('Pandit Rajesh Sharma matched with 98% compatibility!');
    }, 1200);
    return;
  }

  if (AppState.bookingStep < 7) {
    AppState.bookingStep++;
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    processPayment();
  }
}

function prevBookingStep() {
  if (AppState.bookingStep > 1) {
    AppState.bookingStep--;
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    nav('detail');
  }
}

function processPayment() {
  showToast('Verifying sacred escrow payment…');
  setTimeout(() => {
    AppState.booking.status = 'Confirmed';
    AppState.view = 'confirmation';
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 700);
}

function advanceTrackingStatus() {
  const statusCycle = {
    'Confirmed': 'Pandit Assigned',
    'Pandit Assigned': 'Samagri Preparing',
    'Samagri Preparing': 'On The Way',
    'On The Way': 'Arrived',
    'Arrived': 'Completed',
    'Completed': 'Completed'
  };
  const current = AppState.booking.status;
  const next = statusCycle[current] || 'Confirmed';
  AppState.booking.status = next;

  if (next === 'Completed') {
    renderApp();
    showToast('Puja completed! View ritual memory & completion proof.');
    setTimeout(() => {
      nav('completion');
    }, 600);
  } else {
    renderApp();
    showToast(`Status updated: ${next}`);
  }
}

// ==========================================================================
// 4. Component Renderers (Hindu Essence with White/Light-Green Text)
// ==========================================================================

// Screen 01 & 03: Home Screen (Cutting-Edge Bento Grid & Glassmorphic Hero)
function renderHomeScreen() {
  const temporal = getTemporalMuhuratInfo();

  return `
    <section class="screen-view active">
      <!-- Ambient Temporal Muhurat Strip -->
      <div class="temporal-muhurat-strip" role="region" aria-label="Current Hindu Muhurta">
        <span class="pulse-ring"></span>
        <span><strong>${temporal.name}:</strong> ${temporal.description}</span>
        <button type="button" class="btn-ghost small" onclick="openJapaMalaModal()" style="padding:0 6px; font-weight:700; text-decoration:underline;">
          Open Japa Mala (108) →
        </button>
      </div>

      <!-- 1. HIGH-IMPACT HERO SECTION -->
      <div class="hero-stage">
        <div class="hero-left">
          <div class="eyebrow-pill">
            <span class="pulse-dot" style="display:inline-block"></span>
            <span class="eyebrow" style="margin:0">Vedic Tradition · Modern Fluidity</span>
          </div>
          <h1 class="display-title">
            Faith, elevated.<br>
            <span class="gradient-text-saffron">Rituals, organised.</span>
          </h1>
          <p>
            From finding the verified Pandit to preparing 100% pure Samagri and preserving your family's generational sacred memories — Aaradhya delivers spiritual devotion with zero friction.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary" onclick="startBookingFlow('griha-pravesh')">
              <span>Book a Ceremony</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button type="button" class="btn btn-secondary" onclick="nav('book', 0)">
              <span>Explore 8+ Rituals</span>
            </button>
            <button type="button" class="btn btn-secondary" onclick="openJapaMalaModal()" title="Launch Tactile Digital Prayer Beads">
              <span>📿 Japa Mala</span>
            </button>
          </div>
        </div>

        <!-- Floating 3D/Glassmorphic Product Preview Card -->
        <div class="hero-preview-wrap">
          <div class="hero-3d-card tilt-card spotlight-card">
            <div class="hero-card-header">
              <div style="display:flex; align-items:center; gap:8px">
                <span style="font-size:22px">🏠</span>
                <div>
                  <h4 style="font-size:16px; margin:0">Griha Pravesh Puja</h4>
                  <span class="micro text-muted">Auspicious New Home Sanctification</span>
                </div>
              </div>
              <span class="live-status-pill">
                <span class="live-pulse"></span> Verified
              </span>
            </div>

            <div class="hero-mini-pandit">
              <div class="mini-avatar">ॐ</div>
              <div style="flex:1">
                <div style="font-weight:700; font-size:14px">Pandit Rajesh Sharma</div>
                <div class="micro" style="color:var(--gold)">Vedas Acharya · 18+ Yrs Exp · 4.98★</div>
              </div>
              <span class="badge badge-verified" style="font-size:11px">98% Match</span>
            </div>

            <div style="background:var(--bg-surface-alt); border-radius:var(--radius-md); padding:12px; border:1px solid var(--border-subtle); margin-bottom:14px">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px">
                <span class="micro text-muted">Doorstep Samagri:</span>
                <span class="micro" style="color:var(--emerald); font-weight:700">32 Pure Vedic Items Ready</span>
              </div>
              <div style="display:flex; justify-content:space-between">
                <span class="micro text-muted">Auspicious Window:</span>
                <span class="micro" style="color:var(--gold); font-weight:700">Rohini Nakshatra (Tomorrow 10 AM)</span>
              </div>
            </div>

            <button type="button" class="btn btn-sm btn-primary btn-block" onclick="startBookingFlow('griha-pravesh')">
              <span>Launch Instant Booking Flow</span> →
            </button>
          </div>
        </div>
      </div>

      <!-- 2. INFINITE MARQUEE TICKER (Faded Edge Mask) -->
      <div class="marquee-wrapper" aria-label="Sacred Trust Partners & Credentials">
        <div class="marquee-track">
          <div class="marquee-item"><span class="item-symbol">🕉️</span> Sri Kashi Vishwanath Seva Partner</div>
          <div class="marquee-item"><span class="item-symbol">✦</span> 100% Certified Organic Samagri</div>
          <div class="marquee-item"><span class="item-symbol">🪔</span> Rigveda & Yajurveda Certified Purohits</div>
          <div class="marquee-item"><span class="item-symbol">📜</span> Digital Family Sankalp & Memory OS</div>
          <div class="marquee-item"><span class="item-symbol">🔔</span> Tactile Japa Beads with Haptics</div>
          <div class="marquee-item"><span class="item-symbol">🌺</span> Mahakaleshwar Ujjain Bhasma Aarti</div>
          <div class="marquee-item"><span class="item-symbol">⚡</span> Instant Muhurat & Choghadiya Engine</div>
          <!-- Repeat for endless seamless loop -->
          <div class="marquee-item"><span class="item-symbol">🕉️</span> Sri Kashi Vishwanath Seva Partner</div>
          <div class="marquee-item"><span class="item-symbol">✦</span> 100% Certified Organic Samagri</div>
          <div class="marquee-item"><span class="item-symbol">🪔</span> Rigveda & Yajurveda Certified Purohits</div>
          <div class="marquee-item"><span class="item-symbol">📜</span> Digital Family Sankalp & Memory OS</div>
          <div class="marquee-item"><span class="item-symbol">🔔</span> Tactile Japa Beads with Haptics</div>
          <div class="marquee-item"><span class="item-symbol">🌺</span> Mahakaleshwar Ujjain Bhasma Aarti</div>
          <div class="marquee-item"><span class="item-symbol">⚡</span> Instant Muhurat & Choghadiya Engine</div>
        </div>
      </div>

      <!-- 3. BENTO GRID FEATURE SHOWCASE -->
      <div class="bento-section">
        <div style="margin-bottom:var(--space-4)">
          <div class="eyebrow" style="color:var(--saffron)">Bento Architecture 2026</div>
          <h2 class="section-title">Built for Sacred Simplicity</h2>
          <p class="text-muted" style="max-width:600px">Every component engineered to remove cognitive fatigue and coordinate traditional rituals seamlessly.</p>
        </div>

        <div class="bento-grid">
          <!-- Card 1: 8 Columns - Daily Panchang & Muhurat Calculations -->
          <div class="glass-card spotlight-card bento-card bento-span-8 tilt-card">
            <div class="bento-card-inner">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start">
                  <div class="bento-icon-badge">📅</div>
                  <span class="live-status-pill"><span class="live-pulse"></span> Live North Indian Panchang</span>
                </div>
                <h3>Daily Vedic Panchang & Muhurat Engine</h3>
                <p>Calculated in real time for ${AppState.user.city}. Access planetary tithi, nakshatra, and auspicious windows without needing thick astrological books.</p>
                
                <div class="bento-panchang-metrics">
                  <div class="bento-metric-cell">
                    <div class="label">Tithi</div>
                    <div class="val">Shukla Dashami</div>
                  </div>
                  <div class="bento-metric-cell">
                    <div class="label">Nakshatra</div>
                    <div class="val green">Rohini (Supreme)</div>
                  </div>
                  <div class="bento-metric-cell">
                    <div class="label">Abhijit Muhurat</div>
                    <div class="val green">11:45 AM – 12:35 PM</div>
                  </div>
                  <div class="bento-metric-cell">
                    <div class="label">Rahu Kaal (Avoid)</div>
                    <div class="val" style="color:var(--vermilion)">04:30 PM – 06:00 PM</div>
                  </div>
                </div>
              </div>

              <div style="margin-top:var(--space-4); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px">
                <span class="micro" style="color:var(--text-muted)">✦ Auspicious Deity Today: <strong>Lord Ganesha & Surya Dev</strong></span>
                <button type="button" class="btn btn-sm btn-primary" onclick="startBookingFlow('griha-pravesh')">
                  Plan Ritual for Date →
                </button>
              </div>
            </div>
          </div>

          <!-- Card 2: 4 Columns - Verified Pandit Matching Algorithm -->
          <div class="glass-card spotlight-card bento-card bento-span-4 tilt-card">
            <div class="bento-card-inner">
              <div>
                <div class="bento-icon-badge">✨</div>
                <h3>98.4% Match Accuracy</h3>
                <p>Pandits vetted across 4 Vedas, Gurukul credentials, background check, and regional Kul-parampara adherence.</p>
              </div>
              <div style="margin-top:var(--space-4)">
                <div style="background:var(--bg-surface-alt); padding:10px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:12px">
                  <div class="micro" style="color:var(--emerald); font-weight:700">✓ 100% Sanskrit Shloka Verification</div>
                  <div class="micro text-muted">Vedic pronunciation & Gotra compatibility test passed.</div>
                </div>
                <button type="button" class="btn btn-sm btn-secondary btn-block" onclick="nav('book', 0)">
                  Browse Pandits →
                </button>
              </div>
            </div>
          </div>

          <!-- Card 3: 4 Columns - Tactile Digital Prayer Beads -->
          <div class="glass-card spotlight-card bento-card bento-span-4 tilt-card">
            <div class="bento-card-inner">
              <div>
                <div class="bento-icon-badge">📿</div>
                <h3>108 Japa Mala Counter</h3>
                <p>Tactile digital prayer beads with real-time mobile haptic vibration and sacred temple bell resonance.</p>
              </div>
              <div style="margin-top:var(--space-4)">
                <button type="button" class="btn btn-sm btn-primary btn-block" onclick="openJapaMalaModal()">
                  <span>Chant Japa (108)</span> →
                </button>
              </div>
            </div>
          </div>

          <!-- Card 4: 4 Columns - 100% Pure Organic Samagri -->
          <div class="glass-card spotlight-card bento-card bento-span-4 tilt-card">
            <div class="bento-card-inner">
              <div>
                <div class="bento-icon-badge">📦</div>
                <h3>Tamper-Proof Samagri</h3>
                <p>Pure Haridwar Gangajal, Gir Cow A2 Ghee, Bhimseni Camphor, and hand-selected herbal Havan packs.</p>
              </div>
              <div style="margin-top:var(--space-4)">
                <div class="live-status-pill" style="width:100%; justify-content:center">
                  <span>✓ 32 Certified Vedic Items</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 5: 4 Columns - Family Ritual OS Vault -->
          <div class="glass-card spotlight-card bento-card bento-span-4 tilt-card">
            <div class="bento-card-inner">
              <div>
                <div class="bento-icon-badge">📜</div>
                <h3>Generational Memory</h3>
                <p>Never lose your Sankalp dates. Persistent family vault stores member Gotras, birth rashis, and completion proofs.</p>
              </div>
              <div style="margin-top:var(--space-4)">
                <button type="button" class="btn btn-sm btn-secondary btn-block" onclick="nav('family')">
                  Open Family Vault →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. INTERACTIVE METRICS / STATS SECTION -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card spotlight-card">
            <div class="stat-number gradient-text-saffron" data-target="98.4" data-suffix="%">0%</div>
            <div class="stat-label">Pandit Matching Accuracy</div>
          </div>
          <div class="stat-card spotlight-card">
            <div class="stat-number gradient-text-gold" data-target="12500" data-suffix="+">0</div>
            <div class="stat-label">Sacred Rituals Managed</div>
          </div>
          <div class="stat-card spotlight-card">
            <div class="stat-number gradient-text-cyan" data-target="100" data-suffix="%">0%</div>
            <div class="stat-label">Pure Organic Samagri</div>
          </div>
          <div class="stat-card spotlight-card">
            <div class="stat-number gradient-text-saffron" data-target="4.98" data-suffix="★">0★</div>
            <div class="stat-label">Devotee Trust Rating</div>
          </div>
        </div>
      </div>

      <!-- 5. DYNAMIC AARTI & MANTRA AUDIO VISUALIZER -->
      ${renderAartiVisualizerBar()}

      <!-- 6. WHAT DO YOU NEED TODAY? (Ritual Discovery Grid) -->
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:var(--space-4)">
        <div>
          <div class="eyebrow" style="color:var(--saffron)">Vedic Catalog</div>
          <h2 class="section-title">Popular Home Ceremonies</h2>
          <p class="text-muted">Most requested Vedic rituals in ${AppState.user.city}</p>
        </div>
        <button type="button" class="btn-ghost small" onclick="nav('book', 0)" style="font-weight:700">View All (8) →</button>
      </div>

      <div class="grid grid-cols-4" style="margin-bottom:var(--space-7)">
        ${RITUALS_CATALOG.slice(0, 4).map(r => `
          <div class="ritual-card spotlight-card tilt-card" onclick="selectRitual('${r.id}')">
            <div>
              <div class="ritual-card-header">
                <div class="ritual-icon">${r.icon}</div>
                <span class="badge badge-verified">✓ Verified</span>
              </div>
              <h3>${r.name}</h3>
              <p>${r.shortDesc}</p>
            </div>
            <div class="ritual-card-footer">
              <span class="price-tag">From ₹${r.priceStart.toLocaleString('en-IN')}</span>
              <span class="micro" style="color:var(--emerald); font-weight:700">${r.duration}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 7. FAMILY RITUALS RETENTION LAYER -->
      <div class="page-header" style="margin-bottom:var(--space-4)">
        <div class="eyebrow" style="color:var(--gold)">Retention Layer</div>
        <h2 class="section-title">Your Family Ritual OS</h2>
        <p class="text-muted">Smart proactive reminders and persistent family memory</p>
      </div>

      <div class="grid grid-cols-2" style="margin-bottom:var(--space-8)">
        <div class="glass-card spotlight-card tilt-card" style="background:linear-gradient(135deg, rgba(183, 28, 28, 0.4), rgba(216, 67, 21, 0.25))">
          <div>
            <div class="eyebrow" style="color:var(--gold)">Upcoming Festival</div>
            <h3 style="margin:8px 0; font-size:22px">Navratri begins in 7 days</h3>
            <p style="color:var(--text-secondary); margin-bottom:18px">Book an auspicious Ghatasthapana or Durga Saptashati Havan with Vedic Muhurat timings for the Drishti Family.</p>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <button type="button" class="btn btn-sm btn-primary" onclick="startBookingFlow('griha-pravesh')">
              Explore Pujas
            </button>
            <button type="button" class="btn btn-sm btn-ghost" onclick="showToast('Reminder added to your family calendar!')">
              Remind Later
            </button>
          </div>
        </div>

        <div class="glass-card spotlight-card tilt-card">
          <div>
            <div class="eyebrow" style="color:var(--gold)">Sacred Memory Vault</div>
            <h3 style="margin:8px 0; font-size:22px">Griha Pravesh · 6 Months Ago</h3>
            <p class="text-muted" style="margin-bottom:16px">Performed by Pandit Rajesh Sharma at Sector 62, Noida. Stored securely in your family ritual vault.</p>
            <div style="display:flex; gap:8px; flex-wrap:wrap">
              <span class="badge badge-verified">4 Photos Saved</span>
              <span class="badge badge-gold">Sankalp Certificate</span>
            </div>
          </div>
          <div style="margin-top:18px; display:flex; justify-content:space-between; align-items:center">
            <button type="button" class="btn btn-sm btn-secondary" onclick="nav('family')">
              Open Vault
            </button>
            <button type="button" class="btn-ghost small" onclick="startBookingFlow('satyanarayan')" style="font-weight:700">
              Rebook Ceremony →
            </button>
          </div>
        </div>
      </div>

      <!-- 8. MODERN GLASSMORPHIC GRID FOOTER -->
      <footer class="app-footer">
        <div class="footer-grid">
          <div class="footer-col">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px">
              <span class="sacred-symbol" style="width:36px; height:36px; font-size:20px">ॐ</span>
              <span style="font-family:var(--font-display); font-size:22px; font-weight:900" class="gradient-text-saffron">Aaradhya</span>
            </div>
            <p class="text-muted" style="font-size:13px; line-height:1.7; max-width:320px">
              A trusted ritual-management platform making Hindu ceremonies easier to discover, book, coordinate, track, and remember for every family. Faith with less friction.
            </p>
          </div>

          <div class="footer-col">
            <h4>Ceremonies</h4>
            <ul class="footer-links">
              <li><a href="javascript:void(0)" onclick="selectRitual('griha-pravesh')">Griha Pravesh Puja</a></li>
              <li><a href="javascript:void(0)" onclick="selectRitual('satyanarayan')">Satyanarayan Katha</a></li>
              <li><a href="javascript:void(0)" onclick="selectRitual('havan')">Maha Ganapati Havan</a></li>
              <li><a href="javascript:void(0)" onclick="selectRitual('rudrabhishek')">Rudrabhishek Puja</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Sacred Utilities</h4>
            <ul class="footer-links">
              <li><a href="javascript:void(0)" onclick="nav('kundli')">Vedic Janampatri</a></li>
              <li><a href="javascript:void(0)" onclick="openJapaMalaModal()">Tactile Japa Mala</a></li>
              <li><a href="javascript:void(0)" onclick="toggleAartiPlayer()">Aarti Synthesizer</a></li>
              <li><a href="javascript:void(0)" onclick="nav('seva')">Temple Seva</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Devotional Digest</h4>
            <p class="text-muted" style="font-size:13px">Get auspicious Muhurat alerts and Hindu festival calendars in your inbox.</p>
            <div class="newsletter-box">
              <input type="email" placeholder="Your email address" class="newsletter-input" id="newsletterEmail">
              <button type="button" class="btn btn-sm btn-primary" onclick="showToast('Subscribed to Auspicious Muhurat Digest!')">Join</button>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2026 Aaradhya Technologies. All sacred traditions respected.</div>
          <div style="display:flex; gap:16px">
            <a href="javascript:void(0)" class="text-muted" onclick="openHelpSupport()">Trust Stack</a>
            <a href="javascript:void(0)" class="text-muted" onclick="showToast('Privacy Protected: Zero Data Sharing')">Privacy</a>
            <a href="javascript:void(0)" class="text-muted" onclick="showToast('WCAG AA Compliant')">Accessibility</a>
          </div>
        </div>
      </footer>
    </section>
  `;
}

// Screen 04: Puja Discovery Catalog
function renderDiscoveryScreen() {
  return `
    <section class="screen-view active">
      <div class="page-header">
        <button type="button" class="back-link" onclick="nav('home')">← Back to Home</button>
        <h1>Choose a Puja</h1>
        <p class="text-light-green">Discover and book verified Vedic ceremonies for your family</p>
      </div>

      <!-- Search & Filters -->
      <div class="card" style="padding:16px; margin-bottom:var(--space-5)">
        <div style="display:flex; gap:10px; margin-bottom:12px">
          <div style="position:relative; flex:1">
            <input type="text" id="pujaSearchInput" class="form-control" placeholder="Search ritual, deity, occasion, or purpose..." oninput="filterRitualCatalog()">
          </div>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap">
          <span class="badge badge-gold" style="cursor:pointer" onclick="filterByTag('all')">All Rituals</span>
          <span class="badge badge-verified" style="cursor:pointer" onclick="filterByTag('Home')">Home Pujas</span>
          <span class="badge badge-verified" style="cursor:pointer" onclick="filterByTag('Sanskar')">Sanskars</span>
          <span class="badge badge-verified" style="cursor:pointer" onclick="filterByTag('Vishnu')">Lord Vishnu</span>
          <span class="badge badge-verified" style="cursor:pointer" onclick="filterByTag('Shiva')">Lord Shiva</span>
        </div>
      </div>

      <!-- Catalog Grid -->
      <div id="catalogGrid" class="grid grid-cols-3">
        ${RITUALS_CATALOG.map(r => `
          <div class="ritual-card" onclick="selectRitual('${r.id}')">
            <div>
              <div class="ritual-card-header">
                <div class="ritual-icon">${r.icon}</div>
                <span class="badge badge-verified">✓ Verified Purohit</span>
              </div>
              <h3>${r.name}</h3>
              <p>${r.shortDesc}</p>
              <div style="margin-top:10px; display:flex; gap:4px; flex-wrap:wrap">
                <span class="micro badge badge-neutral">${r.purpose}</span>
              </div>
            </div>
            <div class="ritual-card-footer">
              <span class="price-tag">From ₹${r.priceStart.toLocaleString('en-IN')}</span>
              <button type="button" class="btn btn-sm btn-ghost" style="padding:0">View Details →</button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// Screen 05: Puja Details Screen
function renderDetailScreen() {
  const ritual = RITUALS_CATALOG.find(r => r.id === AppState.booking.ritualId) || RITUALS_CATALOG[0];

  return `
    <section class="screen-view active">
      <div class="page-header">
        <button type="button" class="back-link" onclick="nav('book', 0)">← Back to All Pujas</button>
        <h1>${ritual.name}</h1>
        <p class="text-light-green">${ritual.shortDesc}</p>
      </div>

      <div class="grid grid-cols-2" style="margin-bottom:var(--space-6)">
        <div class="card" style="background:linear-gradient(135deg, var(--surface-alt), var(--surface)); border-color:var(--accent);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start">
            <span class="badge badge-gold">✦ Vedic Authenticity Verified</span>
            <span class="badge badge-verified">Doorstep Service</span>
          </div>
          <h2 style="font-size:32px; margin:16px 0 8px">${ritual.name}</h2>
          <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:20px">${ritual.details}</p>

          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; background:var(--surface-alt); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-gold)">
            <div>
              <span class="micro text-light-green">Starting Dakshina</span>
              <div class="price-tag" style="font-size:18px">₹${ritual.priceStart.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <span class="micro text-light-green">Duration</span>
              <div style="font-weight:700; color:#FFFFFF">${ritual.duration}</div>
            </div>
            <div>
              <span class="micro text-light-green">Primary Deity</span>
              <div style="font-weight:700; color:#FFFFFF">${ritual.deity}</div>
            </div>
          </div>

          <div style="margin-top:24px">
            <button type="button" class="btn btn-primary btn-block" onclick="startBookingFlow('${ritual.id}')">
              <span>Choose Package & Date</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>

        <!-- Inclusions & Trust Details -->
        <div class="card">
          <div class="eyebrow">Trust Stack Assurance</div>
          <h3 style="margin:6px 0 16px">What is included in every Aaradhya booking</h3>

          <ul class="checklist">
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span><strong>Verified Purohit:</strong> Background-checked Pandit versed in Shukla/Krishna Yajurveda.</span>
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span><strong>Muhurat Consultation:</strong> Exact auspicious Choghadiya timing tailored to your family's Gotra.</span>
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span><strong>Complete Samagri:</strong> 18 unadulterated sacred items including Haridwar Gangajal & Bhimseni Kapoor.</span>
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span><strong>Ritual Memory Vault:</strong> High-res photo upload, digital Sankalp certificate & calendar integration.</span>
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span><strong>Aaradhya Concierge:</strong> Live coordination assistance from preparation to completion.</span>
            </li>
          </ul>

          <div style="background:var(--surface-alt); border:1px solid var(--border-gold); padding:12px 16px; border-radius:var(--radius-md); margin-top:20px; font-size:13px; color:var(--light-green)">
            🔒 <strong>Zero negotiation guarantee:</strong> Transparent, all-inclusive pricing with no hidden Dakshina pressure on the day of the ceremony.
          </div>
        </div>
      </div>
    </section>
  `;
}

// Guided Booking Steps
function renderBookingStepScreen() {
  const stepTitles = [
    'Puja Overview',
    'Choose Package',
    'Date & Muhurat',
    'Puja Location',
    'Pandit Matching',
    'Samagri Arrangement',
    'Review Summary',
    'Secure Payment'
  ];

  return `
    <section class="screen-view active">
      <!-- Stepper Header Navigation -->
      <div class="stepper-header">
        <div class="stepper-title-row">
          <div>
            <span class="eyebrow">Step ${AppState.bookingStep} of 7</span>
            <h2 style="font-size:20px">${stepTitles[AppState.bookingStep]}</h2>
          </div>
          <div class="badge badge-verified">
            ${AppState.booking.ritualName}
          </div>
        </div>
        <div class="stepper-progress-track">
          ${[1, 2, 3, 4, 5, 6, 7].map(s => `
            <div class="progress-bar-step ${s < AppState.bookingStep ? 'done' : s === AppState.bookingStep ? 'active' : ''}"></div>
          `).join('')}
        </div>
      </div>

      <!-- Step Content Switcher -->
      <div class="step-content-container">
        ${renderSpecificBookingStep(AppState.bookingStep)}
      </div>

      <!-- Sticky Footer Actions Bar -->
      <div class="flow-footer">
        <div>
          <span class="footer-price-label">Estimated Total</span>
          <div class="footer-price-val">₹${AppState.booking.packagePrice.toLocaleString('en-IN')}</div>
        </div>
        <div class="flow-footer-actions">
          ${AppState.bookingStep > 1 ? `
            <button type="button" class="btn btn-secondary" onclick="prevBookingStep()">Back</button>
          ` : `
            <button type="button" class="btn btn-secondary" onclick="nav('detail')">Back</button>
          `}
          <button type="button" class="btn btn-primary" onclick="nextBookingStep()">
            <span>${AppState.bookingStep === 7 ? `Pay ₹${AppState.booking.packagePrice.toLocaleString('en-IN')}` : 'Continue'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderSpecificBookingStep(step) {
  switch (step) {
    case 1:
      // Screen 06: Package Selection
      return `
        <div class="package-selection-step">
          <div class="page-header" style="margin-bottom:var(--space-3)">
            <h2>Select your ceremony package</h2>
            <p class="text-light-green">All packages include verified Purohits and complete doorstep coordination.</p>
          </div>

          <div class="package-grid">
            <!-- Essential Package -->
            <div class="package-card ${AppState.booking.package === 'Essential' ? 'selected' : ''}" onclick="selectPackage('Essential', 5500)">
              <div>
                <h3>Essential</h3>
                <div class="package-price">₹5,500</div>
                <p class="muted small" style="margin-bottom:16px">Standard complete Vedic ceremony ideal for intimate family gatherings.</p>

                <ul class="checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>1 Verified Vedic Pandit</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Standard Griha Pravesh & Havan</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Essential Samagri Included</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Duration: ~2 Hours</span>
                  </li>
                </ul>
              </div>
              <div style="margin-top:16px">
                <button type="button" class="btn btn-sm ${AppState.booking.package === 'Essential' ? 'btn-primary' : 'btn-secondary'} btn-block">
                  ${AppState.booking.package === 'Essential' ? '✓ Selected' : 'Choose Essential'}
                </button>
              </div>
            </div>

            <!-- Premium Package (Recommended) -->
            <div class="package-card ${AppState.booking.package === 'Premium' ? 'selected' : ''}" onclick="selectPackage('Premium', 8999)">
              <span class="package-tag">Recommended</span>
              <div>
                <h3>Premium</h3>
                <div class="package-price">₹8,999</div>
                <p class="muted small" style="margin-bottom:16px">Comprehensive Vedic ceremony with experienced Acharya and extended arrangements.</p>

                <ul class="checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>1 Senior Acharya + 1 Sahayak Purohit</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Extended Navagraha & Vastu Havan</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Complete 18-Item Premium Samagri</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Sankalp Certificate & Prasad Box Delivery</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Duration: ~3 to 3.5 Hours</span>
                  </li>
                </ul>
              </div>
              <div style="margin-top:16px">
                <button type="button" class="btn btn-sm ${AppState.booking.package === 'Premium' ? 'btn-primary' : 'btn-secondary'} btn-block">
                  ${AppState.booking.package === 'Premium' ? '✓ Selected' : 'Choose Premium'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

    case 2:
      // Screen 07: Date & Muhurat
      return `
        <div class="muhurat-step">
          <div class="page-header" style="margin-bottom:var(--space-3)">
            <h2>Choose date & auspicious Muhurat</h2>
            <p class="text-light-green">Calculated through Vedic Panchang specifically for Griha Pravesh rituals.</p>
          </div>

          <!-- Recommended Auspicious Slot -->
          <div class="muhurat-badge-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
              <span class="badge badge-gold">✦ Recommended Auspicious Muhurat</span>
              <span class="micro text-light-green">North Indian Panchang</span>
            </div>
            <h3 style="font-size:24px; color:#FFFFFF">18 October 2026 (Sunday)</h3>
            <div style="font-weight:700; font-size:16px; margin:4px 0; color:var(--light-green)">10:00 AM – 12:15 PM</div>
            <p class="muted small" style="margin:6px 0 14px">
              <strong>Shubh Choghadiya & Rohini Nakshatra:</strong> Ideal planetary alignment for establishing family longevity and financial prosperity in a new home.
            </p>
            <button type="button" class="btn btn-sm btn-primary" onclick="setSlot('18 October 2026', '10:00 AM – 12:15 PM', 'Shubh Choghadiya & Rohini Nakshatra')">
              Select This Muhurat
            </button>
          </div>

          <!-- Alternative Auspicious Slots -->
          <h3 style="font-size:18px; margin:20px 0 10px">Alternative Auspicious Slots</h3>
          <div class="grid" style="gap:10px">
            <div class="slot-card ${AppState.booking.date === '19 October 2026' ? 'selected' : ''}" onclick="setSlot('19 October 2026', '08:30 AM – 10:45 AM', 'Amrit Choghadiya')">
              <div>
                <div style="font-weight:700; color:#FFFFFF">19 October 2026 (Monday)</div>
                <div class="text-light-green small">08:30 AM – 10:45 AM · Amrit Choghadiya</div>
              </div>
              <span class="badge badge-verified">Auspicious</span>
            </div>

            <div class="slot-card ${AppState.booking.date === '24 October 2026' ? 'selected' : ''}" onclick="setSlot('24 October 2026', '11:15 AM – 01:30 PM', 'Abhijit Muhurat')">
              <div>
                <div style="font-weight:700; color:#FFFFFF">24 October 2026 (Saturday)</div>
                <div class="text-light-green small">11:15 AM – 01:30 PM · Abhijit Muhurat</div>
              </div>
              <span class="badge badge-verified">Auspicious</span>
            </div>
          </div>

          <!-- Custom Date Input Fallback -->
          <div class="card" style="margin-top:20px; padding:16px">
            <h4 style="font-size:15px; margin-bottom:8px">Have a specific family date from your Kul-Purohit?</h4>
            <div style="display:flex; gap:10px; flex-wrap:wrap">
              <input type="date" class="form-control" style="flex:1" value="2026-10-18" onchange="AppState.booking.date = this.value; renderApp();">
              <input type="time" class="form-control" style="width:140px" value="10:00" onchange="AppState.booking.time = this.value + ' onwards'; renderApp();">
            </div>
          </div>
        </div>
      `;

    case 3:
      // Screen 08: Location
      return `
        <div class="location-step">
          <div class="page-header" style="margin-bottom:var(--space-3)">
            <h2>Where will the Puja happen?</h2>
            <p class="text-light-green">Pandit ji and Samagri will arrive directly at this address.</p>
          </div>

          <div class="grid grid-cols-2">
            <div class="card">
              <div class="form-group">
                <label class="form-label">House / Flat / Villa No.</label>
                <input type="text" class="form-control" value="${AppState.booking.location.house}" oninput="AppState.booking.location.house = this.value">
              </div>

              <div class="form-group">
                <label class="form-label">Apartment / Society / Street</label>
                <input type="text" class="form-control" value="${AppState.booking.location.address}" oninput="AppState.booking.location.address = this.value">
              </div>

              <div class="form-group">
                <label class="form-label">Landmark</label>
                <input type="text" class="form-control" value="${AppState.booking.location.landmark}" oninput="AppState.booking.location.landmark = this.value">
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
                <div class="form-group">
                  <label class="form-label">City / Region</label>
                  <input type="text" class="form-control" value="${AppState.booking.location.city}" oninput="AppState.booking.location.city = this.value">
                </div>
                <div class="form-group">
                  <label class="form-label">Pincode</label>
                  <input type="text" class="form-control" value="${AppState.booking.location.pincode}" oninput="AppState.booking.location.pincode = this.value">
                </div>
              </div>
            </div>

            <!-- Mocked Map / Verification Card -->
            <div class="card" style="display:flex; flex-direction:column; justify-content:space-between">
              <div>
                <div class="eyebrow">Service Coverage</div>
                <h3 style="margin:6px 0 12px">Delhi NCR Doorstep Hub</h3>
                <div style="background:var(--surface-alt); height:160px; border-radius:var(--radius-md); border:1px solid var(--border-gold); display:grid; place-items:center; position:relative; overflow:hidden">
                  <div style="text-align:center">
                    <span style="font-size:36px">📍</span>
                    <div style="font-weight:700; font-size:13px; margin-top:4px; color:#FFFFFF">${AppState.booking.location.address}</div>
                    <span class="badge badge-verified micro" style="margin-top:4px">Purohit in 8km Radius</span>
                  </div>
                </div>
              </div>
              <div style="margin-top:16px; font-size:13px; color:var(--light-green)">
                ✓ Free Pandit travel & sacred Samagri delivery included in ${AppState.booking.location.city}.
              </div>
            </div>
          </div>
        </div>
      `;

    case 4:
      // Screen 09: Pandit Matching
      if (AppState.isMatchingPandit) {
        return `
          <div class="pandit-matching-scan">
            <div class="scan-orb">ॐ</div>
            <h2 style="font-size:24px; margin-bottom:8px">Finding the right Pandit for you…</h2>
            <p class="small text-light-green" style="margin-bottom:20px">Matching through Vedic lineage, language, location, and verified devotee ratings.</p>

            <div style="max-width:440px; margin:0 auto; background:var(--surface-alt); border:1.5px solid var(--border-gold); padding:16px; border-radius:var(--radius-md); text-align:left">
              <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border)">
                <span class="small text-light-green">Ritual Tradition:</span>
                <strong>${AppState.family.tradition}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border)">
                <span class="small text-light-green">Preferred Language:</span>
                <strong>${AppState.family.preferredLanguage}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border)">
                <span class="small text-light-green">Service Location:</span>
                <strong>${AppState.booking.location.city}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px 0;">
                <span class="small text-light-green">Vetting Standard:</span>
                <strong style="color:var(--light-green)">8+ Years Verified Experience</strong>
              </div>
            </div>
          </div>
        `;
      }

      const pandit = PANDITS_DATABASE.find(p => p.id === AppState.booking.panditId) || PANDITS_DATABASE[0];

      return `
        <div class="pandit-matched-step">
          <div class="page-header" style="margin-bottom:var(--space-3)">
            <h2>Your Matched Pandit</h2>
            <p class="text-light-green">Based on your family tradition, language preference, and location.</p>
          </div>

          <!-- Featured Pandit Card -->
          <div class="pandit-card matched">
            <div class="pandit-header">
              <div class="pandit-avatar">${pandit.avatarInitials}</div>
              <div class="pandit-meta">
                <div style="display:flex; align-items:center; gap:8px">
                  <h3>${pandit.name}</h3>
                  <span class="badge badge-verified">✓ Verified Purohit</span>
                </div>
                <div class="pandit-rating">
                  <span>★ ${pandit.rating}</span>
                  <span class="small text-light-green">(${pandit.bookingsCount} Aaradhya ceremonies)</span>
                </div>
                <p class="small text-light-green" style="margin-top:2px">${pandit.experience} experience · ${pandit.languages}</p>
                <div class="pandit-pills">
                  <span class="micro badge badge-neutral">Background Checked</span>
                  <span class="micro badge badge-gold">${pandit.tradition}</span>
                </div>
              </div>
            </div>

            <p style="margin:16px 0; font-size:14px; line-height:1.5; color:var(--text-secondary)">
              ${pandit.bio}
            </p>

            <div style="display:flex; gap:10px; flex-wrap:wrap; border-top:1px solid var(--border); padding-top:16px">
              <button type="button" class="btn btn-sm btn-secondary" onclick="openPanditProfile('${pandit.id}')">
                View Full Profile & Reviews
              </button>
              <button type="button" class="btn btn-sm btn-ghost" onclick="openSwitchPanditModal()">
                Choose Another Pandit →
              </button>
            </div>
          </div>
        </div>
      `;

    case 5:
      // Screen 10: Samagri Selection
      return `
        <div class="samagri-step">
          <div class="page-header" style="margin-bottom:var(--space-3)">
            <h2>What would you like Aaradhya to handle?</h2>
            <p class="text-light-green">Save hours of market visits with certified unadulterated sacred materials.</p>
          </div>

          <!-- Complete Samagri Option -->
          <div class="samagri-item-box ${AppState.booking.samagriChoice === 'Complete Samagri' ? 'selected' : ''}" onclick="selectSamagriOption('Complete Samagri')">
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
              <div>
                <span class="badge badge-gold">✦ Recommended</span>
                <h3 style="font-size:20px; margin:6px 0">Complete Samagri (18 Sacred Items)</h3>
                <p class="muted small">Everything is pre-packaged, sanctified, and delivered to your doorstep by our team.</p>
              </div>
              <strong style="color:var(--light-green); font-size:16px">Included in Package</strong>
            </div>

            <!-- Collapsible Checklist Preview -->
            <div class="samagri-checklist-grid">
              ${SAMAGRI_ITEMS.map(cat => `
                <div>
                  <strong class="micro text-light-green" style="text-transform:uppercase">${cat.category}</strong>
                  <ul style="list-style:none; padding:0; margin-top:4px">
                    ${cat.items.slice(0, 3).map(item => `
                      <li class="samagri-item">✓ ${item}</li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
            <button type="button" class="btn-ghost micro" style="margin-top:10px; padding:0" onclick="event.stopPropagation(); openAllSamagriModal()">
              View Complete 18-Item Inventory List →
            </button>
          </div>

          <!-- Self-Managed Samagri Option -->
          <div class="samagri-item-box ${AppState.booking.samagriChoice === 'Self Managed' ? 'selected' : ''}" onclick="selectSamagriOption('Self Managed')">
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
              <div>
                <h3 style="font-size:20px; margin-bottom:4px">I will arrange my own Samagri</h3>
                <p class="muted small">You will receive the precise itemized Vedic checklist to purchase locally.</p>
              </div>
              <span class="badge badge-neutral">No Extra Charge</span>
            </div>
          </div>
        </div>
      `;

    case 6:
      // Screen 11: Review & Price Breakdown
      return `
        <div class="review-step">
          <div class="page-header" style="margin-bottom:var(--space-3)">
            <h2>Review your ceremony details</h2>
            <p class="text-light-green">Verify your ritual itinerary before secure confirmation.</p>
          </div>

          <div class="card" style="margin-bottom:var(--space-4)">
            <div class="summary-table">
              <div class="summary-row">
                <span class="text-light-green">Ritual:</span>
                <strong>${AppState.booking.ritualName}</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Ceremony Package:</span>
                <strong>${AppState.booking.package} Package</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Date & Auspicious Time:</span>
                <strong>${AppState.booking.date} · ${AppState.booking.time}</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Service Location:</span>
                <strong>${AppState.booking.location.house}, ${AppState.booking.location.address}, ${AppState.booking.location.city}</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Assigned Pandit:</span>
                <strong>${AppState.booking.panditName} (Verified)</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Samagri Arrangement:</span>
                <strong>${AppState.booking.samagriChoice}</strong>
              </div>
            </div>
          </div>

          <!-- Transparent Price Breakdown -->
          <div class="card" style="background:var(--surface-alt)">
            <div class="eyebrow">Transparent Pricing</div>
            <h3 style="font-size:18px; margin:6px 0 12px">Price Breakdown</h3>

            <div class="summary-table" style="margin:0">
              <div class="summary-row">
                <span>${AppState.booking.package} Ceremony Package</span>
                <span>₹${AppState.booking.packagePrice.toLocaleString('en-IN')}</span>
              </div>
              <div class="summary-row">
                <span>Doorstep Samagri & Logistics</span>
                <span style="color:var(--light-green)">Included</span>
              </div>
              <div class="summary-row">
                <span>Pandit Dakshina & Travel</span>
                <span style="color:var(--light-green)">Included</span>
              </div>
              <div class="summary-row" style="font-size:18px; font-weight:700">
                <span>Total Amount</span>
                <span style="color:var(--light-green)">₹${AppState.booking.packagePrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style="margin-top:14px; font-size:12px; color:var(--light-green)">
              🛡️ <strong>Aaradhya Trust Guarantee:</strong> No cash haggling or on-the-spot price surprises. 100% money-back guarantee if Pandit fails to arrive on time.
            </div>
          </div>
        </div>
      `;

    case 7:
      // Screen 11: Payment Step
      return `
        <div class="payment-step">
          <div class="page-header" style="margin-bottom:var(--space-3)">
            <h2>Complete secure booking</h2>
            <p class="text-light-green">Payment held in Aaradhya Trust Escrow until ceremony completion.</p>
          </div>

          <div class="grid grid-cols-2">
            <div class="card">
              <div class="eyebrow">Payment Methods</div>
              <h3 style="margin:6px 0 16px">Choose Payment Mode</h3>

              <div style="display:flex; flex-direction:column; gap:10px">
                <label class="slot-card selected" style="margin:0">
                  <div>
                    <strong>UPI (Google Pay, PhonePe, Paytm)</strong>
                    <div class="micro text-light-green">Fastest & recommended</div>
                  </div>
                  <input type="radio" name="paymethod" checked>
                </label>

                <label class="slot-card" style="margin:0">
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <div class="micro text-light-green">Visa, MasterCard, RuPay</div>
                  </div>
                  <input type="radio" name="paymethod">
                </label>

                <label class="slot-card" style="margin:0">
                  <div>
                    <strong>Net Banking</strong>
                    <div class="micro text-light-green">HDFC, ICICI, SBI, Axis</div>
                  </div>
                  <input type="radio" name="paymethod">
                </label>
              </div>

              <!-- Mock UPI Simulator Box -->
              <div style="background:var(--surface-alt); border:1px solid var(--border-gold); border-radius:var(--radius-md); padding:16px; margin-top:16px">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
                  <span class="micro text-light-green">Demo UPI ID</span>
                  <span class="badge badge-verified micro">Test Simulator</span>
                </div>
                <input type="text" class="form-control" value="drishti@okhdfcbank" readonly>
              </div>
            </div>

            <div class="card" style="background:var(--surface-alt); border-color:var(--accent); text-align:center; display:flex; flex-direction:column; justify-content:center">
              <div style="font-size:42px; margin-bottom:8px">🔒</div>
              <h3 style="font-size:20px; color:#FFFFFF">100% Secure Sacred Escrow</h3>
              <p class="muted small" style="margin:8px 0 16px">
                Your payment is safely escrowed. The Pandit is paid only after you confirm successful completion of the ritual.
              </p>
              <div style="font-size:26px; font-weight:700; color:var(--light-green); margin-bottom:12px">
                ₹${AppState.booking.packagePrice.toLocaleString('en-IN')}
              </div>
              <span class="badge badge-verified" style="margin:0 auto">Verified Escrow Protection</span>
            </div>
          </div>
        </div>
      `;

    default:
      return renderDetailScreen();
  }
}

// Screen 12: Booking Confirmation Screen
function renderConfirmationScreen() {
  return `
    <section class="screen-view active">
      <div class="card" style="text-align:center; padding:var(--space-8) var(--space-5); max-width:680px; margin:0 auto; box-shadow:var(--shadow-3); border-color:var(--accent);">
        <div style="width:72px; height:72px; border-radius:50%; background:var(--success-bg); color:var(--light-green); border:2px solid var(--light-green); display:grid; place-items:center; font-size:32px; margin:0 auto 16px; box-shadow:0 0 16px rgba(74,222,128,0.4)">
          ✓
        </div>
        <span class="eyebrow" style="color:var(--light-green)">Booking Confirmed</span>
        <h1 class="display-title" style="font-size:32px; margin:8px 0 12px">Your Puja is Confirmed</h1>
        <p class="text-light-green" style="margin-bottom:24px">
          Aaradhya has reserved your Pandit and initiated Samagri preparation.
        </p>

        <!-- Key Summary Box -->
        <div style="background:var(--surface-alt); border:1.5px solid var(--border-gold); border-radius:var(--radius-lg); padding:20px; text-align:left; margin-bottom:24px">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px">
            <span class="text-light-green small">Ceremony:</span>
            <strong>${AppState.booking.ritualName}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px">
            <span class="text-light-green small">Date & Time:</span>
            <strong>${AppState.booking.date} · ${AppState.booking.time}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px">
            <span class="text-light-green small">Location:</span>
            <strong>${AppState.booking.location.house}, ${AppState.booking.location.city}</strong>
          </div>
          <div style="display:flex; justify-content:space-between">
            <span class="text-light-green small">Assigned Pandit:</span>
            <strong>${AppState.booking.panditName}</strong>
          </div>
        </div>

        <!-- Operational Status Checklist -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; text-align:left; margin-bottom:28px">
          <div style="background:var(--surface-alt); border:1px solid var(--border-gold); padding:12px; border-radius:var(--radius-md)">
            <span class="micro text-light-green">Purohit Status</span>
            <div style="color:var(--light-green); font-weight:700">Pandit Confirmed ✓</div>
          </div>
          <div style="background:var(--surface-alt); border:1px solid var(--border-gold); padding:12px; border-radius:var(--radius-md)">
            <span class="micro text-light-green">Logistics Status</span>
            <div style="color:var(--accent); font-weight:700">Samagri Preparing 📦</div>
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap">
          <button type="button" class="btn btn-primary" onclick="nav('tracking')">
            <span>Track Live Booking</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
          <button type="button" class="btn btn-secondary" onclick="showToast('Ceremony synced to Google Calendar & Apple Calendar!')">
            <span>📅 Add to Calendar</span>
          </button>
          <button type="button" class="btn btn-ghost" onclick="nav('home')">
            Back to Home
          </button>
        </div>
      </div>
    </section>
  `;
}

// Screen 13: Booking Tracking Screen
function renderTrackingScreen() {
  const trackingSteps = [
    { title: 'Booking Confirmed', desc: 'Slot locked with Vedic Muhurat', key: 'Confirmed' },
    { title: 'Pandit Assigned', desc: 'Pandit Rajesh Sharma confirmed availability', key: 'Pandit Assigned' },
    { title: 'Samagri Preparing', desc: '18 items packed and sanctified in Noida Hub', key: 'Samagri Preparing' },
    { title: 'Pandit is on the way', desc: 'ETA: 25 mins · Traditional attire & sacred utensils', key: 'On The Way' },
    { title: 'Pandit has arrived', desc: 'Purohit at your doorstep for ritual setup', key: 'Arrived' },
    { title: 'Puja Completed', desc: 'Sankalp fulfilled & prasad distributed', key: 'Completed' }
  ];

  const statusOrder = ['Confirmed', 'Pandit Assigned', 'Samagri Preparing', 'On The Way', 'Arrived', 'Completed'];
  const currentIndex = statusOrder.indexOf(AppState.booking.status);

  return `
    <section class="screen-view active">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start">
        <div>
          <button type="button" class="back-link" onclick="nav('bookings')">← Back to Bookings</button>
          <h1>Track Your Ritual</h1>
          <p class="text-light-green">Live operational visibility for ${AppState.booking.ritualName}</p>
        </div>
        <span class="badge badge-verified">Live: ${AppState.booking.status}</span>
      </div>

      <div class="grid grid-cols-2">
        <!-- Vertical Timeline Card -->
        <div class="card">
          <div class="eyebrow">Operational Journey</div>
          <h3 style="margin:6px 0 20px">Ritual Progress</h3>

          <div class="tracking-timeline">
            ${trackingSteps.map((step, idx) => {
              const isDone = idx < currentIndex;
              const isActive = idx === currentIndex;
              return `
                <div class="timeline-node ${isDone ? 'done' : isActive ? 'active' : ''}">
                  <h4>${step.title}</h4>
                  <p>${step.desc}</p>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Demo Advance Button for Pitch -->
          <div style="background:var(--surface-alt); border:1px solid var(--border-gold); border-radius:var(--radius-md); padding:16px; margin-top:20px; display:flex; justify-content:space-between; align-items:center">
            <div>
              <strong style="font-size:13px; color:#FFFFFF">Pitch Demo Controller</strong>
              <div class="micro text-light-green">Simulate real-time status progression</div>
            </div>
            <button type="button" class="btn btn-sm btn-primary" onclick="advanceTrackingStatus()">
              Advance Status →
            </button>
          </div>
        </div>

        <!-- Pandit Card & Support Contact -->
        <div style="display:flex; flex-direction:column; gap:var(--space-4)">
          <div class="card">
            <div class="eyebrow">Assigned Purohit</div>
            <div style="display:flex; gap:16px; align-items:center; margin:12px 0">
              <div class="pandit-avatar">RS</div>
              <div>
                <h3 style="font-size:18px">${AppState.booking.panditName}</h3>
                <div class="small text-light-green">★ 4.9 · Verified Purohit</div>
                <div class="micro" style="color:var(--light-green); font-weight:600">On Standby for 18 Oct</div>
              </div>
            </div>
            <div style="display:flex; gap:10px">
              <button type="button" class="btn btn-sm btn-secondary" style="flex:1" onclick="showToast('Connecting call to Pandit Rajesh Sharma...')">
                📞 Call Pandit
              </button>
              <button type="button" class="btn btn-sm btn-secondary" style="flex:1" onclick="showToast('WhatsApp chat opened with Pandit ji.')">
                💬 WhatsApp
              </button>
            </div>
          </div>

          <div class="card">
            <div class="eyebrow">Concierge Assistance</div>
            <h3 style="font-size:18px; margin:6px 0">Aaradhya 24×7 Support</h3>
            <p class="muted small" style="margin-bottom:14px">Need to modify timing or request additional flowers? Our ritual concierge is active.</p>
            <button type="button" class="btn btn-sm btn-secondary btn-block" onclick="openHelpSupport()">
              Chat with Concierge
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Screen 14: Completion / Ritual Memory Screen
function renderCompletionScreen() {
  return `
    <section class="screen-view active">
      <div class="card" style="background:linear-gradient(135deg, var(--surface-alt), var(--surface)); border:1.5px solid var(--accent); padding:var(--space-6); text-align:center; margin-bottom:var(--space-5)">
        <div style="font-size:42px; margin-bottom:8px">🪔</div>
        <span class="eyebrow" style="color:var(--accent)">Ceremony Concluded</span>
        <h1 class="display-title" style="font-size:32px; margin:6px 0 10px">Puja Completed with Divine Grace</h1>
        <p class="text-light-green" style="max-width:540px; margin:0 auto 20px">
          Sankalp successfully recited for <strong>Drishti Family</strong> by <strong>Pandit Rajesh Sharma</strong>. May peace, health, and prosperity abide in your home.
        </p>

        <!-- Digital Sankalp Certificate -->
        <div class="certificate-banner">
          <div class="eyebrow" style="color:var(--accent)">Official Aaradhya Record</div>
          <h2 style="font-family:var(--font-serif); font-size:26px; margin:8px 0; color:#FFFFFF">Digital Sankalp Patra</h2>
          <p class="small text-light-green" style="max-width:480px; margin:0 auto 16px">
            "ॐ अद्य श्री गृहे वास्तु शांति संकल्पः विधिपूर्वक संपन्नः..."<br>
            Verified by Kashi Vidvat Parishad standards · Dated 18 October 2026
          </p>
          <div style="display:flex; gap:10px; justify-content:center">
            <button type="button" class="btn btn-sm btn-secondary" onclick="showToast('Sankalp Certificate downloaded (PDF)!')">
              📥 Download Certificate
            </button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="showToast('Certificate shared to WhatsApp family group!')">
              📤 Share with Family
            </button>
          </div>
        </div>

        <!-- Ritual Memories Gallery (Proof of Execution) -->
        <div style="text-align:left; margin-top:24px">
          <h3 style="font-size:18px; margin-bottom:10px">Ritual Memory Vault (Photos & Proof)</h3>
          <div class="memory-gallery">
            <div class="memory-photo">
              <svg viewBox="0 0 200 200" fill="none"><rect width="200" height="200" fill="#2D0F17"/><path d="M100 40L140 120H60L100 40Z" fill="#EA580C"/><circle cx="100" cy="140" r="15" fill="#FBBF24"/><text x="50%" y="90%" text-anchor="middle" font-size="12" fill="#86EFAC">Kalash Sthapana</text></svg>
            </div>
            <div class="memory-photo">
              <svg viewBox="0 0 200 200" fill="none"><rect width="200" height="200" fill="#2D0F17"/><circle cx="100" cy="90" r="35" fill="#FBBF24"/><rect x="70" y="130" width="60" height="20" rx="4" fill="#DC2626"/><text x="50%" y="90%" text-anchor="middle" font-size="12" fill="#86EFAC">Havan Agni</text></svg>
            </div>
            <div class="memory-photo">
              <svg viewBox="0 0 200 200" fill="none"><rect width="200" height="200" fill="#2D0F17"/><path d="M70 70H130V130H70Z" fill="#EA580C" fill-opacity="0.6"/><circle cx="100" cy="100" r="20" fill="#FBBF24"/><text x="50%" y="90%" text-anchor="middle" font-size="12" fill="#86EFAC">Aarti & Pushpanjali</text></svg>
            </div>
            <div class="memory-photo">
              <svg viewBox="0 0 200 200" fill="none"><rect width="200" height="200" fill="#2D0F17"/><circle cx="100" cy="85" r="28" fill="#FBBF24"/><text x="50%" y="90%" text-anchor="middle" font-size="12" fill="#86EFAC">Family Blessings</text></svg>
            </div>
          </div>
        </div>

        <!-- Next Actions -->
        <div style="display:flex; gap:12px; justify-content:center; margin-top:24px; flex-wrap:wrap">
          <button type="button" class="btn btn-primary" onclick="nav('family')">
            <span>Save to Family Rituals</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
          <button type="button" class="btn btn-accent" onclick="nav('seva')">
            <span>Continue Your Seva →</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick="nav('book', 0)">
            Book Another Ritual
          </button>
        </div>
      </div>
    </section>
  `;
}

// Screen 15: Family Profile Screen
function renderFamilyScreen() {
  return `
    <section class="screen-view active">
      <div class="page-header">
        <button type="button" class="back-link" onclick="nav('home')">← Back to Home</button>
        <h1>My Family</h1>
        <p class="text-light-green">The persistent ritual memory layer for your household</p>
      </div>

      <!-- Family Header Card -->
      <div class="family-header-card">
        <div class="family-avatar-large">D</div>
        <div style="flex:1">
          <div style="display:flex; align-items:center; gap:8px">
            <h2 style="font-size:24px; margin:0">${AppState.family.name}</h2>
            <span class="badge badge-gold">Gotra: ${AppState.family.gotra}</span>
          </div>
          <p class="small text-light-green" style="margin-top:4px">
            Tradition: <strong style="color:#FFFFFF">${AppState.family.tradition}</strong> · Preferred Language: <strong style="color:#FFFFFF">${AppState.family.preferredLanguage}</strong>
          </p>
        </div>
        <button type="button" class="btn btn-sm btn-secondary" onclick="openAddMemberModal()">
          + Add Member
        </button>
      </div>

      <!-- Family Members Grid -->
      <div class="page-header" style="margin-bottom:var(--space-3)">
        <h3 class="section-title">Family Members (${AppState.family.members.length})</h3>
      </div>
      <div class="grid grid-cols-4" style="margin-bottom:var(--space-6)">
        ${AppState.family.members.map(m => `
          <div class="member-card">
            <div class="member-icon">${m.avatar}</div>
            <strong style="font-size:16px; color:#FFFFFF">${m.name}</strong>
            <div class="micro text-light-green" style="margin:2px 0 6px">${m.role}</div>
            <span class="badge badge-neutral micro">${m.rashi} · ${m.nakshatra}</span>
          </div>
        `).join('')}
      </div>

      <!-- Preferred Purohit Module -->
      <div class="card" style="margin-bottom:var(--space-6); display:flex; justify-content:space-between; align-items:center">
        <div style="display:flex; gap:14px; align-items:center">
          <div class="pandit-avatar" style="width:54px; height:54px; font-size:20px">RS</div>
          <div>
            <div class="eyebrow" style="color:var(--accent)">Preferred Family Purohit</div>
            <strong style="font-size:17px; color:#FFFFFF">${AppState.family.preferredPandit}</strong>
            <p class="small text-light-green">Conducted 2 ceremonies for your family with a 5.0 rating</p>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-primary" onclick="startBookingFlow('satyanarayan')">
          1-Click Rebook
        </button>
      </div>

      <!-- Ritual History Timeline -->
      <div class="page-header" style="margin-bottom:var(--space-3)">
        <h3 class="section-title">Ritual History</h3>
        <p class="small text-light-green">Every sacred ceremony recorded with photos, purohit, and sankalp</p>
      </div>
      <div class="card">
        <div class="tracking-timeline" style="margin:8px 0">
          ${AppState.family.history.map(h => `
            <div class="timeline-node done">
              <div style="display:flex; justify-content:space-between; align-items:baseline">
                <h4>${h.ritual} (${h.package} Package)</h4>
                <span class="micro text-light-green">${h.date}</span>
              </div>
              <p>${h.location} · Conducted by ${h.pandit}</p>
              <div style="margin-top:6px; display:flex; gap:6px">
                <span class="badge badge-verified micro">★ ${h.rating}.0 Devotee Rating</span>
                <span class="badge badge-gold micro">${h.sankalp}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// Screen: Bookings Tab
function renderBookingsScreen() {
  return `
    <section class="screen-view active">
      <div class="page-header">
        <button type="button" class="back-link" onclick="nav('home')">← Back to Home</button>
        <h1>My Bookings</h1>
        <p class="text-light-green">Active ceremony tracking and past ritual records</p>
      </div>

      <!-- Active Booking Card -->
      <div class="card" style="border-left:4px solid var(--accent); margin-bottom:var(--space-6)">
        <div style="display:flex; justify-content:space-between; align-items:flex-start">
          <div>
            <span class="badge badge-verified">● Live Status: ${AppState.booking.status}</span>
            <span class="badge badge-gold" style="margin-left:6px">Samagri Preparing</span>
          </div>
          <div class="price-tag">₹${AppState.booking.packagePrice.toLocaleString('en-IN')}</div>
        </div>

        <h2 style="font-size:24px; margin:12px 0 6px">${AppState.booking.ritualName}</h2>
        <p class="small text-light-green" style="margin-bottom:16px">
          📅 ${AppState.booking.date} · ${AppState.booking.time}<br>
          📍 ${AppState.booking.location.house}, ${AppState.booking.location.city}
        </p>

        <div style="display:flex; gap:12px; align-items:center; background:var(--surface-alt); border:1px solid var(--border-gold); padding:12px; border-radius:var(--radius-md); margin-bottom:16px">
          <div class="pandit-avatar" style="width:48px; height:48px; font-size:18px">RS</div>
          <div>
            <strong style="color:#FFFFFF">${AppState.booking.panditName}</strong>
            <div class="micro text-light-green">★ 4.9 · Verified Acharya</div>
          </div>
        </div>

        <div style="display:flex; gap:10px">
          <button type="button" class="btn btn-primary" onclick="nav('tracking')">
            Track Live Timeline
          </button>
          <button type="button" class="btn btn-secondary" onclick="openHelpSupport()">
            Modify Booking
          </button>
        </div>
      </div>

      <!-- Past Bookings Section -->
      <div class="page-header" style="margin-bottom:var(--space-3)">
        <h3 class="section-title">Past Rituals</h3>
      </div>
      <div class="grid" style="gap:12px">
        ${AppState.family.history.map(h => `
          <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:16px">
            <div>
              <strong style="font-size:16px; color:#FFFFFF">${h.ritual}</strong>
              <p class="small text-light-green">${h.date} · ${h.location} · ${h.pandit}</p>
            </div>
            <button type="button" class="btn btn-sm btn-secondary" onclick="nav('completion')">
              View Memory Vault
            </button>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// Screen 30: Profile Screen
function renderProfileScreen() {
  const profileOptions = [
    { title: 'Family Profile', desc: 'Gotra, members, and ritual memory layer', view: 'family' },
    { title: 'My Bookings', desc: 'Active ceremonies and historical records', view: 'bookings' },
    { title: 'Saved Pandits', desc: 'Verified family Purohits and reviews', action: () => showToast('Saved Purohits: Pandit Rajesh Sharma') },
    { title: 'Temple Seva History', desc: 'Offerings, receipts & sankalp proofs', view: 'seva' },
    { title: 'My Samagri Orders', desc: 'Pure botanicals, woods, and brassware', action: () => showToast('Samagri orders delivered: 2') },
    { title: 'Help & Trust Concierge', desc: '24×7 Aaradhya support and guidelines', action: () => openHelpSupport() }
  ];

  return `
    <section class="screen-view active">
      <div class="page-header">
        <button type="button" class="back-link" onclick="nav('home')">← Back to Home</button>
        <h1>My Aaradhya</h1>
        <p class="text-light-green">Account details, preferences, and ritual support</p>
      </div>

      <!-- User Card -->
      <div class="card" style="display:flex; gap:16px; align-items:center; margin-bottom:var(--space-6)">
        <div class="family-avatar-large" style="width:64px; height:64px; font-size:26px">D</div>
        <div style="flex:1">
          <h2 style="font-size:22px; margin:0">${AppState.user.name}</h2>
          <p class="small text-light-green" style="margin-top:2px">${AppState.user.phone} · ${AppState.user.city}</p>
          <div style="display:flex; gap:6px; margin-top:6px">
            <span class="badge badge-gold micro">Kashyap Gotra</span>
            <span class="badge badge-verified micro">Hindi Preference</span>
          </div>
        </div>
      </div>

      <!-- Manage Options Grid -->
      <div class="grid grid-cols-2" style="margin-bottom:var(--space-6)">
        ${profileOptions.map(opt => `
          <div class="card card-clickable" onclick="${opt.view ? `nav('${opt.view}')` : `(${opt.action.toString()})()`}">
            <strong style="font-size:16px; color:#FFFFFF">${opt.title}</strong>
            <p class="small text-light-green" style="margin-top:4px">${opt.desc}</p>
          </div>
        `).join('')}
      </div>

      <!-- Prototype Note -->
      <div style="background:var(--surface-alt); border:1px dashed var(--border-gold); border-radius:var(--radius-md); padding:16px; font-size:12px; color:var(--light-green); text-align:center">
        Aaradhya Prototype Mode · Zero external database or billing dependencies · Deterministic pitch demo.
      </div>
    </section>
  `;
}

// Screen 28: Temple Seva Screen
function renderSevaScreen() {
  return `
    <section class="screen-view active">
      <div class="page-header">
        <button type="button" class="back-link" onclick="nav('home')">← Back to Home</button>
        <h1>Continue Your Seva</h1>
        <p class="text-light-green">Offer Seva at a verified sacred temple through Aaradhya</p>
      </div>

      <div class="home-hero" style="margin-bottom:var(--space-6)">
        <div class="home-hero-content">
          <div class="eyebrow" style="color:var(--accent)">Post-Ritual Continuation</div>
          <h2 class="display-title" style="font-size:32px">Keep the sacred connection going.</h2>
          <p>
            Offer Seva at revered ancient temples in the name of your family and receive consecrated prasad alongside a digital acknowledgement of your Sankalp.
          </p>
        </div>
      </div>

      <!-- Verified Temples Grid -->
      <div class="page-header" style="margin-bottom:var(--space-3)">
        <h3 class="section-title">Verified Temple Shrines</h3>
      </div>
      <div class="grid grid-cols-3" style="margin-bottom:var(--space-6)">
        <div class="card">
          <div class="eyebrow">Varanasi, UP</div>
          <h3 style="font-size:18px; margin:6px 0">Shri Kashi Vishwanath</h3>
          <p class="small text-light-green">Daily Ganga Aarti, Deepdaan, and Rudrabhishek Seva offered in your Gotra.</p>
        </div>
        <div class="card">
          <div class="eyebrow">Ujjain, MP</div>
          <h3 style="font-size:18px; margin:6px 0">Mahakaleshwar Jyotirlinga</h3>
          <p class="small text-light-green">Bhasma Aarti sponsorship and Nitya Anna Daan at the sacred Mahakal shrine.</p>
        </div>
        <div class="card">
          <div class="eyebrow">Tirupati, AP</div>
          <h3 style="font-size:18px; margin:6px 0">Tirupati Balaji</h3>
          <p class="small text-light-green">Kalyanotsavam and Laddu Prasadam offering conducted on your family's behalf.</p>
        </div>
      </div>

      <!-- Offering Selection -->
      <div class="card">
        <div class="eyebrow">Sacred Dakshina</div>
        <h3 style="margin:6px 0 16px">Choose an Offering Amount</h3>

        <div class="grid grid-cols-4" style="gap:10px; margin-bottom:16px">
          ${['₹101', '₹501', '₹1,001', '₹2,100'].map(amt => `
            <button type="button" class="slot-card" style="flex-direction:column; padding:16px 8px; text-align:center" onclick="openSevaModal('${amt}')">
              <strong style="font-size:24px; color:var(--light-green)">${amt}</strong>
              <span class="micro text-light-green" style="margin-top:4px">Temple Seva</span>
            </button>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// Screen 29: Astrology / Kundli Utility
function renderKundliScreen() {
  return `
    <section class="screen-view active">
      <div class="page-header">
        <button type="button" class="back-link" onclick="nav('home')">← Back to Home</button>
        <h1>Vedic Kundli & Muhurat</h1>
        <p class="text-light-green">A simple secondary astrological utility for the family</p>
      </div>

      <div class="grid grid-cols-2">
        <div class="card">
          <div class="eyebrow">Vedic Birth Chart</div>
          <h3 style="margin:6px 0 16px">Generate Family Kundli</h3>

          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" id="kundliName" value="${AppState.user.name}">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="date" class="form-control" id="kundliDob" value="1995-08-15">
            </div>
            <div class="form-group">
              <label class="form-label">Birth Time</label>
              <input type="time" class="form-control" id="kundliTime" value="10:30">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Place of Birth</label>
            <input type="text" class="form-control" id="kundliPlace" value="New Delhi">
          </div>

          <button type="button" class="btn btn-primary btn-block" onclick="generateKundliResult()">
            Calculate Vedic Insights
          </button>
        </div>

        <!-- Today's Panchang Overview -->
        <div class="card" style="background:var(--surface-alt)">
          <div class="eyebrow">Daily Panchang</div>
          <h3 style="margin:6px 0 12px">Today's Auspicious Times</h3>

          <div class="summary-table">
            <div class="summary-row">
              <span class="text-light-green">Tithi:</span>
              <strong>Shukla Paksha Dashami</strong>
            </div>
            <div class="summary-row">
              <span class="text-light-green">Nakshatra:</span>
              <strong>Rohini (Supreme for Pujas)</strong>
            </div>
            <div class="summary-row">
              <span class="text-light-green">Abhijit Muhurat:</span>
              <strong style="color:var(--light-green)">11:45 AM – 12:35 PM</strong>
            </div>
            <div class="summary-row">
              <span class="text-light-green">Rahu Kaal (Avoid):</span>
              <strong style="color:var(--accent)">04:30 PM – 06:00 PM</strong>
            </div>
          </div>

          <div style="margin-top:16px">
            <button type="button" class="btn btn-sm btn-secondary btn-block" onclick="startBookingFlow('griha-pravesh')">
              Plan Puja for Auspicious Date →
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// 5. Modals & Dialog Controllers
// ==========================================================================

function openModal(html) {
  const stage = document.getElementById('modalStage');
  const box = document.getElementById('modalBox');
  box.innerHTML = `
    <button type="button" class="modal-close-btn" onclick="closeModal()" aria-label="Close modal">✕</button>
    ${html}
  `;
  stage.classList.add('show');
  stage.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  const stage = document.getElementById('modalStage');
  stage.classList.remove('show');
  stage.setAttribute('aria-hidden', 'true');
}

function handleBackdropClick(event) {
  if (event.target.id === 'modalStage') {
    closeModal();
  }
}

function openPanditProfile(panditId) {
  const pandit = PANDITS_DATABASE.find(p => p.id === panditId) || PANDITS_DATABASE[0];
  openModal(`
    <div>
      <div style="display:flex; gap:16px; align-items:center; margin-bottom:16px">
        <div class="pandit-avatar" style="width:68px; height:68px; font-size:24px">${pandit.avatarInitials}</div>
        <div>
          <span class="badge badge-verified">✓ Verified Purohit</span>
          <h2 style="font-size:22px; margin:4px 0">${pandit.name}</h2>
          <div class="small text-light-green">★ ${pandit.rating} · ${pandit.bookingsCount} Aaradhya ceremonies</div>
        </div>
      </div>

      <div style="background:var(--surface-alt); border:1px solid var(--border-gold); padding:14px; border-radius:var(--radius-md); margin-bottom:16px; font-size:13px">
        <div><strong style="color:var(--accent)">Education:</strong> <span style="color:#FFFFFF">${pandit.education}</span></div>
        <div style="margin-top:4px"><strong style="color:var(--accent)">Tradition:</strong> <span style="color:#FFFFFF">${pandit.tradition}</span></div>
        <div style="margin-top:4px"><strong style="color:var(--accent)">Languages:</strong> <span style="color:#FFFFFF">${pandit.languages}</span></div>
      </div>

      <h4 style="font-size:15px; margin-bottom:8px">About Pandit Ji</h4>
      <p style="font-size:14px; color:var(--text-secondary); line-height:1.5; margin-bottom:16px">${pandit.bio}</p>

      <h4 style="font-size:15px; margin-bottom:8px">Devotee Reviews</h4>
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px">
        ${pandit.reviews.map(r => `
          <div style="background:var(--surface-alt); border:1px solid var(--border-gold); padding:10px 14px; border-radius:var(--radius-sm)">
            <div style="font-weight:700; font-size:13px; color:var(--accent)">${r.devotee}</div>
            <p class="small text-light-green" style="margin-top:2px">"${r.comment}"</p>
          </div>
        `).join('')}
      </div>

      <button type="button" class="btn btn-primary btn-block" onclick="closeModal(); showToast('Pandit ${pandit.name} selected.');">
        Continue with ${pandit.name}
      </button>
    </div>
  `);
}

function openSwitchPanditModal() {
  openModal(`
    <div>
      <h3 style="font-size:20px; margin-bottom:4px">Choose Alternative Pandit</h3>
      <p class="small text-light-green" style="margin-bottom:16px">All Pandits adhere to Aaradhya's verified Vedic standards.</p>

      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px">
        ${PANDITS_DATABASE.map(p => `
          <div class="slot-card ${AppState.booking.panditId === p.id ? 'selected' : ''}" onclick="selectPandit('${p.id}'); closeModal();">
            <div style="display:flex; gap:12px; align-items:center">
              <div class="pandit-avatar" style="width:44px; height:44px; font-size:16px">${p.avatarInitials}</div>
              <div>
                <strong style="color:#FFFFFF">${p.name}</strong>
                <div class="micro text-light-green">★ ${p.rating} · ${p.experience} · ${p.languages}</div>
              </div>
            </div>
            <span class="badge badge-verified micro">${AppState.booking.panditId === p.id ? 'Selected' : 'Select'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `);
}

function openAllSamagriModal() {
  openModal(`
    <div>
      <div class="eyebrow">100% Unadulterated</div>
      <h3 style="font-size:22px; margin:6px 0 12px">Complete 18-Item Samagri Checklist</h3>
      <p class="small text-light-green" style="margin-bottom:16px">Every item is packed in eco-friendly packaging and inspected for sacred purity.</p>

      <div style="display:flex; flex-direction:column; gap:16px; max-height:360px; overflow-y:auto; padding-right:6px">
        ${SAMAGRI_ITEMS.map(cat => `
          <div>
            <strong style="font-size:14px; color:var(--accent)">${cat.category}</strong>
            <ul style="list-style:none; padding:0; margin-top:6px">
              ${cat.items.map(item => `
                <li style="font-size:13px; padding:4px 0; border-bottom:1px dashed var(--border); display:flex; align-items:center; gap:6px; color:var(--text-secondary)">
                  <span style="color:var(--light-green)">✓</span> ${item}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <button type="button" class="btn btn-primary btn-block" style="margin-top:20px" onclick="closeModal()">
        Got It
      </button>
    </div>
  `);
}

function openAddMemberModal() {
  openModal(`
    <div>
      <h3 style="font-size:20px; margin-bottom:4px">Add Family Member</h3>
      <p class="small text-light-green" style="margin-bottom:16px">Add details for personalized family ritual reminders and Gotra sankalp.</p>

      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-control" id="newMemberName" placeholder="e.g. Aarav">
      </div>

      <div class="form-group">
        <label class="form-label">Relationship</label>
        <select class="form-control" id="newMemberRole">
          <option>Son</option>
          <option>Daughter</option>
          <option>Sister</option>
          <option>Brother</option>
          <option>Mother-in-law</option>
          <option>Father-in-law</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Rashi (Zodiac)</label>
        <select class="form-control" id="newMemberRashi">
          <option>Aries (Mesh)</option>
          <option>Taurus (Vrishabh)</option>
          <option>Gemini (Mithun)</option>
          <option>Cancer (Kark)</option>
          <option>Leo (Simha)</option>
          <option>Virgo (Kanya)</option>
          <option>Libra (Tula)</option>
          <option>Scorpio (Vrishchik)</option>
        </select>
      </div>

      <button type="button" class="btn btn-primary btn-block" onclick="saveNewFamilyMember()">
        Save to Family OS
      </button>
    </div>
  `);
}

function saveNewFamilyMember() {
  const name = document.getElementById('newMemberName').value.trim();
  const role = document.getElementById('newMemberRole').value;
  const rashi = document.getElementById('newMemberRashi').value.split(' ')[0];

  if (!name) {
    showToast('Please enter member name');
    return;
  }

  AppState.family.members.push({
    id: 'm-' + Date.now(),
    name: name,
    role: role,
    avatar: '🧒',
    rashi: rashi,
    nakshatra: 'Ashwini'
  });

  closeModal();
  renderApp();
  showToast(`${name} added to ${AppState.family.name}!`);
}

function openSevaModal(amount) {
  openModal(`
    <div style="text-align:center">
      <div style="font-size:40px; margin-bottom:8px">🪔</div>
      <div class="eyebrow">Temple Offering</div>
      <h2 style="font-size:26px; margin:6px 0">${amount} Seva Offering</h2>
      <p class="small text-light-green" style="margin-bottom:16px">
        Dedicated in the name of <strong>${AppState.family.name}</strong> (Gotra: ${AppState.family.gotra}) at Shri Kashi Vishwanath Temple.
      </p>

      <div style="background:var(--surface-alt); border:1px solid var(--border-gold); padding:14px; border-radius:var(--radius-md); text-align:left; font-size:13px; margin-bottom:20px">
        <div style="color:var(--light-green)">✓ Digital Sankalp video acknowledgement within 24 hours</div>
        <div style="margin-top:4px; color:var(--light-green)">✓ Consecrated Dry Prasad mailed to your address</div>
      </div>

      <button type="button" class="btn btn-primary btn-block" onclick="closeModal(); showToast('Seva offering successful! Digital receipt generated.');">
        Confirm Offering of ${amount}
      </button>
    </div>
  `);
}

function generateKundliResult() {
  const name = document.getElementById('kundliName').value || AppState.user.name;
  openModal(`
    <div style="text-align:center">
      <div style="font-size:36px; margin-bottom:8px">✦</div>
      <div class="eyebrow">Vedic Birth Chart Summary</div>
      <h2 style="font-size:24px; margin:6px 0">${name}'s Janampatri</h2>
      <p class="small text-light-green" style="margin-bottom:16px">Calculated using Lahiri Ayanamsha & North Indian Lagna.</p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:left; margin-bottom:20px">
        <div class="card" style="padding:12px; background:var(--surface-alt)">
          <span class="micro text-light-green">Chandra Rashi</span>
          <div style="font-weight:700; font-size:16px; color:#FFFFFF">Leo (Simha)</div>
        </div>
        <div class="card" style="padding:12px; background:var(--surface-alt)">
          <span class="micro text-light-green">Janma Nakshatra</span>
          <div style="font-weight:700; font-size:16px; color:#FFFFFF">Magha (Pada 2)</div>
        </div>
        <div class="card" style="padding:12px; background:var(--surface-alt)">
          <span class="micro text-light-green">Lagna (Ascendant)</span>
          <div style="font-weight:700; font-size:16px; color:#FFFFFF">Scorpio (Vrishchik)</div>
        </div>
        <div class="card" style="padding:12px; background:var(--surface-alt)">
          <span class="micro text-light-green">Favorable Deity</span>
          <div style="font-weight:700; font-size:16px; color:#FFFFFF">Lord Ganesha & Surya</div>
        </div>
      </div>

      <button type="button" class="btn btn-primary btn-block" onclick="closeModal()">
        Save to Family Profile
      </button>
    </div>
  `);
}

function openLocationPicker() {
  openModal(`
    <div>
      <h3 style="font-size:20px; margin-bottom:4px">Select Service City</h3>
      <p class="small text-light-green" style="margin-bottom:16px">Aaradhya verified purohits are active in these metropolitan clusters.</p>

      <div style="display:flex; flex-direction:column; gap:8px">
        ${['Delhi NCR', 'Bengaluru', 'Mumbai & Pune', 'Varanasi', 'Hyderabad'].map(city => `
          <button type="button" class="slot-card ${AppState.user.city === city ? 'selected' : ''}" style="width:100%; border:none" onclick="AppState.user.city='${city}'; closeModal(); renderApp(); showToast('City set to ${city}');">
            <strong style="color:#FFFFFF">${city}</strong>
            <span class="badge badge-verified micro">${AppState.user.city === city ? 'Active' : 'Select'}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `);
}

function openNotifications() {
  openModal(`
    <div>
      <div class="eyebrow">Smart Reminders</div>
      <h3 style="font-size:20px; margin:4px 0 16px">Ritual Notifications</h3>

      <div style="display:flex; flex-direction:column; gap:10px">
        <div style="background:var(--surface-alt); border:1px solid var(--border-gold); padding:12px; border-radius:var(--radius-md)">
          <span class="badge badge-gold micro">Festival Alert</span>
          <h4 style="font-size:14px; margin:4px 0; color:#FFFFFF">Navratri begins in 7 days</h4>
          <p class="micro text-light-green">Book Ghatasthapana Puja early to secure your preferred morning Muhurat slot.</p>
        </div>
        <div style="background:var(--surface-alt); border:1px solid var(--border-gold); padding:12px; border-radius:var(--radius-md)">
          <span class="badge badge-verified micro">Lifecycle Reminder</span>
          <h4 style="font-size:14px; margin:4px 0; color:#FFFFFF">Griha Pravesh 6-Month Mark</h4>
          <p class="micro text-light-green">Traditionally recommended to perform a Satyanarayan Katha for ongoing harmony.</p>
        </div>
      </div>

      <button type="button" class="btn btn-secondary btn-block" style="margin-top:16px" onclick="closeModal()">
        Dismiss
      </button>
    </div>
  `);
}

function openHelpSupport() {
  openModal(`
    <div>
      <div class="eyebrow">Aaradhya Trust Stack</div>
      <h3 style="font-size:22px; margin:4px 0 12px">How can our Concierge help?</h3>
      <p class="small text-light-green" style="margin-bottom:16px">Dedicated assistance for families booking sacred home ceremonies.</p>

      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px">
        <div class="card" style="padding:12px; background:var(--surface-alt)">
          <strong style="color:#FFFFFF">Instant WhatsApp Concierge</strong>
          <div class="micro text-light-green">Average response time: 3 minutes</div>
        </div>
        <div class="card" style="padding:12px; background:var(--surface-alt)">
          <strong style="color:#FFFFFF">Vedic Purohit Verification Guarantee</strong>
          <div class="micro text-light-green">All pandits certified by premier Sanskrit universities</div>
        </div>
        <div class="card" style="padding:12px; background:var(--surface-alt)">
          <strong style="color:#FFFFFF">100% Refund Policy</strong>
          <div class="micro text-light-green">Full refund if ceremony canceled 12 hours prior to Muhurat</div>
        </div>
      </div>

      <button type="button" class="btn btn-primary btn-block" onclick="closeModal(); showToast('Support ticket #AR-942 opened with concierge.');">
        Connect to Support
      </button>
    </div>
  `);
}

// Global Toast helper
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(AppState.toastTimer);
  AppState.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

// ==========================================================================
// 6. Interactive Selection Handlers
// ==========================================================================
function selectPackage(packName, price) {
  AppState.booking.package = packName;
  AppState.booking.packagePrice = price;
  renderApp();
}

function setSlot(dateStr, timeStr, muhuratDesc) {
  AppState.booking.date = dateStr;
  AppState.booking.time = timeStr;
  AppState.booking.muhuratType = muhuratDesc;
  renderApp();
  showToast(`Selected Muhurat: ${dateStr} · ${timeStr}`);
}

function selectPandit(panditId) {
  const pandit = PANDITS_DATABASE.find(p => p.id === panditId);
  if (pandit) {
    AppState.booking.panditId = pandit.id;
    AppState.booking.panditName = pandit.name;
    renderApp();
  }
}

function selectSamagriOption(option) {
  AppState.booking.samagriChoice = option;
  renderApp();
}

function filterRitualCatalog() {
  const q = document.getElementById('pujaSearchInput').value.toLowerCase();
  const filtered = RITUALS_CATALOG.filter(r => 
    r.name.toLowerCase().includes(q) || 
    r.shortDesc.toLowerCase().includes(q) ||
    r.purpose.toLowerCase().includes(q) ||
    r.deity.toLowerCase().includes(q)
  );

  const container = document.getElementById('catalogGrid');
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:40px">
        <p class="text-light-green">No rituals matched "${q}". Try searching for 'Havan', 'Ganesha', or 'Home'.</p>
      </div>
    `;
  } else {
    container.innerHTML = filtered.map(r => `
      <div class="ritual-card" onclick="selectRitual('${r.id}')">
        <div>
          <div class="ritual-card-header">
            <div class="ritual-icon">${r.icon}</div>
            <span class="badge badge-verified">✓ Verified Purohit</span>
          </div>
          <h3>${r.name}</h3>
          <p>${r.shortDesc}</p>
        </div>
        <div class="ritual-card-footer">
          <span class="price-tag">From ₹${r.priceStart.toLocaleString('en-IN')}</span>
          <button type="button" class="btn btn-sm btn-ghost" style="padding:0">View Details →</button>
        </div>
      </div>
    `).join('');
  }
}

function filterByTag(tag) {
  const input = document.getElementById('pujaSearchInput');
  if (tag === 'all') {
    input.value = '';
  } else {
    input.value = tag;
  }
  filterRitualCatalog();
}

// ==========================================================================
// 7. Pitch & Demo Presentation Controller
// ==========================================================================
function startPitchFlow() {
  showToast('Starting 60s Pitch Demo sequence…');
  nav('home');

  setTimeout(() => {
    selectRitual('griha-pravesh');
    showToast('Pitch: 1. Discovered Griha Pravesh ritual');

    setTimeout(() => {
      startBookingFlow('griha-pravesh');
      selectPackage('Premium', 8999);
      showToast('Pitch: 2. Selected Premium Package');

      setTimeout(() => {
        AppState.bookingStep = 2;
        renderApp();
        showToast('Pitch: 3. Auspicious Muhurat locked');

        setTimeout(() => {
          AppState.bookingStep = 3;
          renderApp();

          setTimeout(() => {
            AppState.bookingStep = 4;
            AppState.isMatchingPandit = true;
            renderApp();
            showToast('Pitch: 4. Pandit Matching in progress…');

            setTimeout(() => {
              AppState.isMatchingPandit = false;
              renderApp();
              showToast('Pitch: 5. Pandit Rajesh Sharma Matched!');

              setTimeout(() => {
                AppState.bookingStep = 6;
                renderApp();
                showToast('Pitch: 6. Transparent Price Breakdown');

                setTimeout(() => {
                  AppState.booking.status = 'Confirmed';
                  AppState.view = 'confirmation';
                  renderApp();
                  showToast('Pitch: 7. Booking Confirmed!');

                  setTimeout(() => {
                    AppState.booking.status = 'On The Way';
                    nav('tracking');
                    showToast('Pitch: 8. Live Tracking: Pandit is on the way');

                    setTimeout(() => {
                      AppState.booking.status = 'Completed';
                      nav('completion');
                      showToast('Pitch: 9. Puja Completed & Ritual Memory Vault');

                      setTimeout(() => {
                        nav('family');
                        showToast('Pitch Complete: Persistent Family Ritual OS!');
                      }, 4500);
                    }, 4000);
                  }, 3500);
                }, 3000);
              }, 2500);
            }, 1800);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  }, 1500);
}

function toggleDeviceFrame() {
  const body = document.body;
  const isFrame = body.classList.toggle('mode-frame');
  AppState.deviceFrame = isFrame;

  const btnText = document.getElementById('frameToggleText');
  const btnIcon = document.getElementById('frameToggleIcon');
  if (isFrame) {
    btnText.textContent = 'Responsive View';
    btnIcon.textContent = '💻';
    showToast('Switched to 390px Mobile Device Frame view');
  } else {
    btnText.textContent = 'Mobile Frame';
    btnIcon.textContent = '📱';
    showToast('Switched to Full Responsive view');
  }
}

function resetDemoData() {
  AppState.view = 'home';
  AppState.bookingStep = 0;
  AppState.isMatchingPandit = false;
  AppState.booking.status = 'Confirmed';
  AppState.booking.package = 'Premium';
  AppState.booking.packagePrice = 8999;
  AppState.booking.date = '18 October 2026';
  AppState.booking.time = '10:00 AM – 12:15 PM';
  AppState.booking.panditId = 'rajesh';
  AppState.booking.panditName = 'Pandit Rajesh Sharma';
  AppState.booking.samagriChoice = 'Complete Samagri';

  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('Demo state reset to initial values.');
}

// ==========================================================================
// 8. Bottom Navigation Renderer
// ==========================================================================
function renderBottomNav() {
  const navContainer = document.getElementById('bottomNavContainer');
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
    },
    {
      id: 'book',
      label: 'Book',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>`
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
    },
    {
      id: 'family',
      label: 'Family',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>`
    }
  ];

  let activeTab = AppState.view;
  if (['detail', 'confirmation'].includes(AppState.view)) activeTab = 'book';
  if (['tracking', 'completion'].includes(AppState.view)) activeTab = 'bookings';

  navContainer.innerHTML = navItems.map(item => `
    <button type="button" class="nav-tab-btn ${activeTab === item.id ? 'active' : ''}" onclick="nav('${item.id}', 0)">
      ${item.icon}
      <span>${item.label}</span>
    </button>
  `).join('');
}

// ==========================================================================
// 9. Root Stage Renderer
// ==========================================================================
function renderApp() {
  const mainStage = document.getElementById('app');
  let html = '';

  switch (AppState.view) {
    case 'home':
      html = renderHomeScreen();
      break;
    case 'book':
      if (AppState.bookingStep === 0) {
        html = renderDiscoveryScreen();
      } else {
        html = renderBookingStepScreen();
      }
      break;
    case 'detail':
      html = renderDetailScreen();
      break;
    case 'confirmation':
      html = renderConfirmationScreen();
      break;
    case 'tracking':
      html = renderTrackingScreen();
      break;
    case 'completion':
      html = renderCompletionScreen();
      break;
    case 'family':
      html = renderFamilyScreen();
      break;
    case 'bookings':
      html = renderBookingsScreen();
      break;
    case 'profile':
      html = renderProfileScreen();
      break;
    case 'seva':
      html = renderSevaScreen();
      break;
    case 'kundli':
      html = renderKundliScreen();
      break;
    default:
      html = renderHomeScreen();
  }

  mainStage.innerHTML = html;
  renderBottomNav();

  // Attach cutting-edge interactive effects
  attachCardEffects();
  initStatsCounters();
}

// Interactive Ambient Cursor Lighting
window.addEventListener('pointermove', (e) => {
  document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
});

// Spotlight Hover & 3D Tilt Micro-interactions
function attachCardEffects() {
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

// Scroll-triggered Animated Counters (IntersectionObserver)
function initStatsCounters() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = start + (target - start) * easeOut;
          el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current).toLocaleString('en-IN')) + suffix;
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = (isDecimal ? target.toFixed(2) : target.toLocaleString('en-IN')) + suffix;
          }
        }
        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  statElements.forEach(el => observer.observe(el));
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('aaradhya_devotional_theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  AppState.theme = savedTheme;

  const demoIcon = document.getElementById('themeToggleDemoIcon');
  const demoText = document.getElementById('themeToggleDemoText');
  const headerIcon = document.getElementById('headerThemeIcon');

  if (savedTheme === 'dark') {
    if (demoIcon) demoIcon.textContent = '☀️';
    if (demoText) demoText.textContent = 'Sattvic Light';
    if (headerIcon) headerIcon.textContent = '☀️';
  } else {
    if (demoIcon) demoIcon.textContent = '🌙';
    if (demoText) demoText.textContent = 'Sanctum Mode';
    if (headerIcon) headerIcon.textContent = '🌙';
  }

  renderApp();
});
