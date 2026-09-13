import type { Account } from '../types'

/** Philippine-standard chart of accounts, incl. BIR/VAT-related accounts */
export const CHART_OF_ACCOUNTS: Account[] = [
  // Assets
  { code: '1000', name: 'Cash in Bank - Current', type: 'asset', phClassification: 'Cash' },
  { code: '1010', name: 'Cash on Hand', type: 'asset', phClassification: 'Cash' },
  { code: '1020', name: 'Petty Cash Fund', type: 'asset', phClassification: 'Cash' },
  { code: '1100', name: 'Accounts Receivable - Trade', type: 'asset', phClassification: 'Receivables' },
  { code: '1150', name: 'Input VAT', type: 'asset', phClassification: 'Receivables (BIR 2550M/Q)' },
  { code: '1200', name: 'Inventory', type: 'asset', phClassification: 'Inventory' },
  { code: '1500', name: 'Property, Plant and Equipment', type: 'asset', phClassification: 'PPE (BIR 1701 Depreciation)' },
  { code: '1550', name: 'Accumulated Depreciation', type: 'asset', phClassification: 'PPE' },
  // Liabilities
  { code: '2000', name: 'Accounts Payable - Trade', type: 'liability', phClassification: 'Payables' },
  { code: '2100', name: 'Accrued Expenses Payable', type: 'liability', phClassification: 'Payables' },
  { code: '2200', name: 'Withholding Taxes Payable (1601C/2307)', type: 'liability', phClassification: 'BIR' },
  { code: '2250', name: 'Expanded Withholding Tax Payable (1604E)', type: 'liability', phClassification: 'BIR' },
  { code: '2300', name: 'Output VAT Payable', type: 'liability', phClassification: 'BIR (2550M/Q)' },
  { code: '2400', name: 'Deferred Rent Liability', type: 'liability', phClassification: 'Payables' },
  { code: '2500', name: 'Loans Payable - Bank', type: 'liability', phClassification: 'Loans' },
  // Equity
  { code: '3000', name: 'Owner\'s Capital', type: 'equity', phClassification: 'Equity' },
  { code: '3100', name: 'Retained Earnings', type: 'equity', phClassification: 'Equity' },
  { code: '3200', name: 'Owner\'s Drawing', type: 'equity', phClassification: 'Equity' },
  // Revenue
  { code: '4000', name: 'Sales - Goods', type: 'revenue', phClassification: 'Revenue (BIR 2301/2550)' },
  { code: '4100', name: 'Service Revenue', type: 'revenue', phClassification: 'Revenue (BIR 2301/2550)' },
  { code: '4200', name: 'Sales Returns and Allowances', type: 'revenue', phClassification: 'Revenue' },
  // Expenses
  { code: '5000', name: 'Cost of Goods Sold', type: 'expense', phClassification: 'COGS' },
  { code: '6000', name: 'Salaries and Wages Expense', type: 'expense', phClassification: 'Operating Expense' },
  { code: '6100', name: 'Rent Expense', type: 'expense', phClassification: 'Operating Expense (5% Withholding)' },
  { code: '6200', name: 'Utilities Expense', type: 'expense', phClassification: 'Operating Expense' },
  { code: '6300', name: 'Supplies Expense', type: 'expense', phClassification: 'Operating Expense' },
  { code: '6400', name: 'Depreciation Expense', type: 'expense', phClassification: 'Operating Expense' },
  { code: '6500', name: 'Taxes and Licenses', type: 'expense', phClassification: 'Operating Expense' },
  { code: '6600', name: 'Professional Fees Expense', type: 'expense', phClassification: 'Operating Expense (10% Withholding)' },
]

export const PH_VAT_RATE = 0.12 // TRAIN Law — standard VAT rate
