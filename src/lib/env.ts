/**
 * Environment Variables Validation
 * This file validates that all required environment variables are present
 */

export interface EnvironmentConfig {
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  DATABASE_URL: string;
  NODE_ENV: string;
}

function validateEnvironmentVariable(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function validateAuthSecret(secret: string): string {
  if (secret.length < 32) {
    throw new Error('BETTER_AUTH_SECRET must be at least 32 characters long');
  }
  return secret;
}

export const env: EnvironmentConfig = {
  BETTER_AUTH_SECRET: validateAuthSecret(
    validateEnvironmentVariable('BETTER_AUTH_SECRET', process.env.BETTER_AUTH_SECRET)
  ),
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  DATABASE_URL: validateEnvironmentVariable('DATABASE_URL', process.env.DATABASE_URL),
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  DATABASE_URL,
  NODE_ENV,
} = env;
