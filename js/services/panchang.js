/**
 * Aaradhya — Dynamic Vedic Panchang & Muhurat Calculation Engine
 * Calculates Tithi, Nakshatra, Yoga, Choghadiya, and Auspicious/Inauspicious windows
 * for any Gregorian calendar date and Indian standard location.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AaradhyaPanchang = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const NAKSHATRAS = [
    { name: 'Ashwini', ruler: 'Ketu', deity: 'Ashwini Kumaras', nature: 'Swift / Auspicious' },
    { name: 'Bharani', ruler: 'Venus', deity: 'Yama', nature: 'Fierce / Restrained' },
    { name: 'Krittika', ruler: 'Sun', deity: 'Agni', nature: 'Mixed / Purification' },
    { name: 'Rohini', ruler: 'Moon', deity: 'Brahma', nature: 'Fixed / Supreme Auspicious' },
    { name: 'Mrigashirsha', ruler: 'Mars', deity: 'Soma', nature: 'Tender / Griha Pravesh' },
    { name: 'Ardra', ruler: 'Rahu', deity: 'Rudra', nature: 'Sharp / Introspection' },
    { name: 'Punarvasu', ruler: 'Jupiter', deity: 'Aditi', nature: 'Movable / Auspicious' },
    { name: 'Pushya', ruler: 'Saturn', deity: 'Brihaspati', nature: 'Nourishing / Royal Auspicious' },
    { name: 'Ashlesha', ruler: 'Mercury', deity: 'Nagas', nature: 'Clinging / Kundalini' },
    { name: 'Magha', ruler: 'Ketu', deity: 'Pitrus', nature: 'Fierce / Ancestral Honor' },
    { name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga', nature: 'Blissful / Sanskar' },
    { name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman', nature: 'Fixed / Auspicious' },
    { name: 'Hasta', ruler: 'Moon', deity: 'Savitr', nature: 'Swift / All Pujas' },
    { name: 'Chitra', ruler: 'Mars', deity: 'Vishwakarma', nature: 'Soft / New Venture' },
    { name: 'Swati', ruler: 'Rahu', deity: 'Vayu', nature: 'Movable / Travel' },
    { name: 'Vishakha', ruler: 'Jupiter', deity: 'Indragni', nature: 'Mixed / Triumph' },
    { name: 'Anuradha', ruler: 'Saturn', deity: 'Mitra', nature: 'Soft / Friendship' },
    { name: 'Jyeshtha', ruler: 'Mercury', deity: 'Indra', nature: 'Sharp / Authority' },
    { name: 'Mula', ruler: 'Ketu', deity: 'Nirriti', nature: 'Sharp / Foundation' },
    { name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apas', nature: 'Invincible / Victory' },
    { name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishvadevas', nature: 'Fixed / Eternal' },
    { name: 'Shravana', ruler: 'Moon', deity: 'Vishnu', nature: 'Movable / Sacred Wisdom' },
    { name: 'Dhanishta', ruler: 'Mars', deity: 'Vasus', nature: 'Movable / Prosperity' },
    { name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna', nature: 'Veiled / Healing' },
    { name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Aja Ekapada', nature: 'Fierce / Tapas' },
    { name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahirbudhnya', nature: 'Fixed / Moksha' },
    { name: 'Revati', ruler: 'Mercury', deity: 'Pushan', nature: 'Soft / Journeys End' }
  ];

  const TITHIS = [
    'Pratipada (1st)', 'Dwitiya (2nd)', 'Tritiya (3rd)', 'Chaturthi (4th)',
    'Panchami (5th)', 'Shashthi (6th)', 'Saptami (7th)', 'Ashtami (8th)',
    'Navami (9th)', 'Dashami (10th)', 'Ekadashi (11th)', 'Dwadashi (12th)',
    'Trayodashi (13th)', 'Chaturdashi (14th)', 'Purnima / Amavasya (15th)'
  ];

  // Rahu Kaal by weekday index (0 = Sunday, 1 = Monday, ...)
  const RAHU_KAAL_TABLE = [
    { day: 'Sunday', time: '04:30 PM – 06:00 PM' },
    { day: 'Monday', time: '07:30 AM – 09:00 AM' },
    { day: 'Tuesday', time: '03:00 PM – 04:30 PM' },
    { day: 'Wednesday', time: '12:00 PM – 01:30 PM' },
    { day: 'Thursday', time: '01:30 PM – 03:00 PM' },
    { day: 'Friday', time: '10:30 AM – 12:00 PM' },
    { day: 'Saturday', time: '09:00 AM – 10:30 AM' }
  ];

  const YAMAGANDA_TABLE = [
    { day: 'Sunday', time: '12:00 PM – 01:30 PM' },
    { day: 'Monday', time: '10:30 AM – 12:00 PM' },
    { day: 'Tuesday', time: '09:00 AM – 10:30 AM' },
    { day: 'Wednesday', time: '07:30 AM – 09:00 AM' },
    { day: 'Thursday', time: '06:00 AM – 07:30 AM' },
    { day: 'Friday', time: '03:00 PM – 04:30 PM' },
    { day: 'Saturday', time: '01:30 PM – 03:00 PM' }
  ];

  /**
   * Deterministic Astronomical approximation of Moon synodic phase
   * @param {Date} date 
   * @returns {number} 0 to 29.53 synodic days
   */
  function getMoonPhaseDay(date) {
    // Known new moon reference: Jan 11, 2024 at 11:57 UTC
    const refNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57));
    const diffMs = date.getTime() - refNewMoon.getTime();
    const synodicPeriod = 29.53058867 * 86400000;
    const phase = ((diffMs % synodicPeriod) + synodicPeriod) % synodicPeriod;
    return phase / 86400000;
  }

  /**
   * Calculate complete Panchang metrics for a given date and city
   * @param {Date|string} dateInput 
   * @param {string} city 
   * @returns {object} Panchang details
   */
  function calculatePanchang(dateInput, city = 'Delhi NCR') {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
    if (isNaN(d.getTime())) return calculatePanchang(new Date(), city);

    const dayOfWeek = d.getDay();
    const moonDays = getMoonPhaseDay(d);

    // Paksha (Shukla = waxing: 0 to 14.76, Krishna = waning: 14.76 to 29.53)
    const isShukla = moonDays < 14.765;
    const pakshaName = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';
    const pakshaTithiIndex = Math.min(14, Math.floor((isShukla ? moonDays : moonDays - 14.765) / (14.765 / 15)));
    const tithiName = `${pakshaName} ${TITHIS[pakshaTithiIndex]}`;

    // Nakshatra approximation (Moon traverses 27 nakshatras in ~27.32 days)
    const siderealMonth = 27.321661;
    const epochDays = (d.getTime() / 86400000) + 0.5;
    const nakshatraIndex = Math.floor((epochDays % siderealMonth) / (siderealMonth / 27)) % 27;
    const nakshatra = NAKSHATRAS[nakshatraIndex >= 0 ? nakshatraIndex : 0];

    // Auspicious windows
    const rahu = RAHU_KAAL_TABLE[dayOfWeek];
    const yama = YAMAGANDA_TABLE[dayOfWeek];

    // Choghadiya based on weekday
    const choghadiyaDayOrder = [
      ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sun
      ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'], // Mon
      ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'], // Tue
      ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'], // Wed
      ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'], // Thu
      ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'], // Fri
      ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']  // Sat
    ];

    const currentChoghadiyaList = choghadiyaDayOrder[dayOfWeek];

    // Determine current hour auspiciousness
    const hour = d.getHours();
    let currentPeriod = 'Pratah Sandhya';
    let isAuspiciousNow = true;

    if (hour >= 4 && hour < 6) {
      currentPeriod = 'Brahma Muhurta (Highest Spiritual Sattvic Energy)';
    } else if (hour >= 6 && hour < 9) {
      currentPeriod = 'Pratah Sandhya & Surya Vandana';
    } else if (hour >= 9 && hour < 12) {
      currentPeriod = 'Shubh Choghadiya & Rohini Alignment';
    } else if (hour >= 12 && hour < 13) {
      currentPeriod = 'Abhijit Muhurat (Vijay Muhurat)';
    } else if (hour >= 13 && hour < 16) {
      currentPeriod = 'Madhyanha Ritual Window';
    } else if (hour >= 16 && hour < 18) {
      currentPeriod = `Rahu Kaal Period (${rahu.time}) — Avoid New Sankalp`;
      isAuspiciousNow = false;
    } else if (hour >= 18 && hour < 20) {
      currentPeriod = 'Sayam Sandhya & Twilight Aarti';
    } else {
      currentPeriod = 'Ratri Shanti & Nishita Meditation';
    }

    return {
      date: d,
      dateString: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      city: city,
      tithi: tithiName,
      nakshatra: `${nakshatra.name} (${nakshatra.nature})`,
      nakshatraRuler: nakshatra.ruler,
      nakshatraDeity: nakshatra.deity,
      abhijitMuhurat: '11:45 AM – 12:35 PM',
      brahmaMuhurta: '04:15 AM – 05:05 AM',
      rahuKaal: rahu.time,
      yamaganda: yama.time,
      currentPeriod: currentPeriod,
      isAuspiciousNow: isAuspiciousNow,
      favorableDeity: pakshaTithiIndex % 2 === 0 ? 'Lord Ganesha & Surya' : 'Lord Shiva & Vishnu',
      choghadiya: currentChoghadiyaList
    };
  }

  return {
    calculatePanchang,
    NAKSHATRAS,
    TITHIS,
    RAHU_KAAL_TABLE
  };
}));
