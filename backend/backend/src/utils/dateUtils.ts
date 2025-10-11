import { differenceInDays, isAfter, addMonths } from 'date-fns';

export type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired';
export type MaintenanceStatus = 'Upcoming' | 'Completed' | 'Overdue';

/**
 * Calculate the warranty end date based on purchase date and duration
 */
export const calculateWarrantyEndDate = (purchaseDate: Date, warrantyDurationMonths: number): Date => {
  return addMonths(purchaseDate, warrantyDurationMonths);
};

/**
 * Determine the warranty status based on purchase date and duration
 */
export const getWarrantyStatus = (purchaseDate: Date, warrantyDurationMonths: number): WarrantyStatus => {
  const now = new Date();
  const warrantyEndDate = calculateWarrantyEndDate(purchaseDate, warrantyDurationMonths);
  const daysUntilExpiry = differenceInDays(warrantyEndDate, now);

  if (isAfter(now, warrantyEndDate)) {
    return 'Expired';
  } else if (daysUntilExpiry <= 30) {
    return 'Expiring Soon';
  } else {
    return 'Active';
  }
};

/**
 * Determine the maintenance status based on scheduled and completed dates
 */
export const getMaintenanceStatus = (scheduledDate: Date, completedDate?: Date): MaintenanceStatus => {
  if (completedDate) {
    return 'Completed';
  }
  
  const now = new Date();
  if (isAfter(now, scheduledDate)) {
    return 'Overdue';
  }
  
  return 'Upcoming';
};

/**
 * Convert string dates to Date objects for database operations
 */
export const parseDate = (dateInput: string | Date): Date => {
  if (dateInput instanceof Date) {
    return dateInput;
  }
  return new Date(dateInput);
};