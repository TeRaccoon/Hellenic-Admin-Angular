import { Component, Input } from '@angular/core';
import { invoiceDetails } from '../../common/types/documents-to-reconcile/types';

@Component({
  selector: 'app-documents-to-reconcile',
  templateUrl: './documents-to-reconcile.component.html',
  styleUrl: './documents-to-reconcile.component.scss'
})
export class DocumentsToReconcileComponent {
  @Input() invoicesDetails!: invoiceDetails[];
  @Input() tableName!: string;

  ngOnInit() {

    console.log(this.invoicesDetails);
  }
}
