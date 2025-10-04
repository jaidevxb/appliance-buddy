import { useState } from 'react';
import { useAppliances } from '@/hooks/useAppliances';
import { useAuth } from '@/contexts/AuthContext';
import { ApplianceCard } from '@/components/ApplianceCard';
import { ApplianceForm } from '@/components/ApplianceForm';
import { ApplianceDetailView } from '@/components/ApplianceDetailView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Home, 
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  LogOut
} from 'lucide-react';
import { Appliance } from '@/types/appliance';
import { getWarrantyStatus } from '@/utils/dateUtils';

const Index = () => {
  const { appliances, loading, error, addAppliance, updateAppliance, deleteAppliance, resetToSampleData, confirmResetToSampleData, isResetting, isConfirmingReset } = useAppliances();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'expired' | 'expiring' | 'active'>('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [hasExistingAppliances, setHasExistingAppliances] = useState(false);
  const [viewingAppliance, setViewingAppliance] = useState<Appliance | null>(null);

  console.log('Index component state:', { 
    appliances: appliances?.length || 0, 
    loading, 
    error: error?.message || null, 
    user: user?.email || null 
  });

  const filteredAppliances = appliances.filter(appliance => {
    const matchesSearch = 
      appliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appliance.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appliance.model.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    
    const warrantyStatus = getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths);
    
    switch (filter) {
      case 'expired': return warrantyStatus === 'Expired';
      case 'expiring': return warrantyStatus === 'Expiring Soon';
      case 'active': return warrantyStatus === 'Active';
      default: return true;
    }
  });

  const stats = {
    total: appliances.length,
    expired: appliances.filter(a => getWarrantyStatus(a.purchaseDate, a.warrantyDurationMonths) === 'Expired').length,
    expiring: appliances.filter(a => getWarrantyStatus(a.purchaseDate, a.warrantyDurationMonths) === 'Expiring Soon').length,
    active: appliances.filter(a => getWarrantyStatus(a.purchaseDate, a.warrantyDurationMonths) === 'Active').length,
  };

  const handleSave = async (applianceData: {
    name: string;
    brand: string;
    model: string;
    purchaseDate: Date;
    warrantyDurationMonths: number;
    serialNumber?: string;
    purchaseLocation?: string;
    notes?: string;
    supportContacts: any[];
    maintenanceTasks: any[];
    linkedDocuments: any[];
  }) => {
    try {
      // First, save the basic appliance data
      const basicApplianceData = {
        name: applianceData.name,
        brand: applianceData.brand,
        model: applianceData.model,
        purchaseDate: applianceData.purchaseDate,
        warrantyDurationMonths: applianceData.warrantyDurationMonths,
        serialNumber: applianceData.serialNumber,
        purchaseLocation: applianceData.purchaseLocation,
        notes: applianceData.notes
      };

      let savedAppliance;
      if (editingAppliance) {
        savedAppliance = await updateAppliance(editingAppliance.id, basicApplianceData);
      } else {
        // For new appliances, use the API service directly to avoid early query invalidation
        savedAppliance = await apiService.createAppliance(basicApplianceData);
      }

      // Now save the additional sections using the appliance ID
      const applianceId = editingAppliance?.id || savedAppliance.id;
      
      if (applianceId) {
        // Save support contacts
        for (const contact of applianceData.supportContacts) {
          if (contact.name.trim()) { // Only save contacts with names
            await apiService.createSupportContact(applianceId, {
              name: contact.name.trim(),
              company: contact.company?.trim() || undefined,
              phone: contact.phone?.trim() || undefined,
              email: contact.email?.trim() || undefined,
              website: contact.website?.trim() || undefined,
              notes: contact.notes?.trim() || undefined,
            });
          }
        }

        // Save maintenance tasks
        for (const task of applianceData.maintenanceTasks) {
          if (task.taskName.trim()) { // Only save tasks with task names
            await apiService.createMaintenanceTask(applianceId, {
              taskName: task.taskName.trim(),
              scheduledDate: task.scheduledDate,
              frequency: task.frequency || 'Yearly',
              serviceProvider: task.serviceProvider?.name ? {
                name: task.serviceProvider.name.trim(),
                phone: task.serviceProvider.phone?.trim() || undefined,
                email: task.serviceProvider.email?.trim() || undefined,
                notes: task.serviceProvider.notes?.trim() || undefined,
              } : undefined,
              notes: task.notes?.trim() || undefined,
              status: task.status || 'Upcoming',
              completedDate: task.completedDate,
            });
          }
        }

        // Save linked documents
        for (const document of applianceData.linkedDocuments) {
          if (document.title.trim() && document.url.trim()) { // Only save documents with title and URL
            await apiService.createLinkedDocument(applianceId, {
              title: document.title.trim(),
              url: document.url.trim(),
            });
          }
        }
      }

      // Only refresh the data after ALL sections have been saved
      if (!editingAppliance) {
        // For new appliances, manually invalidate queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ['appliances', user?.id] });
        
        // Show success toast
        toast({
          title: "Success",
          description: "Appliance created successfully",
        });
      }

      setShowForm(false);
      setEditingAppliance(undefined);
    } catch (error) {
      console.error('Error saving appliance with details:', error);
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to save appliance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setShowForm(true);
  };

  const handleView = (appliance: Appliance) => {
    setViewingAppliance(appliance);
  };

  const handleDelete = async (appliance: Appliance) => {
    try {
      await deleteAppliance(appliance.id);
      // If we're currently viewing this appliance, close the detail view
      if (viewingAppliance?.id === appliance.id) {
        setViewingAppliance(null);
      }
    } catch (error) {
      console.error('Error deleting appliance:', error);
      // Error toast is already handled by the useAppliances hook
    }
  };

  const handleResetToSampleData = async () => {
    try {
      const result = await resetToSampleData();
      setHasExistingAppliances(result.hasExistingAppliances);
      setConfirmMessage(result.message);
      
      if (result.hasExistingAppliances) {
        setShowConfirmDialog(true);
      } else {
        // No existing appliances, proceed directly
        await confirmResetToSampleData();
      }
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Failed to check sample data:', error);
    }
  };

  const handleConfirmReset = async () => {
    try {
      await confirmResetToSampleData();
      setShowConfirmDialog(false);
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Failed to reset sample data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your appliances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Appliances</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Home Appliance Tracker</h1>
                <p className="text-muted-foreground">Keep track of warranties and maintenance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleResetToSampleData}
                className="gap-2"
                size="sm"
                disabled={isResetting || isConfirmingReset}
              >
                {(isResetting || isConfirmingReset) && <Clock className="h-4 w-4 animate-spin" />}
                Reset to Sample Data
              </Button>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Appliance
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Appliances</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active Warranties</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.expiring}</p>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
                  <p className="text-sm text-muted-foreground">Expired Warranties</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appliances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={filter === 'expiring' ? 'default' : 'outline'}
              onClick={() => setFilter('expiring')}
              size="sm"
            >
              Expiring
            </Button>
            <Button
              variant={filter === 'expired' ? 'default' : 'outline'}
              onClick={() => setFilter('expired')}
              size="sm"
            >
              Expired
            </Button>
          </div>
        </div>

        {/* Appliances Grid */}
        {filteredAppliances.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {appliances.length === 0 ? 'No appliances yet' : 'No appliances match your search'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {appliances.length === 0 
                  ? 'Add your first appliance to start tracking warranties and maintenance.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {appliances.length === 0 && (
                <Button onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Appliance
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppliances.map(appliance => (
              <ApplianceCard
                key={appliance.id}
                appliance={appliance}
                onEdit={handleEdit}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ApplianceForm
          appliance={editingAppliance}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingAppliance(undefined);
          }}
        />
      )}

      {/* Detail View Modal */}
      <ApplianceDetailView
        appliance={viewingAppliance}
        isOpen={!!viewingAppliance}
        onClose={() => setViewingAppliance(null)}
        onEdit={(appliance) => {
          setViewingAppliance(null);
          setEditingAppliance(appliance);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset to Sample Data</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>{confirmMessage}</p>
              {hasExistingAppliances && (
                <p className="text-destructive font-medium">
                  ⚠️ This action cannot be undone. Your current appliances will be permanently deleted.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isConfirmingReset}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReset}
              disabled={isConfirmingReset}
              className="gap-2"
            >
              {isConfirmingReset && <Clock className="h-4 w-4 animate-spin" />}
              {hasExistingAppliances ? 'Delete & Load Sample Data' : 'Load Sample Data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;