import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/environment.js';
import { db } from '../config/database.js';
import { users, appliances } from '../models/schema.js';
import { createSampleDataForUser } from '../utils/sampleDataForUser.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Initialize Supabase client
const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    if (!authData.user) {
      return res.status(400).json({
        success: false,
        message: 'User creation failed'
      });
    }

    // Create user profile in our database
    const [userProfile] = await db.insert(users).values({
      id: authData.user.id,
      email: authData.user.email!,
      firstName: firstName || null,
      lastName: lastName || null,
    }).returning();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
        },
        session: authData.session
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({
        success: false,
        message: 'Login failed'
      });
    }

    // Get user profile from our database
    const [userProfile] = await db.select().from(users).where(eq(users.id, data.user.id));

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userProfile || {
          id: data.user.id,
          email: data.user.email,
          firstName: null,
          lastName: null,
        },
        session: data.session
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // For server-side logout, we don't need to call Supabase signOut
      // The client will handle token removal
      console.log('User logged out successfully');
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header required'
      });
    }

    const token = authHeader.substring(7);

    // Get user from Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user profile from our database
    const [userProfile] = await db.select().from(users).where(eq(users.id, user.id));

    res.json({
      success: true,
      data: {
        user: userProfile || {
          id: user.id,
          email: user.email,
          firstName: null,
          lastName: null,
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reset user's appliances to sample data
router.post('/reset-sample-data', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header required'
      });
    }

    const token = authHeader.substring(7);

    // Get user from Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const userId = user.id;

    // Check if user already has appliances
    const existingAppliances = await db.select().from(appliances).where(eq(appliances.userId, userId));
    
    res.json({
      success: true,
      data: {
        hasExistingAppliances: existingAppliances.length > 0,
        existingCount: existingAppliances.length
      },
      message: existingAppliances.length > 0 
        ? `You have ${existingAppliances.length} existing appliances. Continuing will delete them and load sample data.`
        : 'Sample data will be loaded for your account.'
    });

  } catch (error) {
    console.error('Reset sample data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check existing data'
    });
  }
});

// Confirm reset sample data
router.post('/confirm-reset-sample-data', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header required'
      });
    }

    const token = authHeader.substring(7);

    // Get user from Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const userId = user.id;
    const userEmail = user.email;

    // Create sample data for this user
    await createSampleDataForUser(userId, userEmail);

    res.json({
      success: true,
      message: 'Sample data created successfully with 5 appliances covering all warranty statuses'
    });

  } catch (error) {
    console.error('Confirm reset sample data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sample data'
    });
  }
});

export { router as authRoutes };