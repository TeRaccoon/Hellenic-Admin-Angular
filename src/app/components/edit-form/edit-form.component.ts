import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { formIcons } from '../../common/icons/form-icons';
import {
  settings,
  data,
  keyedData,
  keyedAddress,
  formState,
} from '../../common/types/forms/types';
import { Subscription } from 'rxjs';
import { UrlService } from '../../services/url.service';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent {
  private readonly subscriptions = new Subscription();

  icons = formIcons;

  searchWaiting = false;

  imageUrlBase;

  editForm: FormGroup;

  mappedFormDataKeys: any;
  mappedFormData: Map<string, data> = new Map();
  formData: keyedData = {};

  formSettings: settings = {
    showAddMore: false,
  };

  tableName: string = '';
  id: string = '';

  file: File | null = null;
  fileName = '';

  imageReplacements: string[] = [];
  selectedImage: string = '';

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

  invoiceDetails: any = [];

  addressNotListedKeys: string[] = [];
  addresses: keyedAddress;

  formState!: formState;

  debounceSearch: (
    key: string,
    filter: string,
    field: string | null,
    text: boolean | null
  ) => void = _.debounce(
    (key: string, filter: string, field: string | null, text = false) =>
      this.performSearch(key, filter, field, text),
    750
  );

  alternativeSelectedData: { [key: string]: { selectData: string } } = {};
  selectedReplacementData: {
    [key: string]: { selectData: string; selectDataId: Number | null } | null;
  } = {};
  selectedTextReplacementData: { [key: string]: string } = {};
  selectedReplacementFilter: { [key: string]: { selectFilter: string } } = {};
  selectOpen: { [key: string]: { opened: boolean } } = {};

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
    private urlService: UrlService
  ) {
    this.imageUrlBase = this.urlService.getUrl('uploads');

    this.editForm = this.fb.group({});
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

    this.debounceSearch = _.debounce(this.performSearch.bind(this), 1000);
  }

  ngOnInit() {
    this.subscriptions.add(
      this.formService.getEditFormVisibility().subscribe((visible) => {
        this.clearForm();
        this.formState.visible = visible ? 'visible' : 'hidden';
        if (visible) {
          this.loadForm();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  resetFormState(): void {
    this.formState = {
      loaded: false,
      submissionAttempted: false,
      submitted: false,
      error: null,
      locked: false,
      visible: 'hidden',
      imageUploaded: false,
    };
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
        this.dataService,
        'edit'
      );
      this.formData = data.formData;
      this.filteredReplacementData = data.replacementData;
      this.replacementData = data.replacementData;
      this.alternativeSelectData = this.formService.getAlternativeSelectData();
      Object.keys(this.alternativeSelectData).forEach((key) => {
        this.alternativeSelectedData[key] = {
          selectData: this.formData[key]?.value,
        };
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
              ? ''
              : this.filteredReplacementData[key].data.find(
                  (item: { id: number; data: string }) =>
                    item.id === Number(this.formData[key].value)
                )!.replacement;
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
          this.selectedTextReplacementData[key] = this.formData[key].value;
          this.selectOpen[key] = { opened: false };
        }
      });

      if (this.tableName == 'invoices') {
        let customerId = this.editForm.get('customer_id')?.value;
        if (customerId != null) {
          let addresses = await this.dataService.processGet(
            'customer-addresses-by-id',
            { filter: customerId.toString() },
            true
          );
          this.updateCustomerAddresses(addresses, 'Delivery Address');
          this.updateCustomerAddresses(addresses, 'Billing Address');
        }
      }

      if (this.tableName == 'customer_payments') {
        let invoiceId = this.editForm.get('invoice_id')?.value;
        if (invoiceId != null) {
          this.invoiceDetails = await this.dataService.processGet('invoice', {
            filter: invoiceId.toString(),
          });
        }
      }

      this.formState.loaded = true;
    }
  }

  async buildForm() {
    this.isLocked();

    let formDataArray = Object.entries(this.formData);
    formDataArray.sort((a: any, b: any) =>
      a[1].inputType.localeCompare(b[1].inputType)
    );
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

        if (this.editForm.contains(field.field)) {
          this.editForm.get(field.field)?.setValue(field.value);
        } else {
          this.editForm.addControl(
            field.field,
            this.fb.control(
              {
                value: field.inputType == 'file' ? null : field.value,
                disabled: this.formState.locked,
              },
              validators
            )
          );
        }
      }
    }

    this.editForm.addControl('action', this.fb.control('append'));
    this.editForm.addControl('id', this.fb.control(this.id));
    this.editForm.addControl('table_name', this.fb.control(this.tableName));
  }

  checkForSensitiveData(
    formDataArray: [
      string,
      {
        value: any;
        inputType: string;
        dataType: string;
        required: boolean;
        field: string;
      }
    ][]
  ) {
    formDataArray.forEach((subArray) => {
      if (subArray[0] === 'Password') {
        subArray[1].value = '';
      }
    });

    return formDataArray;
  }

  primeImage(event: any) {
    this.file = event.target.files[0];
  }

  async deleteImage(image: any) {
    let response = await this.dataService.processGet('delete-image', {
      filter: image,
    });
    if (response) {
      this.formService.setMessageFormData({
        title: 'Success!',
        message:
          'Image deleted successfully. If this image was the products primary image, please select a new one and save.',
      });

      let id = this.getImageDependentId();

      this.imageReplacements = await this.formService.getImages(
        id,
        this.tableName
      );

      this.selectedImage = '';
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
    this.selectedImage = '';
    this.imageReplacements = [];
    this.formData = {};
    this.replacementData = {};
    this.editForm = this.fb.group({});
    this.editForm.reset();
    this.resetFormState();
    this.file = null;
    this.invoiceDetails = [];
  }

  async handleImages() {
    let id = this.getImageDependentId();

    if (id == null) {
      return;
    }

    this.imageReplacements = await this.formService.getImages(
      id,
      this.tableName
    );
    if (this.imageReplacements.length == 0) {
      return;
    }

    if (this.mappedFormData.get('Image')?.value != null) {
      this.imageReplacements.push(this.mappedFormData.get('Image')!.value);
    }

    this.imageReplacements = [...new Set(this.imageReplacements)];
  }

  async formSubmit(hideForm: boolean) {
    this.formState.submissionAttempted = true;

    if (this.editForm.valid) {
      if (this.tableName != 'categories') {
        const validationResult = this.imageSubmissionValidation();

        if (validationResult !== false && this.file != null) {
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
        this.editForm.get('image_file_name')?.setValue(this.file.name);
        this.submissionWithoutImage(true);
      }
    } else {
      this.submissionWithoutImage(true);
    }
  }

  imageSubmissionValidation() {
    if (!this.canUploadImages() || this.formState.imageUploaded) {
      return false;
    }

    if (this.file == null || this.editForm.get('image_file_name') == null) {
      this.formState.error =
        'Please choose an image to upload before trying to upload!';
      return false;
    }

    let id = this.getImageDependentId();
    let name = this.getImageDependentName();
    if (id == null || name == null) {
      this.formState.error =
        'Please fill out the relevant fields to upload an image for before trying to upload!';
      return false;
    }

    return { id: id, name: name };
  }

  async submitImageOnly() {
    const validationResult = this.imageSubmissionValidation();
    if (validationResult !== false) {
      let uploadResponse = await this.formService.handleImageSubmissions(
        validationResult.id,
        validationResult.name,
        this.file as File,
        this.tableName
      );
      if (uploadResponse.success) {
        this.editForm
          .get('image_file_name')
          ?.setValue(uploadResponse.imageFileName);
      }
    }
    this.formState.submitted = true;
    this.formState.imageUploaded = true;
  }

  async submissionWithoutImage(hideForm: boolean) {
    let submissionResponse = await this.dataService.submitFormData(
      this.editForm.value
    );
    this.formService.setMessageFormData({
      title: submissionResponse.success ? 'Success!' : 'Error!',
      message: submissionResponse.message,
    });
    this.endSubmission(submissionResponse.success, hideForm);
  }

  async submissionWithImage(id: string, name: string, hideForm: boolean) {
    const uploadResponse = await this.formService.handleImageSubmissions(
      id,
      name,
      this.file as File,
      this.tableName
    );

    if (uploadResponse.success) {
      this.editForm
        .get('image_file_name')
        ?.setValue(uploadResponse.imageFileName);
      const formSubmitResponse = await this.dataService.submitFormData(
        this.editForm.value
      );

      this.formService.setMessageFormData({
        title: formSubmitResponse.success ? 'Success!' : 'Error!',
        message: formSubmitResponse.message,
      });

      this.endSubmission(
        formSubmitResponse.success,
        hideForm && formSubmitResponse.success
      );
    } else {
      hideForm && this.hide();
    }
  }

  getImageDependentId() {
    switch (this.tableName) {
      case 'items':
        return this.editForm.value['retail_item_id'] != null
          ? this.editForm.value['retail_item_id']
          : this.editForm.get('id')?.value;

      case 'image_locations':
        return this.editForm.value['page_section_id'];
    }

    return null;
  }

  getImageDependentName() {
    switch (this.tableName) {
      case 'items':
        return this.editForm.get('item_name')?.value;

      case 'image_locations':
        return this.selectedReplacementData['Page Section ID']?.selectData;
    }

    return null;
  }

  async addImageLocationToDatabase() {
    let imageFormData = {
      action: 'add',
      table_name: 'retail_item_images',
      item_id: this.formService.getSelectedId(),
      image_file_name: this.fileName,
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
      this.formService.requestReload('hard');
      this.editForm.reset();
      this.alternativeSelectData = {};
      this.selectedReplacementData = {};
      this.formState.submissionAttempted = false;
      this.editForm.get('action')?.setValue('add');
      this.editForm.get('table_name')?.setValue(this.tableName);
      this.formState.error = null;
    }
    this.formState.submitted = true;
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

  async updateSelectedReplacementDataFromKey(
    dataId: Number,
    dataValue: string,
    key: string,
    field: string
  ) {
    this.selectedReplacementData[key] = {
      selectData: dataValue,
      selectDataId: dataId,
    };
    this.editForm.get(field)?.setValue(dataId);

    if (this.tableName == 'invoices' && field == 'customer_id') {
      let addresses = await this.dataService.processGet(
        'customer-addresses-by-id',
        { filter: dataId.toString() },
        true
      );
      this.updateCustomerAddresses(addresses, 'Delivery Address');
      this.updateCustomerAddresses(addresses, 'Billing Address');
    } else if (this.tableName == 'customer_payments' && field == 'invoice_id') {
      this.invoiceDetails = await this.dataService.processGet('invoice', {
        filter: dataId.toString(),
      });
      this.selectOpen[key].opened = false;
    }
  }

  updateSelectedTextReplacementDataFromKey(
    value: string,
    key: string,
    field: string
  ) {
    this.editForm.get(field)?.setValue(value);
    this.selectedTextReplacementData[key] = value;
    this.selectOpen[key].opened = false;
  }

  async updateCustomerAddresses(addressData: any, key: string) {
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

    this.replacementData[key].data = addressReplacement;
    this.filteredReplacementData[key].data = addressReplacement;
  }

  updateAddressValues(key: string, field: string, event: any): void {
    let value = event.target.value;
    this.addresses[key] = { ...this.addresses[key], [field]: value };
  }

  async addAddressToBook(key: string) {
    let customerId =
      this.addresses[key].save == false
        ? null
        : this.editForm.get('customer_id')?.value;
    let secondaryKey =
      key == 'Billing Address' ? 'billing_address_id' : 'address_id';

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
      action: 'add',
      table_name: 'customer_address',
    };

    let response = await this.dataService.submitFormData(payload);
    if (response.success) {
      let id = response.id;

      this.addressNotListedKeys = this.addressNotListedKeys.filter(
        (addressKey) => addressKey != key
      );
      if (this.editForm.get('customer_id')?.value != null) {
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
        this.editForm.get(secondaryKey)?.setValue(id);
      } else {
        let address = await this.dataService.processGet('customer-addresses', {
          filter: id,
        });
        await this.updateCustomerAddresses([address], key);
        await this.updateSelectedReplacementDataFromKey(
          id,
          this.filteredReplacementData[key]!.data[
            this.filteredReplacementData[key].data.length - 1
          ].replacement,
          key,
          key == 'Delivery Address' ? 'address_id' : 'billing_address_id'
        );
      }
    } else {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: 'There was an issue adding the address to the address book!',
      });
    }
  }

  addressNotListed(key: string) {
    this.formState.submitted = false;
    if (this.editForm.get('customer_id')?.value != '') {
      this.addressNotListedKeys.push(key);
    } else {
      this.formState.error = 'Please select a customer first!';
      this.formState.submitted = true;
    }
  }

  filterDropSelect(key: string, event: any, field: string | null) {
    const filter = event.target.value || '';
    if (this.selectedReplacementData[key]?.selectData != null) {
      this.selectedReplacementData[key]!.selectData = filter;

      if (this.replacementData[key]?.data.length > 0) {
        this.debounceSearch(key, filter, field, false);
      }
    }
  }

  filterTextDropSelect(key: string, event: any, field: string) {
    const filter = event.target.value || '';
    this.editForm.get(field)?.setValue(filter);
    if (this.selectedTextReplacementData[key] != null) {
      this.selectedTextReplacementData[key] = filter;

      if (this.replacementData[key]?.data.length > 0) {
        this.debounceSearch(key, filter, null, true);
      }
    }
  }

  performSearch(
    key: string,
    filter: string,
    field: string | null,
    text: boolean | null = false
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
      } else {
        this.selectedReplacementData[key] = {
          selectData: this.filteredReplacementData[key].data[0].replacement,
          selectDataId: this.filteredReplacementData[key].data[0].id,
        };
      }
      this.selectOpen[key].opened = false;
    }

    if (field) {
      this.editForm.get(field)?.setValue(filter);
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
        this.formState.locked = this.formData['Status'].value == 'Complete';
    }
  }

  inputHasError(field: string) {
    return (
      this.editForm.get(field)?.invalid && this.formState.submissionAttempted
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

  updateImageSelection(image: string) {
    this.selectedImage = image;
  }

  canUploadImages() {
    switch (this.tableName) {
      case 'items':
      case 'image_locations':
      case 'categories':
        return true;
    }
    return false;
  }
}
