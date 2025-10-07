# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Install necessary tools for healthcheck and database operations
RUN apk add --no-cache curl

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
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

# Create uploads directory with proper permissions
RUN mkdir -p ./public/uploads && chmod 777 ./public/uploads

# Copy healthcheck script
COPY healthcheck.sh ./
RUN chmod +x healthcheck.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD ./healthcheck.sh || exit 1

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations and start server
CMD npx prisma migrate deploy && node server.js

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

EXPOSE 3000

# Run migrations in dev mode and start dev server
CMD npx prisma migrate dev --skip-seed && npm run dev
