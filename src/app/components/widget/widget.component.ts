import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { faX, faTrashCan, faPenToSquare, faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent {
  faX = faX;
  faTrashCan = faTrashCan;
  faPenToSquare = faPenToSquare;
  faFileCircleXmark = faFileCircleXmark;

  visible = false;

  formName = "";

  tableData = {
    headers: [],
    rows: [],
    tableName: "",
    title: "",
    idData: {
      id: "",
      columnName: "",
    },
    query: "",
  };

  constructor(private dataService: DataService, private formService: FormService) {}
  
  ngOnInit() {
    this.formService.getWidgetVisibility().subscribe((visible: boolean) => {
      this.visible = visible;
    });
    this.dataService.retrieveWidgetData().subscribe((tableData: any) => {
      this.tableData = tableData;
      console.log("🚀 ~ WidgetComponent ~ this.dataService.retrieveWidgetData ~ this.tableData:", this.tableData)
    });
    this.formService.getReloadRequest().subscribe(async (reloadRequested: boolean) => {
      if (reloadRequested) {
        await this.reload();
      }
    });
  }

  async reload() {
    this.tableData.rows = await lastValueFrom(this.dataService.collectData(this.tableData.query, this.tableData.idData.id));
    this.formService.performReload();
  }

  hide() {
    this.formService.hideWidget();
  }

  deleteRow(id: number) {
    this.formService.setSelectedTable(this.tableData?.tableName);
    this.formService.setDeleteFormIds([id]);
    this.formService.showDeleteForm();
    this.formService.setReloadType("widget");
  }

  async editRow(id: number) {
    // let invoicedItemsFormData = await lastValueFrom(this.dataService.collectData("edit-form-data", "invoiced_items"));
    // let appendOrAdd = await lastValueFrom(this.dataService.collectData("edit-form-data", "invoiced_items"));

    // if (invoicedItemsFormData != null && appendOrAdd != appendOrAdd) {
    //   this.formService.processEditFormData(id, appendOrAdd, invoicedItemsFormData);
    //   this.prepareEditFormService(id, 'invoiced_items');
    // }
  }

  async addRow() {
    let addFormData = await lastValueFrom(this.dataService.collectData("table", this.tableData.tableName));
    
    if (addFormData != null) {
      let formData = addFormData.editable;

      let values: (string | null)[] = Array(addFormData.editable.columns.length).fill(null);
      const idIndex = addFormData.editable.names.indexOf(this.tableData.idData.columnName);
      values[idIndex] = this.tableData.idData.id;
      formData.values = values;

      this.formService.processAddFormData(formData);
      this.formService.setSelectedTable(this.tableData.tableName);
      this.formService.showAddForm();
      this.formService.setReloadType("widget");
    }
  }

  prepareEditFormService(id: any, table: string) {
    this.formService.setSelectedTable(table);
    this.formService.setSelectedId(id);
    this.formService.showEditForm();
    this.formService.setReloadType("widget");
  }

  getColumnKeys(row: any): string[] {
    return Object.keys(row);
  }
}
