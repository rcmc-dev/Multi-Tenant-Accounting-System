import { INVOICES, PLATFORM_FIRMS } from '../../data/platformData'
import { formatPeso } from '../../lib/accounting'

export function AdminSubscriptionsPage() {
  const activeMrr = PLATFORM_FIRMS.filter((f) => f.status === 'active').reduce((s, f) => s + f.mrr, 0)
  const byPlan = (['Solo CPA', 'Firm', 'Enterprise'] as const).map((plan) => ({
    plan,
    count: PLATFORM_FIRMS.filter((f) => f.plan === plan && f.status === 'active').length,
    mrr: PLATFORM_FIRMS.filter((f) => f.plan === plan && f.status === 'active').reduce((s, f) => s + f.mrr, 0),
  }))

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">Subscriptions &amp; Billing</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">Revenue by plan and recent invoices.</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className="card-tile">
          <div className="text-xs tracking-wider text-slate-500 uppercase">Total MRR</div>
          <div className="mt-2 text-xl font-bold tabular-nums">{formatPeso(activeMrr)}</div>
        </div>
        {byPlan.map((p) => (
          <div className="card-tile" key={p.plan}>
            <div className="text-xs tracking-wider text-slate-500 uppercase">{p.plan}</div>
            <div className="mt-2 text-xl font-bold tabular-nums">{formatPeso(p.mrr)}</div>
            <div className="mt-1 text-xs text-slate-400">{p.count} active firm(s)</div>
          </div>
        ))}
      </div>

      <table className="kt-table mt-6">
        <thead>
          <tr><th>Invoice</th><th>Firm</th><th className="num">Amount</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {INVOICES.map((inv) => (
            <tr key={inv.id}>
              <td className="tabular-nums">{inv.id}</td>
              <td>{inv.firm}</td>
              <td className="num">{formatPeso(inv.amount)}</td>
              <td>
                <span className={`badge ${inv.status === 'paid' ? 'badge-revenue' : inv.status === 'pending' ? 'badge-expense' : 'badge-liability'}`}>
                  {inv.status}
                </span>
              </td>
              <td className="tabular-nums text-slate-500">{inv.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
