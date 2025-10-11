import { eq, and, desc } from 'drizzle-orm';
import { Database } from '../config/database';
import { maintenanceTasks } from '../models/schema';
import { MaintenanceTaskData, MaintenanceTaskUpdateData } from '../types/api';
import { parseDate, getMaintenanceStatus } from '../utils/dateUtils';

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
        taskName: data.taskName,
        scheduledDate: parseDate(data.scheduledDate),
        frequency: data.frequency,
        serviceProvider: data.serviceProvider,
        notes: data.notes,
        status: data.status,
        completedDate: data.completedDate ? parseDate(data.completedDate) : null,
        applianceId,
        updatedAt: new Date(),
      })
      .returning();

    return await this.getMaintenanceTaskById(applianceId, task.id);
  }

  async updateMaintenanceTask(applianceId: string, taskId: string, data: MaintenanceTaskUpdateData) {
    const updateData: any = { updatedAt: new Date() };
    
    if (data.taskName !== undefined) updateData.taskName = data.taskName;
    if (data.scheduledDate !== undefined) updateData.scheduledDate = parseDate(data.scheduledDate);
    if (data.frequency !== undefined) updateData.frequency = data.frequency;
    if (data.serviceProvider !== undefined) updateData.serviceProvider = data.serviceProvider;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.completedDate !== undefined) updateData.completedDate = data.completedDate ? parseDate(data.completedDate) : null;

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