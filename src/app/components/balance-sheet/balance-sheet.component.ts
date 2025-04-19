import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  BalanceSheetData,
  BalanceSheetQueries,
} from '../../common/types/data-service/types';
import {
  InvoiceSummary,
  Order,
  PaymentStatus,
  Transaction,
  TransactionType,
} from '../../common/types/balance-sheet/types';
import { SelectedDate } from '../../common/types/statistics/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { UrlService } from '../../services/url.service';
import {
  CUSTOMER_QUERIES,
  SUPPLIER_QUERIES,
} from '../../common/types/data-service/const';
import { faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormService } from '../form/service';
import { MailService } from '../../services/mail.service';
import { DATE_RANGES } from '../../common/consts/const';
import { PDFService } from '../../services/pdf.service';

dayjs.extend(isBetween);
@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss',
})
export class BalanceSheetComponent {
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

  email = faEnvelope;
  loading = faSpinner;

  isLoading = false;

  ranges = DATE_RANGES;

  constructor(
    private dataService: DataService,
    private urlService: UrlService,
    private formService: FormService,
    private mailService: MailService,
    private pdfService: PDFService
  ) {
    this.imageUrlBase = this.urlService.getUrl('uploads');

    this.inputData = this.dataService.retrieveBalanceSheetData();
    this.queries =
      this.inputData.table == 'customers' ? CUSTOMER_QUERIES : SUPPLIER_QUERIES;
  }

  ngOnInit() {
    this.gatherData();
  }

  async gatherData() {
    let orders: Order[] = await this.processData(
      this.queries.orders,
      TransactionType.Order
    );
    await this.processData(this.queries.payments, TransactionType.Payment);
    await this.processData(
      this.queries.creditNotes,
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
      { filter: this.inputData.customerId },
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
    if (this.dateRange.startDate && this.dateRange.endDate) {
      this.filteredTransactions = this.transactions.filter((transaction) =>
        dayjs(transaction.date).isBetween(
          this.dateRange.startDate,
          this.dateRange.endDate,
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

  async emailSupplier() {
    this.isLoading = true;

    if (this.inputData.email == '' || this.inputData.email == null) {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: 'There is no email linked to this account!'
      });
      return;
    }

    const data = document.getElementById('balance-sheet');
    if (!data) {
      return;
    }

    const pdf = await this.constructPDF(data);
    const response = await this.constructEmail(pdf);

    this.formService.setMessageFormData({
      title: response.success ? 'Success!' : 'Error!',
      message: response.message,
    });

    this.isLoading = false;
  }

  async constructPDF(data: HTMLElement): Promise<Blob> {
    return (await this.pdfService.generatePDF(data)).output('blob');
  }

  async constructEmail(pdf: Blob) {
    const reader = new FileReader();

    const base64data = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.readAsDataURL(pdf);
    });

    const emailData = {
      action: 'mail',
      mail_type: 'newsletter',
      subject: 'Balance Sheet',
      attachment: base64data,
      email_HTML: this.mailService.getSupplierInvoiceEmail(this.dateRange),
      address: this.inputData.email,
      name: 'Customer',
      filename: 'Balance Sheet.pdf',
    };

    return this.mailService.sendEmail(emailData);
  }
}
