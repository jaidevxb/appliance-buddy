import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

console.log('🔧 Database configuration:');
console.log(`   - Connection string present: ${!!connectionString}`);
console.log(`   - Connection string length: ${connectionString.length}`);

// Configure for Supabase with SSL and optimized connection settings
export const sql = postgres(connectionString, { 
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30, // Increased timeout
  ssl: 'require', // Supabase requires SSL
  onnotice: (notice) => {
    console.log('PostgreSQL Notice:', notice);
  },
  onparameter: (key, value) => {
    // Log some connection parameters for debugging
    if (key === 'application_name' || key === 'client_encoding') {
      console.log(`PostgreSQL Parameter ${key}: ${value}`);
    }
  }
});

// Test the database connection with better error handling
console.log('🔍 Testing database connection...');
sql`SELECT 1 as test`.then((result) => {
  console.log('✅ Database connection successful');
  console.log(`   - Test query result: ${JSON.stringify(result)}`);
}).catch((err: any) => {
  console.error('❌ Database connection failed:', err);
  console.error('   - Error code:', err.code);
  console.error('   - Error message:', err.message);
  if (err.stack) {
    console.error('   - Error stack:', err.stack);
  }
  
  // Additional debugging for connection issues
  try {
    const url = new URL(connectionString);
    console.log('   - Database host:', url.hostname);
    console.log('   - Database port:', url.port || 5432);
    console.log('   - Database name:', url.pathname.substring(1));
  } catch (parseErr) {
    console.error('   - Could not parse connection string for debugging');
  }
});

export const db = drizzle(sql, { schema });

export type Database = typeof db;