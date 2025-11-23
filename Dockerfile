FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and other dependencies
RUN apk add --no-cache \
    openssl \
    postgresql-client \
    bash \
    curl

# Copy package files first (for better caching)
COPY backend/package*.json ./

# Install dependencies (skip Prisma for now)
RUN npm install --omit=dev --ignore-scripts

# Copy source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# Change ownership
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
