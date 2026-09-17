/**
 * Platform-level (super admin) data: firms, users, billing, audit trail.
 * Starts empty on purpose (fresh platform) - real data arrives when the
 * admin console is wired to Supabase.
 */

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

export const PLATFORM_FIRMS: PlatformFirm[] = []

export const PLATFORM_USERS: PlatformUser[] = []

export const AUDIT_EVENTS: AuditEvent[] = []

export const MONTHLY_REVENUE: number[] = []

export interface PlatformInvoice {
  id: string
  firm: string
  amount: number
  status: string
  date: string
}

export const INVOICES: PlatformInvoice[] = []
