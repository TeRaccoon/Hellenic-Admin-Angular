import {
  BalanceSheetData,
  BalanceSheetQueries,
  BalanceSheetTable,
} from './types';

export const DEFAULT_BALANCE_SHEET: BalanceSheetData = {
  title: '',
  customerId: -1,
  table: BalanceSheetTable.Customers,
  email: ''
};

export const CUSTOMER_QUERIES: BalanceSheetQueries = {
  orders: 'order-history',
  payments: 'payments-by-customer-id',
  creditNotes: 'credit-notes-customer',
};

export const SUPPLIER_QUERIES: BalanceSheetQueries = {
  orders: 'order-history-supplier',
  payments: 'payments-by-supplier-id',
  creditNotes: 'credit-notes-supplier',
};
