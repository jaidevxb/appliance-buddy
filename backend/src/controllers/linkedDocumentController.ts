import { Request, Response } from 'express';
import { LinkedDocumentService } from '../services/linkedDocumentService';
import { ApplianceService } from '../services/applianceService';
import { sendSuccess, sendNotFound } from '../utils/responseHelpers';
import { asyncHandler } from '../middleware/errorHandler';
import { LinkedDocumentData, LinkedDocumentUpdateData } from '../types/api';

export class LinkedDocumentController {
  constructor(
    private linkedDocumentService: LinkedDocumentService,
    private applianceService: ApplianceService
  ) {}

  // GET /api/appliances/:applianceId/documents
  getLinkedDocuments = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId } = req.params;
    
    // Check if appliance exists
    const applianceExists = await this.applianceService.applianceExists(applianceId);
    if (!applianceExists) {
      return sendNotFound(res, 'Appliance');
    }
    
    const documents = await this.linkedDocumentService.getLinkedDocumentsByApplianceId(applianceId);
    return sendSuccess(res, documents);
  });

  // GET /api/appliances/:applianceId/documents/:id
  getLinkedDocumentById = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    
    const document = await this.linkedDocumentService.getLinkedDocumentById(applianceId, id);
    if (!document) {
      return sendNotFound(res, 'Linked document');
    }
    
    return sendSuccess(res, document);
  });

  // POST /api/appliances/:applianceId/documents
  createLinkedDocument = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const data: LinkedDocumentData = req.body;
    
    // Check if appliance exists
    const applianceExists = await this.applianceService.applianceExists(applianceId);
    if (!applianceExists) {
      return sendNotFound(res, 'Appliance');
    }
    
    const document = await this.linkedDocumentService.createLinkedDocument(applianceId, data);
    return sendSuccess(res, document, 'Linked document created successfully', 201);
  });

  // PUT /api/appliances/:applianceId/documents/:id
  updateLinkedDocument = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    const data: LinkedDocumentUpdateData = req.body;
    
    const document = await this.linkedDocumentService.updateLinkedDocument(applianceId, id, data);
    if (!document) {
      return sendNotFound(res, 'Linked document');
    }
    
    return sendSuccess(res, document, 'Linked document updated successfully');
  });

  // DELETE /api/appliances/:applianceId/documents/:id
  deleteLinkedDocument = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    
    const deleted = await this.linkedDocumentService.deleteLinkedDocument(applianceId, id);
    if (!deleted) {
      return sendNotFound(res, 'Linked document');
    }
    
    return sendSuccess(res, null, 'Linked document deleted successfully');
  });
}