# Required Environment Variables for Deployment

This document outlines all the environment variables that need to be configured for successful deployment of the Appliance Buddy application.

## Backend Environment Variables

The following environment variables must be set in your deployment platform (Railway, Render, etc.):

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string for Supabase database
  Example: `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`

### Supabase Configuration
- `SUPABASE_URL` - Supabase project URL
  Example: `https://[PROJECT_ID].supabase.co`
- `SUPABASE_ANON_KEY` - Supabase anonymous key for client-side operations

### Security Configuration
- `JWT_SECRET` - Secret key for JWT token signing
  Should be a strong, random string

### Server Configuration
- `PORT` - Port for the backend to listen on
  - Local development: 3002 (to avoid conflicts)
  - Railway deployment: 3001
  - Render deployment: 10000
- `NODE_ENV` - Environment mode
  - Development: `development`
  - Production: `production`
- `FRONTEND_URL` - Comma-separated list of allowed frontend URLs for CORS
  Example: `http://localhost:3000,https://your-frontend-domain.com`

## Frontend Environment Variables

The following environment variables should be set for the frontend:

### API Configuration
- `VITE_API_URL` - Backend API URL
  - Local development: `http://localhost:3002/api`
  - Production: Should point to your deployed backend URL
    Example: `https://your-backend-domain.com/api`

### Supabase Configuration
- `VITE_SUPABASE_URL` - Supabase project URL (same as backend)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (same as backend)

## Platform-Specific Configuration

### Railway
Set these variables in the service settings:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `JWT_SECRET`
- `FRONTEND_URL`
- `PORT=3001`
- `NODE_ENV=production`

### Render
Set these variables in the environment variables section:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `JWT_SECRET`
- `FRONTEND_URL`
- `PORT=10000`
- `NODE_ENV=production`

## Notes

1. Never commit sensitive environment variables to version control
2. The PORT variable should match what's configured in your deployment platform
3. FRONTEND_URL should include all domains that will access your API for proper CORS handling
4. Make sure the Supabase database is accessible from your deployment environment