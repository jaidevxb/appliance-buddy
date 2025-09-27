import { Request, Response } from 'express';
import { MaintenanceService } from '../services/maintenanceService';
import { ApplianceService } from '../services/applianceService';
import { sendSuccess, sendNotFound, sendError } from '../utils/responseHelpers';
import { asyncHandler } from '../middleware/errorHandler';
import { MaintenanceTaskData, MaintenanceTaskUpdateData } from '../types/api';

export class MaintenanceController {
  constructor(
    private maintenanceService: MaintenanceService,
    private applianceService: ApplianceService
  ) {}

  // GET /api/appliances/:applianceId/maintenance
  getMaintenanceTasks = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId } = req.params;
    
    // Check if appliance exists
    const applianceExists = await this.applianceService.applianceExists(applianceId);
    if (!applianceExists) {
      return sendNotFound(res, 'Appliance');
    }
    
    const tasks = await this.maintenanceService.getMaintenanceTasksByApplianceId(applianceId);
    return sendSuccess(res, tasks);
  });

  // GET /api/appliances/:applianceId/maintenance/:id
  getMaintenanceTaskById = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    
    const task = await this.maintenanceService.getMaintenanceTaskById(applianceId, id);
    if (!task) {
      return sendNotFound(res, 'Maintenance task');
    }
    
    return sendSuccess(res, task);
  });

  // POST /api/appliances/:applianceId/maintenance
  createMaintenanceTask = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const data: MaintenanceTaskData = req.body;
    
    // Check if appliance exists
    const applianceExists = await this.applianceService.applianceExists(applianceId);
    if (!applianceExists) {
      return sendNotFound(res, 'Appliance');
    }
    
    const task = await this.maintenanceService.createMaintenanceTask(applianceId, data);
    return sendSuccess(res, task, 'Maintenance task created successfully', 201);
  });

  // PUT /api/appliances/:applianceId/maintenance/:id
  updateMaintenanceTask = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    const data: MaintenanceTaskUpdateData = req.body;
    
    const task = await this.maintenanceService.updateMaintenanceTask(applianceId, id, data);
    if (!task) {
      return sendNotFound(res, 'Maintenance task');
    }
    
    return sendSuccess(res, task, 'Maintenance task updated successfully');
  });

  // DELETE /api/appliances/:applianceId/maintenance/:id
  deleteMaintenanceTask = asyncHandler(async (req: Request, res: Response) => {
    const { applianceId, id } = req.params;
    
    const deleted = await this.maintenanceService.deleteMaintenanceTask(applianceId, id);
    if (!deleted) {
      return sendNotFound(res, 'Maintenance task');
    }
    
    return sendSuccess(res, null, 'Maintenance task deleted successfully');
  });
}