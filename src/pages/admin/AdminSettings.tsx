import { useState } from 'react'

export function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState('KitaBooks')
  const [vatRate, setVatRate] = useState('12')
  const [defaultPlan, setDefaultPlan] = useState('Solo CPA')
  const [maintenance, setMaintenance] = useState(false)
  const [newSignups, setNewSignups] = useState(true)
  const [saved, setSaved] = useState(false)

  const save = () => {
    // Mock save — persistence arrives with the backend.
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleCls = (on: boolean) =>
    `relative h-6 w-11 cursor-pointer rounded-full transition ${on ? 'bg-brand-600' : 'bg-gray-300'}`

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">System Settings</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">Platform-wide configuration.</p>

      <div className="card-tile mb-4">
        <div className="mb-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">General</div>
        <label className="mb-4 flex flex-col gap-1 text-xs font-semibold text-slate-500">
          Platform Name
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-2 focus:outline-brand-600"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
            Standard VAT Rate (%)
            <input
              type="number"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-2 focus:outline-brand-600"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
            Default Plan for New Firms
            <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-2 focus:outline-brand-600"
              value={defaultPlan}
              onChange={(e) => setDefaultPlan(e.target.value)}
            >
              <option>Solo CPA</option>
              <option>Firm</option>
              <option>Enterprise</option>
            </select>
          </label>
        </div>
      </div>

      <div className="card-tile mb-4">
        <div className="mb-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Feature Flags</div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Maintenance Mode</div>
            <div className="text-xs text-slate-500">Show a maintenance page to all non-admin users.</div>
          </div>
          <button className={toggleCls(maintenance)} onClick={() => setMaintenance((m) => !m)}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${maintenance ? 'left-[1.375rem]' : 'left-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Allow New Firm Signups</div>
            <div className="text-xs text-slate-500">Public registration for new CPA firms.</div>
          </div>
          <button className={toggleCls(newSignups)} onClick={() => setNewSignups((s) => !s)}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${newSignups ? 'left-[1.375rem]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={save}>Save Settings</button>
        {saved && <span className="text-sm font-medium text-green-700">✅ Settings saved (demo).</span>}
      </div>
    </div>
  )
}
