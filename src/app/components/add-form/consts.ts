export const DISPLAY_PRICE_WARNING_TABLES = ['invoices'];

export const DISPLAY_INPUT_FIELD_TABLE_MAP_EXCLUSIONS: {
  [key: string]: string[];
} = {
  invoices: [
    'Title',
    'VAT',
    'Total',
    'Gross Value',
    'Status',
    'Printed',
    'Paid',
    'Outstanding Balance',
    'Delivery Type',
    'Type',
  ],
  supplier_invoices: [
    'Net Value',
    'VAT',
    'Total',
    'Paid',
    'Outstanding Balance',
  ],
  items: ['Total Sold'],
  customer_payments: ['Linked Payment ID'],
  stocked_items: ['Expired'],
  customers: ['Outstanding Balance', 'Last Payment Date', 'Password'],
};
