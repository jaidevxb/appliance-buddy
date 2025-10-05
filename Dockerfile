# Combined Dockerfile for Appliance Buddy (Frontend + Backend)

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy source code
WORKDIR /app
COPY . .

# Build frontend and backend
WORKDIR /app/frontend
RUN npm run build

WORKDIR /app/backend
RUN npm run build

# Expose port (backend will serve frontend)
EXPOSE 3001

# Start the backend which will serve the frontend
WORKDIR /app/backend
CMD ["npm", "start"]