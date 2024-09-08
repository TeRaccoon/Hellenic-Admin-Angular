import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { imageUrlBase } from '../../services/data.service';
import {
  BalanceSheetData,
  BalanceSheetQueries,
  CustomerQueries,
  SupplierQueries,
} from '../../common/types/data-service/types';
import {
  InvoiceSummary,
  Order,
  Payment,
  PaymentStatus,
} from '../../common/types/balance-sheet/types';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { selectedDate } from '../../common/types/statistics/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

type Transaction = Order | Payment;

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss',
})
export class BalanceSheetComponent {
  faPrint = faPrint;

  imageUrlBase = imageUrlBase;

  inputData!: BalanceSheetData;

  invoices: Order[] | null = null;
  payments: Payment[] | null = null;
  invoiceSummary: InvoiceSummary | null = null;

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  selected: selectedDate = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month'),
  };
  comparison: selectedDate = {
    startDate: null,
    endDate: null,
  };

  queries!: BalanceSheetQueries;

  ranges: any = {
    Yesterday: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    Today: [dayjs(), dayjs()],
    'Last 3 Days': [dayjs().subtract(3, 'days'), dayjs()],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
    'This Year': [dayjs().startOf('year'), dayjs().endOf('year')],
  };

  constructor(private dataService: DataService) {
    this.inputData = this.dataService.retrieveBalanceSheetData();

    this.queries =
      this.inputData.Table == 'customers' ? CustomerQueries : SupplierQueries;
  }

  ngOnInit() {
    this.gatherData();
  }

  async gatherData() {
    await this.gatherInvoices();
    await this.gatherPayments();

    if (this.invoices != null && this.payments != null) {
      this.invoices.forEach((invoice: Order) => {
        this.transactions.push(invoice);
      });

      this.payments.forEach((payment: Payment) => {
        this.transactions.push(payment);
      });

      this.transactions = this.transactions.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      }));

      this.transactions = this.transactions.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      this.filteredTransactions = this.transactions;

      this.processOutstandingBalance();

      this.processSummary();
    }
  }

  processOutstandingBalance() {
    let outstandingBalance = 0;

    for (let transaction of this.transactions) {
      if (this.isOrder(transaction)) {
        outstandingBalance += transaction.total || 0;
      } else if (this.isPayment(transaction)) {
        outstandingBalance -= transaction.amount || 0;
      }
      // else if (transaction.type === 'CreditNote') {
      //   outstandingBalance -= transaction.amount || 0;
      // }
      transaction.outstanding_balance = outstandingBalance;
    }
  }

  processSummary() {
    let totalOrders = this.invoices!.length;
    let totalOutstandingInvoices = this.invoices!.filter(
      (invoice) => invoice.payment_status != PaymentStatus.Yes
    ).length;
    let totalOutstandingBalance = this.invoices!.reduce(
      (accumulator, invoice) => {
        return accumulator + invoice.outstanding_balance;
      },
      0
    );

    this.invoiceSummary = {
      orders: totalOrders,
      outstanding_orders: totalOutstandingInvoices,
      outstanding_balance: totalOutstandingBalance,
    };
  }

  async gatherInvoices() {
    this.invoices = await this.dataService.processGet(
      this.queries.Invoices,
      { filter: this.inputData.CustomerId },
      true
    );
  }

  async gatherPayments() {
    this.payments = await this.dataService.processGet(
      this.queries.Payments,
      { filter: this.inputData.CustomerId },
      true
    );
  }

  async gatherCreditNotes() {}

  isOrder(transaction: Transaction): transaction is Order {
    return (transaction as Order).title !== undefined;
  }

  isPayment(transaction: Transaction): transaction is Payment {
    return (
      (transaction as Payment).amount !== undefined &&
      (transaction as Payment).reference !== undefined
    );
  }

  // isCreditNote(transaction: Transaction): transaction is CreditNote {
  //   return (transaction as CreditNote).amount !== undefined && (transaction as CreditNote).reference === undefined;
  // }

  async print() {
    window.print();
  }

  updateDateRange() {
    if (this.selected.startDate && this.selected.endDate) {
      this.filteredTransactions = this.transactions.filter((transaction) =>
        dayjs(transaction.date).isBetween(
          this.selected.startDate,
          this.selected.endDate,
          null,
          '[]'
        )
      );
    }
  }

  changePaymentType(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredTransactions = this.transactions.filter(
      (transaction) =>
        this.isOrder(transaction) ||
        (this.isPayment(transaction) &&
          (transaction.type == value ||
            value == 'Both' ||
            (value != 'Cash' && transaction.type != 'Cash')))
    );
  }
}
