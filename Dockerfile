# Combined Dockerfile for Appliance Buddy (Frontend + Backend)

FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

WORKDIR /app/backend
RUN npm install --include=dev

# Copy source code
WORKDIR /app
COPY . .

# Build applications
WORKDIR /app/frontend
RUN npm run build

# Copy frontend dist to backend directory for serving
WORKDIR /app
RUN cp -r frontend/dist backend/dist

WORKDIR /app/backend/backend
RUN npm run build

# Set environment variables for module resolution
ENV NODE_OPTIONS=--experimental-specifier-resolution=node

# Expose port (backend will serve frontend)
EXPOSE 3001

# Start the backend which will serve the frontend
WORKDIR /app/backend/backend
CMD ["node", "index.js"]