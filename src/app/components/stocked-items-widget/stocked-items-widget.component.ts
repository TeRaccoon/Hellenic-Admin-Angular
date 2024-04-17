import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { faX, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Subscription, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-stocked-items-widget',
  templateUrl: './stocked-items-widget.component.html',
  styleUrls: ['./stocked-items-widget.component.scss']
})
export class StockedItemsWidgetComponent {
  data: any = null;
  itemId: any = null;
  total = 0;
  formData: any | null = null;

  faX = faX;
  faTrashCan = faTrashCan;
  faPenToSquare = faPenToSquare;

  formVisible = 'hidden';

  widgetSubscription: Subscription | null = null;

  constructor(private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.formService.getStockedItemsFormVisibility().subscribe(async (visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      if (visible) {
        this.collectData();
      }
    });
  }

  collectData() {
    let data = this.dataService.retrieveStockWidgetData();
    if (data != null) {
      this.data = Array.isArray(data.stock_data) ? data.stock_data : [data.stock_data];
      this.itemId = data.id;
      this.total = data.total.total_quantity;
    }
  }

  hide() {
    this.formService.hideStockedItemForm();
  }

  async addStockedItem() {
    let stockedItemsData = await lastValueFrom(this.dataService.processData("table", "stocked_items"));

    if (stockedItemsData != null) {
      this.formData = stockedItemsData.editable;

      let values: (string | null)[] = Array(this.formData.columns.length).fill(null);
      const itemIdIndex = this.formData.names.indexOf('Item ID');
      values[itemIdIndex] = this.itemId;
      this.formData['values'] = values;

      this.formService.processAddFormData(this.formData);
      this.formService.setSelectedTable("stocked_items");
      this.formService.showAddForm();
      this.formService.setReloadType("stock-widget");
      this.formService.setReloadId(this.itemId);
    }
  }

  async editRow(id: number) {
    let editFormData = await lastValueFrom(this.dataService.processData("edit-form-data", "stocked_items"));
    let appendOrAdd = await lastValueFrom(this.dataService.collectDataComplex("append-or-add", { table: 'stocked_items', id: id, column: 'id' }));

    if (editFormData != null && appendOrAdd != null) {
      this.formService.processEditFormData(id, appendOrAdd, editFormData);
      this.prepareEditFormService(id, 'stocked_items');
    }
  }

  deleteRow(id: number) {
    this.formService.setSelectedTable("stocked_items");
    this.formService.setDeleteFormIds([id]);
    this.formService.showDeleteForm();
    this.formService.setReloadType("widget");
  }

  prepareEditFormService(id: any, table: string) {
    this.formService.setSelectedTable(table);
    this.formService.setSelectedId(id);
    this.formService.showEditForm();
    this.formService.setReloadType("widget");
  }
}
