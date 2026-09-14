# KitaBooks — Multi-Tenant Accounting for Filipino Accountants

A front-end starter for a multi-tenant accounting suite built for Philippine
accountants (CPAs managing books for multiple clients). Built with
React 19 + TypeScript + Vite.

## Features (front-end demo, mock data — no backend yet)

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

## Demo access

- **CPA app:** any email/password on the login screen signs you in as
  `Maria Santos, CPA` (mock auth).
- **Super Admin:** use the temporary credentials shown on the login page
  (`superadmin@kitabooks.ph`).

## Mock tenants

| Tenant | Industry | VAT |
|---|---|---|
| Manila Traders Corp. | Wholesale Trading | VAT (RDO 047) |
| Cebu Consulting Services | Professional Services | VAT (RDO 085) |
| Davao Delight Bakeshop | Food & Retail | Non-VAT (RDO 111) |

## Run

```bash
npm install
npm run dev
```

## Roadmap (next steps)

- Backend with per-tenant data isolation (e.g. Supabase RLS or schema-per-tenant)
  — moves platform settings, custom clients, and books from `localStorage`
  to real cross-device persistence
- Auth (CPA firm users ↔ client tenant memberships) — replaces the mock login
- Wire the Standard VAT Rate setting into VAT computations and BIR form output
- Archive/remove clients from Client Settings
- BIR form generation (2550M/Q, 1601C, 1604E, 2307)
- eBIR/EFPS-ready exports, BIR CAS compliance checklist
- Books closing / period locking, audit trail
