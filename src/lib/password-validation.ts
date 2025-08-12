/**
 * Password validation utilities
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
};

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`);
  } else {
    score += 1;
  }

  // Check maximum length
  if (password.length > passwordRequirements.maxLength) {
    errors.push(`Password must not exceed ${passwordRequirements.maxLength} characters`);
  }

  // Check for uppercase letters
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Check for lowercase letters
  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Check for numbers
  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/\d/.test(password)) {
    score += 1;
  }

  // Check for special characters
  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    score += 1;
  }

  // Additional checks for strength
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Check for common patterns (reduce score)
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns that are easy to guess');
      score = Math.max(0, score - 2);
      break;
    }
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters (e.g., "aaa")');
    score = Math.max(0, score - 1);
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

export function generatePasswordStrengthMessage(result: PasswordValidationResult): string {
  if (result.isValid) {
    return `Password strength: ${result.strength.toUpperCase()}`;
  }

  const baseMessage = result.errors.join('. ');
  const strengthMessage = ` Current strength: ${result.strength.toUpperCase()}.`;
  
  return baseMessage + strengthMessage;
}

export function isStrongPassword(password: string): boolean {
  const result = validatePassword(password);
  return result.isValid && result.strength === 'strong';
}

// Zod schema for password validation
export const passwordSchema = {
  password: (password: string) => {
    const result = validatePassword(password);
    if (!result.isValid) {
      throw new Error(result.errors[0]); // Return first error for Zod
    }
    return password;
  }
};
