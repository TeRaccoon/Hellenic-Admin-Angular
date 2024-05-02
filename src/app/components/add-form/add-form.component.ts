import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCheck, faCloudUpload, faSpinner, faX, faAsterisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import _, { add, replace } from 'lodash';

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

  error: string | null = null;
  loaded = false;
  submitted = false;
  submissionEnded = false;
  invoiceCreated = false;

  autoGeneratedReplacement: { [key: string]: {value: string} } = {};

  alternativeSelectedData: { [key: string]: {selectData: string} } = {};
  selectedReplacementData: { [key:string]: { selectData: string, selectDataId: Number | null } | null} = {};
  selectedReplacementFilter: { [key:string]: {selectFilter: string } } = {};
  selectOpen: {[key: string]: {opened: boolean}} = {};

  invoiceId: number | null = null;
  invoicedItemsList: {item_id: string, quantity: number}[] = [];

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
  ) {
    this.addForm = this.fb.group({});
    this.addInvoicedItemForm = this.fb.group({
      item_id: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      discount: ['', [Validators.required]],
    });
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
    }
  }

  async buildForm() {
    if (this.tableName == "invoices") {
      delete this.formData["Item ID"];
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
    let submissionResponse = await lastValueFrom(this.dataService.submitFormData(this.addForm.value));
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
      const formSubmitResponse = await lastValueFrom(this.dataService.submitFormData(this.addForm.value))

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
    this.formService.sync(this.addForm.value, 'add', this.tableName)
    !reset && this.formService.showMessageForm();
    hideForm && this.hide();
    if (reset) {
      this.formService.requestReload();
      this.addForm.reset();
      this.alternativeSelectData = {};
      this.submitted = false;
      this.addForm.get('action')?.setValue('add');
      this.addForm.get('table_name')?.setValue(this.tableName);
      this.error = null;
      if (this.tableName == "invoices") {
        this.invoiceCreated = true;
      }
    }
    this.submissionEnded = true;
  }

  primeImage(event: any) {
    this.file = event.target.files[0];
    console.log("🚀 ~ AddFormComponent ~ primeImage ~ this.addForm:", this.addForm)
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
      this.updateCustomerAddresses(addresses, "Delivery Address");
      this.updateCustomerAddresses(addresses, "Billing Address");
    }
    this.selectOpen[key].opened = false;
  }

  async updateCustomerAddresses(addressData: [], key: string) {
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
    this.replacementData[key].data = addressReplacement;
    this.filteredReplacementData[key].data = addressReplacement;
  }

  updateAlternativeSelectData(field: string, data: any, key: string) {
    this.alternativeSelectedData[key] = { selectData: data };
      this.addForm.get(field)?.setValue(data);
    this.selectOpen[key].opened = false;
  }

  filterDropSelect(key: string, event: any, field: string | null) {
    this.selectedReplacementData[key];
    var filter = event.target.value;

    if (!this.searchWaiting && this.filteredReplacementData[key].data.length > 0) {
      this.searchWaiting = true;
      setTimeout(() => {
        this.filteredReplacementData = _.cloneDeep(this.replacementData);
        this.filteredReplacementData[key].data = this.replacementData[key].data.filter((data) => {
          return data.replacement &&  data.replacement.toLowerCase().includes(filter.toLowerCase());
        });
        if (field) {
          this.addForm.get(field)?.setValue(filter);
        }
        this.searchWaiting = false;
      }, 1000);
    }
  }

  async addInvoicedItem(event: Event) {
    if (!this.invoiceCreated) {
      await this.formSubmit(false);
    }

    let itemIdNames = this.replacementData["Item ID"];
    
    let itemName = itemIdNames.data.find((data) => data.id == Number(this.addInvoicedItemForm.get("item_id")?.value))?.replacement;
    let quantity = this.addInvoicedItemForm.get("quantity")?.value;

    if (itemName != null && quantity != null) {
      this.invoicedItemsList.push({item_id: itemName, quantity: quantity});
    }

    this.addInvoicedItemForm.addControl('action', this.fb.control('add'));
    this.addInvoicedItemForm.addControl('table_name', this.fb.control("invoiced_items"));
    this.addInvoicedItemForm.addControl('invoice_id', this.fb.control(this.invoiceId));

    let submissionResponse = await lastValueFrom(this.dataService.submitFormData(this.addInvoicedItemForm.value));
    if (!submissionResponse.success) {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: submissionResponse.message,
      });
      this.formService.showMessageForm();
    }

    event.preventDefault();
    this.findInvalidControls();
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
        return !(key == "VAT" || key == "Total" || key == "Net Value");
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
        return true;
    }
    return false;
  }
}
