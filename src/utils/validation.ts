/**
 * Validates an email address format.
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'Error: Email address cannot be empty.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Error: Please enter a valid email address.';
  }
  return null;
};

/**
 * Validates a password based on minimum security requirements.
 */
export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return 'Error: Password cannot be empty.';
  }
  if (password.length < 6) {
    return 'Error: Password must be at least 6 characters long.';
  }
  return null;
};

/**
 * Validates Philippine mobile numbers (e.g., +639123456789 or 09123456789).
 */
export const validatePhoneNumber = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return 'Error: Phone number cannot be empty.';
  }
  const phoneRegex = /^(?:\+63|0)9\d{9}$/;
  if (!phoneRegex.test(phone.trim())) {
    return 'Error: Use a valid PH phone number (e.g., +639123456789).';
  }
  return null;
};

/**
 * Generic validator for required text inputs (e.g., Full Name, Vehicle Name).
 */
export const validateRequiredField = (value: string | undefined, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `Error: ${fieldName} cannot be empty.`;
  }
  return null;
};

/**
 * Validates login credentials specifically against the required empty-state checks.
 */
export const validateLogin = (email: string, password: string): string | null => {
  if (!email.trim() || !password.trim()) {
    return 'Error: Username and password cannot be empty.'; 
  }
  return null;
};