/**
 * Environment Variables Validation
 * This file validates that all required environment variables are present
 */

export interface EnvironmentConfig {
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DATABASE_URL: string;
  NODE_ENV: string;
}

function validateEnvironmentVariable(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function validateJWTSecret(secret: string): string {
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  return secret;
}

// Validate all required environment variables
export const env: EnvironmentConfig = {
  JWT_SECRET: validateJWTSecret(
    validateEnvironmentVariable('JWT_SECRET', process.env.JWT_SECRET)
  ),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DATABASE_URL: validateEnvironmentVariable('DATABASE_URL', process.env.DATABASE_URL),
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Export individual environment variables for convenience
export const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DATABASE_URL,
  NODE_ENV,
} = env;
