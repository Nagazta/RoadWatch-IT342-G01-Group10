// Supabase Client Configuration for Vite
// Location: src/config/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);