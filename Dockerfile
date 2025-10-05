# Combined Dockerfile for Appliance Buddy (Frontend + Backend)

FROM node:18-alpine

WORKDIR /app

# Copy package files first to optimize Docker layer caching
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Copy source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Install backend dependencies without running postinstall script
WORKDIR /app/backend
RUN npm install --ignore-scripts

# Build backend and frontend
WORKDIR /app/backend
RUN npm run build

WORKDIR /app/frontend
RUN npm run build

# Expose port (backend will serve frontend)
EXPOSE 3001

# Start the backend which will serve the frontend
WORKDIR /app/backend
CMD ["npm", "start"]