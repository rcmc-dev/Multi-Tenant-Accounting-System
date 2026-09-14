import { useState } from 'react'
import { usePlatformSettings } from '../context/PlatformSettingsContext'

const SUPERADMIN_EMAIL = 'superadmin@kitabooks.ph'
const SUPERADMIN_TEMP_PASSWORD = 'KitaAdmin#2026'

export function LoginPage({
  onSuccess,
  onBack,
}: {
  onSuccess: (name: string, role: 'cpa' | 'superadmin') => void
  onBack: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { settings } = usePlatformSettings()

  const submit = (e2: React.FormEvent) => {
    e2.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    if (email.trim().toLowerCase() === SUPERADMIN_EMAIL) {
      if (password !== SUPERADMIN_TEMP_PASSWORD) {
        setError('Invalid temporary password for the super admin account.')
        return
      }
      onSuccess('Ramon Dela Cruz', 'superadmin')
      return
    }
    // Mock auth for CPA firms — real auth comes with the backend milestone.
    onSuccess('Maria Santos, CPA', 'cpa')
  }

  const fillSuperAdmin = () => {
    setEmail(SUPERADMIN_EMAIL)
    setPassword(SUPERADMIN_TEMP_PASSWORD)
    setError(null)
  }

  const fieldCls =
    'rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-normal text-slate-800 focus:outline-2 focus:outline-brand-600'

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 to-brand-600 p-8">
      <button
        className="btn-ghost absolute top-5 left-5 !border-transparent !bg-white/10 !text-white"
        onClick={onBack}
      >
        ← Back to home
      </button>
      <div className="w-full max-w-sm rounded-2xl bg-white p-10 shadow-2xl">
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
          <button type="submit" className="btn-primary w-full py-2.5">Sign In</button>
        </form>

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
          CPA demo: any other email/password signs you in. Real authentication arrives with the backend —
          the temp super admin password above should be rotated on first login.
        </p>
      </div>
    </div>
  )
}
