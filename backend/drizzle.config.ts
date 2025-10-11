import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/models/schema.ts',
  out: './src/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;