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
    }
  }

  hide() {
    this.formService.hideStockedItemForm();
  }

  addStockedItem() {
    this.dataService.collectData("table", "stocked_items").subscribe((data: any) => {
      this.formData = data.edittable;

      let values: (string | null)[] = Array(this.formData.columns.length).fill(null);
      const itemIdIndex = this.formData.names.indexOf('Item ID');
      values[itemIdIndex] = this.itemId;
      this.formData['values'] = values;

      this.formService.processAddFormData(this.formData);
      this.formService.setSelectedTable("stocked_items");
      this.formService.showAddForm();
      this.formService.setReloadType("stock-widget");
      this.formService.setReloadId(this.itemId);
    });
  }

  editRow(id: number) {
    this.dataService.collectData("edit-form-data", "stocked_items").subscribe((editFormData: any) => {
      this.dataService.collectDataComplex("append-or-add", { table: 'stocked_items', id: id, column: 'id' }).subscribe((data: any) => {
        this.formService.processEditFormData(id, data, editFormData);
        this.prepareEditFormService(id, 'stocked_items');
      });
    });
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
