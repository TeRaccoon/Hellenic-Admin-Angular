import { Component, Input } from '@angular/core';
import { InvoiceDetails } from '../../types';

@Component({
  selector: 'app-documents-to-reconcile',
  templateUrl: './documents-to-reconcile.component.html',
  styleUrl: './documents-to-reconcile.component.scss'
})
export class DocumentsToReconcileComponent {
  @Input() invoicesDetails!: InvoiceDetails[];
  @Input() tableName!: string;
}
