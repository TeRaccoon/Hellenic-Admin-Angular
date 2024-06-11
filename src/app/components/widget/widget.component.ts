import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { faX, faTrashCan, faPenToSquare, faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { imageUrlBase } from '../../services/data.service';
import { formSettings } from '../../common/types/forms/types'; 
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
  
  imageUrlBase = imageUrlBase;

  visible = false;

  formName = "";

  tableData = {
    headers: [{
      name: "",
      type: ""
    }],
    rows: [],
    tableName: "",
    title: "",
    idData: {
      id: "",
      columnName: "",
    },
    query: "",
    disabled: {
      value: false,
      message: ""
    }
  };

  constructor(private dataService: DataService, private formService: FormService) {}
  
  ngOnInit() {
    this.subscriptionHandler();
  }

  subscriptionHandler() {
    this.formService.getWidgetVisibility().subscribe((visible: boolean) => {
      this.visible = visible;
    });

    this.dataService.retrieveWidgetData().subscribe((tableData: any) => {
      this.tableData = tableData;
    });

    this.formService.getReloadRequest().subscribe(async (reloadRequested: boolean) => {
      if (reloadRequested) {
        await this.reload();
      }
    });
  }

  async reload() {
    let data = await lastValueFrom<[]>(this.dataService.processData(this.tableData.query, this.tableData.idData.id));
    this.tableData.rows = Array.isArray(data) ? data : [data];
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
    let editFormData = await lastValueFrom(this.dataService.processData("edit-form-data", this.tableData.tableName));
    let appendOrAdd = await lastValueFrom(this.dataService.collectDataComplex("append-or-add", { table: this.tableData.tableName, id: id, column: 'id' }));

    if (editFormData != null && appendOrAdd != null) {
      this.formService.processEditFormData(id, appendOrAdd, editFormData);
      this.prepareEditFormService(id, this.tableData.tableName);
    }
  }

  async addRow() {
    let addFormData = await lastValueFrom(this.dataService.processData("table", this.tableData.tableName));
    
    if (addFormData != null) {
      let formData = addFormData.editable;

      let values: (string | null)[] = Array(addFormData.editable.columns.length).fill(null);
      const idIndex = addFormData.editable.names.indexOf(this.tableData.idData.columnName);
      values[idIndex] = this.tableData.idData.id;
      formData.values = values;

      this.formService.processAddFormData(formData, this.formService.constructFormSettings(this.tableData.tableName));
      this.formService.setSelectedTable(this.tableData.tableName);
      this.formService.showAddForm();
      this.formService.setReloadType("widget");
      this.formService.requestReload();
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

  getStockedItemTotal() {
    return this.tableData.rows.reduce((acc: number, curr: any) => {
      return acc + curr.quantity;
    }, 0);
  }
}
