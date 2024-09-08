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
  CreditNote,
  InvoiceSummary,
  Order,
  Payment,
  PaymentStatus,
  TransactionType,
} from '../../common/types/balance-sheet/types';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { selectedDate } from '../../common/types/statistics/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

type Transaction = Order | Payment | CreditNote;

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss',
})
export class BalanceSheetComponent {
  faPrint = faPrint;

  imageUrlBase = imageUrlBase;

  inputData!: BalanceSheetData;

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
    let orders: Order[] = await this.processData(
      this.queries.Orders,
      TransactionType.Order
    );
    await this.processData(this.queries.Payments, TransactionType.Payment);
    await this.processData(
      this.queries.CreditNotes,
      TransactionType.CreditNote
    );

    this.sortTransactions();
    this.processOutstandingBalance();
    this.processSummary(orders);
  }

  sortTransactions() {
    this.transactions = this.transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    this.filteredTransactions = this.transactions;
  }

  processOutstandingBalance() {
    let outstandingBalance = 0;

    for (let transaction of this.transactions) {
      if (transaction.type == 'order') {
        outstandingBalance += transaction.total || 0;
      } else {
        outstandingBalance -= transaction.amount || 0;
      }
    }
  }

  processSummary(orders: Order[]) {
    let totalOrders = orders.length;

    let totalOutstandingInvoices = orders!.filter(
      (order) => order.payment_status != PaymentStatus.Yes
    ).length;

    let totalOutstandingBalance = orders!.reduce((accumulator, order) => {
      return accumulator + order.outstanding_balance;
    }, 0);

    this.invoiceSummary = {
      orders: totalOrders,
      outstanding_orders: totalOutstandingInvoices,
      outstanding_balance: totalOutstandingBalance,
    };
  }

  async processData(query: string, type: TransactionType) {
    let data = await this.dataService.processGet(
      query,
      { filter: this.inputData.CustomerId },
      true
    );

    if (data != null) {
      data.forEach((dataItem: any) => {
        let transaction: Transaction = { ...dataItem, type: type };
        this.transactions.push(transaction);
      });
    }

    return data;
  }

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
        transaction.type == 'order' ||
        (transaction.type == 'payment' &&
          (transaction.type == value ||
            value == 'Both' ||
            (value != 'Cash' && transaction.paymentType != 'Cash')))
    );
  }
}
