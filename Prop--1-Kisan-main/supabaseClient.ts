import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null
let resolvedUrl: string | null = null
let resolvedAnonKey: string | null = null

export function getSupabaseConfig() {
  if (!resolvedUrl || !resolvedAnonKey) return null
  return { url: resolvedUrl, anonKey: resolvedAnonKey }
}

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached
  
  // Try to get from environment
  let url = (import.meta as any)?.env?.VITE_SUPABASE_URL
  let key = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY

  // Fallback to hardcoded values if env is missing (Debug Fix)
  if (!url) url = "https://ykvatttsnpjrwqfhhysu.supabase.co"
  if (!key) key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdmF0dHRzbnBqcndxZmhoeXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTk5NjQsImV4cCI6MjA4NjA3NTk2NH0.5Njnh8NBEcPDddHjwv3CoUpCcAHu-ALNUQHQVdAdq-Y"
  
  if (!url || !key) {
    console.error("Supabase Config Missing. Env:", (import.meta as any)?.env);
    return null
  }
  
  resolvedUrl = url
  resolvedAnonKey = key
  cached = createClient(url, key)
  return cached
}
