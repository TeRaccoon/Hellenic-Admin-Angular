import { Component, Input } from '@angular/core';
import { PaymentStatus, Transaction, TransactionType } from '../../types';
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent {
  TransactionType = TransactionType;
  PaymentStatus = PaymentStatus;

  @Input() Transaction!: Transaction;
}
