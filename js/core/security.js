/**
 * Aaradhya — Security & Input Validation Utilities
 * Defense-in-depth against XSS, injection, and invalid data entry.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AaradhyaSecurity = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Escape HTML special characters to prevent Cross-Site Scripting (XSS)
   * when rendering user-provided or dynamic strings into innerHTML.
   * @param {any} str - Input value
   * @returns {string} HTML-escaped string
   */
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Sanitize text input: trim whitespace and strip control characters
   * @param {string} str 
   * @param {number} maxLength 
   * @returns {string}
   */
  function sanitizeText(str, maxLength = 200) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim()
      .slice(0, maxLength);
  }

  /**
   * Validate Indian phone numbers (10 digits, optional +91 prefix)
   * @param {string} phone 
   * @returns {boolean}
   */
  function isValidPhone(phone) {
    if (!phone) return false;
    const cleaned = String(phone).replace(/[\s\-\(\)]/g, '');
    return /^(\+?91)?[6-9]\d{9}$/.test(cleaned);
  }

  /**
   * Format phone number to clean Indian format: +91 98765 43210
   * @param {string} phone 
   * @returns {string}
   */
  function formatPhone(phone) {
    if (!phone) return '';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
    }
    return phone.trim();
  }

  /**
   * Validate Indian 6-digit postal pincode
   * @param {string} pincode 
   * @returns {boolean}
   */
  function isValidPincode(pincode) {
    if (!pincode) return false;
    return /^[1-9][0-9]{5}$/.test(String(pincode).trim());
  }

  /**
   * Validate Gregorian date string (YYYY-MM-DD)
   * @param {string} dateStr 
   * @param {boolean} allowPast 
   * @returns {boolean}
   */
  function isValidDate(dateStr, allowPast = true) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    if (!allowPast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) return false;
    }
    return true;
  }

  /**
   * Validate person name (letters, spaces, dots, hyphens; min 2 chars)
   * @param {string} name 
   * @returns {boolean}
   */
  function isValidName(name) {
    if (!name) return false;
    const clean = sanitizeText(name, 60);
    return clean.length >= 2 && /^[\p{L}\s\.\-']+$/u.test(clean);
  }

  return {
    escapeHTML,
    sanitizeText,
    isValidPhone,
    formatPhone,
    isValidPincode,
    isValidDate,
    isValidName
  };
}));
