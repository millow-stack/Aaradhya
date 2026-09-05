/**
 * Aaradhya — Reactive State Store & Persistence Layer
 * Centralized state container with schema-versioned LocalStorage synchronization,
 * deterministic state transitions, audit logging, multi-booking lifecycle, and event dispatching.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    const Security = require('./security.js');
    const Catalog = require('../data/catalog.js');
    module.exports = factory(Security, Catalog);
  } else {
    root.AaradhyaStore = factory(root.AaradhyaSecurity, root.AaradhyaCatalog);
  }
}(typeof self !== 'undefined' ? self : this, function (Security, Catalog) {
  'use strict';

  const STORAGE_KEY = 'aaradhya_v2_store';
  const CURRENT_SCHEMA_VERSION = 2;

  // Default seed data
  function getDefaultState() {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      view: 'home',
      bookingStep: 0,
      isMatchingPandit: false,
      deviceFrame: false,
      theme: 'dark',

      user: {
        name: 'Drishti',
        phone: '+91 98765 43210',
        city: 'Delhi NCR',
        language: 'Hindi',
        tradition: 'North Indian'
      },

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
            id: 'AR-2026-1082',
            ritual: 'Griha Pravesh Puja',
            date: '18 April 2026',
            pandit: 'Pandit Rajesh Sharma',
            package: 'Premium',
            location: 'Sector 62, Noida, Delhi NCR',
            status: 'Completed',
            sankalp: 'For Griha Pravesh & family peace and prosperity',
            rating: 5,
            review: 'Pandit ji explained every sacred mantra with deep spiritual patience. Truly elevated our family experience.'
          },
          {
            id: 'AR-2025-9411',
            ritual: 'Satyanarayan Katha',
            date: '15 December 2025',
            pandit: 'Pandit Rajesh Sharma',
            package: 'Essential',
            location: 'Mayur Vihar, Delhi NCR',
            status: 'Completed',
            sankalp: 'Monthly family thanksgiving and blessings',
            rating: 5,
            review: 'Punctual, serene, and conducted with complete adherence to tradition.'
          }
        ]
      },

      // Multi-booking store
      bookings: [
        {
          id: 'AR-2026-4892',
          ritualId: 'griha-pravesh',
          ritualName: 'Griha Pravesh Puja',
          package: 'Premium',
          packagePrice: 8999,
          date: '18 October 2026',
          time: '10:00 AM – 12:15 PM',
          muhuratType: 'Shubh Choghadiya & Rohini Nakshatra',
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
          paymentMethod: 'UPI (Sacred Escrow)',
          status: 'Confirmed', // Confirmed, Pandit Assigned, Samagri Preparing, On The Way, Arrived, Completed, Cancelled
          createdAt: new Date().toISOString(),
          statusHistory: [
            { status: 'Confirmed', timestamp: new Date().toISOString(), note: 'Slot locked with Vedic Muhurat' }
          ],
          review: null
        }
      ],

      // Current draft booking in stepper
      draftBooking: {
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
        paymentMethod: 'UPI'
      },

      currentActiveBookingId: 'AR-2026-4892',

      sevaOfferings: [
        {
          id: 'SEVA-2026-891',
          temple: 'Shri Kashi Vishwanath, Varanasi',
          amount: '₹501',
          title: 'Nitya Deepdaan & Chadhava',
          date: '2 days ago',
          family: 'Drishti Family',
          gotra: 'Kashyap',
          status: 'Fulfilled'
        }
      ],

      japa: {
        count: 0,
        target: 108,
        rounds: 0,
        totalLifetimeBeads: 324,
        currentMantra: 'gayatri',
        soundEnabled: true
      },

      audioVisualizer: {
        isPlaying: false,
        trackName: 'Sacred Gayatri Mahamantra & Vedic Tanpura Drone'
      },

      notifications: [
        {
          id: 'notif-1',
          type: 'Festival Alert',
          title: 'Navratri begins in 7 days',
          message: 'Book Ghatasthapana Puja early to secure preferred morning Muhurat slots.',
          time: '1h ago',
          read: false
        },
        {
          id: 'notif-2',
          type: 'Lifecycle Reminder',
          title: 'Griha Pravesh 6-Month Mark',
          message: 'Traditionally recommended to perform a Satyanarayan Katha for ongoing harmony.',
          time: 'Yesterday',
          read: true
        }
      ],

      telemetryLogs: [
        { level: 'INFO', event: 'STORE_INIT', timestamp: new Date().toISOString(), message: 'Aaradhya Store initialized with schema v2.' }
      ]
    };
  }

  class Store {
    constructor() {
      this.listeners = new Set();
      this.state = this.loadInitialState();
    }

    /**
     * Load persisted state with corruption recovery and migration
     */
    loadInitialState() {
      if (typeof localStorage === 'undefined') {
        return getDefaultState();
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.schemaVersion === CURRENT_SCHEMA_VERSION) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Aaradhya Store: LocalStorage corrupted, initializing fresh defaults', e);
      }

      // Check legacy theme preference
      let legacyTheme = 'dark';
      try {
        legacyTheme = localStorage.getItem('aaradhya_devotional_theme') || 'dark';
      } catch (e) {}

      const fresh = getDefaultState();
      fresh.theme = legacyTheme;
      this.persist(fresh);
      return fresh;
    }

    /**
     * Persist state to LocalStorage
     */
    persist(stateToSave) {
      if (typeof localStorage === 'undefined') return;
      try {
        // Keep telemetry log bounded to last 50 entries
        if (stateToSave.telemetryLogs && stateToSave.telemetryLogs.length > 50) {
          stateToSave.telemetryLogs = stateToSave.telemetryLogs.slice(-50);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Aaradhya Store: Failed to persist to localStorage', e);
      }
    }

    /**
     * Subscribe to state modifications
     * @param {function} listener 
     * @returns {function} unsubscribe callback
     */
    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    /**
     * Emit change notification to all subscribers and persist
     */
    notify() {
      this.persist(this.state);
      for (const listener of this.listeners) {
        try {
          listener(this.state);
        } catch (err) {
          console.error('Aaradhya Store: Listener error', err);
        }
      }
    }

    getState() {
      return this.state;
    }

    logTelemetry(level, event, message, data = null) {
      const entry = {
        level,
        event,
        message,
        data,
        timestamp: new Date().toISOString()
      };
      if (!this.state.telemetryLogs) this.state.telemetryLogs = [];
      this.state.telemetryLogs.push(entry);
    }

    // ========================================================================
    // Actions
    // ========================================================================

    setTheme(theme) {
      this.state.theme = theme;
      if (typeof localStorage !== 'undefined') {
        try { localStorage.setItem('aaradhya_devotional_theme', theme); } catch (e) {}
      }
      this.logTelemetry('INFO', 'THEME_CHANGED', `Theme set to ${theme}`);
      this.notify();
    }

    setView(view, step = 0) {
      this.state.view = view;
      this.state.bookingStep = step;
      this.logTelemetry('INFO', 'VIEW_NAVIGATED', `Navigated to ${view} (step ${step})`);
      this.notify();
    }

    startBookingFlow(ritualId) {
      const rituals = (Catalog && Catalog.RITUALS_CATALOG) || [];
      const ritual = rituals.find(r => r.id === ritualId) || rituals[0];
      if (ritual) {
        this.state.draftBooking.ritualId = ritual.id;
        this.state.draftBooking.ritualName = ritual.name;
        this.state.draftBooking.packagePrice = ritual.priceStart || 5500;
      }
      this.state.view = 'book';
      this.state.bookingStep = 1;
      this.notify();
    }

    setBookingPackage(packageName, price) {
      this.state.draftBooking.package = packageName;
      this.state.draftBooking.packagePrice = price;
      this.notify();
    }

    setBookingSlot(dateStr, timeStr, muhuratDesc) {
      this.state.draftBooking.date = dateStr;
      this.state.draftBooking.time = timeStr;
      this.state.draftBooking.muhuratType = muhuratDesc;
      this.notify();
    }

    setBookingLocation(locationObj) {
      this.state.draftBooking.location = Object.assign({}, this.state.draftBooking.location, locationObj);
      this.notify();
    }

    setBookingPandit(panditId, panditName) {
      this.state.draftBooking.panditId = panditId;
      this.state.draftBooking.panditName = panditName;
      this.notify();
    }

    setBookingSamagri(choice) {
      this.state.draftBooking.samagriChoice = choice;
      this.notify();
    }

    /**
     * Finalize and create new booking in multi-booking store
     */
    confirmPayment(method = 'UPI') {
      const id = 'AR-2026-' + Math.floor(1000 + Math.random() * 9000);
      const newBooking = {
        id: id,
        ritualId: this.state.draftBooking.ritualId,
        ritualName: this.state.draftBooking.ritualName,
        package: this.state.draftBooking.package,
        packagePrice: this.state.draftBooking.packagePrice,
        date: this.state.draftBooking.date,
        time: this.state.draftBooking.time,
        muhuratType: this.state.draftBooking.muhuratType,
        location: Object.assign({}, this.state.draftBooking.location),
        panditId: this.state.draftBooking.panditId,
        panditName: this.state.draftBooking.panditName,
        samagriChoice: this.state.draftBooking.samagriChoice,
        paymentMethod: method,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        statusHistory: [
          { status: 'Confirmed', timestamp: new Date().toISOString(), note: 'Slot locked with Vedic Muhurat' }
        ],
        review: null
      };

      this.state.bookings.unshift(newBooking);
      this.state.currentActiveBookingId = id;
      this.state.view = 'confirmation';

      this.logTelemetry('INFO', 'BOOKING_CONFIRMED', `Created booking ${id} for ${newBooking.ritualName}`);
      this.notify();
      return newBooking;
    }

    getActiveBooking() {
      if (!this.state.bookings || this.state.bookings.length === 0) return null;
      if (this.state.currentActiveBookingId) {
        const found = this.state.bookings.find(b => b.id === this.state.currentActiveBookingId);
        if (found) return found;
      }
      return this.state.bookings[0];
    }

    getBookingById(id) {
      return this.state.bookings.find(b => b.id === id) || null;
    }

    /**
     * Advance booking progression state machine
     */
    advanceBookingStatus(bookingId) {
      const booking = this.getBookingById(bookingId) || this.getActiveBooking();
      if (!booking) return null;

      const transitions = {
        'Confirmed': { next: 'Pandit Assigned', note: 'Pandit confirmed slot availability' },
        'Pandit Assigned': { next: 'Samagri Preparing', note: 'Unadulterated Samagri packed in hub' },
        'Samagri Preparing': { next: 'On The Way', note: 'Pandit in transit with sacred utensils' },
        'On The Way': { next: 'Arrived', note: 'Pandit reached doorstep for altar setup' },
        'Arrived': { next: 'Completed', note: 'Sankalp fulfilled & prasad distributed' },
        'Completed': { next: 'Completed', note: 'Ceremony already concluded' }
      };

      const step = transitions[booking.status] || transitions['Confirmed'];
      booking.status = step.next;
      booking.statusHistory.push({
        status: step.next,
        timestamp: new Date().toISOString(),
        note: step.note
      });

      // If completed, ensure it is recorded in family history
      if (step.next === 'Completed') {
        const existsInHistory = this.state.family.history.some(h => h.id === booking.id);
        if (!existsInHistory) {
          this.state.family.history.unshift({
            id: booking.id,
            ritual: booking.ritualName,
            date: booking.date,
            pandit: booking.panditName,
            package: booking.package,
            location: `${booking.location.address}, ${booking.location.city}`,
            status: 'Completed',
            sankalp: `For ${booking.ritualName} & family peace and prosperity`,
            rating: 5,
            review: null
          });
        }
      }

      this.logTelemetry('INFO', 'BOOKING_STATUS_ADVANCED', `Booking ${booking.id} transitioned to ${booking.status}`);
      this.notify();
      return booking;
    }

    /**
     * Cancel an active booking with automatic refund calculation
     */
    cancelBooking(bookingId, reason = 'User requested cancellation') {
      const booking = this.getBookingById(bookingId);
      if (!booking) return false;
      if (booking.status === 'Completed' || booking.status === 'Cancelled') return false;

      booking.status = 'Cancelled';
      booking.cancelledAt = new Date().toISOString();
      booking.cancellationReason = reason;

      // Calculate refund percentage: 100% full refund policy
      const refundAmount = booking.packagePrice;
      booking.refundAmount = refundAmount;
      booking.refundStatus = 'Initiated to original payment method (100% Escrow Refund)';

      booking.statusHistory.push({
        status: 'Cancelled',
        timestamp: new Date().toISOString(),
        note: `Cancelled. ${reason}. Refund of ₹${refundAmount.toLocaleString('en-IN')} initiated.`
      });

      this.logTelemetry('INFO', 'BOOKING_CANCELLED', `Booking ${booking.id} cancelled. Refund: ₹${refundAmount}`);
      this.notify();
      return true;
    }

    /**
     * Reschedule booking to new date & muhurat
     */
    rescheduleBooking(bookingId, newDate, newTime, newMuhurat) {
      const booking = this.getBookingById(bookingId);
      if (!booking || booking.status === 'Completed' || booking.status === 'Cancelled') return false;

      const oldSlot = `${booking.date} · ${booking.time}`;
      booking.date = newDate;
      booking.time = newTime;
      if (newMuhurat) booking.muhuratType = newMuhurat;

      booking.statusHistory.push({
        status: booking.status,
        timestamp: new Date().toISOString(),
        note: `Rescheduled from ${oldSlot} to ${newDate} · ${newTime}`
      });

      this.logTelemetry('INFO', 'BOOKING_RESCHEDULED', `Booking ${booking.id} rescheduled to ${newDate}`);
      this.notify();
      return true;
    }

    /**
     * Submit rating & review for completed ritual
     */
    submitReview(bookingId, rating, comment, devotee = 'Drishti Family') {
      const cleanComment = Security.sanitizeText(comment, 500);
      const numRating = Math.max(1, Math.min(5, Number(rating) || 5));

      const booking = this.getBookingById(bookingId);
      if (booking) {
        booking.review = {
          rating: numRating,
          comment: cleanComment,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };
      }

      // Update in family history if present
      const hist = this.state.family.history.find(h => h.id === bookingId);
      if (hist) {
        hist.rating = numRating;
        hist.review = cleanComment;
      }

      this.logTelemetry('INFO', 'REVIEW_SUBMITTED', `Review submitted for booking ${bookingId} (${numRating}★)`);
      this.notify();
      return true;
    }

    // ========================================================================
    // Family Member CRUD
    // ========================================================================

    addFamilyMember(memberData) {
      const cleanName = Security.sanitizeText(memberData.name, 50);
      if (!cleanName) return null;

      const newMember = {
        id: 'm-' + Date.now(),
        name: cleanName,
        role: Security.sanitizeText(memberData.role, 30) || 'Family Member',
        avatar: memberData.avatar || '🧒',
        rashi: memberData.rashi || 'Aries',
        nakshatra: memberData.nakshatra || 'Ashwini'
      };

      this.state.family.members.push(newMember);
      this.logTelemetry('INFO', 'FAMILY_MEMBER_ADDED', `Added member ${cleanName}`);
      this.notify();
      return newMember;
    }

    updateFamilyMember(memberId, memberData) {
      const member = this.state.family.members.find(m => m.id === memberId);
      if (!member) return false;

      if (memberData.name) member.name = Security.sanitizeText(memberData.name, 50);
      if (memberData.role) member.role = Security.sanitizeText(memberData.role, 30);
      if (memberData.rashi) member.rashi = memberData.rashi;
      if (memberData.nakshatra) member.nakshatra = memberData.nakshatra;

      this.logTelemetry('INFO', 'FAMILY_MEMBER_UPDATED', `Updated member ${memberId}`);
      this.notify();
      return true;
    }

    deleteFamilyMember(memberId) {
      const idx = this.state.family.members.findIndex(m => m.id === memberId);
      if (idx === -1) return false;
      const removed = this.state.family.members.splice(idx, 1)[0];
      this.logTelemetry('INFO', 'FAMILY_MEMBER_DELETED', `Deleted member ${removed.name}`);
      this.notify();
      return true;
    }

    // ========================================================================
    // Temple Seva
    // ========================================================================

    recordSeva(templeName, amount, title = 'Sacred Archana & Deepdaan') {
      const receiptId = 'SEVA-2026-' + Math.floor(100 + Math.random() * 900);
      const newSeva = {
        id: receiptId,
        temple: templeName,
        amount: amount,
        title: title,
        date: 'Just now',
        family: this.state.family.name,
        gotra: this.state.family.gotra,
        status: 'Confirmed'
      };

      this.state.sevaOfferings.unshift(newSeva);
      this.logTelemetry('INFO', 'SEVA_RECORDED', `Seva ${receiptId} recorded for ${amount}`);
      this.notify();
      return newSeva;
    }

    // ========================================================================
    // Japa Beads (108 Cycle)
    // ========================================================================

    incrementJapa() {
      this.state.japa.count++;
      this.state.japa.totalLifetimeBeads++;

      let completedRound = false;
      if (this.state.japa.count >= this.state.japa.target) {
        this.state.japa.count = 0;
        this.state.japa.rounds++;
        completedRound = true;
      }

      this.notify();
      return {
        count: this.state.japa.count,
        rounds: this.state.japa.rounds,
        completedRound: completedRound
      };
    }

    resetJapa() {
      this.state.japa.count = 0;
      this.state.japa.rounds = 0;
      this.notify();
    }

    // ========================================================================
    // Notifications
    // ========================================================================

    markNotificationRead(notifId) {
      const notif = this.state.notifications.find(n => n.id === notifId);
      if (notif) {
        notif.read = true;
        this.notify();
      }
    }

    markAllNotificationsRead() {
      this.state.notifications.forEach(n => n.read = true);
      this.notify();
    }

    // ========================================================================
    // Backup, Export & Reset
    // ========================================================================

    exportStateJSON() {
      return JSON.stringify(this.state, null, 2);
    }

    importStateJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
        if (!parsed.family || !parsed.user) throw new Error('Missing core family/user objects');
        parsed.schemaVersion = CURRENT_SCHEMA_VERSION;
        this.state = parsed;
        this.logTelemetry('INFO', 'STATE_IMPORTED', 'User imported ritual state archive');
        this.notify();
        return true;
      } catch (e) {
        console.error('Aaradhya Store: Import error', e);
        return false;
      }
    }

    resetToDefaults() {
      this.state = getDefaultState();
      this.logTelemetry('INFO', 'STATE_RESET', 'Restored pristine demo state');
      this.notify();
    }
  }

  // Return singleton instance
  const instance = new Store();
  return instance;
}));
