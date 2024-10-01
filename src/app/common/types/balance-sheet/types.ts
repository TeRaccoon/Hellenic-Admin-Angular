export interface Order {
  type: 'order';
  date: Date;
  title: string;
  status: OrderStatus;
  total: number;
  payment_status: PaymentStatus;
  outstanding_balance: number;
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

export interface Payment {
  type: 'payment';
  date: Date;
  amount: number;
  payment_type: PaymentType;
  reference: string;
  outstanding_balance: number;
}

export interface CreditNote {
  type: 'credit-note';
  date: Date;
  amount: number;
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
