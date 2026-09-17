import { isSupabaseConfigured, supabase } from './supabase'
import type { AuthUser } from '../types'

export const SUPERADMIN_EMAIL = 'rcmctaxconsultancy@gmail.com'
export const SUPERADMIN_TEMP_PASSWORD = 'KitaAdmin#2026'

/** New CPA signups join this demo firm until firm management ships */
const DEMO_FIRM_ID = 'f-santos'

interface ProfileRow {
  id: string
  email: string
  full_name: string
  role: 'cpa' | 'superadmin'
  firm_id: string | null
}

/** Offline demo sign-in — mirrors the pre-Supabase mock behavior */
function mockSignIn(email: string, password: string): AuthUser {
  if (email.trim().toLowerCase() === SUPERADMIN_EMAIL) {
    if (password !== SUPERADMIN_TEMP_PASSWORD) {
      throw new Error('Invalid temporary password for the super admin account.')
    }
    return { id: 'mock-superadmin', name: 'Ramon Dela Cruz', role: 'superadmin', firmId: null }
  }
  return { id: 'mock-cpa', name: 'Maria Santos, CPA', role: 'cpa', firmId: null }
}

function friendlyAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return 'No confirmed account with those credentials yet. If this is the first sign-in, create the user in Supabase (Authentication → Users, auto-confirm) or double-check the password.'
  }
  if (/email not confirmed/i.test(message)) return 'Please confirm your email first (check your inbox).'
  if (/rate limit/i.test(message)) return 'Too many attempts — wait a minute and try again.'
  return message
}

/** Creates the profile row on first sign-in; keeps the platform admin role in sync */
async function ensureProfile(userId: string, email: string, fullNameOverride?: string): Promise<ProfileRow> {
  const { data } = await supabase!.from('profiles').select('*').eq('id', userId).maybeSingle()
  const isAdminEmail = email.toLowerCase() === SUPERADMIN_EMAIL

  if (data) {
    if (isAdminEmail && data.role !== 'superadmin') {
      await supabase!.from('profiles').update({ role: 'superadmin' }).eq('id', userId)
      return { ...data, role: 'superadmin' }
    }
    return data as ProfileRow
  }

  const role: 'cpa' | 'superadmin' = isAdminEmail ? 'superadmin' : 'cpa'
  const row: ProfileRow = {
    id: userId,
    email,
    full_name: role === 'superadmin' ? 'Ramon Dela Cruz' : fullNameOverride?.trim() || email.split('@')[0] || 'User',
    role,
    firm_id: role === 'superadmin' ? null : DEMO_FIRM_ID,
  }
  const { error } = await supabase!.from('profiles').insert(row)
  if (error) throw new Error(friendlyAuthError(error.message))
  return row
}

function userFromProfile(userId: string, profile: ProfileRow): AuthUser {
  return { id: userId, name: profile.full_name, role: profile.role, firmId: profile.firm_id }
}

/** Signs in with Supabase when configured, or the offline mock otherwise */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  if (!supabase) return mockSignIn(email, password)
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
  if (error || !data.user) throw new Error(friendlyAuthError(error?.message ?? 'Sign-in failed.'))
  const profile = await ensureProfile(data.user.id, email.trim())
  return userFromProfile(data.user.id, profile)
}

/** Restores a persisted Supabase session on page load (mock mode: always signed out) */
export async function restoreSession(): Promise<AuthUser | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  const sessionUser = data.session?.user
  if (!sessionUser?.email) return null
  try {
    const profile = await ensureProfile(sessionUser.id, sessionUser.email)
    return userFromProfile(sessionUser.id, profile)
  } catch (err) {
    console.warn('[KitaBooks] session restore failed:', err)
    return null
  }
}

/** Clears the Supabase session (no-op in offline demo mode) */
export async function signOutUser(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

/** Exposed for diagnostics/UX hints */
export const isSupabaseAuthConfigured = isSupabaseConfigured

export interface SignUpResult {
  /** Signed-in user when the account was confirmed instantly; null when email confirmation is pending */
  user: AuthUser | null
  needsEmailConfirmation: boolean
}

function friendlySignUpError(message: string): string {
  if (/already registered|already exists/i.test(message)) {
    return 'An account with this email already exists — sign in instead.'
  }
  return message
}

/** Registers a new CPA/bookkeeper account (Supabase when configured; instant mock session otherwise) */
export async function signUp(email: string, password: string, fullName: string): Promise<SignUpResult> {
  if (!supabase) return { user: mockSignIn(email, password), needsEmailConfirmation: false }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { full_name: fullName.trim() || 'User' } },
  })
  if (error || !data.user) throw new Error(friendlySignUpError(error?.message ?? 'Sign-up failed.'))

  // Session right away → email confirmation is OFF, log the user in directly
  if (data.session) {
    const profile = await ensureProfile(data.user.id, data.user.email ?? email.trim(), fullName)
    return { user: userFromProfile(data.user.id, profile), needsEmailConfirmation: false }
  }

  // Email confirmation required — user must click the link before signing in
  return { user: null, needsEmailConfirmation: true }
}
