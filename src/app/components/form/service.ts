import { formatDate } from '@angular/common';
import { Injectable, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  Data,
  EditableData,
  FormType,
  FormVisible,
  KeyedAddress,
  KeyedData,
  Message,
  SelectReplacementData,
  Settings,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private formVisibility: FormVisible = {
    Login: signal(false),
    Add: signal(false),
    Edit: signal(false),
    Delete: signal(false),
    Message: signal(false),
    Filter: signal(false),
    ChangePassword: signal(false),
    InvoicedItem: signal(false),
    Widget: signal(false),
    BalanceSheet: signal(false),
  };

  private editFormData: KeyedData = {};
  private addFormData: KeyedData = {};

  private formSettings: Settings = {
    showAddMore: false,
  };

  private alternativeSelectData: Record<
    string,
    {
      data: string[];
    }
  > = {};

  private deleteFormIds: number[] = [];
  private messageFormData: Message = {
    title: '',
    message: '',
    footer: '',
  };

  private selectedTable = '';
  private selectedId = '';
  private reloadId = '';

  reloadRequested = signal<boolean>(false);
  reloadType: string | null = null;

  constructor(private dataService: DataService) {}

  getReloadRequestSignal() {
    return this.reloadRequested;
  }

  getReloadType() {
    return this.reloadType;
  }

  setReloadType(reloadType: string) {
    this.reloadType = reloadType;
  }

  performReload() {
    this.reloadRequested.set(false);
  }

  requestReload(reloadType: string | null = null) {
    if (reloadType != null) {
      this.reloadType = reloadType;
    }
    this.reloadRequested.set(true);
  }

  setFormVisibility(form: FormType, visible: boolean) {
    this.formVisibility[form].set(visible);
  }

  getFormVisibilitySignal(form: FormType) {
    return this.formVisibility[form];
  }

  getFormSettings(): Settings {
    return this.formSettings;
  }

  setEditFormData(editFormData: KeyedData) {
    this.editFormData = editFormData;
  }

  setAddFormData(addFormData: KeyedData) {
    this.addFormData = addFormData;
  }

  setDeleteFormIds(deleteFormIds: number[]) {
    this.deleteFormIds = deleteFormIds;
  }

  setMessageFormData(messageFormData: Message, display = true) {
    this.messageFormData = messageFormData;
    if (display) {
      this.formVisibility[FormType.Message].set(true);
    }
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
    replacementData: Record<string, SelectReplacementData[]>,
    formType?: string
  ) {
    let data;

    switch (tableName) {
      case 'payments':
        data = await this.getIdReplacementData('expense_options_id');
        formData['Category'].inputType = 'replacement';
        replacementData['Category'] = data;

        data = await this.getIdReplacementData('supplier_id_name_code');
        formData['Supplier ID'].inputType = 'replacement';
        replacementData['Supplier ID'] = data;
        break;

      case 'suppliers':
        data = await this.getIdReplacementData('supplier_id_types');
        formData['Type'].inputType = 'replacement';
        replacementData['Type'] = data;
        break;

      case 'price_list':
        data = await this.getIdReplacementData('customers_id_name_code');
        formData['Customer Name'].inputType = 'replacement';
        replacementData['Customer Name'] = data;
        break;

      case 'price_list_items':
        data = await this.getIdReplacementData('items_id_name_sku');
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = data;

        data = await this.getIdReplacementData('price_list_id_reference');
        formData['Price List ID'].inputType = 'replacement';
        replacementData['Price List ID'] = data;
        break;

      case 'customers':
        formData['Password'].inputType = 'password';
        break;

      case 'items':
        data = await this.getIdReplacementData('categories');
        formData['Category'].inputType = 'alternative-select';
        this.alternativeSelectData['Category'] = { data: data };

        data = await this.getIdReplacementData('sub-categories');
        formData['Sub-category'].inputType = 'alternative-select';
        this.alternativeSelectData['Sub-category'] = { data: data };

        data = await this.getIdReplacementData('offer_id_name');
        formData['Offer ID'].inputType = 'replacement';
        replacementData['Offer ID'] = data;

        data = await this.getIdReplacementData('brands');
        formData['Brand'].inputType = 'replacement-text';
        replacementData['Brand'] = data;
        break;

      case 'invoiced_items':
        data = await this.getIdReplacementData('items_id_name_sku');
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = data;

        data = await this.getIdReplacementData('invoice_id_title');
        formData['Invoice ID'].inputType = 'replacement';
        replacementData['Invoice ID'] = data;
        break;

      case 'stocked_items':
        data = await this.getIdReplacementData('items_id_name_sku');
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = data;

        data = await this.getIdReplacementData('warehouse_id_name');
        formData['Warehouse'].inputType = 'replacement';
        replacementData['Warehouse'] = data;

        data = await this.getIdReplacementData('supplier_invoice_id_reference');
        formData['Supplier Invoice ID'].inputType = 'replacement';
        replacementData['Supplier Invoice ID'] = data;
        break;

      case 'sub_categories':
        data = await this.getIdReplacementData('category_id_name');
        formData['Parent Category'].inputType = 'replacement';
        replacementData['Parent Category'] = data;
        break;

      case 'invoices':
        data = await this.getIdReplacementData('customers_id_name_code');
        formData['Customer Name'].inputType = 'replacement';
        replacementData['Customer Name'] = data;

        data = await this.getIdReplacementData('warehouse_id_name');
        formData['Warehouse ID'].inputType = 'replacement';
        replacementData['Warehouse ID'] = data;

        data = await this.getIdReplacementData('customer_address_id_full');
        formData['Delivery Address'].inputType = 'replacement';
        replacementData['Delivery Address'] = data;

        data = await this.getIdReplacementData('customer_billing_address_id_full');
        formData['Billing Address'].inputType = 'replacement';
        replacementData['Billing Address'] = data;

        data = await this.getIdReplacementData('items_id_name_sku');
        formData['Item ID'] = {
          inputType: 'replacement',
          value: null,
          fields: 'item_id',
        };
        replacementData['Item ID'] = data;
        break;

      case 'customer_payments': {
        const query = formType == 'edit' ? 'invoice_id_title' : 'invoice_id_title_unpaid';

        data = await this.getIdReplacementData(query);
        formData['Invoice ID'].inputType = 'replacement';
        replacementData['Invoice ID'] = data;

        data = await this.getIdReplacementData('customers_id_name_code');
        formData['Customer'].inputType = 'replacement';
        replacementData['Customer'] = data;
        break;
      }

      case 'credit_notes':
      case 'supplier_payments':
        data = await this.getIdReplacementData('supplier_id_name_code');
        formData['Supplier'].inputType = 'replacement';
        replacementData['Supplier'] = data;

        data = await this.getIdReplacementData('supplier_invoice_id_reference');
        formData['Invoice'].inputType = 'replacement';
        replacementData['Invoice'] = data;
        break;

      case 'offers':
        data = await this.getIdReplacementData('customers_id_name_code');
        formData['Customer'].inputType = 'replacement';
        replacementData['Customer'] = data;
        break;

      case 'credit_notes_customers':
        data = await this.getIdReplacementData('customers_id_name_code');
        formData['Customer'].inputType = 'replacement';
        replacementData['Customer'] = data;

        data = await this.getIdReplacementData('invoice_id_title');
        formData['Invoice'].inputType = 'replacement';
        replacementData['Invoice'] = data;

        data = await this.getIdReplacementData('invoiced_item_id_name');
        formData['Invoiced Item ID'].inputType = 'replacement';
        replacementData['Invoiced Item ID'] = data;
        break;

      case 'customer_address':
        data = await this.getIdReplacementData('customers_id_name');
        formData['Customer Name'].inputType = 'replacement';
        replacementData['Customer Name'] = data;
        break;

      case 'page_section_text':
      case 'image_locations':
        data = await this.getIdReplacementData('page_section_id_name');
        formData['Page Section ID'].inputType = 'replacement';
        replacementData['Page Section ID'] = data;
        break;

      case 'retail_item_images':
      case 'allergen_information':
      case 'nutrition_info':
        data = await this.getIdReplacementData('items_id_name');
        formData['Item ID'].inputType = 'replacement';
        replacementData['Item ID'] = data;
        break;

      case 'supplier_invoices':
        data = await this.getIdReplacementData('supplier_id_name_code');
        formData['Supplier ID'].inputType = 'replacement';
        replacementData['Supplier ID'] = data;

        data = await this.getIdReplacementData('items_id_name_sku');
        formData['Item ID'] = {
          inputType: 'replacement',
          value: null,
          fields: 'item_id',
        };
        replacementData['Item ID'] = data;

        data = await this.getIdReplacementData('warehouse_id_name');
        formData['Warehouse ID'] = {
          inputType: 'replacement',
          value: null,
          fields: 'warehouse_id',
        };
        replacementData['Warehouse ID'] = data;

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
    if (dataType.includes('letchar')) {
      const match = dataType.match(/\d+/g);
      return match ? parseInt(match[0]) : null;
    }
    return null;
  }

  async getIdReplacementData(query: string): Promise<any> {
    return await this.dataService.processGet(query, {}, true);
  }

  setReloadId(reloadId: string) {
    this.reloadId = reloadId;
  }

  getReloadId() {
    return this.reloadId;
  }

  processEditFormData(row: any, editableData: EditableData) {
    this.editFormData = {};
    const inputDataTypes = this.dataTypeToInputType(editableData.types);
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
    editableData: EditableData,
    row?: any,
    settings: Settings = {
      showAddMore: false,
    }
  ) {
    this.addFormData = {};
    const inputDataTypes: string[] = this.dataTypeToInputType(editableData.types);
    editableData.columns.forEach((columnName, index) => {
      this.addFormData[editableData.names[index]] = {
        inputType: inputDataTypes[index],
        dataType: editableData.types[index],
        required: editableData.required[index],
        field: editableData.fields[index],
        value: editableData.values ? editableData.values[index] : row ? row[columnName] : null,
      };
    });
    this.formSettings = settings;
  }

  dataTypeToInputType(dataTypes: string[]) {
    const inputTypes: string[] = [];
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
    const imageFileName = await this.processImageName(id, name, tableName);

    const uploadResponse = await this.uploadImage(image, imageFileName);

    let title = 'Success!';
    let message = 'Image uploaded successfully!';
    let success = true;

    const addToDatabase = this.shouldAddToDatabase(tableName);

    if (uploadResponse) {
      if (addToDatabase) {
        const recordUploadResponse = await this.addImageLocationToDatabase(id, imageFileName);
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
      this.setFormVisibility(FormType.Message, true);
    }

    return { success: success, imageFileName: imageFileName };
  }

  async uploadImage(image: File, imageFileName: string) {
    const formData = new FormData();
    formData.append('image', image, imageFileName);

    return await this.dataService.uploadImage(formData);
  }

  async processImageName(id: string | null, name: string, tableName: string, postUpload = false) {
    name = name.replaceAll(/[^a-zA-Z0-9_]/g, '_');

    let fileName = name + '.png';
    let imageCount = 0;

    const query = this.getImageCountQuery(tableName);

    if (id != null && query != null) {
      imageCount = await this.dataService.processGet(query, { filter: id });
    }

    if (postUpload) {
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
    const imageFormData = {
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

    const images = await this.dataService.processGet(query, { filter: id }, true);

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
    const settings: Settings = { showAddMore: false };
    switch (tableName) {
      case 'price_list':
        settings.showAddMore = false;
        break;
    }
    return settings;
  }

  getAddressSecondaryKeyAndPayload(addresses: KeyedAddress, customerId: string, key: string) {
    let payload;
    let secondaryKey;

    if (key == 'Billing Address') {
      secondaryKey = 'billing_address_id';
      payload = {
        invoice_address_one: addresses['Billing Address'].line1,
        invoice_address_two: addresses['Billing Address'].line2,
        invoice_address_three: addresses['Billing Address'].line3,
        invoice_postcode: addresses['Billing Address'].postcode,
        customer_id: customerId,
        action: 'add',
        table_name: 'customer_address',
      };
    } else {
      secondaryKey = 'address_id';
      payload = {
        delivery_address_one: addresses['Delivery Address'].line1,
        delivery_address_two: addresses['Delivery Address'].line2,
        delivery_address_three: addresses['Delivery Address'].line3,
        delivery_postcode: addresses['Delivery Address'].postcode,
        customer_id: customerId,
        action: 'add',
        table_name: 'customer_address',
      };
    }

    return { payload: payload, secondaryKey: secondaryKey };
  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  }

  sortFormDataArray(formDataArray: [string, Data][]) {
    return [...formDataArray].sort((a: [string, { inputType: string }], b: [string, { inputType: string }]) => {
      const aType = a[1].inputType;
      const bType = b[1].inputType;

      const isAText = aType === 'text' || aType === 'textarea';
      const isBText = bType === 'text' || bType === 'textarea';

      if (isAText && !isBText) return 1;
      if (!isAText && isBText) return -1;

      if (aType === 'text' && bType === 'textarea') return -1;
      if (aType === 'textarea' && bType === 'text') return 1;

      return aType.localeCompare(bType);
    });
  }

  async addDamagesPayment(invoicedItemID: string) {
    const damage = await this.dataService.processPost({
      action: 'calculate-damage-from-invoiced-item-id',
      id: invoicedItemID,
    });

    const response = await this.dataService.submitFormData({
      table_name: 'payments',
      action: 'add',
      amount: damage,
      payment_type: 'Other',
      category: 1,
      description: `Damages payment for returned product. Invoiced item ID: ${invoicedItemID}`,
      reference: `DMG-${invoicedItemID}`,
    });

    this.setMessageFormData({
      title: response.success ? 'Success!' : 'Error!',
      message: response.message,
    });
  }

  async restockInvoicedItem(invoicedItemID: string) {
    const invoicedItem = await this.dataService.processPost({
      action: 'invoiced-item',
      id: invoicedItemID,
    });

    if (invoicedItem.restocked == 'Yes') {
      this.setMessageFormData({
        title: 'Warning',
        message: 'Item has already been restocked. No action will be taken!',
      });

      return;
    }

    invoicedItem.restocked = 'Yes';

    const response = await this.dataService.submitFormData({
      table_name: 'invoiced_items',
      action: 'append',
      ...invoicedItem,
    });

    this.setMessageFormData({
      title: response.success ? 'Success!' : 'Error!',
      message: response.message,
    });
  }
}
