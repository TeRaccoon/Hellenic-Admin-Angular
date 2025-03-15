export const DISPLAY_PRICE_WARNING_TABLES = ['invoices'];

export const DISPLAY_INPUT_FIELD_TABLE_MAP_EXCLUSIONS: {
  [key: string]: string[];
} = {
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
  supplier_invoices: [
    'Net Value',
    'VAT',
    'Total',
    'Paid',
    'Outstanding Balance',
  ],
  invoiced_items: [
    'Restocked'
  ],
  items: ['Total Sold'],
  customer_payments: ['Linked Payment ID'],
  stocked_items: ['Expired'],
  customers: ['Outstanding Balance', 'Last Payment Date', 'Password'],
};
