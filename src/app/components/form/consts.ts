import { Validators } from '@angular/forms';
import { SelectData } from './types';

export const FULLSCREEN_TABLES = ['invoices', 'supplier_invoices'];

export const DISPLAY_PRICE_WARNING_TABLES = ['invoices'];

export const DISPLAY_INPUT_FIELD_TABLE_MAP_EXCLUSIONS: Record<string, string[]> = {
  invoices: [
    'Title',
    'VAT',
    'Total',
    'Gross Value',
    'Discount Value',
    'Status',
    'Printed',
    'Paid',
    'Outstanding Balance',
    'Delivery Type',
    'Type',
  ],
  supplier_invoices: ['Net Value', 'VAT', 'Total', 'Paid', 'Outstanding Balance'],
  invoiced_items: ['Restocked'],
  items: ['Total Sold'],
  customer_payments: ['Linked Payment ID'],
  stocked_items: ['Expired'],
  customers: ['Outstanding Balance', 'Last Payment Date', 'Password'],
};

export const DEFAULT_ADDRESS = {
  'Delivery Address': {
    line1: '',
    line2: '',
    line3: '',
    postcode: '',
    save: false,
  },
  'Billing Address': {
    line1: '',
    line2: '',
    line3: '',
    postcode: '',
    save: false,
  },
};

export const DEFAULT_SELECT_DATA: SelectData = {
  alternative: {},
  selected: {},
  selectedText: {},
};

export const ITEM_WIDGET_TABLES = ['invoices', 'supplier_invoices'];

export const DELETE_TABLE_MAP = {
  supplier_invoices: 'stocked_items',
  invoices: 'invoiced_items',
};

export const DEFAULT_SINGLE_ADDRESS = {
  line1: '',
  line2: '',
  line3: '',
  postcode: '',
  save: false,
};

export const DEFAULT_SUPPLIER_INVOICE = {
  purchase_date: [new Date().toISOString().split('T')[0], [Validators.required]],
  expiry_date: [new Date().toISOString().split('T')[0], [Validators.required]],
  item_id: ['', [Validators.required]],
  purchase_price: ['', [Validators.required]],
  quantity: ['', [Validators.required]],

  packing_format: ['Individual', [Validators.required]],
  barcode: ['', [Validators.required]],
};

export const STANDARD_IMAGE_SUBMISSION_TABLES = ['categories'];
