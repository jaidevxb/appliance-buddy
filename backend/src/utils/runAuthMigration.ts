import fs from 'fs';
import path from 'path';

async function runAuthMigration() {
  try {
    console.log('🚀 Starting authentication migration...');
    
    // Import the database connection dynamically
    const { sql } = await import('../config/database');
    
    // Read the latest migration file
    const migrationPath = path.join(__dirname, '../migrations/0001_misty_lionheart.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL by statement breakpoints and execute each statement
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`📄 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
      
      try {
        await sql.unsafe(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error: any) {
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          console.log(`⚠️ Statement ${i + 1} skipped (already exists)`);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          throw error;
        }
      }
    }
    
    console.log('🎉 Authentication migration completed successfully!');
    console.log('📊 Database schema updated:');
    console.log('  ✅ users table created');
    console.log('  ✅ appliances table updated with user_id foreign key');
    console.log('  ✅ All relationships updated');
    
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

runAuthMigration();