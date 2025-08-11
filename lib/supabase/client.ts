"use client"

import { createClient } from "@supabase/supabase-js"

let supabase: ReturnType<typeof createClient> | null = null

export function getBrowserSupabase() {
  if (supabase) return supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  supabase = createClient(url, anon)
  return supabase
}
