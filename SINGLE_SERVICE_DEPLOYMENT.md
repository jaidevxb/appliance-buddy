# Single Service Deployment on Railway

This guide explains how to deploy Appliance Buddy as a single service on Railway instead of separate frontend and backend services.

## Why Single Service Deployment?

Deploying as a single service offers these advantages:
- Simplified deployment process
- Reduced complexity in managing multiple services
- Lower resource consumption
- Easier maintenance

## Deployment Steps

1. Ensure you have the following files in your repository root:
   - [Dockerfile](file:///d:/appliance-buddy/Dockerfile) - Combined Dockerfile for both frontend and backend
   - [package.json](file:///d:/appliance-buddy/package.json) - Root package.json with scripts to run both services
   - [railway.json](file:///d:/appliance-buddy/railway.json) - Railway configuration for single service

2. The [railway.json](file:///d:/appliance-buddy/railway.json) file should be configured as follows:
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "DOCKERFILE"
     },
     "services": {
       "appliance-buddy": {
         "dockerfilePath": "Dockerfile",
         "port": 3000,
         "healthcheckPath": "/",
         "environment": {
           "NODE_ENV": "production",
           "PORT": "3000"
         }
       }
     }
   }
   ```

3. The combined [Dockerfile](file:///d:/appliance-buddy/Dockerfile) builds both frontend and backend, then runs them using `concurrently`.

4. The backend is configured to serve frontend files directly in production mode.

## Environment Variables

Make sure to set the following environment variables in your Railway project:
- `DATABASE_URL` - PostgreSQL database connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `JWT_SECRET` - Secret for JWT token signing

## How It Works

1. During the Docker build process:
   - Both frontend and backend dependencies are installed
   - Frontend is built using Vite
   - Backend is compiled using TypeScript

2. At runtime:
   - Both services start using `concurrently`
   - Backend serves API endpoints under `/api/*`
   - Backend serves frontend files from the build directory for all other routes
   - All requests to `/api/*` are handled by the backend API
   - All other requests are served the frontend application

## Local Development

You can also run the single service locally:
```bash
# Install dependencies
npm install

# Build both frontend and backend
npm run build

# Start both services
npm start
```

Or for development with hot reloading:
```bash
npm run dev
```