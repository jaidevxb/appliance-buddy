import { db } from '../config/database';
import { appliances, supportContacts, maintenanceTasks, linkedDocuments, users } from '../models/schema';
import { addDays, subDays } from 'date-fns';
import { eq } from 'drizzle-orm';

const sampleApplianceTemplates = [
  {
    name: 'Samsung French Door Refrigerator',
    brand: 'Samsung',
    model: 'RF28R7351SG',
    purchaseDate: subDays(new Date(), 365), // 1 year ago - Active warranty (24 months)
    warrantyDurationMonths: 24,
    serialNumber: 'SN123456789',
    purchaseLocation: 'Best Buy',
    notes: 'Energy Star certified, 28 cu ft capacity'
  },
  {
    name: 'Whirlpool Front Load Washer',
    brand: 'Whirlpool', 
    model: 'WFW9620HC',
    purchaseDate: subDays(new Date(), 330), // 11 months ago - Expiring Soon (12 months warranty)
    warrantyDurationMonths: 12,
    serialNumber: 'WH987654321',
    purchaseLocation: 'Home Depot',
    notes: 'High efficiency, 5.0 cu ft capacity'
  },
  {
    name: 'GE Gas Range',
    brand: 'GE',
    model: 'JGB735SPSS', 
    purchaseDate: subDays(new Date(), 450), // 15 months ago - Expired (12 months warranty)
    warrantyDurationMonths: 12,
    serialNumber: 'GE555444333',
    purchaseLocation: 'Lowes',
    notes: '5-burner gas range with convection oven'
  },
  {
    name: 'LG Dishwasher',
    brand: 'LG',
    model: 'LDT5678SS',
    purchaseDate: subDays(new Date(), 60), // 2 months ago - Active warranty (24 months)
    warrantyDurationMonths: 24,
    serialNumber: 'LG111222333',
    purchaseLocation: 'Best Buy',
    notes: 'QuadWash technology, stainless steel interior'
  },
  {
    name: 'Dyson V15 Vacuum Cleaner',
    brand: 'Dyson',
    model: 'V15 Detect',
    purchaseDate: subDays(new Date(), 340), // 11.3 months ago - Expiring Soon (12 months warranty)
    warrantyDurationMonths: 12,
    serialNumber: 'DY789456123',
    purchaseLocation: 'Amazon',
    notes: 'Laser dust detection, powerful suction'
  }
];

const supportContactTemplates = [
  {
    name: 'Samsung Customer Service',
    company: 'Samsung Electronics',
    phone: '1-800-726-7864',
    email: 'support@samsung.com',
    website: 'https://www.samsung.com/us/support/',
    notes: 'Available 24/7 for technical support'
  },
  {
    name: 'Whirlpool Support',
    company: 'Whirlpool Corporation',
    phone: '1-866-698-2538',
    email: 'contact@whirlpool.com',
    website: 'https://www.whirlpool.com/services/',
    notes: 'Best time to call: weekdays 8 AM - 8 PM EST'
  },
  {
    name: 'GE Appliances Support',
    company: 'GE Appliances',
    phone: '1-800-432-2737',
    email: 'info@geappliances.com',
    website: 'https://www.geappliances.com/support/',
    notes: 'Live chat available on website'
  },
  {
    name: 'LG Customer Support',
    company: 'LG Electronics',
    phone: '1-800-243-0000',
    email: 'support@lge.com',
    website: 'https://www.lg.com/us/support',
    notes: 'Online troubleshooting tools available'
  },
  {
    name: 'Dyson Customer Care',
    company: 'Dyson Inc.',
    phone: '1-866-693-9766',
    email: 'help@dyson.com',
    website: 'https://www.dyson.com/support',
    notes: 'Expert advice and parts available'
  }
];

