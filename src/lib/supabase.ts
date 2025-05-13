import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

if (!env.supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!env.supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client
export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

// Helper function to get the redirect URL
export const getRedirectUrl = () => {
  // For Vercel deployment
  if (window.location.hostname !== 'localhost') {
    return 'https://project-hmj8xg2is-ashirvaddubeys-projects.vercel.app/auth/callback';
  }
  // For local development
  return `${window.location.origin}/auth/callback`;
};

// Test function to verify connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('_tables').select('*').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('Supabase connection test successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}
