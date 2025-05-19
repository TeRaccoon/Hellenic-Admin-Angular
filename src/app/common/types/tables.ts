/**
 Schema Generated with mysql-schema-ts 1.9.0
*/

/**
 * Exposes all fields present in allergen_information as a typescript
 * interface.
 */
export interface AllergenInformation {
  /** Celery Defaults to: No. */
  celery: 'Yes' | 'No' | 'Trace';
  /** Cereals containing gluten Defaults to: No. */
  cereals_containing_gluten: 'Yes' | 'No' | 'Trace';
  /** Crustaceans Defaults to: No. */
  crustaceans: 'Yes' | 'No' | 'Trace';
  /** Eggs Defaults to: No. */
  eggs: 'Yes' | 'No' | 'Trace';
  /** Fish Defaults to: No. */
  fish: 'Yes' | 'No' | 'Trace';
  /** ID  */
  id: number;
  /** Item ID  */
  item_id: number;
  /** Lupin Defaults to: No. */
  lupin: 'Yes' | 'No' | 'Trace';
  /** Milk Defaults to: No. */
  milk: 'Yes' | 'No' | 'Trace';
  /** Molluscs Defaults to: No. */
  molluscs: 'Yes' | 'No' | 'Trace';
  /** Mustard Defaults to: No. */
  mustard: 'Yes' | 'No' | 'Trace';
  /** Peanuts Defaults to: No. */
  peanuts: 'Yes' | 'No' | 'Trace';
  /** Sesame Defaults to: No. */
  sesame: 'Yes' | 'No' | 'Trace';
  /** Soybeans Defaults to: No. */
  soybeans: 'Yes' | 'No' | 'Trace';
  /** Sulfur Dioxide and Sulphites Defaults to: No. */
  sulphur_dioxide_and_sulphites: 'Yes' | 'No' | 'Trace';
  /** Tree Nuts Defaults to: No. */
  tree_nuts: 'Yes' | 'No' | 'Trace';
}

/**
 * Exposes the same fields as AllergenInformation,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface AllergenInformationWithDefaults {
  /** Celery Defaults to: No. */
  celery?: 'Yes' | 'No' | 'Trace';
  /** Cereals containing gluten Defaults to: No. */
  cereals_containing_gluten?: 'Yes' | 'No' | 'Trace';
  /** Crustaceans Defaults to: No. */
  crustaceans?: 'Yes' | 'No' | 'Trace';
  /** Eggs Defaults to: No. */
  eggs?: 'Yes' | 'No' | 'Trace';
  /** Fish Defaults to: No. */
  fish?: 'Yes' | 'No' | 'Trace';
  /** ID  */
  id?: number;
  /** Item ID  */
  item_id: number;
  /** Lupin Defaults to: No. */
  lupin?: 'Yes' | 'No' | 'Trace';
  /** Milk Defaults to: No. */
  milk?: 'Yes' | 'No' | 'Trace';
  /** Molluscs Defaults to: No. */
  molluscs?: 'Yes' | 'No' | 'Trace';
  /** Mustard Defaults to: No. */
  mustard?: 'Yes' | 'No' | 'Trace';
  /** Peanuts Defaults to: No. */
  peanuts?: 'Yes' | 'No' | 'Trace';
  /** Sesame Defaults to: No. */
  sesame?: 'Yes' | 'No' | 'Trace';
  /** Soybeans Defaults to: No. */
  soybeans?: 'Yes' | 'No' | 'Trace';
  /** Sulfur Dioxide and Sulphites Defaults to: No. */
  sulphur_dioxide_and_sulphites?: 'Yes' | 'No' | 'Trace';
  /** Tree Nuts Defaults to: No. */
  tree_nuts?: 'Yes' | 'No' | 'Trace';
}
/**
 * Exposes all fields present in bands as a typescript
 * interface.
 */
export interface Bands {
  /** ID  */
  id: number;
  /** Maximum Weight  */
  max_weight: number;
  /** Minimum Weight  */
  min_weight: number;
  /** Band Name  */
  name: string;
  /** Price  */
  price: number;
}

/**
 * Exposes the same fields as Bands,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface BandsWithDefaults {
  /** ID  */
  id?: number;
  /** Maximum Weight  */
  max_weight: number;
  /** Minimum Weight  */
  min_weight: number;
  /** Band Name  */
  name: string;
  /** Price  */
  price: number;
}
/**
 * Exposes all fields present in cart as a typescript
 * interface.
 */
export interface Cart {
  /** Customer  */
  customer_id: number;
  /** Date Defaults to: curdate(). */
  date: Date;
  /** ID  */
  id: number;
  /** Item ID  */
  item_id: number;
  /** Quantity  */
  quantity: number;
  /** Unit Defaults to: Unit. */
  unit: 'Unit' | 'Box' | 'Pallet' | 'Retail Box';
}

/**
 * Exposes the same fields as Cart,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CartWithDefaults {
  /** Customer  */
  customer_id: number;
  /** Date Defaults to: curdate(). */
  date?: Date;
  /** ID  */
  id?: number;
  /** Item ID  */
  item_id: number;
  /** Quantity  */
  quantity: number;
  /** Unit Defaults to: Unit. */
  unit?: 'Unit' | 'Box' | 'Pallet' | 'Retail Box';
}
/**
 * Exposes all fields present in categories as a typescript
 * interface.
 */
export interface Categories {
  /** ID  */
  id: number;
  /** Image  */
  image_file_name?: string | null;
  /** Name  */
  name: string;
  /** Visible Defaults to: Yes. */
  visible?: 'No' | 'Yes' | null;
}

/**
 * Exposes the same fields as Categories,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CategoriesWithDefaults {
  /** ID  */
  id?: number;
  /** Image  */
  image_file_name?: string | null;
  /** Name  */
  name: string;
  /** Visible Defaults to: Yes. */
  visible?: 'No' | 'Yes' | null;
}
/**
 * Exposes all fields present in credit_notes as a typescript
 * interface.
 */
export interface CreditNotes {
  /** Amount Defaults to: 0. */
  amount: number;
  /** Date Issued Defaults to: curdate(). */
  created_at: Date;
  /** Currency Code Defaults to: GBP. */
  currency: 'GBP' | 'EUR';
  /** Description  */
  description?: string | null;
  /** ID  */
  id: number;
  /** Invoice  */
  invoice_id?: number | null;
  /** Paid Defaults to: No. */
  paid: 'No' | 'Yes';
  /** Reference  */
  reference: string;
  /** Supplier  */
  supplier_id: number;
}

/**
 * Exposes the same fields as CreditNotes,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CreditNotesWithDefaults {
  /** Amount Defaults to: 0. */
  amount?: number;
  /** Date Issued Defaults to: curdate(). */
  created_at?: Date;
  /** Currency Code Defaults to: GBP. */
  currency?: 'GBP' | 'EUR';
  /** Description  */
  description?: string | null;
  /** ID  */
  id?: number;
  /** Invoice  */
  invoice_id?: number | null;
  /** Paid Defaults to: No. */
  paid?: 'No' | 'Yes';
  /** Reference  */
  reference: string;
  /** Supplier  */
  supplier_id: number;
}
/**
 * Exposes all fields present in credit_notes_customers as a typescript
 * interface.
 */
