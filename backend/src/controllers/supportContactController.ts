import { Request, Response } from 'express';
import { SupportContactService } from '../services/supportContactService.js';
import { ApplianceService } from '../services/applianceService.js';
import { sendSuccess, sendNotFound } from '../utils/responseHelpers.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { SupportContactData, SupportContactUpdateData } from '../types/api.js';

export class SupportContactController {
  constructor(
    private supportContactService: SupportContactService,
    private applianceService: ApplianceService
  ) {}

  // GET /api/appliances/:applianceId/contacts
  getSupportContacts = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId } = req.params;
    
    // Check if appliance exists
    const applianceExists = await this.applianceService.applianceExists(applianceId);
    if (!applianceExists) {
      return sendNotFound(res, 'Appliance');
    }
    
    const contacts = await this.supportContactService.getSupportContactsByApplianceId(applianceId);
    return sendSuccess(res, contacts);
  });

  // GET /api/appliances/:applianceId/contacts/:id
  getSupportContactById = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    
    const contact = await this.supportContactService.getSupportContactById(applianceId, id);
    if (!contact) {
      return sendNotFound(res, 'Support contact');
    }
    
    return sendSuccess(res, contact);
  });

  // POST /api/appliances/:applianceId/contacts
  createSupportContact = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const data: SupportContactData = req.body;
    
    // Check if appliance exists
    const applianceExists = await this.applianceService.applianceExists(applianceId);
    if (!applianceExists) {
      return sendNotFound(res, 'Appliance');
    }
    
    const contact = await this.supportContactService.createSupportContact(applianceId, data);
    return sendSuccess(res, contact, 'Support contact created successfully', 201);
  });

  // PUT /api/appliances/:applianceId/contacts/:id
  updateSupportContact = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    const data: SupportContactUpdateData = req.body;
    
    const contact = await this.supportContactService.updateSupportContact(applianceId, id, data);
    if (!contact) {
      return sendNotFound(res, 'Support contact');
    }
    
    return sendSuccess(res, contact, 'Support contact updated successfully');
  });

  // DELETE /api/appliances/:applianceId/contacts/:id
  deleteSupportContact = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    
    const deleted = await this.supportContactService.deleteSupportContact(applianceId, id);
    if (!deleted) {
      return sendNotFound(res, 'Support contact');
    }
    
    return sendSuccess(res, null, 'Support contact deleted successfully');
  });
}