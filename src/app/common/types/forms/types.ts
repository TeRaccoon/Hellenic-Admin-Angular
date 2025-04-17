export interface ReplacementData {
  dataId: number;
  dataValue: string;
  key: string;
  field: string;
  alt: boolean;
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

export interface KeyedData {
  [key: string]: Data;
}

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

export interface KeyedAddress {
  [key: string]: Address;
}

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

export enum SaleType {
  Invoice = 'Invoice',
  Cash = 'Cash Sale',
}
