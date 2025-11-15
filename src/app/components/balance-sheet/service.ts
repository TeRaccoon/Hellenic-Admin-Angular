import { Injectable } from '@angular/core';
import { BalanceSheetData } from '../../common/types/data-service/types';
import { SelectedDate } from '../../common/types/statistics/types';
import { MailService } from '../../services/mail.service';
import { FormService } from '../form/service';
import {
  CreditNote,
  CreditNoteData,
  EmailData,
  Order,
  Payment,
  PaymentData,
  Transaction,
  TransactionData,
  TransactionType,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class BalanceSheetService {
  constructor(
    private formService: FormService,
    private mailService: MailService
  ) {}

  toTransaction(dataItem: TransactionData, type: TransactionType): Transaction {
    switch (type) {
      case TransactionType.Order:
        return { ...dataItem, type: TransactionType.Order } as Order;

      case TransactionType.Payment:
        return {
          ...dataItem,
          amount: Number((dataItem as PaymentData).amount.toFixed(2)),
          type: TransactionType.Payment,
        } as Payment;

      case TransactionType.CreditNote:
        return {
          ...dataItem,
          amount: Number((dataItem as CreditNoteData).amount.toFixed(2)),
          type: TransactionType.CreditNote,
        } as CreditNote;
    }
  }

  processOutstandingBalance(transactions: Transaction[]) {
    let outstandingBalance = 0;

    for (const transaction of transactions) {
      if (transaction.type == TransactionType.Order) {
        outstandingBalance += transaction.total;
      } else {
        outstandingBalance -= transaction.amount;
      }

      if (transaction.type == TransactionType.Order || transaction.type == TransactionType.Payment) {
        transaction.outstanding_balance = outstandingBalance;
      }
    }

    return outstandingBalance;
  }

  async constructEmail(pdf: Blob, dateRange: SelectedDate, email: string): Promise<EmailData> {
    const reader = new FileReader();

    const base64data = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.readAsDataURL(pdf);
    });

    const emailData: EmailData = {
      action: 'mail',
      mail_type: 'newsletter',
      subject: 'Balance Sheet',
      attachment: base64data,
      email_HTML: this.mailService.getSupplierInvoiceEmail(dateRange),
      address: email,
      name: 'Customer',
      filename: 'Balance Sheet.pdf',
    };

    return emailData;
  }

  validateEmailData(inputData: BalanceSheetData, balanceSheet: HTMLElement | null) {
    if (inputData.email == '' || inputData.email == null) {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: 'There is no email linked to this account!',
      });
      return false;
    }

    if (!balanceSheet) {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: 'Could not convert balance sheet to PDF!',
      });
      return false;
    }

    return true;
  }
}
