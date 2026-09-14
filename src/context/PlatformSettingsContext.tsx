import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type PlatformPlan = 'Solo CPA' | 'Firm' | 'Enterprise'

export interface PlatformSettings {
  platformName: string
  vatRate: string
  defaultPlan: PlatformPlan
  maintenanceMode: boolean
  allowNewSignups: boolean
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: 'KitaBooks',
  vatRate: '12',
  defaultPlan: 'Solo CPA',
  maintenanceMode: false,
  allowNewSignups: true,
}

const STORAGE_KEY = 'kitabooks.platform-settings'

function loadPlatformSettings(): PlatformSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw
      ? { ...DEFAULT_PLATFORM_SETTINGS, ...(JSON.parse(raw) as Partial<PlatformSettings>) }
      : DEFAULT_PLATFORM_SETTINGS
  } catch {
    return DEFAULT_PLATFORM_SETTINGS
  }
}

interface PlatformSettingsContextValue {
  settings: PlatformSettings
  updateSettings: (patch: Partial<PlatformSettings>) => void
}

const PlatformSettingsContext = createContext<PlatformSettingsContextValue | null>(null)

export function PlatformSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PlatformSettings>(loadPlatformSettings)

  // Rebrand the browser tab along with the app
  useEffect(() => {
    document.title = `${settings.platformName} — Multi-Tenant Accounting for Filipino Accountants`
  }, [settings.platformName])

  const updateSettings = useCallback((patch: Partial<PlatformSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* storage unavailable — the demo keeps working without persistence */
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ settings, updateSettings }),
    [settings, updateSettings],
  )

  return <PlatformSettingsContext.Provider value={value}>{children}</PlatformSettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlatformSettings(): PlatformSettingsContextValue {
  const ctx = useContext(PlatformSettingsContext)
  if (!ctx) throw new Error('usePlatformSettings must be used within PlatformSettingsProvider')
  return ctx
}