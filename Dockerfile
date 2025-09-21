# Single Dockerfile for Appliance Buddy (Frontend + Backend)

FROM node:18-alpine

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
RUN cd backend && npm run build

# Verify backend build output
RUN ls -la backend/dist/

# Expose ports for both frontend and backend
EXPOSE 3000 3001

# Start both frontend and backend
CMD ["sh", "-c", "cd backend && NODE_OPTIONS=--experimental-specifier-resolution=node node dist/app.js & npm run preview -- --host 0.0.0.0 --port 3000"]