export interface CreditNotesCustomers {
  /** Amount Defaults to: 0. */
  amount: number;
  /** Date Issued Defaults to: curdate(). */
  created_at: Date;
  /** Currency Code Defaults to: GBP. */
  currency: 'GBP' | 'EUR';
  /** Customer  */
  customer_id: number;
  /** Description  */
  description?: string | null;
  /** ID  */
  id: number;
  /** Invoice  */
  invoice_id?: number | null;
  /** Invoiced Item ID  */
  invoiced_item_id?: number | null;
  /** Paid Defaults to: No. */
  paid: 'No' | 'Yes';
  /** Reference  */
  reference: string;
  /** Restock Defaults to: No. */
  restock?: 'No' | 'Yes' | null;
}

/**
 * Exposes the same fields as CreditNotesCustomers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CreditNotesCustomersWithDefaults {
  /** Amount Defaults to: 0. */
  amount?: number;
  /** Date Issued Defaults to: curdate(). */
  created_at?: Date;
  /** Currency Code Defaults to: GBP. */
  currency?: 'GBP' | 'EUR';
  /** Customer  */
  customer_id: number;
  /** Description  */
  description?: string | null;
  /** ID  */
  id?: number;
  /** Invoice  */
  invoice_id?: number | null;
  /** Invoiced Item ID  */
  invoiced_item_id?: number | null;
  /** Paid Defaults to: No. */
  paid?: 'No' | 'Yes';
  /** Reference  */
  reference: string;
  /** Restock Defaults to: No. */
  restock?: 'No' | 'Yes' | null;
}
/**
 * Exposes all fields present in customer_address as a typescript
 * interface.
 */
export interface CustomerAddress {
  /** Customer Name  */
  customer_id?: number | null;
  /** Delivery Address Four  */
  delivery_address_four?: string | null;
  /** Delivery Address 1  */
  delivery_address_one?: string | null;
  /** Delivery Address Line 3  */
  delivery_address_three?: string | null;
  /** Delivery Address Line 2  */
  delivery_address_two?: string | null;
  /** Delivery Postcode  */
  delivery_postcode?: string | null;
  /** ID  */
  id: number;
  /** Invoice Address Four  */
  invoice_address_four?: string | null;
  /** Invoice Address 1  */
  invoice_address_one?: string | null;
  /** Invoice Address Line 3  */
  invoice_address_three?: string | null;
  /** Invoice Address Line 2  */
  invoice_address_two?: string | null;
  /** Invoice Postcode  */
  invoice_postcode?: string | null;
}

/**
 * Exposes the same fields as CustomerAddress,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CustomerAddressWithDefaults {
  /** Customer Name  */
  customer_id?: number | null;
  /** Delivery Address Four  */
  delivery_address_four?: string | null;
  /** Delivery Address 1  */
  delivery_address_one?: string | null;
  /** Delivery Address Line 3  */
  delivery_address_three?: string | null;
  /** Delivery Address Line 2  */
  delivery_address_two?: string | null;
  /** Delivery Postcode  */
  delivery_postcode?: string | null;
  /** ID  */
  id?: number;
  /** Invoice Address Four  */
  invoice_address_four?: string | null;
  /** Invoice Address 1  */
  invoice_address_one?: string | null;
  /** Invoice Address Line 3  */
  invoice_address_three?: string | null;
  /** Invoice Address Line 2  */
  invoice_address_two?: string | null;
  /** Invoice Postcode  */
  invoice_postcode?: string | null;
}
/**
 * Exposes all fields present in customer_payments as a typescript
 * interface.
 */
export interface CustomerPayments {
  /** Payment Amount  */
  amount: number;
  /** Currency Defaults to: GBP. */
  currency: 'GBP' | 'EUR';
  /** Customer  */
  customer_id: number;
  /** Payment Date Defaults to: curdate(). */
  date: Date;
  /** ID  */
  id: number;
  /** Invoice ID  */
  invoice_id?: number | null;
  /** Linked Payment ID  */
  linked_payment_id?: number | null;
  /** Reference  */
  reference?: string | null;
  /** Type Defaults to: Transfer. */
  type: 'Transfer' | 'Cash' | 'Cheque' | 'Credit Card' | 'Debit Card' | 'Online Payment' | 'Credit';
}

/**
 * Exposes the same fields as CustomerPayments,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CustomerPaymentsWithDefaults {
  /** Payment Amount  */
  amount: number;
  /** Currency Defaults to: GBP. */
  currency?: 'GBP' | 'EUR';
  /** Customer  */
  customer_id: number;
  /** Payment Date Defaults to: curdate(). */
  date?: Date;
  /** ID  */
  id?: number;
  /** Invoice ID  */
  invoice_id?: number | null;
  /** Linked Payment ID  */
  linked_payment_id?: number | null;
  /** Reference  */
  reference?: string | null;
  /** Type Defaults to: Transfer. */
  type?: 'Transfer' | 'Cash' | 'Cheque' | 'Credit Card' | 'Debit Card' | 'Online Payment' | 'Credit';
}
/**
 * Exposes all fields present in customers as a typescript
 * interface.
 */
export interface Customers {
  /** Account Name  */
  account_name?: string | null;
  /** Account Number  */
  account_number?: string | null;
  /** Account Status Defaults to: Credit Account. */
  account_status: 'Credit Account' | 'Payment with Order' | 'Payment Before Dispatch' | 'In Dispute' | 'Closed Account';
  /** Date Joined Defaults to: curdate(). */
  created_at: Date;
  /** Currency Code Defaults to: GBP. */
  currency_code: 'GBP' | 'EUR';
  /** Customer Type Defaults to: Retail. */
  customer_type: 'Wholesale' | 'Retail';
  /** Discount Defaults to: 0. */
  discount: number;
  /** Email  */
  email?: string | null;
  /** First Name  */
  forename?: string | null;
  /** ID  */
  id: number;
  /** Last Payment Date  */
  last_payment_date?: Date | null;
  /** Outstanding Balance Defaults to: 0. */
  outstanding_balance?: number | null;
  /** Password  */
  password?: string | null;
  /** Pending Approval Defaults to: No. */
  pending_approval: 'No' | 'Yes';
  /** Primary Phone  */
  phone_number_primary?: string | null;
  /** Secondary Phone  */
  phone_number_secondary?: string | null;
  /** Registration Number  */
  registration_number?: string | null;
  /** Last Name  */
  surname?: string | null;
  /** VAT Number  */
  vat_number?: string | null;
  /** VAT Type Defaults to: UK Standard. */
  vat_type: 'UK Standard' | 'UK Zero Rate' | 'UK Exempt' | 'EU Export' | 'Non EU Export';
}

