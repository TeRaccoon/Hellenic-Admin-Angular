import { ColumnTypes } from "../types/widget/types";

export const EXCLUDED_TABLES = ['invoiced_items'];

export const INVOICE_COLUMNS = [
    { name: 'ID', type: ColumnTypes.Number },
    { name: 'Item Name', type: ColumnTypes.String },
    { name: 'Unit', type: ColumnTypes.String },
    { name: 'Picture', type: ColumnTypes.Image },
    { name: 'Quantity', type: ColumnTypes.Number },
    { name: 'Item Discount', type: ColumnTypes.Percent },
    { name: 'Customer Discount', type: ColumnTypes.Percent },
    { name: 'Price', type: ColumnTypes.Currency },
    { name: 'Gross Value', type: ColumnTypes.Currency },
    { name: 'Discount Value', type: ColumnTypes.Currency },
    { name: 'VAT Value', type: ColumnTypes.Currency },
];

export const STOCK_COLUMNS = [
    { name: 'ID', type: ColumnTypes.Number },
    { name: 'Item Name', type: ColumnTypes.String },
    { name: 'Quantity', type: ColumnTypes.Number },
    { name: 'Expiry Date', type: ColumnTypes.Date },
    { name: 'Packing Format', type: ColumnTypes.String },
    { name: 'Barcode', type: ColumnTypes.String },
    { name: 'Warehouse', type: ColumnTypes.String }
]