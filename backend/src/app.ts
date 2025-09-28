import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { config } from './config/environment';
import { db } from './config/database';
import { ApplianceService } from './services/applianceService';
import { MaintenanceService } from './services/maintenanceService';
import { SupportContactService } from './services/supportContactService';
import { LinkedDocumentService } from './services/linkedDocumentService';
import { ApplianceController } from './controllers/applianceController';
import { MaintenanceController } from './controllers/maintenanceController';
import { SupportContactController } from './controllers/supportContactController';
import { LinkedDocumentController } from './controllers/linkedDocumentController';
import { createApplianceRoutes } from './routes/appliances';
import { authRoutes } from './routes/auth';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authenticateUser, optionalAuth } from './middleware/auth';

const app: express.Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = config.getFrontendUrls();
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize services
const applianceService = new ApplianceService(db);
const maintenanceService = new MaintenanceService(db);
const supportContactService = new SupportContactService(db);
const linkedDocumentService = new LinkedDocumentService(db);

// Initialize controllers
const applianceController = new ApplianceController(applianceService);
const maintenanceController = new MaintenanceController(maintenanceService, applianceService);
const supportContactController = new SupportContactController(supportContactService, applianceService);
const linkedDocumentController = new LinkedDocumentController(linkedDocumentService, applianceService);

// API routes
app.use('/api/auth', authRoutes);

// Appliance routes with optional authentication (for backward compatibility)
app.use('/api/appliances', optionalAuth, createApplianceRoutes(
  applianceController,
  maintenanceController,
  supportContactController,
  linkedDocumentController
));

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv
  });
});

// Root endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Appliance Buddy API',
    version: '1.0.0',
    documentation: '/api/docs', // Future API documentation endpoint
  });
});

// Add a simple test endpoint to verify the backend is running
app.get('/test', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Backend is running',
    port: config.port,
    timestamp: new Date().toISOString()
  });
});

// Add error handling for unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit the process in production, just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📊 Health check: http://localhost:${config.port}/health`);
  console.log(`🔗 API base URL: http://localhost:${config.port}/api`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});