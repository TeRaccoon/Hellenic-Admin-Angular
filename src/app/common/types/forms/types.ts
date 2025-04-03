export interface ReplacementData {
  dataId: number;
  dataValue: string;
  key: string;
  field: string;
  alt: boolean;
}

export interface settings {
  showAddMore: boolean;
}

export interface data {
  inputType: string;
  dataType: string;
  field: string;
  required: boolean;
  value: any;
}

export interface keyedData {
  [key: string]: data;
}

export interface editableData {
  columns: any[];
  types: any[];
  names: any[];
  required: any[];
  fields: any[];
  values: any[];
}

export interface message {
  title: string;
  message: string;
  footer?: string;
}

export interface address {
  line1: string;
  line2: string;
  line3: string;
  postcode: string;
  save: boolean;
}

export interface keyedAddress {
  [key: string]: address;
}

export interface formState {
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
