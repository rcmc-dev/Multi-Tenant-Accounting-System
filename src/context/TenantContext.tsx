import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { JournalEntry, Tenant } from '../types'
import { JOURNAL_ENTRIES, DEMO_TENANTS } from '../data/journalEntries'

interface TenantContextValue {
  tenant: Tenant
  tenants: Tenant[]
  entries: JournalEntry[]
  userName: string
  setTenantId: (id: string) => void
  addEntry: (entry: JournalEntry) => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function TenantProvider({ children, userName }: { children: ReactNode; userName: string }) {
  const [tenantId, setTenantId] = useState(DEMO_TENANTS[0].id)
  const [allEntries, setAllEntries] = useState<Record<string, JournalEntry[]>>(JOURNAL_ENTRIES)

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

  const value = useMemo<TenantContextValue>(
    () => ({
      tenant,
      tenants: DEMO_TENANTS,
      entries: allEntries[tenantId] ?? [],
      userName,
      setTenantId,
      addEntry,
    }),
    [tenant, allEntries, tenantId, addEntry, userName],
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}
