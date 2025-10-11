import { z } from 'zod';

// Appliance validation schemas
export const applianceCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  brand: z.string().min(1, 'Brand is required').max(255),
  model: z.string().min(1, 'Model is required').max(255),
  purchaseDate: z.string().datetime().or(z.date()),
  warrantyDurationMonths: z.number().int().min(1, 'Warranty duration must be at least 1 month'),
  serialNumber: z.string().max(255).optional(),
  purchaseLocation: z.string().max(255).optional(),
  notes: z.string().optional(),
});

export const applianceUpdateSchema = applianceCreateSchema.partial();

// Support contact validation schema
export const supportContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  company: z.string().max(255).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(255).optional(),
  website: z.string().url().max(500).optional(),
  notes: z.string().optional(),
});

export const supportContactUpdateSchema = supportContactSchema.partial();

// Maintenance task validation schema
export const maintenanceTaskSchema = z.object({
  taskName: z.string().min(1, 'Task name is required').max(255),
  scheduledDate: z.string().datetime().or(z.date()),
  frequency: z.enum(['One-time', 'Monthly', 'Yearly', 'Custom']),
  serviceProvider: z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    notes: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  status: z.enum(['Upcoming', 'Completed', 'Overdue']),
  completedDate: z.string().datetime().or(z.date()).optional(),
});

export const maintenanceTaskUpdateSchema = maintenanceTaskSchema.partial();

// Linked document validation schema
export const linkedDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  url: z.string().url().max(1000),
});

export const linkedDocumentUpdateSchema = linkedDocumentSchema.partial();

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Export validation schema types
export type ApplianceCreateData = z.infer<typeof applianceCreateSchema>;
export type ApplianceUpdateData = z.infer<typeof applianceUpdateSchema>;
export type SupportContactData = z.infer<typeof supportContactSchema>;
export type SupportContactUpdateData = z.infer<typeof supportContactUpdateSchema>;
export type MaintenanceTaskData = z.infer<typeof maintenanceTaskSchema>;
export type MaintenanceTaskUpdateData = z.infer<typeof maintenanceTaskUpdateSchema>;
export type LinkedDocumentData = z.infer<typeof linkedDocumentSchema>;
export type LinkedDocumentUpdateData = z.infer<typeof linkedDocumentUpdateSchema>;