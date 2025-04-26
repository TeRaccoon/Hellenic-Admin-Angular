export const COLUMN_RESTRICTIONS: {
    [roleOrTable: string]: string[]
} = {
    'Low': ['edit-row', 'delete-row'],
    'High': ['delete-row'],
    'customers': ['password', 'Password'],
    'users': ['password', 'Password'],
    'invoices:Driver': [
        'gross_value',
        'discount_value',
        'VAT',
        'total',
        'outstanding_balance',
        'payment_status',
        'Gross Value',
        'Total',
        'Outstanding Balance',
        'Paid',
        'edit-row',
        'delete-row',
        'invoiced-items',
        'ID',
        'id',
        'Printed',
        'printed',
    ],
};
