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
    'retail_items',
    'page_section_text',
    'image_locations',
    'page_sections',
    'offers',
    'categories',
    'sub_categories'
];

export const TABLE_NAME_PAIRS = [
    { 'customers': 'Customers' },
    { 'invoices': 'Invoices' },
    { 'payments': 'Payments' },
    { 'price_list': 'Price List' },
    { 'items': 'Items' },
    { 'stocked_items': 'Stocked Items' },
    { 'supplier_invoices': 'Supplier Invoices' },
    { 'suppliers': 'Suppliers' },
    { 'warehouse': 'Warehouse' },
    { 'general_ledger': 'General Ledger' },
    { 'customer_payments': 'Customer Payments' },
    { 'discount_codes': 'Discount Codes' },
    { 'retail_items': 'Retail Items' },
    { 'page_section_text': 'Page Section Text' },
    { 'image_locations': 'Image Locations' },
    { 'page_sections': 'Page Sections' },
    { 'offers': 'Offers' },
    { 'categories': 'Categories' },
    { 'sub_categories': 'Sub Categories' }
];

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

export const NON_VIEW_TABLES = [
    'debtor_creditor',
    'statistics',
    'profit_loss'
];