/**
 * Exposes the same fields as Customers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CustomersWithDefaults {
  /** Account Name  */
  account_name?: string | null;
  /** Account Number  */
  account_number?: string | null;
  /** Account Status Defaults to: Credit Account. */
  account_status?:
    | 'Credit Account'
    | 'Payment with Order'
    | 'Payment Before Dispatch'
    | 'In Dispute'
    | 'Closed Account';
  /** Date Joined Defaults to: curdate(). */
  created_at?: Date;
  /** Currency Code Defaults to: GBP. */
  currency_code?: 'GBP' | 'EUR';
  /** Customer Type Defaults to: Retail. */
  customer_type?: 'Wholesale' | 'Retail';
  /** Discount Defaults to: 0. */
  discount?: number;
  /** Email  */
  email?: string | null;
  /** First Name  */
  forename?: string | null;
  /** ID  */
  id?: number;
  /** Last Payment Date  */
  last_payment_date?: Date | null;
  /** Outstanding Balance Defaults to: 0. */
  outstanding_balance?: number | null;
  /** Password  */
  password?: string | null;
  /** Pending Approval Defaults to: No. */
  pending_approval?: 'No' | 'Yes';
  /** Primary Phone  */
  phone_number_primary?: string | null;
  /** Secondary Phone  */
  phone_number_secondary?: string | null;
  /** Registration Number  */
  registration_number?: string | null;
  /** Last Name  */
  surname?: string | null;
  /** VAT Number  */
  vat_number?: string | null;
  /** VAT Type Defaults to: UK Standard. */
  vat_type?: 'UK Standard' | 'UK Zero Rate' | 'UK Exempt' | 'EU Export' | 'Non EU Export';
}
/**
 * Exposes all fields present in discount_codes as a typescript
 * interface.
 */
export interface DiscountCodes {
  /** Discount Amount  */
  amount: number;
  /** Code  */
  code: string;
  /** ID  */
  id: number;
}

/**
 * Exposes the same fields as DiscountCodes,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface DiscountCodesWithDefaults {
  /** Discount Amount  */
  amount: number;
  /** Code  */
  code: string;
  /** ID  */
  id?: number;
}
/**
 * Exposes all fields present in document_locations as a typescript
 * interface.
 */
export interface DocumentLocations {
  /** ID  */
  id: number;
  /** Document Location  */
  location: string;
  /** Document Name  */
  name: string;
}

/**
 * Exposes the same fields as DocumentLocations,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface DocumentLocationsWithDefaults {
  /** ID  */
  id?: number;
  /** Document Location  */
  location: string;
  /** Document Name  */
  name: string;
}
/**
 * Exposes all fields present in expense_options as a typescript
 * interface.
 */
export interface ExpenseOptions {
  /** ID  */
  id: number;
  /** Type  */
  type: string;
}

/**
 * Exposes the same fields as ExpenseOptions,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ExpenseOptionsWithDefaults {
  /** ID  */
  id?: number;
  /** Type  */
  type: string;
}
/**
 * Exposes all fields present in expired_items as a typescript
 * interface.
 */
export interface ExpiredItems {
  /** Added Date Defaults to: curdate(). */
  added_date?: Date | null;
  /** Barcode  */
  barcode: string;
  /** Expiry Date  */
  expiry_date: Date;
  /** ID  */
  id: number;
  /** Item ID  */
  item_id: number;
  /** Packaging Format  */
  packing_format: 'Individual' | 'Box' | 'Pallet';
  /** Purchase Date  */
  purchase_date?: Date | null;
  /** Purchase Price  */
  purchase_price: number;
  /** Quantity  */
  quantity: number;
  /** Stock Reference  */
  stock_id: number;
  /** Supplier Invoice ID  */
  supplier_invoice_id?: number | null;
  /** Warehouse  */
  warehouse_id?: number | null;
}

/**
 * Exposes the same fields as ExpiredItems,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ExpiredItemsWithDefaults {
  /** Added Date Defaults to: curdate(). */
  added_date?: Date | null;
  /** Barcode  */
  barcode: string;
  /** Expiry Date  */
  expiry_date: Date;
  /** ID  */
  id?: number;
  /** Item ID  */
  item_id: number;
  /** Packaging Format  */
  packing_format: 'Individual' | 'Box' | 'Pallet';
  /** Purchase Date  */
  purchase_date?: Date | null;
  /** Purchase Price  */
  purchase_price: number;
  /** Quantity  */
  quantity: number;
  /** Stock Reference  */
  stock_id: number;
  /** Supplier Invoice ID  */
  supplier_invoice_id?: number | null;
  /** Warehouse  */
  warehouse_id?: number | null;
}
/**
 * Exposes all fields present in general_ledger as a typescript
 * interface.
 */
export interface GeneralLedger {
  /** Account Code  */
  account_code?: string | null;
  /** Credit  */
  credit: number;
  /** Date  */
  date: Date;
  /** Debit  */
  debit: number;
  /** Description  */
  description: string;
  /** ID  */
  id: number;
}

/**
 * Exposes the same fields as GeneralLedger,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface GeneralLedgerWithDefaults {
  /** Account Code  */
  account_code?: string | null;
  /** Credit  */
  credit: number;
  /** Date  */
  date: Date;
  /** Debit  */
  debit: number;
  /** Description  */
  description: string;
  /** ID  */
  id?: number;
}
/**
 * Exposes all fields present in image_locations as a typescript
 * interface.
 */
export interface ImageLocations {
  /** ID  */
  id: number;
  /** Image  */
  image_file_name?: string | null;
  /** Page Section ID  */
  page_section_id: number;
  /** Visible Defaults to: Yes. */
  visible: 'Yes' | 'No';
}

/**
 * Exposes the same fields as ImageLocations,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ImageLocationsWithDefaults {
  /** ID  */
  id?: number;
  /** Image  */
  image_file_name?: string | null;
  /** Page Section ID  */
  page_section_id: number;
  /** Visible Defaults to: Yes. */
  visible?: 'Yes' | 'No';
}
/**
 * Exposes all fields present in interest_charges as a typescript
 * interface.
 */
export interface InterestCharges {
  /** Charge Amount  */
  amount: number;
  /** Charge Date Defaults to: curdate(). */
  charge_date: Date;
  /** ID  */
  id: number;
  /** Invoice ID  */
  invoice_id: number;
}

/**
 * Exposes the same fields as InterestCharges,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface InterestChargesWithDefaults {
  /** Charge Amount  */
  amount: number;
  /** Charge Date Defaults to: curdate(). */
  charge_date?: Date;
  /** ID  */
  id?: number;
  /** Invoice ID  */
  invoice_id: number;
}
/**
 * Exposes all fields present in invoiced_items as a typescript
 * interface.
 */
