import { Component } from '@angular/core';
import { DataService, imageUrlBase } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCloudUpload, faSpinner, faX, faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent {
  faCloudUpload = faCloudUpload;
  faSpinner = faSpinner;
  faX = faX;
  faAsterisk = faAsterisk;

  searchWaiting = false;

  imageUrlBase = imageUrlBase;

  editForm: FormGroup;
  mappedFormDataKeys: any;
  mappedFormData: Map<string, {value: any;
    inputType: string;
    dataType: string;
    required: boolean;
    fields: string;}> = new Map(); 

  formData: {
    [key: string]: {
      value: any;
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
    };
  } = {};
  tableName: string = '';
  id: string = '';
  formVisible = 'hidden';
  locked = false;
  loaded = false;

  file: File | null = null;
  fileName = '';
  
  imageReplacements: string[] = [];
  selectedImage: string = "";
  
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

  error: string | null = null;
  submitted = false;
  submissionEnded = false;
  
  alternativeSelectedData: { [key: string]: {selectData: string} } = {};
  selectedReplacementData: { [key:string]: {selectData: string, selectDataId: Number | null } | null} = {};
  selectedReplacementFilter: { [key:string]: {selectFilter: string } } = {};
  selectOpen: {[key: string]: {opened: boolean}} = {};


  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({});
  }

  ngOnInit() {
    this.formService.getEditFormVisibility().subscribe((visible) => {
      this.clearForm();
      this.formVisible = visible ? 'visible' : 'hidden';
      if (visible) {
        this.loadForm();
      }
    });
  }

  async loadForm() {
    if (this.formService.getSelectedId() != '') {
      this.formData = this.formService.getEditFormData();
      this.tableName = this.formService.getSelectedTable();
      this.id = this.formService.getSelectedId();
      this.buildForm();
      await this.handleImages();
      await this.replaceAmbiguousData();
    }
  }

  async replaceAmbiguousData() {
    if (Object.keys(this.formData).length != 0) {
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
        this.alternativeSelectedData[key] = { selectData: this.formData[key]?.value };
        this.selectOpen[key] = {opened: false};
      });
      Object.keys(this.replacementData).forEach((key) => {
        if (!Array.isArray(this.filteredReplacementData[key].data)) {
          this.filteredReplacementData[key].data = [this.filteredReplacementData[key].data];
        }

        if (this.filteredReplacementData[key].data.length > 0) {
          var tempReplacement = this.formData[key].value == null ? '' : this.filteredReplacementData[key].data.find((item: { id: number; data: string; }) => item.id === Number(this.formData[key].value))!.replacement;
          this.selectedReplacementData[key] = { selectData: tempReplacement, selectDataId: Number(this.formData[key].value) };
          this.selectedReplacementFilter[key] = { selectFilter: ''};
          this.selectOpen[key] = {opened: false};
        }
      });
      this.loaded = true;
    }
  }

  buildForm() {
    this.isLocked();
    
    let formDataArray = Object.entries(this.formData);
    formDataArray.sort((a: any, b: any) => a[1].inputType.localeCompare(b[1].inputType));
    formDataArray = this.checkForSensitiveData(formDataArray);

    this.mappedFormData = new Map(formDataArray);
    this.mappedFormDataKeys = Array.from(this.mappedFormData.keys());
    
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const field = this.formData[key];

        if (field.inputType == 'select' && field.dataType.startsWith('enum')) {
          const options = this.formService.deriveEnumOptions(field.dataType);
          this.selectData.push({ key: key, data: options });
        }
        if (field.inputType == 'file') {
          let fileName = this.mappedFormData.get('Image')?.value;
          this.selectedImage = fileName == null ? '' : fileName;
        }

        const validators = field.required ? [Validators.required] : [];

        if (this.editForm.contains(field.fields)) {
          this.editForm.get(field.fields)?.setValue(field.value);
        } else {
          this.editForm.addControl(
            field.fields,
            this.fb.control({ value: field.inputType == 'file' ? null : field.value, disabled: this.locked }, validators)
          );
        }
      }
    }
    this.editForm.addControl('action', this.fb.control('append'));
    this.editForm.addControl('id', this.fb.control(this.id));
    this.editForm.addControl('table_name', this.fb.control(this.tableName));
  }

  checkForSensitiveData(formDataArray: [string, {
    value: any;
    inputType: string;
    dataType: string;
    required: boolean;
    fields: string;}][])
  {
    formDataArray.forEach(subArray => {
      if (subArray[0] === "Password") {
        subArray[1].value = '';
      }
    });

    return formDataArray;
  }


  primeImage(event: any) {
    this.file = event.target.files[0];
  }

  async deleteImage(image: any) {
    let response = await lastValueFrom(this.dataService.processData("delete-image", image));
    if (response) {
      this.formService.setMessageFormData({
        title: 'Success!',
        message: 'Image deleted successfully. If this image was the products primary image, please select a new one and save.',
      });

      let id = this.getImageDependentId();

      this.imageReplacements = await this.formService.getImages(id, this.tableName);

      this.selectedImage = "";
      this.formService.showMessageForm();
    } else {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: response.message,
      });
      this.formService.showMessageForm();
    }
  }

  clearForm() {
    this.loaded = false;
    this.locked = false;
    this.selectedImage = "";
    this.imageReplacements = [];
    this.formData = {};
    this.replacementData = {};
    this.editForm = this.fb.group({});
    this.editForm.reset();
    this.submitted = false;
    this.submissionEnded = false;
    this.error = null;
    this.file = null;
  }

  async handleImages() {
    let id = this.getImageDependentId();

    if (id == null) {
      return;
    }

    this.imageReplacements = await this.formService.getImages(id, this.tableName);
    if (this.imageReplacements.length == 0) {
      return;
    }
    
    if (this.mappedFormData.get('Image')?.value != null) {
      this.imageReplacements.push(this.mappedFormData.get('Image')!.value);
    }
    
    this.imageReplacements = [...new Set(this.imageReplacements)];
  }

  async formSubmit(hideForm: boolean) {
    this.submitted = true;

    if (this.editForm.valid) {
      if (this.tableName != "categories") {
        const validationResult = this.imageSubmissionValidation();

        if (validationResult !== false && this.file != null) {
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
        this.editForm.get("image_file_name")?.setValue(this.file.name);
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

    if (this.file == null || this.editForm.get('image_file_name') == null) {
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

  async submitImageOnly() {
    const validationResult = this.imageSubmissionValidation();
    if (validationResult !== false) {
      let uploadResponse =  await this.formService.handleImageSubmissions(validationResult.id, validationResult.name, this.file as File, this.tableName);
      if (uploadResponse.success) {
        this.editForm.get('image_file_name')?.setValue(uploadResponse.imageFileName);
      }
    }
    this.submissionEnded = true;
  }  
  
  async submissionWithoutImage(hideForm: boolean) {
    let submissionResponse = await this.dataService.submitFormData(this.editForm.value);
    this.formService.setMessageFormData({
      title: submissionResponse.success ? 'Success!' : 'Error!',
      message: submissionResponse.message,
    });
    this.endSubmission(submissionResponse.success, hideForm);
  }

  async submissionWithImage(id: string, name: string, hideForm: boolean) {
    const uploadResponse = await this.formService.handleImageSubmissions(id, name, this.file as File, this.tableName);

    if (uploadResponse.success) {
      this.editForm.get('image_file_name')?.setValue(uploadResponse.imageFileName);
      const formSubmitResponse = await this.dataService.submitFormData(this.editForm.value)

      this.formService.setMessageFormData({
        title: formSubmitResponse.success ? 'Success!' : 'Error!',
        message: formSubmitResponse.message,
      });

      this.endSubmission(formSubmitResponse.success, hideForm);
    } else {
      hideForm && this.hide();
    }
  }

  getImageDependentId() {
    switch (this.tableName) {
      case "items":
        return this.editForm.value['retail_item_id'] != null ? this.editForm.value['retail_item_id'] : this.editForm.get('id')?.value;

      case "image_locations":
        return this.editForm.value['page_section_id'];
    }

    return null
  }

  getImageDependentName() {
    switch (this.tableName) {
      case "items":
        return this.editForm.get('item_name')?.value;

      case "image_locations":
        return this.selectedReplacementData['Page Section ID']?.selectData;
    }

    return null;
  }

  async addImageLocationToDatabase() {
    let imageFormData = {
      'action': 'add',
      'table_name': 'retail_item_images',
      'item_id': this.formService.getSelectedId(),
      'image_file_name': this.fileName
    };

    let insertResponse = await this.dataService.submitFormData(imageFormData);
    if (insertResponse.success) {
      this.formService.setMessageFormData({
        title: 'Success!',
        message: 'Image uploaded successfully as ' + this.fileName,
      });
    } else {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: insertResponse.message,
      });
    }
    this.formService.showMessageForm();
  }

  endSubmission(reset: boolean, hideForm: boolean) {
    hideForm && this.formService.showMessageForm();
    hideForm && this.hide();
    if (reset) {
      this.formService.requestReload();
      this.editForm.reset();
      this.alternativeSelectData = {};
      this.selectedReplacementData = {};
      this.submitted = false;
      this.editForm.get('action')?.setValue('add');
      this.editForm.get('table_name')?.setValue(this.tableName);
      this.error = null;
    }
    this.submissionEnded = true;
  }

  selectDataFromKey(key: string) {
    const matchingData = this.selectData.find((data) => data.key === key);

    if (matchingData) {
      return matchingData.data;
    }

    return [];
  }

  hide() {
    this.formService.hideEditForm();
  }

  async updateSelectedReplacementDataFromKey(dataId: Number, dataValue: string, key: string, field: string) {
    this.selectedReplacementData[key] = {selectData: dataValue, selectDataId: dataId};
    this.editForm.get(field)?.setValue(dataId);

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

  filterDropSelect(key: string, event: any, field: string | null) {
    this.selectedReplacementData[key];
    const filter = event.target.value;

    if (!this.searchWaiting && this.filteredReplacementData[key].data.length > 0) {
        this.searchWaiting = true;
        _.debounce(() => {
            this.filteredReplacementData = _.cloneDeep(this.replacementData);
            this.filteredReplacementData[key].data = this.replacementData[key].data.filter((data) => {
                return data.replacement && data.replacement.toLowerCase().includes(filter.toLowerCase());
            });
            if (field) {
                this.editForm.get(field)?.setValue(filter);
            }
            this.searchWaiting = false;
        }, 1000)();
    }
  }

  updateAlternativeSelectData(field: string, data: any, key: string) {
    this.alternativeSelectedData[key] = { selectData: data };
    this.editForm.get(field)?.setValue(data);
    this.selectOpen[key].opened = false;
  }

  isLocked() {
    switch (this.tableName) {
      case 'invoices':
        this.locked = this.formData['Status'].value == 'Complete';
    }
  }

  inputHasError(field: string) {
    return this.editForm.get(field)?.invalid && this.submitted;
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

  updateImageSelection(image: string) {
    this.selectedImage = image;    
  }

  canUploadImages() {
    switch (this.tableName) {
      case 'items':
      case 'image_locations':
        return true;
    }
    return false;
  }
}
