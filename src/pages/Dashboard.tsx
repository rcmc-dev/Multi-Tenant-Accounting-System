import { useTenant } from '../context/TenantContext'
import { formatPeso, getIncomeStatement, getVatSummary, getBalanceSheet } from '../lib/accounting'

export function DashboardPage() {
  const { tenant, entries } = useTenant()
  if (!tenant) return null
  const is = getIncomeStatement(entries)
  const vat = getVatSummary(entries)
  const bs = getBalanceSheet(entries)
  const cash = entries
    .flatMap((e) => e.lines)
    .filter((l) => l.accountCode === '1000' || l.accountCode === '1010')
    .reduce((s, l) => s + l.debit - l.credit, 0)

  const cards = [
    { label: 'Cash & Bank', value: formatPeso(cash) },
    { label: 'Total Revenue (YTD)', value: formatPeso(is.totalRevenue) },
    { label: 'Net Income (YTD)', value: formatPeso(is.netIncome) },
    { label: vat.netVatPayable >= 0 ? 'Net VAT Payable' : 'Net VAT Claimable', value: formatPeso(Math.abs(vat.netVatPayable)) },
  ]

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">Dashboard</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">
        {tenant.name} · TIN {tenant.tin} · RDO {tenant.rdoCode} ·{' '}
        {tenant.vatType === 'vatable' ? 'VAT-registered (2550Q)' : 'Non-VAT (2551Q)'}
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {cards.map((c) => (
          <div className="card-tile" key={c.label}>
            <div className="text-xs tracking-wider text-slate-500 uppercase">{c.label}</div>
            <div className="mt-2 text-xl font-bold tabular-nums">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="card-tile mt-6">
        <div className="text-xs tracking-wider text-slate-500 uppercase">Balance Check</div>
        <p className="mt-2 mb-0">
          {bs.balanced
            ? '✅ Books are balanced — total assets equal liabilities + equity.'
            : '⚠️ Books are out of balance. Check unposted or draft entries.'}
        </p>
      </div>
    </div>
  )
}