export interface InvoicedItems {
  /** Date Invoiced Defaults to: curdate(). */
  created_at: Date;
  /** Discount Defaults to: 0. */
  discount?: number | null;
  /** ID  */
  id: number;
  /** Invoice ID  */
  invoice_id: number;
  /** Item ID  */
  item_id: number;
  /** Quantity  */
  quantity: number;
  /** Restocked Defaults to: No. */
  restocked: 'No' | 'Yes';
  /** Unit Defaults to: Unit. */
  unit: 'Unit' | 'Box' | 'Pallet' | 'Retail Box';
}

/**
 * Exposes the same fields as InvoicedItems,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface InvoicedItemsWithDefaults {
  /** Date Invoiced Defaults to: curdate(). */
  created_at?: Date;
  /** Discount Defaults to: 0. */
  discount?: number | null;
  /** ID  */
  id?: number;
  /** Invoice ID  */
  invoice_id: number;
  /** Item ID  */
  item_id: number;
  /** Quantity  */
  quantity: number;
  /** Restocked Defaults to: No. */
  restocked?: 'No' | 'Yes';
  /** Unit Defaults to: Unit. */
  unit?: 'Unit' | 'Box' | 'Pallet' | 'Retail Box';
}
/**
 * Exposes all fields present in invoices as a typescript
 * interface.
 */
export interface Invoices {
  /** Delivery Address  */
  address_id?: number | null;
  /** Billing Address  */
  billing_address_id?: number | null;
  /** Date Invoiced Defaults to: curdate(). */
  created_at?: Date | null;
  /** Customer Name  */
  customer_id?: number | null;
  /** Delivery Date  */
  delivery_date?: Date | null;
  /** Delivery Type  */
  delivery_type: 'Delivery' | 'Collection';
  /** Discount Value Defaults to: 0.00. */
  discount_value?: number | null;
  /** Gross Value Defaults to: 0.00. */
  gross_value?: number | null;
  /** ID  */
  id: number;
  /** Notes  */
  notes?: string | null;
  /** Outstanding Balance  */
  outstanding_balance?: number | null;
  /** Paid  */
  payment_status: 'No' | 'Yes';
  /** Printed  */
  printed: 'No' | 'Yes';
  /** Status Defaults to: Pending. */
  status: 'Pending' | 'Overdue' | 'Complete';
  /** Title  */
  title: string;
  /** Total Defaults to: 0. */
  total?: number | null;
  /** Type Defaults to: Retail. */
  type: 'Retail' | 'Wholesale';
  /** VAT Defaults to: 0.00. */
  VAT?: number | null;
  /** Warehouse ID Defaults to: 1. */
  warehouse_id?: number | null;
}

/**
 * Exposes the same fields as Invoices,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface InvoicesWithDefaults {
  /** Delivery Address  */
  address_id?: number | null;
  /** Billing Address  */
  billing_address_id?: number | null;
  /** Date Invoiced Defaults to: curdate(). */
  created_at?: Date | null;
  /** Customer Name  */
  customer_id?: number | null;
  /** Delivery Date  */
  delivery_date?: Date | null;
  /** Delivery Type  */
  delivery_type: 'Delivery' | 'Collection';
  /** Discount Value Defaults to: 0.00. */
  discount_value?: number | null;
  /** Gross Value Defaults to: 0.00. */
  gross_value?: number | null;
  /** ID  */
  id?: number;
  /** Notes  */
  notes?: string | null;
  /** Outstanding Balance  */
  outstanding_balance?: number | null;
  /** Paid  */
  payment_status: 'No' | 'Yes';
  /** Printed  */
  printed: 'No' | 'Yes';
  /** Status Defaults to: Pending. */
  status?: 'Pending' | 'Overdue' | 'Complete';
  /** Title  */
  title: string;
  /** Total Defaults to: 0. */
  total?: number | null;
  /** Type Defaults to: Retail. */
  type?: 'Retail' | 'Wholesale';
  /** VAT Defaults to: 0.00. */
  VAT?: number | null;
  /** Warehouse ID Defaults to: 1. */
  warehouse_id?: number | null;
}
/**
 * Exposes all fields present in items as a typescript
 * interface.
 */
export interface Items {
  /** Date Added Defaults to: curdate(). */
  added_at: Date;
  /** Wholesale Box Price Defaults to: 0. */
  box_price: number;
  /** Box Quantity Defaults to: 1. */
  box_size?: number | null;
  /** Box Weight (Kg)  */
  box_weight?: number | null;
  /** Brand  */
  brand?: string | null;
  /** Category  */
  category?: string | null;
  /** Description  */
  description?: string | null;
  /** Discount Defaults to: 0. */
  discount?: number | null;
  /** Featured Defaults to: No. */
  featured: 'Yes' | 'No';
  /** ID  */
  id: number;
  /** Image  */
  image_file_name?: string | null;
  /** Item Name  */
  item_name: string;
  /** Obsolete Defaults to: No. */
  obsolete: 'Yes' | 'No';
  /** Offer ID  */
  offer_id?: number | null;
  /** Pallet Price  */
  pallet_price?: number | null;
  /** Pallet Quantity Defaults to: 1. */
  pallet_size?: number | null;
  /** Pallet Weight (Kg)  */
  pallet_weight?: number | null;
  /** Retail Box Price Defaults to: 0. */
  retail_box_price: number;
  /** Retail Price  */
  retail_price: number;
  /** Stock Code  */
  stock_code: string;
  /** Sub-category  */
  sub_category?: string | null;
  /** Supplier Code  */
  supplier_code?: string | null;
  /** Total Sold Defaults to: 0. */
  total_sold?: number | null;
  /** Type Defaults to: Product. */
  type: 'Product' | 'Expense';
  /** Unit Cost  */
  unit_cost: number;
  /** VAT Rate Defaults to: UK Standard Rate. */
  vat_rate?: 'UK Standard Rate' | 'UK Zero Rate' | 'UK Exempt Rate' | 'UK Reduced Rate' | null;
  /** Visibility Defaults to: Both. */
  visibility: 'Retail' | 'Wholesale' | 'Both';
  /** Visible Defaults to: No. */
  visible: 'Yes' | 'No';
  /** Individual Weight (Kg)  */
  weight?: number | null;
  /** Individual Wholesale Price  */
  wholesale_price?: number | null;
}

