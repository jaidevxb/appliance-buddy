import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appliance } from '@/types/appliance';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useAppliances = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    data: appliances = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['appliances', user?.id], // Include user ID in query key
    queryFn: async () => {
      try {
        console.log('Fetching appliances for user:', user?.email);
        const result = await apiService.getAllAppliances();
        console.log('Appliances fetched:', result);
        return result;
      } catch (error) {
        console.error('Error fetching appliances:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!user, // Only run query when user is authenticated
  });

  const addApplianceMutation = useMutation({
    mutationFn: (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>) =>
      apiService.createAppliance(appliance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances', user?.id] });
      toast({
        title: "Success",
        description: "Appliance created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create appliance",
        variant: "destructive",
      });
    },
  });

  const updateApplianceMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Appliance> }) =>
      apiService.updateAppliance(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances', user?.id] });
      toast({
        title: "Success",
        description: "Appliance updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update appliance",
        variant: "destructive",
      });
    },
  });

  const deleteApplianceMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteAppliance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances', user?.id] });
      toast({
        title: "Success",
        description: "Appliance deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete appliance",
        variant: "destructive",
      });
    },
  });

  const addAppliance = async (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>) => {
    return addApplianceMutation.mutateAsync(appliance);
  };

  const updateAppliance = async (id: string, updates: Partial<Appliance>) => {
    return updateApplianceMutation.mutateAsync({ id, updates });
  };

  const deleteAppliance = async (id: string) => {
    return deleteApplianceMutation.mutateAsync(id);
  };

  const resetToSampleDataMutation = useMutation({
    mutationFn: () => apiService.resetToSampleData(),
    onSuccess: (data) => {
      // Don't invalidate queries here - we'll handle this in the component
      // Return the data to the component for confirmation dialog
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to check existing data",
        variant: "destructive",
      });
    },
  });

  const confirmResetToSampleDataMutation = useMutation({
    mutationFn: () => apiService.confirmResetToSampleData(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances', user?.id] });
      toast({
        title: "Success",
        description: "Sample data has been loaded successfully with 5 appliances!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create sample data",
        variant: "destructive",
      });
    },
  });

  const resetToSampleData = async () => {
    return resetToSampleDataMutation.mutateAsync();
  };

  const confirmResetToSampleData = async () => {
    return confirmResetToSampleDataMutation.mutateAsync();
  };

  return {
    appliances,
    loading,
    error,
    addAppliance,
    updateAppliance,
    deleteAppliance,
    resetToSampleData,
    confirmResetToSampleData,
    isCreating: addApplianceMutation.isPending,
    isUpdating: updateApplianceMutation.isPending,
    isDeleting: deleteApplianceMutation.isPending,
    isResetting: resetToSampleDataMutation.isPending,
    isConfirmingReset: confirmResetToSampleDataMutation.isPending,
  };
};