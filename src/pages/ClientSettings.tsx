import { useState } from 'react'
import { NewClientModal } from '../components/NewClientModal'
import { useTenant } from '../context/TenantContext'
import { DEMO_TENANTS } from '../data/journalEntries'
import type { NewTenantInput } from '../types'

/** Groups digits as xxx-xxx-xxx-xxx while typing (same as the New Client modal) */
const formatTin = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 12)
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9), d.slice(9, 12)].filter(Boolean).join('-')
}

export function ClientSettingsPage() {
  const { tenant, updateTenant } = useTenant()
  const [showNewClient, setShowNewClient] = useState(false)
  const [name, setName] = useState(tenant.name)
  const [industry, setIndustry] = useState(tenant.industry)
  const [tin, setTin] = useState(tenant.tin)
  const [rdoCode, setRdoCode] = useState(tenant.rdoCode)
  const [vatType, setVatType] = useState<NewTenantInput['vatType']>(tenant.vatType)
  const [fiscalYearStart, setFiscalYearStart] = useState(tenant.fiscalYearStart)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fieldCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-slate-800 focus:outline-2 focus:outline-brand-600'
  const labelCls = 'flex flex-col gap-1 text-xs font-semibold text-slate-500'

  const save = () => {
    if (!name.trim()) return setError('Client name is required.')
    if (tin.replace(/\D/g, '').length !== 12) return setError('TIN must be 12 digits, e.g. 008-345-678-000.')
    if (!rdoCode.trim()) return setError('RDO code is required, e.g. 047.')
    setError(null)
    updateTenant(tenant.id, { name, industry, tin, rdoCode, vatType, fiscalYearStart })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const isDemo = DEMO_TENANTS.some((d) => d.id === tenant.id)

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="m-0 text-2xl font-bold">Client Settings</h1>
          <p className="mt-1.5 mb-6 text-sm text-slate-500">Registration details of the selected client.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-bold text-brand-900">
            {tenant.logoInitials}
          </div>
          <div>
            <div className="text-sm font-semibold">{tenant.name}</div>
            <div className="text-xs text-slate-500">{tenant.industry}</div>
          </div>
        </div>
      </div>

      <div className="card-tile mb-4">
        <div className="mb-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Client Information</div>
        <div className="grid grid-cols-2 gap-4">
          <label className={`${labelCls} col-span-2`}>
            Client / Company Name *
            <input
              className={fieldCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quezon City Hardware Inc."
            />
          </label>
          <label className={labelCls}>
            Industry
            <input
              className={fieldCls}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Retail Trading"
            />
          </label>
          <label className={labelCls}>
            BIR RDO Code *
            <input
              className={fieldCls}
              value={rdoCode}
              onChange={(e) => setRdoCode(e.target.value)}
              placeholder="e.g. 047"
            />
          </label>
          <label className={labelCls}>
            TIN *
            <input
              className={`${fieldCls} tabular-nums`}
              value={tin}
              onChange={(e) => setTin(formatTin(e.target.value))}
              placeholder="000-123-456-000"
              inputMode="numeric"
            />
          </label>
          <label className={labelCls}>
            VAT Registration
            <select
              className={fieldCls}
              value={vatType}
              onChange={(e) => setVatType(e.target.value as NewTenantInput['vatType'])}
            >
              <option value="vatable">VAT-registered (12%)</option>
              <option value="non-vat">Non-VAT</option>
            </select>
          </label>
          <label className={labelCls}>
            Fiscal Year Start
            <input
              type="date"
              className={fieldCls}
              value={fiscalYearStart}
              onChange={(e) => setFiscalYearStart(e.target.value)}
            />
          </label>
        </div>

        {error && <p className="mt-4 mb-0 text-sm text-red-700">{error}</p>}

        <div className="mt-6 flex items-center gap-3">
          <button className="btn-primary" onClick={save}>
            Save Changes
          </button>
          {saved && <span className="text-sm font-medium text-green-700">✅ Client details updated.</span>}
        </div>
        {isDemo && (
          <p className="mt-2 mb-0 text-xs text-slate-500">
            Built-in demo client — edits last for this session. Clients you create are remembered.
          </p>
        )}
      </div>

      <div className="card-tile flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Add New Client</div>
          <div className="text-xs text-slate-500">Onboard another company with a fresh set of books.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowNewClient(true)}>
          + Add New Client
        </button>
      </div>

      {showNewClient && <NewClientModal onClose={() => setShowNewClient(false)} />}
    </div>
  )
}