/**
 * Exposes the same fields as Items,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ItemsWithDefaults {
  /** Date Added Defaults to: curdate(). */
  added_at?: Date;
  /** Wholesale Box Price Defaults to: 0. */
  box_price?: number;
  /** Box Quantity Defaults to: 1. */
  box_size?: number | null;
  /** Box Weight (Kg)  */
  box_weight?: number | null;
  /** Brand  */
  brand?: string | null;
  /** Category  */
  category?: string | null;
  /** Description  */
  description?: string | null;
  /** Discount Defaults to: 0. */
  discount?: number | null;
  /** Featured Defaults to: No. */
  featured?: 'Yes' | 'No';
  /** ID  */
  id?: number;
  /** Image  */
  image_file_name?: string | null;
  /** Item Name  */
  item_name: string;
  /** Obsolete Defaults to: No. */
  obsolete?: 'Yes' | 'No';
  /** Offer ID  */
  offer_id?: number | null;
  /** Pallet Price  */
  pallet_price?: number | null;
  /** Pallet Quantity Defaults to: 1. */
  pallet_size?: number | null;
  /** Pallet Weight (Kg)  */
  pallet_weight?: number | null;
  /** Retail Box Price Defaults to: 0. */
  retail_box_price?: number;
  /** Retail Price  */
  retail_price: number;
  /** Stock Code  */
  stock_code: string;
  /** Sub-category  */
  sub_category?: string | null;
  /** Supplier Code  */
  supplier_code?: string | null;
  /** Total Sold Defaults to: 0. */
  total_sold?: number | null;
  /** Type Defaults to: Product. */
  type?: 'Product' | 'Expense';
  /** Unit Cost  */
  unit_cost: number;
  /** VAT Rate Defaults to: UK Standard Rate. */
  vat_rate?: 'UK Standard Rate' | 'UK Zero Rate' | 'UK Exempt Rate' | 'UK Reduced Rate' | null;
  /** Visibility Defaults to: Both. */
  visibility?: 'Retail' | 'Wholesale' | 'Both';
  /** Visible Defaults to: No. */
  visible?: 'Yes' | 'No';
  /** Individual Weight (Kg)  */
  weight?: number | null;
  /** Individual Wholesale Price  */
  wholesale_price?: number | null;
}
/**
 * Exposes all fields present in mailing_list as a typescript
 * interface.
 */
export interface MailingList {
  /** Email  */
  email: string;
  /** ID  */
  id: number;
  /** Signup Date Defaults to: curdate(). */
  signup_date: Date;
}

/**
 * Exposes the same fields as MailingList,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface MailingListWithDefaults {
  /** Email  */
  email: string;
  /** ID  */
  id?: number;
  /** Signup Date Defaults to: curdate(). */
  signup_date?: Date;
}
/**
 * Exposes all fields present in nutrition_info as a typescript
 * interface.
 */
export interface NutritionInfo {
  /** Calories  */
  calories?: number | null;
  /** Carbohydrate  */
  carbohydrate?: number | null;
  /** Energy  */
  energy?: number | null;
  /** Fat  */
  fat?: number | null;
  /** ID  */
  id: number;
  /** Item ID  */
  item_id: number;
  /** Protein  */
  protein?: number | null;
  /** Salt  */
  salt?: number | null;
  /** Saturated Fat  */
  saturated_fat?: number | null;
  /** Sugars  */
  sugars?: number | null;
}

/**
 * Exposes the same fields as NutritionInfo,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface NutritionInfoWithDefaults {
  /** Calories  */
  calories?: number | null;
  /** Carbohydrate  */
  carbohydrate?: number | null;
  /** Energy  */
  energy?: number | null;
  /** Fat  */
  fat?: number | null;
  /** ID  */
  id?: number;
  /** Item ID  */
  item_id: number;
  /** Protein  */
  protein?: number | null;
  /** Salt  */
  salt?: number | null;
  /** Saturated Fat  */
  saturated_fat?: number | null;
  /** Sugars  */
  sugars?: number | null;
}
/**
 * Exposes all fields present in offers as a typescript
 * interface.
 */
export interface Offers {
  /** Active Defaults to: No. */
  active: 'Yes' | 'No';
  /** Discount Amount  */
  amount?: number | null;
  /** Customer  */
  customer_id?: number | null;
  /** ID  */
  id: number;
  /** Offer Name  */
  name: string;
  /** Offer Code  */
  offer_code: string;
  /** Offer End Date  */
  offer_end?: Date | null;
  /** Offer Start Date  */
  offer_start?: Date | null;
  /** Quantity Limit  */
  quantity_limit?: number | null;
  /** Discount Type  */
  type?: 'Percentage' | 'Amount' | null;
}

/**
 * Exposes the same fields as Offers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface OffersWithDefaults {
  /** Active Defaults to: No. */
  active?: 'Yes' | 'No';
  /** Discount Amount  */
  amount?: number | null;
  /** Customer  */
  customer_id?: number | null;
  /** ID  */
  id?: number;
  /** Offer Name  */
  name: string;
  /** Offer Code  */
  offer_code: string;
  /** Offer End Date  */
  offer_end?: Date | null;
  /** Offer Start Date  */
  offer_start?: Date | null;
  /** Quantity Limit  */
  quantity_limit?: number | null;
  /** Discount Type  */
  type?: 'Percentage' | 'Amount' | null;
}
/**
 * Exposes all fields present in page_section_text as a typescript
 * interface.
 */
export interface PageSectionText {
  /** Element Type  */
  element_type: 'Header' | 'Paragraph' | 'Other';
  /** ID  */
  id: number;
  /** Page Section ID  */
  page_section_id: number;
  /** Text Content  */
  text_content: string;
}

/**
 * Exposes the same fields as PageSectionText,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface PageSectionTextWithDefaults {
  /** Element Type  */
  element_type: 'Header' | 'Paragraph' | 'Other';
  /** ID  */
  id?: number;
  /** Page Section ID  */
  page_section_id: number;
  /** Text Content  */
  text_content: string;
}
/**
 * Exposes all fields present in page_sections as a typescript
 * interface.
 */
export interface PageSections {
  /** ID  */
  id: number;
  /** Section Name  */
  name: string;
}

/**
 * Exposes the same fields as PageSections,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface PageSectionsWithDefaults {
  /** ID  */
  id?: number;
  /** Section Name  */
  name: string;
}
/**
 * Exposes all fields present in payments as a typescript
 * interface.
 */
export interface Payments {
  /** Net Total  */
  amount: number;
  /** Category  */
  category: number;
  /** Date Defaults to: curdate(). */
  date: Date;
  /** Description  */
  description?: string | null;
  /** ID  */
  id: number;
  /** Payment Type  */
  payment_type: 'Cash' | 'Cheque' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Online Payment' | 'Other';
  /** Reference  */
  reference: string;
  /** Supplier ID  */
  supplier_id?: number | null;
  /** Total  */
  total?: number | null;
  /** VAT  */
  vat?: number | null;
}

/**
 * Exposes the same fields as Payments,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface PaymentsWithDefaults {
  /** Net Total  */
  amount: number;
  /** Category  */
  category: number;
  /** Date Defaults to: curdate(). */
  date?: Date;
  /** Description  */
  description?: string | null;
  /** ID  */
  id?: number;
  /** Payment Type  */
  payment_type: 'Cash' | 'Cheque' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Online Payment' | 'Other';
  /** Reference  */
  reference: string;
  /** Supplier ID  */
  supplier_id?: number | null;
  /** Total  */
  total?: number | null;
  /** VAT  */
  vat?: number | null;
}
/**
 * Exposes all fields present in postcodelatlng as a typescript
 * interface.
 */
