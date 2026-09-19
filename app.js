/**
 * Aaradhya — Production Core Application
 * "Your rituals, organised. Faith with less friction."
 * Version: 2.1.0 — Material Design 3 (M3) Mobile-First for Android & Cross-Platform
 * Iconography: Font Awesome 6.5.1 Vector Library
 * Controller: Material Context Menu (M3 Elevated Surface & Scrim)
 */

(function () {
  'use strict';

  // Core Service Singletons (Injected via UMD / Global Scope)
  const Security = window.AaradhyaSecurity;
  const Catalog = window.AaradhyaCatalog;
  const Panchang = window.AaradhyaPanchang;
  const Audio = window.AaradhyaAudio;
  const Certificate = window.AaradhyaCertificate;
  const Store = window.AaradhyaStore;

  const RITUALS_CATALOG = Catalog.RITUALS_CATALOG;
  const PANDITS_DATABASE = Catalog.PANDITS_DATABASE;
  const SAMAGRI_ITEMS = Catalog.SAMAGRI_ITEMS;
  const TEMPLES_CATALOG = Catalog.TEMPLES_CATALOG;

  function getState() {
    return Store.getState();
  }

  let toastTimer = null;

  // ==========================================================================
  // Material 3 Toast & Dialog / Bottom Sheet System
  // ==========================================================================
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function openModal(html) {
    const stage = document.getElementById('modalStage');
    const box = document.getElementById('modalBox');
    if (!stage || !box) return;
    box.innerHTML = `
      <button type="button" class="modal-close-btn md-ripple" onclick="closeModal()" aria-label="Close dialog">
        <i class="fa-solid fa-xmark"></i>
      </button>
      ${html}
    `;
    stage.classList.add('show');
    stage.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Android back button integration
    if (typeof history !== 'undefined' && history.pushState) {
      history.pushState({ modalOpen: true }, '');
    }

    setTimeout(() => {
      const focusable = box.querySelector('button, input, select, textarea, [tabindex="0"]');
      if (focusable) focusable.focus();
    }, 50);
  }

  function closeModal() {
    const stage = document.getElementById('modalStage');
    if (!stage) return;
    stage.classList.remove('show');
    stage.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function handleBackdropClick(event) {
    if (event.target.id === 'modalStage') {
      closeModal();
    }
  }

  // ==========================================================================
  // Material Context Menu Controller (Replaces Persistent Top Bar)
  // ==========================================================================
  function toggleContextMenu() {
    const backdrop = document.getElementById('contextMenuBackdrop');
    if (!backdrop) return;
    if (backdrop.classList.contains('show')) {
      closeContextMenu();
    } else {
      openContextMenu();
    }
  }

  function openContextMenu() {
    const backdrop = document.getElementById('contextMenuBackdrop');
    if (!backdrop) return;
    backdrop.classList.add('show');
    backdrop.setAttribute('aria-hidden', 'false');
    Audio.triggerHaptic(20);

    const themeTitle = document.getElementById('themeMenuTitle');
    const themeIcon = document.getElementById('themeMenuIcon');
    const currentTheme = getState().theme || 'dark';
    if (themeTitle) {
      themeTitle.textContent = currentTheme === 'dark' ? 'Switch to Sattvic Light' : 'Switch to Sanctum Dark';
    }
    if (themeIcon) {
      themeIcon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    const frameTitle = document.getElementById('frameMenuTitle');
    const frameIcon = document.getElementById('frameMenuIcon');
    if (frameTitle) {
      frameTitle.textContent = getState().deviceFrame ? 'Switch to Responsive' : 'Switch to 390px Mobile Frame';
    }
    if (frameIcon) {
      frameIcon.className = getState().deviceFrame ? 'fa-solid fa-desktop' : 'fa-solid fa-mobile-screen';
    }
  }

  function closeContextMenu() {
    const backdrop = document.getElementById('contextMenuBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('show');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  // Android Hardware / Browser Back Button Handling
  window.addEventListener('popstate', () => {
    const contextBackdrop = document.getElementById('contextMenuBackdrop');
    if (contextBackdrop && contextBackdrop.classList.contains('show')) {
      closeContextMenu();
      return;
    }
    const modalStage = document.getElementById('modalStage');
    if (modalStage && modalStage.classList.contains('show')) {
      closeModal();
      return;
    }
    const state = getState();
    if (state.view === 'book' && state.bookingStep > 1) {
      prevBookingStep();
      return;
    }
    if (state.view !== 'home') {
      nav('home');
    }
  });

  // ESC key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContextMenu();
      closeModal();
    }
  });

  // ==========================================================================
  // Navigation & Core Routing
  // ==========================================================================
  function nav(viewName, step = 0) {
    Store.setView(viewName, step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectRitual(ritualId) {
    const ritual = RITUALS_CATALOG.find(r => r.id === ritualId) || RITUALS_CATALOG[0];
    Store.getState().draftBooking.ritualId = ritual.id;
    Store.getState().draftBooking.ritualName = ritual.name;
    Store.setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startBookingFlow(ritualId) {
    Store.startBookingFlow(ritualId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function nextBookingStep() {
    const state = getState();

    // Step 3 (Location) Validation Gate
    if (state.bookingStep === 3) {
      const houseInput = document.getElementById('locHouse');
      const addressInput = document.getElementById('locAddress');
      const pincodeInput = document.getElementById('locPincode');

      const houseVal = houseInput ? houseInput.value.trim() : state.draftBooking.location.house;
      const addressVal = addressInput ? addressInput.value.trim() : state.draftBooking.location.address;
      const pincodeVal = pincodeInput ? pincodeInput.value.trim() : state.draftBooking.location.pincode;

      let hasError = false;

      if (!houseVal) {
        if (houseInput) houseInput.classList.add('is-invalid');
        hasError = true;
      } else if (houseInput) {
        houseInput.classList.remove('is-invalid');
      }

      if (!addressVal) {
        if (addressInput) addressInput.classList.add('is-invalid');
        hasError = true;
      } else if (addressInput) {
        addressInput.classList.remove('is-invalid');
      }

      if (!Security.isValidPincode(pincodeVal)) {
        if (pincodeInput) pincodeInput.classList.add('is-invalid');
        showToast('Please enter a valid 6-digit Indian pincode (e.g. 201301)');
        hasError = true;
      } else if (pincodeInput) {
        pincodeInput.classList.remove('is-invalid');
      }

      if (hasError) {
        showToast('Please fill in required doorstep location details.');
        return;
      }

      Store.setBookingLocation({
        house: houseVal,
        address: addressVal,
        landmark: document.getElementById('locLandmark') ? document.getElementById('locLandmark').value.trim() : state.draftBooking.location.landmark,
        city: document.getElementById('locCity') ? document.getElementById('locCity').value.trim() : state.draftBooking.location.city,
        pincode: pincodeVal
      });
    }

    // Step 3 -> 4: Animated Pandit Matching Transition
    if (state.bookingStep === 3) {
      state.bookingStep = 4;
      state.isMatchingPandit = true;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        state.isMatchingPandit = false;
        renderApp();
        showToast('Pandit Rajesh Sharma matched with 98.4% compatibility!');
      }, 1200);
      return;
    }

    if (state.bookingStep < 7) {
      Store.setView('book', state.bookingStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      processPayment();
    }
  }

  function prevBookingStep() {
    const state = getState();
    if (state.bookingStep > 1) {
      Store.setView('book', state.bookingStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      nav('detail');
    }
  }

  function processPayment() {
    showToast('Authorizing Sacred Escrow Payment…');
    setTimeout(() => {
      const paymentRadio = document.querySelector('input[name="paymethod"]:checked');
      const method = paymentRadio ? paymentRadio.value : 'UPI';
      const newBooking = Store.confirmPayment(method);
      Audio.playTempleBell();
      showToast(`Ceremony Confirmed! Reference ID: ${newBooking.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 650);
  }

  // ==========================================================================
  // Audio & Devotional Ambient Sound Controls
  // ==========================================================================
  function toggleAartiPlayer() {
    const state = getState();
    if (Audio.isPlaying()) {
      Audio.stopTanpuraDrone();
      state.audioVisualizer.isPlaying = false;
      updateAudioUI(false);
      showToast('Aarti & Tanpura resonance paused');
    } else {
      const started = Audio.startTanpuraDrone();
      if (started) {
        state.audioVisualizer.isPlaying = true;
        updateAudioUI(true);
        showToast('Playing Sacred Tanpura Drone & Om Resonance');
      }
    }
  }

  function updateAudioUI(isPlaying) {
    const visualizer = document.getElementById('aartiVisualizerContainer');
    if (visualizer) {
      if (isPlaying) visualizer.classList.add('visualizer-playing');
      else visualizer.classList.remove('visualizer-playing');
    }
    const headerIcon = document.getElementById('headerAartiIcon');
    const playBtnText = document.getElementById('aartiPlayBtnText');
    const playBtnIcon = document.getElementById('aartiPlayBtnIcon');

    if (isPlaying) {
      if (headerIcon) headerIcon.className = 'fa-solid fa-volume-high';
      if (playBtnIcon) playBtnIcon.className = 'fa-solid fa-pause';
      if (playBtnText) playBtnText.textContent = 'Pause Aarti';
    } else {
      if (headerIcon) headerIcon.className = 'fa-solid fa-bell';
      if (playBtnIcon) playBtnIcon.className = 'fa-solid fa-play';
      if (playBtnText) playBtnText.textContent = 'Play Aarti';
    }
  }

  function toggleDevotionalTheme(explicit) {
    const current = document.body.getAttribute('data-theme') || getState().theme || 'dark';
    const nextTheme = explicit || (current === 'light' ? 'dark' : 'light');
    document.body.setAttribute('data-theme', nextTheme);
    Store.setTheme(nextTheme);

    const headerIcon = document.getElementById('headerThemeIcon');
    if (nextTheme === 'dark') {
      if (headerIcon) headerIcon.className = 'fa-solid fa-sun';
      showToast('Switched to Temple Sanctum Dark Mode');
    } else {
      if (headerIcon) headerIcon.className = 'fa-solid fa-moon';
      showToast('Switched to Sattvic Light Mode');
    }
  }

  function toggleDeviceFrame() {
    const body = document.body;
    const isFrame = body.classList.toggle('mode-frame');
    getState().deviceFrame = isFrame;

    if (isFrame) {
      showToast('Switched to 390px Mobile Device Frame view');
    } else {
      showToast('Switched to Full Responsive view');
    }
  }

  // ==========================================================================
  // Japa Mala Interactive Modal (108 Tactile Beads)
  // ==========================================================================
  const JAPA_MANTRAS = {
    gayatri: {
      name: 'Gayatri Mahamantra',
      deity: 'Maa Gayatri / Savitr',
      devanagari: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
      meaning: 'May the Supreme Divine Light illuminate and awaken our intellect.'
    },
    mahamrityunjaya: {
      name: 'Maha Mrityunjaya',
      deity: 'Bhagwan Shiva',
      devanagari: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
      meaning: 'We revere the Three-Eyed Lord who nourishes all beings. Grant us liberation and health.'
    },
    om_namah_shivaya: {
      name: 'Shiva Panchakshari',
      deity: 'Mahadev',
      devanagari: 'ॐ नमः शिवाय',
      meaning: 'I bow with supreme surrender to Shiva, the auspicious cosmic consciousness.'
    },
    hare_krishna: {
      name: 'Maha Mantra',
      deity: 'Sri Sri Radha Krishna',
      devanagari: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥',
      meaning: 'O Supreme Divine Energy, engage my soul in devotion.'
    }
  };

  function openJapaMalaModal() {
    const state = getState();
    const mantraKey = state.japa.currentMantra || 'gayatri';
    const mantra = JAPA_MANTRAS[mantraKey] || JAPA_MANTRAS.gayatri;

    openModal(`
      <div class="japa-modal-content" style="text-align:center">
        <div class="eyebrow" style="color:var(--gold)">Tactile Devotional Utility</div>
        <h2 style="font-size:24px; margin:4px 0 12px">
          <i class="fa-solid fa-dharmachakra" style="color:var(--gold); margin-right:6px"></i>
          108 Japa Mala Counter
        </h2>

        <div style="margin-bottom:14px">
          <select class="form-control" style="max-width:320px; margin:0 auto; font-weight:700" onchange="changeJapaMantra(this.value)">
            ${Object.keys(JAPA_MANTRAS).map(key => `
              <option value="${key}" ${key === mantraKey ? 'selected' : ''}>${JAPA_MANTRAS[key].name}</option>
            `).join('')}
          </select>
        </div>

        <div class="card" style="background:var(--bg-surface-alt); border-color:var(--gold); padding:16px; margin-bottom:20px; border-radius:var(--radius-md)">
          <div style="font-size:18px; line-height:1.7; color:#FFFFFF; font-family:var(--font-devanagari); margin-bottom:8px">
            ${mantra.devanagari}
          </div>
          <p class="micro text-muted" style="line-height:1.5; margin:0">${mantra.meaning}</p>
        </div>

        <div style="display:flex; justify-content:center; align-items:center; margin-bottom:20px">
          <button type="button" class="japa-bead-button md-ripple" onclick="handleJapaChantClick()" aria-label="Chant One Bead" style="width:140px; height:140px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #FFB300, #B71C1C); border:4px solid var(--border-glass); box-shadow:0 0 30px rgba(255,111,0,0.4); cursor:pointer; color:#FFFFFF; display:flex; flex-direction:column; justify-content:center; align-items:center; transition:transform 0.1s ease;">
            <span style="font-size:36px; font-weight:900" id="japaModalCount">${state.japa.count}</span>
            <span style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#FFE082">/ 108 Beads</span>
          </button>
        </div>

        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:20px">
          <div class="card" style="padding:8px 16px; background:var(--bg-surface-alt); min-width:110px">
            <span class="micro text-muted">Mala Rounds</span>
            <div style="font-size:18px; font-weight:700; color:var(--emerald)" id="japaModalRounds">${state.japa.rounds} Completed</div>
          </div>
          <div class="card" style="padding:8px 16px; background:var(--bg-surface-alt); min-width:110px">
            <span class="micro text-muted">Lifetime Chants</span>
            <div style="font-size:18px; font-weight:700; color:var(--gold)" id="japaModalLifetime">${state.japa.totalLifetimeBeads}</div>
          </div>
        </div>

        <div style="display:flex; gap:10px; justify-content:center">
          <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="resetJapaCounter()">
            <i class="fa-solid fa-rotate-left"></i> Reset Mala
          </button>
          <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="closeModal()">
            Done
          </button>
        </div>
      </div>
    `);
  }

  function handleJapaChantClick() {
    Audio.triggerHaptic(25);
    const result = Store.incrementJapa();

    const countEl = document.getElementById('japaModalCount');
    const roundsEl = document.getElementById('japaModalRounds');
    const lifetimeEl = document.getElementById('japaModalLifetime');

    if (countEl) countEl.textContent = result.count;
    if (roundsEl) roundsEl.textContent = `${result.rounds} Completed`;
    if (lifetimeEl) lifetimeEl.textContent = getState().japa.totalLifetimeBeads;

    if (result.completedRound) {
      Audio.playTempleBell();
      Audio.triggerHaptic(60);
      showToast('Om Shanti! You completed 108 sacred chants (1 Mala Round).');
    } else if (result.count === 27 || result.count === 54 || result.count === 81) {
      Audio.playTempleBell();
    }
  }

  function changeJapaMantra(mantraKey) {
    getState().japa.currentMantra = mantraKey;
    openJapaMalaModal();
  }

  function resetJapaCounter() {
    Store.resetJapa();
    const countEl = document.getElementById('japaModalCount');
    const roundsEl = document.getElementById('japaModalRounds');
    if (countEl) countEl.textContent = '0';
    if (roundsEl) roundsEl.textContent = '0 Completed';
    showToast('Japa count reset to zero.');
  }

  // ==========================================================================
  // Dynamic Astrological Engine & Daily Panchang Card
  // ==========================================================================
  function renderDailyPanchangCard() {
    const state = getState();
    const p = Panchang.calculatePanchang(new Date(), state.user.city);

    return `
      <div class="daily-panchang-card spotlight-card tilt-card" aria-label="Daily Vedic Panchang Card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px">
          <div>
            <div class="eyebrow" style="color:var(--gold)">Vedic Panchang & Muhurat Engine</div>
            <h3 class="daily-panchang-title">
              <i class="fa-solid fa-calendar-day" style="color:var(--gold); margin-right:6px"></i>
              Today's Auspicious Timings (${Security.escapeHTML(state.user.city)})
            </h3>
          </div>
          <span class="badge badge-verified">
            <span class="pulse-ring"></span> ${p.currentPeriod}
          </span>
        </div>

        <div class="daily-panchang-body" style="margin-top:12px">
          <p class="small text-muted" style="margin-bottom:12px">
            Calculated in real time according to North Indian Panchang for today, ${p.dateString}.
          </p>

          <div class="panchang-grid-metrics">
            <div class="panchang-metric-box">
              <div class="panchang-metric-label">Tithi</div>
              <div class="panchang-metric-val">${p.tithi}</div>
            </div>
            <div class="panchang-metric-box">
              <div class="panchang-metric-label">Nakshatra</div>
              <div class="panchang-metric-val green">${p.nakshatra}</div>
            </div>
            <div class="panchang-metric-box">
              <div class="panchang-metric-label">Abhijit Muhurat</div>
              <div class="panchang-metric-val green">${p.abhijitMuhurat}</div>
            </div>
            <div class="panchang-metric-box">
              <div class="panchang-metric-label">Rahu Kaal (Avoid)</div>
              <div class="panchang-metric-val red">${p.rahuKaal}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAartiVisualizerBar() {
    const isPlaying = Audio.isPlaying();
    return `
      <div class="aarti-visualizer-bar spotlight-card" id="aartiVisualizerContainer" aria-label="Devotional Tanpura & Aarti Player">
        <div style="display:flex; align-items:center; gap:16px; flex:1">
          <div class="visualizer-equalizer" aria-hidden="true">
            <span class="v-bar"></span>
            <span class="v-bar"></span>
            <span class="v-bar"></span>
            <span class="v-bar"></span>
            <span class="v-bar"></span>
          </div>
          <div>
            <div class="eyebrow" style="color:var(--gold); margin:0">Sacred Soundstream</div>
            <div class="visualizer-title" style="font-weight:700; font-size:15px; color:#FFFFFF">Sacred Gayatri Mahamantra & Vedic Tanpura Drone</div>
            <div class="micro text-muted">Acoustically tuned harmonic frequencies: 138.59 Hz (Sa) & 207.65 Hz (Pa)</div>
          </div>
        </div>
        <div class="visualizer-controls">
          <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="toggleAartiPlayer()">
            <i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}" id="aartiPlayBtnIcon" style="margin-right:4px"></i>
            <span id="aartiPlayBtnText">${isPlaying ? 'Pause Aarti' : 'Play Aarti'}</span>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // Screen Renderers with Font Awesome 6 Icons
  // ==========================================================================

  // Screen 01 & 03: Home Screen
  function renderHomeScreen() {
    const state = getState();
    const p = Panchang.calculatePanchang(new Date(), state.user.city);

    return `
      <section class="screen-view active">
        <!-- Ambient Temporal Muhurat Strip -->
        <div class="temporal-muhurat-strip" role="region" aria-label="Current Hindu Muhurta">
          <span class="pulse-ring"></span>
          <span><strong>${p.currentPeriod}</strong></span>
          <button type="button" class="btn-ghost small md-ripple" onclick="openJapaMalaModal()" style="padding:0 6px; font-weight:700; text-decoration:underline;">
            Open Japa Mala (108) →
          </button>
        </div>

        <!-- 1. HERO SECTION -->
        <div class="hero-stage">
          <div class="hero-left">
            <div class="eyebrow-pill">
              <span class="pulse-dot" style="display:inline-block"></span>
              <span class="eyebrow" style="margin:0">Vedic Authenticity · Modern Simplicity</span>
            </div>
            <h1 class="display-title">
              Faith, elevated.<br>
              <span class="gradient-text-saffron">Rituals, organised.</span>
            </h1>
            <p>
              From certified Purohits to 100% unadulterated Samagri and preserving your family's generational sacred memories — Aaradhya coordinates sacred devotion with zero friction.
            </p>
            <div class="hero-actions">
              <button type="button" class="btn btn-primary md-ripple" onclick="startBookingFlow('griha-pravesh')">
                <span>Book a Ceremony</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
              <button type="button" class="btn btn-secondary md-ripple" onclick="nav('book', 0)">
                <i class="fa-solid fa-book-open"></i>
                <span>Explore 8+ Rituals</span>
              </button>
              <button type="button" class="btn btn-secondary md-ripple" onclick="openJapaMalaModal()" title="Launch Tactile Digital Prayer Beads">
                <i class="fa-solid fa-hands-praying"></i>
                <span>Japa Mala</span>
              </button>
            </div>
          </div>

          <!-- Hero Product Preview Card -->
          <div class="hero-preview-wrap">
            <div class="hero-3d-card tilt-card spotlight-card">
              <div class="hero-card-header">
                <div style="display:flex; align-items:center; gap:10px">
                  <div class="ritual-icon" style="font-size:18px"><i class="fa-solid fa-house-chimney" style="color:var(--gold)"></i></div>
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
                  <div class="micro" style="color:var(--gold)"><i class="fa-solid fa-star"></i> 4.98 · Vedas Acharya · 18+ Yrs Exp</div>
                </div>
                <span class="badge badge-verified" style="font-size:11px">98.4% Match</span>
              </div>

              <div style="background:var(--bg-surface-alt); border-radius:var(--radius-md); padding:12px; border:1px solid var(--border-subtle); margin-bottom:14px">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px">
                  <span class="micro text-muted">Doorstep Samagri:</span>
                  <span class="micro" style="color:var(--emerald); font-weight:700"><i class="fa-solid fa-circle-check"></i> 18 Items Ready</span>
                </div>
                <div style="display:flex; justify-content:space-between">
                  <span class="micro text-muted">Auspicious Window:</span>
                  <span class="micro" style="color:var(--gold); font-weight:700">${p.nakshatra}</span>
                </div>
              </div>

              <button type="button" class="btn btn-sm btn-primary btn-block md-ripple" onclick="startBookingFlow('griha-pravesh')">
                <span>Instant Booking Flow</span> <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 2. INFINITE MARQUEE TICKER -->
        <div class="marquee-wrapper" aria-label="Sacred Trust Credentials">
          <div class="marquee-track">
            <div class="marquee-item"><i class="fa-solid fa-om" style="color:var(--gold); margin-right:6px"></i> Sri Kashi Vishwanath Seva Partner</div>
            <div class="marquee-item"><i class="fa-solid fa-seedling" style="color:var(--emerald); margin-right:6px"></i> 100% Certified Organic Samagri</div>
            <div class="marquee-item"><i class="fa-solid fa-award" style="color:var(--saffron); margin-right:6px"></i> Rigveda & Yajurveda Certified Purohits</div>
            <div class="marquee-item"><i class="fa-solid fa-certificate" style="color:var(--gold); margin-right:6px"></i> Digital Family Sankalp & Memory OS</div>
            <div class="marquee-item"><i class="fa-solid fa-hands-praying" style="color:var(--cyan-glow); margin-right:6px"></i> Tactile Japa Beads with Haptics</div>
            <div class="marquee-item"><i class="fa-solid fa-fire-flame-curved" style="color:var(--vermilion); margin-right:6px"></i> Mahakaleshwar Ujjain Seva Partner</div>
            <div class="marquee-item"><i class="fa-solid fa-bolt" style="color:var(--gold); margin-right:6px"></i> Instant Muhurat & Choghadiya Engine</div>
            <!-- Seamless Loop -->
            <div class="marquee-item"><i class="fa-solid fa-om" style="color:var(--gold); margin-right:6px"></i> Sri Kashi Vishwanath Seva Partner</div>
            <div class="marquee-item"><i class="fa-solid fa-seedling" style="color:var(--emerald); margin-right:6px"></i> 100% Certified Organic Samagri</div>
            <div class="marquee-item"><i class="fa-solid fa-award" style="color:var(--saffron); margin-right:6px"></i> Rigveda & Yajurveda Certified Purohits</div>
            <div class="marquee-item"><i class="fa-solid fa-certificate" style="color:var(--gold); margin-right:6px"></i> Digital Family Sankalp & Memory OS</div>
            <div class="marquee-item"><i class="fa-solid fa-hands-praying" style="color:var(--cyan-glow); margin-right:6px"></i> Tactile Japa Beads with Haptics</div>
            <div class="marquee-item"><i class="fa-solid fa-fire-flame-curved" style="color:var(--vermilion); margin-right:6px"></i> Mahakaleshwar Ujjain Seva Partner</div>
            <div class="marquee-item"><i class="fa-solid fa-bolt" style="color:var(--gold); margin-right:6px"></i> Instant Muhurat & Choghadiya Engine</div>
          </div>
        </div>

        <!-- 3. BENTO GRID ARCHITECTURE -->
        <div class="bento-section">
          <div style="margin-bottom:var(--space-4)">
            <div class="eyebrow" style="color:var(--saffron)">Material Architecture 2026</div>
            <h2 class="section-title">Built for Sacred Simplicity</h2>
            <p class="text-muted" style="max-width:600px">Every component engineered to remove cognitive fatigue and coordinate traditional rituals seamlessly.</p>
          </div>

          <div class="bento-grid">
            <div class="glass-card spotlight-card bento-card bento-span-8 tilt-card">
              <div class="bento-card-inner">
                ${renderDailyPanchangCard()}
              </div>
            </div>

            <div class="glass-card spotlight-card bento-card bento-span-4 tilt-card">
              <div class="bento-card-inner">
                <div>
                  <div class="bento-icon-badge"><i class="fa-solid fa-star" style="color:var(--gold)"></i></div>
                  <h3>98.4% Match Accuracy</h3>
                  <p>Pandits vetted across 4 Vedas, Gurukul credentials, background verification, and regional Kul-parampara adherence.</p>
                </div>
                <div style="margin-top:var(--space-4)">
                  <div style="background:var(--bg-surface-alt); padding:10px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:12px">
                    <div class="micro" style="color:var(--emerald); font-weight:700"><i class="fa-solid fa-circle-check"></i> 100% Sanskrit Shloka Verification</div>
                    <div class="micro text-muted">Vedic pronunciation & Gotra compatibility test passed.</div>
                  </div>
                  <button type="button" class="btn btn-sm btn-secondary btn-block md-ripple" onclick="nav('book', 0)">
                    Browse Pandits →
                  </button>
                </div>
              </div>
            </div>

            <div class="glass-card spotlight-card bento-card bento-span-4 tilt-card">
              <div class="bento-card-inner">
                <div>
                  <div class="bento-icon-badge"><i class="fa-solid fa-dharmachakra" style="color:var(--emerald)"></i></div>
                  <h3>108 Japa Mala Counter</h3>
                  <p>Tactile digital prayer beads with real-time mobile haptic vibration and sacred temple bell resonance.</p>
                </div>
                <div style="margin-top:var(--space-4)">
                  <button type="button" class="btn btn-sm btn-primary btn-block md-ripple" onclick="openJapaMalaModal()">
                    <span>Chant Japa (108)</span> <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="glass-card spotlight-card bento-card bento-span-4 tilt-card">
              <div class="bento-card-inner">
                <div>
                  <div class="bento-icon-badge"><i class="fa-solid fa-box-open" style="color:var(--saffron)"></i></div>
                  <h3>Tamper-Proof Samagri</h3>
                  <p>Pure Haridwar Gangajal, Gir Cow A2 Ghee, Bhimseni Camphor, and hand-selected herbal Havan packs.</p>
                </div>
                <div style="margin-top:var(--space-4)">
                  <div class="live-status-pill" style="width:100%; justify-content:center">
                    <i class="fa-solid fa-circle-check" style="margin-right:6px; color:var(--emerald)"></i>
                    <span>18 Certified Vedic Items</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="glass-card spotlight-card bento-card bento-span-4 tilt-card">
              <div class="bento-card-inner">
                <div>
                  <div class="bento-icon-badge"><i class="fa-solid fa-landmark" style="color:var(--gold)"></i></div>
                  <h3>Generational Memory</h3>
                  <p>Never lose your Sankalp dates. Persistent family vault stores member Gotras, birth rashis, and completion proofs.</p>
                </div>
                <div style="margin-top:var(--space-4)">
                  <button type="button" class="btn btn-sm btn-secondary btn-block md-ripple" onclick="nav('family')">
                    Open Family Vault →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. STATS COUNTERS -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card spotlight-card">
              <div class="stat-number gradient-text-saffron" data-target="98.4" data-suffix="%">98.4%</div>
              <div class="stat-label">Pandit Matching Accuracy</div>
            </div>
            <div class="stat-card spotlight-card">
              <div class="stat-number gradient-text-gold" data-target="12500" data-suffix="+">12,500+</div>
              <div class="stat-label">Sacred Rituals Managed</div>
            </div>
            <div class="stat-card spotlight-card">
              <div class="stat-number gradient-text-cyan" data-target="100" data-suffix="%">100%</div>
              <div class="stat-label">Pure Organic Samagri</div>
            </div>
            <div class="stat-card spotlight-card">
              <div class="stat-number gradient-text-saffron" data-target="4.98" data-suffix="★">4.98★</div>
              <div class="stat-label">Devotee Trust Rating</div>
            </div>
          </div>
        </div>

        <!-- 5. AUDIO VISUALIZER STRIP -->
        ${renderAartiVisualizerBar()}

        <!-- 6. POPULAR CEREMONIES -->
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:var(--space-4)">
          <div>
            <div class="eyebrow" style="color:var(--saffron)">Vedic Catalog</div>
            <h2 class="section-title">Popular Home Ceremonies</h2>
            <p class="text-muted">Most requested Vedic rituals in ${Security.escapeHTML(state.user.city)}</p>
          </div>
          <button type="button" class="btn-ghost small md-ripple" onclick="nav('book', 0)" style="font-weight:700">View All (8) →</button>
        </div>

        <div class="grid grid-cols-4" style="margin-bottom:var(--space-7)">
          ${RITUALS_CATALOG.slice(0, 4).map(r => `
            <div class="ritual-card spotlight-card tilt-card md-ripple" onclick="selectRitual('${r.id}')">
              <div>
                <div class="ritual-card-header">
                  <div class="ritual-icon">${r.icon}</div>
                  <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>
                </div>
                <h3>${Security.escapeHTML(r.name)}</h3>
                <p>${Security.escapeHTML(r.shortDesc)}</p>
              </div>
              <div class="ritual-card-footer">
                <span class="price-tag">From ₹${r.priceStart.toLocaleString('en-IN')}</span>
                <span class="micro" style="color:var(--emerald); font-weight:700">${r.duration}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 7. RETENTION LAYER -->
        <div class="page-header" style="margin-bottom:var(--space-4)">
          <div class="eyebrow" style="color:var(--gold)">Retention Layer</div>
          <h2 class="section-title">Your Family Ritual OS</h2>
          <p class="text-muted">Smart proactive reminders and persistent family memory</p>
        </div>

        <div class="grid grid-cols-2" style="margin-bottom:var(--space-8)">
          <div class="glass-card spotlight-card tilt-card" style="background:linear-gradient(135deg, rgba(183, 28, 28, 0.4), rgba(216, 67, 21, 0.25))">
            <div>
              <div class="eyebrow" style="color:var(--gold)"><i class="fa-solid fa-bell"></i> Upcoming Festival</div>
              <h3 style="margin:8px 0; font-size:22px">Navratri begins in 7 days</h3>
              <p style="color:var(--text-secondary); margin-bottom:18px">Book an auspicious Ghatasthapana or Durga Saptashati Havan with Vedic Muhurat timings for the ${Security.escapeHTML(state.family.name)}.</p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="startBookingFlow('griha-pravesh')">
                Explore Pujas
              </button>
              <button type="button" class="btn btn-sm btn-ghost md-ripple" onclick="showToast('Reminder saved to family notifications!')">
                Remind Later
              </button>
            </div>
          </div>

          <div class="glass-card spotlight-card tilt-card">
            <div>
              <div class="eyebrow" style="color:var(--gold)"><i class="fa-solid fa-certificate"></i> Sacred Memory Vault</div>
              <h3 style="margin:8px 0; font-size:22px">Griha Pravesh Record</h3>
              <p class="text-muted" style="margin-bottom:16px">Conducted for your household. Preserved in your family ritual vault with digital Sankalp Patra.</p>
              <div style="display:flex; gap:8px; flex-wrap:wrap">
                <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified Record</span>
                <span class="badge badge-gold"><i class="fa-solid fa-certificate"></i> Digital Sankalp Patra</span>
              </div>
            </div>
            <div style="margin-top:18px; display:flex; justify-content:space-between; align-items:center">
              <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="nav('family')">
                Open Vault
              </button>
              <button type="button" class="btn-ghost small md-ripple" onclick="startBookingFlow('satyanarayan')" style="font-weight:700">
                Rebook Ceremony →
              </button>
            </div>
          </div>
        </div>

        <!-- 8. FOOTER -->
        <footer class="app-footer">
          <div class="footer-grid">
            <div class="footer-col">
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px">
                <img src="logo.png" alt="Aaradhya Logo" class="brand-logo-img" style="width:36px; height:36px">
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
                <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="showToast('Subscribed to Auspicious Muhurat Digest!')">Join</button>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <div>© 2026 Aaradhya Technologies. All sacred traditions respected.</div>
            <div style="display:flex; gap:16px">
              <a href="javascript:void(0)" class="text-muted" onclick="openHelpSupport()">Trust Stack</a>
              <a href="javascript:void(0)" class="text-muted" onclick="openTelemetryDrawer()">Audit Log</a>
              <a href="javascript:void(0)" class="text-muted" onclick="openBackupModal()">Backup</a>
            </div>
          </div>
        </footer>
      </section>
    `;
  }

  // Screen 04: Puja Discovery Screen with Filtering & Search
  function renderDiscoveryScreen() {
    return `
      <section class="screen-view active">
        <div class="page-header">
          <button type="button" class="back-link md-ripple" onclick="nav('home')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
          <h1>Choose a Puja</h1>
          <p class="text-light-green">Discover and book verified Vedic ceremonies for your family</p>
        </div>

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

        <div id="catalogGrid" class="grid grid-cols-3">
          ${RITUALS_CATALOG.map(r => `
            <div class="ritual-card md-ripple" onclick="selectRitual('${r.id}')">
              <div>
                <div class="ritual-card-header">
                  <div class="ritual-icon">${r.icon}</div>
                  <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified Purohit</span>
                </div>
                <h3>${Security.escapeHTML(r.name)}</h3>
                <p>${Security.escapeHTML(r.shortDesc)}</p>
                <div style="margin-top:10px; display:flex; gap:4px; flex-wrap:wrap">
                  <span class="micro badge badge-neutral">${Security.escapeHTML(r.purpose)}</span>
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
    const state = getState();
    const ritual = RITUALS_CATALOG.find(r => r.id === state.draftBooking.ritualId) || RITUALS_CATALOG[0];

    return `
      <section class="screen-view active">
        <div class="page-header">
          <button type="button" class="back-link md-ripple" onclick="nav('book', 0)"><i class="fa-solid fa-arrow-left"></i> Back to All Pujas</button>
          <h1>${Security.escapeHTML(ritual.name)}</h1>
          <p class="text-light-green">${Security.escapeHTML(ritual.shortDesc)}</p>
        </div>

        <div class="grid grid-cols-2" style="margin-bottom:var(--space-6)">
          <div class="card" style="background:linear-gradient(135deg, var(--bg-surface-alt), var(--bg-surface)); border-color:var(--border-glow);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
              <span class="badge badge-gold"><i class="fa-solid fa-certificate"></i> Vedic Authenticity</span>
              <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Doorstep Service</span>
            </div>
            <h2 style="font-size:30px; margin:16px 0 8px">${Security.escapeHTML(ritual.name)}</h2>
            <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:20px">${Security.escapeHTML(ritual.details)}</p>

            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; background:var(--bg-surface-alt); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-glass)">
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
              <button type="button" class="btn btn-primary btn-block md-ripple" onclick="startBookingFlow('${ritual.id}')">
                <span>Choose Package & Date</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div class="card">
            <div class="eyebrow">Trust Stack Assurance</div>
            <h3 style="margin:6px 0 16px">What is included in every Aaradhya booking</h3>

            <ul class="checklist">
              <li>
                <i class="fa-solid fa-circle-check" style="color:var(--emerald); margin-top:3px"></i>
                <span><strong>Verified Purohit:</strong> Background-checked Pandit versed in Shukla/Krishna Yajurveda.</span>
              </li>
              <li>
                <i class="fa-solid fa-circle-check" style="color:var(--emerald); margin-top:3px"></i>
                <span><strong>Muhurat Consultation:</strong> Exact auspicious Choghadiya timing tailored to your family's Gotra.</span>
              </li>
              <li>
                <i class="fa-solid fa-circle-check" style="color:var(--emerald); margin-top:3px"></i>
                <span><strong>Complete Samagri:</strong> 18 unadulterated sacred items including Haridwar Gangajal & Bhimseni Kapoor.</span>
              </li>
              <li>
                <i class="fa-solid fa-circle-check" style="color:var(--emerald); margin-top:3px"></i>
                <span><strong>Ritual Memory Vault:</strong> High-res photo records, digital Sankalp Patra & calendar integration.</span>
              </li>
              <li>
                <i class="fa-solid fa-circle-check" style="color:var(--emerald); margin-top:3px"></i>
                <span><strong>Aaradhya Concierge:</strong> Live coordination assistance from preparation to completion.</span>
              </li>
            </ul>

            <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); padding:12px 16px; border-radius:var(--radius-md); margin-top:20px; font-size:13px; color:var(--emerald)">
              <i class="fa-solid fa-shield-halved" style="margin-right:6px"></i> <strong>Zero negotiation guarantee:</strong> Transparent, all-inclusive pricing with no hidden Dakshina pressure on the day of the ceremony.
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Guided Booking Stepper Container
  function renderBookingStepScreen() {
    const state = getState();
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
        <div class="stepper-header">
          <div class="stepper-title-row">
            <div>
              <span class="eyebrow">Step ${state.bookingStep} of 7</span>
              <h2 style="font-size:20px">${stepTitles[state.bookingStep]}</h2>
            </div>
            <div class="badge badge-verified">
              ${Security.escapeHTML(state.draftBooking.ritualName)}
            </div>
          </div>
          <div class="stepper-progress-track">
            ${[1, 2, 3, 4, 5, 6, 7].map(s => `
              <div class="progress-bar-step ${s < state.bookingStep ? 'done' : s === state.bookingStep ? 'active' : ''}"></div>
            `).join('')}
          </div>
        </div>

        <div class="step-content-container">
          ${renderSpecificBookingStep(state.bookingStep)}
        </div>

        <div class="flow-footer">
          <div>
            <span class="footer-price-label">Estimated Total</span>
            <div class="footer-price-val">₹${state.draftBooking.packagePrice.toLocaleString('en-IN')}</div>
          </div>
          <div class="flow-footer-actions">
            ${state.bookingStep > 1 ? `
              <button type="button" class="btn btn-secondary md-ripple" onclick="prevBookingStep()">Back</button>
            ` : `
              <button type="button" class="btn btn-secondary md-ripple" onclick="nav('detail')">Back</button>
            `}
            <button type="button" class="btn btn-primary md-ripple" onclick="nextBookingStep()" id="stepperContinueBtn">
              <span>${state.bookingStep === 7 ? `Pay ₹${state.draftBooking.packagePrice.toLocaleString('en-IN')}` : 'Continue'}</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function renderSpecificBookingStep(step) {
    const state = getState();
    const ritual = RITUALS_CATALOG.find(r => r.id === state.draftBooking.ritualId) || RITUALS_CATALOG[0];

    switch (step) {
      case 1:
        const essentialPkg = ritual.packages ? ritual.packages.Essential : { price: ritual.priceStart, duration: ritual.duration };
        const premiumPkg = ritual.packages ? ritual.packages.Premium : { price: Math.round(ritual.priceStart * 1.6), duration: '3.5 Hours' };

        return `
          <div class="package-selection-step">
            <div class="page-header" style="margin-bottom:var(--space-3)">
              <h2>Select your ceremony package</h2>
              <p class="text-light-green">All packages include verified Purohits and complete doorstep coordination.</p>
            </div>

            <div class="package-grid">
              <div class="package-card md-ripple ${state.draftBooking.package === 'Essential' ? 'selected' : ''}" onclick="selectPackage('Essential', ${essentialPkg.price})">
                <div>
                  <h3>Essential</h3>
                  <div class="package-price">₹${essentialPkg.price.toLocaleString('en-IN')}</div>
                  <p class="muted small" style="margin-bottom:16px">Standard complete Vedic ceremony ideal for intimate family gatherings.</p>

                  <ul class="checklist">
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>1 Verified Vedic Pandit</span></li>
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>Standard ${Security.escapeHTML(ritual.name)}</span></li>
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>Essential Samagri Included</span></li>
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>Duration: ${essentialPkg.duration}</span></li>
                  </ul>
                </div>
                <div style="margin-top:16px">
                  <button type="button" class="btn btn-sm ${state.draftBooking.package === 'Essential' ? 'btn-primary' : 'btn-secondary'} btn-block md-ripple">
                    ${state.draftBooking.package === 'Essential' ? '✓ Selected' : 'Choose Essential'}
                  </button>
                </div>
              </div>

              <div class="package-card md-ripple ${state.draftBooking.package === 'Premium' ? 'selected' : ''}" onclick="selectPackage('Premium', ${premiumPkg.price})">
                <span class="package-tag">Recommended</span>
                <div>
                  <h3>Premium</h3>
                  <div class="package-price">₹${premiumPkg.price.toLocaleString('en-IN')}</div>
                  <p class="muted small" style="margin-bottom:16px">Comprehensive Vedic ceremony with senior Acharya and extended arrangements.</p>

                  <ul class="checklist">
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>1 Senior Acharya + 1 Sahayak Purohit</span></li>
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>Extended Navagraha & Shanti Havan</span></li>
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>Complete 18-Item Premium Samagri</span></li>
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>Digital Sankalp Patra & Consecrated Prasad</span></li>
                    <li><i class="fa-solid fa-check" style="color:var(--emerald)"></i><span>Duration: ${premiumPkg.duration}</span></li>
                  </ul>
                </div>
                <div style="margin-top:16px">
                  <button type="button" class="btn btn-sm ${state.draftBooking.package === 'Premium' ? 'btn-primary' : 'btn-secondary'} btn-block md-ripple">
                    ${state.draftBooking.package === 'Premium' ? '✓ Selected' : 'Choose Premium'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

      case 2:
        const pCalculated = Panchang.calculatePanchang(new Date('2026-10-18T10:00:00Z'), state.user.city);
        const todayISO = new Date().toISOString().split('T')[0];

        return `
          <div class="muhurat-step">
            <div class="page-header" style="margin-bottom:var(--space-3)">
              <h2>Choose date & auspicious Muhurat</h2>
              <p class="text-light-green">Calculated dynamically through Vedic Panchang for ${Security.escapeHTML(ritual.name)}.</p>
            </div>

            <div class="muhurat-badge-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
                <span class="badge badge-gold"><i class="fa-solid fa-star"></i> Recommended Auspicious Muhurat</span>
                <span class="micro text-light-green">North Indian Panchang</span>
              </div>
              <h3 style="font-size:24px; color:#FFFFFF">18 October 2026 (Sunday)</h3>
              <div style="font-weight:700; font-size:16px; margin:4px 0; color:var(--emerald)">10:00 AM – 12:15 PM</div>
              <p class="muted small" style="margin:6px 0 14px">
                <strong>${pCalculated.tithi} & ${pCalculated.nakshatra}:</strong> Ideal planetary alignment for establishing family longevity and spiritual prosperity.
              </p>
              <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="setSlot('18 October 2026', '10:00 AM – 12:15 PM', 'Shubh Choghadiya & Rohini Nakshatra')">
                Select This Muhurat
              </button>
            </div>

            <h3 style="font-size:18px; margin:20px 0 10px">Alternative Auspicious Slots</h3>
            <div class="grid" style="gap:10px">
              <div class="slot-card md-ripple ${state.draftBooking.date === '19 October 2026' ? 'selected' : ''}" onclick="setSlot('19 October 2026', '08:30 AM – 10:45 AM', 'Amrit Choghadiya')">
                <div>
                  <div style="font-weight:700; color:#FFFFFF">19 October 2026 (Monday)</div>
                  <div class="text-light-green small">08:30 AM – 10:45 AM · Amrit Choghadiya</div>
                </div>
                <span class="badge badge-verified">Auspicious</span>
              </div>

              <div class="slot-card md-ripple ${state.draftBooking.date === '24 October 2026' ? 'selected' : ''}" onclick="setSlot('24 October 2026', '11:15 AM – 01:30 PM', 'Abhijit Muhurat')">
                <div>
                  <div style="font-weight:700; color:#FFFFFF">24 October 2026 (Saturday)</div>
                  <div class="text-light-green small">11:15 AM – 01:30 PM · Abhijit Muhurat</div>
                </div>
                <span class="badge badge-verified">Auspicious</span>
              </div>
            </div>

            <div class="card" style="margin-top:20px; padding:16px">
              <h4 style="font-size:15px; margin-bottom:8px">Have a specific family date from your Kul-Purohit?</h4>
              <div style="display:flex; gap:10px; flex-wrap:wrap">
                <input type="date" class="form-control" style="flex:1" min="${todayISO}" value="2026-10-18" id="customDatePicker" onchange="handleCustomDateChange(this.value)">
                <input type="time" class="form-control" style="width:140px" value="10:00" id="customTimePicker" onchange="handleCustomTimeChange(this.value)">
              </div>
            </div>
          </div>
        `;

      case 3:
        const loc = state.draftBooking.location;
        return `
          <div class="location-step">
            <div class="page-header" style="margin-bottom:var(--space-3)">
              <h2>Where will the Puja happen?</h2>
              <p class="text-light-green">Pandit ji and Samagri will arrive directly at this address.</p>
            </div>

            <div class="grid grid-cols-2">
              <div class="card">
                <div class="form-group">
                  <label class="form-label" for="locHouse">House / Flat / Villa No. *</label>
                  <input type="text" class="form-control" id="locHouse" value="${Security.escapeHTML(loc.house)}" placeholder="e.g. Tower B, Flat 702" required>
                  <span class="invalid-feedback">House or flat number is required.</span>
                </div>

                <div class="form-group">
                  <label class="form-label" for="locAddress">Apartment / Society / Street *</label>
                  <input type="text" class="form-control" id="locAddress" value="${Security.escapeHTML(loc.address)}" placeholder="e.g. Skyline Residency, Sector 62" required>
                  <span class="invalid-feedback">Street or society address is required.</span>
                </div>

                <div class="form-group">
                  <label class="form-label" for="locLandmark">Landmark (Optional)</label>
                  <input type="text" class="form-control" id="locLandmark" value="${Security.escapeHTML(loc.landmark)}" placeholder="e.g. Near Fortis Hospital">
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
                  <div class="form-group">
                    <label class="form-label" for="locCity">City / Region *</label>
                    <input type="text" class="form-control" id="locCity" value="${Security.escapeHTML(loc.city)}" readonly>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="locPincode">Pincode *</label>
                    <input type="text" class="form-control" id="locPincode" value="${Security.escapeHTML(loc.pincode)}" placeholder="6-digit pincode" maxlength="6" required>
                    <span class="invalid-feedback">Enter a valid 6-digit postal code.</span>
                  </div>
                </div>
              </div>

              <div class="card" style="display:flex; flex-direction:column; justify-content:space-between">
                <div>
                  <div class="eyebrow">Service Coverage</div>
                  <h3 style="margin:6px 0 12px">${Security.escapeHTML(loc.city)} Doorstep Hub</h3>
                  <div style="background:var(--bg-surface-alt); height:160px; border-radius:var(--radius-md); border:1px solid var(--border-glass); display:grid; place-items:center; position:relative; overflow:hidden">
                    <div style="text-align:center">
                      <i class="fa-solid fa-location-dot" style="font-size:36px; color:var(--gold)"></i>
                      <div style="font-weight:700; font-size:13px; margin-top:8px; color:#FFFFFF">${Security.escapeHTML(loc.address)}</div>
                      <span class="badge badge-verified micro" style="margin-top:4px"><i class="fa-solid fa-circle-check"></i> Verified Cluster</span>
                    </div>
                  </div>
                </div>
                <div style="margin-top:16px; font-size:13px; color:var(--emerald)">
                  <i class="fa-solid fa-check"></i> Free Pandit travel & certified Samagri delivery included in ${Security.escapeHTML(loc.city)}.
                </div>
              </div>
            </div>
          </div>
        `;

      case 4:
        if (state.isMatchingPandit) {
          return `
            <div class="pandit-matching-scan">
              <div class="scan-orb">ॐ</div>
              <h2 style="font-size:24px; margin-bottom:8px">Finding the right Pandit for you…</h2>
              <p class="small text-light-green" style="margin-bottom:20px">Matching through Vedic lineage, language, location, and verified devotee ratings.</p>

              <div style="max-width:440px; margin:0 auto; background:var(--bg-surface-alt); border:1.5px solid var(--border-glass); padding:16px; border-radius:var(--radius-md); text-align:left">
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border-subtle)">
                  <span class="small text-light-green">Ritual Tradition:</span>
                  <strong>${Security.escapeHTML(state.family.tradition)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border-subtle)">
                  <span class="small text-light-green">Preferred Language:</span>
                  <strong>${Security.escapeHTML(state.family.preferredLanguage)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border-subtle)">
                  <span class="small text-light-green">Service Location:</span>
                  <strong>${Security.escapeHTML(state.draftBooking.location.city)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:6px 0;">
                  <span class="small text-light-green">Vetting Standard:</span>
                  <strong style="color:var(--emerald)">Gurukul Certified Acharya</strong>
                </div>
              </div>
            </div>
          `;
        }

        const pandit = PANDITS_DATABASE.find(p => p.id === state.draftBooking.panditId) || PANDITS_DATABASE[0];

        return `
          <div class="pandit-matched-step">
            <div class="page-header" style="margin-bottom:var(--space-3)">
              <h2>Your Matched Pandit</h2>
              <p class="text-light-green">Based on family tradition, language preference, and location.</p>
            </div>

            <div class="pandit-card matched">
              <div class="pandit-header">
                <div class="pandit-avatar">${pandit.avatarInitials}</div>
                <div class="pandit-meta">
                  <div style="display:flex; align-items:center; gap:8px">
                    <h3>${Security.escapeHTML(pandit.name)}</h3>
                    <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>
                  </div>
                  <div class="pandit-rating">
                    <span>★ ${pandit.rating}</span>
                    <span class="small text-light-green">(${pandit.bookingsCount} Aaradhya ceremonies)</span>
                  </div>
                  <p class="small text-light-green" style="margin-top:2px">${pandit.experience} experience · ${pandit.languages}</p>
                  <div class="pandit-pills">
                    <span class="micro badge badge-neutral">Background Checked</span>
                    <span class="micro badge badge-gold">${Security.escapeHTML(pandit.tradition)}</span>
                  </div>
                </div>
              </div>

              <p style="margin:16px 0; font-size:14px; line-height:1.5; color:var(--text-secondary)">
                ${Security.escapeHTML(pandit.bio)}
              </p>

              <div style="display:flex; gap:10px; flex-wrap:wrap; border-top:1px solid var(--border-subtle); padding-top:16px">
                <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="openPanditProfile('${pandit.id}')">
                  View Full Profile & Reviews
                </button>
                <button type="button" class="btn btn-sm btn-ghost md-ripple" onclick="openSwitchPanditModal()">
                  Choose Another Pandit →
                </button>
              </div>
            </div>
          </div>
        `;

      case 5:
        return `
          <div class="samagri-step">
            <div class="page-header" style="margin-bottom:var(--space-3)">
              <h2>What would you like Aaradhya to handle?</h2>
              <p class="text-light-green">Save hours of market visits with certified unadulterated sacred materials.</p>
            </div>

            <div class="samagri-item-box md-ripple ${state.draftBooking.samagriChoice === 'Complete Samagri' ? 'selected' : ''}" onclick="selectSamagriOption('Complete Samagri')">
              <div style="display:flex; justify-content:space-between; align-items:flex-start">
                <div>
                  <span class="badge badge-gold"><i class="fa-solid fa-star"></i> Recommended</span>
                  <h3 style="font-size:20px; margin:6px 0">Complete Samagri (18 Sacred Items)</h3>
                  <p class="muted small">Pre-packaged, sanctified, and delivered to your doorstep by our team.</p>
                </div>
                <strong style="color:var(--emerald); font-size:16px">Included in Package</strong>
              </div>

              <div class="samagri-checklist-grid">
                ${SAMAGRI_ITEMS.map(cat => `
                  <div>
                    <strong class="micro text-light-green" style="text-transform:uppercase">${cat.category}</strong>
                    <ul style="list-style:none; padding:0; margin-top:4px">
                      ${cat.items.slice(0, 3).map(item => `
                        <li class="samagri-item"><i class="fa-solid fa-check" style="color:var(--emerald); margin-right:4px"></i> ${Security.escapeHTML(item)}</li>
                      `).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
              <button type="button" class="btn-ghost micro md-ripple" style="margin-top:10px; padding:0" onclick="event.stopPropagation(); openAllSamagriModal()">
                View Complete 18-Item Inventory List →
              </button>
            </div>

            <div class="samagri-item-box md-ripple ${state.draftBooking.samagriChoice === 'Self Managed' ? 'selected' : ''}" onclick="selectSamagriOption('Self Managed')">
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
        const b = state.draftBooking;
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
                  <strong>${Security.escapeHTML(b.ritualName)}</strong>
                </div>
                <div class="summary-row">
                  <span class="text-light-green">Package:</span>
                  <strong>${b.package} Package</strong>
                </div>
                <div class="summary-row">
                  <span class="text-light-green">Date & Muhurat:</span>
                  <strong>${Security.escapeHTML(b.date)} · ${Security.escapeHTML(b.time)}</strong>
                </div>
                <div class="summary-row">
                  <span class="text-light-green">Service Location:</span>
                  <strong>${Security.escapeHTML(b.location.house)}, ${Security.escapeHTML(b.location.address)}, ${Security.escapeHTML(b.location.city)}</strong>
                </div>
                <div class="summary-row">
                  <span class="text-light-green">Assigned Pandit:</span>
                  <strong>${Security.escapeHTML(b.panditName)} (Verified)</strong>
                </div>
                <div class="summary-row">
                  <span class="text-light-green">Samagri:</span>
                  <strong>${b.samagriChoice}</strong>
                </div>
              </div>
            </div>

            <div class="card" style="background:var(--bg-surface-alt)">
              <div class="eyebrow">Transparent Pricing</div>
              <h3 style="font-size:18px; margin:6px 0 12px">Price Breakdown</h3>

              <div class="summary-table" style="margin:0">
                <div class="summary-row">
                  <span>${b.package} Ceremony Package</span>
                  <span>₹${b.packagePrice.toLocaleString('en-IN')}</span>
                </div>
                <div class="summary-row">
                  <span>Doorstep Samagri & Logistics</span>
                  <span style="color:var(--emerald)">Included</span>
                </div>
                <div class="summary-row">
                  <span>Pandit Dakshina & Travel</span>
                  <span style="color:var(--emerald)">Included</span>
                </div>
                <div class="summary-row" style="font-size:18px; font-weight:700">
                  <span>Total Escrow Amount</span>
                  <span style="color:var(--emerald)">₹${b.packagePrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style="margin-top:14px; font-size:12px; color:var(--emerald)">
                <i class="fa-solid fa-shield-halved" style="margin-right:4px"></i> <strong>Aaradhya Trust Guarantee:</strong> No cash haggling or on-the-spot price surprises. 100% money-back guarantee if Pandit fails to arrive on time.
              </div>
            </div>
          </div>
        `;

      case 7:
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
                      <strong><i class="fa-solid fa-mobile-screen" style="margin-right:6px"></i> UPI (Google Pay, PhonePe, Paytm)</strong>
                      <div class="micro text-light-green">Fastest & recommended</div>
                    </div>
                    <input type="radio" name="paymethod" value="UPI" checked>
                  </label>

                  <label class="slot-card" style="margin:0">
                    <div>
                      <strong><i class="fa-solid fa-credit-card" style="margin-right:6px"></i> Credit / Debit Card</strong>
                      <div class="micro text-light-green">Visa, MasterCard, RuPay</div>
                    </div>
                    <input type="radio" name="paymethod" value="Card">
                  </label>

                  <label class="slot-card" style="margin:0">
                    <div>
                      <strong><i class="fa-solid fa-building-columns" style="margin-right:6px"></i> Net Banking</strong>
                      <div class="micro text-light-green">HDFC, ICICI, SBI, Axis</div>
                    </div>
                    <input type="radio" name="paymethod" value="NetBanking">
                  </label>
                </div>

                <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:16px; margin-top:16px">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
                    <span class="micro text-light-green">Demo UPI ID</span>
                    <span class="badge badge-verified micro">Escrow Protected</span>
                  </div>
                  <input type="text" class="form-control" value="drishti@okhdfcbank" readonly>
                </div>
              </div>

              <div class="card" style="background:var(--bg-surface-alt); border-color:var(--border-glow); text-align:center; display:flex; flex-direction:column; justify-content:center">
                <div style="font-size:42px; margin-bottom:8px; color:var(--emerald)"><i class="fa-solid fa-shield-halved"></i></div>
                <h3 style="font-size:20px; color:#FFFFFF">100% Sacred Escrow Protection</h3>
                <p class="muted small" style="margin:8px 0 16px">
                  Your funds are held securely in trust. The Purohit is disbursed Dakshina only after you confirm successful ceremony completion.
                </p>
                <div style="font-size:26px; font-weight:700; color:var(--emerald); margin-bottom:12px">
                  ₹${state.draftBooking.packagePrice.toLocaleString('en-IN')}
                </div>
                <span class="badge badge-verified" style="margin:0 auto"><i class="fa-solid fa-circle-check"></i> Aaradhya Verified Escrow</span>
              </div>
            </div>
          </div>
        `;

      default:
        return renderDetailScreen();
    }
  }

  // Screen 12: Confirmation Screen
  function renderConfirmationScreen() {
    const booking = Store.getActiveBooking() || getState().draftBooking;

    return `
      <section class="screen-view active">
        <div class="card" style="text-align:center; padding:var(--space-8) var(--space-5); max-width:680px; margin:0 auto; box-shadow:var(--shadow-ambient); border-color:var(--border-glow);">
          <div style="width:72px; height:72px; border-radius:50%; background:rgba(0, 230, 118, 0.15); color:var(--emerald); border:2px solid var(--emerald); display:grid; place-items:center; font-size:32px; margin:0 auto 16px;">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="eyebrow" style="color:var(--emerald)">Booking Confirmed · ${booking.id || 'AR-2026'}</span>
          <h1 class="display-title" style="font-size:32px; margin:8px 0 12px">Your Puja is Confirmed</h1>
          <p class="text-light-green" style="margin-bottom:24px">
            Aaradhya has reserved your Pandit and initiated Samagri preparation.
          </p>

          <div style="background:var(--bg-surface-alt); border:1.5px solid var(--border-glass); border-radius:var(--radius-lg); padding:20px; text-align:left; margin-bottom:24px">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px">
              <span class="text-light-green small">Ceremony:</span>
              <strong>${Security.escapeHTML(booking.ritualName)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px">
              <span class="text-light-green small">Date & Time:</span>
              <strong>${Security.escapeHTML(booking.date)} · ${Security.escapeHTML(booking.time)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px">
              <span class="text-light-green small">Location:</span>
              <strong>${Security.escapeHTML(booking.location.house)}, ${Security.escapeHTML(booking.location.city)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between">
              <span class="text-light-green small">Assigned Pandit:</span>
              <strong>${Security.escapeHTML(booking.panditName)}</strong>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; text-align:left; margin-bottom:28px">
            <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); padding:12px; border-radius:var(--radius-md)">
              <span class="micro text-light-green">Purohit Status</span>
              <div style="color:var(--emerald); font-weight:700"><i class="fa-solid fa-circle-check"></i> Pandit Confirmed</div>
            </div>
            <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); padding:12px; border-radius:var(--radius-md)">
              <span class="micro text-light-green">Logistics Status</span>
              <div style="color:var(--gold); font-weight:700"><i class="fa-solid fa-box"></i> Samagri Preparing</div>
            </div>
          </div>

          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap">
            <button type="button" class="btn btn-primary md-ripple" onclick="nav('tracking')">
              <span>Track Live Booking</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button type="button" class="btn btn-secondary md-ripple" onclick="handleCalendarDownload('${booking.id}')">
              <i class="fa-solid fa-calendar-plus"></i> Add to Calendar (.ics)
            </button>
            <button type="button" class="btn btn-ghost md-ripple" onclick="nav('home')">
              Back to Home
            </button>
          </div>
        </div>
      </section>
    `;
  }

  // Screen 13: Booking Tracking Screen
  function renderTrackingScreen() {
    const booking = Store.getActiveBooking();
    if (!booking) {
      return `
        <section class="screen-view active">
          <div class="card" style="text-align:center; padding:40px">
            <h2>No Active Booking</h2>
            <p class="text-muted">You do not have any active ceremony to track.</p>
            <button type="button" class="btn btn-primary md-ripple" style="margin-top:16px" onclick="nav('book', 0)">Book a Ceremony</button>
          </div>
        </section>
      `;
    }

    const trackingSteps = [
      { title: 'Booking Confirmed', desc: 'Slot locked with Vedic Muhurat', key: 'Confirmed' },
      { title: 'Pandit Assigned', desc: 'Pandit confirmed slot availability', key: 'Pandit Assigned' },
      { title: 'Samagri Preparing', desc: '18 items packed and sanctified in Hub', key: 'Samagri Preparing' },
      { title: 'Pandit is on the way', desc: 'ETA: 25 mins · Traditional attire & sacred utensils', key: 'On The Way' },
      { title: 'Pandit has arrived', desc: 'Purohit at your doorstep for ritual setup', key: 'Arrived' },
      { title: 'Puja Completed', desc: 'Sankalp fulfilled & prasad distributed', key: 'Completed' }
    ];

    const statusOrder = ['Confirmed', 'Pandit Assigned', 'Samagri Preparing', 'On The Way', 'Arrived', 'Completed'];
    const currentIndex = statusOrder.indexOf(booking.status);

    return `
      <section class="screen-view active">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start">
          <div>
            <button type="button" class="back-link md-ripple" onclick="nav('bookings')"><i class="fa-solid fa-arrow-left"></i> Back to Bookings</button>
            <h1>Track Your Ritual</h1>
            <p class="text-light-green">Operational visibility for ${Security.escapeHTML(booking.ritualName)} (${booking.id})</p>
          </div>
          <span class="badge badge-verified">Status: ${booking.status}</span>
        </div>

        <div class="grid grid-cols-2">
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

            <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:16px; margin-top:20px; display:flex; justify-content:space-between; align-items:center">
              <div>
                <strong style="font-size:13px; color:#FFFFFF">Lifecycle Simulator</strong>
                <div class="micro text-light-green">Advance operational status to completion</div>
              </div>
              <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="advanceBookingStatus()">
                Advance Status <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:var(--space-4)">
            <div class="card">
              <div class="eyebrow">Assigned Purohit</div>
              <div style="display:flex; gap:16px; align-items:center; margin:12px 0">
                <div class="pandit-avatar">RS</div>
                <div>
                  <h3 style="font-size:18px">${Security.escapeHTML(booking.panditName)}</h3>
                  <div class="small text-light-green">★ 4.98 · Verified Acharya</div>
                  <div class="micro" style="color:var(--emerald); font-weight:600">Locked for ${Security.escapeHTML(booking.date)}</div>
                </div>
              </div>
              <div style="display:flex; gap:10px">
                <button type="button" class="btn btn-sm btn-secondary md-ripple" style="flex:1" onclick="showToast('Connecting call to Pandit Ji...')">
                  <i class="fa-solid fa-phone"></i> Call Pandit
                </button>
                <button type="button" class="btn btn-sm btn-secondary md-ripple" style="flex:1" onclick="showToast('WhatsApp concierge chat opened with Pandit Ji.')">
                  <i class="fa-brands fa-whatsapp" style="color:#25D366"></i> WhatsApp
                </button>
              </div>
            </div>

            <div class="card">
              <div class="eyebrow">Booking Management</div>
              <h3 style="font-size:18px; margin:6px 0">Change or Cancel</h3>
              <p class="muted small" style="margin-bottom:14px">Need to adjust timings or cancel? 100% escrow refund guaranteed up to 12h prior.</p>
              <div style="display:flex; gap:10px">
                <button type="button" class="btn btn-sm btn-secondary md-ripple" style="flex:1" onclick="openRescheduleModal('${booking.id}')">
                  <i class="fa-solid fa-calendar-days"></i> Reschedule
                </button>
                <button type="button" class="btn btn-sm btn-secondary md-ripple" style="flex:1; border-color:var(--vermilion); color:#FF8A80" onclick="openCancelModal('${booking.id}')">
                  <i class="fa-solid fa-ban"></i> Cancel Booking
                </button>
              </div>
            </div>

            <div class="card">
              <div class="eyebrow">Aaradhya Trust Concierge</div>
              <h3 style="font-size:18px; margin:6px 0">24×7 Devotional Support</h3>
              <p class="muted small" style="margin-bottom:14px">Assistance with flower requirements, special havan samagri, or family Gotra questions.</p>
              <button type="button" class="btn btn-sm btn-secondary btn-block md-ripple" onclick="openHelpSupport()">
                <i class="fa-solid fa-comments"></i> Chat with Concierge
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function advanceBookingStatus() {
    const booking = Store.getActiveBooking();
    if (!booking) return;
    const updated = Store.advanceBookingStatus(booking.id);
    if (!updated) return;

    if (updated.status === 'Completed') {
      showToast('Puja completed! View ritual memory & completion proof.');
      Audio.playTempleBell();
      setTimeout(() => {
        nav('completion');
      }, 500);
    } else {
      showToast(`Status updated to: ${updated.status}`);
    }
  }

  // Screen 14: Completion Screen
  function renderCompletionScreen() {
    const booking = Store.getActiveBooking() || getState().draftBooking;
    const family = getState().family;

    return `
      <section class="screen-view active">
        <div class="card" style="background:linear-gradient(135deg, var(--bg-surface-alt), var(--bg-surface)); border:1.5px solid var(--border-glow); padding:var(--space-6); text-align:center; margin-bottom:var(--space-5)">
          <div style="font-size:42px; margin-bottom:8px">🪔</div>
          <span class="eyebrow" style="color:var(--gold)">Ceremony Concluded</span>
          <h1 class="display-title" style="font-size:32px; margin:6px 0 10px">Puja Completed with Divine Grace</h1>
          <p class="text-light-green" style="max-width:540px; margin:0 auto 20px">
            Sankalp successfully recited for <strong>${Security.escapeHTML(family.name)}</strong> by <strong>${Security.escapeHTML(booking.panditName)}</strong>. May peace, health, and prosperity abide in your home.
          </p>

          <div class="certificate-banner">
            <div class="eyebrow" style="color:var(--gold)"><i class="fa-solid fa-award"></i> Official Aaradhya Record</div>
            <h2 style="font-family:var(--font-serif); font-size:26px; margin:8px 0; color:#FFFFFF">Digital Sankalp Patra</h2>
            <p class="small text-light-green" style="max-width:480px; margin:0 auto 16px">
              "ॐ अद्य श्री गृहे वास्तु शांति संकल्पः विधिपूर्वक संपन्नः..."<br>
              Verified by Kashi Vidvat Parishad standards · Dated ${Security.escapeHTML(booking.date)}
            </p>
            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap">
              <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="openCertificateModal('${booking.id}')">
                <i class="fa-solid fa-certificate"></i> View Official Certificate
              </button>
              <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="handleCertificatePrint('${booking.id}')">
                <i class="fa-solid fa-print"></i> Print / Save PDF
              </button>
              <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="openReviewModal('${booking.id}')">
                <i class="fa-solid fa-star" style="color:var(--gold)"></i> Rate & Review Pandit
              </button>
            </div>
          </div>

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

          <div style="display:flex; gap:12px; justify-content:center; margin-top:24px; flex-wrap:wrap">
            <button type="button" class="btn btn-primary md-ripple" onclick="nav('family')">
              <span>View Family Ritual History</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button type="button" class="btn btn-secondary md-ripple" onclick="nav('seva')">
              <span>Continue Temple Seva →</span>
            </button>
            <button type="button" class="btn btn-secondary md-ripple" onclick="nav('book', 0)">
              Book Another Ritual
            </button>
          </div>
        </div>
      </section>
    `;
  }

  // Screen 15: Family Profile Screen
  function renderFamilyScreen() {
    const state = getState();
    const fam = state.family;

    return `
      <section class="screen-view active">
        <div class="page-header">
          <button type="button" class="back-link md-ripple" onclick="nav('home')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
          <h1>My Family</h1>
          <p class="text-light-green">The persistent ritual memory layer for your household</p>
        </div>

        <div class="family-header-card">
          <div class="family-avatar-large">${fam.name.charAt(0)}</div>
          <div style="flex:1">
            <div style="display:flex; align-items:center; gap:8px">
              <h2 style="font-size:24px; margin:0">${Security.escapeHTML(fam.name)}</h2>
              <span class="badge badge-gold">Gotra: ${Security.escapeHTML(fam.gotra)}</span>
            </div>
            <p class="small text-light-green" style="margin-top:4px">
              Tradition: <strong style="color:#FFFFFF">${Security.escapeHTML(fam.tradition)}</strong> · Preferred Language: <strong style="color:#FFFFFF">${Security.escapeHTML(fam.preferredLanguage)}</strong>
            </p>
          </div>
          <div style="display:flex; gap:8px">
            <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="openAddMemberModal()">
              <i class="fa-solid fa-user-plus"></i> Add Member
            </button>
            <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="openEditFamilyModal()">
              <i class="fa-solid fa-pen"></i> Edit Family
            </button>
          </div>
        </div>

        <div class="page-header" style="margin-bottom:var(--space-3)">
          <h3 class="section-title">Family Members (${fam.members.length})</h3>
        </div>
        <div class="grid grid-cols-4" style="margin-bottom:var(--space-6)">
          ${fam.members.map(m => `
            <div class="member-card">
              <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start">
                <div class="member-icon">${m.avatar}</div>
                <button type="button" class="btn-ghost micro md-ripple" style="color:#FF8A80; padding:4px" onclick="confirmDeleteMember('${m.id}', '${Security.escapeHTML(m.name)}')" title="Remove member">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
              <strong style="font-size:16px; color:#FFFFFF">${Security.escapeHTML(m.name)}</strong>
              <div class="micro text-light-green" style="margin:2px 0 6px">${Security.escapeHTML(m.role)}</div>
              <span class="badge badge-neutral micro">${m.rashi} · ${m.nakshatra}</span>
            </div>
          `).join('')}
        </div>

        <div class="card" style="margin-bottom:var(--space-6); display:flex; justify-content:space-between; align-items:center">
          <div style="display:flex; gap:14px; align-items:center">
            <div class="pandit-avatar" style="width:54px; height:54px; font-size:20px">RS</div>
            <div>
              <div class="eyebrow" style="color:var(--gold)">Preferred Family Purohit</div>
              <strong style="font-size:17px; color:#FFFFFF">${Security.escapeHTML(fam.preferredPandit)}</strong>
              <p class="small text-light-green">Verified Purohit for ${Security.escapeHTML(fam.name)}</p>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="startBookingFlow('satyanarayan')">
            <i class="fa-solid fa-bolt"></i> 1-Click Rebook
          </button>
        </div>

        <div class="page-header" style="margin-bottom:var(--space-3)">
          <h3 class="section-title">Ritual History</h3>
          <p class="small text-light-green">Every sacred ceremony recorded with photos, purohit, and sankalp</p>
        </div>
        <div class="card">
          <div class="tracking-timeline" style="margin:8px 0">
            ${fam.history.map(h => `
              <div class="timeline-node done">
                <div style="display:flex; justify-content:space-between; align-items:baseline">
                  <h4>${Security.escapeHTML(h.ritual)} (${Security.escapeHTML(h.package)} Package)</h4>
                  <span class="micro text-light-green">${Security.escapeHTML(h.date)}</span>
                </div>
                <p>${Security.escapeHTML(h.location)} · Conducted by ${Security.escapeHTML(h.pandit)}</p>
                <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap">
                  <span class="badge badge-verified micro">★ ${h.rating || 5}.0 Rating</span>
                  <span class="badge badge-gold micro">${Security.escapeHTML(h.sankalp)}</span>
                </div>
                ${h.review ? `<p class="micro text-muted" style="margin-top:4px">Devotee Review: "${Security.escapeHTML(h.review)}"</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // Screen: Bookings Screen
  function renderBookingsScreen() {
    const state = getState();
    const allBookings = state.bookings || [];
    const activeBookings = allBookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled');
    const pastBookings = allBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

    return `
      <section class="screen-view active">
        <div class="page-header">
          <button type="button" class="back-link md-ripple" onclick="nav('home')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
          <h1>My Bookings</h1>
          <p class="text-light-green">Active ceremony tracking and past ritual records</p>
        </div>

        <div class="page-header" style="margin-bottom:var(--space-3)">
          <h3 class="section-title">Active Ceremonies (${activeBookings.length})</h3>
        </div>

        ${activeBookings.length === 0 ? `
          <div class="card" style="text-align:center; padding:32px; margin-bottom:var(--space-6)">
            <p class="text-muted">No ceremonies currently in progress.</p>
            <button type="button" class="btn btn-sm btn-primary md-ripple" style="margin-top:10px" onclick="nav('book', 0)">Book a Puja</button>
          </div>
        ` : activeBookings.map(b => `
          <div class="card" style="border-left:4px solid var(--gold); margin-bottom:var(--space-4)">
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
              <div>
                <span class="badge badge-verified">● Live Status: ${b.status}</span>
                <span class="badge badge-gold" style="margin-left:6px">${Security.escapeHTML(b.package)} Package</span>
              </div>
              <div class="price-tag">₹${b.packagePrice.toLocaleString('en-IN')}</div>
            </div>

            <h2 style="font-size:22px; margin:12px 0 6px">${Security.escapeHTML(b.ritualName)}</h2>
            <p class="small text-light-green" style="margin-bottom:14px">
              📅 ${Security.escapeHTML(b.date)} · ${Security.escapeHTML(b.time)}<br>
              📍 ${Security.escapeHTML(b.location.house)}, ${Security.escapeHTML(b.location.city)}
            </p>

            <div style="display:flex; gap:10px; flex-wrap:wrap">
              <button type="button" class="btn btn-primary md-ripple" onclick="Store.state.currentActiveBookingId='${b.id}'; nav('tracking')">
                Track Live Timeline
              </button>
              <button type="button" class="btn btn-secondary md-ripple" onclick="openRescheduleModal('${b.id}')">
                <i class="fa-solid fa-calendar-days"></i> Reschedule
              </button>
              <button type="button" class="btn btn-secondary md-ripple" style="border-color:var(--vermilion); color:#FF8A80" onclick="openCancelModal('${b.id}')">
                <i class="fa-solid fa-ban"></i> Cancel
              </button>
            </div>
          </div>
        `).join('')}

        <div class="page-header" style="margin-bottom:var(--space-3); margin-top:var(--space-6)">
          <h3 class="section-title">Past Ceremonies (${pastBookings.length})</h3>
        </div>

        <div class="grid" style="gap:12px">
          ${pastBookings.map(b => `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:16px">
              <div>
                <div style="display:flex; align-items:center; gap:8px">
                  <strong style="font-size:16px; color:#FFFFFF">${Security.escapeHTML(b.ritualName)}</strong>
                  <span class="badge ${b.status === 'Completed' ? 'badge-verified' : 'badge-neutral'} micro">${b.status}</span>
                </div>
                <p class="small text-light-green">${Security.escapeHTML(b.date)} · Conducted by ${Security.escapeHTML(b.panditName)}</p>
                ${b.status === 'Cancelled' ? `<div class="micro" style="color:var(--vermilion); margin-top:2px">Refund: ₹${b.refundAmount ? b.refundAmount.toLocaleString('en-IN') : b.packagePrice.toLocaleString('en-IN')} (100% Escrow Refunded)</div>` : ''}
              </div>
              <div style="display:flex; gap:8px">
                ${b.status === 'Completed' ? `
                  <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="openCertificateModal('${b.id}')">
                    Certificate
                  </button>
                  <button type="button" class="btn btn-sm btn-ghost md-ripple" onclick="openReviewModal('${b.id}')">
                    Review
                  </button>
                ` : ''}
                <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="startBookingFlow('${b.ritualId}')">
                  Rebook
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // Screen 30: Profile Screen
  function renderProfileScreen() {
    const state = getState();
    const u = state.user;

    const profileOptions = [
      { title: 'Family Ritual OS', desc: 'Gotra, members, and ritual memory layer', view: 'family', icon: 'fa-solid fa-people-roof' },
      { title: 'My Bookings', desc: 'Active ceremonies and historical records', view: 'bookings', icon: 'fa-solid fa-calendar-check' },
      { title: 'Temple Seva History', desc: 'Offerings, receipts & sankalp proofs', view: 'seva', icon: 'fa-solid fa-hands-praying' },
      { title: 'Vedic Kundli & Janampatri', desc: 'Astrological planetary chart generator', view: 'kundli', icon: 'fa-solid fa-dharmachakra' },
      { title: 'Data Backup & Export (JSON)', desc: 'Download complete offline ritual archive', action: () => openBackupModal(), icon: 'fa-solid fa-database' },
      { title: 'System Audit Log & Telemetry', desc: 'Inspect state transitions and system observability', action: () => openTelemetryDrawer(), icon: 'fa-solid fa-chart-line' }
    ];

    return `
      <section class="screen-view active">
        <div class="page-header">
          <button type="button" class="back-link md-ripple" onclick="nav('home')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
          <h1>My Aaradhya</h1>
          <p class="text-light-green">Account details, preferences, and ritual support</p>
        </div>

        <div class="card" style="display:flex; gap:16px; align-items:center; margin-bottom:var(--space-6)">
          <div class="family-avatar-large" style="width:64px; height:64px; font-size:26px">${u.name.charAt(0)}</div>
          <div style="flex:1">
            <h2 style="font-size:22px; margin:0">${Security.escapeHTML(u.name)}</h2>
            <p class="small text-light-green" style="margin-top:2px">${Security.escapeHTML(u.phone)} · ${Security.escapeHTML(u.city)}</p>
            <div style="display:flex; gap:6px; margin-top:6px">
              <span class="badge badge-gold micro">${Security.escapeHTML(state.family.gotra)} Gotra</span>
              <span class="badge badge-verified micro">${Security.escapeHTML(u.language)} Preference</span>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="openEditProfileModal()">
            <i class="fa-solid fa-user-pen"></i> Edit Profile
          </button>
        </div>

        <div class="grid grid-cols-2" style="margin-bottom:var(--space-6)">
          ${profileOptions.map(opt => `
            <div class="card card-clickable md-ripple" onclick="${opt.view ? `nav('${opt.view}')` : `(${opt.action.toString()})()`}">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px">
                <i class="${opt.icon}" style="color:var(--gold); font-size:16px"></i>
                <strong style="font-size:16px; color:#FFFFFF">${opt.title}</strong>
              </div>
              <p class="small text-light-green">${opt.desc}</p>
            </div>
          `).join('')}
        </div>

        <div style="background:var(--bg-surface-alt); border:1px dashed var(--border-glass); border-radius:var(--radius-md); padding:16px; font-size:12px; color:var(--emerald); text-align:center">
          Aaradhya Material 3 Edition · LocalStorage Persistent · Font Awesome 6 · Zero External Runtime Dependencies.
        </div>
      </section>
    `;
  }

  // Screen 28: Temple Seva Screen
  function renderSevaScreen() {
    const state = getState();

    return `
      <section class="screen-view active">
        <div class="page-header">
          <button type="button" class="back-link md-ripple" onclick="nav('home')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
          <h1>Continue Your Seva</h1>
          <p class="text-light-green">Offer Seva at a verified sacred temple through Aaradhya</p>
        </div>

        <div class="home-hero" style="margin-bottom:var(--space-6)">
          <div class="home-hero-content">
            <div class="eyebrow" style="color:var(--gold)"><i class="fa-solid fa-hands-praying"></i> Post-Ritual Continuation</div>
            <h2 class="display-title" style="font-size:32px">Keep the sacred connection going.</h2>
            <p>
              Offer Seva at revered ancient temples in the name of your family and receive consecrated prasad alongside a digital acknowledgement of your Sankalp.
            </p>
          </div>
        </div>

        <div class="page-header" style="margin-bottom:var(--space-3)">
          <h3 class="section-title">Verified Temple Shrines</h3>
        </div>
        <div class="grid grid-cols-3" style="margin-bottom:var(--space-6)">
          ${TEMPLES_CATALOG.map(temple => `
            <div class="card">
              <div class="eyebrow">${temple.location}</div>
              <h3 style="font-size:18px; margin:6px 0">${temple.name}</h3>
              <p class="small text-light-green">${temple.description}</p>
            </div>
          `).join('')}
        </div>

        <div class="card" style="margin-bottom:var(--space-6)">
          <div class="eyebrow">Sacred Dakshina</div>
          <h3 style="margin:6px 0 16px">Choose an Offering Amount</h3>

          <div class="grid grid-cols-4" style="gap:10px; margin-bottom:16px">
            ${['₹101', '₹501', '₹1,001', '₹2,100'].map(amt => `
              <button type="button" class="slot-card md-ripple" style="flex-direction:column; padding:16px 8px; text-align:center" onclick="openSevaModal('${amt}')">
                <strong style="font-size:24px; color:var(--emerald)">${amt}</strong>
                <span class="micro text-light-green" style="margin-top:4px">Temple Seva</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="page-header" style="margin-bottom:var(--space-3)">
          <h3 class="section-title">Your Seva Records (${state.sevaOfferings.length})</h3>
        </div>
        <div class="grid" style="gap:10px">
          ${state.sevaOfferings.map(s => `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:14px">
              <div>
                <strong>${Security.escapeHTML(s.title)} · ${Security.escapeHTML(s.amount)}</strong>
                <p class="small text-light-green">${Security.escapeHTML(s.temple)} · ${s.date} (Receipt: ${s.id})</p>
              </div>
              <span class="badge badge-verified micro"><i class="fa-solid fa-circle-check"></i> Sankalp Recorded</span>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // Screen 29: Astrology / Kundli Utility
  function renderKundliScreen() {
    const state = getState();
    const p = Panchang.calculatePanchang(new Date(), state.user.city);

    return `
      <section class="screen-view active">
        <div class="page-header">
          <button type="button" class="back-link md-ripple" onclick="nav('home')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
          <h1>Vedic Kundli & Muhurat</h1>
          <p class="text-light-green">Astrological insights for the family calculated using Lahiri Ayanamsha</p>
        </div>

        <div class="grid grid-cols-2">
          <div class="card">
            <div class="eyebrow">Vedic Birth Chart</div>
            <h3 style="margin:6px 0 16px">Generate Family Kundli</h3>

            <div class="form-group">
              <label class="form-label" for="kundliName">Full Name</label>
              <input type="text" class="form-control" id="kundliName" value="${Security.escapeHTML(state.user.name)}">
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div class="form-group">
                <label class="form-label" for="kundliDob">Date of Birth</label>
                <input type="date" class="form-control" id="kundliDob" value="1995-08-15">
              </div>
              <div class="form-group">
                <label class="form-label" for="kundliTime">Birth Time</label>
                <input type="time" class="form-control" id="kundliTime" value="10:30">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="kundliPlace">Place of Birth</label>
              <input type="text" class="form-control" id="kundliPlace" value="New Delhi">
            </div>

            <button type="button" class="btn btn-primary btn-block md-ripple" onclick="generateKundliResult()">
              Calculate Vedic Insights
            </button>
          </div>

          <div class="card" style="background:var(--bg-surface-alt)">
            <div class="eyebrow">Daily Panchang</div>
            <h3 style="margin:6px 0 12px">Today's Planetary Auspiciousness</h3>

            <div class="summary-table">
              <div class="summary-row">
                <span class="text-light-green">Tithi:</span>
                <strong>${p.tithi}</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Nakshatra:</span>
                <strong>${p.nakshatra}</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Abhijit Muhurat:</span>
                <strong style="color:var(--emerald)">${p.abhijitMuhurat}</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Rahu Kaal (Avoid):</span>
                <strong style="color:var(--vermilion)">${p.rahuKaal}</strong>
              </div>
              <div class="summary-row">
                <span class="text-light-green">Favorable Deity:</span>
                <strong>${p.favorableDeity}</strong>
              </div>
            </div>

            <div style="margin-top:16px">
              <button type="button" class="btn btn-sm btn-secondary btn-block md-ripple" onclick="startBookingFlow('griha-pravesh')">
                Plan Puja for Auspicious Date →
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================================================
  // Modals & Interactive Dialog Controllers
  // ==========================================================================

  function openCertificateModal(bookingId) {
    const booking = Store.getBookingById(bookingId) || Store.getActiveBooking();
    const html = Certificate.renderSankalpCertificateHTML(booking, getState().family);

    openModal(`
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px">
          <div>
            <h3 style="font-size:20px; margin:0">Digital Sankalp Patra</h3>
            <span class="micro text-light-green">Official Aaradhya Record · Verified</span>
          </div>
          <div style="display:flex; gap:8px">
            <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="handleCertificatePrint('${bookingId}')">
              <i class="fa-solid fa-print"></i> Print Certificate
            </button>
          </div>
        </div>
        ${html}
      </div>
    `);
  }

  function handleCertificatePrint(bookingId) {
    Certificate.printCertificate();
  }

  function handleCalendarDownload(bookingId) {
    const booking = Store.getBookingById(bookingId) || Store.getActiveBooking();
    Certificate.downloadCalendarInvite(booking, getState().family);
    showToast('Ceremony synced! (.ics calendar event downloaded)');
  }

  function openReviewModal(bookingId) {
    const booking = Store.getBookingById(bookingId) || Store.getActiveBooking();
    openModal(`
      <div>
        <div class="eyebrow" style="color:var(--gold)">Devotee Feedback</div>
        <h3 style="font-size:22px; margin:4px 0 8px">Rate Your Ceremony</h3>
        <p class="small text-light-green" style="margin-bottom:16px">
          Share your experience with <strong>${Security.escapeHTML(booking.panditName)}</strong> for <strong>${Security.escapeHTML(booking.ritualName)}</strong>.
        </p>

        <div class="form-group">
          <label class="form-label">Devotee Rating</label>
          <div class="star-rating-picker" id="reviewStarPicker">
            ${[1, 2, 3, 4, 5].map(star => `
              <span class="star-item active" onclick="setReviewRating(${star})" data-star="${star}">★</span>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="reviewComment">Ceremony Comments & Mantras Feedback</label>
          <textarea class="form-control" id="reviewComment" rows="4" placeholder="How was Pandit Ji's conduct, punctuality, and Vedic mantra explanation?"></textarea>
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="submitReviewAction('${booking.id}')">
          Submit Verified Devotee Review
        </button>
      </div>
    `);
  }

  function setReviewRating(star) {
    window.currentReviewRating = star;
    const items = document.querySelectorAll('#reviewStarPicker .star-item');
    items.forEach((item, idx) => {
      if (idx < star) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  function submitReviewAction(bookingId) {
    const rating = window.currentReviewRating || 5;
    const commentEl = document.getElementById('reviewComment');
    const comment = commentEl ? commentEl.value : '';

    Store.submitReview(bookingId, rating, comment, getState().family.name);
    closeModal();
    showToast('Thank you! Your verified devotee review has been recorded.');
  }

  function openCancelModal(bookingId) {
    const booking = Store.getBookingById(bookingId);
    if (!booking) return;

    openModal(`
      <div>
        <div class="eyebrow" style="color:var(--vermilion)">Cancellation & Escrow Refund</div>
        <h3 style="font-size:22px; margin:4px 0 12px">Cancel Booking ${booking.id}?</h3>
        <p class="small text-light-green" style="margin-bottom:16px">
          Ceremony: <strong>${Security.escapeHTML(booking.ritualName)}</strong> scheduled for <strong>${Security.escapeHTML(booking.date)}</strong>.
        </p>

        <div class="card" style="background:var(--bg-surface-alt); border-color:var(--vermilion); margin-bottom:16px; padding:14px">
          <div style="font-size:13px; color:#FFFFFF"><strong>Aaradhya Trust Escrow Refund:</strong></div>
          <div style="font-size:22px; font-weight:700; color:var(--emerald); margin:4px 0">
            ₹${booking.packagePrice.toLocaleString('en-IN')} (100% Full Refund)
          </div>
          <div class="micro text-light-green">Refund will be processed instantly to your original payment method.</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="cancelReason">Reason for Cancellation</label>
          <select class="form-control" id="cancelReason">
            <option>Family travel schedule changed</option>
            <option>Change of Muhurat date required</option>
            <option>Personal unavoidable circumstances</option>
            <option>Other</option>
          </select>
        </div>

        <div style="display:flex; gap:10px">
          <button type="button" class="btn btn-secondary md-ripple" style="flex:1" onclick="closeModal()">
            Keep Booking
          </button>
          <button type="button" class="btn btn-primary md-ripple" style="flex:1; background:var(--vermilion)" onclick="confirmCancellationAction('${booking.id}')">
            Confirm Cancellation
          </button>
        </div>
      </div>
    `);
  }

  function confirmCancellationAction(bookingId) {
    const reasonEl = document.getElementById('cancelReason');
    const reason = reasonEl ? reasonEl.value : 'Devotee requested cancellation';
    Store.cancelBooking(bookingId, reason);
    closeModal();
    showToast('Booking cancelled. 100% Escrow refund initiated.');
  }

  function openRescheduleModal(bookingId) {
    const booking = Store.getBookingById(bookingId);
    if (!booking) return;

    openModal(`
      <div>
        <div class="eyebrow" style="color:var(--gold)">Vedic Muhurat Adjustment</div>
        <h3 style="font-size:22px; margin:4px 0 12px">Reschedule ${Security.escapeHTML(booking.ritualName)}</h3>
        <p class="small text-light-green" style="margin-bottom:16px">Choose a new date and auspicious timing window.</p>

        <div class="form-group">
          <label class="form-label" for="rescheduleDate">New Ceremony Date</label>
          <input type="date" class="form-control" id="rescheduleDate" min="${new Date().toISOString().split('T')[0]}" value="2026-10-24">
        </div>

        <div class="form-group">
          <label class="form-label" for="rescheduleTime">New Auspicious Window</label>
          <select class="form-control" id="rescheduleTime">
            <option value="10:00 AM – 12:15 PM|Shubh Choghadiya">10:00 AM – 12:15 PM (Shubh Choghadiya)</option>
            <option value="08:30 AM – 10:45 AM|Amrit Choghadiya">08:30 AM – 10:45 AM (Amrit Choghadiya)</option>
            <option value="11:45 AM – 01:00 PM|Abhijit Muhurat">11:45 AM – 01:00 PM (Abhijit Muhurat)</option>
          </select>
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="confirmRescheduleAction('${booking.id}')">
          Lock New Date & Muhurat
        </button>
      </div>
    `);
  }

  function confirmRescheduleAction(bookingId) {
    const dateInput = document.getElementById('rescheduleDate').value;
    const timeOption = document.getElementById('rescheduleTime').value.split('|');
    const time = timeOption[0];
    const muhurat = timeOption[1];

    if (!dateInput) {
      showToast('Please select a valid new date.');
      return;
    }

    Store.rescheduleBooking(bookingId, dateInput, time, muhurat);
    closeModal();
    showToast(`Booking rescheduled to ${dateInput} (${time})`);
  }

  function openAddMemberModal() {
    openModal(`
      <div>
        <h3 style="font-size:20px; margin-bottom:4px">Add Family Member</h3>
        <p class="small text-light-green" style="margin-bottom:16px">Details used for personalized ritual reminders and Gotra sankalp.</p>

        <div class="form-group">
          <label class="form-label" for="newMemberName">Full Name *</label>
          <input type="text" class="form-control" id="newMemberName" placeholder="e.g. Aarav" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="newMemberRole">Relationship</label>
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
          <label class="form-label" for="newMemberRashi">Rashi (Zodiac)</label>
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

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="saveNewFamilyMember()">
          Save to Family Ritual OS
        </button>
      </div>
    `);
  }

  function saveNewFamilyMember() {
    const nameEl = document.getElementById('newMemberName');
    const roleEl = document.getElementById('newMemberRole');
    const rashiEl = document.getElementById('newMemberRashi');

    const name = nameEl ? nameEl.value.trim() : '';
    if (!name || name.length < 2) {
      showToast('Please enter a valid member name (at least 2 characters).');
      return;
    }

    Store.addFamilyMember({
      name: name,
      role: roleEl ? roleEl.value : 'Family Member',
      avatar: '🧒',
      rashi: rashiEl ? rashiEl.value.split(' ')[0] : 'Aries',
      nakshatra: 'Ashwini'
    });

    closeModal();
    showToast(`${name} added to Family OS!`);
  }

  function confirmDeleteMember(memberId, memberName) {
    if (confirm(`Remove ${memberName} from Family Ritual OS?`)) {
      Store.deleteFamilyMember(memberId);
      showToast(`${memberName} removed from family profile.`);
    }
  }

  function openEditFamilyModal() {
    const fam = getState().family;
    openModal(`
      <div>
        <h3 style="font-size:20px; margin-bottom:4px">Edit Family Details</h3>
        <p class="small text-light-green" style="margin-bottom:16px">Update household Gotra and tradition preferences.</p>

        <div class="form-group">
          <label class="form-label" for="famName">Household Name</label>
          <input type="text" class="form-control" id="famName" value="${Security.escapeHTML(fam.name)}">
        </div>

        <div class="form-group">
          <label class="form-label" for="famGotra">Vedic Gotra</label>
          <input type="text" class="form-control" id="famGotra" value="${Security.escapeHTML(fam.gotra)}">
        </div>

        <div class="form-group">
          <label class="form-label" for="famTradition">Regional Tradition</label>
          <select class="form-control" id="famTradition">
            <option ${fam.tradition === 'North Indian' ? 'selected' : ''}>North Indian</option>
            <option ${fam.tradition === 'South Indian' ? 'selected' : ''}>South Indian</option>
            <option ${fam.tradition === 'Bengali' ? 'selected' : ''}>Bengali</option>
            <option ${fam.tradition === 'Gujarati / Maharashtrian' ? 'selected' : ''}>Gujarati / Maharashtrian</option>
          </select>
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="saveFamilyDetails()">
          Update Family Details
        </button>
      </div>
    `);
  }

  function saveFamilyDetails() {
    const name = document.getElementById('famName').value.trim();
    const gotra = document.getElementById('famGotra').value.trim();
    const tradition = document.getElementById('famTradition').value;

    if (name) getState().family.name = Security.sanitizeText(name, 50);
    if (gotra) getState().family.gotra = Security.sanitizeText(gotra, 30);
    getState().family.tradition = tradition;

    Store.notify();
    closeModal();
    showToast('Family profile details updated!');
  }

  function openEditProfileModal() {
    const u = getState().user;
    openModal(`
      <div>
        <h3 style="font-size:20px; margin-bottom:4px">Edit Profile</h3>
        <p class="small text-light-green" style="margin-bottom:16px">Update contact and city details.</p>

        <div class="form-group">
          <label class="form-label" for="userProfileName">Full Name</label>
          <input type="text" class="form-control" id="userProfileName" value="${Security.escapeHTML(u.name)}">
        </div>

        <div class="form-group">
          <label class="form-label" for="userProfilePhone">Phone Number</label>
          <input type="text" class="form-control" id="userProfilePhone" value="${Security.escapeHTML(u.phone)}">
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="saveUserProfile()">
          Save Changes
        </button>
      </div>
    `);
  }

  function saveUserProfile() {
    const name = document.getElementById('userProfileName').value.trim();
    const phone = document.getElementById('userProfilePhone').value.trim();

    if (!Security.isValidName(name)) {
      showToast('Please enter a valid name.');
      return;
    }

    if (!Security.isValidPhone(phone)) {
      showToast('Please enter a valid Indian phone number.');
      return;
    }

    getState().user.name = name;
    getState().user.phone = Security.formatPhone(phone);
    Store.notify();
    closeModal();
    showToast('Profile updated!');
  }

  // Backup & Export / Import Modal
  function openBackupModal() {
    openModal(`
      <div>
        <div class="eyebrow" style="color:var(--gold)">Data Persistence & Sovereignty</div>
        <h3 style="font-size:22px; margin:4px 0 12px">Family Ritual Archive (Backup & Restore)</h3>
        <p class="small text-light-green" style="margin-bottom:16px">
          Export your complete family ritual history, members, and bookings as a clean JSON file, or restore from a previous archive.
        </p>

        <div class="card" style="background:var(--bg-surface-alt); padding:14px; margin-bottom:16px">
          <strong style="color:#FFFFFF"><i class="fa-solid fa-cloud-arrow-down" style="margin-right:6px; color:var(--emerald)"></i> Export Ritual Vault</strong>
          <p class="micro text-light-green" style="margin:4px 0 10px">Download your persistent data archive to keep an offline backup.</p>
          <button type="button" class="btn btn-sm btn-primary md-ripple" onclick="handleExportData()">
            <i class="fa-solid fa-download"></i> Download JSON Backup
          </button>
        </div>

        <div class="card" style="background:var(--bg-surface-alt); padding:14px">
          <strong style="color:#FFFFFF"><i class="fa-solid fa-cloud-arrow-up" style="margin-right:6px; color:var(--gold)"></i> Restore from Backup</strong>
          <p class="micro text-light-green" style="margin:4px 0 10px">Select an exported Aaradhya JSON file to restore your profile.</p>
          <input type="file" id="importFileInput" accept=".json" class="form-control" style="font-size:12px; margin-bottom:8px">
          <button type="button" class="btn btn-sm btn-secondary md-ripple" onclick="handleImportData()">
            <i class="fa-solid fa-upload"></i> Restore Archive
          </button>
        </div>
      </div>
    `);
  }

  function handleExportData() {
    const jsonStr = Store.exportStateJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aaradhya-family-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Backup archive exported successfully!');
  }

  function handleImportData() {
    const fileInput = document.getElementById('importFileInput');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      showToast('Please select a JSON file to restore.');
      return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      const success = Store.importStateJSON(contents);
      if (success) {
        closeModal();
        showToast('Ritual vault archive restored successfully!');
      } else {
        showToast('Invalid backup file format. Restore failed.');
      }
    };
    reader.readAsText(file);
  }

  // Telemetry & Observability Drawer
  function openTelemetryDrawer() {
    const logs = getState().telemetryLogs || [];
    openModal(`
      <div>
        <div class="eyebrow" style="color:var(--gold)">System Observability & Diagnostic Engine</div>
        <h3 style="font-size:20px; margin:4px 0 12px">Telemetry & Audit Log</h3>
        <p class="micro text-light-green" style="margin-bottom:14px">
          Real-time structured event tracing, state migrations, and operational transitions.
        </p>

        <div style="max-height:360px; overflow-y:auto; border:1px solid var(--border-glass); border-radius:var(--radius-md)">
          <table class="telemetry-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Level</th>
                <th>Event</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              ${logs.slice().reverse().map(l => `
                <tr>
                  <td style="white-space:nowrap">${l.timestamp.split('T')[1].slice(0, 8)}</td>
                  <td><span class="telemetry-badge ${l.level}">${l.level}</span></td>
                  <td><strong>${l.event}</strong></td>
                  <td>${Security.escapeHTML(l.message)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <button type="button" class="btn btn-secondary btn-block md-ripple" style="margin-top:16px" onclick="closeModal()">
          Close Audit Trail
        </button>
      </div>
    `);
  }

  // Seva Modal
  function openSevaModal(amount) {
    openModal(`
      <div style="text-align:center">
        <div style="font-size:40px; margin-bottom:8px">🪔</div>
        <div class="eyebrow">Sacred Offering</div>
        <h2 style="font-size:26px; margin:6px 0">${amount} Temple Seva</h2>
        <p class="small text-light-green" style="margin-bottom:16px">
          Dedicated on behalf of <strong>${Security.escapeHTML(getState().family.name)}</strong> (Gotra: ${Security.escapeHTML(getState().family.gotra)}) at Shri Kashi Vishwanath Temple.
        </p>

        <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); padding:14px; border-radius:var(--radius-md); text-align:left; font-size:13px; margin-bottom:20px">
          <div style="color:var(--emerald)"><i class="fa-solid fa-check"></i> Digital Sankalp video acknowledgement within 24 hours</div>
          <div style="margin-top:4px; color:var(--emerald)"><i class="fa-solid fa-check"></i> Consecrated Dry Prasad mailed to your doorstep</div>
          <div style="margin-top:4px; color:var(--emerald)"><i class="fa-solid fa-check"></i> 100% Tax Exemption (80G) summary included</div>
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="confirmSevaAction('${amount}')">
          Confirm Seva Offering of ${amount}
        </button>
      </div>
    `);
  }

  function confirmSevaAction(amount) {
    const seva = Store.recordSeva('Shri Kashi Vishwanath, Varanasi', amount, 'Nitya Deepdaan & Chadhava');
    closeModal();
    Audio.playTempleBell();
    showToast(`Seva offering successful! Receipt ID: ${seva.id}`);
  }

  // Kundli Generator
  function generateKundliResult() {
    const name = document.getElementById('kundliName') ? document.getElementById('kundliName').value.trim() : getState().user.name;
    const dob = document.getElementById('kundliDob') ? document.getElementById('kundliDob').value : '1995-08-15';
    const p = Panchang.calculatePanchang(new Date(dob), 'Delhi NCR');

    openModal(`
      <div style="text-align:center">
        <div style="font-size:36px; margin-bottom:8px; color:var(--gold)"><i class="fa-solid fa-star-and-crescent"></i></div>
        <div class="eyebrow">Vedic Birth Chart Summary</div>
        <h2 style="font-size:24px; margin:6px 0">${Security.escapeHTML(name)}'s Janampatri</h2>
        <p class="small text-light-green" style="margin-bottom:16px">Calculated using Lahiri Ayanamsha & North Indian Lagna.</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:left; margin-bottom:20px">
          <div class="card" style="padding:12px; background:var(--bg-surface-alt)">
            <span class="micro text-light-green">Chandra Tithi</span>
            <div style="font-weight:700; font-size:15px; color:#FFFFFF">${p.tithi}</div>
          </div>
          <div class="card" style="padding:12px; background:var(--bg-surface-alt)">
            <span class="micro text-light-green">Janma Nakshatra</span>
            <div style="font-weight:700; font-size:15px; color:#FFFFFF">${p.nakshatra}</div>
          </div>
          <div class="card" style="padding:12px; background:var(--bg-surface-alt)">
            <span class="micro text-light-green">Ruling Planet</span>
            <div style="font-weight:700; font-size:15px; color:#FFFFFF">${p.nakshatraRuler}</div>
          </div>
          <div class="card" style="padding:12px; background:var(--bg-surface-alt)">
            <span class="micro text-light-green">Favorable Deity</span>
            <div style="font-weight:700; font-size:15px; color:#FFFFFF">${p.favorableDeity}</div>
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="closeModal(); showToast('Janampatri insights saved to profile.');">
          Save to Family Profile
        </button>
      </div>
    `);
  }

  // Location Picker Modal
  function openLocationPicker() {
    const currentCity = getState().user.city;
    openModal(`
      <div>
        <h3 style="font-size:20px; margin-bottom:4px">Select Service City</h3>
        <p class="small text-light-green" style="margin-bottom:16px">Aaradhya verified purohits are active in these metropolitan clusters.</p>

        <div style="display:flex; flex-direction:column; gap:8px">
          ${['Delhi NCR', 'Bengaluru', 'Mumbai & Pune', 'Varanasi', 'Hyderabad'].map(city => `
            <button type="button" class="slot-card md-ripple ${currentCity === city ? 'selected' : ''}" style="width:100%; border:none" onclick="handleCitySelect('${city}')">
              <strong style="color:#FFFFFF"><i class="fa-solid fa-location-dot" style="margin-right:6px"></i> ${city}</strong>
              <span class="badge badge-verified micro">${currentCity === city ? 'Active' : 'Select'}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `);
  }

  function handleCitySelect(city) {
    getState().user.city = city;
    getState().draftBooking.location.city = city;
    const cityPills = document.querySelectorAll('.city-pill');
    cityPills.forEach(p => p.textContent = city);
    Store.notify();
    closeModal();
    showToast(`Service city updated to ${city}`);
  }

  // Notifications Drawer
  function openNotifications() {
    const notifs = getState().notifications || [];
    Store.markAllNotificationsRead();
    const badge = document.querySelector('.notif-badge');
    if (badge) badge.style.display = 'none';

    openModal(`
      <div>
        <div class="eyebrow">Smart Reminders</div>
        <h3 style="font-size:20px; margin:4px 0 16px"><i class="fa-solid fa-bell" style="color:var(--gold); margin-right:6px"></i> Ritual Notifications</h3>

        <div style="display:flex; flex-direction:column; gap:10px">
          ${notifs.map(n => `
            <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); padding:12px; border-radius:var(--radius-md)">
              <div style="display:flex; justify-content:space-between; align-items:center">
                <span class="badge badge-gold micro">${n.type}</span>
                <span class="micro text-muted">${n.time}</span>
              </div>
              <h4 style="font-size:14px; margin:4px 0; color:#FFFFFF">${Security.escapeHTML(n.title)}</h4>
              <p class="micro text-light-green">${Security.escapeHTML(n.message)}</p>
            </div>
          `).join('')}
        </div>

        <button type="button" class="btn btn-secondary btn-block md-ripple" style="margin-top:16px" onclick="closeModal()">
          Dismiss
        </button>
      </div>
    `);
  }

  // Help & Concierge Support Modal
  function openHelpSupport() {
    openModal(`
      <div>
        <div class="eyebrow">Aaradhya Trust Stack</div>
        <h3 style="font-size:22px; margin:4px 0 12px"><i class="fa-solid fa-circle-question" style="color:var(--gold); margin-right:6px"></i> How can our Concierge help?</h3>
        <p class="small text-light-green" style="margin-bottom:16px">Dedicated assistance for families booking sacred home ceremonies.</p>

        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px">
          <div class="card" style="padding:12px; background:var(--bg-surface-alt)">
            <strong style="color:#FFFFFF"><i class="fa-brands fa-whatsapp" style="color:#25D366; margin-right:6px"></i> Instant WhatsApp Concierge</strong>
            <div class="micro text-light-green">Average response time: 3 minutes</div>
          </div>
          <div class="card" style="padding:12px; background:var(--bg-surface-alt)">
            <strong style="color:#FFFFFF"><i class="fa-solid fa-award" style="color:var(--gold); margin-right:6px"></i> Vedic Purohit Verification Guarantee</strong>
            <div class="micro text-light-green">All pandits certified by premier Sanskrit universities</div>
          </div>
          <div class="card" style="padding:12px; background:var(--bg-surface-alt)">
            <strong style="color:#FFFFFF"><i class="fa-solid fa-shield-halved" style="color:var(--emerald); margin-right:6px"></i> 100% Escrow Refund Policy</strong>
            <div class="micro text-light-green">Full refund guaranteed if ceremony canceled 12 hours prior to Muhurat</div>
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="closeModal(); showToast('Concierge ticket #AR-942 opened. An assistant will contact you in 3 mins.');">
          Connect to Live Concierge
        </button>
      </div>
    `);
  }

  // Pandit Full Profile Modal
  function openPanditProfile(panditId) {
    const pandit = PANDITS_DATABASE.find(p => p.id === panditId) || PANDITS_DATABASE[0];
    openModal(`
      <div>
        <div style="display:flex; gap:16px; align-items:center; margin-bottom:16px">
          <div class="pandit-avatar" style="width:68px; height:68px; font-size:24px">${pandit.avatarInitials}</div>
          <div>
            <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified Purohit</span>
            <h2 style="font-size:22px; margin:4px 0">${Security.escapeHTML(pandit.name)}</h2>
            <div class="small text-light-green">★ ${pandit.rating} · ${pandit.bookingsCount} Aaradhya ceremonies</div>
          </div>
        </div>

        <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); padding:14px; border-radius:var(--radius-md); margin-bottom:16px; font-size:13px">
          <div><strong style="color:var(--gold)">Education:</strong> <span style="color:#FFFFFF">${Security.escapeHTML(pandit.education)}</span></div>
          <div style="margin-top:4px"><strong style="color:var(--gold)">Tradition:</strong> <span style="color:#FFFFFF">${Security.escapeHTML(pandit.tradition)}</span></div>
          <div style="margin-top:4px"><strong style="color:var(--gold)">Languages:</strong> <span style="color:#FFFFFF">${Security.escapeHTML(pandit.languages)}</span></div>
        </div>

        <h4 style="font-size:15px; margin-bottom:8px">About Pandit Ji</h4>
        <p style="font-size:14px; color:var(--text-secondary); line-height:1.5; margin-bottom:16px">${Security.escapeHTML(pandit.bio)}</p>

        <h4 style="font-size:15px; margin-bottom:8px">Devotee Reviews</h4>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px">
          ${pandit.reviews.map(r => `
            <div style="background:var(--bg-surface-alt); border:1px solid var(--border-glass); padding:10px 14px; border-radius:var(--radius-sm)">
              <div style="font-weight:700; font-size:13px; color:var(--gold)">${Security.escapeHTML(r.devotee)}</div>
              <p class="small text-light-green" style="margin-top:2px">"${Security.escapeHTML(r.comment)}"</p>
            </div>
          `).join('')}
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" onclick="closeModal(); selectPandit('${pandit.id}'); showToast('Pandit ${Security.escapeHTML(pandit.name)} selected.');">
          Continue with ${Security.escapeHTML(pandit.name)}
        </button>
      </div>
    `);
  }

  function openSwitchPanditModal() {
    const currentId = getState().draftBooking.panditId;
    openModal(`
      <div>
        <h3 style="font-size:20px; margin-bottom:4px">Choose Alternative Pandit</h3>
        <p class="small text-light-green" style="margin-bottom:16px">All Pandits adhere to Aaradhya's verified Vedic standards.</p>

        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px">
          ${PANDITS_DATABASE.map(p => `
            <div class="slot-card md-ripple ${currentId === p.id ? 'selected' : ''}" onclick="selectPandit('${p.id}'); closeModal();">
              <div style="display:flex; gap:12px; align-items:center">
                <div class="pandit-avatar" style="width:44px; height:44px; font-size:16px">${p.avatarInitials}</div>
                <div>
                  <strong style="color:#FFFFFF">${Security.escapeHTML(p.name)}</strong>
                  <div class="micro text-light-green">★ ${p.rating} · ${p.experience} · ${Security.escapeHTML(p.languages)}</div>
                </div>
              </div>
              <span class="badge badge-verified micro">${currentId === p.id ? 'Selected' : 'Select'}</span>
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
              <strong style="font-size:14px; color:var(--gold)">${cat.category}</strong>
              <ul style="list-style:none; padding:0; margin-top:6px">
                ${cat.items.map(item => `
                  <li style="font-size:13px; padding:4px 0; border-bottom:1px dashed var(--border-subtle); display:flex; align-items:center; gap:6px; color:var(--text-secondary)">
                    <i class="fa-solid fa-check" style="color:var(--emerald)"></i> ${Security.escapeHTML(item)}
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <button type="button" class="btn btn-primary btn-block md-ripple" style="margin-top:20px" onclick="closeModal()">
          Got It
        </button>
      </div>
    `);
  }

  // Stepper Selection Handlers
  function selectPackage(packName, price) {
    Store.setBookingPackage(packName, price);
  }

  function setSlot(dateStr, timeStr, muhuratDesc) {
    Store.setBookingSlot(dateStr, timeStr, muhuratDesc);
    showToast(`Selected Muhurat: ${dateStr} · ${timeStr}`);
  }

  function handleCustomDateChange(dateVal) {
    if (!dateVal) return;
    const d = new Date(dateVal);
    const dateFormatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const p = Panchang.calculatePanchang(d, getState().user.city);
    getState().draftBooking.date = dateFormatted;
    getState().draftBooking.muhuratType = `${p.tithi} · ${p.nakshatra}`;
    Store.notify();
    showToast(`Custom date set: ${dateFormatted}`);
  }

  function handleCustomTimeChange(timeVal) {
    if (!timeVal) return;
    getState().draftBooking.time = `${timeVal} onwards`;
    Store.notify();
  }

  function selectPandit(panditId) {
    const pandit = PANDITS_DATABASE.find(p => p.id === panditId);
    if (pandit) {
      Store.setBookingPandit(pandit.id, pandit.name);
    }
  }

  function selectSamagriOption(option) {
    Store.setBookingSamagri(option);
  }

  function filterRitualCatalog() {
    const input = document.getElementById('pujaSearchInput');
    const q = input ? input.value.toLowerCase().trim() : '';
    const filtered = RITUALS_CATALOG.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.shortDesc.toLowerCase().includes(q) ||
      r.purpose.toLowerCase().includes(q) ||
      r.deity.toLowerCase().includes(q)
    );

    const container = document.getElementById('catalogGrid');
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px">
          <p class="text-light-green">No rituals matched "${Security.escapeHTML(q)}". Try searching for 'Havan', 'Home', or 'Vishnu'.</p>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(r => `
        <div class="ritual-card md-ripple" onclick="selectRitual('${r.id}')">
          <div>
            <div class="ritual-card-header">
              <div class="ritual-icon">${r.icon}</div>
              <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified Purohit</span>
            </div>
            <h3>${Security.escapeHTML(r.name)}</h3>
            <p>${Security.escapeHTML(r.shortDesc)}</p>
            <div style="margin-top:10px; display:flex; gap:4px; flex-wrap:wrap">
              <span class="micro badge badge-neutral">${Security.escapeHTML(r.purpose)}</span>
            </div>
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
    if (input) {
      input.value = tag === 'all' ? '' : tag;
    }
    filterRitualCatalog();
  }

  // ==========================================================================
  // Pitch & Deterministic Demo Presentation Controller
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
          Store.setView('book', 2);
          showToast('Pitch: 3. Auspicious Muhurat locked');

          setTimeout(() => {
            Store.setView('book', 3);

            setTimeout(() => {
              getState().bookingStep = 4;
              getState().isMatchingPandit = true;
              renderApp();
              showToast('Pitch: 4. Pandit Matching in progress…');

              setTimeout(() => {
                getState().isMatchingPandit = false;
                renderApp();
                showToast('Pitch: 5. Pandit Rajesh Sharma Matched!');

                setTimeout(() => {
                  Store.setView('book', 6);
                  showToast('Pitch: 6. Transparent Price Breakdown');

                  setTimeout(() => {
                    Store.confirmPayment('UPI (Escrow)');
                    showToast('Pitch: 7. Booking Confirmed!');

                    setTimeout(() => {
                      const activeB = Store.getActiveBooking();
                      if (activeB) activeB.status = 'On The Way';
                      nav('tracking');
                      showToast('Pitch: 8. Live Tracking: Pandit is on the way');

                      setTimeout(() => {
                        if (activeB) activeB.status = 'Completed';
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

  function confirmResetDemoData() {
    if (confirm('Reset Aaradhya to original demo state? All local storage will be refreshed.')) {
      Store.resetToDefaults();
      showToast('Demo state reset to clean seed data.');
      nav('home');
    }
  }

  // ==========================================================================
  // Material 3 Bottom Navigation Bar Renderer
  // ==========================================================================
  function renderBottomNav() {
    const navContainer = document.getElementById('bottomNavContainer');
    if (!navContainer) return;

    const navItems = [
      { id: 'home', label: 'Home', icon: 'fa-solid fa-house' },
      { id: 'book', label: 'Book', icon: 'fa-solid fa-book-open' },
      { id: 'bookings', label: 'Bookings', icon: 'fa-solid fa-calendar-check' },
      { id: 'family', label: 'Family', icon: 'fa-solid fa-people-roof' },
      { id: 'profile', label: 'Profile', icon: 'fa-solid fa-circle-user' }
    ];

    let activeTab = getState().view;
    if (['detail', 'confirmation'].includes(activeTab)) activeTab = 'book';
    if (['tracking', 'completion'].includes(activeTab)) activeTab = 'bookings';

    navContainer.innerHTML = navItems.map(item => `
      <button type="button" class="nav-tab-btn md-ripple ${activeTab === item.id ? 'active' : ''}" onclick="nav('${item.id}', 0)" aria-label="${item.label} screen">
        <div class="nav-icon-pill">
          <i class="${item.icon}"></i>
        </div>
        <span>${item.label}</span>
      </button>
    `).join('');
  }

  // ==========================================================================
  // Root Stage Renderer
  // ==========================================================================
  function renderApp() {
    const mainStage = document.getElementById('app');
    if (!mainStage) return;

    let html = '';
    const view = getState().view;

    switch (view) {
      case 'home':
        html = renderHomeScreen();
        break;
      case 'book':
        if (getState().bookingStep === 0) {
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
    attachCardEffects();
    initStatsCounters();
  }

  // Card effects (Spotlight and 3D Tilt)
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
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }

  // Material 3 Touch Ripple Effect Engine
  function initMaterialRipples() {
    document.addEventListener('pointerdown', (e) => {
      const target = e.target.closest('.md-ripple');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('md-ripple-effect');

      const existing = target.querySelector('.md-ripple-effect');
      if (existing) existing.remove();

      target.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  }

  // IntersectionObserver for Animated Counters
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
          const duration = 1400;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;
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

  // Interactive Ambient Cursor Lighting
  window.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
  });

  // Offline / Online Network Event Listeners
  function initNetworkResilience() {
    const banner = document.getElementById('offlineBanner');
    function updateOnlineStatus() {
      if (!navigator.onLine) {
        if (banner) banner.style.display = 'block';
        showToast('Offline Mode: All ritual data remains saved locally.');
      } else {
        if (banner) banner.style.display = 'none';
      }
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }

  // Global Exports for Inline DOM Handlers
  window.nav = nav;
  window.selectRitual = selectRitual;
  window.startBookingFlow = startBookingFlow;
  window.nextBookingStep = nextBookingStep;
  window.prevBookingStep = prevBookingStep;
  window.processPayment = processPayment;
  window.selectPackage = selectPackage;
  window.setSlot = setSlot;
  window.handleCustomDateChange = handleCustomDateChange;
  window.handleCustomTimeChange = handleCustomTimeChange;
  window.selectPandit = selectPandit;
  window.selectSamagriOption = selectSamagriOption;
  window.filterRitualCatalog = filterRitualCatalog;
  window.filterByTag = filterByTag;
  window.advanceBookingStatus = advanceBookingStatus;

  window.openModal = openModal;
  window.closeModal = closeModal;
  window.handleBackdropClick = handleBackdropClick;
  window.showToast = showToast;

  window.toggleContextMenu = toggleContextMenu;
  window.openContextMenu = openContextMenu;
  window.closeContextMenu = closeContextMenu;

  window.toggleAartiPlayer = toggleAartiPlayer;
  window.toggleDevotionalTheme = toggleDevotionalTheme;
  window.toggleDeviceFrame = toggleDeviceFrame;
  window.startPitchFlow = startPitchFlow;
  window.confirmResetDemoData = confirmResetDemoData;
  window.resetDemoData = confirmResetDemoData;

  window.openJapaMalaModal = openJapaMalaModal;
  window.handleJapaChantClick = handleJapaChantClick;
  window.changeJapaMantra = changeJapaMantra;
  window.resetJapaCounter = resetJapaCounter;

  window.openLocationPicker = openLocationPicker;
  window.handleCitySelect = handleCitySelect;
  window.openNotifications = openNotifications;
  window.openHelpSupport = openHelpSupport;
  window.openPanditProfile = openPanditProfile;
  window.openSwitchPanditModal = openSwitchPanditModal;
  window.openAllSamagriModal = openAllSamagriModal;

  window.openAddMemberModal = openAddMemberModal;
  window.saveNewFamilyMember = saveNewFamilyMember;
  window.confirmDeleteMember = confirmDeleteMember;
  window.openEditFamilyModal = openEditFamilyModal;
  window.saveFamilyDetails = saveFamilyDetails;
  window.openEditProfileModal = openEditProfileModal;
  window.saveUserProfile = saveUserProfile;

  window.openSevaModal = openSevaModal;
  window.confirmSevaAction = confirmSevaAction;
  window.generateKundliResult = generateKundliResult;

  window.openCertificateModal = openCertificateModal;
  window.handleCertificatePrint = handleCertificatePrint;
  window.handleCalendarDownload = handleCalendarDownload;
  window.openReviewModal = openReviewModal;
  window.setReviewRating = setReviewRating;
  window.submitReviewAction = submitReviewAction;
  window.openCancelModal = openCancelModal;
  window.confirmCancellationAction = confirmCancellationAction;
  window.openRescheduleModal = openRescheduleModal;
  window.confirmRescheduleAction = confirmRescheduleAction;

  window.openBackupModal = openBackupModal;
  window.handleExportData = handleExportData;
  window.handleImportData = handleImportData;
  window.openTelemetryDrawer = openTelemetryDrawer;

  // Splash Screen Lifecycle Management
  let splashDismissTimeout = null;
  let splashProgressInterval = null;

  function initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    const bar = document.getElementById('splashProgressBar');
    const status = document.getElementById('splashStatus');
    if (!splash) return;

    if (splashDismissTimeout) clearTimeout(splashDismissTimeout);
    if (splashProgressInterval) clearInterval(splashProgressInterval);

    let progress = 0;
    if (bar) bar.style.width = '0%';

    const stages = [
      { at: 20, text: 'Awakening Vedic Sanctum...' },
      { at: 50, text: 'Synchronizing Panchang Muhurat...' },
      { at: 80, text: 'Loading Sacred Ritual Vault...' },
      { at: 100, text: 'Namaste! Welcome to Aaradhya' }
    ];

    splashProgressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 16) + 12;
      if (progress > 100) progress = 100;
      if (bar) bar.style.width = `${progress}%`;

      if (status) {
        for (let i = stages.length - 1; i >= 0; i--) {
          if (progress >= stages[i].at) {
            status.textContent = stages[i].text;
            break;
          }
        }
      }

      if (progress >= 100) {
        clearInterval(splashProgressInterval);
        splashDismissTimeout = setTimeout(() => {
          dismissSplashScreen();
        }, 350);
      }
    }, 130);

    const onKeyDismiss = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        dismissSplashScreen();
        window.removeEventListener('keydown', onKeyDismiss);
      }
    };
    window.addEventListener('keydown', onKeyDismiss);
  }

  function dismissSplashScreen() {
    if (splashProgressInterval) clearInterval(splashProgressInterval);
    if (splashDismissTimeout) clearTimeout(splashDismissTimeout);

    const splash = document.getElementById('splashScreen');
    if (!splash || splash.classList.contains('splash-hidden')) return;

    splash.classList.add('splash-hidden');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 600);
  }

  function showSplashScreen() {
    const splash = document.getElementById('splashScreen');
    const bar = document.getElementById('splashProgressBar');
    const status = document.getElementById('splashStatus');
    if (!splash) return;

    splash.style.display = 'flex';
    void splash.offsetWidth; // Force CSS reflow
    splash.classList.remove('splash-hidden');
    if (bar) bar.style.width = '0%';
    if (status) status.textContent = 'Awakening Vedic Sanctum...';
    initSplashScreen();
  }

  window.dismissSplashScreen = dismissSplashScreen;
  window.showSplashScreen = showSplashScreen;

  // React to store changes
  Store.subscribe(() => {
    renderApp();
  });

  // Application Boot
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getState().theme || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    const headerIcon = document.getElementById('headerThemeIcon');
    if (headerIcon) {
      headerIcon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    const cityPills = document.querySelectorAll('.city-pill');
    cityPills.forEach(p => p.textContent = getState().user.city);

    initMaterialRipples();
    initNetworkResilience();
    renderApp();
    initSplashScreen();
  });
})();
