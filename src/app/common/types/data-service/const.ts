import {
  BalanceSheetData,
  BalanceSheetQueries,
  BalanceSheetTable,
} from './types';

export const DEFAULT_BALANCE_SHEET: BalanceSheetData = {
  Title: '',
  CustomerId: -1,
  Table: BalanceSheetTable.Customers,
};

export const CUSTOMER_QUERIES: BalanceSheetQueries = {
  Orders: 'order-history',
  Payments: 'payments-by-customer-id',
  CreditNotes: 'credit-notes-customer',
};

export const SUPPLIER_QUERIES: BalanceSheetQueries = {
  Orders: 'order-history-supplier',
  Payments: 'payments-by-supplier-id',
  CreditNotes: 'credit-notes-supplier',
};
