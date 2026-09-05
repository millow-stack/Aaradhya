/**
 * Aaradhya — Automated Unit & Integration Test Suite
 * Zero-dependency Node.js test runner verifying core security, state machines,
 * calculations, and persistence logic.
 */

const assert = require('assert');
const Security = require('../js/core/security.js');
const Catalog = require('../js/data/catalog.js');
const Panchang = require('../js/services/panchang.js');
const Store = require('../js/core/store.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function it(description, testFn) {
  totalTests++;
  try {
    testFn();
    passedTests++;
    console.log(`  ✓ ${description}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
  }
}

function describe(suiteName, suiteFn) {
  console.log(`\n▶ ${suiteName}`);
  suiteFn();
}

// ============================================================================
// 1. Security & Input Validation Tests
// ============================================================================
describe('Security & XSS Immunization', () => {
  it('should escape HTML tags and malicious scripts from user input', () => {
    const malicious = '<script>alert("xss")</script>';
    const safe = Security.escapeHTML(malicious);
    assert.strictEqual(safe, '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('should escape quotes and ampersands', () => {
    const input = 'Drishti & "Vikram" \'Family\'';
    const safe = Security.escapeHTML(input);
    assert.strictEqual(safe, 'Drishti &amp; &quot;Vikram&quot; &#39;Family&#39;');
  });

  it('should safely handle null and undefined without throwing', () => {
    assert.strictEqual(Security.escapeHTML(null), '');
    assert.strictEqual(Security.escapeHTML(undefined), '');
  });

  it('should validate Indian mobile numbers correctly', () => {
    assert.strictEqual(Security.isValidPhone('+91 98765 43210'), true);
    assert.strictEqual(Security.isValidPhone('9876543210'), true);
    assert.strictEqual(Security.isValidPhone('12345'), false);
    assert.strictEqual(Security.isValidPhone('abcd'), false);
    assert.strictEqual(Security.isValidPhone(''), false);
  });

  it('should validate 6-digit Indian pincodes', () => {
    assert.strictEqual(Security.isValidPincode('201301'), true);
    assert.strictEqual(Security.isValidPincode('110001'), true);
    assert.strictEqual(Security.isValidPincode('012345'), false); // Cannot start with 0
    assert.strictEqual(Security.isValidPincode('20130'), false);  // Only 5 digits
    assert.strictEqual(Security.isValidPincode('2013012'), false);// 7 digits
  });

  it('should sanitize input text and strip ASCII control characters', () => {
    const dirty = '  Aarav\x00\x08 Kumar  ';
    const clean = Security.sanitizeText(dirty, 30);
    assert.strictEqual(clean, 'Aarav Kumar');
  });

  it('should validate person names properly', () => {
    assert.strictEqual(Security.isValidName('Aarav Sharma'), true);
    assert.strictEqual(Security.isValidName('A'), false); // too short
    assert.strictEqual(Security.isValidName(''), false);
  });
});

// ============================================================================
// 2. Dynamic Vedic Panchang Engine Tests
// ============================================================================
describe('Vedic Panchang & Astronomical Muhurat Engine', () => {
  it('should compute valid Tithi and Nakshatra for any given Gregorian date', () => {
    const testDate = new Date('2026-10-18T10:00:00Z');
    const panchang = Panchang.calculatePanchang(testDate, 'Delhi NCR');

    assert.ok(panchang.tithi, 'Tithi should be populated');
    assert.ok(panchang.nakshatra, 'Nakshatra should be populated');
    assert.ok(panchang.rahuKaal, 'Rahu Kaal should be calculated');
    assert.ok(panchang.abhijitMuhurat, 'Abhijit Muhurat should be present');
    assert.strictEqual(Array.isArray(panchang.choghadiya), true);
    assert.strictEqual(panchang.choghadiya.length, 8);
  });

  it('should return correct Rahu Kaal for Sunday', () => {
    // 2026-10-18 is a Sunday
    const sunday = new Date('2026-10-18T12:00:00Z');
    const p = Panchang.calculatePanchang(sunday);
    assert.strictEqual(p.rahuKaal, '04:30 PM – 06:00 PM');
  });

  it('should return correct Rahu Kaal for Monday', () => {
    // 2026-10-19 is a Monday
    const monday = new Date('2026-10-19T12:00:00Z');
    const p = Panchang.calculatePanchang(monday);
    assert.strictEqual(p.rahuKaal, '07:30 AM – 09:00 AM');
  });
});

// ============================================================================
// 3. Multi-Booking State Machine & Business Logic Tests
// ============================================================================
describe('Booking State Machine & Financial Escrow Logic', () => {
  it('should create a new booking with unique booking ID and Confirmed status', () => {
    Store.resetToDefaults();
    Store.startBookingFlow('griha-pravesh');
    Store.setBookingPackage('Premium', 8999);
    Store.setBookingSlot('18 October 2026', '10:00 AM – 12:15 PM', 'Shubh Choghadiya');
    Store.setBookingLocation({
      house: 'Tower B, 702',
      address: 'Skyline Residency',
      city: 'Delhi NCR',
      pincode: '201301'
    });

    const booking = Store.confirmPayment('UPI (Escrow)');
    assert.ok(booking.id.startsWith('AR-2026-'), 'Booking ID should start with AR-2026-');
    assert.strictEqual(booking.status, 'Confirmed');
    assert.strictEqual(booking.packagePrice, 8999);
    assert.strictEqual(Store.getActiveBooking().id, booking.id);
  });

  it('should advance booking status correctly through the 6-step operational lifecycle', () => {
    const booking = Store.getActiveBooking();
    assert.strictEqual(booking.status, 'Confirmed');

    Store.advanceBookingStatus(booking.id);
    assert.strictEqual(booking.status, 'Pandit Assigned');

    Store.advanceBookingStatus(booking.id);
    assert.strictEqual(booking.status, 'Samagri Preparing');

    Store.advanceBookingStatus(booking.id);
    assert.strictEqual(booking.status, 'On The Way');

    Store.advanceBookingStatus(booking.id);
    assert.strictEqual(booking.status, 'Arrived');

    Store.advanceBookingStatus(booking.id);
    assert.strictEqual(booking.status, 'Completed');

    // Should record in family history
    const foundInHistory = Store.getState().family.history.find(h => h.id === booking.id);
    assert.ok(foundInHistory, 'Completed ritual must be recorded in Family Ritual History');
  });

  it('should submit rating and review for a completed ritual', () => {
    const booking = Store.getActiveBooking();
    assert.strictEqual(booking.status, 'Completed');

    Store.submitReview(booking.id, 5, 'Divine experience with Pandit Rajesh Sharma.');
    assert.ok(booking.review, 'Booking review should be populated');
    assert.strictEqual(booking.review.rating, 5);
    assert.strictEqual(booking.review.comment, 'Divine experience with Pandit Rajesh Sharma.');
  });

  it('should allow booking cancellation and compute 100% sacred escrow refund', () => {
    // Create a fresh booking to cancel
    Store.startBookingFlow('satyanarayan');
    Store.setBookingPackage('Essential', 3500);
    const newBooking = Store.confirmPayment('UPI');

    assert.strictEqual(newBooking.status, 'Confirmed');
    const success = Store.cancelBooking(newBooking.id, 'Change of travel plans');

    assert.strictEqual(success, true);
    assert.strictEqual(newBooking.status, 'Cancelled');
    assert.strictEqual(newBooking.refundAmount, 3500);
    assert.ok(newBooking.refundStatus.includes('100% Escrow Refund'));
  });

  it('should allow rescheduling an active booking', () => {
    Store.startBookingFlow('havan');
    Store.setBookingPackage('Essential', 2500);
    const b = Store.confirmPayment('UPI');

    const rescheduled = Store.rescheduleBooking(b.id, '25 October 2026', '11:00 AM', 'Abhijit Muhurat');
    assert.strictEqual(rescheduled, true);
    assert.strictEqual(b.date, '25 October 2026');
    assert.strictEqual(b.time, '11:00 AM');
  });
});

// ============================================================================
// 4. Family Ritual OS (CRUD & Japa Mala) Tests
// ============================================================================
describe('Family Ritual OS & Sacred Utilities', () => {
  it('should add, update, and delete family members safely', () => {
    const initialCount = Store.getState().family.members.length;

    // Add
    const added = Store.addFamilyMember({
      name: 'Aarav',
      role: 'Son',
      rashi: 'Gemini',
      nakshatra: 'Ardra'
    });
    assert.ok(added.id, 'Added member must have an ID');
    assert.strictEqual(Store.getState().family.members.length, initialCount + 1);

    // Update
    Store.updateFamilyMember(added.id, { role: 'Elder Son' });
    const updated = Store.getState().family.members.find(m => m.id === added.id);
    assert.strictEqual(updated.role, 'Elder Son');

    // Delete
    const deleted = Store.deleteFamilyMember(added.id);
    assert.strictEqual(deleted, true);
    assert.strictEqual(Store.getState().family.members.length, initialCount);
  });

  it('should increment Japa counts and complete a round on reaching 108', () => {
    Store.resetJapa();
    assert.strictEqual(Store.getState().japa.count, 0);

    for (let i = 0; i < 107; i++) {
      Store.incrementJapa();
    }
    assert.strictEqual(Store.getState().japa.count, 107);
    assert.strictEqual(Store.getState().japa.rounds, 0);

    const result = Store.incrementJapa(); // 108th bead
    assert.strictEqual(result.count, 0);
    assert.strictEqual(result.rounds, 1);
    assert.strictEqual(result.completedRound, true);
  });

  it('should record Temple Seva offering and generate receipt ID', () => {
    const seva = Store.recordSeva('Shri Kashi Vishwanath', '₹1,001', 'Ganga Aarti Deepdaan');
    assert.ok(seva.id.startsWith('SEVA-2026-'));
    assert.strictEqual(seva.amount, '₹1,001');
    assert.strictEqual(Store.getState().sevaOfferings[0].id, seva.id);
  });

  it('should export and import state JSON archive without corruption', () => {
    const exportedJSON = Store.exportStateJSON();
    assert.strictEqual(typeof exportedJSON, 'string');

    const success = Store.importStateJSON(exportedJSON);
    assert.strictEqual(success, true);
    assert.strictEqual(Store.getState().schemaVersion, 2);
  });
});

// ============================================================================
// Final Summary Report
// ============================================================================
console.log('\n========================================');
console.log(`Test Execution Summary:`);
console.log(`Total Tests Run: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log('========================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('All automated tests passed successfully!');
  process.exit(0);
}
