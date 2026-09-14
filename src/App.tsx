import { useState } from 'react'
import { TenantProvider, useTenant } from './context/TenantContext'
import { Brand } from './components/Brand'
import { NewClientModal } from './components/NewClientModal'
import { HomePage } from './pages/Home'
import { LoginPage } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { ChartOfAccountsPage } from './pages/ChartOfAccounts'
import { JournalEntriesPage } from './pages/JournalEntries'
import { SalesPage } from './pages/Sales'
import { PurchasesPage } from './pages/Purchases'
import { FinancialStatementsPage } from './pages/FinancialStatements'
import { AdminDashboardPage } from './pages/admin/AdminDashboard'
import { AdminFirmsPage } from './pages/admin/AdminFirms'
import { AdminUsersPage } from './pages/admin/AdminUsers'
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptions'
import { AdminAuditLogPage } from './pages/admin/AdminAuditLog'
import { AdminSettingsPage } from './pages/admin/AdminSettings'

type View = 'home' | 'login' | 'app' | 'superadmin'
type Page = 'dashboard' | 'accounts' | 'journal' | 'sales' | 'purchases' | 'statements'
type AdminPage = 'dashboard' | 'firms' | 'users' | 'subscriptions' | 'audit' | 'settings'

const CPA_NAV: { key: Page; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'journal', label: 'Journal Entries' },
  { key: 'sales', label: 'Sales' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'accounts', label: 'Chart of Accounts' },
  { key: 'statements', label: 'Financial Statements' },
]

const ADMIN_NAV: { key: AdminPage; label: string }[] = [
  { key: 'dashboard', label: 'Platform Dashboard' },
  { key: 'firms', label: 'Firms & Tenants' },
  { key: 'users', label: 'Users' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'audit', label: 'Audit Log' },
  { key: 'settings', label: 'System Settings' },
]

function Shell({ onHome, onLogout }: { onHome: () => void; onLogout: () => void }) {
  const { tenant, tenants, setTenantId, userName } = useTenant()
  const [page, setPage] = useState<Page>('dashboard')
  const [showNewClient, setShowNewClient] = useState(false)

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-6 bg-brand-900 p-5 text-slate-400">
        <button className="cursor-pointer text-left" onClick={onHome} title="Back to homepage">
          <Brand />
        </button>

        <label className="flex flex-col gap-1.5">
          <span className="text-[0.7rem] tracking-widest uppercase">Client (Tenant)</span>
          <select
            className="cursor-pointer rounded-lg border border-brand-800 bg-brand-800 px-3 py-2 text-sm text-white"
            value={tenant.id}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                // Keep the current client selected; the modal takes over from here
                e.target.value = tenant.id
                setShowNewClient(true)
                return
              }
              setTenantId(e.target.value)
            }}
          >
            <optgroup label="Clients">
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </optgroup>
            <option value="__new__">+ Add new client…</option>
          </select>
        </label>

        <nav className="flex flex-1 flex-col gap-1">
          {CPA_NAV.map((n) => (
            <button
              key={n.key}
              className={`cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition ${
                page === n.key
                  ? 'bg-brand-600 font-semibold text-white'
                  : 'hover:bg-brand-800 hover:text-white'
              }`}
              onClick={() => setPage(n.key)}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t border-brand-800 pt-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-bold text-brand-900">
            {userName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{userName}</div>
            <div className="text-[0.72rem]">Admin · CPA</div>
          </div>
        </div>
        <button
          className="cursor-pointer rounded-lg border border-brand-800 py-2 text-sm text-slate-400 transition hover:bg-brand-800 hover:text-white"
          onClick={onLogout}
        >
          Log out
        </button>
      </aside>
      <main className="flex-1 p-8">
        {page === 'dashboard' && <DashboardPage />}
        {page === 'journal' && <JournalEntriesPage />}
        {page === 'sales' && <SalesPage />}
        {page === 'purchases' && <PurchasesPage />}
        {page === 'accounts' && <ChartOfAccountsPage />}
        {page === 'statements' && <FinancialStatementsPage />}
      </main>

      {showNewClient && <NewClientModal onClose={() => setShowNewClient(false)} />}
    </div>
  )
}

function SuperAdminShell({ onHome, onLogout, userName }: { onHome: () => void; onLogout: () => void; userName: string }) {
  const [page, setPage] = useState<AdminPage>('dashboard')

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-6 bg-slate-900 p-5 text-slate-400">
        <div>
          <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-amber-400 text-xl font-bold text-slate-900">₱</span>
          <div className="mt-2 font-bold text-white">KitaBooks Platform</div>
          <div className="text-[0.7rem] tracking-widest uppercase">Super Admin Console</div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {ADMIN_NAV.map((n) => (
            <button
              key={n.key}
              className={`cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition ${
                page === n.key
                  ? 'bg-amber-400 font-semibold text-slate-900'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setPage(n.key)}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t border-slate-700 pt-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
            {userName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{userName}</div>
            <div className="text-[0.72rem]">Platform Admin</div>
          </div>
        </div>
        <button
          className="cursor-pointer rounded-lg border border-slate-700 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          onClick={onLogout}
        >
          Log out
        </button>
        <button className="cursor-pointer text-center text-xs text-slate-500 hover:text-slate-300" onClick={onHome}>
          ← kitabooks.ph homepage
        </button>
      </aside>
      <main className="flex-1 p-8">
        {page === 'dashboard' && <AdminDashboardPage />}
        {page === 'firms' && <AdminFirmsPage />}
        {page === 'users' && <AdminUsersPage />}
        {page === 'subscriptions' && <AdminSubscriptionsPage />}
        {page === 'audit' && <AdminAuditLogPage />}
        {page === 'settings' && <AdminSettingsPage />}
      </main>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [userName, setUserName] = useState<string | null>(null)

  if (view === 'home') {
    return <HomePage onLogin={() => setView('login')} onEnterApp={() => setView('app')} />
  }

  if (view === 'login') {
    return (
      <LoginPage
        onSuccess={(name, r) => {
          setUserName(name)
          setView(r === 'superadmin' ? 'superadmin' : 'app')
        }}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'superadmin') {
    return (
      <SuperAdminShell
        userName={userName ?? 'Ramon Dela Cruz'}
        onHome={() => setView('home')}
        onLogout={() => {
          setUserName(null)
          setView('home')
        }}
      />
    )
  }

  return (
    <TenantProvider userName={userName ?? 'Maria Santos, CPA'}>
      <Shell onHome={() => setView('home')} onLogout={() => { setUserName(null); setView('home') }} />
    </TenantProvider>
  )
}

