import { createClient } from "@supabase/supabase-js"

/**
 * Server-side Supabase client
 * - Accepts SUPABASE_* envs (recommended)
 * - Falls back to NEXT_PUBLIC_* if those are the only ones provided
 */
export function getServerSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY // server-only, preferred for admin routes

  if (!url || !(anon || service)) {
    return null
  }
  const key = service || anon!
  return createClient(url, key, { auth: { persistSession: false } })
}
