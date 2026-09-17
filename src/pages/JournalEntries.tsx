import { useState } from 'react'
import { useTenant } from '../context/TenantContext'
import { CHART_OF_ACCOUNTS } from '../data/chartOfAccounts'
import { formatPeso, formatDate } from '../lib/accounting'
import type { JournalEntry, JournalLine } from '../types'

interface DraftLine extends JournalLine {
  key: number
}

let nextKey = 100
const emptyLine = (): DraftLine => ({ key: nextKey++, accountCode: '', debit: 0, credit: 0 })

export function JournalEntriesPage() {
  const { entries, addEntry, tenant } = useTenant()
  if (!tenant) return null
  const [showForm, setShowForm] = useState(false)
  const [date, setDate] = useState('2026-03-01')
  const [reference, setReference] = useState('JV-001')
  const [description, setDescription] = useState('')
  const [vatType, setVatType] = useState<JournalEntry['vatType']>(tenant.vatType)
  const [lines, setLines] = useState<DraftLine[]>([emptyLine(), emptyLine()])
  const [error, setError] = useState<string | null>(null)

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  const setLine = (key: number, patch: Partial<DraftLine>) =>
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)))

  const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0)
  const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0)
  const balanced = totalDebit > 0 && Math.abs(totalDebit - totalCredit) < 0.005
  const allAccountsChosen = lines.every((l) => l.accountCode)

  const submit = () => {
    if (!description.trim()) return setError('Description is required.')
    if (!balanced) return setError('Entry is not balanced — total debits must equal total credits.')
    if (!allAccountsChosen) return setError('Every line must have an account.')
    setError(null)
    const entry: JournalEntry = {
      id: `${tenant.logoInitials}-${Date.now()}`,
      date,
      reference: reference || 'JV',
      description,
      vatType,
      posted: true,
      lines: lines.map(({ accountCode, debit, credit }) => ({
        accountCode,
        debit: debit || 0,
        credit: credit || 0,
      })),
    }
    addEntry(entry)
    setDescription('')
    setLines([emptyLine(), emptyLine()])
    setShowForm(false)
  }

  const fieldCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-slate-800 focus:outline-2 focus:outline-brand-600'
  const inputCls =
    'w-full rounded-lg border border-gray-200 px-2.5 py-2 text-right text-sm tabular-nums focus:outline-2 focus:outline-brand-600'

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="m-0 text-2xl font-bold">Journal Entries</h1>
          <p className="mt-1.5 mb-6 text-sm text-slate-500">General journal for {tenant.name}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Close' : '+ New Entry'}
        </button>
      </div>

      {showForm && (
        <div className="card-tile mb-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Date
              <input type="date" className={fieldCls} value={date} onChange={(e2) => setDate(e2.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Reference
              <input className={fieldCls} value={reference} onChange={(e2) => setReference(e2.target.value)} placeholder="JV-###" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              VAT Type
              <select className={fieldCls} value={vatType} onChange={(e2) => setVatType(e2.target.value as JournalEntry['vatType'])}>
                <option value="vatable">Vatable (12%)</option>
                <option value="vat-exempt">VAT-Exempt</option>
                <option value="zero-rated">Zero-Rated</option>
                <option value="non-vat">Non-VAT</option>
              </select>
            </label>
          </div>
          <label className="mt-4 flex flex-col gap-1 text-xs font-semibold text-slate-500">
            Description
            <input className={fieldCls} value={description} onChange={(e2) => setDescription(e2.target.value)} placeholder="e.g. Billed client for consulting services" />
          </label>
          <table className="kt-table my-4">
            <thead>
              <tr><th>Account</th><th className="num">Debit</th><th className="num">Credit</th></tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.key}>
                  <td>
                    <select className={fieldCls} value={l.accountCode} onChange={(e2) => setLine(l.key, { accountCode: e2.target.value })}>
                      <option value="">— Select account —</option>
                      {CHART_OF_ACCOUNTS.map((a) => (
                        <option key={a.code} value={a.code}>{a.code} · {a.name}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" min="0" className={inputCls} value={l.debit || ''} onChange={(e2) => setLine(l.key, { debit: Number(e2.target.value) })} /></td>
                  <td><input type="number" min="0" className={inputCls} value={l.credit || ''} onChange={(e2) => setLine(l.key, { credit: Number(e2.target.value) })} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td className="num">{formatPeso(totalDebit)}</td>
                <td className="num">{formatPeso(totalCredit)}</td>
              </tr>
            </tfoot>
          </table>
          <div className="flex justify-end gap-2.5">
            <button className="btn-ghost" onClick={() => setLines((ls) => [...ls, emptyLine()])}>+ Add Line</button>
            <button className="btn-primary" disabled={!balanced || !allAccountsChosen} onClick={submit}>
              Post Entry
            </button>
          </div>
          {!balanced && <p className="mt-2 mb-0 text-xs text-slate-500">Debits must equal credits before posting. {formatPeso(totalDebit)} vs {formatPeso(totalCredit)}</p>}
          {error && <p className="mt-2 mb-0 text-sm text-red-700">{error}</p>}
        </div>
      )}

      <table className="kt-table">
        <thead>
          <tr>
            <th>Date</th><th>Reference</th><th>Description</th><th>VAT</th><th className="num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => {
            const amount = e.lines.reduce((s, l) => s + l.debit, 0)
            return (
              <tr key={e.id}>
                <td className="tabular-nums">{formatDate(e.date)}</td>
                <td className="tabular-nums">{e.reference}</td>
                <td>{e.description}</td>
                <td><span className={`badge badge-${e.vatType}`}>{e.vatType}</span></td>
                <td className="num">{formatPeso(amount)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

