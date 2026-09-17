import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { JournalEntry, NewTenantInput, Purchase, Sale, Tenant } from '../types'
import { JOURNAL_ENTRIES, DEMO_TENANTS } from '../data/journalEntries'
import { SALES, PURCHASES } from '../data/salesPurchases'
import { saleToEntry, purchaseToEntry } from '../lib/postings'

interface TenantContextValue {
  tenant: Tenant | null
  tenants: Tenant[]
  entries: JournalEntry[]
  sales: Sale[]
  purchases: Purchase[]
  userName: string
  setTenantId: (id: string) => void
  addEntry: (entry: JournalEntry) => void
  /** Records a sale AND auto-posts its journal entry */
  addSale: (sale: Sale) => void
  /** Records a purchase AND auto-posts its journal entry */
  addPurchase: (purchase: Purchase) => void
  /** Creates a new client (tenant) with empty books, persists it, and switches to it */
  addTenant: (input: NewTenantInput) => Tenant
  /** Updates an existing client's registration details (name, TIN, RDO, VAT, fiscal year) */
  updateTenant: (id: string, input: NewTenantInput) => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

const CUSTOM_TENANTS_KEY = 'kitabooks.custom-tenants.v2'

/** Clients created in-app persist across reloads (demo-grade, localStorage) */
function loadCustomTenants(): Tenant[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TENANTS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as Tenant[]) : []
  } catch {
    return []
  }
}

function saveCustomTenants(custom: Tenant[]) {
  try {
    localStorage.setItem(CUSTOM_TENANTS_KEY, JSON.stringify(custom))
  } catch {
    /* storage unavailable — the demo keeps working without persistence */
  }
}

/** Stores only in-app created clients (built-in demo clients stay untouched on disk) */
function persistTenants(list: Tenant[]) {
  saveCustomTenants(list.filter((t) => !DEMO_TENANTS.some((d) => d.id === t.id)))
}

const initialsFromName = (name: string) =>
  (name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2) || 'CL').toUpperCase()

const slugFromName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'client'

export function TenantProvider({ children, userName }: { children: ReactNode; userName: string }) {
  // Fresh start: empty workspace; tenants are created in-app (Supabase-backed in Step 3)
  const [tenantId, setTenantId] = useState('')
  const [tenants, setTenants] = useState<Tenant[]>(() => [...DEMO_TENANTS, ...loadCustomTenants()])
  const [allEntries, setAllEntries] = useState<Record<string, JournalEntry[]>>(JOURNAL_ENTRIES)
  const [allSales, setAllSales] = useState<Record<string, Sale[]>>(SALES)
  const [allPurchases, setAllPurchases] = useState<Record<string, Purchase[]>>(PURCHASES)

  const tenant = tenants.find((t) => t.id === tenantId) ?? null

  // Auto-select the first tenant once any exist (fresh workspaces start with none)
  useEffect(() => {
    if (tenants.length > 0 && !tenants.some((t) => t.id === tenantId)) {
      setTenantId(tenants[0].id)
    }
  }, [tenants, tenantId])

  const addEntry = useCallback(
    (entry: JournalEntry) => {
      setAllEntries((prev) => ({
        ...prev,
        [tenantId]: [...(prev[tenantId] ?? []), entry],
      }))
    },
    [tenantId],
  )

  const addSale = useCallback(
    (sale: Sale) => {
      setAllSales((prev) => ({
        ...prev,
        [tenantId]: [...(prev[tenantId] ?? []), sale],
      }))
      setAllEntries((prev) => ({
        ...prev,
        [tenantId]: [...(prev[tenantId] ?? []), saleToEntry(sale, tenant?.logoInitials ?? 'CL')],
      }))
    },
    [tenantId, tenant?.logoInitials],
  )

  const addPurchase = useCallback(
    (purchase: Purchase) => {
      setAllPurchases((prev) => ({
        ...prev,
        [tenantId]: [...(prev[tenantId] ?? []), purchase],
      }))
      setAllEntries((prev) => ({
        ...prev,
        [tenantId]: [...(prev[tenantId] ?? []), purchaseToEntry(purchase, tenant?.logoInitials ?? 'CL')],
      }))
    },
    [tenantId, tenant?.logoInitials],
  )

  const addTenant = useCallback((input: NewTenantInput): Tenant => {
    const name = input.name.trim()
    const newTenant: Tenant = {
      id: `${slugFromName(name)}-${Date.now()}`,
      name,
      industry: input.industry.trim() || 'General Services',
      rdoCode: input.rdoCode.trim(),
      tin: input.tin.trim(),
      vatType: input.vatType,
      fiscalYearStart: input.fiscalYearStart,
      logoInitials: initialsFromName(name),
    }
    setTenants((prev) => {
      const next = [...prev, newTenant]
      persistTenants(next)
      return next
    })
    // Fresh, empty books for the new client
    setAllEntries((prev) => ({ ...prev, [newTenant.id]: [] }))
    setAllSales((prev) => ({ ...prev, [newTenant.id]: [] }))
    setAllPurchases((prev) => ({ ...prev, [newTenant.id]: [] }))
    setTenantId(newTenant.id)
    return newTenant
  }, [])

  const updateTenant = useCallback((id: string, input: NewTenantInput) => {
    setTenants((prev) => {
      // Keep the id stable so this client's books/sales/purchases stay attached
      const next = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              name: input.name.trim(),
              industry: input.industry.trim() || t.industry,
              rdoCode: input.rdoCode.trim(),
              tin: input.tin.trim(),
              vatType: input.vatType,
              fiscalYearStart: input.fiscalYearStart,
              logoInitials: initialsFromName(input.name),
            }
          : t,
      )
      persistTenants(next)
      return next
    })
  }, [])

  const value = useMemo<TenantContextValue>(
    () => ({
      tenant,
      tenants,
      entries: allEntries[tenantId] ?? [],
      sales: allSales[tenantId] ?? [],
      purchases: allPurchases[tenantId] ?? [],
      userName,
      setTenantId,
      addEntry,
      addSale,
      addPurchase,
      addTenant,
      updateTenant,
    }),
    [tenant, tenants, allEntries, allSales, allPurchases, tenantId, userName, addEntry, addSale, addPurchase, addTenant, updateTenant],
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}
