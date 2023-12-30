import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private isLoginVisible = new BehaviorSubject<boolean>(false);
  private isEditFormVisible = new BehaviorSubject<boolean>(false);
  private isAddFormVisible = new BehaviorSubject<boolean>(false);
  private editFormData: { [key: string]: { value: any, inputType: string, dataType: string, required: boolean, fields: string } } = {};
  private addFormData: { [key:string]: { inputType: string, dataType: string, required: boolean, fields: string } } = {};
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

  getEditFormVisibility(): Observable<boolean> {
    return this.isEditFormVisible.asObservable();
  }

  getAddFormVisibility(): Observable<boolean> {
    return this.isAddFormVisible.asObservable();
  }

  setEditFormData(editFormData: { [key: string]: { value: any, inputType: string, dataType: string, required: boolean, fields: string } }) {
    this.editFormData = editFormData;
  }

  setAddFormData(addFormData: { [key:string]: { inputType: string, dataType: string, required: boolean, fields: string } }) {
    this.addFormData = addFormData;
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

  getSelectedTable() {
    return this.selectedTable;
  }

  getSelectedId() {
    return this.selectedId;
  }
}