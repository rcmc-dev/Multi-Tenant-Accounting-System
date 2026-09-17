import { useState } from 'react'
import { useTenant } from '../context/TenantContext'
import { formatPeso, formatDate } from '../lib/accounting'
import { PH_VAT_RATE } from '../data/chartOfAccounts'
import type { Sale } from '../types'

export function SalesPage() {
  const { sales, addSale, tenant } = useTenant()
  if (!tenant) return null
  const [showForm, setShowForm] = useState(false)
  const [invoiceNo, setInvoiceNo] = useState('SI-0001')
  const [date, setDate] = useState('2026-03-05')
  const [customer, setCustomer] = useState('')
  const [saleType, setSaleType] = useState<Sale['saleType']>('goods')
  const [vatType, setVatType] = useState<Sale['vatType']>(tenant.vatType)
  const [net, setNet] = useState(0)
  const [status, setStatus] = useState<Sale['status']>('unpaid')
  const [error, setError] = useState<string | null>(null)

  const vat = vatType === 'vatable' ? net * PH_VAT_RATE : 0
  const gross = net + vat
  const sorted = [...sales].sort((a, b) => b.date.localeCompare(a.date))
  const totalNet = sales.reduce((s, x) => s + x.netAmount, 0)
  const totalVat = sales.reduce((s, x) => s + (x.vatType === 'vatable' ? x.netAmount * PH_VAT_RATE : 0), 0)
  const totalGross = sales.reduce(
    (s, x) => s + x.netAmount + (x.vatType === 'vatable' ? x.netAmount * PH_VAT_RATE : 0),
    0,
  )
  const outstanding = sales.filter((s) => s.status === 'unpaid').reduce((s, x) => s + x.netAmount, 0)

  const fieldCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-slate-800 focus:outline-2 focus:outline-brand-600'

  const submit = () => {
    if (!invoiceNo.trim()) return setError('Invoice number is required.')
    if (!customer.trim()) return setError('Customer name is required.')
    if (net <= 0) return setError('Net amount must be greater than zero.')
    setError(null)
    addSale({ id: `SALE-${Date.now()}`, invoiceNo, date, customer, saleType, vatType, netAmount: net, status })
    setCustomer('')
    setNet(0)
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="m-0 text-2xl font-bold">Sales</h1>
          <p className="mt-1.5 mb-6 text-sm text-slate-500">
            Sales invoices for {tenant.name} · recording a sale auto-posts its journal entry
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Close' : '+ New Sale'}
        </button>
      </div>

      {showForm && (
        <div className="card-tile mb-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Invoice No. (BIR SI)
              <input className={fieldCls} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Date
              <input type="date" className={fieldCls} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Customer
              <input className={fieldCls} value={customer} placeholder="e.g. ABC Trading Corp." onChange={(e) => setCustomer(e.target.value)} />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Sale Type
              <select className={fieldCls} value={saleType} onChange={(e) => setSaleType(e.target.value as Sale['saleType'])}>
                <option value="goods">Goods (Sales)</option>
                <option value="services">Services</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              VAT Type
              <select className={fieldCls} value={vatType} onChange={(e) => setVatType(e.target.value as Sale['vatType'])}>
                <option value="vatable">Vatable (12%)</option>
                <option value="vat-exempt">VAT-Exempt</option>
                <option value="zero-rated">Zero-Rated</option>
                <option value="non-vat">Non-VAT</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Net Amount (₱)
              <input type="number" min="0" className={fieldCls} value={net || ''} onChange={(e) => setNet(Number(e.target.value))} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
              Status
              <select className={fieldCls} value={status} onChange={(e) => setStatus(e.target.value as Sale['status'])}>
                <option value="unpaid">Unpaid (on credit → AR)</option>
                <option value="paid">Paid (cash sale)</option>
              </select>
            </label>
          </div>
          <p className="mt-4 mb-0 text-xs text-slate-500">
            Auto-posted entry → Dr {status === 'paid' ? 'Cash (1000)' : 'AR (1100)'} {formatPeso(gross)}; Cr{' '}
            {saleType === 'goods' ? 'Sales (4000)' : 'Service Revenue (4100)'} {formatPeso(net)}
            {vat > 0 && <>; Cr Output VAT (2300) {formatPeso(vat)}</>}. Total invoice: <strong>{formatPeso(gross)}</strong>
          </p>
          <div className="mt-4 flex justify-end">
            <button className="btn-primary" onClick={submit}>Record Sale</button>
          </div>
          {error && <p className="mt-2 mb-0 text-sm text-red-700">{error}</p>}
        </div>
      )}

      <table className="kt-table">
        <thead>
          <tr>
            <th>Invoice</th><th>Date</th><th>Customer</th><th>Type</th><th>VAT</th>
            <th className="num">Net</th><th className="num">VAT</th><th className="num">Gross</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => {
            const svat = s.vatType === 'vatable' ? s.netAmount * PH_VAT_RATE : 0
            return (
              <tr key={s.id}>
                <td className="tabular-nums font-semibold">{s.invoiceNo}</td>
                <td className="tabular-nums">{formatDate(s.date)}</td>
                <td>{s.customer}</td>
                <td className="capitalize">{s.saleType}</td>
                <td><span className={`badge badge-${s.vatType}`}>{s.vatType}</span></td>
                <td className="num">{formatPeso(s.netAmount)}</td>
                <td className="num">{svat > 0 ? formatPeso(svat) : '—'}</td>
                <td className="num font-semibold">{formatPeso(s.netAmount + svat)}</td>
                <td><span className={`badge ${s.status === 'paid' ? 'badge-revenue' : 'badge-expense'}`}>{s.status}</span></td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>Totals · Outstanding (unpaid net): {formatPeso(outstanding)}</td>
            <td className="num">{formatPeso(totalNet)}</td>
            <td className="num">{formatPeso(totalVat)}</td>
            <td className="num">{formatPeso(totalGross)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
