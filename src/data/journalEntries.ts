import type { JournalEntry, Tenant, TenantUser } from '../types'

export const DEMO_TENANTS: Tenant[] = [
  {
    id: 'manila-traders',
    name: 'Manila Traders Corp.',
    industry: 'Wholesale Trading',
    rdoCode: '047',
    tin: '008-345-678-000',
    vatType: 'vatable',
    fiscalYearStart: '2026-01-01',
    logoInitials: 'MT',
  },
  {
    id: 'cebu-consulting',
    name: 'Cebu Consulting Services',
    industry: 'Professional Services',
    rdoCode: '085',
    tin: '009-123-456-000',
    vatType: 'vatable',
    fiscalYearStart: '2026-01-01',
    logoInitials: 'CC',
  },
  {
    id: 'davao-bakeshop',
    name: 'Davao Delight Bakeshop',
    industry: 'Food & Retail',
    rdoCode: '111',
    tin: '010-567-890-000',
    vatType: 'non-vat',
    fiscalYearStart: '2026-04-01',
    logoInitials: 'DD',
  },
]

export const DEMO_USER: TenantUser = {
  name: 'Maria Santos, CPA',
  role: 'Admin',
  email: 'maria@santoscpa.ph',
}

const e = (
  id: string,
  date: string,
  reference: string,
  description: string,
  lines: JournalEntry['lines'],
  vatType: JournalEntry['vatType'] = 'vatable',
): JournalEntry => ({ id, date, reference, description, lines, vatType, posted: true })

const MANILA_ENTRIES: JournalEntry[] = [
  e('MT-001', '2026-01-05', 'JV-001', 'Owner initial investment', [
    { accountCode: '1000', debit: 1_000_000, credit: 0 },
    { accountCode: '3000', debit: 0, credit: 1_000_000 },
  ], 'non-vat'),
  e('MT-002', '2026-01-10', 'JV-002', 'Purchased inventory on credit', [
    { accountCode: '1200', debit: 500_000, credit: 0 },
    { accountCode: '1150', debit: 60_000, credit: 0 },
    { accountCode: '2000', debit: 0, credit: 560_000 },
  ], 'vatable'),
  e('MT-003', '2026-01-20', 'SI-0001', 'Sold goods to customer (BIR SI)', [
    { accountCode: '1100', debit: 336_000, credit: 0 },
    { accountCode: '4000', debit: 0, credit: 300_000 },
    { accountCode: '2300', debit: 0, credit: 36_000 },
  ], 'vatable'),
  e('MT-004', '2026-01-25', 'JV-003', 'Collected receivable', [
    { accountCode: '1000', debit: 336_000, credit: 0 },
    { accountCode: '1100', debit: 0, credit: 336_000 },
  ], 'non-vat'),
  e('MT-005', '2026-01-28', 'JV-004', 'Paid rent, withheld 5% creditable tax', [
    { accountCode: '6100', debit: 80_000, credit: 0 },
    { accountCode: '2250', debit: 0, credit: 4_000 },
    { accountCode: '1000', debit: 0, credit: 76_000 },
  ], 'non-vat'),
  e('MT-007', '2026-02-10', 'JV-006', 'Paid supplier invoice', [
    { accountCode: '2000', debit: 560_000, credit: 0 },
    { accountCode: '1000', debit: 0, credit: 560_000 },
  ], 'non-vat'),
  e('MT-008', '2026-02-15', 'SI-0002', 'Sold goods (cash sale, official receipt issued)', [
    { accountCode: '1000', debit: 224_000, credit: 0 },
    { accountCode: '4000', debit: 0, credit: 200_000 },
    { accountCode: '2300', debit: 0, credit: 24_000 },
  ], 'vatable'),
  e('MT-009', '2026-02-20', 'JV-007', 'COGS for January sales', [
    { accountCode: '5000', debit: 300_000, credit: 0 },
    { accountCode: '1200', debit: 0, credit: 300_000 },
  ], 'non-vat'),
  e('MT-010', '2026-02-25', 'JV-008', 'Remitted withholding taxes to BIR (1601C)', [
    { accountCode: '2200', debit: 15_000, credit: 0 },
    { accountCode: '2250', debit: 4_000, credit: 0 },
    { accountCode: '1000', debit: 0, credit: 19_000 },
  ], 'non-vat'),
]

