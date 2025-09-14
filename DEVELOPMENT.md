# Appliance Buddy - Local Development Setup

This guide will help you set up and run both the frontend and backend locally.

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- PostgreSQL database (using Supabase)

## Getting Started

### 1. Install Dependencies

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### 2. Environment Configuration

The project is already configured with the necessary environment variables:

**Frontend (.env):**
- Frontend runs on `http://localhost:3000`
- API calls go to `http://localhost:3001/api`

**Backend (backend/.env):**
- Backend runs on `http://localhost:3001`
- Connected to Supabase PostgreSQL database

### 3. Running the Application

#### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:full
```

This will start:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:3001`

#### Option 2: Run Separately

**Start Frontend only:**
```bash
npm run dev
```

**Start Backend only:**
```bash
cd backend
npm run dev
```

### 4. Access the Application

- **Frontend**: Open `http://localhost:3000` in your browser
- **Backend API**: Available at `http://localhost:3001/api`

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start frontend development server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run dev` - Start backend development server
- `npm run build` - Build backend for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## Database Setup

The application is configured to use Supabase PostgreSQL. If you need to run migrations or seed data:

```bash
cd backend
npm run db:migrate
npm run db:seed
```

## Troubleshooting

### Port Conflicts
- Frontend: Port 3000 (configurable in `vite.config.ts`)
- Backend: Port 3001 (configurable in `backend/.env`)

### CORS Issues
The backend is configured to allow requests from `http://localhost:3000`. If you change the frontend port, update `FRONTEND_URL` in `backend/.env`.

### Database Connection
Ensure your Supabase database is accessible and the `DATABASE_URL` in `backend/.env` is correct.