export interface BalanceSheetData {
  customerId: number;
  title: string;
  table: BalanceSheetTable;
  email: string;
}

export enum BalanceSheetTable {
  Customers = 'customers',
  Suppliers = 'suppliers',
}

export interface BalanceSheetQueries {
  orders: string;
  payments: string;
  creditNotes: string;
}

export interface Response {
  success: boolean;
  message: string;
  id?: number;
  error?: string;
  data?: string;
}

export interface FormSubmission {
  action: string;
  table_name: string;
  [key: string]: any;
}
