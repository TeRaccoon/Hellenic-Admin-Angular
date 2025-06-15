import { WritableSignal } from '@angular/core';

export interface ItemsList {
  id: number;
  name?: string;
  item_name?: string;
  quantity: number;
  unit: string;
  price?: number;
  discount: number;
  vat: number;
  net: number;
  purchase_price?: number;
  purchase_date?: Date;
  expiry_date?: Date;
  packing_format?: string;
  barcode?: string;
}

export interface ReplacementData {
  dataId: number;
  dataValue: string;
  key: string;
  field: string;
  alt: boolean;
}

export interface ReplacementTextData {
  dataValue: string;
  key: string;
  field: string;
}

export interface Settings {
  showAddMore: boolean;
}

export interface Data {
  inputType: string;
  dataType: string;
  field: string;
  required: boolean;
  value: any;
}

export type KeyedData = Record<string, Data>;

export interface EditableData {
  columns: any[];
  types: any[];
  names: any[];
  required: any[];
  fields: any[];
  values: any[];
}

export interface Message {
  title: string;
  message: string;
  footer?: string;
}

export interface Address {
  line1: string;
  line2: string;
  line3: string;
  postcode: string;
  save: boolean;
}

export type KeyedAddress = Record<string, Address>;

export interface FormState {
  loaded: boolean;
  submissionAttempted: boolean;
  submitted: boolean;
  error: string | null;
  locked: boolean;
  visible: boolean;
  hidden: string | null;
  imageUploaded?: boolean;
}

export interface InvoiceDetails {
  title?: string;
  reference?: string;
  created_at: Date;
  total: number;
  outstanding_balance: number;
}

export interface CustomerAddress {
  delivery_address_one?: string | null;
  delivery_address_two?: string | null;
  delivery_address_three?: string | null;
  delivery_address_four?: string | null;
  delivery_postcode?: string | null;
  id: number;
  invoice_address_one?: string | null;
  invoice_address_two?: string | null;
  invoice_address_three?: string | null;
  invoice_address_four?: string | null;
  invoice_postcode?: string | null;
}

export interface SelectData {
  alternative: Record<string, { selectData: string }>;
  selected: Record<string, { selectData: string; selectDataId: number | null } | null>;
  selectedText: Record<string, string>;
}

export type FormVisible = Record<FormType, WritableSignal<boolean>>;

export interface SelectReplacementData {
  id: number;
  replacement: string;
}

export enum SaleType {
  Invoice = 'Invoice',
  Cash = 'Cash Sale',
}

export enum FormType {
  Login = 'Login',
  Edit = 'Edit',
  Add = 'Add',
  Delete = 'Delete',
  Message = 'Message',
  Filter = 'Filter',
  ChangePassword = 'ChangePassword',
  InvoicedItem = 'InvoicedItem',
  Widget = 'Widget',
  BalanceSheet = 'BalanceSheet',
}
