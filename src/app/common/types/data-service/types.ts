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
