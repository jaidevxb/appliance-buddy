# Railway Deployment Checklist

## Before Deploying

### ✅ Repository Setup
- [ ] Code pushed to GitHub/Git repository
- [ ] All sensitive data removed from code
- [ ] Environment variables properly configured
- [ ] Dependencies updated in package.json files

### ✅ Backend Readiness
- [ ] Build command works: `cd backend && npm run build`
- [ ] Start command works: `cd backend && npm start`

### ✅ Frontend Readiness  
- [ ] Build command works: `npm run build`
- [ ] Static files generated in `dist/` directory

### ✅ Database (Supabase)
- [ ] Supabase project accessible
- [ ] Database URL and credentials valid
- [ ] Required tables exist (or migrations ready)

## During Railway Deployment

### 🚀 Railway Service Deployment
1. [ ] Create new Railway project
2. [ ] Connect GitHub repository  
3. [ ] Railway will automatically detect the Dockerfile
4. [ ] Add all environment variables:
   - [ ] `DATABASE_URL` = Supabase PostgreSQL URL
   - [ ] `SUPABASE_URL` = Supabase project URL
   - [ ] `SUPABASE_ANON_KEY` = Supabase anon key
   - [ ] `NODE_ENV` = production
   - [ ] `FRONTEND_URL` = Railway service URL
   - [ ] `JWT_SECRET` = Strong random string
5. [ ] Wait for successful deployment
6. [ ] Test application access: `https://your-service.up.railway.app`

## Post-Deployment

### ✅ Verification Tests
- [ ] Application loads successfully
- [ ] Backend API responds correctly
- [ ] Database operations function
- [ ] User authentication works (if implemented)
- [ ] All major features operational

## URLs for Access

**Application URL:**
```
https://your-service.up.railway.app
```

**Backend API:**
```
https://your-service.up.railway.app/api
```

## Common Issues & Solutions

### CORS Errors
- ✅ Ensure `FRONTEND_URL` in Railway exactly matches your service URL
- ✅ URL should use `https://`

### Build Failures
- ✅ Check if all dependencies are in correct package.json sections
- ✅ Verify builds work locally first
- ✅ Check Railway deployment logs for specific errors

### Environment Variables Not Loading
- ✅ Restart deployment after adding variables
- ✅ Verify variable names match exactly (case-sensitive)

### Database Connection Issues
- ✅ Verify `DATABASE_URL` is correct
- ✅ Check Supabase database accessibility
- ✅ Ensure Supabase project is not paused or over limits

### 502 Bad Gateway Errors
- ✅ Check if backend service is starting correctly
- ✅ Verify database connection in deployed environment
- ✅ Check Railway logs for startup errors
- ✅ Ensure nginx configuration is correct

---

🎯 **Ready for Railway Deployment!** Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.