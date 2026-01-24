/**
 * Phone Number Formatter Utility
 * Format: (+1)-234-567-8900
 * Max: 12 digits (excluding country code)
 */

/**
 * Format phone number to (+1)-234-567-8900 pattern
 * @param {string} value - Raw phone input
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (value) => {
  if (!value) return "";

  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Limit to 11 digits total (1 for country code + 10 for number)
  const limitedNumbers = numbers.slice(0, 11);

  // If empty, return empty
  if (limitedNumbers.length === 0) return "";

  // Format based on length
  if (limitedNumbers.length <= 1) {
    // Just country code
    return `(+${limitedNumbers}`;
  } else if (limitedNumbers.length <= 4) {
    // (+1)-234
    return `(+${limitedNumbers[0]})-${limitedNumbers.slice(1)}`;
  } else if (limitedNumbers.length <= 7) {
    // (+1)-234-567
    return `(+${limitedNumbers[0]})-${limitedNumbers.slice(1, 4)}-${limitedNumbers.slice(4)}`;
  } else {
    // (+1)-234-567-8900
    return `(+${limitedNumbers[0]})-${limitedNumbers.slice(1, 4)}-${limitedNumbers.slice(4, 7)}-${limitedNumbers.slice(7, 11)}`;
  }
};

/**
 * Extract raw numbers from formatted phone
 * @param {string} formattedPhone - Formatted phone number
 * @returns {string} - Raw numbers only
 */
export const extractPhoneNumbers = (formattedPhone) => {
  if (!formattedPhone) return "";
  return formattedPhone.replace(/\D/g, "");
};

/**
 * Validate phone number (must be exactly 11 digits)
 * @param {string} phone - Phone number (formatted or raw)
 * @returns {boolean} - Is valid
 */
export const isValidPhone = (phone) => {
  const numbers = extractPhoneNumbers(phone);
  return numbers.length === 11 && numbers.startsWith("1");
};

/**
 * Hook for phone input formatting
 * @returns {object} - Phone formatting utilities
 */
export const usePhoneFormatter = () => {
  const handlePhoneChange = (e, setFieldValue, fieldName = "phone") => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    setFieldValue(fieldName, formatted);
  };

  const handlePhoneKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].includes(e.keyCode) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress if not
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  return {
    formatPhoneNumber,
    extractPhoneNumbers,
    isValidPhone,
    handlePhoneChange,
    handlePhoneKeyDown,
  };
};
