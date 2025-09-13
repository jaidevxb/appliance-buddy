import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Configure for Supabase with SSL and optimized connection settings
export const sql = postgres(connectionString, { 
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require', // Supabase requires SSL
});

export const db = drizzle(sql, { schema });

export type Database = typeof db;