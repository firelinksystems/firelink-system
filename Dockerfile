FROM node:18-alpine AS backend-build

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source and build
COPY backend/ ./
RUN npm run build

FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Copy built applications
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy migrations and other files
COPY migrations/ ./migrations/

# Expose port
EXPOSE 3001

# Start the backend
CMD ["node", "backend/dist/main"]
