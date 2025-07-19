export const TABLE_NAMES = [
  'customers',
  'invoices',
  'payments',
  'price_list',
  'price_list_items',
  'items',
  'stocked_items',
  'supplier_invoices',
  'suppliers',
  'supplier_types',
  'warehouse',
  'general_ledger',
  'payments',
  'customer_payments',
  'page_section_text',
  'image_locations',
  'page_sections',
  'offers',
  'categories',
  'sub_categories',
  'credit_notes',
  'credit_notes_customers',
  'expired_items',
  'invoiced_items',
  'expense_options',
  'allergen_information',
];

export const TABLE_NAME_PAIRS = [
  { customers: 'Customers' },
  { invoices: 'Invoices' },
  { payments: 'Payments' },
  { price_list: 'Price List' },
  { price_list_items: 'Price List Items' },
  { items: 'Items' },
  { stocked_items: 'Stocked Items' },
  { supplier_invoices: 'Supplier Invoices' },
  { suppliers: 'Suppliers' },
  { supplier_types: 'Supplier Types' },
  { warehouse: 'Warehouse' },
  { general_ledger: 'General Ledger' },
  { customer_payments: 'Customer Payments' },
  { supplier_payments: 'Supplier Payments' },
  { page_section_text: 'Page Section Text' },
  { image_locations: 'Image Locations' },
  { page_sections: 'Page Sections' },
  { offers: 'Offers' },
  { categories: 'Categories' },
  { sub_categories: 'Sub Categories' },
  { credit_notes: 'Credit Notes Suppliers' },
  { credit_notes_customers: 'Credit Notes Customers' },
  { expired_items: 'Expired Items' },
  { invoiced_items: 'Invoiced Items' },
  { expense_options: 'Expense Options' },
  { allergen_information: 'Allergen Information' },
];

export const TABLE_CATEGORIES = {
  Customers: [
    { tableName: 'customers', displayName: 'Overview' },
    { tableName: 'customer_payments', displayName: 'Payments' },
    { tableName: 'invoices', displayName: 'Invoices' },
    { tableName: 'price_list', displayName: 'Price List' },
    { tableName: 'credit_notes_customers', displayName: 'Credit Notes' },
  ],
  Products: [
    { tableName: 'items', displayName: 'Products' },
    { tableName: 'stocked_items', displayName: 'Stocked Items' },
    { tableName: 'invoiced_items', displayName: 'Invoiced Items' },
  ],
  Supply: [
    { tableName: 'stocked_items', displayName: 'Stock' },
    { tableName: 'expired_items', displayName: 'Expired Items' },
    { tableName: 'supplier_invoices', displayName: 'Invoices' },
    { tableName: 'credit_notes', displayName: 'Credit Notes' },
    { tableName: 'suppliers', displayName: 'Suppliers' },
    { tableName: 'supplier_types', displayName: 'Supplier Types' },
    { tableName: 'warehouse', displayName: 'Warehouses' },
  ],
  Finance: [
    { tableName: 'invoices', displayName: 'Customer Invoices' },
    { tableName: 'supplier_invoices', displayName: 'Supplier Invoices' },
    { tableName: 'general_ledger', displayName: 'General Ledger' },
    { tableName: 'payments', displayName: 'All Payments' },
    { tableName: 'profit-loss', displayName: 'Profit / Loss' },
    { tableName: 'customer_payments', displayName: 'Customer Payments' },
    { tableName: 'supplier_payments', displayName: 'Supplier Payments' },
    { tableName: 'debtor_creditor', displayName: 'Aged Debtor / Creditors' },
    { tableName: 'vat-returns', displayName: 'VAT Returns' },
    { tableName: 'expense_options', displayName: 'Expense Options' },
  ],
  Website: [
    { tableName: 'offers', displayName: 'Offers' },
    { tableName: 'categories', displayName: 'Categories' },
    { tableName: 'sub_categories', displayName: 'Sub-categories' },
    { tableName: 'statistics', displayName: 'Statistics' },
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

export const NON_VIEW_TABLES = ['debtor_creditor', 'statistics', 'profit-loss'];

export const CREDIT_NOTE_COLUMNS = [
  { name: 'ID', type: 'number' },
  { name: 'Supplier ID', type: 'number' },
  { name: 'Invoice ID', type: 'number' },
  { name: 'Amount', type: 'currency' },
  { name: 'Description', type: 'text' },
  { name: 'Paid', type: 'string' },
  { name: 'Currency', type: 'string' },
  { name: 'Due Date', type: 'date' },
  { name: 'Date Issued', type: 'date' },
];

export const SUPPLIER_INVOICE_COLUMNS = [
  { name: 'ID', type: 'number' },
  { name: 'Item Name', type: 'string' },
  { name: 'Picture', type: 'image' },
  { name: 'Price', type: 'currency' },
  { name: 'Purchase Date', type: 'date' },
  { name: 'Quantity', type: 'number' },
  { name: 'Expiry Date', type: 'string' },
  { name: 'Packing Format', type: 'enum' },
  { name: 'Barcode', type: 'string' },
  { name: 'Warehouse', type: 'number' },
];

export const ADDRESS_COLUMNS = [
  { name: 'ID', type: 'number' },
  { name: 'Invoice Address One', type: 'string' },
  { name: 'Invoice Address Two', type: 'string' },
  { name: 'Invoice Address Three', type: 'string' },
  { name: 'Invoice Address Four', type: 'string' },
  { name: 'Invoice Postcode', type: 'string' },
  { name: 'Delivery Address One', type: 'string' },
  { name: 'Delivery Address Two', type: 'string' },
  { name: 'Delivery Address Three', type: 'string' },
  { name: 'Delivery Address Four', type: 'string' },
  { name: 'Delivery Postcode', type: 'string' },
];

export const PRICE_LIST_ITEM_COLUMNS = [
  { name: 'ID', type: 'number' },
  { name: 'Item', type: 'string' },
  { name: 'Price', type: 'currency' },
  { name: 'Date Added', type: 'date' },
];

export const EXTRA_COLUMN_TABLES = [
  'items',
  'stocked_items',
  'supplier_invoices',
  'suppliers',
  'invoices',
  'customers',
  'price_list',
];
