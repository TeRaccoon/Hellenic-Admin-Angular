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
  Invoices: string;
  Payments: string;
  CreditNotes: string;
}

export const CustomerQueries: BalanceSheetQueries = {
  Invoices: 'order-history',
  Payments: 'payments-by-customer-id',
  CreditNotes: '',
};

export const SupplierQueries: BalanceSheetQueries = {
  Invoices: 'order-history-supplier',
  Payments: 'payments-by-supplier-id',
  CreditNotes: '',
};
