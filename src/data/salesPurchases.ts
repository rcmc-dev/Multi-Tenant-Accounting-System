import type { Purchase, Sale } from '../types'

export const SALES: Record<string, Sale[]> = {
  'manila-traders': [
    { id: 's1', invoiceNo: 'SI-0001', date: '2026-01-20', customer: 'ABC Trading Corp.', saleType: 'goods', vatType: 'vatable', netAmount: 300_000, status: 'unpaid' },
    { id: 's2', invoiceNo: 'SI-0002', date: '2026-02-15', customer: 'Cash Mart Superstore', saleType: 'goods', vatType: 'vatable', netAmount: 200_000, status: 'paid' },
    { id: 's3', invoiceNo: 'SI-0003', date: '2026-03-02', customer: 'Navotas Retailers Co.', saleType: 'goods', vatType: 'vatable', netAmount: 150_000, status: 'unpaid' },
  ],
  'cebu-consulting': [
    { id: 's1', invoiceNo: 'SI-0001', date: '2026-01-15', customer: 'Lapu-Lapu Logistics', saleType: 'services', vatType: 'vatable', netAmount: 100_000, status: 'unpaid' },
    { id: 's2', invoiceNo: 'SI-0002', date: '2026-02-15', customer: 'Mactan Resorts Group', saleType: 'services', vatType: 'vatable', netAmount: 150_000, status: 'unpaid' },
  ],
  'davao-bakeshop': [
    { id: 's1', invoiceNo: 'SI-0001', date: '2026-04-15', customer: 'Walk-in customers (POS summary)', saleType: 'goods', vatType: 'non-vat', netAmount: 90_000, status: 'paid' },
    { id: 's2', invoiceNo: 'SI-0002', date: '2026-04-30', customer: 'Walk-in customers (POS summary)', saleType: 'goods', vatType: 'non-vat', netAmount: 75_000, status: 'paid' },
  ],
}

export const PURCHASES: Record<string, Purchase[]> = {
  'manila-traders': [
    { id: 'p1', refNo: 'PO-0001', date: '2026-01-10', supplier: 'Manila Wholesale Supply', expenseAccount: '1200', vatType: 'vatable', netAmount: 500_000, ewtRate: 0, status: 'unpaid' },
    { id: 'p2', refNo: 'PO-0002', date: '2026-01-28', supplier: 'Ortigas Realty Corp.', expenseAccount: '6100', vatType: 'non-vat', netAmount: 80_000, ewtRate: 0.05, status: 'unpaid' },
    { id: 'p3', refNo: 'PO-0003', date: '2026-02-05', supplier: 'Payroll (employees)', expenseAccount: '6000', vatType: 'non-vat', netAmount: 150_000, ewtRate: 0, status: 'paid' },
  ],
  'cebu-consulting': [
    { id: 'p1', refNo: 'PO-0001', date: '2026-01-20', supplier: 'Cebu Business Park Landlord', expenseAccount: '6100', vatType: 'non-vat', netAmount: 40_000, ewtRate: 0.05, status: 'unpaid' },
    { id: 'p2', refNo: 'PO-0002', date: '2026-02-05', supplier: 'PixelForge IT Consulting', expenseAccount: '6600', vatType: 'non-vat', netAmount: 30_000, ewtRate: 0.10, status: 'unpaid' },
  ],
  'davao-bakeshop': [
    { id: 'p1', refNo: 'PO-0001', date: '2026-04-05', supplier: 'Davao Flour Mill', expenseAccount: '6300', vatType: 'non-vat', netAmount: 25_000, ewtRate: 0, status: 'paid' },
    { id: 'p2', refNo: 'PO-0002', date: '2026-04-20', supplier: 'Davao Light & Power', expenseAccount: '6200', vatType: 'non-vat', netAmount: 12_000, ewtRate: 0, status: 'paid' },
  ],
}
