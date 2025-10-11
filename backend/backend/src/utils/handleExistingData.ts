// Remove the import.meta.url usage and use a simpler approach
async function handleExistingData() {
  try {
    console.log('🔄 Handling existing data for authentication migration...');
    
    // Import the database connection dynamically
    const { sql } = await import('../config/database');

    // Step 1: Create the users table first
    console.log('📊 Creating users table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL,
        "first_name" varchar(100),
        "last_name" varchar(100),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `);
    console.log('✅ Users table created');

    // Step 2: Create a default demo user for existing data
    const demoUserId = '12345678-1234-1234-1234-123456789012';
    console.log('👤 Creating demo user for existing appliances...');
    
    await sql.unsafe(`
      INSERT INTO "users" ("id", "email", "first_name", "last_name") 
      VALUES ('${demoUserId}', 'demo@appliancebuddy.com', 'Demo', 'User')
      ON CONFLICT ("email") DO NOTHING;
    `);
    console.log('✅ Demo user created');

    // Step 3: Add user_id column to appliances table as nullable first
    console.log('🔧 Adding user_id column to appliances...');
    await sql.unsafe(`
      ALTER TABLE "appliances" 
      ADD COLUMN IF NOT EXISTS "user_id" uuid;
    `);

    // Step 4: Update all existing appliances to belong to the demo user
    console.log('📝 Assigning existing appliances to demo user...');
    await sql.unsafe(`
      UPDATE "appliances" 
      SET "user_id" = '${demoUserId}' 
      WHERE "user_id" IS NULL;
    `);

    // Step 5: Now make the user_id column NOT NULL and add foreign key constraint
    console.log('🔗 Adding constraints...');
    await sql.unsafe(`
      ALTER TABLE "appliances" 
      ALTER COLUMN "user_id" SET NOT NULL;
    `);

    await sql.unsafe(`
      DO $$ BEGIN
        ALTER TABLE "appliances" ADD CONSTRAINT "appliances_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('🎉 Authentication migration completed successfully!');
    console.log('📊 Summary:');
    console.log('  ✅ Users table created');
    console.log('  ✅ Demo user created (demo@appliancebuddy.com)');
    console.log('  ✅ All existing appliances assigned to demo user');
    console.log('  ✅ Foreign key constraints added');
    console.log('');
    console.log('🔑 You can now:');
    console.log('  1. Register new users via /api/auth/register');
    console.log('  2. Login with demo user: demo@appliancebuddy.com (no password needed for existing data)');
    console.log('  3. Create user-specific appliances');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    const { sql } = await import('../config/database');
    await sql.end();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

handleExistingData();