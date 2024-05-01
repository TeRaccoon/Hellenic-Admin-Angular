import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, last, lastValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { formatDate } from '@angular/common';

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
  private isWidgetVisible = new BehaviorSubject<boolean>(false);


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
  private messageFormData: { title: string; message: string, secondaryMessage?: string } = {
    title: "",
    message: "",
    secondaryMessage: ""
  };
  private selectedTable: string = '';
  private selectedId: string = '';
  private reloadType: string = '';
  private reloadId: string = '';

  private waitingToReload = new BehaviorSubject<boolean>(false);

  constructor(private dataService: DataService) {}

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

  getWidgetVisibility(): Observable<boolean> {
    return this.isWidgetVisible.asObservable();
  }

  hideWidget() {
    this.isWidgetVisible.next(false);
  }

  showWidget() {
    this.isWidgetVisible.next(true);
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

  setMessageFormData(messageFormData: { title: string; message: string, secondaryMessage?: string }) {
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
        var data = await this.getIdReplacementData('items_id_name_sku', dataService);
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };

        data = await this.getIdReplacementData("offer_id_name", dataService);
        formData["Offer ID"].inputType = "replacement";
        replacementData["Offer ID"] = { data: data };
        break;

      case "items":
        var data = await this.getIdReplacementData("categories", dataService);
        formData["Category"].inputType = "alternative-select";
        this.alternativeSelectData["Category"] = { data: data };

        data = await this.getIdReplacementData("sub-categories", dataService);
        formData["Sub-category"].inputType = "alternative-select";
        this.alternativeSelectData["Sub-category"] = { data: data };

        data = await this.getIdReplacementData("offer_id_name", dataService);
        formData["Offer ID"].inputType = "replacement";
        replacementData["Offer ID"] = { data: data };
        break;

      case 'invoiced_items':
        var data = await this.getIdReplacementData('items_id_name_sku', dataService);
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };

        data = await this.getIdReplacementData('invoice_id_title', dataService);
        formData['Invoice ID'].inputType = 'replacement';
        replacementData['Invoice ID'] = { data: data };
        break;

      case 'stocked_items':
        var data = await this.getIdReplacementData('items_id_name_sku', dataService);
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };

        var data = await this.getIdReplacementData('warehouse_id_name', dataService);
        formData['Warehouse ID'].inputType = 'replacement';
        replacementData['Warehouse ID'] = { data: data };

        var data = await this.getIdReplacementData('supplier_invoice_id_reference', dataService);
        formData['Supplier Invoice ID'].inputType = 'replacement';
        replacementData['Supplier Invoice ID'] = { data: data };
        break;
        
      case 'invoices':
        var data = await this.getIdReplacementData('customers_id_name', dataService);
        formData['Customer Name'].inputType = 'replacement';
        replacementData['Customer Name'] = { data: data };
        
        data = await this.getIdReplacementData('warehouse_id_name', dataService);
        formData['Warehouse ID'].inputType = 'replacement';
        replacementData['Warehouse ID'] = { data: data };

        data = await this.getIdReplacementData('customer_address_id_full', dataService);
        formData['Address'].inputType = "replacement";
        replacementData['Address'] = { data: data };

        data = await this.getIdReplacementData('customer_billing_address_id_full', dataService);
        formData['Billing Address'].inputType = "replacement";
        replacementData['Billing Address'] = { data: data };

        data = await this.getIdReplacementData('items_id_name_sku', dataService);
        formData['Item ID'] = {
          inputType: 'replacement',
          value: null,
          fields: 'item_id',
        };
        replacementData['Item ID'] = { data: data };
        break;

      case 'customer_payments':
        var data = await this.getIdReplacementData('customers_id_name', dataService);
        formData['Customer ID'].inputType = 'replacement';        
        replacementData['Customer ID'] = { data: data };
        break;

      case 'customer_address':
        var data = await this.getIdReplacementData('customers_id_name', dataService);
        formData['Customer Name'].inputType = 'replacement';        
        replacementData['Customer Name'] = { data: data };
        break;

      case 'page_section_text':
      case 'image_locations':
        var data = await this.getIdReplacementData('page_section_id_name', dataService);
        formData['Page Section ID'].inputType = 'replacement';
        replacementData['Page Section ID'] = { data: data };
        break;

      case 'retail_item_images':
      case 'allergen_information':
      case 'nutrition_info':
        var data = await this.getIdReplacementData('items_id_name', dataService);
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };
        break;

      case 'supplier_invoices':
        var data = await this.getIdReplacementData('supplier_id_name', dataService);
        formData['Supplier ID'].inputType = 'replacement';
        replacementData['Supplier ID'] = { data: data };
        break;
        
    }
    return { formData, replacementData };
  }

  getFieldValues(dataType: string, fieldValue: string) {
    switch (dataType) {
      case "date":
        return formatDate(new Date(), 'yyyy-MM-dd', 'en').toString();

      case "number":
        return "0";
    }

    return fieldValue;
  }

  getSelectDataOptions(dataType: string, inputType: string) {
    if (inputType == "select" && dataType.startsWith("enum")) {
      return this.deriveEnumOptions(dataType);
    }
    return null;
  }

  getCharacterLimit(dataType: string) {
    if (dataType.includes('varchar')) {
      let match = dataType.match(/\d+/g);
      return match ? parseInt(match[0]) : null;
    }
    return null;
  }

  async getIdReplacementData(query: string, dataService: DataService): Promise<any> {
    return await lastValueFrom(dataService.processData(query));
  }

  setReloadType(reloadType: string) {
    this.reloadType = reloadType;
  }

  getReloadType() {
    return this.reloadType;
  }

  setReloadId(reloadId: string) {
    this.reloadId = reloadId;
  }

  getReloadId() {
    return this.reloadId;
  }

  processEditFormData(id: number, row: any, editableData: {columns: any[], types: any[], names: any[], required: any[], fields: any[]}) {
    this.editFormData = {};
    var inputDataTypes = this.dataTypeToInputType(editableData.types);
    editableData.columns.forEach((columnName, index) => {
      this.editFormData[editableData.names[index]] = {
        value: row[columnName],
        inputType: inputDataTypes[index],
        dataType: editableData.types[index],
        required: editableData.required[index],
        fields: editableData.fields[index],
      };
    });
  }

  processAddFormData(editableData: {columns: any[], types: any[], names: any[], required: any[], fields: any[], values: any[]}) {
    this.addFormData = {};
    var inputDataTypes: string[] = this.dataTypeToInputType(editableData.types);
    editableData.columns.forEach((_, index) => {
      this.addFormData[editableData.names[index]] = {
        inputType: inputDataTypes[index],
        dataType: editableData.types[index],
        required: editableData.required[index],
        fields: editableData.fields[index],
        value: editableData.values ? editableData.values[index] : null,
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
        case "int":
          inputTypes.push("number");
          break;

        case "text":
          inputTypes.push("textarea")
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

  async handleImageSubmissions(itemId: string, itemName: string, image: File) {
    let imageFileName = await this.processImageName(itemId, itemName);

    const uploadResponse = await this.uploadImage(image, imageFileName);

    let title = 'Error!';
    let message = 'There was an issue uploading your image. Possible causes are the image is not a correct file type (.png, .jpg, .jpeg) or the file name contains special characters. Please try again!';
    let success = false;

    if (uploadResponse.success) {
      const recordUploadResponse = await this.addImageLocationToDatabase(itemId, imageFileName);

      if (recordUploadResponse.success) {
        title = 'Success!';
        message = 'Image uploaded successfully!';
        success = true;
      }
    }
    this.setMessageFormData({title: title, message: message})
    this.showMessageForm();
    return { success: success, imageFileName: imageFileName };
  }

  async uploadImage(image: File, imageFileName: string) {
    const formData = new FormData();
    formData.append('image', image, imageFileName);

    return await lastValueFrom(this.dataService.uploadImage(formData));
  }

  async processImageName(itemId: string | null, itemName: string) {
    itemName = itemName.replaceAll(/[^a-zA-Z0-9_]/g, '_');
    let fileName = itemName + '.png';
    let imageCount = 0;
    if (itemId != null) {
      imageCount = await lastValueFrom<number>(this.dataService.processData('image-count-from-item-id', itemId));
    }
    if (imageCount != null) {
      fileName = itemName + '_' + imageCount + '.png';
    }

    return fileName;
  }

  async addImageLocationToDatabase(itemId: string, imageFileName: string) {
    let imageFormData = {
      'action': 'add',
      'table_name': 'retail_item_images',
      'item_id': itemId,
      'image_file_name': imageFileName
    };

    return await lastValueFrom<{success: boolean, message: string}>(this.dataService.submitFormData(imageFormData)); 
  }

  async getImages(id: string, table: string) {
    if (id == null) {
      return [];
    }

    let query = "images-from-item-id";
    if (table == "image_locations") {
      query = "images-from-page-section-id";
    }

    let images = await lastValueFrom(this.dataService.processData(query, id));
    images = Array.isArray(images) ? images : [images];

    return images;
  }

  deriveEnumOptions(dataType: string) {
    return dataType
      .replace('enum(', '')
      .replace(')', '')
      .split(',')
      .map((option: any) => option.replace(/'/g, '').trim());
  }

  sync(formData: any, queryType: string, tableName: string) {
    switch(tableName) {
      case "stocked_items":
        
        break;
    }
  }
}
