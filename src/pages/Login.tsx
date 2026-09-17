import { useState } from 'react'
import { usePlatformSettings } from '../context/PlatformSettingsContext'
import { SUPERADMIN_EMAIL, SUPERADMIN_TEMP_PASSWORD, signIn } from '../lib/auth'
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
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const { settings } = usePlatformSettings()

  const submit = async (e2: React.FormEvent) => {
    e2.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      // Supabase when connected; offline mock otherwise (handled inside signIn)
      onSuccess(await signIn(email, password))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const fillSuperAdmin = () => {
    setEmail(SUPERADMIN_EMAIL)
    setPassword(SUPERADMIN_TEMP_PASSWORD)
    setError(null)
  }

  const fillDemoCpa = () => {
    setEmail(DEMO_CPA_EMAIL)
    setPassword(DEMO_CPA_PASSWORD)
    setError(null)
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
        <h1 className="text-xl font-bold">Welcome back</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">Sign in to {settings.platformName} to manage your clients' books.</p>
        {!settings.allowNewSignups && (
          <div className="mb-4 rounded-xl border border-amber-400 bg-amber-50 p-3 text-xs text-amber-900">
            🚧 New firm signups are paused by the platform admin. Existing users can still sign in.
          </div>
        )}
        <form onSubmit={submit}>
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
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 rounded-xl border border-dashed border-brand-600 bg-brand-50 p-3.5 text-xs text-brand-900">
          <div className="font-bold">👤 CPA / Bookkeeper demo account</div>
          <div className="mt-1 font-mono">Email: {DEMO_CPA_EMAIL}</div>
          <div className="font-mono">Password: {DEMO_CPA_PASSWORD}</div>
          <button
            type="button"
            className="mt-2 cursor-pointer rounded-md bg-brand-600 px-2.5 py-1 font-semibold text-white hover:bg-brand-700"
            onClick={fillDemoCpa}
          >
            Fill credentials for me
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-amber-400 bg-amber-50 p-3.5 text-xs text-amber-900">
          <div className="font-bold">🔐 Super Admin (temporary access)</div>
          <div className="mt-1 font-mono">Email: {SUPERADMIN_EMAIL}</div>
          <div className="font-mono">Temp password: {SUPERADMIN_TEMP_PASSWORD}</div>
          <button
            type="button"
            className="mt-2 cursor-pointer rounded-md bg-amber-400/60 px-2.5 py-1 font-semibold hover:bg-amber-400"
            onClick={fillSuperAdmin}
          >
            Fill credentials for me
          </button>
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
