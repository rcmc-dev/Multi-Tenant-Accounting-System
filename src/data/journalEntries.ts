import type { JournalEntry, Tenant } from '../types'

/**
 * Fresh-start data module: no seeded tenants, journal entries, or demo user.
 * Tenants arrive from Supabase (Step 3) or are created in-app; books start empty.
 */
export const DEMO_TENANTS: Tenant[] = []

export const JOURNAL_ENTRIES: Record<string, JournalEntry[]> = {}
