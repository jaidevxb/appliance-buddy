import { eq, desc, and } from 'drizzle-orm';
import { Database } from '../config/database.js';
import { appliances } from '../models/schema.js';
import { ApplianceCreateData, ApplianceUpdateData } from '../types/api.js';
import { parseDate, getMaintenanceStatus } from '../utils/dateUtils.js';

export class ApplianceService {
  constructor(private db: Database) {}

  async getAllAppliances(userId?: string) {
    const whereCondition = userId ? eq(appliances.userId, userId) : undefined;
    
    const result = await this.db.query.appliances.findMany({
      where: whereCondition,
      with: {
        supportContacts: true,
        maintenanceTasks: true,
        linkedDocuments: true,
      },
      orderBy: [desc(appliances.updatedAt)],
    });

    // Update maintenance task statuses based on current date
    return result.map(appliance => ({
      ...appliance,
      maintenanceTasks: appliance.maintenanceTasks.map(task => ({
        ...task,
        status: getMaintenanceStatus(task.scheduledDate, task.completedDate || undefined),
      })),
    }));
  }

  async getApplianceById(id: string, userId?: string) {
    const whereCondition = userId 
      ? and(eq(appliances.id, id), eq(appliances.userId, userId))
      : eq(appliances.id, id);
    
    const result = await this.db.query.appliances.findFirst({
      where: whereCondition,
      with: {
        supportContacts: true,
        maintenanceTasks: true,
        linkedDocuments: true,
      },
    });

    if (!result) {
      return null;
    }

    // Update maintenance task statuses based on current date
    return {
      ...result,
      maintenanceTasks: result.maintenanceTasks.map(task => ({
        ...task,
        status: getMaintenanceStatus(task.scheduledDate, task.completedDate || undefined),
      })),
    };
  }

  async createAppliance(data: ApplianceCreateData, userId: string) {
    const [appliance] = await this.db
      .insert(appliances)
      .values({
        ...data,
        userId, // Associate with the user
        purchaseDate: parseDate(data.purchaseDate),
        updatedAt: new Date(),
      })
      .returning();

    return await this.getApplianceById(appliance.id, userId);
  }

  async updateAppliance(id: string, data: ApplianceUpdateData, userId?: string) {
    const updateData: any = { ...data, updatedAt: new Date() };
    
    if (data.purchaseDate) {
      updateData.purchaseDate = parseDate(data.purchaseDate);
    }

    const whereCondition = userId 
      ? and(eq(appliances.id, id), eq(appliances.userId, userId))
      : eq(appliances.id, id);

    const [appliance] = await this.db
      .update(appliances)
      .set(updateData)
      .where(whereCondition)
      .returning();

    if (!appliance) {
      return null;
    }

    return await this.getApplianceById(appliance.id, userId);
  }

  async deleteAppliance(id: string, userId?: string) {
    const whereCondition = userId 
      ? and(eq(appliances.id, id), eq(appliances.userId, userId))
      : eq(appliances.id, id);

    const [deleted] = await this.db
      .delete(appliances)
      .where(whereCondition)
      .returning();

    return !!deleted;
  }

  async applianceExists(id: string, userId?: string): Promise<boolean> {
    const whereCondition = userId 
      ? and(eq(appliances.id, id), eq(appliances.userId, userId))
      : eq(appliances.id, id);
    
    const appliance = await this.db.query.appliances.findFirst({
      where: whereCondition,
      columns: { id: true },
    });
    return !!appliance;
  }
}