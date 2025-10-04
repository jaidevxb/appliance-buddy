# Appliance Buddy Backend

This is the backend service for the Appliance Buddy application, built with Express.js, TypeScript, and PostgreSQL.

## Deployment to Render

This application is configured for deployment to Render with the following settings:

- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend/`

The `render.yaml` file contains the deployment configuration.

## Environment Variables

The following environment variables must be set in Render:

- `DATABASE_URL` - PostgreSQL database connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `JWT_SECRET` - Secret key for JWT token signing
- `FRONTEND_URL` - Comma-separated list of allowed frontend URLs for CORS
- `PORT` - Port to run the application on (Render will set this to 10000)

## Local Development

To run the application locally:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (copy `.env.example` to `.env` and fill in values)

4. Run in development mode:
   ```bash
   npm run dev
   ```

The application will start on port 3001 by default.

## Features

- **RESTful API** for appliance management
- **TypeScript** for type safety
- **Supabase PostgreSQL** database with **Drizzle ORM**
- **Comprehensive CRUD operations** for appliances, maintenance tasks, support contacts, and linked documents
- **Data validation** with Zod
- **Error handling** and logging
- **CORS** enabled for frontend integration

## Prerequisites

- Node.js (v18 or higher)
- Supabase project with PostgreSQL database
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Supabase credentials:
   ```env
   # Replace [YOUR_PASSWORD] with your actual Supabase database password
   DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.qsnmybgvrwokifqndhga.supabase.co:5432/postgres
   
   # Supabase Configuration
   SUPABASE_URL=https://qsnmybgvrwokifqndhga.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbm15Ymd2cndva2lmcW5kaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxNzMsImV4cCI6MjA3MjgxMDE3M30.mcLOZmFtAmxxWbZlta-YfC7JyrEIx03qxTlWEfSHVxM
   
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-jwt-secret-here
   ```

3. **Set up the Supabase database:**
   
   **Option A: Using Drizzle Push (Recommended for development)**
   ```bash
   # Push the schema directly to Supabase (easiest for initial setup)
   npm run db:push
   ```
   
   **Option B: Using migrations (Recommended for production)**
   ```bash
   # Generate migrations based on your schema
   npm run db:generate
   
   # Apply migrations to Supabase
   npm run db:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## Supabase Integration Notes

### Database Connection
- The app connects directly to your Supabase PostgreSQL instance
- SSL is required and automatically configured
- Connection pooling is optimized for Supabase's infrastructure

### Authentication
- Currently using the anon key for database access
- For production, consider implementing Row Level Security (RLS) in Supabase
- JWT authentication can be extended to work with Supabase Auth

### Schema Management
- All database tables are managed through Drizzle ORM
- Schema changes should be made in `src/models/schema.ts`
- Use `npm run db:push` for development or `npm run db:generate` + `npm run db:migrate` for production

## API Endpoints

### Appliances
- `GET /api/appliances` - Get all appliances
- `GET /api/appliances/:id` - Get appliance by ID
- `POST /api/appliances` - Create new appliance
- `PUT /api/appliances/:id` - Update appliance
- `DELETE /api/appliances/:id` - Delete appliance

### Maintenance Tasks
- `GET /api/appliances/:applianceId/maintenance` - Get maintenance tasks
- `POST /api/appliances/:applianceId/maintenance` - Create maintenance task
- `PUT /api/appliances/:applianceId/maintenance/:id` - Update maintenance task
- `DELETE /api/appliances/:applianceId/maintenance/:id` - Delete maintenance task

### Support Contacts
- `GET /api/appliances/:applianceId/contacts` - Get support contacts
- `POST /api/appliances/:applianceId/contacts` - Create support contact
- `PUT /api/appliances/:applianceId/contacts/:id` - Update support contact
- `DELETE /api/appliances/:applianceId/contacts/:id` - Delete support contact

### Linked Documents
- `GET /api/appliances/:applianceId/documents` - Get linked documents
- `POST /api/appliances/:applianceId/documents` - Create linked document
- `PUT /api/appliances/:applianceId/documents/:id` - Update linked document
- `DELETE /api/appliances/:applianceId/documents/:id` - Delete linked document

## Database Schema

The application creates the following tables in your Supabase database:
- `appliances` - Main appliance information
- `support_contacts` - Contact information for support/service
- `maintenance_tasks` - Scheduled maintenance activities
- `linked_documents` - Document references (manuals, receipts, etc.)

All tables include proper foreign key relationships and cascading deletes.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:push` - Push schema directly to Supabase (development)
- `npm run db:studio` - Open Drizzle Studio for database management

## Technology Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **Supabase PostgreSQL** - Database
- **Zod** - Schema validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Project Structure

```
src/
├── config/          # Database and environment configuration
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Database schemas
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types and validation schemas
├── utils/           # Utility functions
└── app.ts           # Main application file
```

## Development

The backend is designed to work seamlessly with the React frontend. All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

Error responses include detailed validation information when applicable.