# Combined Dockerfile for Appliance Buddy (Frontend + Backend)

FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Install backend dependencies and build
WORKDIR /app/backend
RUN npm install

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Set environment variables for module resolution
ENV NODE_OPTIONS=--experimental-specifier-resolution=node

# Expose port (backend will serve frontend)
EXPOSE 3001

# Start the backend which will serve the frontend
WORKDIR /app/backend
CMD ["node", "index.js"]