const maintenanceTaskTemplates = [
  {
    taskName: 'Replace water filter',
    scheduledDate: addDays(new Date(), 30),
    frequency: 'Every 6 months',
    serviceProvider: {
      name: 'Self-service',
      notes: 'Order filter model DA29-00020B'
    },
    notes: 'Filter replacement indicator will turn red when due',
    status: 'Upcoming'
  },
  {
    taskName: 'Clean washer drum and gasket',
    scheduledDate: addDays(new Date(), 7),
    frequency: 'Monthly',
    serviceProvider: {
      name: 'Self-service',
      notes: 'Use Affresh washing machine cleaner'
    },
    notes: 'Run cleaning cycle to prevent mold and odors',
    status: 'Upcoming'
  },
  {
    taskName: 'Annual gas safety inspection',
    scheduledDate: addDays(new Date(), 45),
    frequency: 'Yearly',
    serviceProvider: {
      name: 'Metro Gas Services',
      phone: '555-0123',
      email: 'service@metrogas.com'
    },
    notes: 'Required annual inspection for gas appliances',
    status: 'Upcoming'
  },
  {
    taskName: 'Clean dishwasher filter',
    scheduledDate: addDays(new Date(), 14),
    frequency: 'Monthly',
    serviceProvider: {
      name: 'Self-service',
      notes: 'Remove and rinse filter under hot water'
    },
    notes: 'Prevents odors and improves cleaning performance',
    status: 'Upcoming'
  },
  {
    taskName: 'Replace vacuum filter',
    scheduledDate: addDays(new Date(), 21),
    frequency: 'Every 3 months',
    serviceProvider: {
      name: 'Self-service',
      notes: 'Washable HEPA filter included'
    },
    notes: 'Maintains optimal suction power',
    status: 'Upcoming'
  }
];

const linkedDocumentTemplates = [
  [
    {
      title: 'Samsung Refrigerator User Manual',
      url: 'https://example.com/samsung-rf28r7351sg-manual.pdf'
    },
    {
      title: 'Refrigerator Purchase Receipt',
      url: 'https://example.com/samsung-receipt-2023.pdf'
    }
  ],
  [
    {
      title: 'Whirlpool Washer Installation Guide',
      url: 'https://example.com/whirlpool-wfw9620hc-install.pdf'
    },
    {
      title: 'Washer Extended Warranty',
      url: 'https://example.com/whirlpool-warranty-2024.pdf'
    }
  ],
  [
    {
      title: 'GE Range Owner Manual',
      url: 'https://example.com/ge-jgb735spss-manual.pdf'
    },
    {
      title: 'Gas Range Safety Guide',
      url: 'https://example.com/ge-safety-guide.pdf'
    }
  ],
  [
    {
      title: 'LG Dishwasher User Guide',
      url: 'https://example.com/lg-ldt5678ss-manual.pdf'
    },
    {
      title: 'Dishwasher Installation Receipt',
      url: 'https://example.com/lg-receipt-2024.pdf'
    }
  ],
  [
    {
      title: 'Dyson V15 User Manual',
      url: 'https://example.com/dyson-v15-manual.pdf'
    },
    {
      title: 'Vacuum Purchase Receipt', 
      url: 'https://example.com/dyson-receipt-2024.pdf'
    }
  ]
];

export async function createSampleDataForUser(userId: string, userEmail?: string) {
  try {
    console.log(`🌱 Creating sample data for user: ${userId}`);
    
    // First, ensure the user exists in our users table
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (existingUser.length === 0) {
      // Create user record if it doesn't exist
      console.log('👤 Creating user record in database...');
      await db.insert(users).values({
        id: userId,
        email: userEmail || 'unknown@example.com',
        firstName: null,
        lastName: null,
      });
      console.log('✅ User record created successfully');
    }
    
    // Delete existing user data - simplified approach
    await db.delete(appliances).where(eq(appliances.userId, userId));
    console.log('🗑️ Cleared existing user data');

    // Create new sample appliances
    const appliancesWithUserId = sampleApplianceTemplates.map(appliance => ({
      ...appliance,
      userId: userId
    }));
    
    const insertedAppliances = await db.insert(appliances)
      .values(appliancesWithUserId)
      .returning();

    console.log(`✅ Added ${insertedAppliances.length} appliances`);

    // Add support contacts for each appliance
    const supportContactsData = insertedAppliances.map((appliance, index) => ({
      ...supportContactTemplates[index],
      applianceId: appliance.id
    }));

    await db.insert(supportContacts).values(supportContactsData);
    console.log(`✅ Added ${supportContactsData.length} support contacts`);

    // Add maintenance tasks for each appliance
    const maintenanceTasksData = insertedAppliances.map((appliance, index) => ({
      ...maintenanceTaskTemplates[index],
      applianceId: appliance.id
    }));

    await db.insert(maintenanceTasks).values(maintenanceTasksData);
    console.log(`✅ Added ${maintenanceTasksData.length} maintenance tasks`);

    // Add linked documents (2 per appliance)
    const linkedDocumentsData = insertedAppliances.flatMap((appliance, index) => 
      linkedDocumentTemplates[index].map(doc => ({
        ...doc,
        applianceId: appliance.id
      }))
    );

    await db.insert(linkedDocuments).values(linkedDocumentsData);
    console.log(`✅ Added ${linkedDocumentsData.length} linked documents`);

    console.log('🎉 Sample data creation completed successfully!');
    
  } catch (error) {
    console.error('💥 Error creating sample data:', error);
    throw error;
  }
}