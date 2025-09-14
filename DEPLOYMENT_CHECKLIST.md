# Pre-Deployment Checklist

## Before Deploying

### ✅ Repository Setup
- [ ] Code pushed to GitHub/Git repository
- [ ] All sensitive data removed from code
- [ ] Environment variables properly configured
- [ ] Dependencies updated in package.json files

### ✅ Backend (Railway) Readiness
- [ ] `backend/Procfile` exists
- [ ] `backend/.env.railway` configured  
- [ ] TypeScript and @types/* moved to dependencies (for Railway builds)
- [ ] Build command works: `cd backend && npm run build`
- [ ] Start command works: `cd backend && npm start`

### ✅ Frontend (Vercel) Readiness  
- [ ] `vercel.json` configured
- [ ] `.env.vercel` template ready
- [ ] Build command works: `npm run build:vercel`
- [ ] Static files generated in `dist/` directory

### ✅ Database (Supabase)
- [ ] Supabase project accessible
- [ ] Database URL and credentials valid
- [ ] Required tables exist (or migrations ready)

## During Deployment

### 🚀 Railway Backend Deployment
1. [ ] Create new Railway project
2. [ ] Connect GitHub repository  
3. [ ] Set root directory to `backend`
4. [ ] Add all environment variables from `.env.railway`
5. [ ] Wait for successful deployment
6. [ ] Test health endpoint: `https://your-app.railway.app/health`
7. [ ] Copy Railway URL for frontend configuration

### 🚀 Vercel Frontend Deployment
1. [ ] Create new Vercel project
2. [ ] Connect GitHub repository (root directory)
3. [ ] Set build command to `npm run build:vercel`
4. [ ] Add environment variables:
   - [ ] `VITE_API_URL` = Railway backend URL + `/api`
   - [ ] `VITE_SUPABASE_URL` = Supabase project URL
   - [ ] `VITE_SUPABASE_ANON_KEY` = Supabase anon key
5. [ ] Deploy and wait for completion
6. [ ] Copy Vercel URL for backend CORS configuration

## Post-Deployment

### 🔗 Connect Frontend & Backend
1. [ ] Update Railway `FRONTEND_URL` with actual Vercel URL
2. [ ] Update Vercel `VITE_API_URL` with actual Railway URL  
3. [ ] Trigger redeploy of both services
4. [ ] Test full application functionality

### ✅ Verification Tests
- [ ] Frontend loads successfully
- [ ] Backend health check responds
- [ ] API calls work (no CORS errors)
- [ ] Database operations function
- [ ] User authentication works
- [ ] All major features operational

## URLs to Update

After deployment, update these URLs:

**In Railway Environment Variables:**
```
FRONTEND_URL=https://your-actual-vercel-app.vercel.app
```

**In Vercel Environment Variables:**
```
VITE_API_URL=https://your-actual-railway-app.railway.app/api
```

## Common Issues & Solutions

### CORS Errors
- ✅ Ensure `FRONTEND_URL` in Railway exactly matches Vercel URL
- ✅ Both URLs should use `https://`
- ✅ No trailing slashes in URLs

### Build Failures
- ✅ Check if all dependencies are in correct package.json sections
- ✅ Verify TypeScript builds locally first
- ✅ Check deployment logs for specific errors

### Environment Variables Not Loading
- ✅ Restart deployments after adding variables
- ✅ Verify variable names match exactly (case-sensitive)
- ✅ Check for typos in URLs and keys

---

🎯 **Ready to Deploy!** Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.