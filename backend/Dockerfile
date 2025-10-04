# Backend Dockerfile for Appliance Buddy

FROM node:18-alpine

# Set working directory to backend
WORKDIR /app/backend

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Install tsx for running TypeScript files directly
RUN npm install tsx

# Build the application
RUN npm run build

# Expose port (will be overridden by platform)
EXPOSE 3001

# Start the application
# Use the PORT environment variable with fallback to 3001
CMD ["sh", "-c", "npx tsx src/app.ts"]