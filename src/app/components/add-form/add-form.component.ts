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
      if (visible) {
        this.loadForm();
      }
    });
  }

  async loadForm() {
    this.clearForm();
    this.formData = this.formService.getAddFormData();
    this.tableName = this.formService.getSelectedTable();
    if (this.tableName !== '' && Object.keys(this.formData).length != 0 && !this.loaded) {
      await this.replaceAmbiguousData();
      this.buildForm();
      await this.isAutoGenerated();
      this.loaded = true;
    }
  }
  
  clearForm() {
    this.loaded = false;
    this.formData = {};
    this.replacementData = {};
    this.addForm = this.fb.group({});
    this.addForm.reset();
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
      var tempReplacement = this.formData[key].value == null ? this.filteredReplacementData[key].data[0] : this.filteredReplacementData[key].data.find((item: { id: number; data: string; }) => item.id === Number(this.formData[key].value))?.replacement;
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
        let nextInvoiceId = await lastValueFrom(this.dataService.collectData("next-invoice-id", this.tableName));
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
      this.itemData = await lastValueFrom(this.dataService.collectData("items_id_name_sku"));
    }
  }

  async formSubmit(hideForm: boolean) {
    this.submitted = true;

    if (this.addForm.valid) {
      if (this.tableName != "categories") {
        const validationResult = this.imageSubmissionValidation();

        if (validationResult !== false) {
          this.submissionWithImage(validationResult.itemId, validationResult.itemName, hideForm);
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
    if ((this.file == null || this.tableName != 'items') && this.addForm.get('image_file_name') == null) {
      this.error = "Please choose an image to upload before trying to upload!";
      return false;
    }

    let itemId = this.addForm.value['retail_item_id'] != null ? this.addForm.value['retail_item_id'] : this.addForm.get('id')?.value;
    let itemName = this.addForm.get('item_name')?.value;

    if (itemName == null) {
      this.error = "Please choose an item to upload an image for before trying to upload!";
      return false;
    }

    return {itemId: itemId, itemName: itemName};
  }

  async submitImageOnly() {
    const validationResult = this.imageSubmissionValidation();
    if (validationResult !== false) {
      await this.formService.handleImageSubmissions(validationResult.itemId, validationResult.itemName, this.file as File);
    }
  }

  async submissionWithoutImage(hideForm: boolean) {
    let submissionResponse = await lastValueFrom(this.dataService.submitFormData(this.addForm.value));
    this.formService.setMessageFormData({
      title: submissionResponse.success ? 'Success!' : 'Error!',
      message: submissionResponse.message,
    });
    this.endSubmission(submissionResponse.success, hideForm);
    this.invoiceCreated = true;
  }

  async submissionWithImage(itemId: string, itemName: string, hideForm: boolean) {  
    let nextIdResult = await lastValueFrom(this.dataService.collectData("next-invoice-id", "items"));
    itemId = nextIdResult;

    let imageFileName = await this.formService.processImageName(null, itemName);

    this.addForm.get("image_file_name")?.setValue(imageFileName);

    const formSubmitResponse = await lastValueFrom(this.dataService.submitFormData(this.addForm.value))

    if (formSubmitResponse.success) {
      const uploadResponse = await this.formService.handleImageSubmissions(itemId, itemName, this.file as File);
      if (uploadResponse) {
        this.formService.setMessageFormData({
          title: formSubmitResponse.success ? 'Success!' : 'Error!',
          message: formSubmitResponse.message,
        });
        this.endSubmission(formSubmitResponse.success, hideForm);
      }
    } else {
      hideForm && this.hide();
    }
  }

  endSubmission(reset: boolean, hideForm: boolean) {
    hideForm && this.formService.showMessageForm();
    hideForm && this.hide();
    if (reset) {
      this.formService.requestReload();
      this.addForm.reset();
      this.alternativeSelectData = {};
      this.selectedReplacementData = {};
      this.submitted = false;
      this.addForm.get('action')?.setValue('add');
      this.addForm.get('table_name')?.setValue(this.tableName);
      this.error = null;
      this.invoicedItemsList = [];
    }
    this.submissionEnded = true;
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

  updateSelectedReplacementDataFromKey(dataId: Number, dataValue: string, key: string, field: string, alt: boolean) {
    this.selectedReplacementData[key] = { selectData: dataValue, selectDataId: dataId};
    if (alt) {
      this.addInvoicedItemForm.get(field)?.setValue(dataId);
    } else {
      this.addForm.get(field)?.setValue(dataId);
    }
    this.selectOpen[key].opened = false;
  }

  updateAlternativeSelectData(field: string, data: any, key: string) {
    this.alternativeSelectedData[key] = { selectData: data };
      this.addForm.get(field)?.setValue(data);
    this.selectOpen[key].opened = false;
  }

  filterDropSelect(key: string, event: any, field: string | null) {
    this.selectedReplacementData[key];
    var filter = event.target.value;

    setTimeout(() => {
      this.filteredReplacementData = _.cloneDeep(this.replacementData);

      this.filteredReplacementData[key].data = this.replacementData[key].data.filter((data) => {
        return data.replacement.toLowerCase().includes(filter.toLowerCase());
      });
      if (field) {
        this.addForm.get(field)?.setValue(filter);
      }
    }, 500);
  }

  async addInvoicedItem(event: Event) {
    if (!this.invoiceCreated) {
      this.formService.setMessageFormData({
        title: "Warning!",
        message: "Please create the invoice first before trying to add items!",
      });
      this.formService.showMessageForm();
      return;
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
}
