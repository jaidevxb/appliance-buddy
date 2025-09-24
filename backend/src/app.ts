import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config/environment.js';
import { db } from './config/database.js';
import { ApplianceService } from './services/applianceService.js';
import { MaintenanceService } from './services/maintenanceService.js';
import { SupportContactService } from './services/supportContactService.js';
import { LinkedDocumentService } from './services/linkedDocumentService.js';
import { ApplianceController } from './controllers/applianceController.js';
import { MaintenanceController } from './controllers/maintenanceController.js';
import { SupportContactController } from './controllers/supportContactController.js';
import { LinkedDocumentController } from './controllers/linkedDocumentController.js';
import { createApplianceRoutes } from './routes/appliances.js';
import { authRoutes } from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authenticateUser, optionalAuth } from './middleware/auth.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
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
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Appliance Buddy API',
    version: '1.0.0',
    documentation: '/api/docs', // Future API documentation endpoint
  });
});

// Add a simple test endpoint to verify the backend is running
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend is running',
    port: config.port,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

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
