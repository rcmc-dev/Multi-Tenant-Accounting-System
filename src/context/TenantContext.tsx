import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { JournalEntry, Purchase, Sale, Tenant } from '../types'
import { JOURNAL_ENTRIES, DEMO_TENANTS } from '../data/journalEntries'
import { SALES, PURCHASES } from '../data/salesPurchases'
import { saleToEntry, purchaseToEntry } from '../lib/postings'

interface TenantContextValue {
  tenant: Tenant
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
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function TenantProvider({ children, userName }: { children: ReactNode; userName: string }) {
  const [tenantId, setTenantId] = useState(DEMO_TENANTS[0].id)
  const [allEntries, setAllEntries] = useState<Record<string, JournalEntry[]>>(JOURNAL_ENTRIES)
  const [allSales, setAllSales] = useState<Record<string, Sale[]>>(SALES)
  const [allPurchases, setAllPurchases] = useState<Record<string, Purchase[]>>(PURCHASES)

  const tenant = DEMO_TENANTS.find((t) => t.id === tenantId) ?? DEMO_TENANTS[0]

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
        [tenantId]: [...(prev[tenantId] ?? []), saleToEntry(sale, tenant.logoInitials)],
      }))
    },
    [tenantId, tenant.logoInitials],
  )

  const addPurchase = useCallback(
    (purchase: Purchase) => {
      setAllPurchases((prev) => ({
        ...prev,
        [tenantId]: [...(prev[tenantId] ?? []), purchase],
      }))
      setAllEntries((prev) => ({
        ...prev,
        [tenantId]: [...(prev[tenantId] ?? []), purchaseToEntry(purchase, tenant.logoInitials)],
      }))
    },
    [tenantId, tenant.logoInitials],
  )

  const value = useMemo<TenantContextValue>(
    () => ({
      tenant,
      tenants: DEMO_TENANTS,
      entries: allEntries[tenantId] ?? [],
      sales: allSales[tenantId] ?? [],
      purchases: allPurchases[tenantId] ?? [],
      userName,
      setTenantId,
      addEntry,
      addSale,
      addPurchase,
    }),
    [tenant, allEntries, allSales, allPurchases, tenantId, userName, addEntry, addSale, addPurchase],
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}
