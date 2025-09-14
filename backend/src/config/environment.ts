import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8082,https://appliance-buddy.railway.app',
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
const requiredEnvVars = ['DATABASE_URL'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Log configuration (without sensitive data) in development
if (config.nodeEnv === 'development') {
  console.log('🔧 Environment Configuration:');
  console.log(`   - Port: ${config.port}`);
  console.log(`   - Environment: ${config.nodeEnv}`);
  console.log(`   - Frontend URLs: ${config.getFrontendUrls().join(', ')}`);
  console.log(`   - Supabase URL: ${config.supabase.url}`);
  console.log(`   - Database: ${config.databaseUrl ? '✅ Configured' : '❌ Missing'}`);
}