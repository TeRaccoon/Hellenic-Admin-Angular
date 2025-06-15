interface BaseOrder {
  date: Date;
  title: string;
  status: OrderStatus;
  total: number;
  payment_status: PaymentStatus;
  outstanding_balance: number;
}

export interface OrderData extends BaseOrder {
  VAT: number;
}
export interface Order extends BaseOrder {
  type: 'order';
}

export enum OrderStatus {
  Pending = 'Pending',
  Overdue = 'Overdue',
  Complete = 'Complete',
}

export enum PaymentStatus {
  Yes = 'Yes',
  No = 'No',
}

export interface InvoiceSummary {
  orders: number;
  outstanding_orders: number;
  outstanding_balance: number;
}

interface BasePayment {
  date: Date;
  amount: number;
  payment_type: PaymentType;
  reference: string;
}

export interface PaymentData extends BasePayment {
  id: number;
  customer_id: number;
  invoice_id: number;
  linked_payment_id: null | number;
  currency: Currency;
}

export interface Payment extends BasePayment {
  type: 'payment';
  outstanding_balance: number;
}

export interface CreditNoteData {
  date: Date;
  amount: number;
}

export interface CreditNote extends CreditNoteData {
  type: 'credit-note';
}

enum Currency {
  GBP = 'GBP',
  EUR = 'EUR',
}

export enum PaymentType {
  Cash = 'Cash',
  Cheque = 'Cheque',
  CreditCard = 'Credit Card',
  DebitCard = 'Debit Card',
  Transfer = 'Transfer',
  OnlinePayment = 'Online Payment',
  Credit = 'Credit',
}

export enum TransactionType {
  Order = 'order',
  Payment = 'payment',
  CreditNote = 'credit-note',
}

export type Transaction = Order | Payment | CreditNote;
export type TransactionData = OrderData | PaymentData | CreditNoteData;