export interface Postcodelatlng {
  id: number;
  latitude?: number | null;
  longitude?: number | null;
  postcode: string;
}

/**
 * Exposes the same fields as Postcodelatlng,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface PostcodelatlngWithDefaults {
  id?: number;
  latitude?: number | null;
  longitude?: number | null;
  postcode: string;
}
/**
 * Exposes all fields present in price_list as a typescript
 * interface.
 */
export interface PriceList {
  /** Date Added Defaults to: curdate(). */
  added_at: Date;
  /** Customer Name  */
  customer_id: number;
  /** ID  */
  id: number;
  /** Reference  */
  reference: string;
}

/**
 * Exposes the same fields as PriceList,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface PriceListWithDefaults {
  /** Date Added Defaults to: curdate(). */
  added_at?: Date;
  /** Customer Name  */
  customer_id: number;
  /** ID  */
  id?: number;
  /** Reference  */
  reference: string;
}
/**
 * Exposes all fields present in price_list_items as a typescript
 * interface.
 */
export interface PriceListItems {
  /** Date Added Defaults to: curdate(). */
  created_at: Date;
  /** ID  */
  id: number;
  /** Item ID  */
  item_id: number;
  /** Price  */
  price: number;
  /** Price List ID  */
  price_list_id: number;
}

/**
 * Exposes the same fields as PriceListItems,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface PriceListItemsWithDefaults {
  /** Date Added Defaults to: curdate(). */
  created_at?: Date;
  /** ID  */
  id?: number;
  /** Item ID  */
  item_id: number;
  /** Price  */
  price: number;
  /** Price List ID  */
  price_list_id: number;
}
/**
 * Exposes all fields present in retail_item_images as a typescript
 * interface.
 */
export interface RetailItemImages {
  /** ID  */
  id: number;
  /** Image Location  */
  image_file_name: string;
  /** Item ID  */
  item_id: number;
}

/**
 * Exposes the same fields as RetailItemImages,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface RetailItemImagesWithDefaults {
  /** ID  */
  id?: number;
  /** Image Location  */
  image_file_name: string;
  /** Item ID  */
  item_id: number;
}
/**
 * Exposes all fields present in retail_users as a typescript
 * interface.
 */
export interface RetailUsers {
  /** Customer ID  */
  customer_id: number;
  /** Email  */
  email: string;
  /** Forename  */
  forename: string;
  /** ID  */
  id: number;
  /** Last Login  */
  last_login?: Date | null;
  /** Password  */
  password: string;
  /** Phone Number  */
  phone_number?: string | null;
  /** Surname  */
  surname: string;
  /** User Type Defaults to: Retail. */
  user_type: 'Wholesale' | 'Retail';
}

/**
 * Exposes the same fields as RetailUsers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface RetailUsersWithDefaults {
  /** Customer ID  */
  customer_id: number;
  /** Email  */
  email: string;
  /** Forename  */
  forename: string;
  /** ID  */
  id?: number;
  /** Last Login  */
  last_login?: Date | null;
  /** Password  */
  password: string;
  /** Phone Number  */
  phone_number?: string | null;
  /** Surname  */
  surname: string;
  /** User Type Defaults to: Retail. */
  user_type?: 'Wholesale' | 'Retail';
}
/**
 * Exposes all fields present in settings as a typescript
 * interface.
 */
export interface Settings {
  /** Description  */
  description?: string | null;
  /** ID  */
  id: number;
  /** Name  */
  name: string;
  /** Key  */
  setting_key: string;
  /** Type  */
  setting_type: 'Number' | 'Text' | 'Checkbox' | 'Redacted';
  /** Value  */
  setting_value: string;
}

/**
 * Exposes the same fields as Settings,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SettingsWithDefaults {
  /** Description  */
  description?: string | null;
  /** ID  */
  id?: number;
  /** Name  */
  name: string;
  /** Key  */
  setting_key: string;
  /** Type  */
  setting_type: 'Number' | 'Text' | 'Checkbox' | 'Redacted';
  /** Value  */
  setting_value: string;
}
/**
 * Exposes all fields present in stock_keys as a typescript
 * interface.
 */
export interface StockKeys {
  /** ID  */
  id: number;
  /** Invoiced Item ID  */
  invoiced_item_id: number;
  /** Quantity  */
  quantity: number;
  /** Stock ID  */
  stock_id: number;
}

/**
 * Exposes the same fields as StockKeys,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface StockKeysWithDefaults {
  /** ID  */
  id?: number;
  /** Invoiced Item ID  */
  invoiced_item_id: number;
  /** Quantity  */
  quantity: number;
  /** Stock ID  */
  stock_id: number;
}
/**
 * Exposes all fields present in stocked_items as a typescript
 * interface.
 */
export interface StockedItems {
  /** Barcode  */
  barcode: string;
  /** Discount Defaults to: 0. */
  discount?: number | null;
  /** Discount Type Defaults to: Number. */
  discount_type: 'Number' | 'Percentage';
  /** Expired Defaults to: No. */
  expired?: 'No' | 'Yes' | null;
  /** Expiry Date  */
  expiry_date: Date;
  /** ID  */
  id: number;
  /** Item ID  */
  item_id: number;
  /** Packaging Format  */
  packing_format: 'Individual' | 'Box' | 'Pallet';
  /** Purchase Price Defaults to: 0. */
  price?: number | null;
  /** Purchase Date  */
  purchase_date?: Date | null;
  /** Final Price  */
  purchase_price: number;
  /** Quantity  */
  quantity: number;
  /** Supplier Invoice ID  */
  supplier_invoice_id?: number | null;
  /** Warehouse  */
  warehouse_id?: number | null;
}

/**
 * Exposes the same fields as StockedItems,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface StockedItemsWithDefaults {
  /** Barcode  */
  barcode: string;
  /** Discount Defaults to: 0. */
  discount?: number | null;
  /** Discount Type Defaults to: Number. */
  discount_type?: 'Number' | 'Percentage';
  /** Expired Defaults to: No. */
  expired?: 'No' | 'Yes' | null;
  /** Expiry Date  */
  expiry_date: Date;
  /** ID  */
  id?: number;
  /** Item ID  */
  item_id: number;
  /** Packaging Format  */
  packing_format: 'Individual' | 'Box' | 'Pallet';
  /** Purchase Price Defaults to: 0. */
  price?: number | null;
  /** Purchase Date  */
  purchase_date?: Date | null;
  /** Final Price  */
  purchase_price: number;
  /** Quantity  */
  quantity: number;
  /** Supplier Invoice ID  */
  supplier_invoice_id?: number | null;
  /** Warehouse  */
  warehouse_id?: number | null;
}
/**
 * Exposes all fields present in sub_categories as a typescript
 * interface.
 */
