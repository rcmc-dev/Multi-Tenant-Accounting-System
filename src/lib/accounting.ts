import type { Account, JournalEntry } from '../types'
import { CHART_OF_ACCOUNTS } from '../data/chartOfAccounts'

export const formatPeso = (amount: number): string =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)

export const formatDate = (iso: string): string =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export interface AccountBalance {
  account: Account
  debitTotal: number
  creditTotal: number
  /** Normal-balance net: positive = debit for assets/expenses, credit for others */
  balance: number
}

export function getBalances(entries: JournalEntry[]): AccountBalance[] {
  const totals = new Map<string, { debit: number; credit: number }>()
  for (const entry of entries) {
    if (!entry.posted) continue
    for (const line of entry.lines) {
      const t = totals.get(line.accountCode) ?? { debit: 0, credit: 0 }
      t.debit += line.debit
      t.credit += line.credit
      totals.set(line.accountCode, t)
    }
  }
  return CHART_OF_ACCOUNTS.filter((a) => totals.has(a.code)).map((account) => {
    const { debit, credit } = totals.get(account.code)!
    const isDebitNormal = account.type === 'asset' || account.type === 'expense'
    return {
      account,
      debitTotal: debit,
      creditTotal: credit,
      balance: isDebitNormal ? debit - credit : credit - debit,
    }
  })
}

export function getTrialBalance(entries: JournalEntry[]): { rows: AccountBalance[]; totalDebit: number; totalCredit: number } {
  const rows = getBalances(entries)
  const totalDebit = rows.reduce((s, r) => s + (r.balance > 0 ? r.balance : 0), 0)
  const totalCredit = rows.reduce((s, r) => s + (r.balance < 0 ? -r.balance : 0), 0)
  return { rows, totalDebit, totalCredit }
}

export function getIncomeStatement(entries: JournalEntry[]) {
  const balances = getBalances(entries)
  const revenue = balances.filter((b) => b.account.type === 'revenue')
  const expenses = balances.filter((b) => b.account.type === 'expense')
  const totalRevenue = revenue.reduce((s, b) => s + b.balance, 0)
  const totalExpenses = expenses.reduce((s, b) => s + b.balance, 0)
  return { revenue, expenses, totalRevenue, totalExpenses, netIncome: totalRevenue - totalExpenses }
}

export function getBalanceSheet(entries: JournalEntry[]) {
  const balances = getBalances(entries)
  const { netIncome } = getIncomeStatement(entries)
  const assets = balances.filter((b) => b.account.type === 'asset')
  const liabilities = balances.filter((b) => b.account.type === 'liability')
  const equity = balances.filter((b) => b.account.type === 'equity' && b.account.code !== '3100')
  const totalAssets = assets.reduce((s, b) => s + b.balance, 0)
  const totalLiabilities = liabilities.reduce((s, b) => s + b.balance, 0)
  // Retained earnings = net income - drawings (simplified for starter app)
  const drawings = balances
    .filter((b) => b.account.code === '3200')
    .reduce((s, b) => s + b.balance, 0)
  const totalEquity = equity.reduce((s, b) => s + b.balance, 0) + netIncome - drawings
  return {
    assets,
    liabilities,
    equity,
    retainedEarnings: netIncome - drawings,
    totalAssets,
    totalLiabilities,
    totalEquity,
    balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.005,
  }
}

/** VAT summary mapping to BIR 2550M/2550Q concepts */
export function getVatSummary(entries: JournalEntry[]) {
  let outputVat = 0
  let inputVat = 0
  for (const entry of entries) {
    if (!entry.posted) continue
    for (const line of entry.lines) {
      if (line.accountCode === '2300') outputVat += line.credit - line.debit
      if (line.accountCode === '1150') inputVat += line.debit - line.credit
    }
  }
  return { outputVat, inputVat, netVatPayable: outputVat - inputVat }
}
