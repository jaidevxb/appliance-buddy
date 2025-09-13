import { eq, and, desc } from 'drizzle-orm';
import { Database } from '../config/database.js';
import { maintenanceTasks } from '../models/schema.js';
import { MaintenanceTaskData, MaintenanceTaskUpdateData } from '../types/api.js';
import { parseDate, getMaintenanceStatus } from '../utils/dateUtils.js';

export class MaintenanceService {
  constructor(private db: Database) {}

  async getMaintenanceTasksByApplianceId(applianceId: string) {
    const tasks = await this.db.query.maintenanceTasks.findMany({
      where: eq(maintenanceTasks.applianceId, applianceId),
      orderBy: [desc(maintenanceTasks.scheduledDate)],
    });

    // Update task statuses based on current date
    return tasks.map(task => ({
      ...task,
      status: getMaintenanceStatus(task.scheduledDate, task.completedDate || undefined),
    }));
  }

  async getMaintenanceTaskById(applianceId: string, taskId: string) {
    const task = await this.db.query.maintenanceTasks.findFirst({
      where: and(
        eq(maintenanceTasks.id, taskId),
        eq(maintenanceTasks.applianceId, applianceId)
      ),
    });

    if (!task) {
      return null;
    }

    // Update task status based on current date
    return {
      ...task,
      status: getMaintenanceStatus(task.scheduledDate, task.completedDate || undefined),
    };
  }

  async createMaintenanceTask(applianceId: string, data: MaintenanceTaskData) {
    const [task] = await this.db
      .insert(maintenanceTasks)
      .values({
        ...data,
        applianceId,
        scheduledDate: parseDate(data.scheduledDate),
        completedDate: data.completedDate ? parseDate(data.completedDate) : null,
        updatedAt: new Date(),
      })
      .returning();

    return await this.getMaintenanceTaskById(applianceId, task.id);
  }

  async updateMaintenanceTask(applianceId: string, taskId: string, data: MaintenanceTaskUpdateData) {
    const updateData: any = { ...data, updatedAt: new Date() };
    
    if (data.scheduledDate) {
      updateData.scheduledDate = parseDate(data.scheduledDate);
    }
    
    if (data.completedDate) {
      updateData.completedDate = parseDate(data.completedDate);
    }

    const [task] = await this.db
      .update(maintenanceTasks)
      .set(updateData)
      .where(and(
        eq(maintenanceTasks.id, taskId),
        eq(maintenanceTasks.applianceId, applianceId)
      ))
      .returning();

    if (!task) {
      return null;
    }

    return await this.getMaintenanceTaskById(applianceId, task.id);
  }

  async deleteMaintenanceTask(applianceId: string, taskId: string) {
    const [deleted] = await this.db
      .delete(maintenanceTasks)
      .where(and(
        eq(maintenanceTasks.id, taskId),
        eq(maintenanceTasks.applianceId, applianceId)
      ))
      .returning();

    return !!deleted;
  }
}