# Railway Deployment Guide for Appliance Buddy

This guide explains how to deploy both the frontend and backend of Appliance Buddy together on Railway.

## Prerequisites

1. Railway account (https://railway.app/)
2. Supabase account and project
3. Environment variables configured (see below)

## Deployment Steps

### 1. Prepare Environment Variables

Before deploying, ensure you have the following environment variables configured in Railway:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.qsnmybgvrwokifqndhga.supabase.co:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://qsnmybgvrwokifqndhga.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbm15Ymd2cndva2lmcW5kaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxNzMsImV4cCI6MjA3MjgxMDE3M30.mcLOZmFtAmxxWbZlta-YfC7JyrEIx03qxTlWEfSHVxM

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://appliance-buddy-production-ef98.up.railway.app

# Security
JWT_SECRET=Om6LEjuwGjVdt9hBcIB0QQYgpbvb0uRjWhXiYiJglE1Fjwn747tHo1oLdzF5eNdH
```

### 2. Deploy to Railway

1. Fork this repository to your GitHub account
2. Go to Railway.app and create a new project
3. Connect your GitHub repository to Railway
4. Configure the environment variables in Railway
5. Deploy the application

### 3. Railway Configuration Files

This project includes the following Railway configuration files:

- `railway.json` - Main Railway configuration
- `railway.toml` - Additional Railway configuration
- `Dockerfile` - Docker configuration for combined frontend/backend deployment

### 4. How It Works

The deployment works as follows:

1. Railway builds the Docker image using the provided Dockerfile
2. The Dockerfile:
   - Installs dependencies for both frontend and backend
   - Builds the frontend React application
   - Copies the frontend build to the backend's dist directory
   - Builds the backend application
   - Starts the backend server which serves both the API and frontend files

3. The backend Express server:
   - Serves API endpoints under `/api/*`
   - Serves frontend static files from the `dist` directory
   - Handles all other routes by serving the frontend `index.html` (for client-side routing)

### 5. Troubleshooting

If you encounter issues:

1. Check that all environment variables are correctly configured
2. Ensure the DATABASE_URL is correctly formatted and accessible
3. Verify that the PORT is set to 3001
4. Check the application logs in Railway for any error messages

### 6. Custom Domain (Optional)

To use a custom domain:

1. In Railway, go to your service settings
2. Navigate to the "Networking" tab
3. Add your custom domain
4. Update the FRONTEND_URL environment variable to match your custom domain
5. Configure DNS records as instructed by Railway