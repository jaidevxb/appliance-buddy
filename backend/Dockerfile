# Backend Dockerfile for Appliance Buddy

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Install tsx for running TypeScript files directly
RUN npm install tsx

# Expose port (will be overridden by platform)
EXPOSE 3001

# Start the application
CMD ["npx", "tsx", "src/app.ts"]