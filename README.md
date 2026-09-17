# KitaBooks — Multi-Tenant Accounting for Filipino Accountants

A multi-tenant accounting suite for Philippine accountants (CPAs managing books
for multiple clients), built with React 19 + TypeScript + Vite and backed by
Supabase (Postgres + Auth).

## Features (Supabase auth + Postgres; book data still in-browser)

- **Multi-tenant shell** — switch between client companies (books) with all
  data scoped per tenant.
- **Client onboarding & editing** — add new clients with a guided form
  (name, industry, TIN with auto-formatting, BIR RDO code, VAT registration,
  fiscal year) via **Client Settings**; re-edit any client's details anytime.
  Clients you create persist in `localStorage`; new clients start with fresh,
  empty books.
- **Super Admin Console** — platform dashboard (firms, users, subscriptions,
  billing, audit log) plus a functional **System Settings** page:
  - **Platform Name** rebrands the whole app live (sidebar, homepage, login,
    admin console, browser tab title).
  - **Maintenance Mode** locks the login page and CPA app behind a branded
    maintenance screen (admin console stays reachable).
  - **Allow New Firm Signups** pauses public registration with a notice on
    the login page.
  - **Default Plan for New Firms** is highlighted on the public pricing
    section.
  Settings persist per browser (`localStorage`) until the backend arrives.
- **Responsive layout** — static sidebar on desktop; on mobile the sidebar
  becomes a slide-in drawer behind a hamburger top bar (CPA app and admin
  console alike).
- **PH-standard Chart of Accounts** — includes BIR-specific accounts
  (Output/Input VAT, 1601C/1604E withholding taxes payable).
- **Journal Entries** — post balanced double-entry transactions with VAT type
  tagging (vatable / vat-exempt / zero-rated / non-VAT).
- **Sales & Purchases** — record client invoices and supplier bills with
  EWT and VAT handling; entries auto-post to the journal.
- **Financial Statements** — Trial Balance, Income Statement, Balance Sheet,
  and a **VAT Summary mapped to BIR Form 2550M/Q** (output VAT less input VAT).
- **Peso formatting** — `en-PH` Intl currency formatting throughout.
- Tenant metadata includes TIN, RDO code, VAT registration, fiscal year.

## Accounts & sign-in

Auth runs on **Supabase** (email/password) whenever `.env.local` is configured,
and falls back to an offline mock when it isn't.

- **CPA / Bookkeeper** — self-service: on the login page choose
  *Create an account*, enter a name, email and password. The app auto-creates
  the matching `profiles` row with the `cpa` role on first sign-in.
- **Platform admin (Super Admin)** — sign in with the admin email configured in
  `src/lib/auth.ts`; its profile is auto-promoted to the `superadmin` role.
- Sessions are persisted by Supabase and restored on page reload.

## Fresh start (no seeded data)

The app boots with **empty books everywhere** — no demo tenants, entries, sales,
purchases, firms or audit events. Sign up, then use **Client Settings →
Add New Client** (or the *Add Your First Client* prompt) and start recording
real transactions.

## Run

```bash
npm install
npm run dev
```

### Supabase (database + auth)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the dashboard's **SQL Editor** (creates all
   tables, helper functions, RLS policies — no seed data).
3. Copy `.env.example` to `.env.local` and fill in the **Project URL** and
   **anon public key** (Project Settings → API). `.env.local` is gitignored.
4. Restart the dev server so Vite picks up the new env vars.

Without step 3 the app still runs, but auth falls back to an offline mock and
nothing reaches the database.

### Platform admin user

Create `rcmctaxconsultancy@gmail.com` under **Authentication → Users →
Add user** with *Auto Confirm* enabled. On first sign-in the app creates its
`profiles` row with the `superadmin` role automatically.

## Roadmap (next steps)

- **Move book data to Supabase** — tenants, journal entries/lines, sales and
  purchases currently live in React state + `localStorage`; migrate reads and
  writes to the Postgres tables already defined in `supabase/schema.sql`
- **Move platform settings to the DB** — so rebranding, maintenance mode and
  signup flags apply to every user, not just the current browser
- Firm management — CPA firms and staff membership (signups currently join a
  placeholder firm)
- Wire the Standard VAT Rate setting into VAT computations and BIR form output
- Archive/remove clients from Client Settings
- BIR form generation (2550M/Q, 1601C, 1604E, 2307)
- eBIR/EFPS-ready exports, BIR CAS compliance checklist
- Books closing / period locking, audit trail
