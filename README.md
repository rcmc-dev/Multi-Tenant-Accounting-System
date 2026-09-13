# KitaBooks — Multi-Tenant Accounting for Filipino Accountants

A front-end starter for a multi-tenant accounting suite built for Philippine
accountants (CPAs managing books for multiple clients). Built with
React 19 + TypeScript + Vite.

## Features (starter, mock data — no backend yet)

- **Multi-tenant shell** — switch between client companies (books) with all
  data scoped per tenant.
- **PH-standard Chart of Accounts** — includes BIR-specific accounts
  (Output/Input VAT, 1601C/1604E withholding taxes payable).
- **Journal Entries** — post balanced double-entry transactions with VAT type
  tagging (vatable / vat-exempt / zero-rated / non-VAT).
- **Financial Statements** — Trial Balance, Income Statement, Balance Sheet,
  and a **VAT Summary mapped to BIR Form 2550M/Q** (output VAT less input VAT).
- **Peso formatting** — `en-PH` Intl currency formatting throughout.
- Tenant metadata includes TIN, RDO code, VAT registration, fiscal year.

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
- Auth (CPA firm users ↔ client tenant memberships)
- BIR form generation (2550M/Q, 1601C, 1604E, 2307)
- eBIR/EFPS-ready exports, BIR CAS compliance checklist
- Books closing / period locking, audit trail
