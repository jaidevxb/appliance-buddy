# Appliance Buddy

A comprehensive web application for managing household appliances, tracking warranties, scheduling maintenance, and storing important documents.

## Features

- **Appliance Management**: Add, edit, and organize your household appliances
- **Warranty Tracking**: Monitor warranty status and expiration dates
- **Maintenance Scheduling**: Keep track of maintenance tasks and service appointments
- **Document Storage**: Link important documents like manuals and receipts
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Architecture

This project consists of two main parts:
- **Frontend**: React application with TypeScript, Vite, and shadcn-ui
- **Backend**: Express.js API with PostgreSQL and Drizzle ORM

## Project info

**URL**: https://lovable.dev/projects/53a6321c-90c6-42f4-8fdb-ac9cd308c00f

## Deployment

### Local Development

For local development, you can use either approach:

**Single Terminal Approach**:
```bash
npm run dev:full
```

**Two Container Approach (Recommended for production-like environment)**:
```bash
docker-compose up
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:3001`.

### Render Deployment (Recommended for Backend)

This project is configured for deployment to Render:

1. **Backend Deployment**:
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Set the root directory to `backend/`
   - Use the auto-detected build and start commands
   - Add the required environment variables

2. **Frontend Deployment**:
   - Create a new Static Site on Render
   - Connect your GitHub repository
   - Set the build command to `npm run build`
   - Set the publish directory to `dist/`
   - Add the `VITE_API_URL` environment variable pointing to your backend

### Railway Deployment (Single Service)

This project can also be deployed as a single service on Railway:

1. **Single Service Deployment**:
   - Create a new Web Service on Railway
   - Connect your GitHub repository
   - Railway will automatically detect and use the [railway.json](file:///d:/appliance-buddy/railway.json) configuration
   - Add the required environment variables
   
For detailed instructions, see [SINGLE_SERVICE_DEPLOYMENT.md](file:///d:/appliance-buddy/SINGLE_SERVICE_DEPLOYMENT.md)

### Vercel Deployment (Alternative for Frontend)

1. Connect your GitHub repository to Vercel
2. Set the root directory to the project root
3. Set the build command to `npm run build`
4. Set the output directory to `dist/`
5. Add the `VITE_API_URL` environment variable pointing to your backend

### Railway Deployment (Alternative for Frontend)

1. Create a new Web Service on Railway
2. Connect your GitHub repository
3. Railway will automatically detect and use the [railway.json](file:///d:/appliance-buddy/railway.json) configuration
4. Add the `VITE_API_URL` environment variable pointing to your backend

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (for backend)
- npm or yarn
- Docker (for containerized deployment)

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

For development, you can use either approach:

**Single Terminal Approach**:
```sh
npm run dev:full
```

**Two Container Approach (Recommended for production-like environment)**:
```sh
docker-compose up
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:3001`.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/53a6321c-90c6-42f4-8fdb-ac9cd308c00f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Technologies Used

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Styling
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **date-fns** - Date utilities

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Zod** - Schema validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## API Endpoints

The backend provides a comprehensive REST API:

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

The application uses a normalized PostgreSQL database with the following main tables:
- `appliances` - Main appliance information
- `support_contacts` - Contact information for support/service
- `maintenance_tasks` - Scheduled maintenance activities
- `linked_documents` - Document references (manuals, receipts, etc.)

## Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## Project Structure

```
appliance-buddy/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── data/              # Mock data (for development)
├── backend/               # Backend source code
│   ├── src/
│   │   ├── config/        # Database and environment configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types and validation
│   │   └── utils/         # Utility functions
│   ├── migrations/        # Database migrations
│   ├── render.yaml        # Render deployment configuration
│   └── README.md          # Backend documentation
├── docker-compose.yml     # Docker Compose configuration for local development
├── frontend.Dockerfile    # Dockerfile for frontend service
├── nginx.frontend.conf    # Nginx configuration for frontend
├── railway.json           # Railway deployment configuration
└── docs/                  # Documentation
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/53a6321c-90c6-42f4-8fdb-ac9cd308c00f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)