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

## Testing

1. **Backend Health Check**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Frontend Access**
   Open `http://localhost:5173` in browser

3. **API Integration**
   Test if frontend can communicate with backend API

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend .env matches your frontend URL exactly
   - Check that both URLs use `http://` for local development

2. **Environment Variables Not Loading**
   - Ensure all environment variables are set correctly
   - Restart servers after adding variables

3. **Build Failures**
   - Check build logs for specific errors
   - Ensure all dependencies are properly listed in package.json

4. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check database accessibility

---

🎉 **Your application is now ready for local development!**