import { Appliance, SupportContact, MaintenanceTask, LinkedDocument } from '@/types/appliance';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export class ApiService {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return headers;
  }

  private async fetchWithHandling<T>(url: string, options?: RequestInit): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    
    console.log(`API Request: ${API_BASE_URL}${url}`, { headers: authHeaders });
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        ...authHeaders,
        'ngrok-skip-browser-warning': 'true', // Bypass ngrok warning page
        ...options?.headers,
      },
      ...options,
    });

    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    const result: ApiResponse<T> = await response.json();
    console.log('API Result:', result);

    if (!response.ok || !result.success) {
      const errorMessage = result.message || `HTTP ${response.status}`;
      console.error('API Error:', errorMessage, result.errors);
      const error = new Error(errorMessage);
      (error as any).statusCode = response.status;
      (error as any).errors = result.errors;
      throw error;
    }

    return result.data as T;
  }

  // Appliances
  async getAllAppliances(): Promise<Appliance[]> {
    return this.fetchWithHandling<Appliance[]>('/appliances');
  }

  async getApplianceById(id: string): Promise<Appliance> {
    return this.fetchWithHandling<Appliance>(`/appliances/${id}`);
  }

  async createAppliance(appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>): Promise<Appliance> {
    return this.fetchWithHandling<Appliance>('/appliances', {
      method: 'POST',
      body: JSON.stringify(appliance),
    });
  }

  async updateAppliance(id: string, updates: Partial<Appliance>): Promise<Appliance> {
    return this.fetchWithHandling<Appliance>(`/appliances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAppliance(id: string): Promise<void> {
    await this.fetchWithHandling<void>(`/appliances/${id}`, {
      method: 'DELETE',
    });
  }

  // Maintenance Tasks
  async getMaintenanceTasks(applianceId: string): Promise<MaintenanceTask[]> {
    return this.fetchWithHandling<MaintenanceTask[]>(`/appliances/${applianceId}/maintenance`);
  }

  async createMaintenanceTask(applianceId: string, task: Omit<MaintenanceTask, 'id' | 'applianceId'>): Promise<MaintenanceTask> {
    return this.fetchWithHandling<MaintenanceTask>(`/appliances/${applianceId}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateMaintenanceTask(applianceId: string, taskId: string, updates: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
    return this.fetchWithHandling<MaintenanceTask>(`/appliances/${applianceId}/maintenance/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMaintenanceTask(applianceId: string, taskId: string): Promise<void> {
    await this.fetchWithHandling<void>(`/appliances/${applianceId}/maintenance/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Support Contacts
  async getSupportContacts(applianceId: string): Promise<SupportContact[]> {
    return this.fetchWithHandling<SupportContact[]>(`/appliances/${applianceId}/contacts`);
  }

  async createSupportContact(applianceId: string, contact: Omit<SupportContact, 'id'>): Promise<SupportContact> {
    return this.fetchWithHandling<SupportContact>(`/appliances/${applianceId}/contacts`, {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async updateSupportContact(applianceId: string, contactId: string, updates: Partial<SupportContact>): Promise<SupportContact> {
    return this.fetchWithHandling<SupportContact>(`/appliances/${applianceId}/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSupportContact(applianceId: string, contactId: string): Promise<void> {
    await this.fetchWithHandling<void>(`/appliances/${applianceId}/contacts/${contactId}`, {
      method: 'DELETE',
    });
  }

  // Linked Documents
  async getLinkedDocuments(applianceId: string): Promise<LinkedDocument[]> {
    return this.fetchWithHandling<LinkedDocument[]>(`/appliances/${applianceId}/documents`);
  }

  async createLinkedDocument(applianceId: string, document: Omit<LinkedDocument, 'id'>): Promise<LinkedDocument> {
    return this.fetchWithHandling<LinkedDocument>(`/appliances/${applianceId}/documents`, {
      method: 'POST',
      body: JSON.stringify(document),
    });
  }

  async updateLinkedDocument(applianceId: string, documentId: string, updates: Partial<LinkedDocument>): Promise<LinkedDocument> {
    return this.fetchWithHandling<LinkedDocument>(`/appliances/${applianceId}/documents/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteLinkedDocument(applianceId: string, documentId: string): Promise<void> {
    await this.fetchWithHandling<void>(`/appliances/${applianceId}/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // Reset to sample data - check if user has existing appliances
  async resetToSampleData(): Promise<{ hasExistingAppliances: boolean; existingCount: number; message: string }> {
    return this.fetchWithHandling<{ hasExistingAppliances: boolean; existingCount: number; message: string }>('/auth/reset-sample-data', {
      method: 'POST',
    });
  }

  // Confirm reset to sample data
  async confirmResetToSampleData(): Promise<void> {
    await this.fetchWithHandling<void>('/auth/confirm-reset-sample-data', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();