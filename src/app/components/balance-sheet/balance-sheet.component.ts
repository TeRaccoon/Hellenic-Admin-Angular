import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  BalanceSheetData,
  BalanceSheetQueries,
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
import { SelectedDate } from '../../common/types/statistics/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { UrlService } from '../../services/url.service';
import {
  CUSTOMER_QUERIES,
  SUPPLIER_QUERIES,
} from '../../common/types/data-service/const';

dayjs.extend(isBetween);

type Transaction = Order | Payment | CreditNote;

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss',
})
export class BalanceSheetComponent {
  paymentStatus = PaymentStatus;

  faPrint = faPrint;

  imageUrlBase;

  inputData!: BalanceSheetData;

  invoiceSummary: InvoiceSummary | null = null;

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  selected: SelectedDate = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month'),
  };
  comparison: SelectedDate = {
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

  constructor(
    private dataService: DataService,
    private urlService: UrlService
  ) {
    this.imageUrlBase = this.urlService.getUrl('uploads');

    this.inputData = this.dataService.retrieveBalanceSheetData();

    this.queries =
      this.inputData.Table == 'customers' ? CUSTOMER_QUERIES : SUPPLIER_QUERIES;
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
    let outstandingBalance = this.processOutstandingBalance();
    this.processSummary(orders, outstandingBalance);
  }

  sortTransactions() {
    this.transactions = this.transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    console.log(this.transactions);
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

      if (transaction.type == 'order' || transaction.type == 'payment') {
        transaction.outstanding_balance = outstandingBalance;
      }
    }

    return outstandingBalance;
  }

  processSummary(orders: Order[], outstandingBalance: number) {
    let totalOrders = orders.length;

    let totalOutstandingInvoices = orders!.filter(
      (order) => order.payment_status != PaymentStatus.Yes
    ).length;
    this.invoiceSummary = {
      orders: totalOrders,
      outstanding_orders: totalOutstandingInvoices,
      outstanding_balance: outstandingBalance,
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
            (value != 'Cash' && transaction.payment_type != 'Cash')))
    );
  }
}
