import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * True when .env.local provides both values. When false, the app runs in
 * localStorage demo mode (everything still works, nothing persists to a DB).
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

/** Null in demo mode — every DB call site must guard on this. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null