export interface SubCategories {
  /** Parent Category Defaults to: 14. */
  category_id: number;
  /** ID  */
  id: number;
  /** Name  */
  name: string;
}

/**
 * Exposes the same fields as SubCategories,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SubCategoriesWithDefaults {
  /** Parent Category Defaults to: 14. */
  category_id?: number;
  /** ID  */
  id?: number;
  /** Name  */
  name: string;
}
/**
 * Exposes all fields present in supplier_invoices as a typescript
 * interface.
 */
export interface SupplierInvoices {
  /** Date Invoiced Defaults to: curdate(). */
  created_at: Date;
  /** ID  */
  id: number;
  /** Net Value Defaults to: 0. */
  net_value?: number | null;
  /** Notes  */
  notes?: string | null;
  /** Outstanding Balance Defaults to: 0. */
  outstanding_balance?: number | null;
  /** Paid Defaults to: No. */
  payment_status?: 'Yes' | 'No' | null;
  /** Reference  */
  reference: string;
  /** Supplier ID  */
  supplier_id: number;
  /** Supplier Reference  */
  supplier_reference?: string | null;
  /** Total (GBP)  */
  total?: number | null;
  /** Total (EUR)  */
  total_eur?: number | null;
  /** VAT Defaults to: 0. */
  VAT?: number | null;
}

/**
 * Exposes the same fields as SupplierInvoices,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SupplierInvoicesWithDefaults {
  /** Date Invoiced Defaults to: curdate(). */
  created_at?: Date;
  /** ID  */
  id?: number;
  /** Net Value Defaults to: 0. */
  net_value?: number | null;
  /** Notes  */
  notes?: string | null;
  /** Outstanding Balance Defaults to: 0. */
  outstanding_balance?: number | null;
  /** Paid Defaults to: No. */
  payment_status?: 'Yes' | 'No' | null;
  /** Reference  */
  reference: string;
  /** Supplier ID  */
  supplier_id: number;
  /** Supplier Reference  */
  supplier_reference?: string | null;
  /** Total (GBP)  */
  total?: number | null;
  /** Total (EUR)  */
  total_eur?: number | null;
  /** VAT Defaults to: 0. */
  VAT?: number | null;
}
/**
 * Exposes all fields present in supplier_payments as a typescript
 * interface.
 */
export interface SupplierPayments {
  /** Amount EUR  */
  amount_eur: number;
  /** Amount GBP  */
  amount_gbp: number;
  /** Payment Date Defaults to: curdate(). */
  date: Date;
  /** From Defaults to: Bank Current Account. */
  from_account: 'Bank Current Account' | 'Cash';
  /** ID  */
  id: number;
  /** Invoice  */
  invoice_id: number;
  /** Reference  */
  reference?: string | null;
  /** Supplier  */
  supplier_id: number;
}

/**
 * Exposes the same fields as SupplierPayments,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SupplierPaymentsWithDefaults {
  /** Amount EUR  */
  amount_eur: number;
  /** Amount GBP  */
  amount_gbp: number;
  /** Payment Date Defaults to: curdate(). */
  date?: Date;
  /** From Defaults to: Bank Current Account. */
  from_account?: 'Bank Current Account' | 'Cash';
  /** ID  */
  id?: number;
  /** Invoice  */
  invoice_id: number;
  /** Reference  */
  reference?: string | null;
  /** Supplier  */
  supplier_id: number;
}
/**
 * Exposes all fields present in supplier_types as a typescript
 * interface.
 */
export interface SupplierTypes {
  /** ID  */
  id: number;
  /** Type  */
  type: string;
}

/**
 * Exposes the same fields as SupplierTypes,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SupplierTypesWithDefaults {
  /** ID  */
  id?: number;
  /** Type  */
  type: string;
}
/**
 * Exposes all fields present in suppliers as a typescript
 * interface.
 */
export interface Suppliers {
  /** Account Code  */
  account_code: string;
  /** Account Name  */
  account_name: string;
  /** Account Status Defaults to: Credit Account. */
  account_status: 'Credit Account' | 'Payment with Order' | 'Payment before Dispatch' | 'In Dispute' | 'Closed Account';
  /** Type  */
  account_type: number;
  /** Address Line 1  */
  address_line_1: string;
  /** Address Line 2  */
  address_line_2?: string | null;
  /** Address Line 3  */
  address_line_3?: string | null;
  /** Address Line 4  */
  address_line_4?: string | null;
  /** Bank Account Number  */
  bank_account_number?: string | null;
  /** Bank Account Sort Code  */
  bank_account_sort_code?: string | null;
  /** Country Name Defaults to: United Kingdom. */
  country_name: 'United Kingdom' | 'Greece' | 'Belgium';
  /** Currency Code Defaults to: GBP. */
  currency_code: 'GBP' | 'EUR';
  /** Email  */
  email?: string | null;
  /** ID  */
  id: number;
  /** Main Contact Name  */
  main_contact_name?: string | null;
  /** Primary Phone  */
  phone_number_primary?: string | null;
  /** Secondary Phone  */
  phone_number_secondary?: string | null;
  /** Postcode  */
  postcode?: string | null;
  /** VAT Number  */
  vat_number?: string | null;
  /** VAT Type Defaults to: UK Standard. */
  vat_type: 'UK Standard' | 'UK Zero Rate' | 'UK Exempt' | 'EU Import' | 'Non EU Import';
}

/**
 * Exposes the same fields as Suppliers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SuppliersWithDefaults {
  /** Account Code  */
  account_code: string;
  /** Account Name  */
  account_name: string;
  /** Account Status Defaults to: Credit Account. */
  account_status?:
    | 'Credit Account'
    | 'Payment with Order'
    | 'Payment before Dispatch'
    | 'In Dispute'
    | 'Closed Account';
  /** Type  */
  account_type: number;
  /** Address Line 1  */
  address_line_1: string;
  /** Address Line 2  */
  address_line_2?: string | null;
  /** Address Line 3  */
  address_line_3?: string | null;
  /** Address Line 4  */
  address_line_4?: string | null;
  /** Bank Account Number  */
  bank_account_number?: string | null;
  /** Bank Account Sort Code  */
  bank_account_sort_code?: string | null;
  /** Country Name Defaults to: United Kingdom. */
  country_name?: 'United Kingdom' | 'Greece' | 'Belgium';
  /** Currency Code Defaults to: GBP. */
  currency_code?: 'GBP' | 'EUR';
  /** Email  */
  email?: string | null;
  /** ID  */
  id?: number;
  /** Main Contact Name  */
  main_contact_name?: string | null;
  /** Primary Phone  */
  phone_number_primary?: string | null;
  /** Secondary Phone  */
  phone_number_secondary?: string | null;
  /** Postcode  */
  postcode?: string | null;
  /** VAT Number  */
  vat_number?: string | null;
  /** VAT Type Defaults to: UK Standard. */
  vat_type?: 'UK Standard' | 'UK Zero Rate' | 'UK Exempt' | 'EU Import' | 'Non EU Import';
}
/**
 * Exposes all fields present in tracing as a typescript
 * interface.
 */
