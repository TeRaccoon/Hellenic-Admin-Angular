import { Injectable } from '@angular/core';
import { BarElement } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private isLoginVisible = new BehaviorSubject<boolean>(false);
  private isEditFormVisible = new BehaviorSubject<boolean>(false);
  private isAddFormVisible = new BehaviorSubject<boolean>(false);
  private isDeleteFormVisible = new BehaviorSubject<boolean>(false);
  private isMessageFormVisible = new BehaviorSubject<boolean>(false);
  private isFilterFormVisible = new BehaviorSubject<boolean>(false);
  private isChangePasswordFormVisible = new BehaviorSubject<boolean>(false);
  private isInvoicedItemsFormVisible = new BehaviorSubject<boolean>(false);

  private editFormData: {
    [key: string]: {
      value: any;
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
    };
  } = {};
  private addFormData: {
    [key: string]: {
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
      value: any;
    };
  } = {};
  private alternativeSelectData: {
    [key: string]: {
      data: {value: string}[]
    }
  } = {};
  private deleteFormIds: number[] = [];
  private messageFormData: { title: string; message: string } = {
    title: '',
    message: '',
  };
  private selectedTable: string = '';
  private selectedId: string = '';
  private reloadType: string = '';

  private waitingToReload = new BehaviorSubject<boolean>(false);

  constructor() {}

  getReloadRequest(): Observable<boolean> {
    return this.waitingToReload.asObservable();
  }

  performReload() {
    this.waitingToReload.next(false);
  }

  requestReload() {
    this.waitingToReload.next(true);
  }

  showLoginForm() {
    this.isLoginVisible.next(true);
  }

  hideLoginForm() {
    this.isLoginVisible.next(false);
  }

  getLoginFormVisibility(): Observable<boolean> {
    return this.isLoginVisible.asObservable();
  }

  showEditForm() {
    this.isEditFormVisible.next(true);
  }
  hideEditForm() {
    this.isEditFormVisible.next(false);
  }

  showAddForm() {
    this.isAddFormVisible.next(true);
  }
  hideAddForm() {
    this.isAddFormVisible.next(false);
  }

  showDeleteForm() {
    this.isDeleteFormVisible.next(true);
  }
  hideDeleteForm() {
    this.isDeleteFormVisible.next(false);
  }

  showMessageForm() {
    this.isMessageFormVisible.next(true);
  }
  hideMessageForm() {
    this.isMessageFormVisible.next(false);
  }

  showFilterForm() {
    this.isFilterFormVisible.next(true);
  }
  hideFilterForm() {
    this.isFilterFormVisible.next(false);
  }

  showChangePasswordForm() {
    this.isChangePasswordFormVisible.next(true);
  }
  hideChangePasswordForm() {
    this.isChangePasswordFormVisible.next(false);
  }

  showInvoicedItemForm() {
    this.isInvoicedItemsFormVisible.next(true);
  }
  hideInvoicedItemForm() {
    this.isInvoicedItemsFormVisible.next(false);
  }

  getEditFormVisibility(): Observable<boolean> {
    return this.isEditFormVisible.asObservable();
  }

  getAddFormVisibility(): Observable<boolean> {
    return this.isAddFormVisible.asObservable();
  }

  getDeleteFormVisibility(): Observable<boolean> {
    return this.isDeleteFormVisible.asObservable();
  }

  getMessageFormVisibility(): Observable<boolean> {
    return this.isMessageFormVisible.asObservable();
  }

  getFilterFormVisibility(): Observable<boolean> {
    return this.isFilterFormVisible.asObservable();
  }

  getChangePasswordFormVisibility(): Observable<boolean> {
    return this.isChangePasswordFormVisible.asObservable();
  }

  getInvoicedItemsFormVisibility(): Observable<boolean> {
    return this.isInvoicedItemsFormVisible.asObservable();
  }

  setEditFormData(editFormData: {
    [key: string]: {
      value: any;
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
    };
  }) {
    this.editFormData = editFormData;
  }

  setAddFormData(addFormData: {
    [key: string]: {
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
      value: any;
    };
  }) {
    this.addFormData = addFormData;
  }

  setDeleteFormIds(deleteFormIds: number[]) {
    this.deleteFormIds = deleteFormIds;
  }

  setMessageFormData(messageFormData: { title: string; message: string }) {
    this.messageFormData = messageFormData;
  }

  setSelectedTable(selectedTable: string) {
    this.selectedTable = selectedTable;
  }

  setSelectedId(selectedId: string) {
    this.selectedId = selectedId;
  }

  getEditFormData() {
    return this.editFormData;
  }

  getAddFormData() {
    return this.addFormData;
  }

  getDeleteFormIds() {
    return this.deleteFormIds;
  }

  getMessageFormData() {
    return this.messageFormData;
  }

  getSelectedTable() {
    return this.selectedTable;
  }

  getSelectedId() {
    return this.selectedId;
  }

  getAlternativeSelectData() {
    return this.alternativeSelectData;
  }

  async replaceAmbiguousData(
    tableName: string,
    formData: any,
    replacementData: {
      [key: string]: {
        data: { id: Number; replacement: string }[];
      }
    },
    dataService: DataService,
  ) {
    switch (tableName) {
      case 'retail_items':
        var data = await this.getIdReplacementData('items_id_name', dataService);
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };


        data = await this.getIdReplacementData('brands', dataService);
        formData['Brand'].inputType = 'alternative-select';
        this.alternativeSelectData['Brand'] = { data: data };
        break;

      case 'invoiced_items':
        var data = await this.getIdReplacementData('items_id_name', dataService);
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };

        data = await this.getIdReplacementData('invoice_id_title', dataService);
        formData['Invoice ID'].inputType = 'replacement';
        replacementData['Invoice ID'] = { data: data };
        break;
        
      case 'customer_payments':
      case 'customer_address':
      case 'invoices':
        var data = await this.getIdReplacementData('customers_id_name', dataService);
        formData['Customer Name'].inputType = 'replacement';
        replacementData['Customer Name'] = { data: data };
        break;

      case 'page_section_text':
        var data = await this.getIdReplacementData('page_section_id_name', dataService);
        formData['Page Section ID'].inputType = 'replacement';
        replacementData['Page Section ID'] = { data: data };
        break;

      case 'retail_item_images':
      case 'allergen_information':
      case 'nutrition_information':
        var data = await this.getIdReplacementData('retail_item_id_name', dataService);
        formData['Retail Item ID'].inputType = 'replacement';
        replacementData['Retail Item ID'] = { data: data };
        break;

      case 'supplier_invoices':
        var data = await this.getIdReplacementData('supplier_id_name', dataService);
        formData['Supplier ID'].inputType = 'replacement';
        replacementData['Supplier ID'] = { data: data };
        break;
        
    }
    return { formData, replacementData };
  }

  async getIdReplacementData(query: string, dataService: DataService): Promise<any> {
    return new Promise((resolve, reject) => {
      dataService.collectData(query).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  setReloadType(reloadType: string) {
    this.reloadType = reloadType;
  }

  getReloadType() {
    return this.reloadType;
  }

  processEditFormData(id: number, row: any, edittableData: {columns: any[], types: any[], names: any[], required: any[], fields: any[]}) {
    this.editFormData = {};
    var inputDataTypes = this.dataTypeToInputType(edittableData.types);
    edittableData.columns.forEach((columnName, index) => {
      this.editFormData[edittableData.names[index]] = {
        value: row[columnName],
        inputType: inputDataTypes[index],
        dataType: edittableData.types[index],
        required: edittableData.required[index],
        fields: edittableData.fields[index],
      };
    });
  }

  processAddFormData(edittableData: {columns: any[], types: any[], names: any[], required: any[], fields: any[], values: any[]}) {
    this.addFormData = {};
    var inputDataTypes: string[] = this.dataTypeToInputType(edittableData.types);
    edittableData.columns.forEach((_, index) => {
      this.addFormData[edittableData.names[index]] = {
        inputType: inputDataTypes[index],
        dataType: edittableData.types[index],
        required: edittableData.required[index],
        fields: edittableData.fields[index],
        value: edittableData.values ? edittableData.values[index] : null,
      };
    });
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

        case "double":
        case "float":
          inputTypes.push("number");
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
}
