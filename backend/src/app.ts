import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

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

// Serve frontend static files in production
if (config.nodeEnv === 'production') {
  const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(frontendDistPath));
  
  // Serve index.html for all non-API routes
  app.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // If the request is for an API endpoint, continue with normal routing
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      next();
    } else {
      // Otherwise, serve the frontend index.html
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
  });
}

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
    environment: config.nodeEnv,
    port: config.port
  });
});

// Root endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  if (config.nodeEnv === 'production') {
    // In production, this will be handled by the static file middleware above
    // This is just a fallback
    res.json({
      message: 'Appliance Buddy API',
      version: '1.0.0',
      documentation: '/api/docs', // Future API documentation endpoint
      port: config.port
    });
  } else {
    res.json({
      message: 'Appliance Buddy API',
      version: '1.0.0',
      documentation: '/api/docs', // Future API documentation endpoint
      port: config.port
    });
  }
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
const portNumber = typeof config.port === 'string' ? parseInt(config.port, 10) : config.port;
console.log(`🚀 Attempting to start server on port ${portNumber}`);

// For Render deployment, we need to bind to all interfaces
const server = app.listen(portNumber, '0.0.0.0', () => {
  console.log(`✅ Server successfully running on port ${portNumber}`);
  console.log(`📊 Health check: http://localhost:${portNumber}/health`);
  console.log(`🔗 API base URL: http://localhost:${portNumber}/api`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
}).on('error', (err) => {
  console.error(`❌ Failed to start server on port ${portNumber}:`, err);
  if (err.message.includes('EADDRINUSE')) {
    console.error('   - Port is already in use. Try a different port.');
  }
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