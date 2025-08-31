import { useState, useEffect } from 'react';
import { Appliance } from '@/types/appliance';
import { generateMockAppliances } from '@/data/mockAppliances';
import { getMaintenanceStatus } from '@/utils/dateUtils';

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
            completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
            // Recompute status to ensure it's current
            status: getMaintenanceStatus(new Date(task.scheduledDate), task.completedDate ? new Date(task.completedDate) : undefined)
          }))
        }));
        setAppliances(parsedAppliances);
      } else {
        setAppliances(generateMockAppliances());
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

  const resetToSampleData = () => {
    localStorage.removeItem('appliances');
    const freshData = generateMockAppliances();
    setAppliances(freshData);
  };

  return {
    appliances,
    loading,
    addAppliance,
    updateAppliance,
    deleteAppliance,
    resetToSampleData
  };
};