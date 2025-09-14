# Deployment Guide: Railway + Vercel

This guide covers deploying the Appliance Buddy application with Railway for the backend and Vercel for the frontend.

## Prerequisites

- GitHub repository with your code
- Railway account ([railway.app](https://railway.app))
- Vercel account ([vercel.com](https://vercel.com))
- Supabase database (already configured)

## Backend Deployment (Railway)

### 1. Deploy to Railway

1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder as the root directory

2. **Configure Environment Variables**
   Copy the variables from `backend/.env.railway` to your Railway project:
   
   ```bash
   DATABASE_URL=postgresql://postgres:Internship%401%24%242006@db.qsnmybgvrwokifqndhga.supabase.co:5432/postgres
   SUPABASE_URL=https://qsnmybgvrwokifqndhga.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbm15Ymd2cndva2lmcW5kaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxNzMsImV4cCI6MjA3MjgxMDE3M30.mcLOZmFtAmxxWbZlta-YfC7JyrEIx03qxTlWEfSHVxM
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-app.vercel.app
   JWT_SECRET=your-secure-jwt-secret-for-production-change-this
   ```

3. **Configure Build Settings**
   Railway will automatically detect the Node.js project and use:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: Railway automatically assigns a port via `$PORT`

4. **Deploy**
   - Railway will automatically deploy on git push
   - Get your backend URL (e.g., `https://your-backend-app.railway.app`)

### 2. Database Migration (Optional)

If you need to run database migrations on Railway:

```bash
# Add this to your Railway project variables
npm run db:migrate-manual
```

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" → Import your repository
   - Select the root directory (not a subfolder)

2. **Configure Build Settings**
   Vercel will auto-detect the settings, but verify:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Configure Environment Variables**
   Add these environment variables in Vercel dashboard:
   
   ```bash
   VITE_API_URL=https://your-backend-app.railway.app/api
   VITE_SUPABASE_URL=https://qsnmybgvrwokifqndhga.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbm15Ymd2cndva2lmcW5kaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxNzMsImV4cCI6MjA3MjgxMDE3M30.mcLOZmFtAmxxWbZlta-YfC7JyrEIx03qxTlWEfSHVxM
   ```

4. **Deploy**
   - Click "Deploy"
   - Get your frontend URL (e.g., `https://your-frontend-app.vercel.app`)

## Post-Deployment Configuration

### 1. Update Backend CORS

Update the `FRONTEND_URL` environment variable in Railway with your actual Vercel URL:

```bash
FRONTEND_URL=https://your-actual-frontend-app.vercel.app
```

### 2. Update Frontend API URL

Update the `VITE_API_URL` environment variable in Vercel with your actual Railway URL:

```bash
VITE_API_URL=https://your-actual-backend-app.railway.app/api
```

### 3. Redeploy Both Services

After updating the URLs:
1. **Railway**: Will auto-redeploy on environment variable change
2. **Vercel**: Trigger a new deployment from the dashboard

## Environment Variables Reference

### Railway (Backend)
| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL URL | Database connection |
| `SUPABASE_URL` | Supabase project URL | Supabase API URL |
| `SUPABASE_ANON_KEY` | Supabase anon key | Public Supabase key |
| `NODE_ENV` | `production` | Node environment |
| `FRONTEND_URL` | Vercel app URL | For CORS configuration |
| `JWT_SECRET` | Strong random string | JWT token signing |

### Vercel (Frontend)
| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Railway backend URL + `/api` | Backend API endpoint |
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase API URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Public Supabase key |

## Testing Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-backend-app.railway.app/health
   ```

2. **Frontend Access**
   Open `https://your-frontend-app.vercel.app` in browser

3. **API Integration**
   Test if frontend can communicate with backend API

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly
   - Check that both URLs use `https://`

2. **Environment Variables Not Loading**
   - Ensure all environment variables are set in both platforms
   - Restart deployments after adding variables

3. **Build Failures**
   - Check build logs in respective dashboards
   - Ensure all dependencies are properly listed in package.json

4. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct in Railway
   - Check Supabase database accessibility

## Automatic Deployments

Both platforms support automatic deployments:

- **Railway**: Deploys automatically on git push to main branch
- **Vercel**: Deploys automatically on git push to main branch

## Custom Domains (Optional)

### Railway
1. Go to your project settings
2. Add custom domain
3. Configure DNS records as instructed

### Vercel
1. Go to project settings → Domains
2. Add custom domain
3. Configure DNS records as instructed

---

🎉 **Your application is now deployed!**

- **Frontend**: `https://your-frontend-app.vercel.app`
- **Backend**: `https://your-backend-app.railway.app`