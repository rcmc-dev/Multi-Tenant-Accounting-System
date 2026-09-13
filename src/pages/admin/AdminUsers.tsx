import { useState } from 'react'
import { PLATFORM_USERS } from '../../data/platformData'

export function AdminUsersPage() {
  const [search, setSearch] = useState('')

  const visible = PLATFORM_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.firm.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <h1 className="m-0 text-2xl font-bold">Users</h1>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">Every user across all firms, incl. platform admins.</p>
      <input
        className="mb-4 w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-2 focus:outline-brand-600"
        placeholder="Search name, email, or firm…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="kt-table">
        <thead>
          <tr>
            <th>User</th><th>Role</th><th>Firm</th><th>Status</th><th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((u) => (
            <tr key={u.email}>
              <td>
                <div className="font-semibold">{u.name}</div>
                <div className="text-xs text-slate-500">{u.email}</div>
              </td>
              <td>
                <span className={`badge ${u.role === 'Platform Admin' ? 'badge-equity' : u.role === 'Firm Admin' ? 'badge-vatable' : 'badge-non-vat'}`}>
                  {u.role}
                </span>
              </td>
              <td>{u.firm}</td>
              <td>
                <span className={`badge ${u.status === 'active' ? 'badge-revenue' : u.status === 'invited' ? 'badge-expense' : 'badge-liability'}`}>
                  {u.status}
                </span>
              </td>
              <td className="tabular-nums text-slate-500">{u.lastActive}</td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-center text-slate-400">No users match “{search}”.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
