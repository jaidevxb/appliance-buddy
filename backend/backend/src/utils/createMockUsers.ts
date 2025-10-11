import { createClient } from '@supabase/supabase-js';
import { config } from '../config/environment.js';
import { db } from '../config/database';
import { users, appliances, supportContacts, maintenanceTasks, linkedDocuments } from '../models/schema';
import { addDays, subDays } from 'date-fns';
import { eq } from 'drizzle-orm';

// Initialize Supabase client
const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);

const mockUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    appliances: [
      {
        name: 'LG Smart Refrigerator',
        brand: 'LG',
        model: 'LRFVS3006S',
        purchaseDate: subDays(new Date(), 200),
        warrantyDurationMonths: 24,
        serialNumber: 'LG2023001',
        purchaseLocation: 'Best Buy',
        notes: 'Smart features with Wi-Fi connectivity'
      },
      {
        name: 'Bosch Dishwasher',
        brand: 'Bosch',
        model: 'SHPM78Z55N',
        purchaseDate: subDays(new Date(), 90),
        warrantyDurationMonths: 12,
        serialNumber: 'BSH789456',
        purchaseLocation: 'Home Depot',
        notes: 'Ultra-quiet operation, 44 dBA'
      }
    ]
  },
  {
    email: 'sarah.wilson@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    appliances: [
      {
        name: 'KitchenAid Stand Mixer',
        brand: 'KitchenAid',
        model: 'KSM150PSER',
        purchaseDate: subDays(new Date(), 150),
        warrantyDurationMonths: 12,
        serialNumber: 'KA456789',
        purchaseLocation: 'Williams Sonoma',
        notes: 'Professional-grade mixer with multiple attachments'
      },
      {
        name: 'Dyson Cordless Vacuum',
        brand: 'Dyson',
        model: 'V15 Detect',
        purchaseDate: subDays(new Date(), 60),
        warrantyDurationMonths: 24,
        serialNumber: 'DY123789',
        purchaseLocation: 'Amazon',
        notes: 'Laser dust detection technology'
      },
      {
        name: 'Ninja Food Processor',
        brand: 'Ninja',
        model: 'BN601',
        purchaseDate: subDays(new Date(), 30),
        warrantyDurationMonths: 12,
        serialNumber: 'NJ987654',
        purchaseLocation: 'Target',
        notes: 'Professional 1000-watt motor'
      }
    ]
  },
  {
    email: 'mike.johnson@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    appliances: [
      {
        name: 'Weber Gas Grill',
        brand: 'Weber',
        model: 'Genesis II E-335',
        purchaseDate: subDays(new Date(), 400),
        warrantyDurationMonths: 60,
        serialNumber: 'WB2022555',
        purchaseLocation: 'Ace Hardware',
        notes: 'Premium outdoor cooking with side burner'
      },
      {
        name: 'Maytag Dryer',
        brand: 'Maytag',
        model: 'MED4500MW',
        purchaseDate: subDays(new Date(), 300),
        warrantyDurationMonths: 12,
        serialNumber: 'MT789123',
        purchaseLocation: 'Lowes',
        notes: 'Large capacity with moisture sensing'
      }
    ]
  }
];

const supportContactTemplates = {
  'LG': {
    name: 'LG Customer Support',
    company: 'LG Electronics',
    phone: '1-800-243-0000',
    email: 'support@lge.com',
    website: 'https://www.lg.com/us/support',
    notes: 'Available 24/7 for technical support'
  },
  'Bosch': {
    name: 'Bosch Customer Service',
    company: 'Bosch Home Appliances',
    phone: '1-800-944-2904',
    email: 'customercare@bshg.com',
    website: 'https://www.bosch-home.com/us/service',
    notes: 'Monday-Friday 8 AM - 8 PM EST'
  },
  'KitchenAid': {
    name: 'KitchenAid Support',
    company: 'KitchenAid',
    phone: '1-800-541-6390',
    email: 'help@kitchenaid.com',
    website: 'https://www.kitchenaid.com/customer-service',
    notes: 'Expert support for all products'
  },
  'Dyson': {
    name: 'Dyson Customer Care',
    company: 'Dyson Ltd',
    phone: '1-866-693-9766',
    email: 'help@dyson.com',
    website: 'https://www.dyson.com/support',
    notes: 'Register product for extended warranty'
  },
  'Ninja': {
    name: 'Ninja Customer Service',
    company: 'SharkNinja',
    phone: '1-877-646-5288',
    email: 'support@ninjakitchen.com',
    website: 'https://www.ninjakitchen.com/support',
    notes: 'Recipe support and troubleshooting'
  },
  'Weber': {
    name: 'Weber Customer Service',
    company: 'Weber-Stephen Products',
    phone: '1-800-446-1071',
    email: 'customerservice@weber.com',
    website: 'https://www.weber.com/US/en/service',
    notes: 'Grilling experts available'
  },
  'Maytag': {
    name: 'Maytag Support',
    company: 'Maytag Corporation',
    phone: '1-800-344-1274',
    email: 'info@maytag.com',
    website: 'https://www.maytag.com/customer-service',
    notes: 'Dependable service and support'
  }
};

