import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached
  const env = (import.meta as any)?.env || {}
  const url = env.VITE_SUPABASE_URL as string
  const key = env.VITE_SUPABASE_ANON_KEY as string
  if (!url || !key) return null
  cached = createClient(url, key)
  return cached
}
