# Multi-stage build for production
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

# Copy backend files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install backend dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy backend source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build backend
RUN npm run build

# Frontend build stage
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dependencies for production
RUN apk add --no-cache \
    postgresql-client \
    bash

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy backend
COPY --from=backend-build --chown=nextjs:nodejs /app/backend ./

# Copy frontend build to serve from backend
COPY --from=frontend-build --chown=nextjs:nodejs /app/frontend/dist ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node health-check.js

# Start the application
CMD ["npm", "start"]
