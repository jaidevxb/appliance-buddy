# Multi-stage Dockerfile for Appliance Buddy (Frontend + Backend)

# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files for frontend
COPY package*.json ./
COPY vite.config.ts ./

# Install frontend dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy frontend source code
COPY src ./src
COPY index.html .
COPY tsconfig*.json .
COPY tailwind.config.ts .
COPY postcss.config.js .
COPY components.json .

# Build frontend
RUN npm run build

# Build stage for backend
FROM node:18-alpine AS backend-build

WORKDIR /app

# Copy backend files
COPY backend ./backend

# Install backend dependencies with legacy peer deps to avoid conflicts
RUN cd backend && npm install --legacy-peer-deps

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built frontend files
COPY --from=frontend-build /app/dist ./dist

# Copy backend files
COPY --from=backend-build /app/backend ./backend

# Copy nginx configuration
COPY nginx.conf ./nginx.conf

# Copy test script to the root directory where it's expected to be run
COPY test-backend.js ./test-backend.js

# Install nginx
RUN apk add --no-cache nginx

# Copy nginx configuration to the correct location
# Use envsubst to replace $PORT variable in nginx.conf
RUN apk add --no-cache gettext
RUN envsubst '${PORT}' < nginx.conf > /etc/nginx/nginx.conf

# Install tsx for running TypeScript files directly
RUN cd backend && npm install tsx

# Expose port
EXPOSE 3000

# Start both backend and frontend with Nginx proxy
# Note: we're running the backend from the /app/backend directory
CMD ["sh", "-c", "cd backend && npx tsx src/app.ts & node /app/test-backend.js; nginx -g 'daemon off;'"]