export interface Tracing {
  /** Customer ID  */
  customer_id?: number | null;
  /** ID  */
  id: number;
  /** Page  */
  page: string;
  /** Timestamp Defaults to: CURRENT_TIMESTAMP. */
  timestamp?: Date | null;
}

/**
 * Exposes the same fields as Tracing,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface TracingWithDefaults {
  /** Customer ID  */
  customer_id?: number | null;
  /** ID  */
  id?: number;
  /** Page  */
  page: string;
  /** Timestamp Defaults to: CURRENT_TIMESTAMP. */
  timestamp?: Date | null;
}
/**
 * Exposes all fields present in users as a typescript
 * interface.
 */
export interface Users {
  /** ID  */
  id: number;
  /** Access Level Defaults to: Low. */
  level: 'Full' | 'High' | 'Low' | 'Driver';
  /** Password  */
  password: string;
  /** Username  */
  username: string;
}

/**
 * Exposes the same fields as Users,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface UsersWithDefaults {
  /** ID  */
  id?: number;
  /** Access Level Defaults to: Low. */
  level?: 'Full' | 'High' | 'Low' | 'Driver';
  /** Password  */
  password: string;
  /** Username  */
  username: string;
}
/**
 * Exposes all fields present in vat_returns as a typescript
 * interface.
 */
export interface VatReturns {
  /** Accounts Value GBP Defaults to: 0.00. */
  accounts_value: number;
  /** Box Number  */
  box_num: number;
  /** Current Adjustments GBP Defaults to: 0.00. */
  current_adjustments: number;
  /** Fuel Scale Charge GBP Defaults to: 0.00. */
  fuel_scale_charge: number;
  /** ID  */
  id: number;
  /** New Adjustments GBP Defaults to: 0.00. */
  new_adjustments: number;
  /** Notes  */
  notes: string;
  /** Previous Adjustments GBP Defaults to: 0.00. */
  previous_adjustments: number;
  /** Return Date  */
  return_date: Date;
  /** This Return GBP Defaults to: 0.00. */
  total: number;
  /** VAT Group ID  */
  vat_group_id: string;
}

/**
 * Exposes the same fields as VatReturns,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface VatReturnsWithDefaults {
  /** Accounts Value GBP Defaults to: 0.00. */
  accounts_value?: number;
  /** Box Number  */
  box_num: number;
  /** Current Adjustments GBP Defaults to: 0.00. */
  current_adjustments?: number;
  /** Fuel Scale Charge GBP Defaults to: 0.00. */
  fuel_scale_charge?: number;
  /** ID  */
  id?: number;
  /** New Adjustments GBP Defaults to: 0.00. */
  new_adjustments?: number;
  /** Notes  */
  notes: string;
  /** Previous Adjustments GBP Defaults to: 0.00. */
  previous_adjustments?: number;
  /** Return Date  */
  return_date: Date;
  /** This Return GBP Defaults to: 0.00. */
  total?: number;
  /** VAT Group ID  */
  vat_group_id: string;
}
/**
 * Exposes all fields present in warehouse as a typescript
 * interface.
 */
export interface Warehouse {
  /** Address  */
  address: string;
  /** ID  */
  id: number;
  /** Warehouse Name  */
  name: string;
  /** Postcode  */
  postcode: string;
}

/**
 * Exposes the same fields as Warehouse,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface WarehouseWithDefaults {
  /** Address  */
  address: string;
  /** ID  */
  id?: number;
  /** Warehouse Name  */
  name: string;
  /** Postcode  */
  postcode: string;
}
/**
 * Exposes all fields present in wishlist as a typescript
 * interface.
 */
export interface Wishlist {
  /** Customer  */
  customer_id: number;
  /** ID  */
  id: number;
  /** Item ID  */
  item_id: number;
}

/**
 * Exposes the same fields as Wishlist,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface WishlistWithDefaults {
  /** Customer  */
  customer_id: number;
  /** ID  */
  id?: number;
  /** Item ID  */
  item_id: number;
}

export type TableName = keyof TableTypeMap;

export interface TableTypeMap {
  allergen_information: AllergenInformation;
  bands: Bands;
  cart: Cart;
  categories: Categories;
  credit_notes: CreditNotes;
  credit_notes_customers: CreditNotesCustomers;
  customer_address: CustomerAddress;
  customer_payments: CustomerPayments;
  customers: Customers;
  discount_codes: DiscountCodes;
  document_locations: DocumentLocations;
  expense_options: ExpenseOptions;
  expired_items: ExpiredItems;
  general_ledger: GeneralLedger;
  image_locations: ImageLocations;
  invoiced_items: InvoicedItems;
  invoices: Invoices;
  items: Items;
  mailing_list: MailingList;
  nutrition_info: NutritionInfo;
  offers: Offers;
  page_section_text: PageSectionText;
  page_sections: PageSections;
  payments: Payments;
  price_list: PriceList;
  settings: Settings;
  stocked_items: StockedItems;
  sub_categories: SubCategories;
  supplier_invoices: SupplierInvoices;
  supplier_payments: SupplierPayments;
  suppliers: Suppliers;
  users: Users;
  vat_returns: VatReturns;
  warehouse: Warehouse;
  wishlist: Wishlist;
}

export enum TableNameEnum {
  AllergenInformation = 'allergen_information',
  Bands = 'bands',
  Cart = 'cart',
  Categories = 'categories',
  CreditNotes = 'credit_notes',
  CreditNotesCustomers = 'credit_notes_customers',
  CustomerAddress = 'customer_address',
  CustomerPayments = 'customer_payments',
  Customers = 'customers',
  DiscountCodes = 'discount_codes',
  DocumentLocations = 'document_locations',
  ExpenseOptions = 'expense_options',
  ExpiredItems = 'expired_items',
  GeneralLedger = 'general_ledger',
  ImageLocations = 'image_locations',
  InvoicedItems = 'invoiced_items',
  Invoices = 'invoices',
  Items = 'items',
  MailingList = 'mailing_list',
  NutritionInfo = 'nutrition_info',
  Offers = 'offers',
  PageSectionText = 'page_section_text',
  PageSections = 'page_sections',
  Payments = 'payments',
  PriceList = 'price_list',
  Settings = 'settings',
  StockedItems = 'stocked_items',
  SubCategories = 'sub_categories',
  SupplierInvoices = 'supplier_invoices',
  SupplierPayments = 'supplier_payments',
  Suppliers = 'suppliers',
  Users = 'users',
  VatReturns = 'vat_returns',
  Warehouse = 'warehouse',
  Wishlist = 'wishlist',
}

export type SubmissionData<T> = T & {
  action?: string;
  table_name?: string;
};
