import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// One Supabase client, no auth (we use a fixed demo user instead).
// Returns null when env vars are missing so the app still runs on seed data.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export function hasSupabase() {
  return Boolean(url && key);
}
