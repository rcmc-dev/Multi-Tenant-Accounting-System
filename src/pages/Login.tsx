import { useState } from 'react'
import { usePlatformSettings } from '../context/PlatformSettingsContext'
import { SUPERADMIN_EMAIL, SUPERADMIN_TEMP_PASSWORD, signIn, signUp } from '../lib/auth'
import type { AuthUser } from '../types'

const DEMO_CPA_EMAIL = 'maria@santoscpa.ph'
const DEMO_CPA_PASSWORD = 'KitaDemo#2026'

export function LoginPage({
  onSuccess,
  onBack,
}: {
  onSuccess: (user: AuthUser) => void
  onBack: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const { settings } = usePlatformSettings()

  const submit = async (e2: React.FormEvent) => {
    e2.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    if (mode === 'register' && !fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      if (mode === 'register') {
        const result = await signUp(email, password, fullName)
        if (result.user) {
          onSuccess(result.user)
          return
        }
        setNotice('Account created! Check your inbox and confirm your email, then sign in.')
        setMode('signin')
      } else {
        // Supabase when connected; offline mock otherwise (handled inside signIn)
        onSuccess(await signIn(email, password))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const fieldCls =
    'rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-normal text-slate-800 focus:outline-2 focus:outline-brand-600'

  return (
    <div className="relative flex min-h-dvh flex-col bg-gradient-to-br from-brand-900 to-brand-600 px-4 py-5 sm:items-center sm:justify-center sm:px-8">
      <button
        className="btn-ghost self-start !border-transparent !bg-white/10 !text-white"
        onClick={onBack}
      >
        ← Back to home
      </button>
      <div className="my-auto pt-5 sm:pt-0">
        <div className="w-full rounded-2xl bg-white p-6 shadow-2xl sm:max-w-sm sm:p-10">
          <div className="mb-6">
            <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-accent text-xl font-bold text-brand-900">₱</span>
          </div>
        <h1 className="text-xl font-bold">{mode === 'register' ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">
          {mode === 'register'
            ? `Start managing your clients' books on ${settings.platformName}.`
            : `Sign in to ${settings.platformName} to manage your clients' books.`}
        </p>
        {!settings.allowNewSignups && (
          <div className="mb-4 rounded-xl border border-amber-400 bg-amber-50 p-3 text-xs text-amber-900">
            🚧 New firm signups are paused by the platform admin. Existing users can still sign in.
          </div>
        )}
        {notice && (
          <div className="mb-3 rounded-xl border border-green-300 bg-green-50 p-3 text-xs text-green-800">{notice}</div>
        )}
        <form onSubmit={submit}>
          {mode === 'register' && (
            <label className="mb-4 flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Full Name
              <input
                type="text"
                value={fullName}
                placeholder="e.g. Juan Dela Cruz"
                className={fieldCls}
                onChange={(e2) => setFullName(e2.target.value)}
              />
            </label>
          )}
          <label className="mb-4 flex flex-col gap-1 text-xs font-semibold text-slate-500">
            Email
            <input
              type="email"
              value={email}
              placeholder="you@firm.ph"
              className={fieldCls}
              onChange={(e2) => setEmail(e2.target.value)}
            />
          </label>
          <label className="mb-4 flex flex-col gap-1 text-xs font-semibold text-slate-500">
            Password
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              className={fieldCls}
              onChange={(e2) => setPassword(e2.target.value)}
            />
          </label>
          {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
          <button type="submit" className="btn-primary w-full py-2.5" disabled={busy}>
            {mode === 'register'
              ? busy ? 'Creating…' : 'Create Account'
              : busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {settings.allowNewSignups ? (
          <p className="mt-4 text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  className="cursor-pointer font-semibold text-brand-600 hover:underline"
                  onClick={() => { setMode('register'); setError(null); setNotice(null) }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="cursor-pointer font-semibold text-brand-600 hover:underline"
                  onClick={() => { setMode('signin'); setError(null); setNotice(null) }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        ) : null}

        <div className="mt-5 rounded-xl border border-dashed border-brand-600 bg-brand-50 p-3.5 text-xs text-brand-900">
          <div className="font-bold">👤 CPA / Bookkeeper demo account</div>
          <div className="mt-1 font-mono">Email: {DEMO_CPA_EMAIL}</div>
          <div className="font-mono">Password: {DEMO_CPA_PASSWORD}</div>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-amber-400 bg-amber-50 p-3.5 text-xs text-amber-900">
          <div className="font-bold">🔐 Super Admin (temporary access)</div>
          <div className="mt-1 font-mono">Email: {SUPERADMIN_EMAIL}</div>
          <div className="font-mono">Temp password: {SUPERADMIN_TEMP_PASSWORD}</div>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          With the backend connected the accounts above are real; without it, any email/password signs you
          in as a CPA (offline demo). The temp super admin password should be rotated on first login.
        </p>
        </div>
      </div>
    </div>
  )
}
