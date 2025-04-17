export interface ItemsList {
    id: number,
    name?: string,
    item_name?: string,
    quantity: number,
    unit: string,
    price?: number,
    discount: number,
    vat: number,
    net: number,
    purchase_price?: number,
    purchase_date?: Date,
    expiry_date?: Date,
    packing_format?: string,
    barcode?: string
};