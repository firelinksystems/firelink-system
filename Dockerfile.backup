# Simple deployment file
FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY migrations/ ./migrations/
COPY package*.json ./
COPY *.yml ./

# Install dependencies
RUN cd backend && npm ci
RUN cd frontend && npm ci

# Build
RUN cd backend && npm run build
RUN cd frontend && npm run build

# Start
CMD ["node", "backend/dist/main"]
