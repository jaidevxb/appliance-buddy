# Deployment Guide

This guide covers deploying the Appliance Buddy application.

## Prerequisites

- GitHub repository with your code
- Supabase database (already configured)

## Local Development

For local development, use the combined script:

```bash
npm run dev:full
```

This starts both frontend (port 3000) and backend (port 3001) simultaneously.

## Railway Deployment

### Single Dockerfile Deployment (Recommended)

This project includes a single [Dockerfile](file:///d:/appliance-buddy/Dockerfile) that can run both the frontend and backend services in a single container.

1. **Create a new Railway project**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure the service**
   - Railway will automatically detect the [Dockerfile](file:///d:/appliance-buddy/Dockerfile) in the root
   - No additional configuration needed

3. **Configure Environment Variables**
   Add these environment variables in the Railway dashboard:
   
   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.qsnmybgvrwokifqndhga.supabase.co:5432/postgres
   SUPABASE_URL=https://qsnmybgvrwokifqndhga.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbm15Ymd2cndva2lmcW5kaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxNzMsImV4cCI6MjA3MjgxMDE3M30.mcLOZmFtAmxxWbZlta-YfC7JyrEIx03qxTlWEfSHVxM
   NODE_ENV=production
   FRONTEND_URL=https://your-service.up.railway.app
   JWT_SECRET=your-secure-jwt-secret-for-production-change-this
   ```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (for backend)
- npm or yarn

### Frontend Setup

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd appliance-buddy
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   ```sh
   cp .env.example .env
   ```
   
   Update the `.env` file with your backend API URL:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

### Backend Setup

1. **Navigate to the backend directory:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   ```sh
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/appliance_buddy
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-jwt-secret-here
   ```

4. **Set up the database:**
   
   Create a PostgreSQL database named `appliance_buddy`:
   ```sql
   CREATE DATABASE appliance_buddy;
   ```
   
   Generate and run migrations:
   ```sh
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the backend server:**
   ```sh
   npm run dev
   ```

### Running Both Frontend and Backend

For development, you'll need to run both the frontend and backend servers:

1. **Terminal 1 - Backend:**
   ```sh
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```sh
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3001`.

## Environment Variables Reference

### Railway Service
| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL URL | Database connection |
| `SUPABASE_URL` | Supabase project URL | Supabase API URL |
| `SUPABASE_ANON_KEY` | Supabase anon key | Public Supabase key |
| `NODE_ENV` | `production` | Node environment |
| `FRONTEND_URL` | Railway service URL | For CORS configuration |
| `JWT_SECRET` | Strong random string | JWT token signing |

## Testing Deployment

1. **Access the Application**
   Open `https://your-service.up.railway.app` in browser

2. **Backend API**
   The backend API will be available at `https://your-service.up.railway.app/api`

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in Railway matches your service URL exactly
   - Check that the URL uses `https://`

2. **Environment Variables Not Loading**
   - Ensure all environment variables are set in the Railway dashboard
   - Restart deployments after adding variables

3. **Build Failures**
   - Check build logs in Railway dashboard
   - Ensure all dependencies are properly listed in package.json

4. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct in Railway
   - Check Supabase database accessibility

## Automatic Deployments

Railway supports automatic deployments:
- Deploys automatically on git push to main branch
- Can be configured for specific branches

## Custom Domains (Optional)

### Railway
1. Go to your service settings
2. Add custom domain
3. Configure DNS records as instructed

---

🎉 **Your application is now ready for Railway deployment with a single Dockerfile!**