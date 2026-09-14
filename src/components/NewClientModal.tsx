import { useEffect, useState } from 'react'
import { useTenant } from '../context/TenantContext'
import type { NewTenantInput } from '../types'

/** Groups digits as xxx-xxx-xxx-xxx while typing */
const formatTin = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 12)
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9), d.slice(9, 12)].filter(Boolean).join('-')
}

export function NewClientModal({ onClose }: { onClose: () => void }) {
  const { addTenant } = useTenant()
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [tin, setTin] = useState('')
  const [rdoCode, setRdoCode] = useState('')
  const [vatType, setVatType] = useState<NewTenantInput['vatType']>('vatable')
  const [fiscalYearStart, setFiscalYearStart] = useState(`${new Date().getFullYear()}-01-01`)
  const [error, setError] = useState<string | null>(null)

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const fieldCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-slate-800 focus:outline-2 focus:outline-brand-600'
  const labelCls = 'flex flex-col gap-1 text-xs font-semibold text-slate-500'

  const submit = () => {
    if (!name.trim()) return setError('Client name is required.')
    if (tin.replace(/\D/g, '').length !== 12) return setError('TIN must be 12 digits, e.g. 008-345-678-000.')
    if (!rdoCode.trim()) return setError('RDO code is required, e.g. 047.')
    setError(null)
    addTenant({ name, industry, tin, rdoCode, vatType, fiscalYearStart })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="New client"
      >
        <h2 className="m-0 text-lg font-bold">New Client</h2>
        <p className="mt-1 mb-5 text-sm text-slate-500">
          Onboard a new client with a fresh set of books. You'll be switched to it right away.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <label className={`${labelCls} col-span-2`}>
            Client / Company Name *
            <input
              className={fieldCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quezon City Hardware Inc."
              autoFocus
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

        <div className="mt-6 flex justify-end gap-2.5">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit}>
            Create Client
          </button>
        </div>
      </div>
    </div>
  )
}