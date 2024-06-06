import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCheck, faCloudUpload, faSpinner, faX, faAsterisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent {
  faCloudUpload = faCloudUpload;
  faSpinner = faSpinner;
  faX = faX;
  faAsterisk = faAsterisk;
  faPlus = faPlus;
  faCheck = faCheck;

  searchWaiting = false;
  disabled = false;

  noCustomer = false;

  addForm: FormGroup;
  addInvoicedItemForm: FormGroup;

  mappedFormDataKeys: any;
  mappedFormData: Map<string, {value: any;
    inputType: string;
    dataType: string;
    required: boolean;
    fields: string;}> = new Map(); 
    
  formData: {
    [key: string]: {
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
      value: string
    };
  } = {};
  formVisible = 'hidden';
  tableName: string = '';

  file: File | null = null;
  fileName = '';

  selectData: { key: string; data: string[] }[] = [];

  filteredReplacementData: any = {};

  replacementData: {
    [key: string]: {
      data: { id: Number; replacement: string }[];
    }
  } = {};

  alternativeSelectData: {
    [key: string]: {
      data: {value: string}[]
    }
  } = {};

  itemData: any = [];

  invoiceDetails: any = [];

  addressNotListedKeys: string[] = [];
  addresses: {[key: string]: any } = {
    'Delivery Address': {
      line1: "",
      line2: "",
      line3: "",
      postcode: "",
      save: false
    },
    'Billing Address': {
      line1: "",
      line2: "",
      line3: "",
      postcode: "",
      save: false
    }
  };

  error: string | null = null;
  loaded = false;
  submitted = false;
  submissionEnded = false;
  invoiceCreated = false;

  debounceSearch: (key: string, filter: string, field: string | null) => void = _.debounce(
    (key: string, filter: string, field: string | null) => this.performSearch(key, filter, field),
    750
  );

  autoGeneratedReplacement: { [key: string]: {value: string} } = {};

  alternativeSelectedData: { [key: string]: {selectData: string} } = {};
  selectedReplacementData: { [key:string]: { selectData: string, selectDataId: Number | null } | null} = {};
  selectedReplacementFilter: { [key:string]: {selectFilter: string } } = {};
  selectOpen: {[key: string]: {opened: boolean}} = {};

  invoiceId: number | null = null;
  invoicedItemsList: any[] = [];

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
  ) {
    this.addForm = this.fb.group({});
    this.addInvoicedItemForm = this.fb.group({});
    this.debounceSearch = _.debounce(this.performSearch.bind(this), 1000);
  }

  ngOnInit() {
    this.formService.getAddFormVisibility().subscribe(async (visible) => {
      this.clearForm();
      this.formVisible = visible ? 'visible' : 'hidden';
      if (this.formVisible) {
        this.loadForm();
      }
    });
  }

  async loadForm() {
    this.clearForm();
    this.formData = this.formService.getAddFormData();
    this.tableName = this.formService.getSelectedTable();

    if (this.tableName !== '' && Object.keys(this.formData).length != 0 && !this.loaded) {
      this.buildForm();
      await this.isAutoGenerated();
      await this.replaceAmbiguousData();
      this.loaded = true;
    }
  }
  
  clearForm() {
    this.loaded = false;
    this.formData = {};
    this.replacementData = {};
    this.addForm = this.fb.group({});
    this.addForm.reset();
    this.addInvoicedItemForm = this.fb.group({})
    this.addInvoicedItemForm.reset();
    this.submitted = false;
    this.submissionEnded = false;
    this.error = null;
    this.file = null;
    this.invoicedItemsList = [];
    this.invoiceCreated = false;
    this.disabled = false;
    this.noCustomer = false;
    this.addressNotListedKeys = [];
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
      this.selectOpen[key] = {opened: false};
    });
    Object.keys(this.replacementData).forEach((key) => {
      if (!Array.isArray(this.filteredReplacementData[key].data)) {
        this.filteredReplacementData[key].data = [this.filteredReplacementData[key].data];
      }
      var tempReplacement = this.formData[key].value == null ? null : this.filteredReplacementData[key].data.find((item: { id: number; data: string; }) => item.id === Number(this.formData[key].value))?.replacement;
      this.selectedReplacementData[key] = { selectData: tempReplacement, selectDataId: Number(this.formData[key].value) };
      this.selectedReplacementFilter[key] = { selectFilter: ''};
      this.selectOpen[key] = {opened: false};
    });
  }

  async isAutoGenerated() {
    switch (this.tableName) {
      case "invoices":
        await this.replaceAutoGeneratedFields("title");
        break;

      case "suppliers":
        await this.replaceAutoGeneratedFields("account_code")
        break;
    }
    return false;
  }

  async replaceAutoGeneratedFields(field: string) {
    switch (field) {
      case "title":
        let nextInvoiceId = await lastValueFrom(this.dataService.processData("next-invoice-id", this.tableName));
        if (nextInvoiceId != null) {
          this.autoGeneratedReplacement[field] = {value: "INV" + nextInvoiceId};
          this.invoiceId = nextInvoiceId;
        }
        break;

      case "account_code":
        let nextSupplierAccountCode = await lastValueFrom(this.dataService.processData("next-supplier-account-code", this.tableName));
        if (nextSupplierAccountCode) {
          this.autoGeneratedReplacement[field] = {value: "S00-" + nextSupplierAccountCode};
        }
        break;
    }
  }

  async buildForm() {
    if (this.tableName == "invoices") {
      delete this.formData["Item ID"];
      this.addInvoicedItemForm = this.fb.group({
        item_id: ['', [Validators.required]],
        quantity: ['', [Validators.required]],
        discount: ['', [Validators.required]],
      });
    }

    let formDataArray = Object.entries(this.formData);
    formDataArray.sort((a: any, b: any) => a[1].inputType.localeCompare(b[1].inputType));
    this.mappedFormData = new Map(formDataArray);
    this.mappedFormDataKeys = Array.from(this.mappedFormData.keys());

    let index = 0;
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key) && this.formData[key].dataType != undefined) {
        const field = this.formData[key];
        
        let fieldValue = this.formService.getFieldValues(field.dataType, field.value);
        let characterLimit = this.formService.getCharacterLimit(field.dataType)
        
        let selectData = this.formService.getSelectDataOptions(field.dataType, field.inputType);
        if (selectData != null) {
          fieldValue = selectData[0];
          this.selectData.push({ key: key, data: selectData });
        }

        let controlValidators = characterLimit != null ? [Validators.maxLength(characterLimit)] : [];
        if (field.required) {
          controlValidators.push(Validators.required);
        }
        
        this.addForm.addControl(
          field.fields,
          this.fb.control({ value: fieldValue != null ? fieldValue : '', disabled: false }, controlValidators),
        );
      }
      index++;
    }

    this.addForm.addControl("action", this.fb.control("add"));
    this.addForm.addControl("table_name", this.fb.control(this.tableName));

    if (this.tableName == "invoices") {
      this.itemData = await lastValueFrom(this.dataService.processData("items_id_name_sku"));
    }
  }

  async formSubmit(hideForm: boolean) {
    this.submitted = true;
    if (this.addForm.valid) {
      if (this.tableName != "categories" && this.tableName != 'image_locations') {
        const validationResult = this.imageSubmissionValidation();

        if (validationResult !== false) {
          this.submissionWithImage(validationResult.id, validationResult.name, hideForm);
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
      const uploadResponse = await this.formService.uploadImage(this.file, this.file?.name);
      if (uploadResponse.success) {
        this.addForm.get("image_file_name")?.setValue(this.file.name);
        this.submissionWithoutImage(true);
      }
    } else {
      this.submissionWithoutImage(true);
    }
  }

  imageSubmissionValidation() {
    if (!this.canUploadImages()) {
      return false;
    }

    if (this.file == null || this.addForm.get('image_file_name') == null) {
      this.error = "Please choose an image to upload before trying to upload!";
      return false;
    }

    let id = this.getImageDependentId();
    let name = this.getImageDependentName();
    if (id == null || name == null) {
      this.error = "Please fill out the relevant fields to upload an image for before trying to upload!";
      return false;
    }

    return {id: id, name: name};
  }

  getImageDependentId() {
    switch (this.tableName) {
      case "items":
        return this.addForm.value['retail_item_id'] != null ? this.addForm.value['retail_item_id'] : this.addForm.get('id')?.value;

      case "image_locations":
        return this.addForm.value['page_section_id'];
    }

    return null
  }

  getImageDependentName() {
    switch (this.tableName) {
      case "items":
        return this.addForm.get('item_name')?.value;

      case "image_locations":
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
    const validationResult = this.imageSubmissionValidation();
    if (validationResult !== false) {
      await this.formService.handleImageSubmissions(validationResult.id, validationResult.name, this.file as File, this.tableName);
    }
  }

  async submissionWithoutImage(hideForm: boolean) {
    let submissionResponse = await this.dataService.submitFormData(this.addForm.value);
    this.formService.setMessageFormData({
      title: submissionResponse.success ? 'Success!' : 'Error!',
      message: submissionResponse.message,
    });
    this.endSubmission(submissionResponse.success, hideForm);
  }

  async submissionWithImage(id: string, name: string, hideForm: boolean) {
    const uploadResponse = await this.formService.handleImageSubmissions(id, name, this.file as File, this.tableName);

    if (uploadResponse.success) {
      this.addForm.get('image_file_name')?.setValue(uploadResponse.imageFileName);
      const formSubmitResponse = await this.dataService.submitFormData(this.addForm.value)

      this.formService.setMessageFormData({
        title: formSubmitResponse.success ? 'Success!' : 'Error!',
        message: formSubmitResponse.message,
      });

      this.endSubmission(formSubmitResponse.success, hideForm);
    } else {
      hideForm && this.hide();
    }
  }

  endSubmission(reset: boolean, hideForm: boolean) {
    this.formService.sync(this.addForm.value, 'add', this.tableName);
    if (this.tableName == "invoices") {
      this.invoiceCreated = true;
      this.disableControls();
    } else {
      !reset && this.formService.showMessageForm();
      hideForm && this.hide();
      if (reset) {
        this.formService.requestReload('hard');
        this.addForm.reset();
        this.alternativeSelectData = {};
        this.submitted = false;
        this.addForm.get('action')?.setValue('add');
        this.addForm.get('table_name')?.setValue(this.tableName);
        this.error = null;
      }
    }
    this.submissionEnded = true;
  }

  disableControls() {
    Object.keys(this.addForm.controls).forEach((controlKey: string) => {
      this.addForm.get(controlKey)?.disable();
    });
    this.disabled = true;
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
    this.formService.hideAddForm();
  }

  async updateSelectedReplacementDataFromKey(dataId: number, dataValue: string, key: string, field: string, alt: boolean) {
    this.selectedReplacementData[key] = { selectData: dataValue, selectDataId: dataId };
    if (alt) {
      this.addInvoicedItemForm.get(field)?.setValue(dataId);
    } else {
      this.addForm.get(field)?.setValue(dataId);
    }

    if (this.tableName == "invoices" && field == "customer_id") {
      let addresses = await lastValueFrom(this.dataService.processData("customer-addresses-by-id", String(dataId)));
      addresses = Array.isArray(addresses) ? addresses : [addresses];
      this.updateCustomerAddresses(addresses, "Delivery Address", 'address_id');
      this.updateCustomerAddresses(addresses, "Billing Address", 'billing_address_id');
    }

    if (this.tableName == "customer_payments" && field == "invoice_id") {
      this.invoiceDetails = await lastValueFrom(this.dataService.processData("invoice", dataId.toString()));
    }
    this.selectOpen[key].opened = false;
  }

  async updateCustomerAddresses(addressData: any, key: string, secondaryKey: string) {
    let addressReplacement = addressData.map((address: any) => {
      let replacement;
      if (key == "Delivery Address") {
        replacement = [address.delivery_address_one, address.delivery_address_two, address.delivery_address_three, address.delivery_address_four, address.delivery_postcode];
      } else {
        replacement = [address.invoice_address_one, address.invoice_address_two, address.invoice_address_three, address.invoice_address_four, address.invoice_postcode];
      }
      replacement = replacement.filter(component => component != null).join(' ');

      return {
        id: Number(address.id),
        replacement: replacement
      };
    });

    this.selectedReplacementData[key] = {
      selectData: addressReplacement[0].replacement,
      selectDataId: addressReplacement[0].id
    };

    this.addForm.get(secondaryKey)?.setValue(addressReplacement[0].id);
    
    this.replacementData[key].data = addressReplacement;
    this.filteredReplacementData[key].data = addressReplacement;
  }

  updateAddressValues(key: string, field: string, event: any): void {
    let value = event.target.value;
    this.addresses[key][field] = value;
  }

  async addAddressToBook(key: string) {
    let customerId = this.addresses[key]?.save == false ? null : this.addForm.get("customer_id")?.value;
    let secondaryKey = key == 'Billing Address' ? 'billing_address_id' : 'address_id';

    let payload = {
      invoice_address_one: this.addresses['Billing Address'].line1,
      invoice_address_two: this.addresses['Billing Address'].line2,
      invoice_address_three: this.addresses['Billing Address'].line3,
      invoice_postcode: this.addresses['Billing Address'].postcode,
      delivery_address_one: this.addresses['Delivery Address'].line1,
      delivery_address_two: this.addresses['Delivery Address'].line2,
      delivery_address_three: this.addresses['Delivery Address'].line3,
      delivery_postcode: this.addresses['Delivery Address'].postcode,
      customer_id: customerId,
      action: "add",
      table_name: "customer_address"
    };
    
    let response = await this.dataService.submitFormData(payload);
    if (response.success) {
      let id = response.id;

      this.addressNotListedKeys = this.addressNotListedKeys.filter(addressKey => addressKey != key);
      if (!this.noCustomer) {
        this.selectedReplacementData[key] = {
          selectData: [this.addresses[key].line1, this.addresses[key].line2, this.addresses[key].line3, this.addresses[key].postcode].join(' '),
          selectDataId: id
        };

        let replacement = {
          id: id,
          replacement: [this.addresses[key].line1, this.addresses[key].line2, this.addresses[key].line3, this.addresses[key].postcode].join(' ')
        };

        this.replacementData[key].data.push(replacement);
        this.addForm.get(secondaryKey)?.setValue(id);
      } else {
        let address = await lastValueFrom(this.dataService.processData('customer-addresses', id));
        await this.updateCustomerAddresses([address], key, secondaryKey);
        await this.updateSelectedReplacementDataFromKey(id, this.filteredReplacementData[key]!.data[this.filteredReplacementData[key].data.length - 1].replacement, key, key == 'Delivery Address' ? 'address_id' : 'billing_address_id', false);
      }
      
      this.resetAddresses();
    } else {
      this.formService.setMessageFormData({
        title: "Error!",
        message: "There was an issue adding the address to the address book!",
      });
    }
  }

  resetAddresses() {
    this.addresses = {
      'Delivery Address': {
        line1: "",
        line2: "",
        line3: "",
        postcode: "",
        save: false
      },
      'Billing Address': {
        line1: "",
        line2: "",
        line3: "",
        postcode: "",
        save: false
      }
    }
  }

  updateAlternativeSelectData(field: string, data: any, key: string) {
    this.alternativeSelectedData[key] = { selectData: data };
    this.addForm.get(field)?.setValue(data);
    this.selectOpen[key].opened = false;
  }

  filterDropSelect(key: string, event: any, field: string | null) {
    const filter = event.target.value || '';
    this.selectedReplacementData[key]!.selectData = filter;
  
    if (this.replacementData[key]?.data.length > 0) {
      this.debounceSearch(key, filter, field);
    }
  }

  performSearch(key: string, filter: string, field: string | null) {
    this.filteredReplacementData = _.cloneDeep(this.replacementData);
    this.filteredReplacementData[key].data = this.replacementData[key].data.filter((data: any) => {
      return data.replacement && data.replacement.toLowerCase().includes(filter.toLowerCase());
    });

    if (this.filteredReplacementData[key].data.length == 1) {
      this.selectedReplacementData[key] = {
        selectData: this.filteredReplacementData[key].data[0].replacement,
        selectDataId: this.filteredReplacementData[key].data[0].id
      };
      
      field != null && this.addForm.get(field.toString())?.setValue(this.filteredReplacementData[key].data[0].id)

      this.selectOpen[key].opened = false;
    }

    if (field) {
      this.addForm.get(field)?.setValue(filter);
    }
  }

  async addInvoicedItem(event: Event) {
    if (!this.invoiceCreated) {
      await this.formSubmit(false);
    }

    this.addInvoicedItemForm.addControl('action', this.fb.control('add'));
    this.addInvoicedItemForm.addControl('table_name', this.fb.control("invoiced_items"));
    this.addInvoicedItemForm.addControl('invoice_id', this.fb.control(this.invoiceId));

    let submissionResponse = await this.dataService.submitFormData(this.addInvoicedItemForm.value);
    if (!submissionResponse.success) {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: submissionResponse.message,
      });
      this.formService.showMessageForm();
    }

    this.invoicedItemsList = await lastValueFrom(this.dataService.collectDataComplex('invoiced-items', { 'id': this.invoiceId?.toString(), 'complex': true }));
    this.invoicedItemsList = Array.isArray(this.invoicedItemsList) ? this.invoicedItemsList : [this.invoicedItemsList];

    event.preventDefault();
    this.findInvalidControls();
  }

  addressNotListed(key: string) {
    this.submissionEnded = false;
    if (this.addForm.get('customer_id')?.value != '' || this.noCustomer) {
      this.addressNotListedKeys.push(key);
    } else {
      this.error = "Please select a customer first!";
      this.submissionEnded = true;
    }
  }

  disableCustomer() {
    this.noCustomer = true;
    this.addForm.get('customer_id')?.setValidators(null);
    this.addForm.get('customer_id')?.setValue(null);
    this.addressNotListed('Delivery Address');
    this.addressNotListed('Billing Address');
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
    return this.addForm.get(field)?.invalid && this.submitted;
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
    switch(this.tableName) {
      case "invoices":
        return !(key == "VAT" || key == "Total" || key == "Gross Value" || key == "Status" || key == "Printed" || key == "Paid" || key == "Outstanding Balance" || key == "Delivery Type" || key == "Type" || (key == "Customer Name" && this.noCustomer));

      case "items":
        return !(key == "Total Sold");
    }
    return true;
  }

  close() {
    this.formService.setMessageFormData({
      title: "Success",
      message: "Invoice saved successfully!"
    });
    this.formService.showMessageForm();
    this.hide();
  }

  fullscreen() {
    switch(this.tableName) {
      case "invoices":
      case "supplier_invoices":
        return true;
    }
    return false;
  }

  deleteRow(id: number) {
    this.formService.setSelectedTable('invoiced_items');
    this.formService.setDeleteFormIds([id]);
    this.formService.showDeleteForm();
  }
}
