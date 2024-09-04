export interface Order {
    date: Date,
    title: string,
    status: OrderStatus,
    total: number,
    payment_status: PaymentStatus,
    outstanding_balance: number,
};

export enum OrderStatus {
    Pending = 'Pending',
    Overdue = 'Overdue',
    Complete = 'Complete',
};

export enum PaymentStatus {
    Yes = 'Yes',
    No = 'No'
};

export interface InvoiceSummary {
    orders: number,
    outstanding_orders: number,
    outstanding_balance: number,
};

export interface Payment {
    date: Date,
    amount: number,
    type: PaymentType,
    reference: string,
    outstanding_balance: number
};

export interface CreditNote {
    date: Date,
    amount: number,
};

export enum PaymentType {
    Cash = 'Cash',
    Cheque = 'Cheque',
    CreditCard = 'Credit Card',
    DebitCard = 'Debit Card',
    Transfer = 'Transfer',
    OnlinePayment = 'Online Payment',
    Credit = 'Credit',
};