import type { JournalEntry, Purchase, Sale } from '../types'
import { PH_VAT_RATE } from '../data/chartOfAccounts'

/**
 * Converts a recorded sale into a balanced journal entry:
 *   Dr Accounts Receivable (or Cash if paid)   gross
 *   Cr Sales/Service Revenue                   net
 *   Cr Output VAT Payable                      vat (vatable only)
 */
export function saleToEntry(sale: Sale, tenantInitials: string): JournalEntry {
  const vat = sale.vatType === 'vatable' ? sale.netAmount * PH_VAT_RATE : 0
  const gross = sale.netAmount + vat
  const revenueAccount = sale.saleType === 'goods' ? '4000' : '4100'
  const debitAccount = sale.status === 'paid' ? '1000' : '1100'

  const lines: JournalEntry['lines'] = [
    { accountCode: debitAccount, debit: gross, credit: 0 },
    { accountCode: revenueAccount, debit: 0, credit: sale.netAmount },
  ]
  if (vat > 0) lines.push({ accountCode: '2300', debit: 0, credit: vat })

  return {
    id: `${tenantInitials}-SALE-${sale.invoiceNo}-${sale.id}`,
    date: sale.date,
    reference: sale.invoiceNo,
    description: `Sale to ${sale.customer} (${sale.saleType})`,
    vatType: sale.vatType,
    lines,
    posted: true,
  }
}

/**
 * Converts a recorded purchase into a balanced journal entry:
 *   Dr Expense/Inventory account               net
 *   Dr Input VAT                               vat (vatable only)
 *   Cr Expanded Withholding Tax Payable        ewt (if withheld)
 *   Cr Accounts Payable (or Cash if paid)      gross - ewt
 */
export function purchaseToEntry(purchase: Purchase, tenantInitials: string): JournalEntry {
  const vat = purchase.vatType === 'vatable' ? purchase.netAmount * PH_VAT_RATE : 0
  const ewt = purchase.netAmount * purchase.ewtRate
  const gross = purchase.netAmount + vat
  const creditAccount = purchase.status === 'paid' ? '1000' : '2000'

  const lines: JournalEntry['lines'] = [
    { accountCode: purchase.expenseAccount, debit: purchase.netAmount, credit: 0 },
  ]
  if (vat > 0) lines.push({ accountCode: '1150', debit: vat, credit: 0 })
  if (ewt > 0) lines.push({ accountCode: '2250', debit: 0, credit: ewt })
  lines.push({ accountCode: creditAccount, debit: 0, credit: gross - ewt })

  const accountName = purchase.expenseAccount
  return {
    id: `${tenantInitials}-PURC-${purchase.refNo}-${purchase.id}`,
    date: purchase.date,
    reference: purchase.refNo,
    description: `Purchase from ${purchase.supplier} (acct ${accountName})`,
    vatType: purchase.vatType === 'vatable' ? 'vatable' : 'non-vat',
    lines,
    posted: true,
  }
}
