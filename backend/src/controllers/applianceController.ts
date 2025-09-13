import { Request, Response, NextFunction } from 'express';
import { ApplianceService } from '../services/applianceService';
import { sendSuccess, sendNotFound } from '../utils/responseHelpers';
import { asyncHandler } from '../middleware/errorHandler';
import { ApplianceCreateData, ApplianceUpdateData } from '../types/api';

export class ApplianceController {
  constructor(private applianceService: ApplianceService) {}

  // GET /api/appliances
  getAllAppliances = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id; // Get user ID from auth middleware
    const appliances = await this.applianceService.getAllAppliances(userId);
    return sendSuccess(res, appliances);
  });

  // GET /api/appliances/:id
  getApplianceById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const appliance = await this.applianceService.getApplianceById(id, userId);
    
    if (!appliance) {
      return sendNotFound(res, 'Appliance');
    }
    
    return sendSuccess(res, appliance);
  });

  // POST /api/appliances
  createAppliance = asyncHandler(async (req: Request, res: Response) => {
    const data: ApplianceCreateData = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const appliance = await this.applianceService.createAppliance(data, userId);
    return sendSuccess(res, appliance, 'Appliance created successfully', 201);
  });

  // PUT /api/appliances/:id
  updateAppliance = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: ApplianceUpdateData = req.body;
    const userId = req.user?.id;
    const appliance = await this.applianceService.updateAppliance(id, data, userId);
    
    if (!appliance) {
      return sendNotFound(res, 'Appliance');
    }
    
    return sendSuccess(res, appliance, 'Appliance updated successfully');
  });

  // DELETE /api/appliances/:id
  deleteAppliance = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const deleted = await this.applianceService.deleteAppliance(id, userId);
    
    if (!deleted) {
      return sendNotFound(res, 'Appliance');
    }
    
    return sendSuccess(res, null, 'Appliance deleted successfully');
  });
}