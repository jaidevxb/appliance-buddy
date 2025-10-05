# Combined Dockerfile for Appliance Buddy (Frontend + Backend)

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy all files
COPY . .

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build

# Install backend dependencies and build
WORKDIR /app/backend
RUN npm install

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy built backend
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/index.js ./backend/

# Install production dependencies for backend
WORKDIR /app/backend
RUN npm install --production

# Set environment variables for module resolution
ENV NODE_OPTIONS=--experimental-specifier-resolution=node

# Expose port (backend will serve frontend)
EXPOSE 3001

# Start the backend which will serve the frontend
WORKDIR /app/backend
CMD ["node", "index.js"]