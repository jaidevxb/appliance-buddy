import { useState } from 'react';
import { Appliance } from '@/types/appliance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

// Temporary types for form (without foreign keys)
type FormSupportContact = Omit<Appliance['supportContacts'][0], 'id'>;
type FormMaintenanceTask = Omit<Appliance['maintenanceTasks'][0], 'id' | 'applianceId'>;
type FormLinkedDocument = Omit<Appliance['linkedDocuments'][0], 'id'>;

interface ApplianceFormProps {
  appliance?: Appliance;
  onSave: (appliance: {
    name: string;
    brand: string;
    model: string;
    purchaseDate: Date;
    warrantyDurationMonths: number;
    serialNumber?: string;
    purchaseLocation?: string;
    notes?: string;
    supportContacts: FormSupportContact[];
    maintenanceTasks: FormMaintenanceTask[];
    linkedDocuments: FormLinkedDocument[];
  }) => void;
  onCancel: () => void;
}

export const ApplianceForm = ({ appliance, onSave, onCancel }: ApplianceFormProps) => {
  const [formData, setFormData] = useState({
    name: appliance?.name || '',
    brand: appliance?.brand || '',
    model: appliance?.model || '',
    purchaseDate: appliance?.purchaseDate ? 
      (typeof appliance.purchaseDate === 'string' ? 
        (appliance.purchaseDate as string).split('T')[0] : 
        (appliance.purchaseDate as Date).toISOString().split('T')[0]) : '',
    warrantyDurationMonths: appliance?.warrantyDurationMonths || 12,
    serialNumber: appliance?.serialNumber || '',
    purchaseLocation: appliance?.purchaseLocation || '',
    notes: appliance?.notes || ''
  });

  // Support Contacts state
  const [supportContacts, setSupportContacts] = useState<FormSupportContact[]>(
    appliance?.supportContacts?.map(contact => ({
      name: contact.name,
      company: contact.company,
      phone: contact.phone,
      email: contact.email,
      website: contact.website,
      notes: contact.notes
    })) || []
  );

  // Maintenance Tasks state
  const [maintenanceTasks, setMaintenanceTasks] = useState<FormMaintenanceTask[]>(
    appliance?.maintenanceTasks?.map(task => ({
      taskName: task.taskName,
      scheduledDate: task.scheduledDate,
      frequency: task.frequency,
      serviceProvider: task.serviceProvider,
      notes: task.notes,
      status: task.status,
      completedDate: task.completedDate
    })) || []
  );

  // Linked Documents state
  const [linkedDocuments, setLinkedDocuments] = useState<FormLinkedDocument[]>(
    appliance?.linkedDocuments?.map(doc => ({
      title: doc.title,
      url: doc.url
    })) || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Appliance name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    } else {
      const purchaseDate = new Date(formData.purchaseDate);
      const today = new Date();
      if (purchaseDate > today) {
        newErrors.purchaseDate = 'Purchase date cannot be in the future';
      }
    }

    if (formData.warrantyDurationMonths < 1) {
      newErrors.warrantyDurationMonths = 'Warranty duration must be at least 1 month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      purchaseDate: new Date(formData.purchaseDate),
      warrantyDurationMonths: formData.warrantyDurationMonths,
      serialNumber: formData.serialNumber.trim() || undefined,
      purchaseLocation: formData.purchaseLocation.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      supportContacts,
      maintenanceTasks,
      linkedDocuments
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Support Contact handlers
  const addSupportContact = () => {
    setSupportContacts(prev => [...prev, {
      name: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      notes: ''
    }]);
  };

  const updateSupportContact = (index: number, field: string, value: string) => {
    setSupportContacts(prev => prev.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    ));
  };

  const removeSupportContact = (index: number) => {
    setSupportContacts(prev => prev.filter((_, i) => i !== index));
  };

  // Maintenance Task handlers
  const addMaintenanceTask = () => {
    setMaintenanceTasks(prev => [...prev, {
      taskName: '',
      scheduledDate: new Date(),
      frequency: 'Yearly',
      serviceProvider: {
        name: '',
        phone: '',
        email: '',
        notes: ''
      },
      notes: '',
      status: 'Upcoming'
    }]);
  };

  const updateMaintenanceTask = (index: number, field: string, value: any) => {
    setMaintenanceTasks(prev => prev.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    ));
  };

  const removeMaintenanceTask = (index: number) => {
    setMaintenanceTasks(prev => prev.filter((_, i) => i !== index));
  };

  // Linked Document handlers
  const addLinkedDocument = () => {
    setLinkedDocuments(prev => [...prev, {
      title: '',
      url: ''
    }]);
  };

  const updateLinkedDocument = (index: number, field: string, value: string) => {
    setLinkedDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    ));
  };

  const removeLinkedDocument = (index: number) => {
    setLinkedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{appliance ? 'Edit Appliance' : 'Add New Appliance'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Appliance Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Samsung Refrigerator"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="e.g., Samsung"
                    className={errors.brand ? 'border-destructive' : ''}
                  />
                  {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    placeholder="e.g., RF28R7351SG"
                    className={errors.model ? 'border-destructive' : ''}
                  />
                  {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Purchase Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleChange('purchaseDate', e.target.value)}
                    className={errors.purchaseDate ? 'border-destructive' : ''}
                  />
                  {errors.purchaseDate && <p className="text-sm text-destructive">{errors.purchaseDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyDurationMonths">Warranty Duration (months) *</Label>
                  <Input
                    id="warrantyDurationMonths"
                    type="number"
                    min="1"
                    value={formData.warrantyDurationMonths}
                    onChange={(e) => handleChange('warrantyDurationMonths', parseInt(e.target.value) || 0)}
                    className={errors.warrantyDurationMonths ? 'border-destructive' : ''}
                  />
                  {errors.warrantyDurationMonths && <p className="text-sm text-destructive">{errors.warrantyDurationMonths}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="purchaseLocation">Purchase Location</Label>
                  <Input
                    id="purchaseLocation"
                    value={formData.purchaseLocation}
                    onChange={(e) => handleChange('purchaseLocation', e.target.value)}
                    placeholder="e.g., Best Buy, Amazon"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional notes about this appliance..."
                rows={3}
              />
            </div>

            <Separator />

            {/* Support Contacts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Support Contacts
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={addSupportContact}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
              
              {supportContacts.map((contact, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Contact {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeSupportContact(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Contact Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => updateSupportContact(index, 'name', e.target.value)}
                        placeholder="e.g., Samsung Customer Service"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={contact.company}
                        onChange={(e) => updateSupportContact(index, 'company', e.target.value)}
                        placeholder="e.g., Samsung Electronics"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => updateSupportContact(index, 'phone', e.target.value)}
                        placeholder="e.g., 1-800-726-7864"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateSupportContact(index, 'email', e.target.value)}
                        placeholder="e.g., support@samsung.com"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Website</Label>
                      <Input
                        type="url"
                        value={contact.website}
                        onChange={(e) => updateSupportContact(index, 'website', e.target.value)}
                        placeholder="e.g., https://www.samsung.com/support"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={contact.notes}
                        onChange={(e) => updateSupportContact(index, 'notes', e.target.value)}
                        placeholder="Additional notes about this contact..."
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Maintenance Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Maintenance Tasks
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={addMaintenanceTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
              
              {maintenanceTasks.map((task, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Task {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMaintenanceTask(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Task Name</Label>
                      <Input
                        value={task.taskName}
                        onChange={(e) => updateMaintenanceTask(index, 'taskName', e.target.value)}
                        placeholder="e.g., Replace water filter"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Scheduled Date</Label>
                      <Input
                        type="date"
                        value={task.scheduledDate instanceof Date ? 
                          task.scheduledDate.toISOString().split('T')[0] : 
                          new Date(task.scheduledDate).toISOString().split('T')[0]
                        }
                        onChange={(e) => updateMaintenanceTask(index, 'scheduledDate', new Date(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Input
                        value={task.frequency}
                        onChange={(e) => updateMaintenanceTask(index, 'frequency', e.target.value)}
                        placeholder="e.g., Every 6 months, Yearly"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Service Provider Name</Label>
                      <Input
                        value={task.serviceProvider?.name || ''}
                        onChange={(e) => updateMaintenanceTask(index, 'serviceProvider', {
                          ...task.serviceProvider,
                          name: e.target.value
                        })}
                        placeholder="e.g., Metro Gas Services"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Task Notes</Label>
                      <Textarea
                        value={task.notes}
                        onChange={(e) => updateMaintenanceTask(index, 'notes', e.target.value)}
                        placeholder="Details about this maintenance task..."
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Linked Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Manuals
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={addLinkedDocument}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
              
              {linkedDocuments.map((document, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Document {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeLinkedDocument(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Document Title</Label>
                      <Input
                        value={document.title}
                        onChange={(e) => updateLinkedDocument(index, 'title', e.target.value)}
                        placeholder="e.g., Purchase Receipt, User Manual"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Document URL/Link</Label>
                      <Input
                        type="url"
                        value={document.url}
                        onChange={(e) => updateLinkedDocument(index, 'url', e.target.value)}
                        placeholder="e.g., https://example.com/receipt.pdf"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {appliance ? 'Update Appliance' : 'Add Appliance'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};