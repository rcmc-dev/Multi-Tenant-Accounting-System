import { Brand } from '../components/Brand'
import { SupportChat } from '../components/SupportChat'
import { usePlatformSettings } from '../context/PlatformSettingsContext'

export function HomePage({ onLogin }: { onLogin: () => void }) {
  const { settings } = usePlatformSettings()

  return (
    <div className="bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center gap-8 border-b border-gray-200 bg-white/90 px-[4vw] py-4 backdrop-blur">
        <Brand nameCls="text-slate-800" />
        <nav className="hidden flex-1 justify-center gap-6 md:flex">
          {[
            ['#features', 'Features'],
            ['#compliance', 'BIR Compliance'],
            ['#pricing', 'Pricing'],
            ['#faq', 'FAQ'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="text-sm font-medium text-slate-500 hover:text-brand-600">
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex gap-2.5 md:ml-0">
          <button className="btn-primary" onClick={onLogin}>Log in</button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white px-[4vw] pt-24 pb-16 text-center">
        <span className="inline-block rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-bold tracking-wider text-brand-600 uppercase">
          Built for Filipino CPAs &amp; bookkeepers
        </span>
        <h1 className="mx-auto mt-5 max-w-4xl text-3xl leading-tight font-extrabold sm:text-5xl">
          Manage all your clients' books <em className="text-brand-600 not-italic">in one place</em> —<br />
          BIR-compliant, peso-perfect.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-500">
          {settings.platformName} is the multi-tenant accounting platform for Philippine practitioners.
          Handle VAT, withholding taxes, and BIR forms across every client you serve —
          without switching spreadsheets.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="btn-primary btn-lg" onClick={onLogin}>Try the Live Demo — Log In →</button>
          <a className="btn-ghost btn-lg" href="#features">See Features</a>
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-12">
          {[
            ['₱1.2B+', 'books managed'],
            ['500+', 'CPA firms'],
            ['2550Q', 'VAT-ready'],
            ['100%', 'Peso & en-PH'],
          ].map(([stat, label]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <strong className="text-2xl text-slate-800">{stat}</strong>
              <span className="text-xs tracking-wider text-slate-500 uppercase">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-[4vw] pt-20 text-center">
        <h2 className="m-0 text-3xl font-bold">Everything a practicing accountant needs</h2>
        <p className="mt-2.5 mb-10 text-slate-500">Purpose-built features, not a foreign product translated to pesos.</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 text-left">
          {[
            ['🏢', 'Multi-Tenant Client Books', 'Switch between client companies instantly. Each tenant\'s books, entries, and statements stay fully isolated — one login, all your clients.'],
            ['📊', 'Double-Entry Journal', 'Post balanced journal entries with live debit/credit validation. Entries won\'t save unless they balance — clean books, guaranteed.'],
            ['🧾', 'VAT & Withholding Aware', 'Tag entries as vatable, VAT-exempt, zero-rated, or non-VAT. Input VAT, Output VAT, and 1601C/1604E withholding accounts built in.'],
            ['📈', 'One-Click Statements', 'Trial balance, income statement, and balance sheet generated from the ledger in real time — no more month-end spreadsheet gymnastics.'],
            ['🏛️', 'BIR 2550 VAT Summary', 'Net VAT payable computed per BIR Form 2550M/2550Q logic, with due-date reminders for EFPS/eBIR filing.'],
            ['👥', 'Role-Based Team Access', 'Admin, Accountant, and Viewer roles per client — let your staff and clients see exactly what they should. (Coming soon)'],
            ['➕', 'Client Onboarding & Settings', 'Add a new client in seconds — name, TIN, RDO code, VAT type, fiscal year — and re-edit their registration details anytime from Client Settings. New clients start with fresh books.'],
            ['⚙️', 'Super Admin Control Center', 'Firms, users, subscriptions, invoices, and audit trail in one console — with system settings that rebrand the platform and toggle maintenance or signups instantly.'],
            ['📱', 'Works on Any Device', 'Full experience on desktop, tap-friendly on mobile — the sidebar collapses into a hamburger drawer so your books travel with you.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="text-2xl">{icon}</div>
              <h3 className="mt-3 mb-1.5 text-lg font-semibold">{title}</h3>
              <p className="m-0 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance strip */}
      <section id="compliance" className="mt-16 bg-brand-900 px-[4vw] py-14 text-center text-white">
        <h2 className="m-0 text-3xl font-bold">Philippine compliance, covered</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            'BIR Form 2550M/Q', '1601C · 1604E', 'BIR CAS-ready',
            'TRAIN Law 12% VAT', 'RDO & TIN profiles', 'eBIR/EFPS exports*',
          ].map((b) => (
            <span key={b} className="rounded-full border border-brand-800 bg-brand-800 px-4 py-2 text-sm font-semibold">
              {b}
            </span>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-400">*Export generation on the roadmap — data model is BIR-ready today.</p>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-[4vw] pt-20 text-center">
        <h2 className="m-0 text-3xl font-bold">Simple pricing per firm</h2>
        <p className="mt-2.5 mb-10 text-slate-500">All plans include unlimited client tenants during beta.</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 text-left">
          {[
            { name: 'Solo CPA', price: '₱499', tag: null, featured: false, perks: ['Up to 10 client books', 'Full journal & statements', 'VAT summary', 'Email support'] },
            { name: 'Firm', price: '₱1,499', tag: 'Most popular', featured: true, perks: ['Unlimited client books', 'Role-based team access', 'BIR form mapping', 'Priority support'] },
            { name: 'Enterprise', price: 'Custom', tag: null, featured: false, perks: ['Multi-branch firms', 'Audit trail & period locking', 'API access', 'Dedicated onboarding'] },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border bg-white p-7 ${
                p.featured ? 'border-brand-600 shadow-[0_10px_30px_rgba(26,95,180,0.15)]' : 'border-gray-200'
              }`}
            >
              {p.tag && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand-900">
                  {p.tag}
                </span>
              )}
              {p.name === settings.defaultPlan && (
                <span className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                  Default for new firms
                </span>
              )}
              <h3 className="m-0 text-sm font-medium text-slate-500">{p.name}</h3>
              <div className="mt-2 mb-4 text-4xl font-extrabold">
                {p.price}
                {p.price !== 'Custom' && <span className="text-sm font-normal text-slate-500">/mo</span>}
              </div>
              <ul className="m-0 list-disc pl-5 text-sm leading-8 text-slate-500">
                {p.perks.map((perk) => <li key={perk}>{perk}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-[4vw] pt-20 text-center">
        <h2 className="m-0 text-3xl font-bold">Frequently asked</h2>
        <div className="mx-auto mt-8 max-w-2xl text-left">
          {[
            ['Is this a real accounting system?', 'This is a front-end starter with demo data — the double-entry engine, statements, and VAT logic are real and working. Backend persistence and auth are the next milestone.'],
            ['Does it handle both VAT and non-VAT clients?', 'Yes. Each tenant is configured as VAT-registered or non-VAT, and journal entries are tagged accordingly — just like handling mixed clients in practice.'],
            ['Can my staff access only specific clients?', 'Role-based per-tenant access is planned. The data model already separates users, tenants, and memberships to support it.'],
            ['Will it generate BIR forms?', '2550M/Q VAT summaries are computed today. Full form generation (1601C, 1604E, 2307) with eBIR-ready exports is on the roadmap.'],
          ].map(([q, a]) => (
            <details key={q} className="mb-3 rounded-xl border border-gray-200 bg-white px-5 py-4">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-3 mb-0 text-sm leading-relaxed text-slate-500">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 bg-brand-50 px-[4vw] py-18 text-center">
        <h2 className="m-0 text-3xl font-bold">Ready to modernize your practice?</h2>
        <p className="mt-2.5 mb-6 text-slate-500">Three demo client books and a fully working ledger — one tap away on the login screen.</p>
        <button className="btn-primary btn-lg" onClick={onLogin}>Try the Demo — Log In →</button>
      </section>

      <footer className="border-t border-gray-200 px-[4vw] py-10 text-center">
        <div className="flex justify-center"><Brand nameCls="text-slate-800" /></div>
        <p className="mt-4 text-xs text-slate-500">
          © 2026 {settings.platformName} · Made for Filipino accountants 🇵🇭 · Demo build — not yet BIR-accredited software.
        </p>
      </footer>

      <SupportChat />
    </div>
  )
}

