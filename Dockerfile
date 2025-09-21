# Single Dockerfile for Appliance Buddy (Frontend + Backend with Nginx Proxy)

FROM node:18-alpine AS builder

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

# Production stage with Nginx
FROM nginx:alpine

# Copy built frontend files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy backend files
COPY --from=builder /app/backend/dist /app/backend/dist
COPY --from=builder /app/backend/node_modules /app/backend/node_modules
COPY --from=builder /app/backend/package*.json /app/backend/

# Expose port
EXPOSE 3000

# Start both backend and frontend with Nginx proxy
# Set PORT environment variable for backend to use port 3001
CMD ["sh", "-c", "cd /app/backend && PORT=3001 node dist/app.js & nginx -g 'daemon off;'"]