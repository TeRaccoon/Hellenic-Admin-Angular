import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { DATE_RANGES } from '../../common/consts/const';
import { CUSTOMER_QUERIES, SUPPLIER_QUERIES } from '../../common/types/data-service/const';
import { BalanceSheetData, BalanceSheetQueries } from '../../common/types/data-service/types';
import { SelectedDate } from '../../common/types/statistics/types';
import { DataService } from '../../services/data.service';
import { MailService } from '../../services/mail.service';
import { PDFService } from '../../services/pdf.service';
import { UrlService } from '../../services/url.service';
import { FormService } from '../form/service';
import { ICONS } from './icons';
import { BalanceSheetService } from './service';
import { InvoiceSummary, Order, PaymentStatus, Transaction, TransactionData, TransactionType } from './types';

dayjs.extend(isBetween);
@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss',
})
export class BalanceSheetComponent implements OnInit {
  TransactionType: typeof TransactionType = TransactionType;

  paymentStatus = PaymentStatus;
  inputData!: BalanceSheetData;
  queries!: BalanceSheetQueries;

  dateRange: SelectedDate = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month'),
  };

  imageUrlBase;

  invoiceSummary: InvoiceSummary | null = null;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  icons = ICONS;
  ranges = DATE_RANGES;

  isLoading = false;

  constructor(
    private service: BalanceSheetService,
    private dataService: DataService,
    private urlService: UrlService,
    private formService: FormService,
    private mailService: MailService,
    private pdfService: PDFService
  ) {
    this.imageUrlBase = this.urlService.getUrl('uploads');

    this.inputData = this.dataService.getBalanceSheetData();
    this.queries = this.inputData.table == 'customers' ? CUSTOMER_QUERIES : SUPPLIER_QUERIES;
  }

  ngOnInit() {
    this.gatherData();
  }

  async gatherData() {
    const orders: Order[] = await this.processData(this.queries.orders, TransactionType.Order);
    await this.processData(this.queries.payments, TransactionType.Payment);
    await this.processData(this.queries.creditNotes, TransactionType.CreditNote);

    this.sortTransactions();
    const outstandingBalance = this.service.processOutstandingBalance(this.transactions);
    this.processSummary(orders, outstandingBalance);
  }

  sortTransactions() {
    this.transactions = this.transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.filteredTransactions = this.transactions;
  }

  processSummary(orders: Order[], outstandingBalance: number) {
    const totalOrders = orders.length;

    const totalOutstandingInvoices = orders!.filter((order) => order.payment_status != PaymentStatus.Yes).length;
    this.invoiceSummary = {
      orders: totalOrders,
      outstanding_orders: totalOutstandingInvoices,
      outstanding_balance: outstandingBalance,
    };
  }

  async processData(query: string, type: TransactionType) {
    const data = await this.dataService.processGet(query, { filter: this.inputData.customerId }, true);
    if (data != null) {
      data.forEach((dataItem: TransactionData) => {
        this.transactions.push(this.service.toTransaction(dataItem, type));
      });
    }

    return data;
  }

  async print() {
    window.print();
  }

  updateDateRange() {
    if (this.dateRange.startDate && this.dateRange.endDate) {
      this.filteredTransactions = this.transactions.filter((transaction) =>
        dayjs(transaction.date).isBetween(this.dateRange.startDate, this.dateRange.endDate, null, '[]')
      );
    }
  }

  changePaymentType(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.filteredTransactions = this.transactions.filter(
      (transaction) =>
        transaction.type == 'order' ||
        (transaction.type == 'payment' &&
          (transaction.type == value || value == 'Both' || (value != 'Cash' && transaction.payment_type != 'Cash')))
    );
  }

  async emailSupplier() {
    this.isLoading = true;

    const balanceSheet = document.getElementById('balance-sheet');
    if (this.service.validateEmailData(this.inputData, balanceSheet)) {
      return;
    }

    const pdf = await this.constructPDF(balanceSheet!);
    const emailData = await this.service.constructEmail(pdf, this.dateRange, this.inputData.email);
    const response = await this.mailService.sendEmail(emailData);

    this.formService.setMessageFormData({
      title: response.success ? 'Success!' : 'Error!',
      message: response.message,
    });

    this.isLoading = false;
  }

  async constructPDF(data: HTMLElement): Promise<Blob> {
    return (await this.pdfService.generatePDF(data)).output('blob');
  }
}
