import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { faX, faTrashCan, faPenToSquare, faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { imageUrlBase } from '../../services/data.service';
import { Subscription, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-invoiced-items-widget',
  templateUrl: './invoiced-items-widget.component.html',
  styleUrls: ['./invoiced-items-widget.component.scss']
})
export class InvoicedItemsWidgetComponent {
  imageUrlBase = imageUrlBase;

  data: any = {};
  title: string | null = null;
  formData: any | null = null;
  
  faX = faX;
  faTrashCan = faTrashCan;
  faPenToSquare = faPenToSquare;
  faFileCircleXmark = faFileCircleXmark;

  formVisible = 'hidden';

  widgetSubscription: Subscription | null = null;

  constructor(private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.formService.getInvoicedItemsFormVisibility().subscribe(async (visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
    });
    this.dataService.retrieveWidgetData().subscribe((widgetData: any) => {
      this.data = widgetData.data;
      this.title = widgetData.title;
    });
  }

  async addInvoicedItem() {
    let invoicedItemsData = await lastValueFrom(this.dataService.collectData("table", "invoiced_items"));

    if (invoicedItemsData != null) {
      this.formData = invoicedItemsData.edittable;
      this.formService.processAddFormData(invoicedItemsData.edittable);
      this.formService.setSelectedTable("invoiced_items");
      this.formService.showAddForm();
      this.formService.setReloadType("invoice-widget");
    }
  }

  async editRow(id: number) {
    let invoicedItemsFormData = await lastValueFrom(this.dataService.collectData("edit-form-data", "invoiced_items"));
    let appendOrAdd = await lastValueFrom(this.dataService.collectData("edit-form-data", "invoiced_items"));

    if (invoicedItemsFormData != null && appendOrAdd != appendOrAdd) {
      this.formService.processEditFormData(id, appendOrAdd, invoicedItemsFormData);
      this.prepareEditFormService(id, 'invoiced_items');
    }
  }

  deleteRow(id: number) {
    this.formService.setSelectedTable("invoiced_items");
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

  dataTypeToInputType(dataTypes: any[]) {
    var inputTypes: any[] = [];
    dataTypes.forEach((dataType: string) => {
      switch(dataType) {
        case "date":
          inputTypes.push("date");
          break;
        
        case "file":
          inputTypes.push("file");
          break;

        default:
          if (!dataType.includes("enum")) {
            inputTypes.push("text");
          } else {
            inputTypes.push("select");
          }
      }
    });
    return inputTypes;
  }

  hide() {
    this.formService.hideInvoicedItemForm();
  }
}
