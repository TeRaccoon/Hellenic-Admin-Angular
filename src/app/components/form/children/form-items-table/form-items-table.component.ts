import { Component, Input, effect } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../../../services/data.service';
import { FormService } from '../../service';
import { FormType, ItemsList } from '../../types';

@Component({
  selector: 'app-form-items-table',
  templateUrl: './form-items-table.component.html',
  styleUrl: './form-items-table.component.scss',
})
export class FormItemsTableComponent {
  @Input() tableName!: string;
  @Input() invoiceId!: number;

  invoiceTotal = 0;
  itemsList: ItemsList[] = [];

  x = faX;

  constructor(
    private dataService: DataService,
    private formService: FormService
  ) {
    this.loadItemsList();

    effect(() => {
      const reloadRequested = this.formService.getReloadRequestSignal()();
      if (reloadRequested) this.loadItemsList();
    });
  }

  async loadItemsList() {
    let key;
    let itemsQuery;
    let invoiceQuery;

    if (this.tableName === 'supplier_invoices') {
      key = 'total_eur';
      itemsQuery = 'stocked-items-invoice';
      invoiceQuery = 'supplier-invoice';
    } else {
      key = 'total';
      itemsQuery = 'invoiced-items';
      invoiceQuery = 'invoice';
    }

    this.itemsList = await this.dataService.processGet(
      itemsQuery,
      {
        id: this.invoiceId?.toString(),
        complex: true,
      },
      true
    );

    const invoiceData = await this.dataService.processGet(invoiceQuery, {
      filter: this.invoiceId,
    });

    this.invoiceTotal = invoiceData[key];
  }

  deleteRow(id: number) {
    const table = this.tableName == 'supplier_invoices' ? 'stocked_items' : 'invoiced_items';

    this.formService.setSelectedTable(table);
    this.formService.setDeleteFormIds([id]);
    this.formService.setFormVisibility(FormType.Delete, true);
  }
}
