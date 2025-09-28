import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001, // Changed default to 3001 to match what the Dockerfile expects
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000,https://appliance-buddy-production.up.railway.app',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-here',
  
  // Supabase configuration
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
  
  // Legacy supabase object for backwards compatibility
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },

  // Parse multiple frontend URLs for CORS
  getFrontendUrls: () => {
    const urls = config.frontendUrl.split(',').map(url => url.trim());
    return urls;
  },
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  In production, this will cause the application to crash');
    }
  } else {
    console.log(`✅ Environment variable ${envVar} is configured`);
  }
}

// Log configuration (without sensitive data) in development and production
console.log('🔧 Environment Configuration:');
console.log(`   - Port: ${config.port}`);
console.log(`   - Environment: ${config.nodeEnv}`);
console.log(`   - Frontend URLs: ${config.getFrontendUrls().join(', ')}`);
console.log(`   - Supabase URL: ${config.supabase.url ? '✅ Configured' : '❌ Missing'}`);
console.log(`   - Database: ${config.databaseUrl ? '✅ Configured' : '❌ Missing'}`);
