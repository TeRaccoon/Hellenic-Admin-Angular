import { Component, Input } from '@angular/core';
import { InvoiceSummary } from '../../types';

@Component({
  selector: 'app-invoice-summary',
  templateUrl: './invoice-summary.component.html',
  styleUrl: './invoice-summary.component.scss',
})
export class InvoiceSummaryComponent {
  @Input() InvoiceSummary!: InvoiceSummary;
}
