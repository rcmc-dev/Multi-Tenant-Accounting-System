export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'

export interface Account {
  code: string
  name: string
  type: AccountType
  /** Philippine standard account classification for BIR CAS mapping */
  phClassification?: string
}

export interface JournalLine {
  accountCode: string
  debit: number
  credit: number
}

export interface JournalEntry {
  id: string
  date: string // ISO yyyy-mm-dd
  reference: string
  description: string
  /** VAT type of the transaction for BIR form mapping */
  vatType?: 'vatable' | 'vat-exempt' | 'zero-rated' | 'non-vat'
  lines: JournalLine[]
  posted: boolean
}

export interface Tenant {
  id: string
  name: string
  industry: string
  rdoCode: string // BIR Revenue District Office
  tin: string
  vatType: 'vatable' | 'non-vat'
  fiscalYearStart: string
  logoInitials: string
}

export interface TenantUser {
  name: string
  role: 'Admin' | 'Accountant' | 'Viewer'
  email: string
}

export interface Sale {
  id: string
  invoiceNo: string
  date: string
  customer: string
  saleType: 'goods' | 'services'
  vatType: 'vatable' | 'vat-exempt' | 'zero-rated' | 'non-vat'
  netAmount: number
  status: 'paid' | 'unpaid'
}

export interface Purchase {
  id: string
  refNo: string
  date: string
  supplier: string
  /** Chart of accounts code for the expense/inventory account to debit */
  expenseAccount: string
  vatType: 'vatable' | 'non-vat'
  netAmount: number
  /** Creditable withholding rate applied by us as payer, e.g. 0, 0.05, 0.10 */
  ewtRate: number
  status: 'paid' | 'unpaid'
}

