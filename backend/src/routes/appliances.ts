import { Router } from 'express';
import { ApplianceController } from '../controllers/applianceController';
import { MaintenanceController } from '../controllers/maintenanceController';
import { SupportContactController } from '../controllers/supportContactController';
import { LinkedDocumentController } from '../controllers/linkedDocumentController';
import { validateBody, validateParams, uuidParamSchema, applianceParamSchema, nestedResourceParamSchema } from '../middleware/validation';
import {
  applianceCreateSchema,
  applianceUpdateSchema,
  maintenanceTaskSchema,
  maintenanceTaskUpdateSchema,
  supportContactSchema,
  supportContactUpdateSchema,
  linkedDocumentSchema,
  linkedDocumentUpdateSchema
} from '../types/api';

export function createApplianceRoutes(
  applianceController: ApplianceController,
  maintenanceController: MaintenanceController,
  supportContactController: SupportContactController,
  linkedDocumentController: LinkedDocumentController
) {
  const router = Router();

  // Appliance CRUD routes
  router.get('/', applianceController.getAllAppliances);
  router.get('/:id', validateParams(uuidParamSchema), applianceController.getApplianceById);
  router.post('/', validateBody(applianceCreateSchema), applianceController.createAppliance);
  router.put('/:id', validateParams(uuidParamSchema), validateBody(applianceUpdateSchema), applianceController.updateAppliance);
  router.delete('/:id', validateParams(uuidParamSchema), applianceController.deleteAppliance);

  // Maintenance task routes
  router.get('/:applianceId/maintenance', validateParams(applianceParamSchema), maintenanceController.getMaintenanceTasks);
  router.get('/:applianceId/maintenance/:id', validateParams(nestedResourceParamSchema), maintenanceController.getMaintenanceTaskById);
  router.post('/:applianceId/maintenance', validateParams(applianceParamSchema), validateBody(maintenanceTaskSchema), maintenanceController.createMaintenanceTask);
  router.put('/:applianceId/maintenance/:id', validateParams(nestedResourceParamSchema), validateBody(maintenanceTaskUpdateSchema), maintenanceController.updateMaintenanceTask);
  router.delete('/:applianceId/maintenance/:id', validateParams(nestedResourceParamSchema), maintenanceController.deleteMaintenanceTask);

  // Support contact routes
  router.get('/:applianceId/contacts', validateParams(applianceParamSchema), supportContactController.getSupportContacts);
  router.get('/:applianceId/contacts/:id', validateParams(nestedResourceParamSchema), supportContactController.getSupportContactById);
  router.post('/:applianceId/contacts', validateParams(applianceParamSchema), validateBody(supportContactSchema), supportContactController.createSupportContact);
  router.put('/:applianceId/contacts/:id', validateParams(nestedResourceParamSchema), validateBody(supportContactUpdateSchema), supportContactController.updateSupportContact);
  router.delete('/:applianceId/contacts/:id', validateParams(nestedResourceParamSchema), supportContactController.deleteSupportContact);

  // Linked document routes
  router.get('/:applianceId/documents', validateParams(applianceParamSchema), linkedDocumentController.getLinkedDocuments);
  router.get('/:applianceId/documents/:id', validateParams(nestedResourceParamSchema), linkedDocumentController.getLinkedDocumentById);
  router.post('/:applianceId/documents', validateParams(applianceParamSchema), validateBody(linkedDocumentSchema), linkedDocumentController.createLinkedDocument);
  router.put('/:applianceId/documents/:id', validateParams(nestedResourceParamSchema), validateBody(linkedDocumentUpdateSchema), linkedDocumentController.updateLinkedDocument);
  router.delete('/:applianceId/documents/:id', validateParams(nestedResourceParamSchema), linkedDocumentController.deleteLinkedDocument);

  return router;
}