# Multi-stage Dockerfile for Appliance Buddy (Frontend + Backend)

# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies for both frontend and backend
RUN npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Build backend
RUN cd backend && npx tsc --project tsconfig.json

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

# Install nginx
RUN apk add --no-cache nginx

# Copy nginx configuration to the correct location
RUN cp nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 3000

# Start both backend and frontend with Nginx proxy
# Note: we're running the backend from the /app/backend directory
CMD ["sh", "-c", "cd backend && PORT=3001 node dist/app.js & nginx -g 'daemon off;'"]