const CEBU_ENTRIES: JournalEntry[] = [
  e('CC-001', '2026-01-08', 'JV-001', 'Owner initial investment', [
    { accountCode: '1000', debit: 500_000, credit: 0 },
    { accountCode: '3000', debit: 0, credit: 500_000 },
  ], 'non-vat'),
  e('CC-002', '2026-01-15', 'SI-0001', 'Consulting engagement billed (VAT-inclusive)', [
    { accountCode: '1100', debit: 112_000, credit: 0 },
    { accountCode: '4100', debit: 0, credit: 100_000 },
    { accountCode: '2300', debit: 0, credit: 12_000 },
  ], 'vatable'),
  e('CC-003', '2026-01-20', 'JV-002', 'Paid office rent, 5% EWT withheld', [
    { accountCode: '6100', debit: 40_000, credit: 0 },
    { accountCode: '2250', debit: 0, credit: 2_000 },
    { accountCode: '1000', debit: 0, credit: 38_000 },
  ], 'non-vat'),
  e('CC-004', '2026-01-30', 'JV-003', 'Collected fees from client', [
    { accountCode: '1000', debit: 112_000, credit: 0 },
    { accountCode: '1100', debit: 0, credit: 112_000 },
  ], 'non-vat'),
  e('CC-005', '2026-02-05', 'JV-004', 'Professional fees paid to IT consultant, 10% EWT', [
    { accountCode: '6600', debit: 30_000, credit: 0 },
    { accountCode: '2250', debit: 0, credit: 3_000 },
    { accountCode: '1000', debit: 0, credit: 27_000 },
  ], 'non-vat'),
  e('CC-006', '2026-02-15', 'SI-0002', 'Second engagement billed', [
    { accountCode: '1100', debit: 168_000, credit: 0 },
    { accountCode: '4100', debit: 0, credit: 150_000 },
    { accountCode: '2300', debit: 0, credit: 18_000 },
  ], 'vatable'),
]

const DAVAO_ENTRIES: JournalEntry[] = [
  e('DD-001', '2026-04-02', 'JV-001', 'Owner initial investment (non-VAT business)', [
    { accountCode: '1000', debit: 200_000, credit: 0 },
    { accountCode: '3000', debit: 0, credit: 200_000 },
  ], 'non-vat'),
  e('DD-002', '2026-04-05', 'JV-002', 'Purchased baking supplies', [
    { accountCode: '6300', debit: 25_000, credit: 0 },
    { accountCode: '1000', debit: 0, credit: 25_000 },
  ], 'non-vat'),
  e('DD-003', '2026-04-15', 'SI-0001', 'Daily sales summary (POS)', [
    { accountCode: '1000', debit: 90_000, credit: 0 },
    { accountCode: '4000', debit: 0, credit: 90_000 },
  ], 'non-vat'),
  e('DD-004', '2026-04-20', 'JV-003', 'Paid utilities', [
    { accountCode: '6200', debit: 12_000, credit: 0 },
    { accountCode: '1000', debit: 0, credit: 12_000 },
  ], 'non-vat'),
  e('DD-005', '2026-04-30', 'JV-004', 'Daily sales summary (POS)', [
    { accountCode: '1000', debit: 75_000, credit: 0 },
    { accountCode: '4000', debit: 0, credit: 75_000 },
  ], 'non-vat'),
]

export const JOURNAL_ENTRIES: Record<string, JournalEntry[]> = {
  'manila-traders': MANILA_ENTRIES,
  'cebu-consulting': CEBU_ENTRIES,
  'davao-bakeshop': DAVAO_ENTRIES,
}

