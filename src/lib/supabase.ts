// SERVER-ONLY MODULE
// SUPABASE_SERVICE_ROLE_KEY is not prefixed with NEXT_PUBLIC_,
// so Next.js never includes it in the client bundle.
// Only import this file from API routes or Server Components.

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client — bypasses Row Level Security, server-side only
export const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
