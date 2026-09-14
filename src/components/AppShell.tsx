import { useEffect, useState, type ReactNode } from 'react'

interface AppShellProps {
  /** Current page key — the mobile drawer auto-closes whenever it changes */
  activeKey: string
  /** Background class for the sidebar, e.g. bg-brand-900 or bg-slate-900 */
  asideClassName: string
  /** Compact content for the mobile top bar (logo/title) */
  topBar: ReactNode
  /** Full sidebar content (desktop layout is unchanged) */
  aside: ReactNode
  children: ReactNode
}

/**
 * Responsive app frame: static sidebar on desktop (md+), off-canvas drawer
 * behind a hamburger top bar on mobile.
 */
export function AppShell({ activeKey, asideClassName, topBar, aside, children }: AppShellProps) {
  const [open, setOpen] = useState(false)

  // Auto-close the drawer whenever the user navigates
  useEffect(() => {
    setOpen(false)
  }, [activeKey])

  // Close on Escape while the drawer is open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="flex min-h-screen">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col gap-6 overflow-y-auto p-5 text-slate-400 transition-transform duration-200 md:sticky md:inset-auto md:top-0 md:h-screen md:translate-x-0 ${asideClassName} ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {aside}
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar with hamburger */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <button
            className="cursor-pointer rounded-lg border border-gray-200 p-2 text-slate-700 transition hover:bg-slate-50"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          {topBar}
        </div>
        {children}
      </div>
    </div>
  )
}