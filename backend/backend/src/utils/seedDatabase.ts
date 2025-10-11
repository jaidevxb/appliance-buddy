import { db } from '../config/database';
import { appliances, supportContacts, maintenanceTasks, linkedDocuments } from '../models/schema';
import { addDays, subDays, addMonths } from 'date-fns';

const mockAppliances = [
  {
    name: 'Samsung French Door Refrigerator',
    brand: 'Samsung',
    model: 'RF28R7351SG',
    purchaseDate: subDays(new Date(), 365), // 1 year ago
    warrantyDurationMonths: 24,
    serialNumber: 'SN123456789',
    purchaseLocation: 'Best Buy',
    notes: 'Energy Star certified, 28 cu ft capacity'
  },
  {
    name: 'Whirlpool Front Load Washer',
    brand: 'Whirlpool',
    model: 'WFW9620HC',
    purchaseDate: subDays(new Date(), 180), // 6 months ago
    warrantyDurationMonths: 12,
    serialNumber: 'WH987654321',
    purchaseLocation: 'Home Depot',
    notes: 'High efficiency, 5.0 cu ft capacity'
  },
  {
    name: 'GE Gas Range',
    brand: 'GE',
    model: 'JGB735SPSS',
    purchaseDate: subDays(new Date(), 730), // 2 years ago
    warrantyDurationMonths: 12,
    serialNumber: 'GE555444333',
    purchaseLocation: 'Lowes',
    notes: '5-burner gas range with convection oven'
  },
  {
    name: 'Dyson V15 Vacuum',
    brand: 'Dyson',
    model: 'V15 Detect',
    purchaseDate: subDays(new Date(), 90), // 3 months ago
    warrantyDurationMonths: 24,
    serialNumber: 'DY111222333',
    purchaseLocation: 'Amazon',
    notes: 'Cordless stick vacuum with laser detection'
  },
  {
    name: 'LG Dishwasher',
    brand: 'LG',
    model: 'LDT5678ST',
    purchaseDate: subDays(new Date(), 45), // 1.5 months ago
    warrantyDurationMonths: 12,
    serialNumber: 'LG789012345',
    purchaseLocation: 'Costco',
    notes: 'QuadWash technology, 44 dBA quiet operation'
  }
];

const mockSupportContacts = [
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
    name: 'Dyson Customer Care',
    company: 'Dyson Ltd',
    phone: '1-866-693-9766',
    email: 'help@dyson.com',
    website: 'https://www.dyson.com/support',
    notes: 'Register product for extended warranty'
  },
  {
    name: 'LG Customer Service',
    company: 'LG Electronics',
    phone: '1-800-243-0000',
    email: 'support@lge.com',
    website: 'https://www.lg.com/us/support',
    notes: 'Mobile app available for troubleshooting'
  }
];

const mockMaintenanceTasks = [
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
    taskName: 'Replace vacuum filters',
    scheduledDate: addDays(new Date(), 60),
    frequency: 'Every 3 months',
    serviceProvider: {
      name: 'Self-service',
      notes: 'Order from Dyson website'
    },
    notes: 'Clean pre-filter weekly, replace main filter quarterly',
    status: 'Upcoming'
  },
  {
    taskName: 'Clean dishwasher filter',
    scheduledDate: addDays(new Date(), 14),
    frequency: 'Monthly',
    serviceProvider: {
      name: 'Self-service',
      notes: 'Remove and rinse cylindrical filter'
    },
    notes: 'Located at bottom of dishwasher tub',
    status: 'Upcoming'
  }
];

const mockLinkedDocuments = [
  {
    title: 'Samsung Refrigerator User Manual',
    url: 'https://example.com/samsung-rf28r7351sg-manual.pdf'
  },
  {
    title: 'Refrigerator Purchase Receipt',
    url: 'https://example.com/samsung-receipt-2023.pdf'
  },
  {
    title: 'Whirlpool Washer Installation Guide',
    url: 'https://example.com/whirlpool-wfw9620hc-install.pdf'
  },
  {
    title: 'Washer Extended Warranty',
    url: 'https://example.com/whirlpool-warranty-2024.pdf'
  },
  {
    title: 'GE Range Owner Manual',
    url: 'https://example.com/ge-jgb735spss-manual.pdf'
  },
  {
    title: 'Gas Range Safety Guide',
    url: 'https://example.com/ge-safety-guide.pdf'
  },
  {
    title: 'Dyson V15 Quick Start Guide',
    url: 'https://example.com/dyson-v15-quickstart.pdf'
  },
  {
    title: 'Vacuum Maintenance Video',
    url: 'https://www.youtube.com/watch?v=example'
  },
  {
    title: 'LG Dishwasher Manual',
    url: 'https://example.com/lg-ldt5678st-manual.pdf'
  },
  {
    title: 'Dishwasher Installation Receipt',
    url: 'https://example.com/lg-receipt-2024.pdf'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Define the demo user ID
    const demoUserId = '12345678-1234-1234-1234-123456789012';

    // Clear existing data (optional - uncomment if you want to reset)
    // console.log('🗑️ Clearing existing data...');
    // await db.delete(linkedDocuments);
    // await db.delete(maintenanceTasks);
    // await db.delete(supportContacts);
    // await db.delete(appliances);

    console.log('📦 Adding appliances...');
    const appliancesWithUserId = mockAppliances.map(appliance => ({
      ...appliance,
      userId: demoUserId
    }));
    
    const insertedAppliances = await db.insert(appliances)
      .values(appliancesWithUserId)
      .returning();

    console.log(`✅ Added ${insertedAppliances.length} appliances`);

    // Add support contacts for each appliance
    console.log('📞 Adding support contacts...');
    const supportContactsData = insertedAppliances.map((appliance, index) => ({
      ...mockSupportContacts[index],
      applianceId: appliance.id
    }));

    await db.insert(supportContacts).values(supportContactsData);
    console.log(`✅ Added ${supportContactsData.length} support contacts`);

    // Add maintenance tasks for each appliance
    console.log('🔧 Adding maintenance tasks...');
    const maintenanceTasksData = insertedAppliances.map((appliance, index) => ({
      ...mockMaintenanceTasks[index],
      applianceId: appliance.id
    }));

    await db.insert(maintenanceTasks).values(maintenanceTasksData);
    console.log(`✅ Added ${maintenanceTasksData.length} maintenance tasks`);

    // Add linked documents (2 per appliance)
    console.log('📄 Adding linked documents...');
    const linkedDocumentsData = insertedAppliances.flatMap((appliance, index) => [
      {
        ...mockLinkedDocuments[index * 2],
        applianceId: appliance.id
      },
      {
        ...mockLinkedDocuments[index * 2 + 1],
        applianceId: appliance.id
      }
    ]);

    await db.insert(linkedDocuments).values(linkedDocumentsData);
    console.log(`✅ Added ${linkedDocumentsData.length} linked documents`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  📦 Appliances: ${insertedAppliances.length}`);
    console.log(`  📞 Support Contacts: ${supportContactsData.length}`);
    console.log(`  🔧 Maintenance Tasks: ${maintenanceTasksData.length}`);
    console.log(`  📄 Linked Documents: ${linkedDocumentsData.length}`);

  } catch (error) {
    console.error('💥 Error seeding database:', error);
    throw error;
  }
}

// Export for use in other files
export { seedDatabase };

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('✅ Seeding completed, exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });