import { Injectable } from '@angular/core';
import { BarElement } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private isLoginVisible = new BehaviorSubject<boolean>(false);
  private isEditFormVisible = new BehaviorSubject<boolean>(false);
  private isAddFormVisible = new BehaviorSubject<boolean>(false);
  private isDeleteFormVisible = new BehaviorSubject<boolean>(false);
  private isMessageFormVisible = new BehaviorSubject<boolean>(false);

  private editFormData: { [key: string]: { value: any, inputType: string, dataType: string, required: boolean, fields: string } } = {};
  private addFormData: { [key:string]: { inputType: string, dataType: string, required: boolean, fields: string } } = {};
  private deleteFormIds: string[] = [];
  private messageFormData: { title: string, message: string } = { title: '', message: '' };
  private selectedTable: string = "";
  private selectedId: string = "";

  constructor() {}

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

  setEditFormData(editFormData: { [key: string]: { value: any, inputType: string, dataType: string, required: boolean, fields: string } }) {
    this.editFormData = editFormData;
  }

  setAddFormData(addFormData: { [key:string]: { inputType: string, dataType: string, required: boolean, fields: string } }) {
    this.addFormData = addFormData;
  }

  setDeleteFormIds(deleteFormIds: string[]) {
    this.deleteFormIds = deleteFormIds;
  }

  setMessageFormData(messageFormData: { title:string, message: string}) {
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
}