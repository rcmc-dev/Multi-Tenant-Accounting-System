/** Platform-level (super admin) mock data — CPA firms, users, billing, audit trail */

export type FirmStatus = 'active' | 'trial' | 'suspended'

export interface PlatformFirm {
  id: string
  name: string
  owner: string
  plan: 'Solo CPA' | 'Firm' | 'Enterprise'
  tenants: number
  mrr: number
  status: FirmStatus
  joined: string
}

export interface PlatformUser {
  name: string
  email: string
  role: 'Firm Admin' | 'Accountant' | 'Viewer' | 'Platform Admin'
  firm: string
  status: 'active' | 'invited' | 'disabled'
  lastActive: string
}

export interface AuditEvent {
  ts: string
  actor: string
  action: string
  target: string
  severity: 'info' | 'warning' | 'critical'
}

export const PLATFORM_FIRMS: PlatformFirm[] = [
  { id: 'f1', name: 'Santos & Co. CPAs', owner: 'Maria Santos', plan: 'Firm', tenants: 14, mrr: 1499, status: 'active', joined: '2025-06-12' },
  { id: 'f2', name: 'Reyes Bookkeeping', owner: 'Juan Reyes', plan: 'Solo CPA', tenants: 6, mrr: 499, status: 'active', joined: '2025-08-03' },
  { id: 'f3', name: 'Makati Audit Partners', owner: 'Cristina Lim', plan: 'Enterprise', tenants: 31, mrr: 4999, status: 'active', joined: '2025-09-21' },
  { id: 'f4', name: 'Davao Ledger Works', owner: 'Paolo Mendoza', plan: 'Firm', tenants: 9, mrr: 1499, status: 'trial', joined: '2026-01-15' },
  { id: 'f5', name: 'Cebu Tax Pros', owner: 'Angela Villanueva', plan: 'Solo CPA', tenants: 4, mrr: 499, status: 'active', joined: '2025-11-30' },
  { id: 'f6', name: 'Iloilo Books & More', owner: 'Ruben Garcia', plan: 'Solo CPA', tenants: 2, mrr: 499, status: 'suspended', joined: '2025-07-18' },
]

export const PLATFORM_USERS: PlatformUser[] = [
  { name: 'Maria Santos', email: 'maria@santoscpa.ph', role: 'Firm Admin', firm: 'Santos & Co. CPAs', status: 'active', lastActive: '2026-03-01 09:14' },
  { name: 'Juan Reyes', email: 'juan@reyesbooks.ph', role: 'Firm Admin', firm: 'Reyes Bookkeeping', status: 'active', lastActive: '2026-02-28 17:42' },
  { name: 'Cristina Lim', email: 'cristina@makatiaudit.ph', role: 'Firm Admin', firm: 'Makati Audit Partners', status: 'active', lastActive: '2026-03-01 08:03' },
  { name: 'Jose Cruz', email: 'jose@santoscpa.ph', role: 'Accountant', firm: 'Santos & Co. CPAs', status: 'active', lastActive: '2026-02-27 11:20' },
  { name: 'Ana Ramos', email: 'ana@santoscpa.ph', role: 'Viewer', firm: 'Santos & Co. CPAs', status: 'invited', lastActive: '—' },
  { name: 'Paolo Mendoza', email: 'paolo@davaoledger.ph', role: 'Firm Admin', firm: 'Davao Ledger Works', status: 'active', lastActive: '2026-03-01 07:55' },
  { name: 'Angela Villanueva', email: 'angela@cebutaxpros.ph', role: 'Firm Admin', firm: 'Cebu Tax Pros', status: 'active', lastActive: '2026-02-26 15:31' },
  { name: 'Ruben Garcia', email: 'ruben@iloilobooks.ph', role: 'Firm Admin', firm: 'Iloilo Books & More', status: 'disabled', lastActive: '2026-01-09 10:12' },
  { name: 'Ramon Dela Cruz', email: 'superadmin@kitabooks.ph', role: 'Platform Admin', firm: 'KitaBooks', status: 'active', lastActive: '2026-03-01 09:30' },
]

export const AUDIT_EVENTS: AuditEvent[] = [
  { ts: '2026-03-01 09:31', actor: 'Ramon Dela Cruz', action: 'Signed in to platform admin', target: 'KitaBooks', severity: 'info' },
  { ts: '2026-03-01 08:12', actor: 'System', action: 'VAT summary generated for Q4 filing', target: 'Santos & Co. CPAs', severity: 'info' },
  { ts: '2026-02-28 19:05', actor: 'Ramon Dela Cruz', action: 'Suspended firm for failed payment', target: 'Iloilo Books & More', severity: 'warning' },
  { ts: '2026-02-28 11:47', actor: 'Maria Santos', action: 'Posted journal entry JV-008', target: 'Manila Traders Corp.', severity: 'info' },
  { ts: '2026-02-27 22:03', actor: 'System', action: '3 failed sign-in attempts detected', target: 'ruben@iloilobooks.ph', severity: 'critical' },
  { ts: '2026-02-27 09:15', actor: 'Cristina Lim', action: 'Invited user ana@santoscpa.ph', target: 'Santos & Co. CPAs', severity: 'info' },
  { ts: '2026-02-26 16:40', actor: 'Ramon Dela Cruz', action: 'Changed plan Enterprise → Firm', target: 'Davao Ledger Works', severity: 'warning' },
]

export const MONTHLY_REVENUE = [82, 94, 101, 118, 126, 139, 151, 163, 171, 178, 182, 185]

export const INVOICES = [
  { id: 'INV-2026-0214', firm: 'Makati Audit Partners', amount: 4999, status: 'paid', date: '2026-03-01' },
  { id: 'INV-2026-0213', firm: 'Santos & Co. CPAs', amount: 1499, status: 'paid', date: '2026-02-28' },
  { id: 'INV-2026-0212', firm: 'Reyes Bookkeeping', amount: 499, status: 'paid', date: '2026-02-27' },
  { id: 'INV-2026-0211', firm: 'Davao Ledger Works', amount: 1499, status: 'pending', date: '2026-02-25' },
  { id: 'INV-2026-0210', firm: 'Iloilo Books & More', amount: 499, status: 'failed', date: '2026-02-20' },
]
