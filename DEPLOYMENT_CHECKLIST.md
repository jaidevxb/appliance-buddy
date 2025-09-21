# Local Development Setup Checklist

## Before Starting Development

### ✅ Repository Setup
- [ ] Code cloned to local machine
- [ ] All sensitive data removed from code
- [ ] Environment variables properly configured
- [ ] Dependencies updated in package.json files

### ✅ Backend Readiness
- [ ] `backend/` directory exists
- [ ] Build command works: `cd backend && npm run build`
- [ ] Start command works: `cd backend && npm start`

### ✅ Frontend Readiness  
- [ ] Build command works: `npm run build`
- [ ] Static files generated in `dist/` directory

### ✅ Database (Supabase)
- [ ] Supabase project accessible
- [ ] Database URL and credentials valid
- [ ] Required tables exist (or migrations ready)

## During Local Development Setup

### 🚀 Backend Setup
1. [ ] Navigate to backend directory: `cd backend`
2. [ ] Install dependencies: `npm install`
3. [ ] Set up environment variables from `backend/.env.example`
4. [ ] Run database migrations: `npm run db:migrate`
5. [ ] Start backend server: `npm run dev`
6. [ ] Test health endpoint: `http://localhost:3001/health`

### 🚀 Frontend Setup
1. [ ] Install dependencies: `npm install`
2. [ ] Set up environment variables from `.env.example`
3. [ ] Start frontend server: `npm run dev`
4. [ ] Access application at: `http://localhost:5173`

## Testing Local Development Setup

### 🔗 Verify Frontend & Backend Integration
1. [ ] Confirm frontend loads successfully at `http://localhost:5173`
2. [ ] Confirm backend health check responds at `http://localhost:3001/health`
3. [ ] Test API calls work (no CORS errors)
4. [ ] Verify database operations function
5. [ ] Test user authentication (if implemented)
6. [ ] Verify all major features operational

## URLs for Local Development

**Backend Health Check:**
```
http://localhost:3001/health
```

**Backend API:**
```
http://localhost:3001/api
```

**Frontend Application:**
```
http://localhost:5173
```

## Common Issues & Solutions

### CORS Errors
- ✅ Ensure `FRONTEND_URL` in backend .env exactly matches frontend URL
- ✅ Both URLs should use `http://` for local development
- ✅ No trailing slashes in URLs

### Build Failures
- ✅ Check if all dependencies are in correct package.json sections
- ✅ Verify TypeScript builds locally first
- ✅ Check logs for specific errors

### Environment Variables Not Loading
- ✅ Restart development servers after adding variables
- ✅ Verify variable names match exactly (case-sensitive)
- ✅ Check for typos in URLs and keys

### Database Connection Issues
- ✅ Verify `DATABASE_URL` is correct
- ✅ Check that database is running and accessible
- ✅ Confirm credentials are correct

---

🎯 **Ready for Local Development!** Follow the [DEVELOPMENT.md](./DEVELOPMENT.md) guide for detailed instructions.