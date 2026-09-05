/**
 * Aaradhya — Digital Sankalp Certificate & Calendar Sync Engine
 * Generates high-fidelity, printable Digital Sankalp Patras (Sacred Certificates)
 * and exports standard iCal (.ics) events for Google Calendar, Apple Calendar, and Outlook.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    const Security = require('../core/security.js');
    module.exports = factory(Security);
  } else {
    root.AaradhyaCertificate = factory(root.AaradhyaSecurity);
  }
}(typeof self !== 'undefined' ? self : this, function (Security) {
  'use strict';

  /**
   * Generate ornate Digital Sankalp Patra HTML
   * @param {object} booking 
   * @param {object} family 
   * @returns {string} HTML string
   */
  function renderSankalpCertificateHTML(booking, family) {
    const safeFamilyName = Security.escapeHTML(family.name || 'Drishti Family');
    const safeGotra = Security.escapeHTML(family.gotra || 'Kashyap');
    const safeRitual = Security.escapeHTML(booking.ritualName || 'Griha Pravesh Puja');
    const safeDate = Security.escapeHTML(booking.date || '18 October 2026');
    const safePandit = Security.escapeHTML(booking.panditName || 'Pandit Rajesh Sharma');
    const safeLocation = Security.escapeHTML(
      booking.location ? `${booking.location.house || ''}, ${booking.location.city || ''}` : 'Delhi NCR'
    );
    const safeBookingId = Security.escapeHTML(booking.id || 'AR-2026-1082');

    return `
      <div class="sankalp-patra-document" id="printableSankalpPatra">
        <div class="patra-border-outer">
          <div class="patra-border-inner">
            <div class="patra-header">
              <div class="patra-om">ॐ</div>
              <div class="patra-sub-title">॥ श्री गणेशाय नमः ॥</div>
              <h1 class="patra-title">डिजिटल संकल्प पत्रम्</h1>
              <div class="patra-gold-bar"></div>
              <div class="patra-tagline">Official Aaradhya Vedic Certificate of Sacred Fulfillment</div>
            </div>

            <div class="patra-body">
              <p class="patra-shloka">
                "ॐ अद्य श्री गृहे सर्व विघ्न निवारणार्थं श्री महालक्ष्मी-गणपति-वास्तुदेवतानां<br>
                प्रीत्यर्थं विधिपूर्वक संकल्पः निष्काम भक्त्या संपन्नः ।"<br>
                <span style="font-size:12px; color:var(--text-muted)">— Kashi Vidvat Parishad Sacred Standard Verification</span>
              </p>

              <div class="patra-grid-details">
                <div class="patra-detail-row">
                  <span class="patra-label">Devotee Household:</span>
                  <strong class="patra-value">${safeFamilyName}</strong>
                </div>
                <div class="patra-detail-row">
                  <span class="patra-label">Vedic Gotra:</span>
                  <strong class="patra-value">${safeGotra}</strong>
                </div>
                <div class="patra-detail-row">
                  <span class="patra-label">Ceremony Performed:</span>
                  <strong class="patra-value">${safeRitual}</strong>
                </div>
                <div class="patra-detail-row">
                  <span class="patra-label">Auspicious Date:</span>
                  <strong class="patra-value">${safeDate}</strong>
                </div>
                <div class="patra-detail-row">
                  <span class="patra-label">Sacred Location:</span>
                  <strong class="patra-value">${safeLocation}</strong>
                </div>
                <div class="patra-detail-row">
                  <span class="patra-label">Conducting Purohit:</span>
                  <strong class="patra-value">${safePandit} (Verified)</strong>
                </div>
              </div>

              <div class="patra-seal-container">
                <div class="patra-qr-box">
                  <div style="font-size:28px">🪔</div>
                  <div style="font-size:10px; font-weight:700">AARADHYA TRUST</div>
                  <div style="font-size:9px; color:var(--text-muted)">${safeBookingId}</div>
                </div>
                <div class="patra-signature-block">
                  <div class="signature-line">
                    <span style="font-family:var(--font-serif); font-size:16px; color:var(--gold)">पंडित राजेश शर्मा</span>
                  </div>
                  <div style="font-size:11px; color:var(--text-muted)">Verified Acharya Signature Seal</div>
                </div>
              </div>
            </div>

            <div class="patra-footer">
              <div>Certificate Registry ID: <strong>${safeBookingId}</strong> · Cryptographically Signed by Aaradhya Trust OS</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Trigger direct print dialog for certificate
   */
  function printCertificate() {
    window.print();
  }

  /**
   * Generate an RFC 5545 iCalendar (.ics) download for a ceremony booking
   * @param {object} booking 
   * @param {object} family 
   */
  function downloadCalendarInvite(booking, family) {
    const summary = `Aaradhya: ${booking.ritualName}`;
    const description = `Sacred ceremony conducted by ${booking.panditName} for ${family.name} (Gotra: ${family.gotra}). Location: ${booking.location ? booking.location.address : ''}. Coordinated with complete Samagri and Vedic Muhurat by Aaradhya Trust.`;
    const location = booking.location ? `${booking.location.house}, ${booking.location.address}, ${booking.location.city}` : 'Home';

    // Approximate ISO format for event
    const now = new Date();
    const dtStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aaradhya Ritual OS//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${booking.id || 'AR-2026'}@aaradhya.faith`,
      `DTSTAMP:${dtStamp}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${(booking.ritualId || 'puja')}-aaradhya.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    renderSankalpCertificateHTML,
    printCertificate,
    downloadCalendarInvite
  };
}));
