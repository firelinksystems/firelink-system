FROM node:18-slim

WORKDIR /app

# Install additional dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build the application
RUN npm run build

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node health-check.js

# Start the application
CMD ["npm", "start"]
