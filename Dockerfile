# Multi-stage Dockerfile for Appliance Buddy (Frontend + Backend)

# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install frontend dependencies separately to avoid conflicts
RUN npm install --legacy-peer-deps

# Install backend dependencies separately
RUN cd backend && npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Build backend
RUN cd backend && npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built frontend files
COPY --from=frontend-build /app/dist ./dist

# Copy built backend files
COPY --from=frontend-build /app/backend/dist ./backend/dist
COPY --from=frontend-build /app/backend/node_modules ./backend/node_modules
COPY --from=frontend-build /app/backend/package*.json ./backend/

# Copy nginx configuration
COPY --from=frontend-build /app/nginx.conf ./nginx.conf

# Copy test script to the root directory where it's expected to be run
COPY --from=frontend-build /app/test-backend.js ./test-backend.js

# Install nginx
RUN apk add --no-cache nginx

# Copy nginx configuration to the correct location
RUN cp nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 3000

# Start both backend and frontend with Nginx proxy
# Note: we're running the backend from the /app/backend directory
CMD ["sh", "-c", "cd backend && PORT=3001 node dist/app.js & sleep 10 && node ../test-backend.js && nginx -g 'daemon off;'"]