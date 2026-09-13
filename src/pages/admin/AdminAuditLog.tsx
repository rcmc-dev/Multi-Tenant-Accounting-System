import { useState } from 'react'
import { AUDIT_EVENTS } from '../../data/platformData'

export function AdminAuditLogPage() {
  const [severity, setSeverity] = useState<'all' | 'info' | 'warning' | 'critical'>('all')

  const visible = AUDIT_EVENTS.filter((e) => severity === 'all' || e.severity === severity)

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">Audit Log</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">Platform-wide activity trail — who did what, where.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'info', 'warning', 'critical'] as const).map((s) => (
          <button
            key={s}
            className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm capitalize transition ${
              severity === s
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-gray-200 bg-white text-slate-700 hover:border-brand-600'
            }`}
            onClick={() => setSeverity(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <table className="kt-table">
        <thead>
          <tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Target</th><th>Severity</th></tr>
        </thead>
        <tbody>
          {visible.map((ev, i) => (
            <tr key={i}>
              <td className="tabular-nums text-slate-500">{ev.ts}</td>
              <td className="font-semibold">{ev.actor}</td>
              <td>{ev.action}</td>
              <td className="text-slate-500">{ev.target}</td>
              <td>
                <span className={`badge ${ev.severity === 'critical' ? 'badge-liability' : ev.severity === 'warning' ? 'badge-expense' : 'badge-vatable'}`}>
                  {ev.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
