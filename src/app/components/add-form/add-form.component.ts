import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { formIcons } from '../../common/icons/form-icons';
import {
  keyedData,
  settings,
  data,
  keyedAddress,
  formState,
  SaleType,
} from '../../common/types/forms/types';
import { Subscription } from 'rxjs';
import { AddressUpdate } from '../invoice-address/types';
import {
  DISPLAY_INPUT_FIELD_TABLE_MAP_EXCLUSIONS,
  DISPLAY_PRICE_WARNING_TABLES,
} from './consts';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent {
  private readonly subscriptions = new Subscription();

  SaleType = SaleType;

  icons = formIcons;

  searchWaiting = false;
  disabled = false;

  noCustomer = false;
  saleTypeEnabled = true;

  addForm: FormGroup;
  addItemForm: FormGroup;

  mappedFormDataKeys: any;
  mappedFormData: Map<string, data> = new Map();
  formData: keyedData = {};

  formSettings: settings = {
    showAddMore: false,
  };

  tableName: string = '';

  file: File | null = null;
  fileName = '';

  selectData: { key: string; data: string[] }[] = [];

  filteredReplacementData: any = {};

  replacementData: {
    [key: string]: {
      data: { id: Number; replacement: string }[];
    };
  } = {};

  alternativeSelectData: {
    [key: string]: {
      data: { value: string }[];
    };
  } = {};

  itemData: any = [];

  saleType: SaleType = SaleType.Invoice;

  invoiceDetails: any = [];

  addressNotListedKeys: string[] = [];
  addresses: keyedAddress;

  invoiceCreated = false;

  formState!: formState;

  addItemFormSubmitAttempted = false;

  debounceSearch: (
    key: string,
    filter: string,
    field: string | null,
    text: boolean | null,
    alt: boolean
  ) => void = _.debounce(
    (
      key: string,
      filter: string,
      field: string | null,
      text = false,
      alt = false
    ) => this.performSearch(key, filter, field, text, alt),
    750
  );

  autoGeneratedReplacement: { [key: string]: { value: string } } = {};

  alternativeSelectedData: { [key: string]: { selectData: string } } = {};
  selectedReplacementData: {
    [key: string]: { selectData: string; selectDataId: Number | null } | null;
  } = {};
  selectedTextReplacementData: { [key: string]: string } = {};
  selectedReplacementFilter: { [key: string]: { selectFilter: string } } = {};
  selectOpen: { [key: string]: { opened: boolean | null } } = {};

  invoiceId: number | null = null;
  invoiceTotal: number = 0;
  itemsList: any[] = [];

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
  ) {
    this.addForm = this.fb.group({});
    this.addItemForm = this.fb.group({});
    this.addresses = {
      'Delivery Address': {
        line1: '',
        line2: '',
        line3: '',
        postcode: '',
        save: false,
      },
      'Billing Address': {
        line1: '',
        line2: '',
        line3: '',
        postcode: '',
        save: false,
      },
    };

    this.resetFormState();
  }

  ngOnInit() {
    this.debounceSearch = _.debounce(this.performSearch.bind(this), 1000);
    this.subscriptions.add(
      this.formService.getAddFormVisibility().subscribe(async (visible) => {
        this.changeVisibility(visible);
      })
    );

    if (this.tableName == 'invoices' || this.tableName == 'supplier_invoices') {
      this.subscriptions.add(
        this.formService
          .getReloadRequest()
          .subscribe(async (reloadRequested: boolean) => {
            if (reloadRequested) {
              await this.reload();
            }
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changeVisibility(visible: boolean) {
    if (!this.formState.hidden) {
      this.clearForm();
    }

    this.formState.visible = visible;

    if (visible && this.formState.hidden != this.tableName) {
      this.loadForm();
    }

    this.formState.hidden = null;
  }

  async reload() {
    let query =
      this.tableName == 'supplier_invoices'
        ? 'stocked-items-invoice'
        : 'invoiced-items';

    this.itemsList = await this.dataService.processGet(
      query,
      {
        id: this.invoiceId?.toString(),
        complex: true,
      },
      true
    );

    query =
      this.tableName == 'supplier_invoices' ? 'supplier-invoice' : 'invoice';

    this.invoiceTotal = (
      await this.dataService.processGet(query, { filter: this.invoiceId })
    ).total;
  }

  resetFormState(): void {
    this.formState = {
      loaded: false,
      submissionAttempted: false,
      submitted: false,
      error: null,
      locked: false,
      visible: false,
      imageUploaded: false,
      hidden: null
    };
  }

  async loadForm() {
    this.formData = this.formService.getAddFormData();
    this.tableName = this.formService.getSelectedTable();
    this.formSettings = this.formService.getFormSettings();

    if (
      this.tableName !== '' &&
      Object.keys(this.formData).length != 0 &&
      !this.formState.loaded
    ) {
      await this.buildForm();
      await this.replaceAmbiguousData();
      await this.isAutoGenerated();
      this.formState.loaded = true;
    }
  }

  clearForm() {
    this.formData = {};
    this.replacementData = {};
    this.addForm = this.fb.group({});
    this.addForm.reset();
    this.resetFormState();
    this.addItemForm = this.fb.group({});
    this.addItemForm.reset();
    this.file = null;
    this.itemsList = [];
    this.invoiceCreated = false;
    this.disabled = false;
    this.noCustomer = false;
    this.addressNotListedKeys = [];
    this.invoiceDetails = [];
    this.selectData = [];
    this.saleTypeEnabled = true;
    this.autoGeneratedReplacement = {};
    this.alternativeSelectData = {};
  }

  async replaceAmbiguousData() {
    const data = await this.formService.replaceAmbiguousData(
      this.tableName,
      this.formData,
      this.replacementData,
      this.dataService
    );
    this.formData = data.formData;
    this.filteredReplacementData = data.replacementData;
    this.replacementData = data.replacementData;
    this.alternativeSelectData = this.formService.getAlternativeSelectData();
    Object.keys(this.alternativeSelectData).forEach((key) => {
      this.alternativeSelectedData[key] = { selectData: '' };
      this.selectOpen[key] = { opened: false };
    });
    Object.keys(this.replacementData).forEach((key) => {
      if (!Array.isArray(this.filteredReplacementData[key].data)) {
        this.filteredReplacementData[key].data = [
          this.filteredReplacementData[key].data,
        ];
      }
      if (
        this.filteredReplacementData[key].data.length > 0 &&
        this.filteredReplacementData[key].data[0]?.id != null
      ) {
        var tempReplacement =
          this.formData[key].value == null
            ? null
            : this.filteredReplacementData[key].data.find(
              (item: { id: number; data: string }) =>
                item.id === Number(this.formData[key].value)
            )?.replacement;
        this.selectedReplacementData[key] = {
          selectData: tempReplacement,
          selectDataId: Number(this.formData[key].value),
        };
        this.selectedReplacementFilter[key] = { selectFilter: '' };
        this.selectOpen[key] = { opened: false };

        this.filteredReplacementData[key].data = this.filteredReplacementData[
          key
        ].data.filter((item: any) => item.replacement != null);
      } else if (this.filteredReplacementData[key].data[0] != null) {
        this.selectedTextReplacementData[key] = '';
        this.selectOpen[key] = { opened: false };
      }
    });
  }

  async isAutoGenerated() {
    switch (this.tableName) {
      case 'invoices':
        await this.replaceAutoGeneratedFields('title');
        this.updateSelectedReplacementDataFromKey(
          this.filteredReplacementData['Warehouse ID'].data[0].id,
          this.filteredReplacementData['Warehouse ID'].data[0].replacement,
          'Warehouse ID',
          'warehouse_id',
          false
        );
        break;

      case 'supplier_invoices':
        await this.replaceAutoGeneratedFields('reference');

        this.updateSelectedReplacementDataFromKey(
          this.filteredReplacementData['Warehouse ID'].data[0].id,
          this.filteredReplacementData['Warehouse ID'].data[0].replacement,
          'Warehouse ID',
          'warehouse_id',
          true
        );
        break;

      case 'stocked_items':
        this.updateSelectedReplacementDataFromKey(
          this.filteredReplacementData['Warehouse'].data[0].id,
          this.filteredReplacementData['Warehouse'].data[0].replacement,
          'Warehouse',
          'warehouse_id',
          false
        );

        let itemId = this.addForm.get('item_id')?.value;
        if (itemId != null) {
          this.handleStockedItems(itemId);
        }
        break;

      case 'suppliers':
        await this.replaceAutoGeneratedFields('account_code');
        break;

      case 'customers':
        this.addForm.get('discount')?.setValue(0);
        break;
    }
    return false;
  }

  async replaceAutoGeneratedFields(field: string) {
    switch (field) {
      case 'title':
        let nextInvoiceId = await this.dataService.processGet('next-id', {
          filter: this.tableName,
        });
        if (nextInvoiceId != null) {
          this.addForm.get(field)?.setValue('INV' + nextInvoiceId);
          this.autoGeneratedReplacement[field] = {
            value: 'INV' + nextInvoiceId,
          };
          this.invoiceId = nextInvoiceId;
        }
        break;

      case 'account_code':
        let nextSupplierAccountCode = await this.dataService.processGet(
          'next-supplier-account-code',
          { filter: this.tableName }
        );
        if (nextSupplierAccountCode) {
          this.autoGeneratedReplacement[field] = {
            value: 'S00-' + nextSupplierAccountCode,
          };
        }
        break;

      case 'reference':
        let nextId = await this.dataService.processGet('next-id', {
          filter: this.tableName,
        });
        if (nextId != null) {
          this.autoGeneratedReplacement[field] = {
            value: 'SPL' + String(nextId).padStart(6, '0'),
          };
        }
        break;
    }
  }

  async resetAddItemForm() {
    if (this.tableName == 'supplier_invoices') {
      this.addItemForm = this.fb.group({
        purchase_date: [
          new Date().toISOString().split('T')[0],
          [Validators.required],
        ],
        expiry_date: [
          new Date().toISOString().split('T')[0],
          [Validators.required],
        ],
        item_id: ['', [Validators.required]],
        purchase_price: ['', [Validators.required]],
        quantity: ['', [Validators.required]],

        packing_format: ['Individual', [Validators.required]],
        barcode: ['', [Validators.required]],
        warehouse_id: ['', [Validators.required]],
      });
      this.invoiceId = await this.dataService.processGet('next-id', {
        filter: 'supplier_invoices',
      });
    } else {
      this.addItemForm = this.fb.group({
        item_id: ['', [Validators.required]],
        quantity: ['', [Validators.required]],
        discount: [''],
        unit: ['', [Validators.required]],
      });
    }
  }

  async buildForm() {
    if (this.shouldDisplayItemWidget()) {
      delete this.formData['Item ID'];
      await this.resetAddItemForm();
    }

    let formDataArray = Object.entries(this.formData);
    formDataArray.sort((a: any, b: any) =>
      a[1].inputType.localeCompare(b[1].inputType)
    );
    this.mappedFormData = new Map(formDataArray);
    this.mappedFormDataKeys = Array.from(this.mappedFormData.keys());

    let index = 0;
    for (const key in this.formData) {
      if (
        this.formData.hasOwnProperty(key) &&
        this.formData[key].dataType != undefined
      ) {
        const field = this.formData[key];

        let fieldValue = this.formService.getFieldValues(
          field.dataType,
          field.value
        );
        let characterLimit = this.formService.getCharacterLimit(field.dataType);

        let selectData = this.formService.getSelectDataOptions(
          field.dataType,
          field.inputType
        );
        if (selectData != null) {
          fieldValue = selectData[0];
          this.selectData.push({ key: key, data: selectData });
        }

        let controlValidators =
          characterLimit != null ? [Validators.maxLength(characterLimit)] : [];
        if (field.required) {
          controlValidators.push(Validators.required);
        }

        this.addForm.addControl(
          field.field,
          this.fb.control(
            { value: fieldValue != null ? fieldValue : '', disabled: false },
            controlValidators
          )
        );
      }
      index++;
    }

    this.addForm.addControl('action', this.fb.control('add'));
    this.addForm.addControl('table_name', this.fb.control(this.tableName));

    if (this.shouldDisplayItemWidget()) {
      this.itemData = await this.dataService.processGet('items_id_name_sku');
    }
  }

  async formSubmit(hideForm: boolean) {
    this.formState.submissionAttempted = true;
    if (this.addForm.valid) {
      if (this.tableName != 'categories') {
        const validationResult = await this.imageSubmissionValidation();

        if (validationResult !== false) {
          this.submissionWithImage(
            validationResult.id,
            validationResult.name,
            hideForm
          );
        } else {
          this.submissionWithoutImage(hideForm);
        }
      } else {
        this.standardImageSubmission();
      }
    }
  }

  async standardImageSubmission() {
    if (this.file != null) {
      const uploadResponse = await this.formService.uploadImage(
        this.file,
        this.file?.name
      );
      if (uploadResponse.success) {
        this.addForm.get('image_file_name')?.setValue(this.file.name);
        this.submissionWithoutImage(true);
      }
    } else {
      this.submissionWithoutImage(true);
    }
  }

  async imageSubmissionValidation() {
    if (!this.canUploadImages()) {
      return false;
    }

    if (this.file == null || this.addForm.get('image_file_name') == null) {
      this.formState.error =
        'Please choose an image to upload before trying to upload!';
      return false;
    }

    let id = await this.getImageDependentId();
    let name = this.getImageDependentName();

    if (id == null || name == null) {
      this.formState.error =
        'Please fill out the relevant fields to upload an image for before trying to upload!';
      return false;
    }
    return { id: id, name: name };
  }

  async getImageDependentId() {
    switch (this.tableName) {
      case 'items':
        return await this.dataService.processGet('next-id', {
          filter: 'items',
        });

      case 'image_locations':
        return this.addForm.value['page_section_id'];
    }

    return null;
  }

  getImageDependentName() {
    switch (this.tableName) {
      case 'items':
        return this.addForm.get('item_name')?.value;

      case 'image_locations':
        return this.selectedReplacementData['Page Section ID']?.selectData;
    }

    return null;
  }

  canUploadImages() {
    switch (this.tableName) {
      case 'items':
      case 'image_locations':
        return true;
    }
    return false;
  }

  async submitImageOnly() {
    const validationResult = await this.imageSubmissionValidation();
    if (validationResult !== false) {
      await this.formService.handleImageSubmissions(
        validationResult.id,
        validationResult.name,
        this.file as File,
        this.tableName
      );
    }
  }

  async submissionWithoutImage(hideForm: boolean) {
    let submissionResponse = await this.dataService.submitFormData(
      this.addForm.value
    );
    this.formService.setMessageFormData({
      title: submissionResponse.success ? 'Success!' : 'Error!',
      message: submissionResponse.message,
    });
    this.endSubmission(submissionResponse.success, submissionResponse.success);
  }

  async submissionWithImage(id: string, name: string, hideForm: boolean) {
    let imageFileName = await this.formService.processImageName(
      id,
      name,
      this.tableName,
      true
    );

    this.addForm.get('image_file_name')?.setValue(imageFileName);
    const formSubmitResponse = await this.dataService.submitFormData(
      this.addForm.value
    );

    if (formSubmitResponse.success) {
      await this.formService.handleImageSubmissions(
        id,
        name,
        this.file as File,
        this.tableName,
        true
      );
    }

    this.formService.setMessageFormData({
      title: formSubmitResponse.success ? 'Success!' : 'Error!',
      message: formSubmitResponse.message,
    });
    this.formService.showMessageForm();

    this.endSubmission(formSubmitResponse.success, formSubmitResponse.success);
  }

  endSubmission(reset: boolean, hideForm: boolean) {
    if (this.shouldDisplayItemWidget()) {
      this.invoiceCreated = true;
      this.disableControls();
    } else {
      !reset && this.formService.showMessageForm();
      hideForm && this.hide();
      if (reset) {
        this.formService.requestReload('hard');
        this.addForm.reset();
        this.alternativeSelectData = {};
        this.formState.submissionAttempted = false;
        this.addForm.get('action')?.setValue('add');
        this.addForm.get('table_name')?.setValue(this.tableName);
        this.formState.error = null;
        this.selectedReplacementData = {};
        this.saleTypeEnabled = true;
      }
    }
    this.formState.submitted = true;
  }

  disableControls() {
    Object.keys(this.addForm.controls).forEach((controlKey: string) => {
      this.addForm.get(controlKey)?.disable();
    });

    if (this.tableName == 'invoices') {
      this.saleTypeEnabled = false;
    }

    this.disabled = true;
  }

  shouldDisplayPriceWarning() {
    let includedTables = DISPLAY_PRICE_WARNING_TABLES;
    return includedTables.includes(this.tableName);
  }

  primeImage(event: any) {
    this.file = event.target.files[0];
  }

  selectDataFromKey(key: string) {
    const matchingData = this.selectData.find((data) => data.key === key);
    if (matchingData) {
      return matchingData.data;
    }

    return [];
  }

  hide() {
    this.formState.visible = false;
    this.formService.hideAddForm();
  }

  minimize() {
    this.formState.visible = false;
    this.formState.hidden = this.tableName;
  }

  async updateSelectedReplacementDataFromKey(
    dataId: number,
    dataValue: string,
    key: string,
    field: string,
    alt: boolean
  ) {
    this.updateReplacementData(key, dataId, dataValue);
    this.setFormValue(field, dataId, alt);

    if (this.tableName === 'invoices' && field === 'customer_id') {
      await this.handleInvoiceCustomer(dataId);
    } else if (
      this.tableName === 'customer_payments' &&
      field === 'customer_id'
    ) {
      await this.handleCustomerPayments(dataId);
    } else if (this.tableName === 'credit_notes' && field === 'supplier_id') {
      await this.handleCreditNotesSupplier(dataId);
    } else if (
      this.tableName === 'credit_notes_customers' &&
      field === 'customer_id'
    ) {
      await this.handleCreditNotesCustomers(dataId);
    } else if (
      this.tableName === 'supplier_payments' &&
      field === 'supplier_id'
    ) {
      await this.handleSupplierPayments(dataId);
    } else if (this.tableName === 'stocked_items' && field === 'item_id') {
      await this.handleStockedItems(dataId);
    } else if (this.tableName === 'supplier_invoices' && alt && field === 'item_id') {
      await this.handleSupplierInvoices(dataId);
    } else if (this.tableName === 'credit_notes_customers' && field === 'invoice_id') {
      await this.handleCreditNotesCustomersInvoices(dataId);
    }

    if (this.isBarcodeGenerationRequired(field)) {
      await this.generateBarcode(alt);
    }

    this.selectOpen[key].opened = false;
  }

  private updateReplacementData(
    key: string,
    dataId: number,
    dataValue: string
  ) {
    this.selectedReplacementData[key] = {
      selectData: dataValue,
      selectDataId: dataId,
    };
  }

  private setFormValue(field: string, dataId: number, alt: boolean) {
    const form = alt ? this.addItemForm : this.addForm;
    form.get(field)?.setValue(dataId);
  }

  private async handleInvoiceCustomer(dataId: number) {
    this.updateAddresses(dataId.toString());
    let customerType = await this.dataService.processGet('customer-type', {
      filter: dataId.toString(),
    });
    this.addForm.get('type')?.setValue(customerType);
  }

  private async handleCustomerPayments(dataId: number) {
    this.invoiceDetails = await this.dataService.processGet(
      'invoice-outstanding',
      { filter: dataId.toString() },
      true
    );
    this.updateReplacementDataForInvoices(this.invoiceDetails);
  }

  private async handleCreditNotesSupplier(dataId: number) {
    this.invoiceDetails = await this.dataService.processGet(
      'supplier-invoice-from-supplier',
      { filter: dataId.toString() },
      true
    );
    this.updateReplacementDataForInvoices(this.invoiceDetails, 'reference');
  }

  private async handleCreditNotesCustomers(dataId: number) {
    this.invoiceDetails = await this.dataService.processGet(
      'invoice-by-customer',
      { filter: dataId.toString() },
      true
    );
    this.updateReplacementDataForInvoices(this.invoiceDetails, 'title', 'Invoice');
  }

  private async handleCreditNotesCustomersInvoices(dataId: number) {
    const invoicedItems = await this.dataService.processGet(
      'invoiced-item-by-invoice',
      { filter: dataId.toString() },
      true
    );
    this.updateReplacementDataForInvoices(invoicedItems, 'item_name', 'Invoiced Item ID')
  }

  private async handleSupplierPayments(dataId: number) {
    this.invoiceDetails = await this.dataService.processGet(
      'supplier-invoice-outstanding',
      { filter: dataId.toString() },
      true
    );
    this.updateReplacementDataForInvoices(this.invoiceDetails, 'reference');
  }

  private async handleStockedItems(dataId: number) {
    const lastPurchasePrice = await this.dataService.processGet(
      'last-purchase-price',
      { filter: dataId }
    );
    if (lastPurchasePrice.length > 0 && lastPurchasePrice[0] != null) {
      this.addForm.get('purchase_price')?.setValue(lastPurchasePrice[0]);
    }
  }

  private async handleSupplierInvoices(dataId: number) {
    const lastPurchasePrice = await this.dataService.processGet(
      'last-purchase-price',
      { filter: dataId }
    );
    if (lastPurchasePrice.length > 0 && lastPurchasePrice[0] != null) {
      this.addItemForm.get('purchase_price')?.setValue(lastPurchasePrice[0]);
    }
  }

  inputChanged(field: string) {
    if (
      this.tableName == 'stocked_items' &&
      field == 'expiry_date' &&
      this.addForm.get('item_id')?.value != null
    ) {
      this.generateBarcode();
    }
  }

  private updateReplacementDataForInvoices(
    invoiceDetails: any[],
    key: string = 'title',
    replacementKey = 'Invoice ID'
  ) {
    this.filteredReplacementData[replacementKey].data = this.replacementData[
      replacementKey
    ].data = invoiceDetails.map((i: any) => ({
      id: i.id,
      replacement: i[key],
    }));
  }

  private isBarcodeGenerationRequired(field: string) {
    return (
      (this.tableName === 'stocked_items' ||
        this.tableName === 'supplier_invoices') &&
      (field === 'item_id' || field === 'expiry_date')
    );
  }

  private async generateBarcode(alt: boolean = false) {
    const form = alt ? this.addItemForm : this.addForm;
    if (
      form.get('item_id')?.value != null &&
      form.get('expiry_date')?.value != null
    ) {
      const item = await this.dataService.processGet('items', {
        filter: form.get('item_id')?.value,
      });
      const stockCode = item['stock_code'];
      const barcode = `${stockCode}-${form.get('expiry_date')?.value
        }-${this.generateRandomString(7)}`;
      form.get('barcode')?.setValue(barcode);
    }
  }

  async updateAddresses(id: string) {
    let addresses = await this.dataService.processGet(
      'customer-addresses-by-id',
      { filter: id },
      true
    );

    if (addresses.length == 0) {
      this.addressNotListed('Delivery Address');
      this.addressNotListed('Billing Address');
    } else {
      this.updateCustomerAddresses(addresses, 'Delivery Address', 'address_id');
      this.updateCustomerAddresses(
        addresses,
        'Billing Address',
        'billing_address_id'
      );
    }
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

  updateSelectedTextReplacementDataFromKey(
    value: string,
    key: string,
    field: string
  ) {
    this.addForm.get(field)?.setValue(value);
    this.selectedTextReplacementData[key] = value;
    this.selectOpen[key].opened = false;
  }

  async updateCustomerAddresses(
    addressData: any,
    key: string,
    secondaryKey: string
  ) {
    let addressReplacement = addressData.map((address: any) => {
      let replacement;
      if (key == 'Delivery Address') {
        replacement = [
          address.delivery_address_one,
          address.delivery_address_two,
          address.delivery_address_three,
          address.delivery_address_four,
          address.delivery_postcode,
        ];
      } else {
        replacement = [
          address.invoice_address_one,
          address.invoice_address_two,
          address.invoice_address_three,
          address.invoice_address_four,
          address.invoice_postcode,
        ];
      }
      replacement = replacement
        .filter((component) => component != null)
        .join(' ');

      return {
        id: Number(address.id),
        replacement: replacement,
      };
    });

    this.selectedReplacementData[key] = {
      selectData: addressReplacement[0].replacement,
      selectDataId: addressReplacement[0].id,
    };

    this.addForm.get(secondaryKey)?.setValue(addressReplacement[0].id);

    this.replacementData[key].data = addressReplacement;
    this.filteredReplacementData[key].data = addressReplacement;
  }

  updateAddressValues(addressUpdate: AddressUpdate): void {
    this.addresses[addressUpdate.key] = {
      ...this.addresses[addressUpdate.key],
      [addressUpdate.field]: addressUpdate.value,
    };
  }

  async addAddressToBook(key: string) {
    let customerId =
      this.addresses[key]?.save == false
        ? null
        : this.addForm.get('customer_id')?.value;

    let payload;
    let secondaryKey;

    if (key == 'Billing Address') {
      secondaryKey = 'billing_address_id';
      payload = {
        invoice_address_one: this.addresses['Billing Address'].line1,
        invoice_address_two: this.addresses['Billing Address'].line2,
        invoice_address_three: this.addresses['Billing Address'].line3,
        invoice_postcode: this.addresses['Billing Address'].postcode,
        customer_id: customerId,
        action: 'add',
        table_name: 'customer_address',
      };
    } else {
      secondaryKey = 'address_id';
      payload = {
        delivery_address_one: this.addresses['Delivery Address'].line1,
        delivery_address_two: this.addresses['Delivery Address'].line2,
        delivery_address_three: this.addresses['Delivery Address'].line3,
        delivery_postcode: this.addresses['Delivery Address'].postcode,
        customer_id: customerId,
        action: 'add',
        table_name: 'customer_address',
      };
    }

    let response = await this.dataService.submitFormData(payload);
    if (response.success) {
      let id = response.id;

      this.addressNotListedKeys = this.addressNotListedKeys.filter(
        (addressKey) => addressKey != key
      );
      if (!this.noCustomer) {
        this.selectedReplacementData[key] = {
          selectData: [
            this.addresses[key].line1,
            this.addresses[key].line2,
            this.addresses[key].line3,
            this.addresses[key].postcode,
          ].join(' '),
          selectDataId: id,
        };

        let replacement = {
          id: id,
          replacement: [
            this.addresses[key].line1,
            this.addresses[key].line2,
            this.addresses[key].line3,
            this.addresses[key].postcode,
          ].join(' '),
        };

        this.replacementData[key].data.push(replacement);
        this.addForm.get(secondaryKey)?.setValue(id);
      } else {
        let address = await this.dataService.processGet('customer-addresses', {
          filter: id,
        });
        await this.updateCustomerAddresses([address], key, secondaryKey);
        await this.updateSelectedReplacementDataFromKey(
          id,
          this.filteredReplacementData[key]!.data[
            this.filteredReplacementData[key].data.length - 1
          ].replacement,
          key,
          key == 'Delivery Address' ? 'address_id' : 'billing_address_id',
          false
        );
      }

      this.resetAddresses(key);
    } else {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: 'There was an issue adding the address to the address book!',
      });
    }
  }

  resetAddresses(key: string) {
    this.addresses[key] = {
      line1: '',
      line2: '',
      line3: '',
      postcode: '',
      save: false,
    };
  }

  updateAlternativeSelectData(field: string, data: any, key: string) {
    this.alternativeSelectedData[key] = { selectData: data };
    this.addForm.get(field)?.setValue(data);
    this.selectOpen[key].opened = false;
  }

  filterDropSelect(
    key: string,
    event: any,
    includeField: boolean,
    field: string | null = null,
    alt: boolean = false
  ) {
    const filter = event.target.value || '';
    this.selectedReplacementData[key]!.selectData = filter;

    if (this.replacementData[key]?.data.length > 0) {
      let derivedField = includeField
        ? this.mappedFormData.get(key)!.field
        : field;
      this.debounceSearch(key, filter, derivedField, false, alt);
    }
  }

  filterTextDropSelect(key: string, event: any, field: string) {
    const filter = event.target.value || '';
    this.addForm.get(field)?.setValue(filter);
    if (this.replacementData[key] != null) {
      this.selectedReplacementData[key] = filter;

      if (this.replacementData[key]?.data.length > 0) {
        this.debounceSearch(key, filter, null, true, false);
      }
    }
  }

  performSearch(
    key: string,
    filter: string,
    field: string | null,
    text: boolean | null = false,
    alt = false
  ) {
    this.filteredReplacementData = _.cloneDeep(this.replacementData);

    if (text) {
      this.filteredReplacementData[key].data = this.replacementData[
        key
      ].data.filter((data: any) => {
        return data && data.toLowerCase().includes(filter.toLowerCase());
      });
    } else {
      this.filteredReplacementData[key].data = this.replacementData[
        key
      ].data.filter((data: any) => {
        return (
          data.replacement &&
          data.replacement.toLowerCase().includes(filter.toLowerCase())
        );
      });
    }
    if (this.filteredReplacementData[key].data.length == 1) {
      if (text) {
        this.selectedTextReplacementData[key] =
          this.filteredReplacementData[key].data[0];
      } else if (field) {
        this.updateSelectedReplacementDataFromKey(
          this.filteredReplacementData[key].data[0].id,
          this.filteredReplacementData[key].data[0].replacement,
          key,
          field,
          alt
        );
      }

      this.selectOpen[key].opened = false;
    }
  }

  async addItem(event: Event) {
    if (!this.addForm.valid && !this.invoiceCreated) {
      this.formState.submissionAttempted = true;
      return;
    }

    if (!this.invoiceCreated) {
      await this.formSubmit(false);
    }

    this.addItemFormSubmitAttempted = true;

    if (this.addItemForm.valid) {
      this.addItemForm.addControl('action', this.fb.control('add'));

      if (this.tableName == 'supplier_invoices') {
        this.addItemForm.addControl(
          'supplier_invoice_id',
          this.fb.control(this.invoiceId)
        );
        this.addItemForm.addControl(
          'table_name',
          this.fb.control('stocked_items')
        );
      } else {
        this.addItemForm.addControl(
          'invoice_id',
          this.fb.control(this.invoiceId)
        );
        this.addItemForm.addControl(
          'table_name',
          this.fb.control('invoiced_items')
        );
      }

      let submissionResponse = await this.dataService.submitFormData(
        this.addItemForm.value
      );
      if (!submissionResponse.success) {
        this.formService.setMessageFormData({
          title: 'Error!',
          message: submissionResponse.message,
        });
        this.formService.showMessageForm();
      }

      let query =
        this.tableName == 'supplier_invoices'
          ? 'stocked-items-invoice'
          : 'invoiced-items';

      this.itemsList = await this.dataService.processGet(
        query,
        {
          id: this.invoiceId?.toString(),
          complex: true,
        },
        true
      );

      query =
        this.tableName == 'supplier_invoices' ? 'supplier-invoice' : 'invoice';

      this.invoiceTotal = (
        await this.dataService.processGet(query, {
          filter: this.invoiceId,
        })
      ).total;

      event.preventDefault();
      this.findInvalidControls();

      await this.resetAddItemForm();
      this.selectedReplacementData['Item ID'] = {
        selectData: '',
        selectDataId: 0,
      };
      this.filteredReplacementData['Item ID'] = this.replacementData['Item ID'];

      this.addItemFormSubmitAttempted = false;
    }
  }

  addressNotListed(key: string) {
    this.formState.submitted = false;
    if (this.addForm.get('customer_id')?.value != '' || this.noCustomer) {
      this.addressNotListedKeys.push(key);
    } else {
      this.formState.error = 'Please select a customer first!';
      this.formState.submitted = true;
    }
  }

  disableCustomer() {
    this.noCustomer = true;
    this.addForm.get('customer_id')?.setValidators(null);
    this.addForm.get('customer_id')?.setValue(null);
    this.addressNotListed('Delivery Address');
    this.addressNotListed('Billing Address');
  }

  changeSaleType(event: Event) {
    let value: SaleType = (event.target as HTMLSelectElement).value as SaleType;
    this.saleType = value;
    if (this.saleType == SaleType.Cash) {
      let data = this.replacementData['Delivery Address'];
      let replacement = data.data.filter(
        (data: any) => data.replacement == 'N/A: Counter Sale'
      )[0];
      this.addForm.get('address_id')?.setValue(replacement.id);
      this.selectedReplacementData['Delivery Address'] = {
        selectData: replacement.replacement,
        selectDataId: replacement.id,
      };
    } else {
      this.addForm.get('address_id')?.setValue(null);
      this.selectedReplacementData['Delivery Address'] = {
        selectData: '',
        selectDataId: 0,
      };
    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.addForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  inputHasError(field: string) {
    return (
      this.addForm.get(field)?.invalid && this.formState.submissionAttempted
    );
  }

  itemInputHasError(field: string) {
    return (
      this.addItemForm.get(field)?.invalid && this.addItemFormSubmitAttempted
    );
  }

  onInputFocus(key: string) {
    for (let keys in this.selectOpen) {
      this.selectOpen[keys] = { opened: false };
    }
    this.selectOpen[key] = { opened: true };
  }

  onInputBlur(key: string) {
    this.selectOpen[key] = { opened: false };
  }

  canDisplayInputField(key: string) {
    const excludedFields =
      DISPLAY_INPUT_FIELD_TABLE_MAP_EXCLUSIONS[this.tableName] || [];

    if (this.tableName === 'invoices') {
      if (
        (key === 'Customer Name' && this.noCustomer) ||
        (key === 'Billing Address' && this.saleType === SaleType.Cash)
      ) {
        return false;
      }
    }

    if (this.tableName === 'credit_notes_customers') {
      if (key === 'Restock' && this.addForm.get('invoiced_item_id')?.value == '') {
        return false;
      }
      if (key === 'Invoiced Item ID' && this.addForm.get('invoice_id')?.value == '') {
        return false
      }
    }

    return !excludedFields.includes(key);
  }

  close() {
    this.formService.requestReload('hard');
    this.formService.setMessageFormData({
      title: 'Success',
      message: 'Invoice saved successfully!',
    });
    this.formService.showMessageForm();
    this.hide();
  }

  fullscreen() {
    let includedTables = ['invoices', 'supplier_invoices'];
    return includedTables.includes(this.tableName);
  }

  deleteRow(id: number) {
    let table;
    switch (this.tableName) {
      case 'supplier_invoices':
        table = 'stocked_items';
        break;

      default:
        table = 'invoiced_items';
        break;
    }
    this.formService.setSelectedTable(table);
    this.formService.setDeleteFormIds([id]);
    this.formService.showDeleteForm();
  }

  shouldDisplayItemWidget() {
    let includedTables = ['invoices', 'supplier_invoices'];
    return includedTables.includes(this.tableName);
  }
}
