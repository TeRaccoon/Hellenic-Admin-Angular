import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { formatDate } from '@angular/common';
import {
  settings,
  keyedData,
  message,
  editableData,
} from '../common/types/forms/types';

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
  private isBalanceSheetVisible = new BehaviorSubject<boolean>(false);

  private editFormData: keyedData = {};
  private addFormData: keyedData = {};

  private formSettings: settings = {
    showAddMore: false,
  };

  private alternativeSelectData: {
    [key: string]: {
      data: { value: string }[];
    };
  } = {};

  private deleteFormIds: number[] = [];
  private messageFormData: message = {
    title: '',
    message: '',
    footer: '',
  };

  private selectedTable: string = '';
  private selectedId: string = '';
  private reloadType: string = '';
  private reloadId: string = '';

  private waitingToReload = new BehaviorSubject<boolean>(false);

  constructor(private dataService: DataService) { }

  getReloadRequest(): Observable<boolean> {
    return this.waitingToReload.asObservable();
  }

  performReload() {
    this.waitingToReload.next(false);
  }

  requestReload(reloadType: string | null = null) {
    reloadType != null && this.setReloadType(reloadType);
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

  getBalanceSheetVisibility(): Observable<boolean> {
    return this.isBalanceSheetVisible.asObservable();
  }

  hideBalanceSheet() {
    this.isBalanceSheetVisible.next(false);
  }

  showBalanceSheet() {
    this.isBalanceSheetVisible.next(true);
  }

  hideWidget() {
    this.isWidgetVisible.next(false);
  }

  showWidget() {
    this.isWidgetVisible.next(true);
  }

  getFormSettings(): settings {
    return this.formSettings;
  }

  setEditFormData(editFormData: keyedData) {
    this.editFormData = editFormData;
  }

  setAddFormData(addFormData: keyedData) {
    this.addFormData = addFormData;
  }

  setDeleteFormIds(deleteFormIds: number[]) {
    this.deleteFormIds = deleteFormIds;
  }

  setMessageFormData(messageFormData: message) {
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
    //Replaces fields that need IDs with the text equivalent
    tableName: string,
    formData: any,
    replacementData: {
      [key: string]: {
        data: { id: Number; replacement: string }[];
      };
    }, // complex variable. key:string indicates the key to get data from the variable. replacementData['beer']
    dataService: DataService,
    formType?: string
  ) {
    switch (tableName) {
      case 'payments':
        var data = await this.getIdReplacementData(
          'expense_options_id',
          dataService
        );
        formData['Category'].inputType = 'replacement';
        replacementData['Category'] = { data: data };

        data = await this.getIdReplacementData(
          'supplier_id_name_code',
          dataService
        );
        formData['Supplier ID'].inputType = 'replacement';
        replacementData['Supplier ID'] = { data: data };
        break;

      case 'price_list':
        var data = await this.getIdReplacementData(
          'items_id_name_sku',
          dataService
        );
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };

        var data = await this.getIdReplacementData(
          'customers_id_name_code',
          dataService
        );
        formData['Customer Name'].inputType = 'replacement';
        replacementData['Customer Name'] = { data: data };
        break;

      case 'customers':
        formData['Password'].inputTpe = 'password';
        break;

      case 'items':
        var data = await this.getIdReplacementData('categories', dataService);
        formData['Category'].inputType = 'alternative-select';
        this.alternativeSelectData['Category'] = { data: data };

        data = await this.getIdReplacementData('sub-categories', dataService);
        formData['Sub-category'].inputType = 'alternative-select';
        this.alternativeSelectData['Sub-category'] = { data: data };

        data = await this.getIdReplacementData('offer_id_name', dataService);
        formData['Offer ID'].inputType = 'replacement';
        replacementData['Offer ID'] = { data: data };

        data = await this.getIdReplacementData('brands', dataService);
        formData['Brand'].inputType = 'replacement-text';
        replacementData['Brand'] = { data: data };
        break;

      case 'invoiced_items':
        var data = await this.getIdReplacementData(
          'items_id_name_sku',
          dataService
        );
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };

        data = await this.getIdReplacementData('invoice_id_title', dataService);
        formData['Invoice ID'].inputType = 'replacement';
        replacementData['Invoice ID'] = { data: data };
        break;

      case 'stocked_items':
        var data = await this.getIdReplacementData(
          'items_id_name_sku',
          dataService
        );
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };

        var data = await this.getIdReplacementData(
          'warehouse_id_name',
          dataService
        );
        formData['Warehouse'].inputType = 'replacement';
        replacementData['Warehouse'] = { data: data };

        var data = await this.getIdReplacementData(
          'supplier_invoice_id_reference',
          dataService
        );
        formData['Supplier Invoice ID'].inputType = 'replacement';
        replacementData['Supplier Invoice ID'] = { data: data };
        break;

      case 'sub_categories':
        var data = await this.getIdReplacementData(
          'category_id_name',
          dataService
        );
        formData['Parent Category'].inputType = 'replacement';
        replacementData['Parent Category'] = { data: data };
        break;

      case 'invoices':
        var data = await this.getIdReplacementData(
          'customers_id_name_code',
          dataService
        );
        formData['Customer Name'].inputType = 'replacement';
        replacementData['Customer Name'] = { data: data };

        data = await this.getIdReplacementData(
          'warehouse_id_name',
          dataService
        );
        formData['Warehouse ID'].inputType = 'replacement';
        replacementData['Warehouse ID'] = { data: data };

        data = await this.getIdReplacementData(
          'customer_address_id_full',
          dataService
        );
        formData['Delivery Address'].inputType = 'replacement';
        replacementData['Delivery Address'] = { data: data };

        data = await this.getIdReplacementData(
          'customer_billing_address_id_full',
          dataService
        );
        formData['Billing Address'].inputType = 'replacement';
        replacementData['Billing Address'] = { data: data };

        data = await this.getIdReplacementData(
          'items_id_name_sku',
          dataService
        );
        formData['Item ID'] = {
          inputType: 'replacement',
          value: null,
          fields: 'item_id',
        };
        replacementData['Item ID'] = { data: data };
        break;

      case 'customer_payments':
        let query =
          formType == 'edit' ? 'invoice_id_title' : 'invoice_id_title_unpaid';

        var data = await this.getIdReplacementData(query, dataService);
        formData['Invoice ID'].inputType = 'replacement';
        replacementData['Invoice ID'] = { data: data };

        data = await this.getIdReplacementData(
          'customers_id_name_code',
          dataService
        );
        formData['Customer'].inputType = 'replacement';
        replacementData['Customer'] = { data: data };
        break;

      case 'credit_notes':
      case 'supplier_payments':
        var data = await this.getIdReplacementData(
          'supplier_id_name_code',
          dataService
        );
        formData['Supplier'].inputType = 'replacement';
        replacementData['Supplier'] = { data: data };

        data = await this.getIdReplacementData(
          'supplier_invoice_id_reference',
          dataService
        );
        formData['Invoice'].inputType = 'replacement';
        replacementData['Invoice'] = { data: data };
        break;

      case 'offers':
        var data = await this.getIdReplacementData(
          'customers_id_name_code',
          dataService
        );
        formData['Customer'].inputType = 'replacement';
        replacementData['Customer'] = { data: data };
        break;

      case 'credit_notes_customers':
        var data = await this.getIdReplacementData(
          'customers_id_name_code',
          dataService
        );
        formData['Customer'].inputType = 'replacement';
        replacementData['Customer'] = { data: data };

        data = await this.getIdReplacementData('invoice_id_title', dataService);
        formData['Invoice'].inputType = 'replacement';
        replacementData['Invoice'] = { data: data };

        data = await this.getIdReplacementData('invoiced_item_id_name', dataService);
        formData['Invoiced Item ID'].inputType = 'replacement';
        replacementData['Invoiced Item ID'] = { data: data };
        break;

      case 'customer_address':
        var data = await this.getIdReplacementData(
          'customers_id_name',
          dataService
        );
        formData['Customer Name'].inputType = 'replacement';
        replacementData['Customer Name'] = { data: data };
        break;

      case 'page_section_text':
      case 'image_locations':
        var data = await this.getIdReplacementData(
          'page_section_id_name',
          dataService
        );
        formData['Page Section ID'].inputType = 'replacement';
        replacementData['Page Section ID'] = { data: data };
        break;

      case 'retail_item_images':
      case 'allergen_information':
      case 'nutrition_info':
        var data = await this.getIdReplacementData(
          'items_id_name',
          dataService
        );
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = { data: data };
        break;

      case 'supplier_invoices':
        var data = await this.getIdReplacementData(
          'supplier_id_name_code',
          dataService
        );
        formData['Supplier ID'].inputType = 'replacement';
        replacementData['Supplier ID'] = { data: data };

        data = await this.getIdReplacementData(
          'items_id_name_sku',
          dataService
        );
        formData['Item ID'] = {
          inputType: 'replacement',
          value: null,
          fields: 'item_id',
        };
        replacementData['Item ID'] = { data: data };

        data = await this.getIdReplacementData(
          'warehouse_id_name',
          dataService
        );
        formData['Warehouse ID'] = {
          inputType: 'replacement',
          value: null,
          fields: 'warehouse_id',
        };
        replacementData['Warehouse ID'] = { data: data };

        break;
    }
    return { formData, replacementData };
  }

  getFieldValues(dataType: string, fieldValue: string) {
    switch (dataType) {
      case 'date':
        return formatDate(new Date(), 'yyyy-MM-dd', 'en').toString();

      case 'number':
        return '0';
    }

    return fieldValue;
  }

  getSelectDataOptions(dataType: string, inputType: string) {
    if (inputType == 'select' && dataType.startsWith('enum')) {
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

  async getIdReplacementData(
    query: string,
    dataService: DataService
  ): Promise<any> {
    return await dataService.processGet(query, {}, true);
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

  processEditFormData(row: any, editableData: editableData) {
    this.editFormData = {};
    var inputDataTypes = this.dataTypeToInputType(editableData.types);
    editableData.columns.forEach((columnName, index) => {
      this.editFormData[editableData.names[index]] = {
        value: row[columnName],
        inputType: inputDataTypes[index],
        dataType: editableData.types[index],
        required: editableData.required[index],
        field: editableData.fields[index],
      };
    });
  }

  processAddFormData(
    editableData: editableData,
    row?: any,
    settings: settings = {
      showAddMore: false,
    }
  ) {
    this.addFormData = {};
    var inputDataTypes: string[] = this.dataTypeToInputType(editableData.types);
    editableData.columns.forEach((columnName, index) => {
      this.addFormData[editableData.names[index]] = {
        inputType: inputDataTypes[index],
        dataType: editableData.types[index],
        required: editableData.required[index],
        field: editableData.fields[index],
        value: editableData.values
          ? editableData.values[index]
          : row
            ? row[columnName]
            : null,
      };
    });
    this.formSettings = settings;
  }

  dataTypeToInputType(dataTypes: any[]) {
    var inputTypes: any[] = [];
    dataTypes.forEach((dataType: string) => {
      switch (dataType) {
        case 'date':
          inputTypes.push('date');
          break;

        case 'file':
          inputTypes.push('file');
          break;

        case 'password':
          inputTypes.push('password');
          break;

        case 'double':
        case 'float':
        case 'decimal(19,2)':
        case 'int':
          inputTypes.push('number');
          break;

        case 'text':
          inputTypes.push('textarea');
          break;

        default:
          if (!dataType.includes('enum')) {
            inputTypes.push('text');
          } else {
            inputTypes.push('select');
          }
      }
    });
    return inputTypes;
  }

  async handleImageSubmissions(
    id: string,
    name: string,
    image: File,
    tableName: string,
    showMessageOnlyOnError = false
  ) {
    let imageFileName = await this.processImageName(id, name, tableName);

    const uploadResponse = await this.uploadImage(image, imageFileName);

    let title = 'Success!';
    let message = 'Image uploaded successfully!';
    let success = true;

    let addToDatabase = this.shouldAddToDatabase(tableName);

    if (uploadResponse) {
      if (addToDatabase) {
        const recordUploadResponse = await this.addImageLocationToDatabase(
          id,
          imageFileName
        );
        if (!recordUploadResponse.success) {
          title = 'Error!';
          message =
            'There was an issue uploading your image. Possible causes are the image is not a correct file type (.png, .jpg, .jpeg) or the file name contains special characters. Please try again!';
          success = false;
        }
      }
    } else {
      title = 'Error!';
      message =
        'There was an issue uploading your image. Possible causes are the image is not a correct file type (.png, .jpg, .jpeg) or the file name contains special characters. Please try again!';
      success = false;
    }

    if ((showMessageOnlyOnError && !success) || !showMessageOnlyOnError) {
      this.setMessageFormData({ title: title, message: message });
      this.showMessageForm();
    }

    return { success: success, imageFileName: imageFileName };
  }

  async uploadImage(image: File, imageFileName: string) {
    const formData = new FormData();
    formData.append('image', image, imageFileName);

    return await this.dataService.uploadImage(formData);
  }

  async processImageName(
    id: string | null,
    name: string,
    tableName: string,
    postUpload = false
  ) {
    name = name.replaceAll(/[^a-zA-Z0-9_]/g, '_');

    let fileName = name + '.png';
    let imageCount = 0;

    let query = this.getImageCountQuery(tableName);

    if (id != null && query != null) {
      imageCount = await this.dataService.processGet(query, { filter: id });
    }

    if ((postUpload = true)) {
      imageCount++;
    }

    if (imageCount != null) {
      fileName = name + '_' + imageCount + '.png';
    }

    return fileName;
  }

  shouldAddToDatabase(tableName: string) {
    switch (tableName) {
      case 'items':
        return true;
    }

    return false;
  }

  getImageCountQuery(tableName: string) {
    switch (tableName) {
      case 'items':
        return 'image-count-from-item-id';

      case 'image_locations':
        return 'image-count-from-page-section-id';
    }

    return null;
  }

  async addImageLocationToDatabase(itemId: string, imageFileName: string) {
    let imageFormData = {
      action: 'add',
      table_name: 'retail_item_images',
      item_id: itemId,
      image_file_name: imageFileName,
    };

    return await this.dataService.submitFormData(imageFormData);
  }

  async getImages(id: string, table: string) {
    if (id == null) {
      return [];
    }

    let query = 'images-from-item-id';
    if (table == 'image_locations') {
      query = 'images-from-page-section-id';
    } else if (table === 'categories') {
      query = 'images-from-categories-id';
    }

    let images = await this.dataService.processGet(query, { filter: id }, true);

    return images;
  }

  deriveEnumOptions(dataType: string) {
    return dataType
      .replace('enum(', '')
      .replace(')', '')
      .split(',')
      .map((option: any) => option.replace(/'/g, '').trim());
  }

  constructFormSettings(tableName: string) {
    let settings: settings = { showAddMore: false };
    switch (tableName) {
      case 'price_list':
        settings.showAddMore = true;
        break;
    }
    return settings;
  }
}
