import { useState } from 'react'
import { useTenant } from '../context/TenantContext'
import { formatPeso, getIncomeStatement, getBalanceSheet, getTrialBalance, getVatSummary } from '../lib/accounting'

type Statement = 'trial-balance' | 'income-statement' | 'balance-sheet' | 'vat'

const Row = ({ label, amount, bold, indent }: { label: string; amount: number; bold?: boolean; indent?: boolean }) => (
  <tr className={bold ? 'font-bold [&>td]:border-t-2 [&>td]:border-slate-800' : ''}>
    <td style={{ paddingLeft: indent ? '2rem' : undefined }}>{label}</td>
    <td className="num">{formatPeso(amount)}</td>
  </tr>
)

export function FinancialStatementsPage() {
  const { entries, tenant } = useTenant()
  const [view, setView] = useState<Statement>('trial-balance')

  const tb = getTrialBalance(entries)
  const is = getIncomeStatement(entries)
  const bs = getBalanceSheet(entries)
  const vat = getVatSummary(entries)

  const tabs = [
    ['trial-balance', 'Trial Balance'],
    ['income-statement', 'Income Statement'],
    ['balance-sheet', 'Balance Sheet'],
    ['vat', 'VAT Summary (2550)'],
  ] as const

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">Financial Statements</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">
        {tenant.name} · as of latest posted entry · amounts in Philippine Pesos
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm transition ${
              view === key
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-gray-200 bg-white text-slate-700 hover:border-brand-600'
            }`}
            onClick={() => setView(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'trial-balance' && (
        <table className="kt-table">
          <thead><tr><th>Account</th><th className="num">Debit</th><th className="num">Credit</th></tr></thead>
          <tbody>
            {tb.rows.map((r) => (
              <tr key={r.account.code}>
                <td className="tabular-nums">{r.account.code} · {r.account.name}</td>
                <td className="num">{r.balance > 0 ? formatPeso(r.balance) : '—'}</td>
                <td className="num">{r.balance < 0 ? formatPeso(-r.balance) : '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Totals</td>
              <td className="num">{formatPeso(tb.totalDebit)}</td>
              <td className="num">{formatPeso(tb.totalCredit)}</td>
            </tr>
          </tfoot>
        </table>
      )}


      {view === 'income-statement' && (
        <table className="kt-table">
          <thead><tr><th>Particulars</th><th className="num">Amount</th></tr></thead>
          <tbody>
            <tr className="section-row"><td colSpan={2}>Revenue</td></tr>
            {is.revenue.map((r) => <Row key={r.account.code} label={r.account.name} amount={r.balance} indent />)}
            <Row label="Total Revenue" amount={is.totalRevenue} bold />
            <tr className="section-row"><td colSpan={2}>Expenses</td></tr>
            {is.expenses.map((r) => <Row key={r.account.code} label={r.account.name} amount={r.balance} indent />)}
            <Row label="Total Expenses" amount={is.totalExpenses} bold />
            <Row label={is.netIncome >= 0 ? 'Net Income' : 'Net Loss'} amount={is.netIncome} bold />
          </tbody>
        </table>
      )}

      {view === 'balance-sheet' && (
        <table className="kt-table">
          <thead><tr><th>Particulars</th><th className="num">Amount</th></tr></thead>
          <tbody>
            <tr className="section-row"><td colSpan={2}>Assets</td></tr>
            {bs.assets.map((r) => <Row key={r.account.code} label={r.account.name} amount={r.balance} indent />)}
            <Row label="Total Assets" amount={bs.totalAssets} bold />
            <tr className="section-row"><td colSpan={2}>Liabilities</td></tr>
            {bs.liabilities.map((r) => <Row key={r.account.code} label={r.account.name} amount={r.balance} indent />)}
            <Row label="Total Liabilities" amount={bs.totalLiabilities} bold />
            <tr className="section-row"><td colSpan={2}>Equity</td></tr>
            {bs.equity.map((r) => <Row key={r.account.code} label={r.account.name} amount={r.balance} indent />)}
            <Row label="Retained Earnings (current period)" amount={bs.retainedEarnings} indent />
            <Row label="Total Equity" amount={bs.totalEquity} bold />
            <Row label="Total Liabilities & Equity" amount={bs.totalLiabilities + bs.totalEquity} bold />
          </tbody>
          <tfoot>
            <tr><td colSpan={2}>{bs.balanced ? '✅ Balanced' : '⚠️ Out of balance'}</td></tr>
          </tfoot>
        </table>
      )}

      {view === 'vat' && (
        <table className="kt-table">
          <thead><tr><th>BIR 2550M/Q Component</th><th className="num">Amount</th></tr></thead>
          <tbody>
            <Row label="Output VAT (from sales)" amount={vat.outputVat} />
            <Row label="Less: Input VAT (from purchases)" amount={vat.inputVat} />
            <Row label={vat.netVatPayable >= 0 ? 'Net VAT Payable' : 'Excess Input VAT (carry-over)'} amount={Math.abs(vat.netVatPayable)} bold />
          </tbody>
          <tfoot>
            <tr><td colSpan={2}>Due: within 25 days of month-end (2550M) or 30 days of quarter-end (2550Q) via EFPS/eBIR.</td></tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}
