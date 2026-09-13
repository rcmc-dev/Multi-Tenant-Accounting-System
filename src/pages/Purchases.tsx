import { useState } from 'react'
import { useTenant } from '../context/TenantContext'
import { formatPeso, formatDate } from '../lib/accounting'
import { CHART_OF_ACCOUNTS, PH_VAT_RATE } from '../data/chartOfAccounts'
import type { Purchase } from '../types'

export function PurchasesPage() {
  const { purchases, addPurchase, tenant } = useTenant()
  const [showForm, setShowForm] = useState(false)
  const [refNo, setRefNo] = useState('PO-0001')
  const [date, setDate] = useState('2026-03-05')
  const [supplier, setSupplier] = useState('')
  const [expenseAccount, setExpenseAccount] = useState('5000')
  const [vatType, setVatType] = useState<Purchase['vatType']>('vatable')
  const [net, setNet] = useState(0)
  const [ewtRate, setEwtRate] = useState(0)
  const [status, setStatus] = useState<Purchase['status']>('unpaid')
  const [error, setError] = useState<string | null>(null)

  const vat = vatType === 'vatable' ? net * PH_VAT_RATE : 0
  const ewt = net * ewtRate
  const gross = net + vat
  const amountToPay = gross - ewt
  const sorted = [...purchases].sort((a, b) => b.date.localeCompare(a.date))

  const expenseAccounts = CHART_OF_ACCOUNTS.filter((a) => a.type === 'expense' || a.code === '1200')
  const accountName = (code: string) => CHART_OF_ACCOUNTS.find((a) => a.code === code)?.name ?? code

  const totalNet = purchases.reduce((s, x) => s + x.netAmount, 0)
  const totalVat = purchases.reduce((s, x) => s + (x.vatType === 'vatable' ? x.netAmount * PH_VAT_RATE : 0), 0)
  const totalEwt = purchases.reduce((s, x) => s + x.netAmount * x.ewtRate, 0)
  const totalGross = purchases.reduce(
    (s, x) => s + x.netAmount + (x.vatType === 'vatable' ? x.netAmount * PH_VAT_RATE : 0),
    0,
  )

  const fieldCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-slate-800 focus:outline-2 focus:outline-brand-600'

  const submit = () => {
    if (!refNo.trim()) return setError('Reference number is required.')
    if (!supplier.trim()) return setError('Supplier name is required.')
    if (net <= 0) return setError('Net amount must be greater than zero.')
    setError(null)
    addPurchase({ id: `PO-${Date.now()}`, refNo, date, supplier, expenseAccount, vatType, netAmount: net, ewtRate, status })
    setSupplier('')
    setNet(0)
    setShowForm(false)
  }
return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="m-0 text-2xl font-bold">Purchases</h1>
          <p className="mt-1.5 mb-6 text-sm text-slate-500">
            Supplier bills for {tenant.name} · recording a purchase auto-posts its journal entry
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Close' : '+ New Purchase'}
        </button>
      </div>

      {showForm && (
        <div className="card-tile mb-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Reference No.
              <input className={fieldCls} value={refNo} onChange={(e) => setRefNo(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Date
              <input type="date" className={fieldCls} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Supplier
              <input className={fieldCls} value={supplier} placeholder="e.g. Manila Wholesale Supply" onChange={(e) => setSupplier(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Account to Debit
              <select className={fieldCls} value={expenseAccount} onChange={(e) => setExpenseAccount(e.target.value)}>
                {expenseAccounts.map((a) => (
                  <option key={a.code} value={a.code}>{a.code} · {a.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              VAT Type
              <select className={fieldCls} value={vatType} onChange={(e) => setVatType(e.target.value as Purchase['vatType'])}>
                <option value="vatable">Vatable (with Input VAT)</option>
                <option value="non-vat">Non-VAT</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Net Amount (₱)
              <input type="number" min="0" className={fieldCls} value={net || ''} onChange={(e) => setNet(Number(e.target.value))} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              EWT Rate (1604E)
              <select className={fieldCls} value={ewtRate} onChange={(e) => setEwtRate(Number(e.target.value))}>
                <option value={0}>0%</option>
                <option value={0.05}>5% (rent/leasing)</option>
                <option value={0.1}>10% (professional fees)</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Status
              <select className={fieldCls} value={status} onChange={(e) => setStatus(e.target.value as Purchase['status'])}>
                <option value="unpaid">Unpaid (on credit → AP)</option>
                <option value="paid">Paid (cash)</option>
              </select>
            </label>
          </div>
          <p className="mt-4 mb-0 text-xs text-slate-500">
            Auto-posted entry → Dr {accountName(expenseAccount)} {formatPeso(net)}
            {vat > 0 && <>; Dr Input VAT (1150) {formatPeso(vat)}</>}
            {ewt > 0 && <>; Cr EWT Payable (2250) {formatPeso(ewt)}</>}; Cr{' '}
            {status === 'paid' ? 'Cash (1000)' : 'AP (2000)'} {formatPeso(amountToPay)}. Amount to pay:{' '}
            <strong>{formatPeso(amountToPay)}</strong>
          </p>
          <div className="mt-4 flex justify-end">
            <button className="btn-primary" onClick={submit}>Record Purchase</button>
          </div>
          {error && <p className="mt-2 mb-0 text-sm text-red-700">{error}</p>}
        </div>
      )}

      <table className="kt-table">
        <thead>
          <tr>
            <th>Ref</th><th>Date</th><th>Supplier</th><th>Account</th><th>VAT</th>
            <th className="num">Net</th><th className="num">VAT</th><th className="num">EWT</th><th className="num">Gross</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => {
            const pvat = p.vatType === 'vatable' ? p.netAmount * PH_VAT_RATE : 0
            const pewt = p.netAmount * p.ewtRate
            return (
              <tr key={p.id}>
                <td className="tabular-nums font-semibold">{p.refNo}</td>
                <td className="tabular-nums">{formatDate(p.date)}</td>
                <td>{p.supplier}</td>
                <td className="text-slate-500">{p.expenseAccount}</td>
                <td><span className={`badge badge-${p.vatType}`}>{p.vatType}</span></td>
                <td className="num">{formatPeso(p.netAmount)}</td>
                <td className="num">{pvat > 0 ? formatPeso(pvat) : '—'}</td>
                <td className="num">{pewt > 0 ? formatPeso(pewt) : '—'}</td>
                <td className="num font-semibold">{formatPeso(p.netAmount + pvat)}</td>
                <td><span className={`badge ${p.status === 'paid' ? 'badge-revenue' : 'badge-expense'}`}>{p.status}</span></td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>Totals</td>
            <td className="num">{formatPeso(totalNet)}</td>
            <td className="num">{formatPeso(totalVat)}</td>
            <td className="num">{formatPeso(totalEwt)}</td>
            <td className="num">{formatPeso(totalGross)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}