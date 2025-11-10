# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Install necessary tools for healthcheck, database operations, and network utilities
RUN apk add --no-cache curl netcat-openbsd

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Builder stage
FROM base AS builder

# Build arguments for environment variables needed during build
ARG JWT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_BASE_URL
ARG STRIPE_SECRET_KEY
ARG STRIPE_PUBLISHABLE_KEY
ARG PAYPAL_CLIENT_ID
ARG PAYPAL_CLIENT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
# Note: DATABASE_URL is not needed as build arg, we use dummy value

# Set environment variables from build args
ENV JWT_SECRET=${JWT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=${NEXT_PUBLIC_PAYPAL_CLIENT_ID}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
ENV STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
ENV PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
ENV PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client with dummy DATABASE_URL for build
ENV DATABASE_URL="mysql://user:password@localhost:3306/dummy"
RUN npx prisma generate

# Build Next.js app  
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Create uploads directory with proper permissions
RUN mkdir -p ./public/uploads && chmod 777 ./public/uploads

# Copy wait-for-db and healthcheck scripts
COPY wait-for-db.sh ./
COPY healthcheck.sh ./
RUN chmod +x wait-for-db.sh healthcheck.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD ./healthcheck.sh || exit 1

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Wait for database, run migrations, seed, then start server
CMD ["/bin/sh", "-c", "./wait-for-db.sh && npx prisma migrate deploy && node scripts/seed-production.js && node server.js"]

# Development stage
FROM base AS development
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install && npm cache clean --force

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create uploads directory with proper permissions
RUN mkdir -p ./public/uploads && chmod 777 ./public/uploads

# Copy and set permissions for wait-for-db script
COPY wait-for-db.sh ./
RUN chmod +x wait-for-db.sh

EXPOSE 3000

# Wait for database, run migrations, seed, then start dev server
CMD ["/bin/sh", "-c", "./wait-for-db.sh && npx prisma migrate deploy && npm run seed && npm run dev -- --hostname 0.0.0.0"]
