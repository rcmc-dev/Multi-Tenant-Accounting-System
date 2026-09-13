import { AUDIT_EVENTS, MONTHLY_REVENUE, PLATFORM_FIRMS } from '../../data/platformData'
import { formatPeso } from '../../lib/accounting'

export function AdminDashboardPage() {
  const totalMrr = PLATFORM_FIRMS.filter((f) => f.status === 'active').reduce((s, f) => s + f.mrr, 0)
  const activeFirms = PLATFORM_FIRMS.filter((f) => f.status === 'active').length
  const trialFirms = PLATFORM_FIRMS.filter((f) => f.status === 'trial').length

  const stats = [
    { label: 'Monthly Recurring Revenue', value: formatPeso(totalMrr), sub: '+3.4% vs last month' },
    { label: 'Active Firms', value: String(activeFirms), sub: `${trialFirms} on trial` },
    { label: 'Platform Users', value: '1,542', sub: 'across all firms' },
    { label: 'Client Books (Tenants)', value: '66', sub: 'all firms combined' },
  ]

  const maxRev = Math.max(...MONTHLY_REVENUE)

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">Platform Dashboard</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">KitaBooks platform overview · March 2026</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {stats.map((s) => (
          <div className="card-tile" key={s.label}>
            <div className="text-xs tracking-wider text-slate-500 uppercase">{s.label}</div>
            <div className="mt-2 text-xl font-bold tabular-nums">{s.value}</div>
            <div className="mt-1 text-xs text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card-tile">
          <div className="mb-4 text-xs tracking-wider text-slate-500 uppercase">Revenue Growth (₱k / month)</div>
          <div className="flex h-40 items-end gap-1.5">
            {MONTHLY_REVENUE.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${i === MONTHLY_REVENUE.length - 1 ? 'bg-brand-600' : 'bg-brand-100'}`}
                  style={{ height: `${(v / maxRev) * 100}%` }}
                  title={`₱${v}k`}
                />
                <span className="text-[0.6rem] text-slate-400">{['A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F', 'M'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-tile">
          <div className="mb-4 text-xs tracking-wider text-slate-500 uppercase">Recent Firm Signups</div>
          {PLATFORM_FIRMS.slice(0, 4).map((f) => (
            <div key={f.id} className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-b-0">
              <div>
                <div className="text-sm font-semibold">{f.name}</div>
                <div className="text-xs text-slate-500">{f.owner} · {f.plan}</div>
              </div>
              <span className={`badge ${f.status === 'active' ? 'badge-revenue' : f.status === 'trial' ? 'badge-expense' : 'badge-liability'}`}>
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-tile mt-6">
        <div className="mb-3 text-xs tracking-wider text-slate-500 uppercase">Latest Platform Activity</div>
        {AUDIT_EVENTS.slice(0, 4).map((ev, i) => (
          <div key={i} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0">
            <div className="text-sm">
              <span className="font-semibold">{ev.actor}</span> — {ev.action} · <span className="text-slate-500">{ev.target}</span>
            </div>
            <span className={`badge ${ev.severity === 'critical' ? 'badge-liability' : ev.severity === 'warning' ? 'badge-expense' : 'badge-vatable'}`}>
              {ev.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
