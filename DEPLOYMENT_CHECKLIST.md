# Deployment Checklist

This checklist ensures all requirements are met for successful deployment of the Appliance Buddy application.

## ✅ Backend Dockerfile

- [x] Created [backend/Dockerfile](file:///d:/appliance-buddy/backend/Dockerfile) with proper Node.js Alpine base image
- [x] Configured to install dependencies and build the application
- [x] Set to expose port 3001 (will be overridden by deployment platform)
- [x] Configured to start the application with `npm start`

## ✅ Environment Variables Configuration

### Required Variables
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `FRONTEND_URL` - Comma-separated list of allowed frontend URLs
- [ ] `PORT` - Correct port for deployment platform
- [ ] `NODE_ENV` - Set to "production"

### Platform-Specific Port Configuration
- [ ] Railway: PORT=3001
- [ ] Render: PORT=10000

## ✅ Port Configuration Consistency

- [x] Application uses `process.env.PORT || 3001` for flexible port assignment
- [x] Dockerfile exposes port 3001
- [ ] Railway configuration uses port 3001
- [ ] Render configuration uses port 10000

## ✅ Database Connection

- [ ] Supabase database is accessible from deployment environment
- [ ] DATABASE_URL is correctly formatted
- [ ] Database credentials are valid

## ✅ Deployment Platform Configuration

### Railway
- [ ] Environment variables set in service settings
- [ ] Dockerfile path correctly specified
- [ ] Port configured correctly

### Render
- [ ] Environment variables set in environment variables section
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Port configured correctly (10000)

## ✅ Frontend Configuration

- [ ] VITE_API_URL points to deployed backend
- [ ] VITE_SUPABASE_URL matches backend configuration
- [ ] VITE_SUPABASE_ANON_KEY matches backend configuration

## ✅ Testing

- [ ] Backend health check endpoint accessible
- [ ] API endpoints return proper JSON responses
- [ ] CORS is properly configured for frontend domains
- [ ] Authentication flow works correctly
- [ ] Database operations function properly