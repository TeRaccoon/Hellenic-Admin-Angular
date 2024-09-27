export const TABLE_NAMES = [
  'customers',
  'invoices',
  'payments',
  'price_list',
  'items',
  'stocked_items',
  'supplier_invoices',
  'suppliers',
  'warehouse',
  'general_ledger',
  'payments',
  'customer_payments',
  'discount_codes',
  'page_section_text',
  'image_locations',
  'page_sections',
  'offers',
  'categories',
  'sub_categories',
  'credit_notes',
  'credit_notes_customers',
  'expired_items',
];

export const TABLE_NAME_PAIRS = [
  { customers: 'Customers' },
  { invoices: 'Invoices' },
  { payments: 'Payments' },
  { price_list: 'Price List' },
  { items: 'Items' },
  { stocked_items: 'Stocked Items' },
  { supplier_invoices: 'Supplier Invoices' },
  { suppliers: 'Suppliers' },
  { warehouse: 'Warehouse' },
  { general_ledger: 'General Ledger' },
  { customer_payments: 'Customer Payments' },
  { supplier_payments: 'Supplier Payments' },
  { discount_codes: 'Discount Codes' },
  { page_section_text: 'Page Section Text' },
  { image_locations: 'Image Locations' },
  { page_sections: 'Page Sections' },
  { offers: 'Offers' },
  { categories: 'Categories' },
  { sub_categories: 'Sub Categories' },
  { credit_notes: 'Credit Notes Suppliers' },
  { credit_notes_customers: 'Credit Notes Customers' },
  { expired_items: 'Expired Items' },
];

export const TABLE_CATEGORIES = {
  Customers: [
    { tableName: 'customers', displayName: 'Overview' },
    { tableName: 'customer_payments', displayName: 'Payments' },
    { tableName: 'invoices', displayName: 'Invoices' },
    { tableName: 'price_list', displayName: 'Price List' },
    { tableName: 'credit_notes_customers', displayName: 'Credit Notes' },
  ],
  Products: [{ tableName: 'items', displayName: 'Products' }],
  Supply: [
    { tableName: 'stocked_items', displayName: 'Stock' },
    { tableName: 'expired_items', displayName: 'Expired Items' },
    { tableName: 'supplier_invoices', displayName: 'Invoices' },
    { tableName: 'credit_notes', displayName: 'Credit Notes' },
    { tableName: 'suppliers', displayName: 'Suppliers' },
    { tableName: 'warehouse', displayName: 'Warehouses' },
  ],
  Finance: [
    { tableName: 'invoices', displayName: 'Customer Invoices' },
    { tableName: 'supplier_invoices', displayName: 'Supplier Invoices' },
    { tableName: 'general_ledger', displayName: 'General Ledger' },
    { tableName: 'payments', displayName: 'All Payments' },
    { tableName: 'profit_loss', displayName: 'Profit / Loss' },
    { tableName: 'customer_payments', displayName: 'Customer Payments' },
    { tableName: 'supplier_payments', displayName: 'Supplier Payments' },
    { tableName: 'debtor_creditor', displayName: 'Aged Debtor / Creditors' },
    { tableName: 'vat-returns', displayName: 'VAT Returns' },
  ],
  Website: [
    { tableName: 'offers', displayName: 'Offers' },
    { tableName: 'categories', displayName: 'Categories' },
    { tableName: 'sub_categories', displayName: 'Sub-categories' },
    { tableName: 'statistics', displayName: 'Statistics' },
    { tableName: 'discount_codes', displayName: 'Discount codes' },
    { tableName: 'page_section_text', displayName: 'Website Text' },
    { tableName: 'image_locations', displayName: 'Website Images' },
  ],
  Admin: [
    { tableName: 'settings', displayName: 'Settings' },
    { tableName: 'users', displayName: 'Users' },
  ],
};

export const TABLE_NAME_MAP = new Map<string, string>(
  TABLE_NAME_PAIRS.map((pair: any) => {
    const key = Object.keys(pair)[0];
    const value = pair[key];
    return [key, value];
  })
);

export const REVERSE_TABLE_NAME_MAP = new Map<string, string>(
  TABLE_NAME_PAIRS.map((pair: any) => {
    const key = Object.keys(pair)[0];
    const value = pair[key];
    return [value, key];
  })
);

export const NON_VIEW_TABLES = ['debtor_creditor', 'statistics', 'profit_loss'];
