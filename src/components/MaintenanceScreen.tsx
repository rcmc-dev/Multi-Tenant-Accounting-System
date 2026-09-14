import { usePlatformSettings } from '../context/PlatformSettingsContext'

export function MaintenanceScreen({ onBack }: { onBack: () => void }) {
  const { settings } = usePlatformSettings()
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-2xl">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-[12px] bg-accent text-2xl font-bold text-brand-900">
          ₱
        </span>
        <h1 className="mt-5 text-xl font-bold">{settings.platformName} is under maintenance</h1>
        <p className="mt-2 text-sm text-slate-500">
          We're performing scheduled platform updates. All books are safe — please check back shortly.
        </p>
        <button className="btn-ghost mt-6" onClick={onBack}>
          ← Back to homepage
        </button>
      </div>
    </div>
  )
}