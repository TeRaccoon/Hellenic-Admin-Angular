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
    };
  } = {};
  private deleteFormIds: string[] = [];
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
    };
  }) {
    this.addFormData = addFormData;
  }

  setDeleteFormIds(deleteFormIds: string[]) {
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

  async replaceAmbiguousData(
    tableName: string,
    formData: any,
    replacementData: { key: string; data: { id: Number; replacement: String }[] }[],
    dataService: DataService,
  ) {
    switch (tableName) {
      case 'retail_items':
      case 'invoiced_items':
        var data = await this.getIdReplacementData('items_id_name', dataService);
        formData['Item ID'].inputType = 'replacement';
        replacementData.push({ key: 'Item ID', data: data });
        break;
        
      case 'customer_payments':
      case 'customer_address':
      case 'invoices':
        var data = await this.getIdReplacementData('customers_id_name', dataService);
        formData['Customer ID'].inputType = 'replacement';
        replacementData.push({ key: 'Customer ID', data: data });
        break;

      case 'page_section_text':
        var data = await this.getIdReplacementData('page_section_id_name', dataService);
        formData['Page Section ID'].inputType = 'replacement';
        replacementData.push({ key: 'Page Section ID', data: data });
        break;

      case 'retail_item_images':
        var data = await this.getIdReplacementData('retail_item_id_name', dataService);
        formData['Retail Item ID'].inputType = 'replacement';
        replacementData.push({ key: 'Retail Item ID', data: data });
        break;
    }
    console.log(replacementData);
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
}
