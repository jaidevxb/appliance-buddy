import * as dotenv from 'dotenv';

dotenv.config();

// Log all environment variables for debugging (without sensitive data)
console.log('🔧 Environment Variables Debug:');
console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   - PORT: ${process.env.PORT || 'not set'}`);
console.log(`   - DATABASE_URL present: ${!!process.env.DATABASE_URL}`);
console.log(`   - SUPABASE_URL present: ${!!process.env.SUPABASE_URL}`);
console.log(`   - SUPABASE_ANON_KEY present: ${!!process.env.SUPABASE_ANON_KEY}`);
console.log(`   - JWT_SECRET present: ${!!process.env.JWT_SECRET}`);
console.log(`   - FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);

export const config = {
  port: process.env.PORT || 3001, // Default to 3001, but will use platform-assigned port in deployment
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000,https://appliance-buddy-production.up.railway.app,https://appliance-buddy-eight.up.railway.app',
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