export interface BalanceSheetData {
  CustomerId: number;
  Title: string;
  Table: BalanceSheetTable;
}

export enum BalanceSheetTable {
  Customers = 'customers',
  Suppliers = 'suppliers',
}

export interface BalanceSheetQueries {
  Orders: string;
  Payments: string;
  CreditNotes: string;
}

export const CustomerQueries: BalanceSheetQueries = {
  Orders: 'order-history',
  Payments: 'payments-by-customer-id',
  CreditNotes: 'credit-notes-customer',
};

export const SupplierQueries: BalanceSheetQueries = {
  Orders: 'order-history-supplier',
  Payments: 'payments-by-supplier-id',
  CreditNotes: 'credit-notes-supplier',
};