async function createMockUsers() {
  try {
    console.log('🚀 Creating mock user accounts with sample data...');

    for (const mockUser of mockUsers) {
      console.log(`\n👤 Creating user: ${mockUser.email}`);
      
      try {
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: mockUser.email,
          password: mockUser.password,
        });

        if (authError && !authError.message.includes('already registered')) {
          console.error(`❌ Auth error for ${mockUser.email}:`, authError.message);
          continue;
        }

        let userId: string;
        
        if (authData.user) {
          userId = authData.user.id;
          console.log(`✅ Auth user created: ${userId}`);
          
          // Create user profile in our database
          try {
            await db.insert(users).values({
              id: userId,
              email: mockUser.email,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
            });
            console.log(`✅ Database user profile created`);
          } catch (dbError: any) {
            if (dbError.code === '23505') { // Unique constraint violation
              console.log(`✅ User profile already exists in database`);
            } else {
              throw dbError;
            }
          }
        } else {
          // User already exists, try to sign in to get the user ID
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: mockUser.email,
            password: mockUser.password,
          });

          if (signInError) {
            console.error(`❌ Cannot sign in existing user:`, signInError.message);
            continue;
          }

          userId = signInData.user.id;
          console.log(`✅ Using existing user: ${userId}`);
        }

        // Clear existing appliances for this user
        await db.delete(appliances).where(eq(appliances.userId, userId));
        console.log(`🗑️ Cleared existing appliances for user`);

        // Create appliances
        console.log(`📦 Creating ${mockUser.appliances.length} appliances...`);
        
        for (const applianceData of mockUser.appliances) {
          const [appliance] = await db.insert(appliances).values({
            ...applianceData,
            userId: userId
          }).returning();

          console.log(`  ✅ Created appliance: ${appliance.name}`);

          // Create support contact
          const supportTemplate = supportContactTemplates[appliance.brand as keyof typeof supportContactTemplates];
          if (supportTemplate) {
            await db.insert(supportContacts).values({
              ...supportTemplate,
              applianceId: appliance.id
            });
            console.log(`    📞 Added support contact`);
          }

          // Create maintenance task
          await db.insert(maintenanceTasks).values({
            applianceId: appliance.id,
            taskName: `${appliance.brand} maintenance check`,
            scheduledDate: addDays(new Date(), Math.floor(Math.random() * 90) + 30), // 30-120 days from now
            frequency: 'Yearly',
            serviceProvider: {
              name: 'Authorized Service Center',
              notes: 'Annual maintenance and inspection'
            },
            notes: 'Regular maintenance to ensure optimal performance',
            status: 'Upcoming'
          });
          console.log(`    🔧 Added maintenance task`);

          // Create linked documents
          await db.insert(linkedDocuments).values([
            {
              applianceId: appliance.id,
              title: `${appliance.brand} ${appliance.model} User Manual`,
              url: `https://example.com/${appliance.brand.toLowerCase()}-${appliance.model.toLowerCase()}-manual.pdf`
            },
            {
              applianceId: appliance.id,
              title: `Purchase Receipt - ${appliance.purchaseLocation}`,
              url: `https://example.com/${appliance.brand.toLowerCase()}-receipt.pdf`
            }
          ]);
          console.log(`    📄 Added linked documents`);
        }

        console.log(`🎉 Completed setup for ${mockUser.email}`);
        
      } catch (userError) {
        console.error(`❌ Error creating user ${mockUser.email}:`, userError);
      }
    }

    console.log('\n🎉 Mock user creation completed!');
    console.log('\n📊 Summary:');
    mockUsers.forEach(user => {
      console.log(`  👤 ${user.email} - ${user.appliances.length} appliances`);
    });
    
  } catch (error) {
    console.error('💥 Error creating mock users:', error);
    throw error;
  }
}

// Run the script
createMockUsers()
  .then(() => {
    console.log('✅ Mock users creation completed, exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Mock users creation failed:', error);
    process.exit(1);
  });