import { useState } from 'react';
import { Appliance } from '@/types/appliance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { 
  X,
  Calendar,
  Phone,
  Mail,
  Globe,
  FileText,
  ExternalLink,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  Trash2
} from 'lucide-react';
import { formatDate, getWarrantyStatus, calculateWarrantyEndDate } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface ApplianceDetailViewProps {
  appliance: Appliance | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (appliance: Appliance) => void;
  onDelete: (appliance: Appliance) => void;
}

export const ApplianceDetailView = ({ appliance, isOpen, onClose, onEdit, onDelete }: ApplianceDetailViewProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  if (!appliance) return null;

  const warrantyEndDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyDurationMonths);
  const warrantyStatus = getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths);

  const getWarrantyBadgeVariant = () => {
    switch (warrantyStatus) {
      case 'Active': return 'default';
      case 'Expiring Soon': return 'secondary';
      case 'Expired': return 'destructive';
      default: return 'default';
    }
  };

  const getWarrantyIcon = () => {
    switch (warrantyStatus) {
      case 'Active': return <CheckCircle className="h-4 w-4" />;
      case 'Expiring Soon': return <Clock className="h-4 w-4" />;
      case 'Expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge variant="default" className="text-xs">Completed</Badge>;
      case 'Upcoming': return <Badge variant="secondary" className="text-xs">Upcoming</Badge>;
      case 'Overdue': return <Badge variant="destructive" className="text-xs">Overdue</Badge>;
      default: return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-y-auto"
          )}
        >
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-xl font-bold">{appliance.name}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(appliance)}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appliance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Brand & Model</label>
                  <p className="text-lg font-semibold">{appliance.brand} • {appliance.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
                  <p className="font-mono">{appliance.serialNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Purchase Date</label>
                  <p>{formatDate(appliance.purchaseDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Purchase Location</label>
                  <p>{appliance.purchaseLocation || 'Not provided'}</p>
                </div>
              </div>
              
              {/* Warranty Status */}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getWarrantyIcon()}
                  <span className="font-medium">Warranty Status</span>
                </div>
                <Badge variant={getWarrantyBadgeVariant()}>
                  {warrantyStatus}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(warrantyEndDate)} ({appliance.warrantyDurationMonths} months coverage)
              </p>

              {appliance.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="mt-1">{appliance.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Support Contacts */}
          {appliance.supportContacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Support Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appliance.supportContacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          {contact.company && (
                            <p className="text-sm text-muted-foreground">{contact.company}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={contact.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm hover:underline flex items-center gap-1"
                            >
                              Visit Website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {contact.notes && (
                        <p className="text-sm text-muted-foreground mt-3 p-2 bg-muted rounded">
                          {contact.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Maintenance Tasks */}
          {appliance.maintenanceTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Maintenance Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appliance.maintenanceTasks
                    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                    .map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{task.taskName}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Scheduled: {formatDate(task.scheduledDate)}
                            </span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              {task.frequency}
                            </span>
                          </div>
                        </div>
                        {getMaintenanceStatusBadge(task.status)}
                      </div>

                      {task.serviceProvider && (
                        <div className="mt-3 p-3 bg-muted rounded">
                          <p className="text-sm font-medium">Service Provider: {task.serviceProvider.name}</p>
                          {task.serviceProvider.phone && (
                            <p className="text-sm text-muted-foreground">Phone: {task.serviceProvider.phone}</p>
                          )}
                          {task.serviceProvider.email && (
                            <p className="text-sm text-muted-foreground">Email: {task.serviceProvider.email}</p>
                          )}
                          {task.serviceProvider.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{task.serviceProvider.notes}</p>
                          )}
                        </div>
                      )}

                      {task.notes && (
                        <p className="text-sm text-muted-foreground mt-3">
                          {task.notes}
                        </p>
                      )}

                      {task.completedDate && (
                        <p className="text-sm text-success mt-2">
                          ✓ Completed: {formatDate(task.completedDate)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Linked Documents */}
          {appliance.linkedDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Manuals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {appliance.linkedDocuments.map((document) => (
                    <div key={document.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <a 
                        href={document.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium group-hover:underline">{document.title}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty States */}
          {appliance.supportContacts.length === 0 && appliance.maintenanceTasks.length === 0 && appliance.linkedDocuments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No additional information available for this appliance.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => onEdit(appliance)}
                  className="mt-4"
                >
                  Add Details
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        </DialogPrimitive.Content>
      </DialogPortal>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appliance</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{appliance.name}</strong>?
              <br /><br />
              This action cannot be undone. This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All appliance information</li>
                <li>All support contacts ({appliance.supportContacts.length})</li>
                <li>All maintenance tasks ({appliance.maintenanceTasks.length})</li>
                <li>All linked documents ({appliance.linkedDocuments.length})</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(appliance);
                setShowDeleteDialog(false);
                onClose();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};