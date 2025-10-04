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

# Install nginx and process manager
RUN apk add --no-cache nginx supervisor

# Configure nginx
RUN mkdir -p /etc/nginx && \
    cp nginx.conf /etc/nginx/nginx.conf && \
    mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

# Remove default nginx config that might conflict
RUN rm -f /etc/nginx/conf.d/default.conf

# Install tsx for running TypeScript files directly
RUN cd backend && npm install tsx

# Expose port
EXPOSE 3000

# Create supervisor config
RUN echo '[supervisord]\n\
nodaemon=true\n\
user=root\n\
logfile=/var/log/supervisor/supervisord.log\n\
logfile_maxbytes=50MB\n\
logfile_backups=10\n\
loglevel=info\n\
pidfile=/var/run/supervisord.pid\n\
\n\
[program:backend]\n\
command=/bin/sh -c "cd /app/backend && npx tsx src/app.ts"\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/var/log/backend.log\n\
stderr_logfile=/var/log/backend_error.log\n\
user=root\n\
\n\
[program:test-backend]\n\
command=node /app/test-backend.js\n\
directory=/app\n\
autostart=true\n\
autorestart=false\n\
stdout_logfile=/var/log/test-backend.log\n\
stderr_logfile=/var/log/test-backend_error.log\n\
user=root\n\
startsecs=0\n\
\n\
[program:nginx]\n\
command=/bin/sh -c "export PORT=$${PORT:-3000} && sed -i \"s/listen 3000;/listen $${PORT};/\" /etc/nginx/nginx.conf && nginx -g \"daemon off;\""\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/var/log/nginx.log\n\
stderr_logfile=/var/log/nginx_error.log\n\
user=root' > /etc/supervisord.conf

# Start supervisor to manage all processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]