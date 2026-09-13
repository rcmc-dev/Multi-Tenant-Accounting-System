import { useState } from 'react'
import { useTenant } from '../context/TenantContext'
import { CHART_OF_ACCOUNTS } from '../data/chartOfAccounts'
import { formatPeso, getBalances } from '../lib/accounting'

export function ChartOfAccountsPage() {
  const { entries } = useTenant()
  const [filter, setFilter] = useState('all')
  const balances = getBalances(entries)
  const balanceFor = (code: string) => balances.find((b) => b.account.code === code)

  const types = ['all', 'asset', 'liability', 'equity', 'revenue', 'expense']
  const visible = CHART_OF_ACCOUNTS.filter((a) => filter === 'all' || a.type === filter)

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">Chart of Accounts</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">Philippine standard accounts with BIR classification</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm transition ${
              filter === t
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-gray-200 bg-white text-slate-700 hover:border-brand-600'
            }`}
            onClick={() => setFilter(t)}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <table className="kt-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Account Name</th>
            <th>Type</th>
            <th>BIR Classification</th>
            <th className="num">Balance</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((a) => {
            const b = balanceFor(a.code)
            return (
              <tr key={a.code}>
                <td className="tabular-nums">{a.code}</td>
                <td>{a.name}</td>
                <td><span className={`badge badge-${a.type}`}>{a.type}</span></td>
                <td className="text-slate-500">{a.phClassification ?? '—'}</td>
                <td className="num">{b ? formatPeso(b.balance) : '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
