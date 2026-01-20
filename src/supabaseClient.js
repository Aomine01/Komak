/**
 * SECURITY MODULE: SUPABASE CLIENT CONFIGURATION
 * 
 * Singleton pattern for Supabase client initialization.
 * 
 * SECURITY FEATURES:
 * 1. Environment variable validation (prevents app from running without credentials)
 * 2. Uses official Supabase JS SDK (automatic SQL injection prevention via parameterized queries)
 * 3. No hardcoded credentials (all from .env file)
 * 4. Singleton pattern ensures one client instance across the app
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy .env.example to .env
 * 2. Fill in your Supabase project URL and anon key
 * 3. Never commit .env to version control
 */

import { createClient } from '@supabase/supabase-js';

// Validate environment variables exist
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '❌ SUPABASE CONFIGURATION ERROR:\n' +
        'Missing environment variables. Please:\n' +
        '1. Copy .env.example to .env\n' +
        '2. Add your Supabase credentials:\n' +
        '   - VITE_SUPABASE_URL\n' +
        '   - VITE_SUPABASE_ANON_KEY\n' +
        '3. Restart the development server'
    );

    // Throw error to prevent app from running without credentials
    throw new Error('Supabase credentials not configured. Check console for details.');
}

// Create and export singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false, // No auth needed for public form
        autoRefreshToken: false,
    },
    db: {
        schema: 'public'
    }
});

// Log successful initialization in development
if (import.meta.env.DEV) {
    console.log('✅ Supabase client initialized successfully');
}
