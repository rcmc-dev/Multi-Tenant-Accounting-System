import { useState } from 'react'
import { PLATFORM_FIRMS, type PlatformFirm } from '../../data/platformData'
import { formatPeso } from '../../lib/accounting'

export function AdminFirmsPage() {
  const [firms, setFirms] = useState<PlatformFirm[]>(PLATFORM_FIRMS)

  const toggleStatus = (id: string) =>
    setFirms((fs) =>
      fs.map((f) =>
        f.id === id ? { ...f, status: f.status === 'suspended' ? 'active' : 'suspended' } : f,
      ),
    )

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">Firms &amp; Tenants</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">
        All CPA firms on the platform. Each firm owns multiple client books (tenants).
      </p>
      <table className="kt-table">
        <thead>
          <tr>
            <th>Firm</th><th>Plan</th><th className="num">Tenants</th><th className="num">MRR</th>
            <th>Status</th><th>Joined</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {firms.map((f) => (
            <tr key={f.id}>
              <td>
                <div className="font-semibold">{f.name}</div>
                <div className="text-xs text-slate-500">{f.owner}</div>
              </td>
              <td>{f.plan}</td>
              <td className="num">{f.tenants}</td>
              <td className="num">{formatPeso(f.mrr)}</td>
              <td>
                <span className={`badge ${f.status === 'active' ? 'badge-revenue' : f.status === 'trial' ? 'badge-expense' : 'badge-liability'}`}>
                  {f.status}
                </span>
              </td>
              <td className="tabular-nums text-slate-500">{f.joined}</td>
              <td>
                <button
                  className="cursor-pointer rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium hover:border-brand-600 hover:text-brand-600"
                  onClick={() => toggleStatus(f.id)}
                >
                  {f.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
