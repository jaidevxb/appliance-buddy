# Combined Dockerfile for Appliance Buddy (Frontend + Backend)

# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install root dependencies
RUN npm install

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy source code
WORKDIR /app
COPY . .

# Build the frontend
WORKDIR /app/frontend
RUN npm run build

# Build the backend
WORKDIR /app/backend
RUN npm run build

# Expose port
EXPOSE 3000

# Start both services using concurrently
WORKDIR /app
CMD ["npm", "start"]