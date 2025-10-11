import { Router } from 'express';
import { ApplianceController } from '@/controllers/applianceController';
import { MaintenanceController } from '@/controllers/maintenanceController';
import { SupportContactController } from '@/controllers/supportContactController';
import { LinkedDocumentController } from '@/controllers/linkedDocumentController';
import { authenticateUser } from '@/middleware/auth';
import { 
  validateAppliance, 
  validateMaintenanceTask, 
  validateSupportContact, 
  validateLinkedDocument 
} from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';

export function createApplianceRoutes(
  applianceController: ApplianceController,
  maintenanceController: MaintenanceController,
  supportContactController: SupportContactController,
  linkedDocumentController: LinkedDocumentController
) {
  const router = Router();

  // Appliance CRUD routes
  router.get('/', applianceController.getAllAppliances);
  router.get('/:id', validateAppliance, applianceController.getApplianceById);
  router.post('/', validateAppliance, applianceController.createAppliance);
  router.put('/:id', validateAppliance, applianceController.updateAppliance);
  router.delete('/:id', validateAppliance, applianceController.deleteAppliance);

  // Maintenance task routes
  router.get('/:applianceId/maintenance', validateAppliance, maintenanceController.getMaintenanceTasks);
  router.get('/:applianceId/maintenance/:id', validateMaintenanceTask, maintenanceController.getMaintenanceTaskById);
  router.post('/:applianceId/maintenance', validateAppliance, validateMaintenanceTask, maintenanceController.createMaintenanceTask);
  router.put('/:applianceId/maintenance/:id', validateMaintenanceTask, maintenanceController.updateMaintenanceTask);
  router.delete('/:applianceId/maintenance/:id', validateMaintenanceTask, maintenanceController.deleteMaintenanceTask);

  // Support contact routes
  router.get('/:applianceId/contacts', validateAppliance, supportContactController.getSupportContacts);
  router.get('/:applianceId/contacts/:id', validateSupportContact, supportContactController.getSupportContactById);
  router.post('/:applianceId/contacts', validateAppliance, validateSupportContact, supportContactController.createSupportContact);
  router.put('/:applianceId/contacts/:id', validateSupportContact, supportContactController.updateSupportContact);
  router.delete('/:applianceId/contacts/:id', validateSupportContact, supportContactController.deleteSupportContact);

  // Linked document routes
  router.get('/:applianceId/documents', validateAppliance, linkedDocumentController.getLinkedDocuments);
  router.get('/:applianceId/documents/:id', validateLinkedDocument, linkedDocumentController.getLinkedDocumentById);
  router.post('/:applianceId/documents', validateAppliance, validateLinkedDocument, linkedDocumentController.createLinkedDocument);
  router.put('/:applianceId/documents/:id', validateLinkedDocument, linkedDocumentController.updateLinkedDocument);
  router.delete('/:applianceId/documents/:id', validateLinkedDocument, linkedDocumentController.deleteLinkedDocument);

  return router;
}