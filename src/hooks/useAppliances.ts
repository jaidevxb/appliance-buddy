import { useState, useEffect } from 'react';
import { Appliance } from '@/types/appliance';

// Mock data for development
const mockAppliances: Appliance[] = [
  {
    id: '1',
    name: 'Samsung Refrigerator',
    brand: 'Samsung',
    model: 'RF28R7351SG',
    purchaseDate: new Date('2023-06-15'),
    warrantyDurationMonths: 24,
    serialNumber: 'SAM123456789',
    purchaseLocation: 'Best Buy',
    notes: 'French door style with ice maker',
    supportContacts: [
      {
        id: '1',
        name: 'Samsung Customer Support',
        company: 'Samsung',
        phone: '1-800-SAMSUNG',
        email: 'support@samsung.com',
        website: 'https://www.samsung.com/us/support/'
      }
    ],
    maintenanceTasks: [
      {
        id: '1',
        applianceId: '1',
        taskName: 'Replace water filter',
        scheduledDate: new Date('2024-12-15'),
        frequency: 'Monthly',
        status: 'Upcoming',
        notes: 'Model DA29-00020B filter'
      }
    ],
    linkedDocuments: [
      {
        id: '1',
        title: 'User Manual',
        url: 'https://www.samsung.com/us/support/owners/product/rf28r7351sg'
      }
    ]
  },
  {
    id: '2',
    name: 'LG Washing Machine',
    brand: 'LG',
    model: 'WM3900HWA',
    purchaseDate: new Date('2024-01-20'),
    warrantyDurationMonths: 12,
    serialNumber: 'LG987654321',
    purchaseLocation: 'Home Depot',
    supportContacts: [
      {
        id: '2',
        name: 'LG Customer Care',
        company: 'LG',
        phone: '1-800-243-0000',
        email: 'support@lg.com'
      }
    ],
    maintenanceTasks: [],
    linkedDocuments: []
  }
];

export const useAppliances = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from storage
    const timer = setTimeout(() => {
      const stored = localStorage.getItem('appliances');
      if (stored) {
        const parsedAppliances = JSON.parse(stored).map((app: any) => ({
          ...app,
          purchaseDate: new Date(app.purchaseDate),
          maintenanceTasks: app.maintenanceTasks.map((task: any) => ({
            ...task,
            scheduledDate: new Date(task.scheduledDate),
            completedDate: task.completedDate ? new Date(task.completedDate) : undefined
          }))
        }));
        setAppliances(parsedAppliances);
      } else {
        setAppliances(mockAppliances);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const saveAppliances = (newAppliances: Appliance[]) => {
    localStorage.setItem('appliances', JSON.stringify(newAppliances));
    setAppliances(newAppliances);
  };

  const addAppliance = (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>) => {
    const newAppliance: Appliance = {
      ...appliance,
      id: crypto.randomUUID(),
      supportContacts: [],
      maintenanceTasks: [],
      linkedDocuments: []
    };
    const updated = [...appliances, newAppliance];
    saveAppliances(updated);
  };

  const updateAppliance = (id: string, updates: Partial<Appliance>) => {
    const updated = appliances.map(app => 
      app.id === id ? { ...app, ...updates } : app
    );
    saveAppliances(updated);
  };

  const deleteAppliance = (id: string) => {
    const updated = appliances.filter(app => app.id !== id);
    saveAppliances(updated);
  };

  return {
    appliances,
    loading,
    addAppliance,
    updateAppliance,
    deleteAppliance
  };
};