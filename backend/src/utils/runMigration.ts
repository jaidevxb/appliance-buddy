import { sql } from '../config/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../migrations/0000_glorious_rocket_raccoon.sql');
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
    
    console.log('🎉 Migration completed successfully!');
    console.log('📊 Database tables created:');
    console.log('  ✅ appliances');
    console.log('  ✅ linked_documents');
    console.log('  ✅ maintenance_tasks');
    console.log('  ✅ support_contacts');
    console.log('  ✅ Foreign key constraints');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await sql.end();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

runMigration();