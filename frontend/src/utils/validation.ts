/**
 * src/utils/validation.ts
 * 
 * A centralized module for reusable form validation logic and error messages.
 */

// --- Reusable Regular Expressions ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Validation Constants / Error Messages ---
export const PasswordLengthError = "Password must be at least 8 characters.";
export const PasswordsDontMatchError = "Passwords don't match.";
export const InvalidEmailError = "Please enter a valid email address.";
export const NameLengthError = (name: string) => `${name} must be at least 2 characters.`;
export const RequiredFieldError = (field: string) => `${field} is a required field.`;
export const PhoneNumberError = "Please enter a valid phone number.";
export const WeeksInAdvanceError = "Must be an integer of at least 1.";

// --- Validation Functions ---

/**
 * Validates if a given string meets the minimum password length requirement.
 * @param password The password string to validate.
 * @returns True if the password is valid, false otherwise.
 */
export const isPasswordLongEnough = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validates if a given string is a valid email format.
 * @param email The email string to validate.
 * @returns True if the email format is valid, false otherwise.
 */
export const isEmailValid = (email: string): boolean => {
  return emailRegex.test(email);
};

/**
 * Validates if a given name meets the minimum length requirement.
 * @param name The name string to validate.
 * @returns True if the name is valid, false otherwise.
 */
export const isNameValid = (name: string): boolean => {
  return name.trim().length >= 2;
};

/**
 * Validates if a given phone number meets a minimum length requirement.
 * @param phone The phone number string to validate.
 * @returns True if the phone number is valid, false otherwise.
 */
export const isPhoneValid = (phone: string): boolean => {
    return phone.trim().length >= 10;
};
